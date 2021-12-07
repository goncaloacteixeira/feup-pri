# Queries

- Get All movies performed by "Tobey Maguire":
```shell
curl 'http://localhost:8983/solr/movies/select' -d 'omitHeader=true' \
 --data-urlencode 'q={!parent which="-_nest_path_:* *:*"}name:"Tobey Maguire"' \ 
 --data-urlencode 'fl=*, [child]'
```
it will fetch all movies, and names, in which "Tobey Maguire" took part.

- Get All Spider Man titles where Peter Parker was a personage:
```shell
curl 'http://localhost:8983/solr/movies/select' -d 'omitHeader=true' \
 --data-urlencode 'q=original_title:"spider man" (description:"peter" OR plot:"peter")'  \ 
 --data-urlencode 'fl=original_title' \
 --data-urlencode 'q.op=AND'
```