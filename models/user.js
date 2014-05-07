var mongoose = require('mongoose')
var moment = require('moment')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  email: String,
  lastLogin: Date,
  firstLogin: Date,

  snapchat: String,

  emailNotification: {type: Boolean, default: true},
  emailTime: {type: Date, default: moment().year(0).month(0).day(0).hour(20).toDate()},
  emailLastNotify: {type: Date, default: new Date(0) },
  smsNotification: Boolean,
  smsTime: {type: Date, default: moment().year(0).month(0).day(0).hour(20).toDate()},
  phone: String
})

module.exports = mongoose.model('User', UserSchema)