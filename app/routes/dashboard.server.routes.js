var passport = require('passport');

var _filenames = [
	"entry_weekly.json",
	"entry_monthly.json",
	"entry_annual.json",
	"fund_weekly.json",
	"fund_monthly.json",
	"fund_annual.json",
	"proff_weekly.json",
	"proff_monthly.json",
	"proff_annual.json"
];

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
	
	app.post('/file/post', function(req, res, next) {
		console.log(req.files);
		for (var key in req.files) {
			if (req.files.hasOwnProperty(key)) {
				if(_filenames.indexOf(req.files[key].originalname) > -1) {
					continue;
				} else {					
					console.log("ERROR: ", req.files[key].originalname);
					return "Error! Filename is incorrect!";
				}
			}
		}
		// Authenticate Here...
		// return next();
	}, dashboard.upload_files);
	
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