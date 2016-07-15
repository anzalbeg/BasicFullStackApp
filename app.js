/*eslint-env node, express*/
//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');


// create a new express server
var app = express();
var request = require('request');

// create a new viewing engine
app.set('views', path.join(__dirname, 'views'));

// create a new Temaplting engine
app.engine('html', require('ejs').renderFile);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.set('view engine','html');
app.use('/', routes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
