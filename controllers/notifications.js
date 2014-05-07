var CronJob = require('cron').CronJob;
var User = require("../models/user")
var Entry = require('../models/entry').model
var async = require('async')
var moment = require('moment')
var nodemailer = require('nodemailer')
var secrets = require('../secrets')

var transport = nodemailer.createTransport("SMTP", {
    auth: {
        user: secrets.emailAddress,
        pass: secrets.emailPass
    }
});

// Message object
var message = {

    from: 'LifeTracker Admin <lifetrackersite@gmail.com>',
    to: '"Receiver Name" <poptarts4liffe@gmail.com>',
    subject: 'LifeTracker Reminder',

    headers: {
        'X-Laziness-level': 1000
    },

    // plaintext body
    text: "Howdy there!\n\
\n\
Just a friendly reminder to fill out your LifeTracker entry for today. Your happiness is in your hands.\n\
\n\
Hope your day is going wonderful.\n\
\n\
LifeTracker",
};

function sendEmailNotifications() {
  // I can't query directly for booleans? doing this instead
  User.find({ 
    emailNotification: {$ne: false}, 
    emailTime: {$lt: moment().day(0).month(0).year(0).toDate()}, 
    emailLastNotify: {$lt: moment().startOf('day').toDate()}
  }).exec(function(err, users) {

    var startTime = moment().startOf('day')
    async.each(users, function(user, next) {
      Entry.find({user: user.id, timestamp: {$gt: startTime}}).exec(function(err, entries) {
        if (entries.length == 0) {
          console.log("Needs to be sent an email!", user.email)

          message.to = user.email
          transport.sendMail(message, function(error){
            if(error){
                console.log('Error occured', error);
                return;
            }
            console.log('Message sent successfully!');
          });

          user.emailLastNotify = new Date()
          user.save(next)
        }
      })

    }, function(err) {
      console.log(err)
    })
  })
}

sendEmailNotifications()