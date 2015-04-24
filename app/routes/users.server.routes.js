/* Dependencies */
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	/* User Registration Routes */
	app.route('/register').get(users.renderRegister).post(users.register);
	app.route('/billing').get(users.renderBilling).post(users.billing);
	
	/* User Login Route */
	app.route('/login').get(users.renderLogin).post(passport.authenticate('local', {
		successRedirect: '/portfolio',
		failureRedirect: '/login',
		failureFlash: 'Email or password is incorrect.'
	}));
	
	/* User Logout Route */
	app.get('/logout', users.logout);
};