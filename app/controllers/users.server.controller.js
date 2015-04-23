/* Dependencies */
var User = require('mongoose').model('User'),
	Plan = require('mongoose').model('Plan'),
	Stripe = require('stripe')("sk_test_9Z5AY0rUOLbtMMYQ4T5eOH1O"),
	passport = require('passport');

/* -------------------------------------------------
   RENDER LOGIN SCREEN
   -------------------------------------------------
 */
exports.renderLogin = function(req, res, next) {
	if (!req.user) {
		res.render('login', {
			title: 'Log-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/portfolio');
	}
};

/* -------------------------------------------------
   RENDER REGISTER METHOD
   -------------------------------------------------
   This method renders the register page. It checks
   for parameters to see if it should autofill some
   data, such as when the user clicks on a plan from
   the home page. It will then return the plan the
   user selected, which is used to populate the
   selected plan, its starting cycle, and the price.
   -------------------------------------------------
 */
exports.renderRegister = function(req, res, next) {
	if (!req.user) {
		if(req.query.p) {
			var param = req.query.p;
			
			if(param == 'platinum' || param == 'premium' || param == 'pro') {
				Plan.findByName(param, function(err, selected_plan) {
					if(err) {
						res.render('register', {
							title: 'Sign Up for Formula Stocks',
							messages: req.flash('error')
						});
					} else if(selected_plan) {
						res.render('register', {
							title: 'Sign Up for Formula Stocks',
							subscription: selected_plan,
							messages: req.flash('error')
						});
					} else {
						res.render('register', {
							title: 'Sign Up for Formula Stocks',
							messages: req.flash('error')
						});
					}
				});
			} else {
				// Render With Trial
				res.render('register', {
					title: 'Sign Up for Formula Stocks',
					messages: req.flash('error')
				});
			}
		} else {
			res.render('register', {
				title: 'Sign Up for Formula Stocks',
				messages: req.flash('error')
			});	
		}
	} else {
		return res.redirect('/portfolio');
	}
};

/* -------------------------------------------------
   RENDER BILLING METHOD
   -------------------------------------------------
   This method renders the billing page after it
   verifies the POST data from the HTTP request. If
   the request fails, they are redirected to the
   register page.
   -------------------------------------------------
 */
exports.renderBilling = function(req, res, next) {
	if(!req.user) {
		if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.selected_plan || !req.body.subscription_checkbox || !req.body.total_price) {
			// Redirect with failure
			console.log(req.body);
			req.flash('error', 'Something went wrong submitting the form. Please try again.');
			return res.redirect('/register');
		} else {
			var form_data = {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password,
				selected_plan: req.body.selected_plan,
				subscription_checkbox: req.body.subscription_checkbox,
				cycle: req.body.subscription_checkbox.capitalize(),
				plan: req.body.selected_plan.capitalize(),
				total_price: req.body.total_price
			}
			
			res.render('billing', {
				title: 'Sign Up for Formula Stocks',
				form_data: form_data,
				messages: req.flash('error')
			});
		}
	} else {
		return res.redirect('/portfolio');
	}
};

/* -------------------------------------------------
   REGISTER METHOD
   -------------------------------------------------
   This method uses the User model to create new
   users, so that is gets the user form data
   from the HTTP request body and creates a new user
   with Stripe that simultaneously charges the credit
   card. Once payment has been verified it then tries to
   save it to MongoDB and if an error occurs, the 
   register() method will fetch the errors. If the user was 
   created successfully, the user session will be
   created using the req.login() method provided by
   the Passport module. After the login operation
   is completed, a user object will be inside the
   req.user object.
   -------------------------------------------------
 */
exports.register = function(req, res, next) {
	if (!req.user) {
		var message = null;
				
		if(req.body.selected_plan === 'trial') {
			var trial_exp = new Date();
			trial_exp.setDate(trial_exp.getDate() + 90);			
			
			var user_obj = {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password,
				usertype: 1, // 0 - Inactive User / 1 - Active User / 2 - Admin
				plan: "trial",
				status: "trial",
				trial_exp: trial_exp
			}
			
			var user = new User(user_obj);
			user.provider = 'local';
			
			user.save(function(err) {
				if(err) {
					console.log(err);
					var message = getErrorMessage(err);
					req.flash('error', message);
					return res.redirect('/register');
				}
				
				req.login(user, function(err) {
					if (err)
						return next(err);
					
					return res.redirect('/portfolio');
				});
			});
		} else {
			var stripeToken = req.body.stripeToken;
			console.log(stripeToken);

			var sub_plan = req.body.selected_plan + "_" + req.body.subscription_checkbox;
				
			Stripe.customers.create({
				source: stripeToken,
				plan: sub_plan,
				email: req.body.email
			}, function(err, customer) {
				console.log("Error: " + err);
				console.log("Customer: " + customer);
				
				if(err) {
					var form_data = {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email,
						password: req.body.password,
						selected_plan: req.body.selected_plan,
						subscription_checkbox: req.body.subscription_checkbox,
						cycle: req.body.subscription_checkbox.capitalize(),
						plan: req.body.selected_plan.capitalize(),
						total_price: req.body.total_price
					}
										
					res.render('billing', {
						title: 'Sign Up for Formula Stocks',
						form_data: form_data,
						messages: req.flash('error', err.message)
					});
				} else {
					// Create a new USER object.
					// Store customer.id
					
					var unix_timestamp = customer.subscriptions.data[0].current_period_end;
					var renew_date = new Date(unix_timestamp*1000);
					
					var user_obj = {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email,
						password: req.body.password,
						usertype: 1,
						plan: customer.subscriptions.data[0].plan.id,
						status: customer.subscriptions.data[0].status,
						sub_renew: renew_date,
						stripe_id: customer.id
					};
					
					var user = new User(user_obj);
					user.provider = 'local';
					
					user.save(function(err) {
						if(err) {
							console.log(err);
							var message = getErrorMessage(err);
							req.flash('error', 'Your payment was successfully processed, but there was a critical error creating your account. Please contact support with the following message.<br /><code>' + message + '</code>');
							return res.redirect('/register');
						} else {
							req.login(user, function(err) {
								if (err)
									return next(err);
								return res.redirect('/portfolio');
							})
						}
					});	
				}
			});
		}
	} else {
		return res.redirect('/portfolio');
	}
};

/* -------------------------------------------------
   LOG IN USER
   -------------------------------------------------
 */
exports.login = function(req, res, next) {
	req.login(user, function(err) {
		if (err) { return next(err); }
		console.log(req.user);
		return res.redirect('/portfolio');
	});
}

/* -------------------------------------------------
   LOGOUT USER
   -------------------------------------------------
 */
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
}

/* -------------------------------------------------
   GET ALL USERS
   -------------------------------------------------
 */
exports.list = function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) {
			return next(err);
		} else {
			res.json(users);
		}
	});
};

/* -------------------------------------------------
   GET USER BY ID
   -------------------------------------------------
   The read() method just responds with a JSON
   representation of the req.user object. The
   userById() method is populating the req.user
   object, which you will use as a middleware to
   deal with the manipulation of single documents
   when performing read, delete, and update
   operations.
   -------------------------------------------------
 */
exports.read = function(req, res) {
	res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}, function(err, user) {
		if (err) {
			return next(err);
		} else {
			req.user = user;
			next();
		}
	});
};

/* -------------------------------------------------
   UPDATE USER
   -------------------------------------------------
   Mongoose model has several available methods to
   update an existing document:
   
   update(), findOneAndUpdate(), findByIdAndUpdate()
   
   Since the userById() method is already in use,
   use the findByIdAndUpdate() method.
   -------------------------------------------------
 */
exports.update = function(req, res, next) {
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};
 
 /* -------------------------------------------------
   GET ERROR MESSAGE METHOD
   -------------------------------------------------
 */
var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Email is already in use.';
				break;
			case 11002:
				message = 'There was an error sending the form data. Please try again.';
			default:
				message = 'Something went wrong! Please try again.';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}
	
	return message;
};

/* -------------------------------------------------
   CAPITALIZE METHOD
   -------------------------------------------------
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}