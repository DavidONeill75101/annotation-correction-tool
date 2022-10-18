import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import bioc
import mysql.connector
import os
import re

from spans_and_trees import treeToSpans, spansToPassages

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def main():
    parser = argparse.ArgumentParser('Integrate a BioC file with annotations into a DB')
    parser.add_argument('--inBioc',required=True,type=str,help='Input BioC file')
    args = parser.parse_args()
    
    database_settings = re.match(r'^mysql://(.+?):(.*?)@(.+?):(\d+?)/(.+)$',os.environ['DATABASE_URL'])
    con = mysql.connector.connect(
        user=database_settings.group(1),
        password=database_settings.group(2),
        host=database_settings.group(3),
        port=database_settings.group(4),
        database=database_settings.group(5)
    )
    cur = con.cursor()
                
    externalid_to_entityid = {}
    cur.execute('SELECT id,externalId FROM entity')
    for row in cur.fetchall():
        entityId,externalId = row
        externalid_to_entityid[externalId] = entityId
        
    annotation_records = []
    
    annotationBotId = 99999
    
    with open(args.inBioc,'rb') as f:
        parser = bioc.biocxml.BioCXMLDocumentReader(f)
        for doc in parser:
            documentId = doc.infons['documentId']
        
            for passage in doc.passages:
                for a in passage.annotations:
                    externalId = a.infons['externalId']
                    
                    assert externalId in externalid_to_entityid
                        
                    entityId = externalid_to_entityid[externalId]
                    
                    loc = a.locations[0]
                    start = loc.offset
                    end = loc.offset + loc.length
                    annotation_record = (start,end,entityId,documentId,annotationBotId)
                    annotation_records.append(annotation_record)
        
    print("Removing previous annotations")
    cur.execute('DELETE FROM entityannotation')
        
    print(f"Inserting {len(annotation_records)} annotations")
    for chunk in chunks(annotation_records, 1000):
        cur.executemany('INSERT INTO entityannotation(start,end,entityId,documentId,userId) values (%s,%s,%s,%s,%s)', chunk)
        
    con.commit()
    print("Done")
    
if __name__ == '__main__':
    main()
    