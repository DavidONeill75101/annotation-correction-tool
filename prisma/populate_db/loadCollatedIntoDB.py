
import pandas as pd

import mysql.connector

import os
import re
import wget


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

    url = "https://zenodo.org/record/6816433/files/civicmine_collated.tsv.gz?download=1"

    filename = wget.download(url)

    collated_pd = pd.read_csv(filename, sep='\t')

    print("Dataframe built")

    for i in range(len(collated_pd)):
        row = collated_pd.iloc[i]
        sql = "INSERT INTO relation (matching_id, evidencetype, gene, cancer, drug, variant_group, citation_count) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val = (str(row['matching_id']), str(row['evidencetype']), str(row['gene_normalized']), str(row['cancer_normalized']), str(row['drug_normalized']), str(row['variant_group']), str(row['citation_count']))
        cur.execute(sql, val)

    print("Dataframe written to DB")
    
    con.commit()


main()
    