import pandas as pd

# read csv
movies_df = pd.read_csv("IMDb movies.csv", parse_dates=["date_published"])
names_df = pd.read_csv("IMDb names.csv")
ratings_df = pd.read_csv("IMDb ratings.csv")
title_df = pd.read_csv("IMDb title_principals.csv")


def remove_incomplete_cols(df):
    cols_to_remove = []

    for col in df:
        if (df[col].isna().sum() / len(df)) > 0.5:
            cols_to_remove.append(col)

    return df.drop(cols_to_remove, axis=1)


# refine movies table
movies_df = remove_incomplete_cols(movies_df)
movies_df = movies_df.drop(["avg_vote", "votes", "date_published"], axis=1)  # duplicates columns
movies_df = movies_df.drop(83917)  # desformated data

movie_metadata_df = pd.read_csv('MovieSummaries/movie.metadata.tsv', sep='\t', header=None, usecols=[0, 2], names=['id', 'original_title'])
plot_summaries_df = pd.read_csv('MovieSummaries/plot_summaries.tsv', sep='\t', header=None, names=['id', 'plot'])

extra_df = pd.merge(movie_metadata_df, plot_summaries_df, on='id')
extra_df = extra_df.groupby(['original_title']).agg({'plot': lambda x: max(x, key=len)})

movies_df = pd.merge(movies_df, extra_df, on='original_title', how='left')

movies_df.to_csv("refined_movies.csv", index=False)
print("Refined Movies")

# refine names table
names_df = remove_incomplete_cols(names_df)
names_df.to_csv("refined_names.csv", index=False)
print("Refined Names")

# refine ratings table
ratings_df = remove_incomplete_cols(ratings_df)
ratings_df = ratings_df.drop(list(ratings_df.columns)[15:], axis=1)  # irrelevant columns
ratings_df.to_csv("refined_ratings.csv", index=False)
print("Refined Ratings")

# refine title table
title_df = title_df.drop("job", axis=1)
title_df.to_csv("refined_title_principals.csv", index=False)
print("Refined Title Principals")
