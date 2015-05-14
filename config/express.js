var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	session = require('express-session'),
	multer = require('multer');

module.exports = function() {
	var app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(multer({ dest: './tmp/' }));
	
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'MemoryAndDirectionalSenseOfAGoldfish'
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/dashboard.server.routes.js')(app);
	require('../app/routes/plans.server.routes.js')(app);

	app.use(express.static('./public'));

	return app;
};