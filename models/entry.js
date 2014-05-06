var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EntrySchema = new Schema({
  timestamp: {type: Date, default: Date.now},
  
  grateful1: {type: String, default: ""},
  grateful2: {type: String, default: ""},
  grateful3: {type: String, default: ""},

  images: [String],

  isExercise: {type: Boolean, default: false},
  isMeditate: {type: Boolean, default: false},
  isRAK: {type: Boolean, default: false},

  moodOfDay: {type: Number, default: 5, min: 0, max: 10},

  // This needs to be removed
  user: String
});

exports.schema = EntrySchema
exports.model = mongoose.model('Entry', EntrySchema)

//  e = exports.model({
//   grateful1: "My cat didn't die",
//   grateful2: "I got a kernel up and running.",
//   grateful3: "This website doen't blow too much.",

//   isExercise: false,
//   isMeditate: false,
//   isRAK: false,
//   moodOfDay: 8
// })
//  e.save()