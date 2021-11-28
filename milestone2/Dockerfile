FROM solr:8.10

COPY movie_data.json /data/movie_data.json

COPY movie_schema.json /data/movie_schema.json

COPY startup.sh /scripts/startup.sh

ENTRYPOINT ["/scripts/startup.sh"]
