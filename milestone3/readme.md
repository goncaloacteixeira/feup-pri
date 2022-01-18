# Information Retrieval and Processing

## Requirements

- node >16.0
- docker
- python

## Installation and Setup

- on `solr/`
  - on `data/` run `pip install gdown` and then `python data.py` to fetch the dataset
  - on `/` run `docker build . -t solr_pri`
  - on `/` run `docker run -p 8983:8983 solr_pri`
  - This will take a while since the dataset is quite large, then Solr will be available on port 8983
- on `backend/`
  - run `npm install`
  - set TMDB_API_KEY accordingly, if you don't have a key you will need to generate one [here](https://developers.themoviedb.org/3/getting-started/introduction)
  - run `npm start`
  - the backend will be available on port 9000
- on `client/`
  - run `npm install`
  - run `npm start`
  - the frontend will be available on port 3000

You are all set, the system is now ready to be used and/or tested!