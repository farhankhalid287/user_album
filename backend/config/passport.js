var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const db = require("../models"); // models path depend on your structure
const User = db.user;

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, function(username, password, done) {
  User.findOne({ where: { username: username } }).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'username or password': 'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
}));

