import argparse
import bioc

import spacy
from spacy.tokens import DocBin
from spacy.util import filter_spans


def main():
    parser = argparse.ArgumentParser('Convert BioC file to Spacy corpus file')
    parser.add_argument('--inBioc',required=True,type=str,help='Input BioC file')
    parser.add_argument('--docBin',required=True,type=str,help='Output Spacy DocBin')
    args = parser.parse_args()
    
    nlp = spacy.blank("en")
    docbin = DocBin()
    
    with open(args.inBioc,'rb') as f:
        parser = bioc.biocxml.BioCXMLDocumentReader(f)
        for doc in parser:
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
                
    docbin.to_disk(args.docBin)
    
    
    docbin = DocBin().from_disk(args.docBin)
    docs = list(docbin.get_docs(nlp.vocab))
    for doc in docs:
        doc.spans['sc'] = list(doc.ents)
    DocBin(docs=docs).to_disk(args.docBin)
    
    print("Done")
    
if __name__ == '__main__':
    main()
    