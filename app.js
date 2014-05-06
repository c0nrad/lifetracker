// LifeTracker

var express = require('express');
var cookieParser = require('cookie-parser')
var session      = require('express-session')
var bodyParser = require('body-parser');

var morgan       = require('morgan')
var http = require('http');
var path = require('path');
var baucis = require('baucis');
var app = express();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/lifetracker')
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);


var passport = require('passport')

var secrets = require('./secrets')

// all environments
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'))
app.use(bodyParser());
app.use(cookieParser()) // required before session.

app.use(session({
    secret: secrets.cookie_secret,
    store: new MongoStore({
      db : 'lifetracker',
    })
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  //console.log("user: ", req.user.name);
  next()
})

// Setup API
baucis.model('entry', require('./models/entry').schema);
baucis.rest('entry');
app.use('/api', baucis());

// Setup login
var UserRoutes = require('./routes/user');
UserRoutes.init(app)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Init controllers
snapchat = require('./controllers/snapchat')