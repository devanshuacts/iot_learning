var User = require('../models/user');
var Thing = require('../models/thing');
var async = require('async')

exports.index = function(req, res) {

    async.parallel({
      thing_count: function(callback){
        Thing.count(callback)
      },
      user_count: function(callback){
        User.count(callback)
      }
    }, function(err, results){
      res.render('index', { title: 'Users and Things Home', error: err, data: results });
    });
};


exports.user_list = function(req, res){
  User.find(function(err, users){
    if(err) return console.log(err);
    console.log(users)
    res.send(users)
  })
}

exports.get_user = function(req, res, next){
  console.log(req.params)
  User.findById(req.params.id)
      .exec(function(err, user){
        if(err) return next(err)
        if(user == null) {
          //var error = new Error()
          res.send(`id not found: ${req.params.id}`)
        }
        else {
          console.log(user)
          res.send(user)
        }
      });
}

exports.create_user = function(req, res){
  var user = req.body
  var new_user = new User({name: user.name, email: user.email })
  new_user.save(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    console.log('New User: ' + new_user);
    res.send('New User: ' + new_user);
  });
}

exports.update_user = function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body, function(err, raw){
    if(err) return next(err)
    if(raw == null) {
      res.send(`id not found: ${req.params.id}`)
    }
    else {
      console.log(raw)
      res.send(`${req.params.id} updated`)
    }
  })
  //console.log(req)
}

exports.delete_user = function(req, res, next){
  User.findByIdAndRemove(req.params.id, function(err, raw){
    if(err) return next(err)
    if(raw == null){
      res.send(`id not found: ${req.params.id}`)
    }
    else {
      console.log(raw)
      res.send(`${req.params.id} deleted`)
    }
  })
}
