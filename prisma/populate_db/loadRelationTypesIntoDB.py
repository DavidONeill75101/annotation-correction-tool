import pandas as pd

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
    
    d = {'id': [1, 2, 3, 4], 'name': ['diagnostic', 'predisposing', 'predictive', 'prognostic']}
    df = pd.DataFrame(data=d)

    print("Dataframe Created")

    for i in range(len(df)):
        row = df.iloc[i]
        sql = "INSERT INTO RelationType (id, name) VALUES (%s, %s)"
        val = (str(row['id']), str(row['name']))
        cur.execute(sql, val)

    print("Dataframe written to DB")
    
    con.commit()


main()
    