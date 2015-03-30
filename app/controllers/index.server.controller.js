exports.render = function(req, res) {
	res.render('index', {
        title: 'FormulaStocks',
        user: req.user ? req.user.username : ''
    });
};