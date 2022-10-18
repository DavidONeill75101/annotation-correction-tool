import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import sqlite3
import tarfile
from tqdm import tqdm
from Bio import Entrez
import spacy
import re
import os
import gzip

import mysql.connector

from spans_and_trees import treeToSpans, spansToPassages

def insert(cur, table, record):
    columns = ",".join(record.keys())
    question_marks = ",".join( '%s' for _ in record )
    sql = f"INSERT INTO {table}({columns}) VALUES ({question_marks})"
    cur.execute(sql, tuple(record.values()))
    
def insert_pubmed_article(cur, nlp, document_id, article_elem):
    pmid_elem = article_elem.find("./MedlineCitation/PMID")
    assert pmid_elem is not None
    pmid = int(pmid_elem.text)
    
    pmc_elems = article_elem.findall("./PubmedData/ArticleIdList/ArticleId[@IdType='pmc']")
    assert len(pmc_elems) <= 1, "Found more than one PMCID with PMID: %s" % pmid
    pmcid = pmc_elems[0].text if len(pmc_elems) == 1 else None
        
    #############
    # Get title #
    #############
    
    title_elems = article_elem.findall("./MedlineCitation/Article/ArticleTitle")
    assert len(title_elems) == 1
    title_elem = title_elems[0]
    title_elem.tag = 'article-title'
    
    title_text,_ = treeToSpans(title_elem)
    
    ################
    # Get abstract #
    ################
    
    abstract_elems = article_elem.findall("./MedlineCitation/Article/Abstract/AbstractText")
    
    outer_abstract_elem = etree.Element('div')
    for abstract_elem in abstract_elems:
        subabstract_elem = etree.Element('div')
        if 'Label' in abstract_elem.attrib:
            label = abstract_elem.attrib['Label'].capitalize()
        
            abstract_label_elem2 = etree.Element('abstract-label') # TODO: Fix formatting of abstract section labels
            abstract_label_elem2.text = label+":" # https://pubmed.ncbi.nlm.nih.gov/1279184 for example
            
            abstract_label_elem1 = etree.Element('div')
            subabstract_elem.append(abstract_label_elem2)
                
            subabstract_elem.append(abstract_label_elem1)
            subabstract_elem.append(abstract_elem)
        else:
            subabstract_elem = abstract_elem
        
        outer_abstract_elem.append(subabstract_elem)
    
    ####################################
    # Stitch title & abstract together #
    ####################################
    
    root = etree.Element('div')
    root.append(title_elem)
    root.append(outer_abstract_elem)
    
    text, spans = treeToSpans(root)
    
    doc = { 
        'id': document_id,
        'pmid':pmid, 
        'pmcid':pmcid, 
        'isFullText': False,
        'title':title_text,
        'contents':text, 
        'formatting_json':json.dumps(spans) }
    
    insert(cur, 'document', doc)
    
    #######################
    # Splitting sentences #
    #######################
    
    passages = spansToPassages(text, spans)
        
    sentences = []
    for passage in passages:
        passage_offset = passage['start']
        parsed = nlp(passage['text'])
        
        for tokens in parsed.sents:
            start = tokens[0].idx + passage_offset
            end = tokens[-1].idx + len(tokens[-1].text) + passage_offset
            sentence = {'documentId':document_id, 'start':start, 'end':end}
            insert(cur, 'sentence', sentence)
    
def insert_pmc_article(cur, nlp, document_id, article_elem):
    article_id_elems = article_elem.findall("./front/article-meta/article-id") + article_elem.findall("./front-stub/article-id")
    article_ids = { e.attrib["pub-id-type"]:e.text.strip().replace("\n", " ") for e in article_id_elems if e.text and "pub-id-type" in e.attrib }
    
    pmid = int(article_ids['pmid']) if 'pmid' in article_ids else None
    pmcid = int(article_ids['pmc'].replace('PMC','')) if 'pmc' in article_ids else None
    
    #############
    # Get title #
    #############
    
    title_elems = article_elem.findall("./front/article-meta/title-group/article-title") + article_elem.findall("./front-stub/title-group/article-title")
    assert len(title_elems) == 1
    title_elem = title_elems[0]
    
    title_text,_ = treeToSpans(title_elem)
    
    ################
    # Get abstract #
    ################
    
    abstract_elems = article_elem.findall("./front/article-meta/abstract") + article_elem.findall("./front-stub/abstract")
    
    outer_abstract_elem = etree.Element('div')
    for abstract_elem in abstract_elems:        
        abstract_text,_ = treeToSpans(abstract_elem)
        
        subabstract_elem = etree.Element('div')
        if abstract_text.strip().lower().startswith('abstract'):
            subabstract_elem = abstract_elem
        else:
            abstract_title_elem = etree.Element('title')
            abstract_title_elem.text = 'Abstract'
                
            subabstract_elem.append(abstract_title_elem)
            subabstract_elem.append(abstract_elem)
            
        outer_abstract_elem.append(subabstract_elem)
    
    ############
    # Get body #
    ############
    
    body_elem = article_elem.find("./body")
    
    ##########################################
    # Stitch title, abstract & body together #
    ##########################################
    
    root = etree.Element('div')
    root.append(title_elem)
    root.append(outer_abstract_elem)
    root.append(body_elem)
    
    text, spans = treeToSpans(root)
    
    doc = { 
        'id': document_id,
        'pmid':pmid, 
        'pmcid':pmcid, 
        'isFullText': True,
        'title':title_text,
        'contents':text, 
        'formatting_json':json.dumps(spans) }
    
    insert(cur, 'document', doc)
        
    #######################
    # Splitting sentences #
    #######################
    
    passages = spansToPassages(text, spans)
        
    sentences = []
    for passage in passages:
        passage_offset = passage['start']
        parsed = nlp(passage['text'])
        
        for tokens in parsed.sents:
            start = tokens[0].idx + passage_offset
            end = tokens[-1].idx + len(tokens[-1].text) + passage_offset
            sentence = {'documentId':document_id, 'start':start, 'end':end}
            insert(cur, 'sentence', sentence)
    
    
    

def main():
    parser = argparse.ArgumentParser('Insert a set of test documents into the database')
    #parser.add_argument('--db',required=True,type=str,help='SQLite database')
    
    parser.add_argument('--pubmed_file',required=False,type=str,help='Single PubMed XML file')
    
    parser.add_argument('--pmc_file',required=False,type=str,help='Single PMC XML file (optionally gzipped)')
    
    parser.add_argument('--pmc_archive',required=False,type=str,help='Gzipped PMC archive with multiple XML files')
    
    parser.add_argument('--pmids',required=False,type=str,help='Comma delimited list of PMIDs to add')
    parser.add_argument('--pmcids',required=False,type=str,help='Comma delimited list of PMCIDs to add')
    parser.add_argument('--email',required=False,type=str,help='Email address to use for EUtils')
    
    parser.add_argument('--truncate',action='store_true',help='Wipe database before adding (for debug purposes)')
    
    parser.add_argument('--verbose',action='store_true',help="Whether to provide more output")
    parser.add_argument('--limit',required=False,type=int,help='Max number of documents to add')
    
    args = parser.parse_args()
    
    
    assert args.pubmed_file or args.pmc_file or args.pmc_archive or args.pmids or args.pmcids, "Must provide a file, archive or PMC IDs"
    
    if args.pmids or args.pmcids:
        assert args.email, "Must provide --email to use EUtils"
        Entrez.email = args.email
    
    #con = sqlite3.connect(args.db)
    #cur = con.cursor()
    
    nlp = spacy.load('en_core_web_sm', disable=['ner'])
    nlp.remove_pipe('tagger')
    nlp.remove_pipe('lemmatizer')
    
    assert 'DATABASE_URL' in os.environ, "DATABASE_URL environmental variable is not set.  Expected value in the form 'mysql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]"
    database_settings = re.match(r'^mysql://(.+?):(.*?)@(.+?):(\d+?)/(.+)$',os.environ['DATABASE_URL'])
    assert database_settings, "Unable to load database settings from environmental variable DATABASE_URL. Expected value in the form 'mysql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]"
    con = mysql.connector.connect(
        user=database_settings.group(1),
        password=database_settings.group(2),
        host=database_settings.group(3),
        port=database_settings.group(4),
        database=database_settings.group(5)
    )
    
    cur = con.cursor()
    
    if args.truncate:
        print("WARNING: Truncating...")
        cur.execute('DELETE FROM relationannotation')
        cur.execute('DELETE FROM entityannotation')
        cur.execute('DELETE FROM sentence')
        cur.execute('DELETE FROM document')
    
    existing_pmids = {}
    existing_pmcids = {}
    cur.execute('SELECT id,pmid,pmcid FROM document')
    next_document_id = 1
    for row in cur.fetchall():
        documentId,pmid,pmcid = row
        if pmid:
            existing_pmids[pmid] = documentId
        if pmcid:
            existing_pmcids[pmcid] = documentId
            
        next_document_id = max(next_document_id,documentId+1)
                
    insert_count = 0
    if args.pubmed_file:
        if args.pubmed_file.endswith('.gz'):
            handle = gzip.open(args.pubmed_file,'rb')
        else:
            handle = open(args.pubmed_file,'rb')
            
        tree = etree.parse(handle)
        
        handle.close()
        
        root = tree.getroot()
        
        iterator = root.iter('PubmedArticle')
        iterator = tqdm(iterator) if args.verbose else iterator
        
        for article in iterator:
            insert_pubmed_article(cur, nlp, next_document_id, article)
            
            next_document_id += 1
            insert_count += 1
            
            if args.limit and insert_count >= args.limit:
                break
    
    elif args.pmc_file:

        if args.pmc_file.endswith('.gz'):
            handle = gzip.open(args.pmc_file,'rb')
        else:
            handle = open(args.pmc_file,'rb')
    
        tree = etree.parse(handle)
        
        handle.close()
        
        root = tree.getroot()
        
        articles = [ article for article in root.iter('article') ]
        assert len(articles) == 1
        article = articles[0]
        
        insert_pmc_article(cur, nlp, next_document_id, article)
        next_document_id += 1
        insert_count += 1
        
    elif args.pmc_archive:
        tar = tarfile.open(args.pmc_archive)
        
        iterator = tqdm(tar.getmembers()) if args.verbose else tar
        
        for member in iterator:
            file_handle = tar.extractfile(member)
            data = file_handle.read().decode('utf-8')
            
            root = etree.fromstring(data)
            
            articles = [ article for article in root.iter('article') ]
            assert len(articles) == 1
            article = articles[0]
            
            insert_pmc_article(cur, nlp, next_document_id, article)
            next_document_id += 1
            insert_count += 1
            
            if args.limit and insert_count >= args.limit:
                break
    
    elif args.pmids:
        pmids = list(map(int, args.pmids.split(',')))
        iterator = tqdm(pmids) if args.verbose else pmids
        for pmid in iterator:
            if pmid in existing_pmids:
                continue
                
            handle = Entrez.efetch(db='pubmed', id=pmid, rettype="gb", retmode="xml")
            
            root = etree.fromstring(handle.read().decode('utf-8'))
            
            iterator = root.iter('PubmedArticle')
            iterator = tqdm(iterator) if args.verbose else iterator
            
            for article in iterator:
                insert_pubmed_article(cur, nlp, next_document_id, article)
                
                next_document_id += 1
                insert_count += 1
            
    elif args.pmcids:
        pmcids = list(map(int, args.pmcids.split(',')))
        iterator = tqdm(pmcids) if args.verbose else pmcids
        for pmcid in iterator:
            if pmcid in existing_pmcids:
                continue
                
            handle = Entrez.efetch(db='pmc', id=pmcid, rettype="gb", retmode="xml")
            
            root = etree.fromstring(handle.read().decode('utf-8'))
            
            articles = [ article for article in root.iter('article') ]
            assert len(articles) == 1
            article = articles[0]
            
            insert_pmc_article(cur, nlp, next_document_id, article)
            next_document_id += 1
            insert_count += 1
        
    con.commit()
    
    print(f"Added {insert_count} documents")

if __name__ == '__main__':
    main()