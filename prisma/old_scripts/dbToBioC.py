import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import bioc
import mysql.connector
import os
import re

from spans_and_trees import treeToSpans, spansToPassages

def documentToSentencesWithAnnotations(input_doc):
    sentence_doc = bioc.BioCDocument()
    sentence_doc.id = input_doc.id
    sentence_doc.infons = dict(input_doc.infons)
    
    for passage in input_doc.passages:
    
        anno_tree = IntervalTree()
        for anno in passage.annotations:
            if anno.infons['userId']: # Exclude automated annotations (without a user)
                start = anno.locations[0].offset
                end = anno.locations[0].offset + anno.locations[0].length
                anno_tree.addi(start,end,anno)
            
        for sentence in passage.sentences:
            start = sentence.offset
            end = start + sentence.infons['length']
            
            annos = [ a.data for a in anno_tree[start:end] ]
                        
            if len(annos) > 0:
                sentence_passage = bioc.BioCPassage()
                sentence_passage.infons['sentenceId'] = sentence.infons['id']
                sentence_passage.offset = start
                sentence_passage.text = passage.text[(start-passage.offset):(end-passage.offset)]
                sentence_passage.annotations = annos
                
                sentence_doc.add_passage(sentence_passage)
                
    return sentence_doc

def main():
    parser = argparse.ArgumentParser('Dump the database to BioC for processing')
    parser.add_argument('--sentencesWithAnnotations',action='store_true',help='Output sentences that contain annotations')
    parser.add_argument('--outBioc',required=True,type=str,help='Output BioC file')
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
    
    documents = {}
    cur.execute('SELECT id,pmid,pmcid,contents,formatting_json FROM document')
    for row in cur.fetchall():
        documentId,pmid,pmcid,contents,formatting_json = row
        formatting = json.loads(formatting_json)
        
        documents[documentId] = {'pmid':pmid, 'pmcid':pmcid, 'contents':contents, 'formatting':formatting, 'annotations':[], 'sentences':[]}
        
    cur.execute('SELECT id,documentId,start,end FROM sentence')
    for row in cur.fetchall():
        sentenceId,documentId,start,end = row
        documents[documentId]['sentences'].append( {'sentenceId':sentenceId,'start':start,'end':end} )
        
    entities = {}
    cur.execute('SELECT e.id,e.externalId,e.name,et.name FROM entity e, entitytype et WHERE e.entityTypeId = et.id')
    for row in cur.fetchall():
        entityId,externalId,name,entity_type = row
        entities[entityId] = {'name':name, 'type':entity_type, 'externalId':externalId}
        
    cur.execute('SELECT id,start,end,documentId,entityId,userId FROM entityannotation')
    for row in cur.fetchall():
        annotationId,start,end,documentId,entityId,userId = row
        
        userId = userId if userId else ''
        
        entity = dict(entities[entityId])
        entity['userId'] = userId
        anno = [start, end-start, 'Annotation', entity]
        documents[documentId]['annotations'].append(anno)
        
    writer = bioc.biocxml.BioCXMLDocumentWriter(args.outBioc)
    for documentId,document in documents.items():
        bioc_doc = bioc.BioCDocument()
        bioc_doc.infons = {'documentId':documentId, 'pmid':document['pmid'], 'pmcid':document['pmcid']}
        bioc_doc.id = documentId
        currentID = 1
    
        spans = document['formatting'] + document['annotations']
        
        sentence_tree = IntervalTree()
        for sentence in document['sentences']:
            assert len(sentence_tree[sentence['start']:sentence['end']]) == 0
            sentence_tree.addi(sentence['start'],sentence['end'],sentence['sentenceId'])
        
        passages = spansToPassages(document['contents'], spans)
        for passage in passages:
            bioc_passage = bioc.BioCPassage()
            bioc_passage.text = passage['text']
            bioc_passage.offset = passage['start']
            
            for interval in sentence_tree[passage['start']:passage['end']]:
                
                bioc_sentence = bioc.BioCSentence()
                bioc_sentence.infons['id'] = interval.data
                bioc_sentence.offset = interval.begin
                bioc_sentence.infons['length'] = interval.end - interval.begin
                
                bioc_passage.add_sentence(bioc_sentence)
            
            for anno in passage['annotations']:
                #start,end,tag,attribs = anno
                start,end = anno['start'],anno['end']
                print(anno)
                
                a = bioc.BioCAnnotation()
                a.text = bioc_passage.text[(start-passage['start']):(end-passage['start'])]
                a.infons = anno['attrib']
                a.id = 'T%d' % currentID
                currentID += 1

                if end < start:
                    continue

                bioc_loc = bioc.BioCLocation(offset=start, length=(end-start))
                a.locations.append(bioc_loc)
                
                bioc_passage.annotations.append(a)
                
            #if passage['annotations']:
            #    print(passage)
                
            bioc_doc.add_passage(bioc_passage)
                
                
        if args.sentencesWithAnnotations:
            bioc_doc = documentToSentencesWithAnnotations(bioc_doc)
            
        writer.write_document(bioc_doc)
    
    
    
if __name__ == '__main__':
    main()
    