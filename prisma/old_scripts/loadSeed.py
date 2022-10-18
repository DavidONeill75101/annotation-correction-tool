import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import sqlite3

from spans_and_trees import treeToSpans

def insert(cur, table, record):
    columns = ",".join(record.keys())
    question_marks = ",".join( '?' for _ in record )
    sql = f"INSERT INTO {table}({columns}) VALUES ({question_marks})"
    print(sql)
    cur.execute(sql, tuple(record.values()))

def main():
    parser = argparse.ArgumentParser('Insert a test document into the database')
    parser.add_argument('--doc',required=True,type=str,help='Document to input')
    parser.add_argument('--db',required=True,type=str,help='SQLite database')
    args = parser.parse_args()
    
    con = sqlite3.connect(args.db)
    cur = con.cursor()
    
    cur.execute('DELETE FROM Document')
    #cur.execute('DELETE FROM Entity')
    #cur.execute('DELETE FROM EntitySynonym')
    cur.execute('DELETE FROM EntityAnnotation')
    cur.execute('DELETE FROM RelationType')
    cur.execute('DELETE FROM RelationAnnotation')
    
    tree = etree.parse(args.doc)
    root = tree.getroot()
    print(root)
    
    articles = [ article for article in root.iter('article') ]
    assert len(articles) == 1
    article = articles[0]
    
    article_id_elems = article.findall("./front/article-meta/article-id") + article.findall("./front-stub/article-id")
    
    article_ids = { e.attrib["pub-id-type"]:e.text.strip().replace("\n", " ") for e in article_id_elems if e.text and "pub-id-type" in e.attrib }
    print(article_ids)
    
    pmid = int(article_ids['pmid'])
    pmcid = int(article_ids['pmcid'].replace('PMC',''))
    
    body = article.find("./body")
    
    body = etree.fromstring("<div><p>This study focuses on estrogen-receptor positive breast cancer.</p></div>")
    
    body = etree.fromstring("<div><p>We outlined the genetics of oligodendroglioma and showed that NPAS3 is a tumor suppressor in astrocytoma.</p></div>")
    
    text, spans = treeToSpans(body)
    
    doc = { 
        'id': 1, 
        'contents':text, 
        'pmid':pmid, 
        'pmcid':pmcid, 
        'formatting_json':json.dumps(spans) }
    
    insert(cur, 'Document', doc)
    
        
    example_relation_type1 = {
        'id': 1,
        'name': "Tumor Suppressor",
        'description': "A gene that helps control cell growth. Mutations (changes in DNA) in tumor suppressor genes may lead to cancer. [NCI]"
    }
    
    example_relation_type2 = {
        'id': 2,
        'name': "Driver Gene",
        'description': "A gene that contains driver mutations that cause cells to become cancer cells and grow and spread in the body. [NCI]"
    }
    
    example_relation_type3 = {
        'id': 3,
        'name': "Oncogene",
        'description': "A gene that is a mutated (changed) form of a gene involved in normal cell growth. Oncogenes may cause the growth of cancer cells. [NCI]"
    }
    
    insert(cur, 'RelationType', example_relation_type1)
    insert(cur, 'RelationType', example_relation_type2)
    insert(cur, 'RelationType', example_relation_type3)
    
    if False:
        example_entity1 = {
            'id': 1,
            'name': 'Medicine',
            'type': 'Biomedical Occupation or Discipline',
            'description': 'The art and science of studying, performing research on, preventing, diagnosing, and treating disease, as well as the maintenance of health.',
            'externalId': 'CUI:C0025118'
        }
        
        example_word1 = 'managing'
        example_location1 = text.index(example_word1)
        example_entity_anno1 = {
            'id':1,
            'start':example_location1,
            'end':example_location1+len(example_word1),
            'entityId': 1,
            'documentId': 1
        }
        
        example_word2 = 'biomedical knowledge base'
        example_location2 = text.index(example_word2)
        example_entity_anno2 = {
            'id':2,
            'start':example_location2,
            'end':example_location2+len(example_word2),
            'entityId': 1,
            'documentId': 1
        }
        
        example_relation_anno = {
            'id': 1,
            'documentId': 1,
            'relationTypeId': 1,
            'srcId': 1,
            'dstId': 2
        }
        
        insert(cur, 'Entity', example_entity1)
        insert(cur, 'EntityAnnotation', example_entity_anno1)
        insert(cur, 'EntityAnnotation', example_entity_anno2)
        
        insert(cur, 'RelationAnnotation', example_relation_anno)
        
    con.commit()
    
    print("Done")

if __name__ == '__main__':
    main()