#!/bin/bash
set -ex

python biocToSpacyDocBin.py --inBioc ../prisma/test.bioc.xml --docBin training_data.spacy 

python -m spacy init fill-config base_config.cfg config.cfg

python -m spacy train config.cfg --output ./ --paths.train ./training_data.spacy --paths.dev ./training_data.spacy

python spacyNER.py --model model-best --inBioc ../prisma/test.bioc.xml --outBioc nered.bioc.xml

