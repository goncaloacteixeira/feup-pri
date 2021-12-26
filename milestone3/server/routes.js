const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:8983/solr/movies',
    timeout: 1000
});

const ROWS = 20;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500/'

exports.getPoster = function (req, res) {
    const id = req.params.id;

    axios.get(TMDB_URL + 'find/' + id, {
        params: {
            api_key: TMDB_API_KEY,
            external_source: 'imdb_id'
        }
    }).then(results => {
        let movies = results.data.movie_results;
        if (movies.length === 0) {
            res.send({message: 'ERR_NO_MOVIES'});
            return;
        }

        const poster = TMDB_IMAGE_URL + results.data.movie_results[0].poster_path;

        res.send({
            message: {
                poster: poster,
                movie: results.data.movie_results[0],
            }
        });
    });

}


exports.searchMovie = function (req, res) {
    const search = req.query.query;
    const page = req.query.page ? req.query.page - 1 : 0

    const fields = [
        'original_title',
        'title',
        'description',
        'plot'
    ];

    const query = fields.map(function (value) {
        return value + ":" + search;
    });

    let q = '(' + query.join(' ') + ') ';
    if (req.query.language) {
        q += "AND (language:" + req.query.language.join(" ") + ") "
    }
    if (req.query.genre) {
        q += "AND (genre:" + req.query.genre.join(" ") + ") "
    }

    q += `AND (year:[${req.query.start_year} TO ${req.query.end_year}]) `

    let params = {
        'q': q,
        'q.op': 'OR',
        'wt': 'json',
        'defType': 'edismax',
        'qf': 'original_title^2 title^2',
        'rows': ROWS,
        'fl': '*,[child]',
        'start': page * ROWS
    };

    if (req.query.sort !== "") {
        params = {...params, sort: req.query.sort + " " + req.query.direction}
    }

    console.log(params);

    instance.get('/select', {params: params})
        .then(function (response) {
            const data = [...new Map(response.data.response.docs.map((item, key) => [item['imdb_title_id'], item])).values()]

            const to_send = {
                movies: data,
                total: response.data.response.numFound,
                time: response.data.responseHeader.QTime / 1000.0,
                pages: Math.ceil(response.data.response.numFound / ROWS),
            }

            res.json(to_send)
        })
        .catch(function (error) {
            console.log(error)
        })
}

exports.getPerson = function (req, res) {
    const id = req.params.id;

    axios.get(TMDB_URL + 'find/' + id, {
        params: {
            api_key: TMDB_API_KEY,
            external_source: 'imdb_id'
        }
    }).then(results => {
        let personResults = results.data.person_results;
        if (personResults.length === 0) {
            res.send({message: 'ERR_NO_MOVIES'});
            return;
        }

        const personId = results.data.person_results[0].id;

        axios.get(TMDB_URL + 'person/' + personId, {
            params: {
                api_key: TMDB_API_KEY
            }
        }).then(result => {
            res.send({
                message: result.data
            });
        })
    });
}

exports.configuration = function (req, res) {
    axios.get(TMDB_URL + '/configuration', {
        params: {
            api_key: TMDB_API_KEY
        }
    }).then(result => res.send(result.data));
}

