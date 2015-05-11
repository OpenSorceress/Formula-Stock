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
	var plan = {};
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	
	if(req.user.plan == "platinum_yearly") {
		var expires = req.user.expires;
		var yyyy = expires.getYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Platinum Formula",
			rate: "$20,000 Annually",
			expires: expires_str,
			status: status.capitalize().capitalize()
		};
	} else if(req.user.plan == "premium_yearly") {
		var expires = req.user.expires;
		var yyyy = expires.getFullYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Premium Formula",
			rate: "$1,100 Annually",
			expires: expires_str,
			status: status.capitalize().capitalize()
		};
	} else if (req.user.plan == "premium_monthly") {
		var expires = req.user.expires;
		var yyyy = expires.getFullYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Premium Formula",
			rate: "$100 Monthly",
			expires: expires_str,
			status: status.capitalize().capitalize()
		};
	} else if (req.user.plan == "pro_yearly") {
		var expires = req.user.expires;
		var yyyy = expires.getFullYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Pro Formula",
			rate: "$550 Annually",
			expires: expires_str,
			status: status.capitalize().capitalize()
		};
	} else if (req.user.plan == "pro_monthly") {
		var expires = req.user.expires;
		var yyyy = expires.getFullYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Pro Formula",
			rate: "$50 Monthly",
			expires: expires_str,
			status: status.capitalize()
		};
	} else if (req.user.plan == "trial") {
		var expires = req.user.trial_expires;
		var yyyy = expires.getFullYear();
		var mm = Number(expires.getMonth());
		var dd = expires.getDate();
		var status = req.user.status;
		
		var month = months[mm];
		var expires_str = month + " " + dd + ", " + yyyy;
		
		plan = {
			formula: "Pro Formula",
			rate: "$0",
			expires: expires_str,
			status: status.capitalize()
		}
	}
	
	var data = {
		user: {
			"firstname" : req.user.firstname,
			"lastname" : req.user.lastname,
			"email" : req.user.email,
			"plan" : req.user.plan
		},
		plan: plan
	};
	
	
	
	console.log(req.user.expires);
	
	res.render('account', {
		title: 'Formula Stocks - My Account',
		data: data
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

// Upload JSON Documents
exports.upload_files = function(request, response, next) {
	console.log("UPLOAD FILES METHOD CALLED");
	var files = [];
	
	for(var i=0; i<request.files.length; i++) {
		var file = {
			name: request.files[i].originalname,
			path: "./" + request.files[i].path,
			uploaded: new Date().getTime()
		};
		
		console.log("Files Uploading");
		files.push(file);
	}
	
		console.log(request.files);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}