var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
	
/* -------------------------------------------------
   USER SCHEMA OBJECT
   -------------------------------------------------
   Additional information about provider,
   providerId, and the providerData properties:
   - provider: strategy used to register the user
   - providerId: user identifier for auth strategy
   -------------------------------------------------
 */
var UserSchema = new Schema({
	firstname: String,
	lastname: String,
	email: {
		type: String,
		index: true,
		trim: true,
		unique: true
	},
	password: String,
	usertype: Number,
	subtype: Number,
	trial_exp: Date,
	sub_renew: Date,
	stripe_id: String,
	provider: String,
	providerId: String,
	todos: {}
});

/* -------------------------------------------------
   PRE-SAVE MIDDLEWARE
   -------------------------------------------------
   This handles the user' password hashing. The
   pre-save middleware creates an MD5 hash of the
   password (using the crypto module) and then it
   replces the current user password with a hashed
   one.
   -------------------------------------------------
 */
UserSchema.pre('save', function(next) {
	if (this.password) {
		var md5 = crypto.createHash('md5');
		this.password = md5.update(this.password).digest('hex');
	}
	
	next();
});

/* -------------------------------------------------
   AUTHENTICATE METHOD
   -------------------------------------------------
   This method accepts a string password argument,
   which is then hashes and compares to the current
   user's hashed password.
   -------------------------------------------------
 */
UserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');
	
	return this.password === md5;
};

/* -------------------------------------------------
   FIND UNIQUE USERNAME STATIC METHOD
   -------------------------------------------------
   This is used to find an available unique username
   for new users.
   -------------------------------------------------
 */
UserSchema.statics.findUniqueEmail = function(email, suffix, callback) {
	var _this = this;
	var possibleEmail = email + (suffix || '');
	
	_this.findOne(
		{email: possibleEmail},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleEmail);
				} else {
					return _this.findUniqueEmail(email, (suffix || 0) + 1, callback);
				}
			} else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);