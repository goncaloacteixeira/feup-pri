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


def fetch_movie_personal(conn: sqlite3.Connection):
    query = """SELECT * from movie_personal"""
    cursor = conn.execute(query)
    result = cursor.fetchall()

    movie_personal = []
    for x in result:
        x = dict(x)
        x["data_type"] = "personal"
        movie_personal.append(x)

    return movie_personal


def fetch_name(conn: sqlite3.Connection, imdb_name_id):
    query = """SELECT * from names WHERE imdb_name_id = ?"""
    cursor = conn.execute(query, (imdb_name_id,))
    result = cursor.fetchone()
    return dict(result) if result is not None else None


def fetch_names_from_movie(conn: sqlite3.Connection, imdb_title_id):
    query = """SELECT * from movie_personal WHERE imdb_title_id = ?"""
    cursor = conn.execute(query, (imdb_title_id,))
    result = cursor.fetchall()

    personal = []
    for r in result:
        r = dict(r)
        name = fetch_name(conn, r["imdb_name_id"])
        if name is not None:
            name["id"] = imdb_title_id + "_" + r["imdb_name_id"]
            person = {**r, **name}
            del person["imdb_title_id"]
            personal.append(person)

    return personal


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
    i = 0
    for movie in movies:
        rating = fetch_ratings_from_movie(conn, movie["imdb_title_id"])
        movie = {**movie, **rating}
        movie["personal"] = fetch_names_from_movie(conn, movie["imdb_title_id"])
        data.append(movie)

        if len(data) == 20000:
            with open('../data/data%d.json' % i, 'w') as fout:
                json.dump(data, fout, indent=2)
                data = []
                i += 1

    print("Finished read movies!")

    with open('../data/data%d.json' % i, 'w') as fout:
        json.dump(data, fout)

except sqlite3.Error as error:
    print('Error while connecting to sqlite:', error)

finally:
    if conn:
        conn.close()
        print("Connection closed!")
