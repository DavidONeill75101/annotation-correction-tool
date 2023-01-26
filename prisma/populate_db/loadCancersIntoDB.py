import pandas as pd
import wget

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
    
    url = 'https://zenodo.org/record/5032501/files/terms_cancers.tsv?download=1'

    filename = wget.download(url)

    df = pd.read_csv(filename, sep='\t', header=None)

    df[3] = df[2].str.split('|')

    df.drop(0, inplace=True, axis=1)
    df.drop(2, inplace=True, axis=1)

    df_dict = df.to_dict('records')

    df_dict = df.to_dict('records')
    df_dict.append({1: 'No Cancer', 3: ['No Cancer']})

    for count, row in enumerate(df_dict):
        sql = "INSERT INTO Cancer (id, name) VALUES (%s, %s)"
        val = (str(count), str(row[1]))
        cur.execute(sql, val)

        for synonym in row[3]:
            sql = "INSERT INTO CancerSynonym (name, cancerId) VALUES (%s, %s)"
            val = (synonym, str(count))
            cur.execute(sql, val)
    
    sql = "INSERT INTO Cancer (id, name) VALUES (%s, %s)"
    val = ("2058", "unknown")
    cur.execute(sql, val)
        
    con.commit()

    print("Written to DB")

main()
    