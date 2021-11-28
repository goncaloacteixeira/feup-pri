import json
import sqlite3


def fetch_movies(conn: sqlite3.Connection):
    query = """SELECT * from movies
    """
    cursor = conn.execute(query)
    result = cursor.fetchall()

    return [dict(x) for x in result]


def fetch_name(conn: sqlite3.Connection, imdb_name_id):
    query = """SELECT * from names WHERE imdb_name_id = ?"""

    cursor = conn.execute(query, (imdb_name_id,))
    name = cursor.fetchone()

    return dict(name) if name is not None else None


def fetch_names_from_movie(conn: sqlite3.Connection, imdb_id):
    query = """SELECT * from movie_personal WHERE imdb_title_id = ?"""

    cursor = conn.execute(query, (imdb_id,))
    personal = cursor.fetchall()

    full_personal = []

    for person in personal:
        name = fetch_name(conn, person["imdb_name_id"])
        if name is not None:
            person = dict(person)
            del person["imdb_title_id"]
            full_personal.append({**person, **name})

    return full_personal


def fetch_ratings_from_movie(conn: sqlite3.Connection, imdb_id):
    query = """SELECT * from movie_ratings WHERE imdb_title_id = ?"""

    cursor = conn.execute(query, (imdb_id,))
    rating = cursor.fetchone()

    return dict(rating)


try:
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    print('Connection made successfully')

    movies = []
    print("Joining movies on json format...")
    for movie in fetch_movies(conn):
        personal = fetch_names_from_movie(conn, movie["imdb_title_id"])
        movie["personal"] = personal
        rating = fetch_ratings_from_movie(conn, movie["imdb_title_id"])
        movie = {**movie, **rating}
        movies.append(movie)
    print("Finished read: ", len(movies), "movies read!")

    with open('movie_data.json', 'w') as fout:
        json.dump(movies, fout, indent=2)

except sqlite3.Error as error:
    print('Error while connecting to sqlite:', error)

finally:
    if conn:
        conn.close()
        print("Connection closed!")
