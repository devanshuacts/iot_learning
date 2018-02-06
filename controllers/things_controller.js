var Thing = require('../models/thing');
var User = require('../models/user');
var async = require('async')

// Display list of all things
exports.thing_list = function(req, res, next) {
  Thing.find(function(err, things){
    if(err) return next(err)
    res.send(things)
  });
};

// Display one thing
exports.thing_detail= function(req, res, next) {
    Thing.findById(req.params.id).exec(function(err, thing){
      if(err) return next(err)
      if(thing == null) res.send(`id not found: ${req.params.id}`)
      else res.send(thing)
    });
};

// Handle thing create on POST
exports.thing_create = function(req, res, next) {
  var thing = req.body;
  console.log(thing);
  User.findById(thing.user_id).exec(function(err, user){
    if(err) return next(err)
    if(user == null) res.send(`user not found: ${thing.user_id}, Thing not created.`)
    else {
      var userid = user.id
      var new_thing = new Thing({name: thing.name, last_data: thing.last_data, user: userid });
      new_thing.save(function (err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        console.log('New Thing: ' + new_thing);
        res.send('New Thing: ' + new_thing);
      });
    }
  })
};

// Handle thing delete
exports.thing_delete = function(req, res, next) {
    Thing.findByIdAndRemove(req.params.id, function(err, thing){
      if(err) return next(err)
      if(thing == null) res.send(`id not found: ${req.params.id}`)
      else res.send(`${req.params.id} deleted`)
    });
};

// Handle thing update
exports.thing_update = function(req, res, next) {
    Thing.findByIdAndUpdate(req.params.id, req.body, function(err, thing){
      if(err) return next(err)
      if(thing == null) res.send(`id not found: ${req.params.id}`)
      else res.send(`${req.params.id} updated`)
    });
};
