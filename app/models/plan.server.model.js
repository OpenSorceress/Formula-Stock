var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PlanSchema = new Schema({
	name: String,
	formula: String,
	cycle: String,
	price: Number
});

PlanSchema.statics.findByName = function(param, callback) {
	var _this = this;
	_this.findOne({name: param}, function(err, subscription_plan) {
		if(subscription_plan === null && err === null) {
			err = "Error: Subscription was not found.";
		}
		callback(err, subscription_plan);
	});
};

mongoose.model('Plan', PlanSchema);