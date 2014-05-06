var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  email: String,
  lastLogin: Date,
  firstLogin: Date,

  snapchat: String,

  emailNotification: {type: Boolean, default: true},
  emailTime: {type: Date, default: new Date(2014, 0, 1, 20, 0, 0, 0)},
  smsNotification: Boolean,
  smsTime: {type: Date, default: new Date(2014, 0, 1, 20, 0, 0, 0)},
  phone: String
})

module.exports = mongoose.model('User', UserSchema)