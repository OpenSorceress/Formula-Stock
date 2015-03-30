var User = require('mongoose').model('User'),
	passport = require('passport');

var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}
	
	return message;
};

/* This just renders the login screen... */
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

exports.login = function(req, res, next) {
	req.login(user, function(err) {
		if (err) { return next(err); }
		console.log(req.user);
		return res.redirect('/portfolio');
	});
}

exports.renderRegister = function(req, res, next) {
	if (!req.user) {
		res.render('register', {
			title: 'Register Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/portfolio');
	}
};

/* -------------------------------------------------
   REGISTER METHOD
   -------------------------------------------------
   This method uses the User model to create new
   users, so that is first creates a user object
   from the HTTP request body. Then, it tries to
   save it to MongoDB and if an error occurs, the 
   register() method will use the getErrorMessage()
   method to fetch the errors. If the user was 
   created successfully, the user session will be
   created using the req.login() method provided by
   the Passport module. After the login operation
   is completed, a user object will be inside the
   req.user object.
   -------------------------------------------------
 */
exports.register = function(req, res, next) {
	if (!req.user) {
		var user = new User(req.body);
		var message = null;
		user.provider = 'local';
		user.save(function(err) {
			if (err) {
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
		return res.redirect('/portfolio');
	}
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
}

/* -------------------------------------------------
   CREATE USER
   -------------------------------------------------
 */
exports.create = function(req, res, next) {	
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

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
   DELETE USER
   -------------------------------------------------
   Mongoose also has several available methods to
   delete an existing document:
   
   remove(), findOneAndRemove(), findByIdAndRemove()
   
   Since the userById() method is already in use,
   use the findByIdAndRemove() method.
   -------------------------------------------------
 */
exports.delete = function(req, res, next) {
	req.user.remove(function(err) {
		if (err) {
			 return next(err);
		} else {
			 res.json(req.user);
		}
	});
 };