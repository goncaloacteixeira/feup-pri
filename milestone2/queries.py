from requests import *
import json

SELECT_URL = 'http://localhost:8983/solr/movies/select'

# get movies where Tobey Maguire takes part in
params = {
    'q': '{!parent which="-_nest_path_:* *:*"}name:"Tobey Maguire"',
    'fl': 'original_title, year, imdb_title_id',
    'rows': 1000
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Movies Tobey Maguire took part in:')
for doc in movies_json:
    print("> %s - %s - %s" % (doc['imdb_title_id'], doc["original_title"], doc["year"][0]))

# get drama movies from the 20's, sorted by year asc and mean vote desc
params = {
    'q': 'title:* AND genre:drama AND year:[1920 TO 1930]',
    'sort': 'year asc, mean_vote desc',
    'fl': '*,[child]',
    'rows': 1000
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Drama movies from the 20\'s')
for doc in movies_json:
    print("> %s - %s - %d - %.02f" % (doc['imdb_title_id'], doc['original_title'], doc['year'], doc['mean_vote'][0]))
