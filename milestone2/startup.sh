#!/bin/bash

precreate-core movies

# Start Solr in background mode so we can use the API to upload the schema
solr start

# Give some time for Solr to start
sleep 2

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/movie_schema.json \
    http://localhost:8983/solr/movies/schema

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/names_schema.json \
    http://localhost:8983/solr/movies/schema

# Populate collection
# send each split file
BULK_FILES=/data/data*.json
for f in $BULK_FILES; do
    curl -X POST -H 'Content-type:application/json' \
    --data-binary @$f \
    'http://localhost:8983/solr/movies/update/json/docs?split=/|/personal'
done

# Restart in foreground mode so we can access the interface
solr restart -f
