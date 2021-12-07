from requests import *
import json

# get movies where Tobey Maguire takes part in
params = {
    'q': '{!parent which="-_nest_path_:* *:*"}name:"Tobey Maguire"',
    'fl': 'original_title, year, imdb_title_id'
}

movies = get('http://localhost:8983/solr/movies/select', params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Movies Tobey Maguire took part in:')
for doc in movies_json:
    print("> %s - %s - %s" % (doc['imdb_title_id'], doc["original_title"], doc["year"][0]))

# ----