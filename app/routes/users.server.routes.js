/* Dependencies */
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	/* User Registration Routes */
	app.route('/register').get(users.renderRegister).post(users.register);
	app.route('/register/billing').post(users.renderBilling);
	
	/* User Login Route */
	app.route('/login').get(users.renderLogin).post(passport.authenticate('local', {
		successRedirect: '/portfolio',
		failureRedirect: '/login',
		failureFlash: 'Email or password is incorrect.'
	}));
	
	/* User Logout Route */
	app.get('/logout', users.logout);
};