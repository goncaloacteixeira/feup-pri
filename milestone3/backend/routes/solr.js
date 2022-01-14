const express = require('express');
const router = express.Router();
const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8983/solr/movies',
    timeout: 1000
});
const ROWS = 20;


router.get('/movies', function(req, res) {
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

    console.log()

    if (req.query.sort !== "") {
        params = {...params, sort: req.query.sort + " " + req.query.direction}
    }

    instance.get('/select', {params: params})
        .then(function (response) {
            const data = [...new Map(response.data.response.docs.map((item) => [item['imdb_title_id'], item])).values()]

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
});

router.get('/people', (req, res) => {
    const search = req.query.query;
    const page = req.query.page ? req.query.page - 1 : 0

    const fields = [
        'name',
        'birth_name',
        'bio'
    ];

    const query = fields.map(function (value) {
        return value + ":" + search;
    });

    let q = '(' + query.join(' ') + ') ';

    let params = {
        'q': q,
        'q.op': 'OR',
        'wt': 'json',
        'defType': 'edismax',
        'qf': 'name^2',
        'rows': ROWS,
        'start': page * ROWS
    };

    instance.get('/select', {params: params})
        .then(function (response) {
            const data = [...new Map(response.data.response.docs.map((item, key) => [item['imdb_name_id'], item])).values()]

            const to_send = {
                people: data,
                total: response.data.response.numFound,
                time: response.data.responseHeader.QTime / 1000.0,
                pages: Math.ceil(response.data.response.numFound / ROWS),
            }

            res.json(to_send)
        })
        .catch(function (error) {
            console.log(error)
        })
})


module.exports = router;
