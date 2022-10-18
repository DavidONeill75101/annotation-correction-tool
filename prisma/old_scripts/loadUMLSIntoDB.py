import argparse
import json
import sqlite3
from collections import defaultdict

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def main():
    parser = argparse.ArgumentParser('Load UMLS into an SQLITE database')
    parser.add_argument('--MRDEF',required=True,type=str,help='UMLS MRDEF file')
    parser.add_argument('--MRSTY',required=True,type=str,help='UMLS MRSTY file')
    parser.add_argument('--MRCONSO',required=True,type=str,help='UMLS MRCONSO file')
    parser.add_argument('--db',required=True,type=str,help='SQlite database')
    args = parser.parse_args()
    
    con = sqlite3.connect(args.db)
    
    cur = con.cursor()
                
    existing_externalids = {}
    for row in cur.execute('SELECT id,externalId FROM Entity'):
        entityId,externalId = row
        existing_externalids[externalId] = entityId
        
    print(f"Found {len(existing_externalids)} existing entities")
    next_entity_id = max(existing_externalids.values()) + 1
    
    externalid_to_definition = {}
    with open(args.MRDEF,encoding='utf-8') as in_f:
        for line in in_f:
            split = line.strip('\n').split('|')
            cui = split[0]
            source = split[4]
            definition = split[5]
            
            externalId = f"CUI:{cui}"
            
            if not externalId in externalid_to_definition:
                externalid_to_definition[externalId] = f"{definition} ({source})"
                
    print(f"Loaded {len(externalid_to_definition)} definitions for UMLS terms")
                
    externalid_to_type = defaultdict(set)
    with open(args.MRSTY,encoding='utf-8') as in_f:
        for line in in_f:
            split = line.strip('\n').split('|')
            cui = split[0]
            typeId = split[1]
            longname = split[3]
            
            externalId = f"CUI:{cui}"
            
            externalid_to_type[externalId].add(longname)
            
    externalid_to_type = { externalId:", ".join(sorted(longnames)) for externalId,longnames in externalid_to_type.items() }
    
    print(f"Loaded {len(externalid_to_type)} semantic types for UMLS terms")
    
    externalid_to_synonyms = defaultdict(list)
    with open(args.MRCONSO,encoding='utf-8') as in_f:
        for line in in_f:
            split = line.strip('\n').split('|')
            cui = split[0]
            synonym = split[14]
            
            externalId = f"CUI:{cui}"
            
            externalid_to_synonyms[externalId].append(synonym)
            
    print(f"Loaded {len(externalid_to_synonyms)} UMLS terms with synonyms")
    
    #lookup = { synonym:list(ids)[0] for synonym,ids in lookup.items() if len(ids) == 1 }
    #print(f"Reduced to {len(lookup)} unambiguous UMLS synonyms")
                   
    entity_records = []
    synonym_records = []
    
    for externalId,synonyms in externalid_to_synonyms.items():
        if externalId in existing_externalids:
            continue
        
        main_name = synonyms[0]
        description = externalid_to_definition.get(externalId,'')
        semantic_type = externalid_to_type.get(externalId,'')
        entity_record = (next_entity_id, externalId, main_name, semantic_type, description)
        entity_records.append(entity_record)
        
        synonyms = sorted(set([ s.lower() for s in synonyms ]))
        for synonym in synonyms:
            synonym_record = (next_entity_id, synonym.lower())
            synonym_records.append(synonym_record)
        
        next_entity_id += 1
        
    print(f"Inserting {len(entity_records)} entities")
    for chunk in chunks(entity_records, 1000):
        cur.executemany('INSERT INTO Entity(id, externalId, name, type, description) values (?,?,?,?,?)', chunk)
        
    print(f"Inserting {len(synonym_records)} synonyms")
    for chunk in chunks(synonym_records, 1000):
        cur.executemany('INSERT INTO EntitySynonym(entityId, name) values (?,?)', chunk)
        
    
        
    con.commit()
    print("Done")
    
if __name__ == '__main__':
    main()
    