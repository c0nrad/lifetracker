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
  emailTime: {type: String, default: "20:00", required: true},

  smsNotification: {type: Boolean, default: true},
  smsTime: {type: String, default: "20:00", required: true},

  phone: String
})

module.exports = mongoose.model('User', UserSchema)