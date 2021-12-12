from requests import get
from metrics import metrics_export_table
from precision_recall import curve

URL = 'http://localhost:8983/solr/movies/select'


# This experiment should enhance the query system when searching
# for movies related to Tobey Maguire (which is known for spider man movies)

def get_results(params: dict):
    return get(URL, params=params).json()['response']['docs']


def print_titles(dataset: list):
    for title in dataset:
        print('%s: %d %s %s %.1f' % (title['imdb_title_id'], title['year'], title['original_title'], title["genre"], title["weighted_average_vote"][0]))


relevant = list(map(lambda el: el.strip(), open('experiment3.txt').readlines()))

standard_params = {
    'q': '{!parent which="title:*"}name:"tobey maguire"',
    'wt': 'json',
}

standard_results = get_results(params=standard_params)

enhanced_params = {
    'q': '{!parent which="title:*"}name:"tobey maguire"',
    'wt': 'json',
    'fq': 'genre:sci-fi',
    'rows': 100
}

enhanced_results = get_results(params=enhanced_params)

print_titles(enhanced_results)

metrics_export_table(results=standard_results, relevant=relevant, filename='experiment3_standard_results')
metrics_export_table(results=enhanced_results, relevant=relevant, filename='experiment3_enhanced_results')

curve(results=standard_results, relevant=relevant, filename="experiment3_standard_curve")
curve(results=enhanced_results, relevant=relevant, filename="experiment3_enhanced_curve")
