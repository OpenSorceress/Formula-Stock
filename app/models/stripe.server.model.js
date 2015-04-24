var mongoose	= require('mongoose'),
	passport	= require('passport'),
	User 		= require('mongoose').model('User'),
	Stripe 		= require('stripe')("sk_test_9Z5AY0rUOLbtMMYQ4T5eOH1O");

exports.create_customer = function(request, response) {
	var token	= request.body.stripeToken;
	var plan	= request.body.selected_plan + "_" + request.body.subscription_checkbox;
	var email	= request.body.email;
	
	Stripe.customers.create({
		source:	stripeToken,
		plan:	plan,
		email:	email
	}, function(err, customer) {
		if(err) {
			var form_data = {
				firstname:		request.body.firstname,
				lastname:		request.body.lastname,
				email:			request.body.email,
				password:		request.body.password,
				selected_plan:	request.body.selected_plan,
				cycle: 			request.body.subscription_checkbox.capitalize(),
				plan: 			request.body.selected_plan.capitalize(),
				total_price: 	request.body.total_price,
				user_created: 	true
			}
										
			response.render('billing', {
				title:		'Sign Up for Formula Stocks',
				form_data:	form_data,
				messages:	req.flash('error', err.message)
			});
		} else {
			// Update User
			var unix_timestamp	= customer.subscriptions.data[0].current_period_end;
			var renew_date		= new Date(unix_timestamp*1000);
			var stripe_plan		= customer.subscriptions.data[0].plan.id;
			var status			= customer.subscription.data[0].status;
			var stripe_id		= customer.id;
			var query			= {email: email};
			
			User.update(query, {$set: {
				plan: 		stripe_plan,
				status:		status,
				sub_renew:	renew_date,
				stripe_id:	stripe_id
			}}, {multi: true}, function(err, user_document) {
				if(err) {
					console.log(err);
				} else {
					console.log(user_document);
					// Direct to dashboard! :)
				}
			});
		}
	});
}

/*
	
	plan: String,
	status: String,
	trial_exp: Date,
	sub_renew: Date,
	stripe_id: String,
	provider: String,
	providerId: String,

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
	
User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
	if (err) {
		return next(err);
	} else {
		res.json(user);
	}
});	
*/