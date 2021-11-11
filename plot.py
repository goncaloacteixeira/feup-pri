import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import pprint

pd.set_option("display.max_columns", None)
pd.set_option("display.max_rows", None)

def plot_number_movies_per_year():

    # read csv
    movies_df = pd.read_csv("refined_movies.csv")
    
    # create serie to plot
    movies_year_serie = movies_df.groupby(movies_df["year"]).count()["imdb_title_id"]

    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_year_serie.plot.bar()

    plt.show()


def plot_number_movies_per_decade():

    # read csv
    movies_df = pd.read_csv("refined_movies.csv")

    # create serie to plot
    min_year = movies_df["year"].min()
    max_year = movies_df["year"].max()
    movies_year_serie = movies_df.groupby(pd.cut(movies_df["year"], np.arange(min_year, max_year, 10))).count()["imdb_title_id"]

    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_year_serie.plot.bar()

    plt.show()


def plot_number_movies_per_average_votes_1():
    
    # read csv
    movies_df = pd.read_csv("refined_movies.csv")
    ratings_df = pd.read_csv("refined_ratings.csv")

    movies_ratings_df = pd.merge(movies_df, ratings_df, on="imdb_title_id", how="inner")

    # create serie to plot
    movies_average_ratings_serie = movies_ratings_df.groupby(pd.cut(movies_ratings_df["weighted_average_vote"], np.arange(1, 10, 0.1))).count()["imdb_title_id"]
    
    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_average_ratings_serie.plot.bar()

    plt.show()


def plot_number_movies_per_average_votes_1():
    
    # read csv
    movies_df = pd.read_csv("refined_movies.csv")
    ratings_df = pd.read_csv("refined_ratings.csv")

    movies_ratings_df = pd.merge(movies_df, ratings_df, on="imdb_title_id", how="inner")

    # create serie to plot
    movies_average_ratings_serie = movies_ratings_df.groupby(pd.cut(movies_ratings_df["weighted_average_vote"], np.arange(1, 10, 0.1))).count()["imdb_title_id"]
    
    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_average_ratings_serie.plot.bar()

    plt.show()


def plot_number_movies_per_average_votes_2():
    
    # read csv
    movies_df = pd.read_csv("refined_movies.csv")
    ratings_df = pd.read_csv("refined_ratings.csv")

    movies_ratings_df = pd.merge(movies_df, ratings_df, on="imdb_title_id", how="inner")

    # create serie to plot
    movies_average_ratings_serie = movies_ratings_df.groupby(pd.cut(movies_ratings_df["weighted_average_vote"], np.arange(1, 10, 1))).count()["imdb_title_id"]
    
    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_average_ratings_serie.plot.bar()

    plt.show()


def circular_plot_genre_movies():
    # read csv
    movies_df = pd.read_csv("refined_movies.csv")
    
    # create serie to plot
    movies_genre_serie = movies_df.groupby(movies_df["genre"]).count()["imdb_title_id"]
    genre_dict = {}
    for (genres, num_movies) in movies_genre_serie.iteritems():
        genres_list = genres.split(", ")
        for genre in genres_list:
            if genre in genre_dict:
                genre_dict[genre] += num_movies
            else:
                genre_dict[genre] = num_movies

    new_genre_dict = {}
    new_genre_dict["others"] = 0
    for genre in list(genre_dict):
        if genre_dict[genre] < 4000:
            new_genre_dict["others"] +=genre_dict[genre]
            genre_dict.pop(genre, None)
        else:
            new_genre_dict[genre] = genre_dict[genre]

    genre_dict = new_genre_dict

    movies_genre_serie = pd.Series(genre_dict)

    # create plot
    movies_genre_serie.plot.pie()

    plt.ylabel("")
    plt.show()


def plot_number_people_per_movie():

    # read csv
    title_principals_df = pd.read_csv("refined_title_principals.csv")
    
    # create serie to plot
    people_movie_serie = title_principals_df.groupby(title_principals_df["ordering"]).count()["imdb_title_id"]

    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    people_movie_serie.plot.bar()

    plt.show()


def plot_movie_duration_per_movie():

    # read csv
    movies_df = pd.read_csv("refined_movies.csv")

    # create serie to plot
    min_duration = movies_df["duration"].min()
    max_duration = movies_df["duration"].max()
    movies_duration_serie = movies_df.groupby(pd.cut(movies_df["duration"], np.arange(min_duration, 240, 10))).count()["imdb_title_id"]

    print(movies_duration_serie)

    # configure plot
    plt.rcParams.update({"font.size": 6})
    plt.ylabel("Nº movies")

    # create plot
    movies_duration_serie.plot.bar()

    plt.show()


plot_movie_duration_per_movie()
