var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var FileSchema = new Schema({
	name: String,
	path: String,
	uploaded: Number,
	url: String
});

mongoose.model('File', FileSchema);