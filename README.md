# CIViCMine Annotation Review Tool

## About

This repository holds a [Next.js](https://nextjs.org/) application which facilitates the review of cancer-gene-drug relations extracted by the machine learning tool [CIViCMine](http://bionlp.bcgsc.ca/civicmine/). The web application is part of the "human-in-the-loop" process - relations which have been predicted by CIViCMine are presented to users for review, generating new data which can be used to retrain the model.

There are two main componenents in the application:

- Upvoting/Downvoting - users have the ability to state whether a predicted sentence annotation is correct or incorrect. Correct annotations can be utilised in the future as concrete training data. Incorrect annotations can be used to filter predictions in the future.
- Manual annotation - incorrectly annotated sentences can be fed to the user for manual annotation to explain what relations actually exist in the sentence.

## Setup

The following instructions can be followed to run this application locally.

### Prerequisities

- MySQL
  - Download and install a MySQL server. XAMPP is a nice option as it comes with phpmyadmin and some other things: https://www.apachefriends.org/
  - Start the MySQL server and the Apache server (needed for phpmyadmin later)
- NodeJS
  - Install it from https://nodejs.org/en/download/
- A nice terminal can be useful. On Windows, you could use Git-bash which comes packaged with git for windows: https://gitforwindows.org/
- For the setup below, you'll need a couple Python packages installed
  - `pip install pandas`
  - `pip install mysql-connector-python`
  - `pip install gzip`
  - `pip install wget`

### Getting the database set up

- Create a new database in MySQL
  - Go to https://localhost/phpmyadmin to manage the databases and create a new empty database named annotate_db
- Set up the DATABASE_ENV variable to point towards the database
  - The DATABASE_URL takes the form of `mysql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]`
  - In a terminal (like Git-bash) you could set it with export like below. These use the default root settings for XAMPP (i.e. no password) and a database name of annotator.
  - `export DATABASE_URL=mysql://root:@localhost:3306/annotate_db`
  - This either needs to be run before running any of the database loading scripts, or push in your `.bash_profile` or `.bash_rc` file so it's preloaded.
- Install node modules (like React, etc)
  - In the root directory of this project, run `npm install` from the terminal.
- The database schema is described in the file [prisma/schema.prisma](https://github.com/DavidONeill75101/annotation-correction-tool/blob/main/prisma/schema.prisma). Get prisma to load up the database schema into MySQL with the command below.
  - `npx prisma migrate dev --name init`

### Start populating the database

- Insert the relations into the database
  - `python prisma/populate_db/loadCollatedIntoDB.py`
- Insert the sentences into the database
  - `python prisma/populate_db/loadSentencesIntoDB.py`
- Insert the entity types into the database
  - `python prisma/populate_db/loadEntityTypesIntoDB.py`
- Insert the relation types into the database
  - `python prisma/populate_db/loadRelationTypesIntoDB.py`
- Insert cancers and cancer synonyms into the database
  - `python prisma/populate_db/loadCancersIntoDB.py`
- Insert genes and gene synonyms into the database
  - `python prisma/populate_db/loadGenesIntoDB.py`
- Insert drugs and drug synonyms into the database
  - `python prisma/populate_db/loadDrugsIntoDB.py`
- Insert variants and variant synonyms into the database
  - `python prisma/populate_db/loadVariantsIntoDB.py`

### Run the server

- To run the development version of the server (that does nice updates whenever you change code), run:
  - `npm run dev`
- Look at it:
  - http://localhost:3000

## Usage

### Casual Reviewing of Sentence Annotations

- Create an account, with the option to login using a third party account.
- Read and understand the annotation guide, clicking the button to confirm that you have done this.
- Click "Get Started" on the homepage to view all of the relations which have been extracted from CIViCMine
- Filter the relations by various fields.
- Select "Review Annotations" to be presented with the sentence annotations for a specific relation.
- Give a "thumbs up" to a sentence annotation which correctly identifies the relation.
- Give a "thumbs down" to a sentence annotation which incorrectly identifies the relation.

### Detailed Annotation of Sentences

- Create an account, with the option to login using a third party account.
- Read and understand the annotation guide, clicking the button to confirm that you have done this.
- Click "Get Started" on the homepage to view all of the relations which have been extracted from CIViCMine
- Filter the relations by various fields.
- Select "Annotate Sentences" to be presented with a list of downvoted sentences for a particular relation.
- Select "Annotate" on the desired sentence.
- Highlight text to identify entities in the text.
- Use the dropdown menus to add relations between entities.
- Select "Annotations Complete" to save the changes.

### Retrieving the New Training Data

There is a series of administrator API calls which return JSON formatted results of the annotation review:

- [/api/get_data/admin_calls/get_upvotes_admin](/api/get_data/admin_calls/get_upvotes_admin) returns every sentence annotation which has been upvoted.
- [/api/get_data/admin_calls/get_downvotes_admin](/api/get_data/admin_calls/get_downvotes_admin) returns every sentence annotation which has been downvoted.
- [/api/get_data/admin_calls/get_annotations](/api/get_data/admin_calls/get_annotations) returns every new, manually annotated sentence.
- [/api/get_data/admin_calls/get_annotations_with_synonyms](/api/get_data/admin_calls/get_annotations_with_synonyms) returns every new, manually annotated sentence, as before. This time, however, it converts any of the highlighted entities to their most common form by consulting a list of synonyms. For example, the highligted entity might be "breast malignant neoplasm" and the API call would return this as "breast cancer".
- [/api/get_data/admin_calls/get_sentence_voting_data](/api/get_data/admin_calls/get_sentence_voting_data) returns the number of upvotes and downvotes for each reviewed sentence.
- [/api/get_data/admin_calls/get_user_voting_data](/api/get_data/admin_calls/get_user_voting_data) returns a list of the users, along with the sentences which they have upvoted and downvoted.
