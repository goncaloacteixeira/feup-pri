import pandas as pd


# METRICS TABLE
# Define custom decorator to automatically calculate metric based on key
metrics = {}
metric = lambda f: metrics.setdefault(f.__name__, f)

@metric
def ap(results, relevant):
    """Average Precision"""

    relevant_index = []
    index = 0
    for res in results:
        if (index != 0 and res['imdb_title_id'] in relevant) or (index == 0 and res['imdb_title_id'][0] in relevant):
            relevant_index.append(index)
        index = index + 1

    if len(relevant_index) == 0:
        return 0

    precision_values = [
        len([
            doc
            for doc in results[:idx]
            if (index != 0 and doc['imdb_title_id'] in relevant) or (index == 0 and doc['imdb_title_id'][0] in relevant)
        ]) / idx
        for idx in range(1, len(results) + 1)
    ]
    
    precision_sum = 0
    for ind in relevant_index:
        precision_sum = precision_sum + precision_values[ind]

    return precision_sum/len(relevant_index)

@metric
def p10(results, relevant, n=10):
    """Precision at N"""
    return len([doc for doc in results[:n] if doc['imdb_title_id'] in relevant])/n

def calculate_metric(key, results, relevant):
    return metrics[key](results, relevant)

# Define metrics to be calculated
evaluation_metrics = {
    'ap': 'Average Precision',
    'p10': 'Precision at 10 (P@10)'
}

def metrics_export_table(results: list, relevant: list, filename: str):
    df = pd.DataFrame([['Metric','Value']] +
        [
            [evaluation_metrics[m], calculate_metric(m, results, relevant)]
            for m in evaluation_metrics
        ]
    )

    with open(filename + '.tex','w') as tf:
        tf.write(df.to_latex(header=0))

    return df