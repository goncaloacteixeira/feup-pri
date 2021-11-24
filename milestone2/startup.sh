#!/bin/bash

precreate-core courses

# Start Solr in background mode so we can use the API to upload the schema
solr start

# Give some time for Solr to start
sleep 5

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/simple_schema.json \
    http://localhost:8983/solr/courses/schema

# Populate collection
bin/post -c courses /data/meic_courses.json

# Restart in foreground mode so we can access the interface
solr restart -f
