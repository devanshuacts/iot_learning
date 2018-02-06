var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

// router.get('/', function(req, res) {
//   res.redirect('/thing');
// });

module.exports = router;
