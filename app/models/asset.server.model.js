var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AssetSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user_id: String,
	asset: String,
	ticker: String,
	shares: [{
		count: Number,
		price: Number
	}]
});

mongoose.model('Asset', AssetSchema);