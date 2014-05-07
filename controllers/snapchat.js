var snapchat = require('snapchat')
var client = new snapchat.Client({username: "life-tracker", password: "p3n1s6969"})
var fs = require('fs');
var async = require('async')
var Entry = require('../models/entry').model
var CronJob = require('cron').CronJob;
var moment = require('moment')
var User = require('../models/user')

exports.checkSnaps = checkSnaps = function() {
  console.log("Checking for snaps...")
  async.auto({
    data: function(next) {
      client.login('life-tracker', 'p3n1s6969').then(function(data) { next(null, data)})
    },

    saveSnaps: ["data", function(next, results) {
      data = results.data
      if (typeof data.snaps === 'undefined') {
          console.log("typeof data.snaps == undefined", data);
          return;
      }

      async.each(data.snaps, function(snap) {
        if (typeof snap.sn !== 'undefined' && typeof snap.t !== 'undefined' && snap.st == 1) {
          console.log('Saving snap from ' + snap.sn + '...');

          var public_filename = '/images/uploads/' + snap.sn + '_' + snap.id + '.jpg';
          var filename = './public/images/uploads/' + snap.sn + '_' + snap.id + '.jpg';
          var stream = fs.createWriteStream(filename, { flags: 'w', encoding: null, mode: 0666 });
          client.getBlob(snap.id).then(function(blob) {
            blob.pipe(stream);
            blob.resume();
          });

          async.auto({
            user: function(next) {
              User.findOne({snapchat: snap.sn}).exec(next)
            },

            entry: ["user", function(next, results) {
              user = results.user
              startDay = moment().startOf('day').toDate()
              Entry.findOneAndUpdate({user: user.id, timestamp: {$gt: startDay}}, {$push: {images: public_filename}}, {upsert: true}).exec(next)
            }]
          }, function(err, results) {
            console.log("b", err, results)
          })

          //Entry.update({}, {$push: {images: public_filename}}).exec(function(err, count) {
          //  console.log(err, count)
          //})
        }
      }, function(err, results) {
        next(err, results) 
      })
    }],

    clearSnaps: ["data", function(next) {
      client.clear().then(next)
    }]
  }, function(err, results) {
    console.log("Done with snapchat", err)
  })
}

checkSnaps()

job = new CronJob({
  cronTime: "00 */1 * * * *",
  onTick: checkSnaps,
  start: true,
})
job.start()
