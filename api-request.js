var https = require("https");

var username = "73b748866a85d50630ac077404fa2d64";
var password = "098306203219f8226f65a633b00fd789";
var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');

module.exports = (key, callback) => {
  var request = https.request({
      method: "GET",
      host: "api.intrinio.com",
      path: "/companies?ticker=" + key,
      headers: {
          "Authorization": auth
      }
  }, response => {
      var json = "";
      response.on('data', chunk => {
          json += chunk;
      });
      response.on('end', () => {
          callback(JSON.parse(json));
      });
  });

  request.end();
}
