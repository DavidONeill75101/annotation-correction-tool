import argparse
from collections import defaultdict
import gzip
import re
from tqdm import tqdm
import spacy
import bioc
import json

def main():
    parser = argparse.ArgumentParser(description='Use a trained Spacy model')
    parser.add_argument('--model',required=True,type=str,help='Name of Spacy model')
    parser.add_argument('--inBioc',required=True,type=str,help='Input file in BioC format')
    parser.add_argument('--outBioc',required=True,type=str,help='Output file in BioC format')
    args = parser.parse_args()
    
    nlp = spacy.load(args.model)
    
    writer = bioc.biocxml.BioCXMLDocumentWriter(args.outBioc)
    with open(args.inBioc,'rb') as f:
        parser = bioc.biocxml.BioCXMLDocumentReader(f)
        for i,doc in enumerate(parser):
            currentID = 1
            
            for passage in doc.passages:
                parsed = nlp(passage.text)
                
                passage.annotations = []
                
                for key,spans in parsed.spans.items():
                    for span,score in zip(spans,spans.attrs["scores"]):
                        
                        #print(span.text, span.start_char, span.end_char, span.label_, score)
                        #print(dir(span))
                
                        start, end = span.start_char, span.end_char
                        assert passage.text[start:end] == span.text
                        
                        a = bioc.BioCAnnotation()
                        a.text = passage.text[start:end]
                        a.infons['score'] = score
                        a.infons['type'] = span.label_
                        #a.infons['name'] = ''
                        #a.infons['externalId'] = ''
                        
                        a.id = 'T%d' % currentID
                        currentID += 1

                        if end <= start:
                            continue

                        biocLoc = bioc.BioCLocation(offset=passage.offset+start, length=(end-start))
                        a.locations.append(biocLoc)
                        passage.annotations.append(a)
                        
                        
            writer.write_document(doc)
            
    print("Done")

if __name__ == '__main__':
    main()