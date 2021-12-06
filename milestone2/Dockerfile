FROM solr:8.11

COPY ./data/data0.json /data/data0.json
COPY ./data/data1.json /data/data1.json
COPY ./data/data2.json /data/data2.json
COPY ./data/data3.json /data/data3.json
COPY ./data/data4.json /data/data4.json

COPY movie_schema.json /data/movie_schema.json

COPY startup.sh /scripts/startup.sh

ENTRYPOINT ["/scripts/startup.sh"]
