var Entry = require('../models/entry')

exports.init =  function(app) {
  console.log('I am being inited')
  app.get('/all', all)
}

all = function(req, res) {
  Entry.find({}).exec( function (err, entries) {
    if (err) res.send(err)
    res.send(entries)
  })
}