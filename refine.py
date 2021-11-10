import pandas as pd

# read csv
movies_df = pd.read_csv("IMDb movies.csv")
names_df = pd.read_csv("IMDb names.csv")
ratings_df = pd.read_csv("IMDb ratings.csv")
title_df = pd.read_csv("IMDb title_principals.csv")

def remove_incomplete_cols(df):

    cols_to_remove = []

    for col in df:
        if (df[col].isna().sum() / len(df)) > 0.5:
            cols_to_remove.append(col)
        
    return df.drop(cols_to_remove, axis=1)

movies_df = remove_incomplete_cols(movies_df)
movies_df.to_csv("refined_movies.csv")
print("Refined Movies")
names_df = remove_incomplete_cols(names_df)
names_df.to_csv("refined_names.csv")
print("Refined Names")
ratings_df = remove_incomplete_cols(ratings_df)
ratings_df.to_csv("refined_ratings.csv")
print("Refined Ratings")
title_df = remove_incomplete_cols(title_df)
title_df.to_csv("refined_title_principals.csv")
print("Refined Title Principals")