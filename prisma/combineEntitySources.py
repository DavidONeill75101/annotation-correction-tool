import json
import argparse
import pronto
import os
import gzip
from collections import Counter

def getSynonyms(term):
    synonyms = []
    for s in term.synonyms:
        if s.scope == 'EXACT':
            synonyms.append(s.description.lower())
    synonyms = sorted(set(synonyms))
    return synonyms

def main():
    parser = argparse.ArgumentParser(description='Combine all the entity sources for NER and database loading')
    parser.add_argument('--sourceDir',required=True,type=str,help='Directory with source files')
    parser.add_argument('--include',required=False,type=str,help='Comma-delimited list of which entities to include')
    parser.add_argument('--outFile',required=True,type=str,help='Output file in BioC format')
    args = parser.parse_args()
    
    allowed_entity_types = {'taxa','gene','disease','anatomy','cell type','chemical'}
    
    if args.include == 'all':
        to_include = allowed_entity_types
    else:
    
        to_include = args.include.lower().split(',')
        for entity_type in to_include:
            assert entity_type in allowed_entity_types, f"Unrecognised entity type provided ({entity_type}). Don't know where this would be loaded from. Allowed types are: {allowed_entity_types}."
    
    entities = {}
    
    if 'taxa' in to_include:
        taxnonomy_filename = 'ncbi_taxonomy.dmp'
        print(f"Loading {taxnonomy_filename}...")
        with open(os.path.join(args.sourceDir,taxnonomy_filename),encoding='utf-8') as f:
            species = {}
            for line in f:
                split = [ x.strip() for x in line.strip('\n').split('|') ]
                
                if split[0] == '1':
                    continue
                
                tax_id = "ncbitaxa:" + split[0]
                name = split[1]
                name_use = split[3]
                
                if not tax_id in species:
                    entity = {'id':tax_id, 'type':'species', 'name':None, 'description':'', 'synonyms': [], 'tags':[]}
                    species[tax_id] = entity
                    
                if name_use == 'scientific name':
                    species[tax_id]['name'] = name
                    species[tax_id]['synonyms'].append(name)
                elif name_use in ['synonym','acronym','common_name','equivalent name','genbank common name']:
                    species[tax_id]['synonyms'].append(name)
            
            for tax_id in species:
                species[tax_id]['synonyms'] = sorted(set(species[tax_id]['synonyms']))
                
            species = { tax_id:data for tax_id,data in species.items() if data['name'] and data['synonyms'] }
            
            entities.update(species)
            species = None

    if 'gene' in to_include:
        gene_filename = 'gene_info.gz'
        print(f"Loading {gene_filename}...")
        with gzip.open(os.path.join(args.sourceDir,gene_filename),'rt',encoding='utf-8') as f:
            for line in f:
                if line.startswith('9606\t'): # Filter for human
                
                    split = line.strip('\n').split('\t')
                    
                    entrez_id = split[1]
                    symbol = split[2]
                    synonyms = split[4]
                    alternative_ids = split[5]
                    description = split[8]
                    symbol_from_nomenclature_authority = split[10]
                    name_from_nomenclature_authority = split[11]
                    other_designations = split[13]
                    
                    alternative_ids = [ a.split(':') for a in alternative_ids.split('|') ]
                    alternative_ids = { a[0]:':'.join(a[1:]) for a in alternative_ids }
                    
                    hgnc_id = alternative_ids.get('HGNC')
                    
                    if hgnc_id:
                    
                        official_name = f"{name_from_nomenclature_authority} ({symbol_from_nomenclature_authority})"
                        
                        combined_synonyms = [symbol,description,symbol_from_nomenclature_authority,name_from_nomenclature_authority] + synonyms.split('|') + other_designations.split('|')
                        
                        combined_synonyms = sorted(set(combined_synonyms))
                        
                        entrez_id_with_namespace = f"ncbigene:{entrez_id}"
                        
                        entity = {'id':entrez_id_with_namespace, 'type':'gene', 'name':official_name, 'description':description, 'synonyms': combined_synonyms, 'tags':[]}
                        entities[entrez_id_with_namespace] = entity
    
    if 'hgnc_genes' in to_include:
        hugo_filename = 'hgnc_complete_set_2022-06-01.json'
        with open(os.path.join(args.sourceDir,hugo_filename),encoding='utf-8') as f:
            hugo = json.load(f)
            
        for g in hugo['response']['docs']:
            entrez_id = g['entrez_id']
            symbol = g['symbol']
            name = g['name']
            hgnc_id = g['hgnc_id']
            print(g)
            break
        
    obo_sources = {}
    
    if 'disease' in to_include:
        obo_sources['disease'] = 'doid.obo'
    
    #obo_sources['phenotype'] = 'hp.obo'
    
    if 'anatomy' in to_include:
        obo_sources['anatomy'] = 'uberon-basic.obo'
    if 'chemical' in to_include:
        obo_sources['chemical'] = 'chebi.obo'
    if 'cell type' in to_include:
        obo_sources['cell type'] = 'cl-basic.obo'
    
    for entity_type,source_filename in obo_sources.items():
        print(f"Loading {source_filename} ({entity_type})")
        ont = pronto.Ontology(os.path.join(args.sourceDir,source_filename))
        
        tag_listings = {}
        if entity_type == 'disease':
            cancer_node = ont['DOID:162']
            tag_listings['cancer'] = set( t.id for t in cancer_node.subclasses() )
        
        for term in ont.terms():
        
            if term.obsolete:
                continue
        
            synonyms = getSynonyms(term)
            synonyms.append(term.name)
            
            tags = sorted( name for name,term_ids in tag_listings.items() if term.id in term_ids )
            
            entity = {'id':term.id, 'type':entity_type, 'name':term.name, 'description':term.definition, 'synonyms': synonyms, 'tags':tags}
            entities[term.id] = entity
            
    print(f"Loaded {len(entities)} entities")
    
    type_counts = Counter( e['type'] for e in entities.values() )
    print(f"Type counts: {type_counts}")
            
    with open(args.outFile,'w',encoding='utf-8') as f:
        json.dump(entities, f, indent=2)
        
    print(f"Saving to {args.outFile}")
    
if __name__ == '__main__':
    main()