FROM solr:8.11

COPY data.json /data/data.json

COPY movie_schema.json /data/movie_schema.json

COPY startup.sh /scripts/startup.sh

ENTRYPOINT ["/scripts/startup.sh"]
