import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json

from spans_and_trees import treeToSpans

def main():
    parser = argparse.ArgumentParser('Insert a test document into the database')
    parser.add_argument('--doc',required=True,type=str,help='Document to input')
    parser.add_argument('--output',required=True,type=str,help='Output file')
    args = parser.parse_args()
    
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
    text, spans = treeToSpans(body)
    
    example_entity = {
        'name': 'Medicine',
        'type': 'Biomedical Occupation or Discipline',
        'definition': 'The art and science of studying, performing research on, preventing, diagnosing, and treating disease, as well as the maintenance of health.',
        'cui': 'C0025118'
    }
    
    example_word = 'medicine'
    example_location = text.index(example_word)
    example_anno = {
        'start':example_location,
        'end':example_location+len(example_word),
        'entity':{'create':example_entity}
    }
    
    doc = { 'contents':text, 'pmid':pmid, 'pmcid':pmcid, 'formatting_json':json.dumps(spans), 'annotations':{'create':[example_anno]} }
    
    with open(args.output,'w',encoding='utf8') as f:
        json.dump(doc,f,indent=2)
    print("Done")

if __name__ == '__main__':
    main()