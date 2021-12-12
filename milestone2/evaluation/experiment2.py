from requests import get
from metrics import metrics_export_table
from precision_recall import curve

URL = 'http://localhost:8983/solr/movies/select'


# This experiment should enhance the query system when searching
# for movies related to Toy Story franchise

def get_results(params: dict):
    return get(URL, params=params).json()['response']['docs']


def print_titles(dataset: list):
    for title in dataset:
        print('%s: %d %s %s %.1f' % (title['imdb_title_id'], title['year'], title['original_title'], title["genre"], title["weighted_average_vote"][0]))


relevant = list(map(lambda el: el.strip(), open('experiment2.txt').readlines()))

standard_params = {
    'q': 'plot:(toy woody) description:(toy woody)',
    'wt': 'json',
    'defType': 'edismax',
}

standard_results = get_results(params=standard_params)

enhanced_params = {
    'q': 'genre:animation original_title:toy plot:(toy woody) description:(toy woody)',
    'wt': 'json',
    'qf': 'description^3 original_title^2 genre',
    'defType': 'edismax',
}

enhanced_results = get_results(params=enhanced_params)

print_titles(enhanced_results)

metrics_export_table(results=standard_results, relevant=relevant, filename='experiment2_standard_results')
metrics_export_table(results=enhanced_results, relevant=relevant, filename='experiment2_enhanced_results')

curve(results=standard_results, relevant=relevant, filename="experiment2_standard_curve")
curve(results=enhanced_results, relevant=relevant, filename="experiment2_enhanced_curve")
