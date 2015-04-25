var Asset = require('mongoose').model('Asset'),
	User = require('mongoose').model('User'),
	passport = require('passport'),
	request = require('request');

function get_json(api_url, callback) {
	request(api_url, function(error, response, body) {
		var final_data = JSON.parse(body);
		return callback(final_data);
	});
}

function add_commas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

exports.render_account = function(req, res, next) {
	var user = {
		"firstname" : req.user.firstname,
		"lastname" : req.user.lastname,
		"email" : req.user.email
	}
	
	res.render('account', {
		title: 'Formula Stocks - My Account',
		data: user
	});
}

exports.render_portfolio = function(req, res, next) {
	return_data = {
		'user' : {
			'firstname' : req.user.firstname,
			'lastname' : req.user.lastname,
			'plan' : req.user.plan,
			'type' : req.user.usertype
		}
		// 'investment_capital' : add_commas(req.user.investment_capital.toFixed(2)),
		// 'capital_allocation' : ((req.user.investment_capital * 100) / (fs_total + req.user.investment_capital)).toFixed(1)
	}
	
	// res.send(return_data);
	res.render('dashboard', {
		title: 'My Formula Stocks',
		data: return_data
	});	
}

exports.buy = function(req, res, next) {
	var input = req.body;
	var total = req.user.investment_capital;
	
	var asset_object = {
		user_id: req.user.id,
		asset: input.asset,
		ticker: input.ticker,
		shares: [{
			count: input.quantity,
			price: input.price
		}]
	};
	
	asset_object.shares.forEach(function(el, index) {
		total -= el.count * el.price;
	});
	
	User.update({_id: req.user.id}, {$set: {investment_capital : total}}, function(err) {
		if(err) {
			return next(err);
		} else {
			Asset.find({user_id:req.user.id, ticker: input.ticker}, function(err, obj) {
				if(obj.length > 0) {
					// Stock exists... push to "shares"
					Asset.update({user_id:req.user.id, ticker: input.ticker}, {$push: {shares: {count: input.quantity, price: input.price}}}, function(err) {
						if(err) {
							return next(err);
						} else {
							res.redirect('/portfolio');
						}
					});
				} else {
					// Stock doesn't exist... create new!
					var asset = new Asset(asset_object);
					asset.save(function(err) {
						if(err) {
							return next(err);
						} else {
							res.redirect('/portfolio');
						}
					});
				}
			});
		}
	});
}

exports.sell = function(req, res, next) {
	var input = req.body;
	
	// console.log(input.ticker, req.user.id);
	
	Asset.find({user_id:req.user.id, ticker:input.ticker}, function(err, obj) {
		
		var total_count = 0;		

		obj[0].shares.forEach(function(el, index) {
			total_count += el.count;
		});

		var profit = total_count * input.current_price;
		var ic = profit + req.user.investment_capital;
		
		Asset.remove({user_id:req.user.id, ticker:input.ticker}, function(err) {
			if(err) {
				return next(err);
			} else {
				User.update({_id: req.user.id}, {$set: {investment_capital : ic}}, function(err) {
					if(err) {
						return next(err);
					} else {
						res.redirect('/portfolio');
					}
				});
			}
		});
	});
}