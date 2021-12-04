#!/bin/bash

precreate-core movies

# Start Solr in background mode so we can use the API to upload the schema
solr start

# Give some time for Solr to start
sleep 10

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/movie_schema.json \
    http://localhost:8983/solr/movies/schema

# Populate collection
bin/post -c movies /data/data.json

# Restart in foreground mode so we can access the interface
solr restart -f
