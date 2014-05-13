var mongoose = require('mongoose')
var Schema = mongoose.Schema
var moment = require('moment')

var EntrySchema = new Schema({
  timestamp: {type: Date, default: function() { return moment().startOf('day').toDate() }, required: true},
  
  grateful1: {type: String, default: ""},
  grateful2: {type: String, default: ""},
  grateful3: {type: String, default: ""},

  journal: {type: String, default: ""},

  images: [String],

  isExercise: {type: Boolean, default: false},
  isMeditate: {type: Boolean, default: false},
  isRAK: {type: Boolean, default: false},

  moodOfDay: {type: Number, default: 5, min: 0, max: 10},

  // This needs to be removed
  user: {type: Schema.Types.ObjectId, ref: 'User'}
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

// {
//   "__v": 0,
//   "_id": ObjectId("53682d0e52ec077b5ca0a74c"),
//   "grateful1": "I'm grateful that I'm all moved into my my new place.",
//   "grateful2": "I got a kernel up and running!",
//   "grateful3": "I wrote a lot of this website!",
//   "images": [
//     "/images/uploads/xc0nradx_479070399357717856r.jpg",
//     "/images/uploads/xc0nradx_463511399359034006r.jpg"
//   ],
//   "isExercise": false,
//   "isMeditate": false,
//   "isRAK": false,
//   "journal": "I didn't wake up till like 11 or so, but I woke up, showered, then ate a footlong at subway. Bacon Ranch Melt, extra meat. Then went to Cafe Cyberia and got a carmel macchiato. read a bit from the art of software security assessment. Then made gff, a tool for finding globally write able files.\n\nHad a neat idea on the walk back from cafe cyberia, what if we combined google Project Tango with neurotransmitters to feel objects around us?\n\nCame back, drank some mike hards, built the kernel.\n\nWent back to cafe cyberia, had two more carmel macchiatos, built most of this website! Ran into Apsite and Nix. Apsite said he thought I'd get A-shred no problemo. Told me to email him and Booker.\n\nThere were two girls in the cafe who I caught looking at me every once in a while. Then they went outside to smoke, and they knocked on the glass and hid under the ledge so I wouldn't see them. At the time I was nervous, but now I kinda wish I went and talked to them.\n\nThe girl who was serving drinks earlier in the afternoon was pretty pretty.\n\nCame back to daryl's, watched game of thrones episode, and then added this beautiful bootstrap to the website.",
//   "moodOfDay": 9,
//   "timestamp": ISODate("2014-05-06T00:30:06.345Z")
// }