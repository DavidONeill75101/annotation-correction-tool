import argparse
import xml.etree.cElementTree as etree
from intervaltree import IntervalTree
import json
import sqlite3

from spans_and_trees import treeToSpans

def getDBSchema(db_filename):
    con = sqlite3.connect(db_filename)
    
    cur = con.cursor()

    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")

    tables = [ row[0] for row in cur.fetchall() ]

    tables_with_columns = {}
    for table in tables:
        cur.execute("PRAGMA table_info(%s);" % table)
        tables_with_columns[table] = cur.fetchall()

    con.close()

    return tables_with_columns

def main():
    parser = argparse.ArgumentParser('Print out a database schema')
    parser.add_argument('--db',required=True,type=str,help='SQlite database')
    args = parser.parse_args()
    
    schema = getDBSchema(args.db)
    for table,columns in schema.items():
        print(table)
        print(columns)
        print('-'*30)
    
    
if __name__ == '__main__':
    main()
    