var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Schema:
var userSchema = new mongoose.Schema({
  identification: String,
  password: String,
  firstname: String,
  lastname: String
});

//Model:
var User = mongoose.model('user', userSchema);


/*Register route*/
router.post('/register', function(req, res) {
  var user = req.body;

  //Creating user document:
  var newUser = new User({ identification: user.id,
                            password: user.password,
                            firstname: user.firstname,
                            lastname: user.lastname});
  newUser.save();
  res.send("ok");
});

/* Login route*/
router.post('/login', function(req, res) {
  var login = req.body;

  var query = User.where({ identification: login.id });
  query.findOne(function (err, user) {
    if (err) return handleError(err);
      if (user) {
        if (user.password === login.password) {
          // OK
        }
      }
  });
  // Not login
});



module.exports = router;
