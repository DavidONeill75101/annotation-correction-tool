import pandas as pd
import gzip

import mysql.connector

import os
import re


def main():

    print("Starting")

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

    print("DB connection established")

    with gzip.open('prisma\populate_db\civicmine_sentences.tsv.gz','r') as f:        
        sentences_pd = pd.read_csv(f, sep='\t')
    
    print("Dataframe built")

    for i in range(len(sentences_pd)):
        row = sentences_pd.iloc[i]
        sql = "INSERT INTO sentences (matching_id, evidencetype, gene, cancer, drug, variant_group, day, formatted, journal, month, pmid, section, subsection, sentence, title, year) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (str(row['matching_id']), str(row['evidencetype']), str(row['gene_normalized']), str(row['cancer_normalized']), str(row['drug_normalized']), str(row['variant_id']), str(row['day']), str(row['formatted_sentence']),str(row['journal']),str(row['month']),str(row['pmid']),str(row['section']),str(row['subsection']), str(row['sentence']),str(row['title']),str(row['year']))
        cur.execute(sql, val)

    print("Dataframe written to DB")
    
    con.commit()


main()
    