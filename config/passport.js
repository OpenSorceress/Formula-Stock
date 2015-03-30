/* -------------------------------------------------
   PASSPORT'S SERIALIZE METHODS
   -------------------------------------------------
   The passport.serializeUser() and 
   passport.deserializeUser() methods define how
   Passport will handle user serialization. When a
   user is authenticated, Passport will save its
   _id property to fetch the user object from the
   database. Also, the local strategy configuration
   file is included, so once the Passport
   configuration file is loaded in server.js, it 
   then loads its strategies configuration file. The
   -password option is set so that Mongoose doesn't
   fetch the password field.
   -------------------------------------------------
 */

var passport = require('passport'),
	mongoose = require('mongoose');

module.exports = function() {
	var User = mongoose.model('User');
	
	passport.serializeUser(function(user, done) {
		done(null, user.id, user.investment_capital);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findOne(
			{_id: id},
			'-password',
			function(err, user) {
				done(err, user);
			}
		);
	});
	
	require('./strategies/local.js')();
};