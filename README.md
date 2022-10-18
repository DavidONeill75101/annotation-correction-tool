## Various Commands

### Set up instructions

To set up the current web interface with some data, follow the instructions below. A quick overview: first you need to install some prerequisites including a database, NodeJS and some Python packages. Then you need to get the database set up with some text to annotate, and entities to annotate with (along with some other things). Then you can run it.

All commands are run from the terminal in the root directory of this project. You'll need to clone it and then you make edits to it.

#### Prerequisities
- MySQL
  - Download and install a MySQL server. XAMPP is a nice option as it comes with phpmyadmin and some other things: https://www.apachefriends.org/
  - Start the MySQL server and the Apache server (needed for phpmyadmin later)
- NodeJS
  - Install it from https://nodejs.org/en/download/
- A nice terminal can be useful. On Windows, you could use Git-bash which comes packaged with git for windows: https://gitforwindows.org/
- For the setup below, you'll need a couple Python packages installed
  - ```pip install pronto spans_and_trees```

#### Getting the database set up
- Create a new database in MySQL
  - Go to https://localhost/phpmyadmin to manage the databases and create a new empty database named annotator
- Set up the DATABASE_ENV variable to point towards the database
  - The DATABASE_URL takes the form of ```mysql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]```
  - In a terminal (like Git-bash) you could set it with export like below. These use the default root settings for XAMPP (i.e. no password) and a database name of annotator.
  - ```export DATABASE_URL=mysql://root:@localhost:3306/annotator```
  - This either needs to be run before running any of the database loading scripts, or push in your ```.bash_profile``` or ```.bash_rc``` file so it's preloaded.
- Install node modules (like React, etc)
  - In the root directory of this project, run ```npm install``` from the terminal.
- The database schema is described in the file [prisma/schema.prisma](https://github.com/jakelever/react_annotator/blob/main/prisma/schema.prisma). Get prisma to load up the database schema into MySQL with the command below.
  - ```npx prisma migrate dev --name init```
  
#### Start populating the database
- Insert some dummy users and relation types
  - ```npx prisma db seed```
- Download data sources for gene names and cancer types and put them in the same directory.
  - Gene names: https://ftp.ncbi.nih.gov/gene/DATA/gene_info.gz
  - Cancer types: https://github.com/DiseaseOntology/HumanDiseaseOntology/raw/main/src/ontology/doid.obo
- Generate a combined file with the entity names, synonyms, identifiers and other info and point --sourceDir to where you store the gene/cancer files.
  - ```python prisma/combineEntitySources.py --sourceDir ~/Downloads/ --include gene,disease --outFile entities.json```
- Load the entities into the database
  - ```python prisma/loadEntitiesIntoDB.py --entities entities.json```
- Load a test document into the database
  - ```python prisma/loadDocs.py --pmc_file prisma/PMC6917032.xml```
- Pull the entity types out
  - ```npm run prepop```

#### Run the server
- To run the development version of the server (that does nice updates whenever you change code), run: 
  - ```npm run dev```
- Look at it:
   - http://localhost:3000

