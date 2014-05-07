var CronJob = require('cron').CronJob;
var User = require("../models/user")
var Entry = require('../models/entry').model
var async = require('async')
var moment = require('moment')
var nodemailer = require('nodemailer')
var secrets = require('../secrets')
var twilio = require('twilio')
var twilioClient = new twilio.RestClient(secrets.twilio_SID, secrets.twilio_AuthToken)

var transport = nodemailer.createTransport("SMTP", {
    auth: {
        user: secrets.emailAddress,
        pass: secrets.emailPass
    }
});

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
www.lifetracker.us\n\
\n\
Hope your day is going wonderful.\n\
\n\
LifeTracker",
};

function sendEmailNotifications() {
  console.log("checking email notifications", moment().format('HH:mm'))
  // I can't query directly for booleans? doing this instead
  User.find({ 
    emailNotification: {$ne: false}, 
    emailTime: moment().format("HH:mm"), 
  }).exec(function(err, users) {

    async.each(users, function(user, next) {
      message.to = user.email
      transport.sendMail(message, function(error){
        if(error){
            console.log('Error occured', error);
            return next(error)
        }
        console.log('Email reminder sent to ' + message.to + '!');
        return next()
      });
    }, function(err) {
      if (err)
        console.log(err)
    })
  })
}

function sendSMS(to, next) {
  twilioClient.sms.messages.create({
    to:to,
    from:secrets.twilio_number,
    body:'Just a friendly reminder to update your lifetracker entry for today! Hope your day is as awesome as you are.'
  }, function(error, message) {
    if (!error) {
      console.log('Successful SMS reminder sent to ', to);
    } else {
      console.log('Oops! There was an error.', error);
    }
    next() // Don't return errors. We don't want it to stop on the failrue of one
  });
}

function sendSMSNotifications() {
  console.log("checking for sms notifications", moment().format("HH:mm"))
  User.find({ 
    smsNotification: {$ne: false}, 
    smsTime: moment().format("HH:mm"),
    phone: {$ne: ""}, 
  }).exec(function(err, users) {
    async.each(users, function(user, next) {
      sendSMS(user.phone, next)
    }, function(err) {
      if (err)
        console.log("Error sending SMS notifications", err)
    })
  })
}

smsJob = new CronJob({
  cronTime: "30 */1 * * * *",
  onTick: sendSMSNotifications,
  start: true,
})
smsJob.start()

emailJob = new CronJob({
  cronTime: "30 */1 * * * *",
  onTick: sendEmailNotifications,
  start: true,
})
emailJob.start()

sendSMSNotifications()
sendEmailNotifications()