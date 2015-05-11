/**
  * @filename		users.server.controller.js
  * @description	This class will hold methods for user functionality
  * @author			Lindsay Roberts Lindsay.Roberts@protonmail.com
  * @required		Mongoose Models User and Plan, Stripe, and Passport
*/

// Dependencies
var User 		= require('mongoose').model('User'),
	Plan 		= require('mongoose').model('Plan'),
	Stripe 		= require('stripe')("sk_test_9Z5AY0rUOLbtMMYQ4T5eOH1O"),
	passport 	= require('passport');

/* -------------------------------------------------
   RENDER LOGIN METHOD
   -------------------------------------------------
   This method renders the login page. It checks
   for parameters to see if a user is logged into
   the system. If not, it will render the register
   page. Otherwise, it will take the user to their
   dashboard.
   -------------------------------------------------
 */ 
exports.renderLogin = function(request, response, next) {
	if (!request.user) {
		response.render('login', {
			title: 'Log-in Form',
			messages: request.flash('error') || request.flash('info')
		});
	} else {
		return response.redirect('/portfolio');
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
exports.renderRegister = function(request, response, next) {
	if (!request.user) {
		if(request.query.p) {
			
			// Get Parameter "p" from URL:
			var param = request.query.p;
			
			if(param == 'platinum' || param == 'premium' || param == 'pro') {
				var cycle = 'monthly';
				
				if(param == 'platinum') {
					cycle = 'yearly';
				}
				var query = param + "_" + cycle;
				
				Plan.findByName(query, function(error, selected_plan) {
					if(error) {
						// If the Parameter was invalid
						console.log(error);
						response.render('register', {
							title: 'Sign Up for Formula Stocks',
							messages: request.flash('error')
						});
					} else if(selected_plan) {
						response.render('register', {
							title: 'Sign Up for Formula Stocks',
							subscription: selected_plan,
							messages: request.flash('error')
						});
					} else {
						response.render('register', {
							title: 'Sign Up for Formula Stocks',
							messages: request.flash('error')
						});
					}
				});
			} else {
				// Render With Trial
				response.render('register', {
					title: 'Sign Up for Formula Stocks',
					messages: request.flash('error')
				});
			}
		} else {
			response.render('register', {
				title: 'Sign Up for Formula Stocks',
				messages: request.flash('error')
			});	
		}
	} else {
		return response.redirect('/portfolio');
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
exports.renderBilling = function(request, response, next) {
	if(request.user) {
		console.log(request.user.plan);
		
		Plan.findByName(request.user.plan, function(error, data){
			if(error) {
				console.log(error);
				response.send(error);
				// response.redirect('/billing');
				// This requires an additional page with its own
				// respective routes and page renderer (when we move
				// billing to its own controller).
				
				// We will need an additional view: Change Plan, which
				// will allow trial users and others to update their
				// already existing accounts. This view can essentially
				// be copied from the register page and remove any non
				// essential elements.
			}			
			
			var plan_data_obj = {
				firstname: request.user.firstname,
				lastname: request.user.lastname,
				email: request.user.email,
				plan: data,
				price: format_price(data.price),
				status: request.user.status
			}
			
			response.render('billing', {
				title: 'Formula Stocks - Billing',
				plan_data: plan_data_obj,
				messages: request.flash('error')
			});
		});
	} else {
		var message = "Please login to enter your billing information. If you don\'t have an account, you can sign up for free.";
		request.session.redirect = '/billing';
		request.flash('error', message);
		return response.redirect('/login');
	}
};

/* -------------------------------------------------
   BILLING METHOD
   -------------------------------------------------
   This method is called after the user submits the
   form data. Stripe handles any errors, which
   returns to the billing page on failure. If it
   succeeds, it updates the user with the customer
   data received from Stripe.
   -------------------------------------------------
 */
exports.billing = function(request, response, next) {
	if(request.user) {
		var stripeToken = request.body.stripeToken;
		Stripe.customers.create({
			source: stripeToken,
			plan: request.user.plan,
			email: request.user.email
		}, function(error, customer) {
			if(error) {
				console.log(error);
				
				var message = error.message;
				request.flash('error', message);
				return response.redirect('/billing');
			}
			
			// Create data to update the user in the database.
			var unix_timestamp	= customer.subscriptions.data[0].current_period_end;
			var expires			= new Date(unix_timestamp * 1000);
			var stripe_plan		= customer.subscriptions.data[0].plan.id;
			var status			= customer.subscriptions.data[0].status;
			var stripe_id		= customer.id;
			var query			= {email: request.user.email};
			
			User.update(query, {$set: {
				plan: 			stripe_plan,
				status:			status,
				expires:		expires,
				trial_expires:	new Date(),
				stripe_id:		stripe_id
			}}, {
				multi: true
			}, function(error, user_document) {
				if (error) {
					console.log(error);
					
					var message = error.message;
					request.flash('error', message);
					return response.redirect('/account');
				}
				
				console.log(user_document);
				return response.redirect('/portfolio');				
			});
		});
	} else {
		var message = "Please login to enter your billing information. If you don\'t have an account, you can sign up for free.";
		request.session.redirect = '/billing';
		request.flash('error', message);
		return response.redirect('/login');
	}
}

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
   created using the request.login() method provided by
   the Passport module. After the login operation
   is completed, a user object will be inside the
   request.user object.
   -------------------------------------------------
 */
 exports.register = function(request, response, next) {
	 if(!request.user) {
		 var message = null;
		 
		 if(request.body.selected_plan === 'trial') {
			 var trial_exp = new Date();
			 trial_exp.setDate(trial_exp.getDate() + 90);
			 
			 var user_obj = {
				 firstname: request.body.firstname,
				 lastname: request.body.lastname,
				 email: request.body.email,
				 password: request.body.password,
				 usertype: 1,
				 plan: "trial",
				 status: "Trial",
				 trial_exp: trial_exp
			 };
			 
			 var user = new User(user_obj);
			 user.provider = 'local';
			 
			 user.save(function(error) {
				 if(error) {
					console.log(error);
					var message = geterrorMessage(error);
					request.flash('error', message);
					return response.redirect('/register'); 
				 }
				 
				 request.login(user, function(error) {
					if(error) {
						return next(error);
					} else {
						return response.redirect('/portfolio');	
					}
				 });
			 });
		 } else {			 
			 var user_obj = {
				 firstname: request.body.firstname,
				 lastname: request.body.lastname,
				 email: request.body.email,
				 password: request.body.password,
				 usertype: 1,
				 plan: request.body.selected_plan,
				 status: "Pending Payment"
			 };
			 
			 var user = new User(user_obj);
			 user.provider = 'local';
			 
			 user.save(function(error) {
				if(error) {
					console.log(error);
					var message = geterrorMessage(error);
					request.flash('error', message);
					return response.redirect('/register');
				}
				
				request.login(user, function(error) {
					if(error) {
						return next(error);
					} else {
						console.log("USER WAS LOGGED IN - REDIRECTED TO BILLING!");
						return response.redirect('/billing');
					}
				});
			 });
		 }
	 } else {
		 console.log(request.user);
	 }
 }

/* -------------------------------------------------
   LOG IN USER
   -------------------------------------------------
 */
exports.login = function(request, response, next) {
	request.login(user, function(error) {
		if (error) { return next(error); }
		console.log(request.user);
		return response.redirect('/portfolio');
	});
}

/* -------------------------------------------------
   LOGOUT USER
   -------------------------------------------------
 */
exports.logout = function(request, response) {
	request.logout();
	response.redirect('/');
}

/* -------------------------------------------------
   GET ALL USERS
   -------------------------------------------------
 */
exports.list = function(request, response, next) {
	User.find({}, function(error, users) {
		if (error) {
			return next(error);
		} else {
			response.json(users);
		}
	});
};

/* -------------------------------------------------
   GET USER BY ID
   -------------------------------------------------
   The read() method just responseponds with a JSON
   represponseentation of the request.user object. The
   userById() method is populating the request.user
   object, which you will use as a middleware to
   deal with the manipulation of single documents
   when performing read, delete, and update
   operations.
   -------------------------------------------------
 */
exports.read = function(request, response) {
	response.json(request.user);
};

exports.userByID = function(request, response, next, id) {
	User.findOne({
		_id: id
	}, function(error, user) {
		if (error) {
			return next(error);
		} else {
			request.user = user;
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
exports.update = function(request, response, next) {
	User.findByIdAndUpdate(request.user.id, request.body, function(error, user) {
		if (error) {
			return next(error);
		} else {
			response.json(user);
		}
	});
};
 
 /* -------------------------------------------------
    GET ERROR MESSAGE METHOD
    -------------------------------------------------
 */
var getErrorMessage = function(error) {
	var message = '';
	if (error.code) {
		switch (error.code) {
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
		for (var errorName in error.errors) {
			if (error.errors[errorName].message)
				message = error.errors[errorName].message;
		}
	}
	
	return message;
};

/* -------------------------------------------------
   CAPITALIZE METHOD
   -------------------------------------------------
   Capitalizes the first letter of a string.
   -------------------------------------------------
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/* -------------------------------------------------
   FORMAT PRICE METHOD
   -------------------------------------------------
   Formats the price to have commas.
   -------------------------------------------------
 */
function format_price(value) {
	while(/(\d+)(\d{3})/.test(value.toString())) {
		value = value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	
	return value;
}