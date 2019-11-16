// CODE BY BRAD TRAVERSY (with extra comments by me)
// ref: https://github.com/bradtraversy/node_passport_login
// passport-local docs: http://www.passportjs.org/packages/passport-local/

// This file is where we define how passport.js handles authentication. 
// We're using passport-local which authenticates with a username and password, 
// but other authentication strategies exist, like logging in with Facebook/Twitter/etc. 

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model - Required for querying the database when checking credentials
const User = require('../models/User');

// This function will evaluate with the passport module defined in app.js passed in as an argument
module.exports = function(passport) {

  passport.use(

    // Local strategy requires a callback that takes in required credentials (email, password)
    // and then returns done 
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user by email
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, /*{ message: 'That email is not registered' }*/);
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, /*{ message: 'Password incorrect' }*/);
          }
        });
      });
    })
  );

  // serializeUser and deserializeUser are needed to store user info (in this 
  // case, just the user id) in the session after login, and access that user 
  // info in subsequent requests. That user info can be accessed in the request object.
  // ref: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
  // ref: http://www.passportjs.org/docs/configure/#sessions

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};