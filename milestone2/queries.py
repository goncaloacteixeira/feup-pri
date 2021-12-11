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
    print("> %s - %s - %s" % (doc['imdb_title_id'], doc["original_title"], doc["year"]))

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


# top 10 rated movies
params = {
    'q': 'mean_vote:*',
    'sort': 'mean_vote desc',
    'fl': 'imdb_title_id, original_title, mean_vote',
    'rows': 10
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Top 10 rated movies\'s')
for i in range(len(movies_json)):
    doc = movies_json[i]
    print("#%d %s - %s - %.02f" % (i+1, doc['imdb_title_id'], doc['original_title'], doc['mean_vote'][0]))


# worst 10 rated movies
params = {
    'q': 'mean_vote:*',
    'sort': 'mean_vote asc',
    'fl': 'imdb_title_id, original_title, mean_vote',
    'rows': 10
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Worst 10 rated movies\'s')
for i in range(len(movies_json)):
    doc = movies_json[i]
    print("#%d %s - %s - %.02f" % (i+1, doc['imdb_title_id'], doc['original_title'], doc['mean_vote'][0]))


# Top actors with most participations (Not woking)
params = {
    'q': 'name:*',
    'fl': '*,[child]',
    'rows': 10,
    'group': 'true',
    'group.field': 'imdb_name_id',
    'group.ngroups': 'true'
}

movies = get(SELECT_URL, params=params)
print(json.loads(movies.text))
movies_json = json.loads(movies.text)["response"]["docs"]

#print('Top actor\'s with most participations')
#for doc in movies_json:
#    print("> %s - %s - %d - %.02f" % (doc['imdb_title_id'], doc['original_title'], doc['year'], doc['mean_vote'][0]))

print(movies_json)
