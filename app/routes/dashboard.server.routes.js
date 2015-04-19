var passport = require('passport');

module.exports = function(app) {
	var dashboard = require('../controllers/dashboard.server.controller');
		
	app.get('/portfolio', function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_portfolio);
	
	app.get('/account', function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_account);
	
	app.post('/assets/buy', function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.buy);
	
	app.post('/assets/sell', function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.sell);
	
	app.get('/assets/sell', function(req, res, next) {
		res.redirect('/portfolio');
	});
	
	app.get('/assets/buy', function(req, res, next) {
		res.redirect('/portfolio');
	});
}