// Register Method
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
					var message = getErrorMessage(error);
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
			var subscription = request.body.selected_plan + "_" + request.body.subscription_checkbox;
			
			var user_obj = {
				firstname:	request.body.firstname,
				lastname:	request.body.lastname,
				email:		request.body.email,
				password:	request.body.password,
				usertype:	1,
				plan:		subscription,
				status:		"Pending Payment"
			};
			
			var user = new User(user_obj);
			user.provider = 'local';
			
			user.save(function(error) {
				if(error) {
					console.log(error);
					var message = getErrorMessage(error);
					request.flash('error', message);
					return response.redirect('/register');
				}
				
				request.login(user, function(error) {
					if(error) {
						return next(error);
					} else {
						return response.redirect('/billing');
					}
				});
			});
		}
	} else {
		console.log(request.user);
	}
}

// Billing Method
exports.billing = function(request, response, next) {
	if(request.user) {
		console.log(request.user);
		
		var stripeToken = request.body.stripeToken;
		
		// Get plan from user in database.
		// var plan = User.getPlan() -- or something.
		console.log(request.user);
		
/*
		Stripe.customers.create({
			source: stripeToken,
			// plan: plan,
			// email: email
		}, function (error, customer) {
			if(error) {
				console.log(error);
				
				var message = error.message;
				request.flash('error', message);
				return response.redirect('/billing');
			}
			
			var unix_timestamp	= customer.subscriptions.data[0].current_period_end;
			var expires			= new Date(unix_timestamp * 1000);
			var stripe_plan		= customer.subscriptions.data[0].plan.id;
			var status			= customer.subscriptions.data[0].status;
			var stripe_id		= customer.id;
			var query			= {email: email};
			
			User.update(query, {$set: {
				plan:		stripe_plan,
				status:		status,
				sub_renew:	expires,
				stripe_id:	stripe_id
			}}, {
				multi: true
			}, function(error, user_document) {
				if (error) {
					console.log(error);
					
					var message = error.message;
					request.flash('error', message);
					return response.redirect('/billing');
				}
				
				console.log(user_document);
				response.send(user_document);
			});
		});
*/
	} else {
		// In login method, if "redirect_to" is set, when user is authenticated, redirect to billing.
		var message = 'Your session has timed out. Please login to enter billing information.';
		request.session.redirect = '/billing';
		request.flash('error', message);
		return response.redirect('/login');
	}	
}

// Render Billing Method
exports.renderBilling = function(request, response, next) {
	if(request.user) {
		// Get Subscription Data from User
		// Format Object
		
		response.render('billing', {
			title: 'Formula Stocks - Billing',
			plan_data: // ???,
			messages: request.flash('error');
		});
	} else {
		// In login method, if "redirect_to" is set, when user is authenticated, redirect to billing.
		var message = 'Please login to enter billing information.';
		request.session.redirect = '/billing';
		request.flash('error', message);
		return response.redirect('/login');
	}
}