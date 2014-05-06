
/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser')
var session      = require('express-session')
var morgan       = require('morgan')
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var baucis = require('baucis');
var app = express();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/lifetracker')

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'))
app.use(cookieParser()) // required before session.
app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}))
app.use(express.static(path.join(__dirname, 'public')));

// Setup API
baucis.model('entry', require('./models/entry').schema);
baucis.rest('entry');
app.use('/api', baucis());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
