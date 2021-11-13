import sqlite3
from sqlite3 import Error
import pandas as pd


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        # conn.execute("PRAGMA foreign_keys = 1")
        return conn
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)



def main():
    database = r"database.db"

    sql_create_movies_table = """ CREATE TABLE IF NOT EXISTS movies (
                                        imdb_title_id text primary key,
                                        title text,
                                        original_title text,
                                        year integer,
                                        date_published date,
                                        genre text,
                                        duration integer,
                                        country text,
                                        language text,
                                        production_company text,
                                        description text,
                                        reviews_from_users float,
                                        reviews_from_critics float
                                    ); """

    sql_create_names_table = """CREATE TABLE IF NOT EXISTS names (
                                    imdb_name_id text primary key,
                                    name text,
                                    birth_name text,
                                    bio text,
                                    spouses integer,
                                    divorces integer,
                                    spouses_with_children integer,
                                    children integer
                                );"""

    sql_create_movie_personal_table = """CREATE TABLE IF NOT EXISTS movie_personal (
                                            imdb_title_id text not null,
                                            imdb_name_id text not null,
                                            role text,
                                            foreign key (imdb_title_id) references movies(imdb_title_id),
                                            foreign key (imdb_name_id) references names,
                                            primary key (imdb_title_id, imdb_name_id)
                                            );"""

    sql_create_ratings_table = """CREATE TABLE IF NOT EXISTS movie_ratings (
                                                imdb_title_id text primary key,
                                                weighted_average_vote float,
                                                total_votes integer,
                                                mean_vote float,
                                                median_vote float,
                                                votes_10 integer,
                                                votes_9 integer,
                                                votes_8 integer,
                                                votes_7 integer,
                                                votes_6 integer,
                                                votes_5 integer,
                                                votes_4 integer,
                                                votes_3 integer,
                                                votes_2 integer,
                                                votes_1 integer,
                                                foreign key (imdb_title_id) references movies(imdb_title_id)
                                                );"""

    # create a database connection
    conn = create_connection(database)

    create_table(conn, sql_create_movies_table)
    create_table(conn, sql_create_names_table)
    create_table(conn, sql_create_movie_personal_table)
    create_table(conn, sql_create_ratings_table)

    # add movies data
    movies_df = pd.read_csv("refined_movies.csv")
    cursor = conn.execute('select * from movies')
    movies_columns = [description[0] for description in cursor.description]
    movies_df[movies_columns].to_sql('movies', conn, if_exists='append', index=False)

    # add names data
    names_df = pd.read_csv("refined_names.csv", low_memory=False)
    cursor = conn.execute('select * from names')
    names_columns = [description[0] for description in cursor.description]
    names_df[names_columns].to_sql('names', conn, if_exists='append', index=False)

    # add directors
    directors = [str(x).split(', ') for x in movies_df["director"]]
    movie_directors_df = movies_df[["imdb_title_id"]]
    movie_directors_df.insert(1, "name", directors)
    movie_directors_df = movie_directors_df.explode("name").drop_duplicates()
    movie_directors_df = pd.merge(movie_directors_df, names_df, on="name")
    movie_directors_df["role"] = "director"

    movie_directors_df = movie_directors_df[["imdb_title_id", "imdb_name_id", "role"]]

    # add cast
    cast = [str(x).split(', ') for x in movies_df["actors"]]
    movie_cast_df = movies_df[["imdb_title_id"]]
    movie_cast_df.insert(1, "name", cast)
    movie_cast_df = movie_cast_df.explode("name").drop_duplicates()
    movie_cast_df = pd.merge(movie_cast_df, names_df, on="name")
    movie_cast_df["role"] = "actor"

    movie_cast_df = movie_cast_df[["imdb_title_id", "imdb_name_id", "role"]]
    df = movie_cast_df.append(movie_directors_df)

    # add principals
    principals_df = pd.read_csv("refined_title_principals.csv", low_memory=False)
    principals_df["category"].replace({"actress": "actor"}, inplace=True)
    principals_df = principals_df[["imdb_title_id", "imdb_name_id", "category"]].rename(columns={"category": "role"})

    df = df.append(principals_df)

    df.to_sql('movie_personal', conn, if_exists='replace', index=False)

    # add ratings data
    ratings_df = pd.read_csv("refined_ratings.csv")
    cursor = conn.execute('select * from movie_ratings')
    ratings_columns = [description[0] for description in cursor.description]
    ratings_df[ratings_columns].to_sql('movie_ratings', conn, if_exists='replace', index=False)

    print("Database created Successfully!")


if __name__ == '__main__':
    main()
