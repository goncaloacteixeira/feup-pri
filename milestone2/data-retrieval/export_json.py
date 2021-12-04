import json
import sqlite3


def fetch_movies(conn: sqlite3.Connection):
    query = """SELECT * from movies
    """
    cursor = conn.execute(query)
    result = cursor.fetchall()

    movies = []
    for x in result:
        x = dict(x)
        x["data_type"] = "movie"
        x["genre"] = x["genre"].split(", ")
        if x["country"] is not None:
            x["country"] = x["country"].split(", ")
        if x["language"] is not None:
            x["language"] = x["language"].split(", ")
        movies.append(x)

    return movies


def fetch_names(conn: sqlite3.Connection):
    query = """SELECT * from names"""

    cursor = conn.execute(query)
    result = cursor.fetchall()

    names = []
    for x in result:
        x = dict(x)
        x["data_type"] = "name"
        names.append(x)

    return names


def fetch_move_personal(conn: sqlite3.Connection):
    query = """SELECT * from movie_personal"""
    cursor = conn.execute(query)    
    result = cursor.fetchall()

    movie_personal = []
    for x in result:
        x = dict(x)
        x["data_type"] = "personal"
        movie_personal.append(x)
    
    return movie_personal


def fetch_ratings_from_movie(conn: sqlite3.Connection, imdb_id):
    query = """SELECT * from movie_ratings WHERE imdb_title_id = ?"""

    cursor = conn.execute(query, (imdb_id,))
    rating = cursor.fetchone()

    return dict(rating)


try:
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    print('Connection made successfully')

    data = []
    print("Joining movies on json format...")
    movies = fetch_movies(conn)
    for movie in movies:
        # array with imdb_name_id's
        # personal = fetch_names_from_movie(conn, movie["imdb_title_id"])
        # movie["personal"] = personal
        rating = fetch_ratings_from_movie(conn, movie["imdb_title_id"])
        movie = {**movie, **rating}
        data.append(movie)
        print("Reading: {0}/{1} movies ({2:.2f}%)".format(len(data), len(movies), len(data)/len(movies)*100), end="\r")
    
    print("\nFinished read movies!")

    acc = len(data)

    names = fetch_names(conn)
    for name in names:
        # participations = fetch_movies_from_name(conn, name["imdb_name_id"])
        # name["movies"] = participations
        data.append(name)
        print("Reading:{0}/{1} names ({2:.2f}%)".format(len(data) - acc, len(names), (len(data) - acc)/len(names)*100), end="\r")

    print("\nFinished read names!")

    acc = len(data)

    personal = fetch_move_personal(conn)
    for relation in personal:
        # participations = fetch_movies_from_name(conn, name["imdb_name_id"])
        # name["movies"] = participations
        data.append(relation)
        print("Reading:{0}/{1} relations ({2:.2f}%)".format(len(data) - acc, len(personal), (len(data) - acc)/len(personal)*100), end="\r")

    print("\nFinished read relations!")


    with open('data.json', 'w') as fout:
        json.dump(data, fout, indent=2)

except sqlite3.Error as error:
    print('Error while connecting to sqlite:', error)

finally:
    if conn:
        conn.close()
        print("Connection closed!")
