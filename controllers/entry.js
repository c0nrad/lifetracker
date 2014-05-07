var CronJob = require('cron').CronJob
var Entry = require('../models/entry').model
var User = require('../models/user')
var async = require('async')
var moment = require('moment')

// function createNewEntries() {
//   User.find({}).exec(function(err, users) {
//     if (err) 
//       return console.log(err)


//     var start = new Date(2010, 3, 1);
//     var end = new Date(2010, 4, 1);
//     created_on: {$gte: start, $lt: end}

//     async.each(users, function(user, next) {



//       e = new Entry({user: user.id})
//       e.save(next)
//     }, function(err) {
//       if (err)
//         console.log(err)
//     })
//   })
// }

//createNewEntries()