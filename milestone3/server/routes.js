const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:8983/solr/movies',
  timeout: 1000
});

exports.searchMovie = function (req, res) {
  const search = req.params.query;

  const fields = [
    'original_title',
    'title',
    'description',
    'plot'
  ];

  const query = fields.map(function (value) {
    return value + ":" + search;
  });

  const params = {
    'q': query.join(' '),
    'q.op': 'OR',
    'wt': 'json',
    'defType': 'edismax',
    'qf': 'original_title^2 title^2',
    'rows': 10,
  };

  console.log(params);

  instance.get('/select', {params: params})
    .then(function (response) {
      console.log(response.data)
      res.json(response.data.response.docs)
    })
    .catch(function (error) {
      console.log(error)
    })
}

