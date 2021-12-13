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
print()

# top 10 rated Drama movies with at least 100000 votes
params = {
    'q': 'mean_vote:* AND genre:Drama AND total_votes:[100000 TO *]',
    'sort': 'mean_vote desc',
    'fl': 'imdb_title_id, original_title, mean_vote, total_votes',
    'rows': 10
}

movies = get(SELECT_URL, params=params)
movies_json = json.loads(movies.text)["response"]["docs"]

print('top 10 rated Drama movie\'s with at least 100000 votes')
for i in range(len(movies_json)):
    doc = movies_json[i]
    print("#%d %s - %s - %.02f - %d" % (i+1, doc['imdb_title_id'], doc['original_title'], doc['mean_vote'][0], doc['total_votes'][0]))
print()

# best movie by country with at least 10000 votes
params = {
    'q': 'mean_vote:* AND total_votes:[10000 TO *]',
    'sort': 'mean_vote desc',
    'fl': 'imdb_title_id, original_title, mean_vote, total_votes',
    'rows': 1000,
    'group': 'true',
    'group.field': 'genre'
}

movies = get(SELECT_URL, params=params)
groups = json.loads(movies.text)['grouped']['genre']['groups']

print('Best movie\'s by genre with at least 10000 votes')
for group in groups:
    group_values = group['doclist']['docs'][0]
    print("> %s" % (group['groupValue']))
    print("\t>ID: %s" % group_values['imdb_title_id'])
    print("\t>Title: %s" % group_values['original_title'])
    print("\t>Total votes: %s" % group_values['total_votes'][0])
    print("\t>Mean vote: %s" % group_values['mean_vote'][0])