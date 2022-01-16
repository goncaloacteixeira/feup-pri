from requests import get
from metrics import metrics_export_table
from precision_recall import curve

URL = 'http://localhost:8983/solr/movies/select'


# This experiment should enhance the query system when searching
# for movies related to Harry Potter franchise

def get_results(params: dict):
    return get(URL, params=params).json()['response']['docs']


def print_titles(dataset: list):
    for title in dataset:
        print('%s: %d %s %s %.1f' % (title['imdb_title_id'], title['year'], title['original_title'], title["genre"], title["weighted_average_vote"][0]))


relevant = list(map(lambda el: el.strip(), open('experiment1.txt').readlines()))

standard_params = {
    'q': 'plot:(wizard magic harry) OR description:(wizard magic harry)',
    'wt': 'json',
    'defType': 'edismax',
    'rows': 20,
}

standard_results = get_results(params=standard_params)

enhanced_params = {
    'q': 'genre:fantasy plot:(wizard magic harry) OR description:(wizard magic harry)',
    'wt': 'json',
    'qf': 'description^2',
    'defType': 'edismax',
    'rows': 20,
}

enhanced_results = get_results(params=enhanced_params)

metrics_export_table(results=standard_results, relevant=relevant, filename='experiment1_standard_results')
metrics_export_table(results=enhanced_results, relevant=relevant, filename='experiment1_enhanced_results')

curve(results=standard_results, relevant=relevant, filename="experiment1_standard_curve")
curve(results=enhanced_results, relevant=relevant, filename="experiment1_enhanced_curve")

print_titles(enhanced_results)
