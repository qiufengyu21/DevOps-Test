var request = require('request-promise');
const options = {
  method: 'GET',
  url: 'http://127.0.0.1/researchers.html'
};


request(options)
  .then(function (response) {
    // Request was successful, use the response object at will
    console.log(response);
  })
  .catch(function (err) {
    // Something bad happened, handle the error
    console.log(err);
  })
