var Plan = require('mongoose').model('Plan'),
	request = require('request');

exports.getPrice = function(req, res) {
	console.log(req.query.name);
	console.log(req.query.cycle);
	
	var param_name = req.query.name;
	var param_cycle = req.query.cycle;
	
	Plan.findByName(param_name, function(err, selected_plan) {
		if(param_cycle == 'yearly') {
			var formatted_price = format_price(selected_plan.price.yearly) + '.00';
			res.send({price: formatted_price});
		} else if(param_cycle == 'monthly') {
			var formatted_price = format_price(selected_plan.price.monthly) + '.00';
			res.send({price: formatted_price});
		}
	});
}

function format_price(value) {
	while(/(\d+)(\d{3})/.test(value.toString())) {
		value = value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	
	return value;
}