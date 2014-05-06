
/*
 * GET users listing.
 */

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var secrets = require('../secrets')
var mongoose = require("mongoose")
var User = require("../models/user")

console.info({
  returnURL: 'http://' + secrets.hostname + ':' + secrets.port + '/auth/google/return',
  realm: 'http://' + secrets.hostname + ':' + secrets.port
});

function init(app) {
  
  app.get('/me', function(req, res) {
    res.json(req.user)
  })

  app.put('/me', function(req, res) {
    console.log(req.body)
    User.findById(req.body._id, function(err, user) {
      if (err)
        res.send(err)

      user.phone = req.body.phone
      user.snapchat = req.body.snapchat
      user.emailNotification = req.body.emailNotification
      user.emailTime = req.body.emailTime
      user.smsNotification = req.body.smsNotification
      user.smsTime = req.body.smsTime

      user.save(function(err) {
        if(err)
          res.send(err)
        res.json(user)
      })
    })
  })

  app.get('/auth/google', passport.authenticate("google"));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://' + secrets.hostname + ':' + secrets.port);
  });

  app.get('/auth/google/return', passport.authenticate('google', { 
    successRedirect: 'http://' + secrets.hostname + ':' + secrets.port + '/#/me',
    failureRedirect: 'http://' + secrets.hostname + ':' + secrets.port + '/' 
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id,done);
  });

  passport.use(new GoogleStrategy({
      returnURL: 'http://' + secrets.hostname + ':' + secrets.port + '/auth/google/return',
      realm: 'http://' + secrets.hostname + ':' + secrets.port
    },
    function(identifier, profile, done) {

      User.findOne({ email: profile.emails[0].value }, function(err, user) {
        if(user) {
          user.lastLogin = new Date()
          user.save(done)
        } else {
          var user = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            firstLogin: new Date()
          });
          user.save(function(err, newUser) {
            if (err) throw err;
            done(null, newUser);
          });

        }
      });
    }
  ));
}

exports.init = init