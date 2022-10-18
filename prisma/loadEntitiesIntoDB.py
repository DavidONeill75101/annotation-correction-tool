import argparse
import json
import sqlite3
from collections import defaultdict

import mysql.connector

import os
import re

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def main():
    parser = argparse.ArgumentParser('Load entities into an SQLITE database')
    parser.add_argument('--entities',required=True,type=str,help='Entities file')
    args = parser.parse_args()
    
    #con = sqlite3.connect(args.db)
    #cur = con.cursor()
    
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
                
    existing_externalids = {}
    cur.execute('SELECT id,externalId FROM entity')
    for row in cur.fetchall():
        entityId,externalId = row
        existing_externalids[externalId] = entityId
        
    print(f"Found {len(existing_externalids)} existing entities")
    next_entity_id = max(existing_externalids.values()) + 1 if existing_externalids else 1
        
    existing_entitytypes = {}
    cur.execute('SELECT id,name FROM entitytype')
    for row in cur.fetchall():
        entityTypeId,name = row
        existing_entitytypes[name] = entityTypeId
        
    print(f"Found {len(existing_externalids)} existing entity types")
    next_entitytype_id = max(existing_entitytypes.values()) + 1 if existing_entitytypes else 1
    
    existing_entitytags = {}
    cur.execute('SELECT id,entityTypeId,name FROM entitytag')
    for row in cur.fetchall():
        entityTagId,entityTypeId,name = row
        existing_entitytags[(entityTypeId,name)] = entityTagId
        
    print(f"Found {len(existing_entitytags)} existing entity tags")
    next_entitytag_id = max(existing_entitytags.values()) + 1 if existing_entitytags else 1
        
    
    with open(args.entities) as f:
        entities = json.load(f)
        
    entitytypes = sorted(set( e['type'] for e in entities.values() ))
    
    entitytype_records = []
    entity_records, synonym_records = [],[]
    
    entitytag_records, entity_to_entitytag_records = [], []
    
    for entitytype in entitytypes:
        if not entitytype in existing_entitytypes:
            existing_entitytypes[entitytype] = next_entitytype_id
            
            name = f"Unlinked {entitytype}"
            description = f"Entity of type {entitytype} that doesn't have an appropriate ontology term"
            externalId = f"unlinked:{entitytype}"
            entity_record = (next_entity_id, externalId, name, True, next_entitytype_id, description, 'ADDED_FROM_RESOURCE')
            entity_records.append(entity_record)
            
            entitytype_records.append( (next_entitytype_id,entitytype,next_entity_id) )
            
            next_entity_id += 1
            next_entitytype_id += 1
        
    print(f"Loaded {len(entities)} from {args.entities}")
    for externalId,entity in entities.items():
        if externalId in existing_externalids:
            continue
        
        entity['description'] = entity['description'] if entity['description'] else ''
        
        entitytype_id = existing_entitytypes[entity['type']]
        
        entity_record = (next_entity_id, externalId, entity['name'], False, entitytype_id, entity['description'], 'ADDED_FROM_RESOURCE')
        entity_records.append(entity_record)
        
        synonyms = sorted(set([ s.lower() for s in entity['synonyms'] ]))
        for synonym in synonyms:
            synonym_record = (next_entity_id, synonym.lower(), 'ADDED_FROM_RESOURCE')
            synonym_records.append(synonym_record)
            
        for tag in entity['tags']:
            tag_tuple = (entitytype_id, tag)
            if not tag_tuple in existing_entitytags:
                entitytag_record = (next_entitytag_id, entitytype_id, tag)
                entitytag_records.append(entitytag_record)
                existing_entitytags[tag_tuple] = next_entitytag_id
                next_entitytag_id += 1
                
            entity_to_entitytag_record = (next_entity_id, existing_entitytags[tag_tuple])
            entity_to_entitytag_records.append(entity_to_entitytag_record)
        
        next_entity_id += 1
        
    print(f"Inserting {len(entitytype_records)} entity types")
    for chunk in chunks(entitytype_records, 1000):
        cur.executemany('INSERT INTO EntityType(id, name, unlinkedEntityId) values (%s,%s,%s)', chunk)
        
    print(f"Inserting {len(entitytag_records)} entity tags")
    for chunk in chunks(entitytag_records, 1000):
        cur.executemany('INSERT INTO EntityTag(id, entityTypeId, name) values (%s,%s,%s)', chunk)
        
    print(f"Inserting {len(entity_records)} entities")
    for chunk in chunks(entity_records, 1000):
        cur.executemany('INSERT INTO Entity(id, externalId, name, isUnlinked, entityTypeId, description, status) values (%s,%s,%s,%s,%s,%s,%s)', chunk)
        
    print(f"Inserting {len(entity_to_entitytag_records)} entity_to_entitytags")
    for chunk in chunks(entity_to_entitytag_records, 1000):
        cur.executemany('INSERT INTO _entitytoentitytag(A, B) values (%s,%s)', chunk)
        
    print(f"Inserting {len(synonym_records)} synonyms")
    for chunk in chunks(synonym_records, 1000):
        cur.executemany('INSERT INTO EntitySynonym(entityId, name, status) values (%s,%s,%s)', chunk)
        
    con.commit()
    print("Done")
    
if __name__ == '__main__':
    main()
    