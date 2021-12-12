from requests import *
import json

SELECT_URL = 'http://localhost:8983/solr/movies/select'

# get movies where Tobey Maguire takes part in
params = {
    'q': '{!parent which="-_nest_path_:* *:*"}name:"Tobey Maguire" AND role:actor',
    'fl': 'original_title, year, imdb_title_id',
    'rows': 1000,
    'sort': 'year desc'
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Movies Tobey Maguire took part in:')
for doc in movies_json:
    print("> %s - %s - %s" % (doc['imdb_title_id'], doc["original_title"], doc["year"]))

print()
# get drama movies from the 20's with at least 8.0 as mean vote, sorted by year asc and mean vote desc
params = {
    'q': 'title:* AND genre:drama AND year:[1920 TO 1930] AND mean_vote:[8.0 TO *]',
    'sort': 'year asc, mean_vote desc',
    'fl': '*,[child]',
    'rows': 1000
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Drama movies from the 20\'s:')
for doc in movies_json:
    print("> %s - %s - %d - %.02f" % (doc['imdb_title_id'], doc['original_title'], doc['year'], doc['mean_vote'][0]))

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


# Top actors with most participations in movies (Not woking)
params = {
    'q': 'name:*',
    'fl': '*,[child]',
    'rows': 10,
    'group': 'true',
    'group.field': 'imdb_name_id',
    'group.ngroups': 'true'
}

movies = get(SELECT_URL, params=params)
groups = json.loads(movies.text)['grouped']['imdb_name_id']['groups']
print(groups[0]['doclist']['docs'])
#movies_json = json.loads(movies.text)["response"]["docs"]

#print('Top actor\'s with most participations')
#for doc in movies_json:
#    print("> %s - %s - %d - %.02f" % (doc['imdb_title_id'], doc['original_title'], doc['year'], doc['mean_vote'][0]))

#print(movies_json)


# top 10 rated Drama movies with at least 100000 votes
params = {
    'q': 'mean_vote:* AND genre:Drama AND total_votes:[100000 TO 999999999]',
    'sort': 'mean_vote desc',
    'fl': 'imdb_title_id, original_title, mean_vote, total_votes',
    'rows': 10
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Top 10 rated movies\'s')
for i in range(len(movies_json)):
    doc = movies_json[i]
    print("#%d %s - %s - %.02f - %d" % (i+1, doc['imdb_title_id'], doc['original_title'], doc['mean_vote'][0], doc['total_votes'][0]))

# Use uf to get movies with word Crime in the title ignoring genre
params = {
    'q': 'title:Crime AND genre:Crime',
    'uf': 'title',
    'sort': 'mean_vote desc',
    'fl': 'imdb_title_id, original_title, mean_vote, total_votes',
    'rows': 10
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('Movie\'s with the word Crime in title')
for i in range(len(movies_json)):
    doc = movies_json[i]
    print("#%d %s - %s - %.02f - %d" % (i+1, doc['imdb_title_id'], doc['original_title'], doc['mean_vote'][0], doc['total_votes'][0]))

