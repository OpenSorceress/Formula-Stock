/* -------------------------------------------------
   ABOUT THE PASSPORT MODULE
   -------------------------------------------------
   First, you must require the Passport module, then
   the local strategy module's Strategy object, and
   finally your User Mongoose model. Then, you can
   register the strategy using the passport.use()
   method that uses an instance of the LocalStrategy
   object. Inside the callback function, you use the
   User Mongoose model to find a user with the
   passed username and try to authenticate it.
   -------------------------------------------------
 */

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	passport.use(new LocalStrategy(function(email, password, done) {
		User.findOne(
			{'email' : email},
			function(err, user) {
				if (err) {
					console.log("There was an error: " + err);
					return done(err);
				}
				
				if (!user) {
					console.log("User does not exist.");
					return done(null, false, {
						message: 'User does not exist'
					});
				}
				
				if (!user.authenticate(password)) {
					console.log("Password is incorrect.");
					return done(null, false, {
						message: 'Password is incorrect'
					});
				}
				
				return done(null, user);
			}
		);
	}));
};