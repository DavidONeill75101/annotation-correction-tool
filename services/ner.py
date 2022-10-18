import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import bioc
import mysql.connector
import os
import re
from collections import defaultdict,Counter
from tqdm import tqdm
import spacy
from spacy.tokens import DocBin
from spacy.util import filter_spans
import subprocess
import shutil
from sklearn.model_selection import train_test_split

from spans_and_trees import treeToSpans, spansToPassages

annotationBotId = 99999
    
def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def trimAutoAnnotations(docs):
    for doc in docs:
        documentId = doc.infons['documentId']
    
        for passage in doc.passages:
            passage.annotations = [ a for a in passage.annotations if a.infons['userId'] != annotationBotId ]
            
def convertToAnnotatedSentenceDocuments(docs,onlyManual=False,onlyAnnotated=False,cleanRejected=False):
    sentence_docs = []
    
    for doc in docs:
        sentence_doc = bioc.BioCDocument()
        sentence_doc.id = doc.id
        sentence_doc.infons = dict(doc.infons)
        
        for passage in doc.passages:
            anno_tree = IntervalTree()
            for a in passage.annotations:
                start = a.locations[0].offset
                end = a.locations[0].offset + a.locations[0].length
                assert isinstance(a.infons['rejected'], bool)
            
                isManual = a.infons['userId'] != annotationBotId
                includeAnno = (not onlyManual) or isManual
                if includeAnno:
                    anno_tree.addi(start,end,a)
                
                
            for sentence in passage.sentences:
                start = sentence.offset
                end = start + sentence.infons['length']
                
                annos = [ a.data for a in anno_tree[start:end] ]
                
                includeSentence = (not onlyAnnotated) or len(annos) > 0
                            
                if includeSentence:
                    if cleanRejected:
                        annos = [ a for a in annos if not a.infons['rejected'] ]
                
                    sentence_passage = bioc.BioCPassage()
                    sentence_passage.infons['sentenceId'] = sentence.infons['id']
                    sentence_passage.offset = start
                    sentence_passage.text = passage.text[(start-passage.offset):(end-passage.offset)]
                    sentence_passage.annotations = annos
                    
                    sentence_doc.add_passage(sentence_passage)
                    
        if len(sentence_doc.passages) > 0:
            sentence_docs.append(sentence_doc)
                
    return sentence_docs

def getDocumentsFromDB(cur,getSentencesWithAnnotations=False):
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
        
    cur.execute('SELECT id,rejected,start,end,score,documentId,entityId,userId FROM entityannotation')
    for row in cur.fetchall():
        annotationId,rejected,start,end,score,documentId,entityId,userId = row
        
        entity = dict(entities[entityId])
        entity['userId'] = userId
        
        assert isinstance(rejected, int)
        entity['rejected'] = (rejected != 0)
        
        assert isinstance(score, float)
        entity['score'] = score
        
        anno = [start, end-start, 'Annotation', entity]
        documents[documentId]['annotations'].append(anno)
        
    bioc_documents = []
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
                
                
        if getSentencesWithAnnotations:
            bioc_doc = documentToSentencesWithAnnotations(bioc_doc)
            
        bioc_documents.append(bioc_doc)
        
    return bioc_documents
    
def dictionaryMatchSentence(sentence_tokens, sentence_text, lookup):
    np = [ t.text.lower() for t in sentence_tokens ]
    blank = "".join( " " for _ in sentence_text )
    
    found = []
    
    sentence_start = sentence_tokens[0].idx

    temp_sentence_text = sentence_text.lower()
    # The length of each search string will decrease from the full length
    # of the text down to 1
    for l in reversed(range(1, len(sentence_tokens)+1)):
        # We move the search window through the text
        for i in range(len(np)-l+1):
            # Extract that window of text
            start_token = sentence_tokens[i]
            end_token = sentence_tokens[i+l-1]
            
            start_pos = start_token.idx - sentence_start
            end_pos = end_token.idx + len(end_token.text) - sentence_start
            s_lower = temp_sentence_text[start_pos:end_pos]

            # Search for it in the dictionary
            if s_lower in lookup:
                # If found, save the ID(s) in the dictionary
                
                s = sentence_text[start_pos:end_pos]
                
                entity = {'start':start_pos+sentence_start,'end':end_pos+sentence_start,'text':s,'id':lookup[s_lower]}
                found.append(entity)
                
                # And blank it out
                temp_sentence_text = temp_sentence_text[:start_pos] + blank[start_pos:end_pos] + temp_sentence_text[end_pos:]

    # Then return the found term IDs
    return found

def doDictionaryNER(docs, lookup):
    trimAutoAnnotations(docs)
    
    nlp = spacy.load("en_core_web_sm")
    
    for doc in tqdm(docs):
        documentId = doc.infons['documentId']
        currentID = 1
            
        for passage in doc.passages:
            parsed = nlp(passage.text)
            
            for sentence in parsed.sents:
                sentence_start = sentence[0].idx
                sentence_end = sentence[-1].idx + len(sentence[-1].text)
                sentence_text = passage.text[sentence_start:sentence_end]
                
                entities = dictionaryMatchSentence(sentence, sentence_text, lookup)
                
                for e in entities:                        
                    start, end = e['start'], e['end']
                    
                    assert passage.text[start:end] == e['text']
                    
                    # TODO: Entity link
                    entity_type, synonymId, externalId = sorted(e['id'])[0]
                    
                    a = bioc.BioCAnnotation()
                    a.text = passage.text[start:end]
                    a.infons = {'externalId': externalId, 'synonymId':synonymId, 'type':entity_type, 'userId':annotationBotId, 'rejected':False, 'score':0.5}
                    a.id = 'T%d' % currentID
                    currentID += 1

                    if end <= start:
                        continue

                    biocLoc = bioc.BioCLocation(offset=passage.offset+start, length=(end-start))
                    a.locations.append(biocLoc)
                    passage.annotations.append(a)
            
def docsToSpacyFile(docs, spacyFilename):
    nlp = spacy.blank("en")
    docbin = DocBin()
    
    ent_count = 0
    for doc in docs:
        documentId = doc.infons['documentId']
    
        for passage in doc.passages:
            doc = nlp.make_doc(passage.text)
            ents = []
        
            for a in passage.annotations:
                start = a.locations[0].offset - passage.offset
                end = start + a.locations[0].length
                label = a.infons['type']
            
                span = doc.char_span(start, end, label=label, alignment_mode="contract")
                if span is None:
                    print("Skipping entity")
                else:
                    ents.append(span)
                    
            filtered_ents = filter_spans(ents)
            doc.ents = filtered_ents 
            docbin.add(doc)
            ent_count += len(filtered_ents)
            
    print(f"{ent_count=}")
    assert ent_count > 0
                
    docs = list(docbin.get_docs(nlp.vocab))
    for doc in docs:
        doc.spans['sc'] = list(doc.ents)
        
    DocBin(docs=docs).to_disk(spacyFilename)
    
def spacyTrain(trainingFilename,devFilename):
    if os.path.isdir('model-best'):
        shutil.rmtree('model-best')
    if os.path.isdir('model-last'):
        shutil.rmtree('model-last')

    command = f"python -m spacy train config.cfg --output ./ --paths.train {trainingFilename} --paths.dev {devFilename}"
    
    subprocess.run(command, shell=True, check=True)
    
def checkAnnotationOverlap(docs):
    for doc in docs:
        documentId = doc.infons['documentId']
    
        for passage in doc.passages:
            active_annos = [ a for a in passage.annotations if not a.infons['rejected'] ]
        
            anno_tree = IntervalTree()
            for a in active_annos:
                start = a.locations[0].offset - passage.offset
                end = start + a.locations[0].length
                
                overlapping = anno_tree[start:end]
                assert len(overlapping)==0, f"Found overlapping annotations with documentId:{documentId}"
                anno_tree.addi(start,end,a)
    
def makeWeaklySupervisedData(docs, lookup, length_filter):
    doDictionaryNER(docs, lookup)
        
    dictionaried_docs = convertToAnnotatedSentenceDocuments(docs,onlyManual=False,onlyAnnotated=True,cleanRejected=True)
    
    annotated_sentence_docs = []
    for doc in dictionaried_docs:
        doc.passages = [ p for p in doc.passages if len(p.annotations) == 1 and len(p.annotations[0].text) >= length_filter ]
        
        if doc.passages:
            annotated_sentence_docs.append(doc)
            
    return annotated_sentence_docs
    
def doSpacyNER(docs, lookup, train=False):

    if train:
        useManual = False

        if useManual:
            annotated_sentence_docs = convertToAnnotatedSentenceDocuments(docs,onlyManual=True,onlyAnnotated=True,cleanRejected=True)
        else:
            annotated_sentence_docs = makeWeaklySupervisedData(docs, lookup, 10)
        
        
        annotated_sentence_count = sum( len(doc.passages) for doc in annotated_sentence_docs)
        print(f"{annotated_sentence_count=}")
        
        annotated_entity_counts = Counter( a.infons['type'] for doc in annotated_sentence_docs for p in doc.passages for a in p.annotations )
        print(f"{annotated_entity_counts=}")
        

        train_data, dev_data = train_test_split(annotated_sentence_docs, test_size=0.33, random_state=42)
        print("{len(train_data)=}")
        print("{len(dev_data)=}")
        
        trainingFilename = 'training.spacy'
        devFilename = 'dev.spacy'
        
        docsToSpacyFile(train_data, trainingFilename)
        docsToSpacyFile(dev_data, devFilename)
        
        spacyTrain(trainingFilename,devFilename)
    
    nlp = spacy.load("model-best")
    
    trimAutoAnnotations(docs)
    for doc in tqdm(docs):
        documentId = doc.infons['documentId']
        currentID = 1
            
        for passage in doc.passages:
            parsed = nlp(passage.text)
            
            claimed = IntervalTree()
            
            for key,spans in parsed.spans.items():
                spans_and_scores = list(zip(spans,spans.attrs["scores"]))
                
                spans_and_scores = sorted(spans_and_scores, key=lambda x:len(x[0].text), reverse=True)
            
                for span,score in spans_and_scores:
                    
                    start, end = span.start_char, span.end_char
                    assert passage.text[start:end] == span.text
                    
                    # Overlapping longer entity so skipping
                    if len(claimed[start:end]) != 0:
                        continue
                        
                    claimed.addi(start,end,True)
                    
                    a = bioc.BioCAnnotation()
                    a.text = passage.text[start:end]
                    #a.infons['score'] = float(score)
                    #
                    
                    text_lower = a.text.lower()
                    if text_lower in lookup:
                        externalIds = lookup[text_lower]
                        entityType,synonymId,externalId = sorted(externalIds)[0]
                    else:
                        entityType = span.label_
                        externalId = f"unlinked:{entityType}"
                        synonymId = None
                    
                    a.infons = {'externalId': externalId, 'synonymId':synonymId, 'type':entityType, 'userId':annotationBotId, 'rejected':False, 'score':float(score)}
                    
                    a.infons['type'] = span.label_
                    
                    a.id = 'T%d' % currentID
                    currentID += 1

                    if end <= start:
                        continue

                    biocLoc = bioc.BioCLocation(offset=passage.offset+start, length=(end-start))
                    a.locations.append(biocLoc)
                    passage.annotations.append(a)
                    
            if documentId == 5:
                print('-'*30)
                print(passage.text)
                for a in passage.annotations:
                    #print(passage.annotations)
                    print(a)
                print(parsed.spans.keys())
                #assert False
    

def pushAnnotationsToDB(cur, docs):
    
    externalid_to_entityid = {}
    cur.execute('SELECT id,externalId FROM entity')
    for row in cur.fetchall():
        entityId,externalId = row
        externalid_to_entityid[externalId] = entityId
        
    annotation_records = []
    
    for doc in docs:
        documentId = doc.infons['documentId']
    
        for passage in doc.passages:
            manual_annotations = [ a for a in passage.annotations if a.infons['userId'] != annotationBotId ]
            auto_annotations = [ a for a in passage.annotations if a.infons['userId'] == annotationBotId ]
            
            anno_tree = IntervalTree()
            for a in manual_annotations:
                if a.infons['rejected'] == False:
                    start, end = a.locations[0].offset, a.locations[0].offset+a.locations[0].length
                    anno_tree.addi(start, end, a)
                
            combined_annotations = manual_annotations
            for a in auto_annotations:
                start, end = a.locations[0].offset, a.locations[0].offset+a.locations[0].length
                if not anno_tree[start:end]:
                    combined_annotations.append(a)
                    
            sentence_tree = IntervalTree()
            for sentence in passage.sentences:
                start = sentence.offset
                end = start + sentence.infons['length']
                sentence_id = sentence.infons['id']
                sentence_tree.addi(start,end,sentence_id)
                
            for a in combined_annotations:
                externalId = a.infons['externalId']
                
                assert externalId in externalid_to_entityid, f"Entity ID for {externalId=} not found"
                assert isinstance(a.infons['rejected'], bool)
                    
                entityId = externalid_to_entityid[externalId]
                
                loc = a.locations[0]
                start = loc.offset
                end = loc.offset + loc.length
                rejected = a.infons['rejected']
                userId = a.infons['userId']
                synonymId = a.infons['synonymId']
                score = a.infons['score']
                
                sentence_id = None
                sentences_at_location = sentence_tree[start:end]
                if len(sentences_at_location) == 1:
                    sentence_id = list(sentences_at_location)[0].data
                
                annotation_record = (rejected,start,end,score,entityId,documentId,sentence_id,userId,synonymId)
                annotation_records.append(annotation_record)
    
    print("Removing previous annotations") # TODO: Not a great idea to wipe the annotations like this
    cur.execute('DELETE FROM entityannotation')
        
    print(f"Inserting {len(annotation_records)} annotations")
    for chunk in chunks(annotation_records, 1000):
        cur.executemany('INSERT INTO entityannotation(rejected,start,end,score,entityId,documentId,sentenceId,userId,synonymId) values (%s,%s,%s,%s,%s,%s,%s,%s,%s)', chunk)



def main():
    parser = argparse.ArgumentParser('Run an NER service')
    parser.add_argument('--mode',required=True,type=str,help='dict/spacy')
    args = parser.parse_args()
    
    assert args.mode in ['dict','spacy-train','spacy-use','none']
    
     
    
    database_settings = re.match(r'^mysql://(.+?):(.*?)@(.+?):(\d+?)/(.+)$',os.environ['DATABASE_URL'])
    con = mysql.connector.connect(
        user=database_settings.group(1),
        password=database_settings.group(2),
        host=database_settings.group(3),
        port=database_settings.group(4),
        database=database_settings.group(5)
    )
    cur = con.cursor()
    
    accepted_entity_statuses = {'ADDED_FROM_RESOURCE'}
    accepted_synonym_statuses = {'ADDED_FROM_RESOURCE','ADDED_MANUALLY'}
    
    lookup = defaultdict(set)
    cur.execute('SELECT e.id,s.id,e.externalId,t.name,s.name,e.status,s.status FROM entity e, entityType t, entitySynonym s WHERE e.id = s.entityId AND e.entityTypeId = t.id')
    for row in cur.fetchall():
        entityId,entitySynonymId,externalId,entityType,synonym,entityStatus,synonymStatus = row
        
        if entityStatus in accepted_entity_statuses and synonymStatus in accepted_synonym_statuses:
            lookup[synonym.lower()].add((entityType,entitySynonymId,externalId))
        
    print(f"Loaded {len(lookup)} synonyms from database")
        
    
    #annotated_sentences = getDocumentsFromDB(getSentencesWithAnnotations=True)
    docs = getDocumentsFromDB(cur)
    
    
    
    if args.mode == 'dict':
        doDictionaryNER(docs, lookup)
    elif args.mode == 'spacy-train':
        doSpacyNER(docs, lookup, train=True)
    elif args.mode == 'spacy-use':
        doSpacyNER(docs, lookup, train=False)
    else:
        trimAutoAnnotations(docs)
    #assert False
    
    checkAnnotationOverlap(docs)
    
    #assert False
    
    pushAnnotationsToDB(cur, docs)
    
    con.commit()
    print("Done")
    
    
if __name__ == '__main__':
    main()
    