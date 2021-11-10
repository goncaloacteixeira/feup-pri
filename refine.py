import pandas as pd

# read csv
movies_df = pd.read_csv("datasets_original/IMDb_movies.csv")
names_df = pd.read_csv("datasets_original/IMDb_names.csv")
ratings_df = pd.read_csv("datasets_original/IMDb_ratings.csv")
title_df = pd.read_csv("datasets_original/IMDb_title_principals.csv")

def remove_incomplete_cols(df):

    cols_to_remove = []

    for col in df:
        if (df[col].isna().sum() / len(df)) > 0.5:
            cols_to_remove.append(col)
        
    return df.drop(cols_to_remove, axis=1)

movies_df = remove_incomplete_cols(movies_df)
names_df = remove_incomplete_cols(names_df)
ratings_df = remove_incomplete_cols(ratings_df)
title_df = remove_incomplete_cols(title_df)

movies_df.to_csv("datasets_refined/movies_refined.csv")
names_df.to_csv("datasets_refined/names_refined.csv")
ratings_df.to_csv("datasets_refined/ratings_refined.csv")
title_df.to_csv("datasets_refined/title_refined.csv")
