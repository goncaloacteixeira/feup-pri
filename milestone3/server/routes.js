const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:8983/solr/movies',
  timeout: 1000
});

const ROWS = 20;

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

