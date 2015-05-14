var plans = require('../../app/controllers/plans.server.controller');

module.exports = function(app) {
	app.route('/price').get(plans.getPrice);
}