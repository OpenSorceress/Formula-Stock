var passport = require('passport');

module.exports = function(app) {
	var dashboard = require('../controllers/dashboard.server.controller');
	
	// PRO SUGGESTIONS
	app.get('/suggestions/pro', function(req, res, next) {
		if(req.isAuthenticated()) {
			if(req.user.status == 'active' || req.user.status == 'Trial') {
				if(req.user.plan == 'platinum_yearly' || req.user.plan == 'premium_yearly' || req.user.plan == 'premium_monthly' || req.user.plan == 'pro_yearly' || req.user.plan == 'pro_monthly' || req.user.plan == 'trial') {
					return next();
				} else {
					req.flash('error', 'You need to upgrade to view our Pro Suggestions!');
					res.redirect('/account');
				}
			} else {
				req.flash('error', 'You need to upgrade to view our Pro Suggestions!');
				res.redirect('/account');
			}
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_pro_suggestions);
	
	// PREMIUM SUGGESTIONS
	app.get('/suggestions/premium', function(req, res, next) {
		if(req.isAuthenticated()) {
			if(req.user.status == 'active') {
				if(req.user.plan == 'platinum_yearly' || req.user.plan == 'premium_yearly' || req.user.plan == 'premium_monthly') {
					return next();
				} else {
					req.flash('error', 'You need to upgrade to view our Premium Suggestions!');
					res.redirect('/account');
				}
			} else {
				req.flash('error', 'You need to upgrade to view our Premium Suggestions!');
				res.redirect('/account');
			}
			return next();
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_premium_suggestions);
	
	// PLATINUM SUGGESTIONS
	app.get('/suggestions/platinum', function(req, res, next) {
		if(req.isAuthenticated()) {
			if(req.user.status == 'active') {
				if(req.user.plan == 'platinum_yearly') {
					return next();
				} else {
					req.flash('error', 'You need to upgrade to view our Platinum Suggestions!');
					res.redirect('/account');
				}
			} else {
				req.flash('error', 'You need to upgrade to view our Platinum Suggestions!');
				res.redirect('/account');
			}
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_platinum_suggestions);
	
	/* User Information */		
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
	
	app.get('/admin/upload', function(req, res, next) {
		if(req.isAuthenticated()) {
			if(req.user.usertype == 2) {
				return next();
			} else {
				req.flash('error', 'You don\'t have permission to do that!');
				res.redirect('/account');
			}
		} else {
			req.flash('error', 'You must be logged in to do that.');
			res.redirect('/login');
		}
	}, dashboard.render_admin);
	
	/* Test Demo Routes */
	app.post('/file/post', dashboard.upload_files);
	
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