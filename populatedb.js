#! /usr/bin/env node

console.log('This script populates some things, users, their readings to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Thing = require('./models/thing')
var User = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var things = []
var users = []

function thingCreate(name, created_at, last_data, user, cb) {
  thingdetail = {name:name , created_at: created_at, last_data: last_data, user: user}
  //if (d_birth != false) authordetail.date_of_birth = d_birth
  //if (d_death != false) authordetail.date_of_death = d_death

  var thing = new Thing(thingdetail);

  thing.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Thing: ' + thing);
    things.push(thing)
    cb(null, thing)
  }  );
}

function userCreate(name, email, created_at, cb) {
  var user = new User({ name: name, email: email, created_at: created_at });

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }   );
}

function createThings(cb) {

    async.parallel([
        function(callback) {
          thingCreate('TempSensor','2017-12-28', 40, users[0], callback);
        },
        function(callback) {
          thingCreate('HumiditySensor','2017-12-21', 60.3, users[2], callback);
        },
        function(callback) {
          thingCreate('PressureSensor','1973-06-06', 767, users[1], callback);
        },
        function(callback) {
          thingCreate('MotionSensor','1947-07-15', -2.33, users[0], callback);
        }
        ],
        // optional callback
        cb);
}


function createUsers(cb) {

    async.parallel([
        function(callback) {
          userCreate('Devanshu Singh', 'devanshu.ds.singh@gmail.com', '2017-12-28', callback);
        },
        function(callback) {
          userCreate('Dhananjay Desai', 'dhananjay_desai@gmail.com', '2018-01-06', callback);
        },
        function(callback) {
          userCreate('Durgesh Jaiswal', 'durgesh_jaiswal.ds.singh@gmail.com', '2017-12-21', callback);
        }
        ],
        // optional callback
        cb);
}



async.series([
    createUsers,
    createThings
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('THINGInstances: '+things);

    }
    //All done, disconnect from database
    mongoose.connection.close();
});
