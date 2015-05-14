var mongoose	= require('mongoose'),
	passport	= require('passport'),
	User 		= require('mongoose').model('User'),
	Stripe 		= require('stripe')("sk_test_9Z5AY0rUOLbtMMYQ4T5eOH1O");

exports.create_customer = function(req, response) {
	
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