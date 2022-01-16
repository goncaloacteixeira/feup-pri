from requests import get
from metrics import metrics_export_table
from precision_recall import curve

URL = 'http://localhost:8983/solr/movies/select'


def get_results(params: dict):
    return get(URL, params=params).json()['response']['docs']


def print_titles(dataset: list):
    for title in dataset:
        print('%s: %d %s' % (title['imdb_title_id'], title['year'], title['original_title']))


relevant = list(map(lambda el: el.strip(), open('matrix_qrels.txt').readlines()))

standard_params = {
    'q': 'title:matrix original_title:matrix description:(matrix neo) plot:(matrix neo) ',
    'wt': 'json',
    'defType': 'edismax'
}

standard_results = get_results(params=standard_params)

enhanced_params = {
    'q': '(original_title:matrix title:matrix) AND (description:neo plot:neo)',
    'wt': 'json',
    'qf': 'original_title^2 title description^2 plot^3',
    'defType': 'edismax'
}

enhanced_results = get_results(params=enhanced_params)

metrics_export_table(results=standard_results, relevant=relevant, filename='matrix_standard_results')
metrics_export_table(results=enhanced_results, relevant=relevant, filename='matrix_enhanced_results')

curve(results=standard_results, relevant=relevant, filename="matrix_standard_curve")
curve(results=enhanced_results, relevant=relevant, filename="matrix_enhanced_curve")
