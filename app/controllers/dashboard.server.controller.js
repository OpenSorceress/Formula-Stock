var Asset = require('mongoose').model('Asset'),
	User = require('mongoose').model('User'),
	passport = require('passport'),
	request = require('request');

function get_json(api_url, callback) {
	request(api_url, function(error, response, body) {
		var final_data = JSON.parse(body);
		return callback(final_data);
	});
}

function add_commas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

exports.render = function(req, res, next) {
	var url = 'http://api.formulastocks.com/json/weekly.json';
	get_json(url, function(weekly_response) {
		var weekly_json = weekly_response;
		var tickers = [];
		
		// Push Tickers from Weekly Data.JSON
		for (var i = 0; i < weekly_json.actionable.length; i++) {
			var ticker = weekly_json.actionable[i].ticker;
			tickers.push(ticker);
		}
		
		// Push Tickers from User Assets
		Asset.find({user_id: req.user.id}, function(err, assets) {
			if (err) { } else {
				var fs_total = 0;
				var os_total = 0;
				
				var suggested_actions = [];
				var my_formula_stocks = [];
				var my_other_stocks = [];
				
				assets.forEach(function(el, index) {
					tickers.push(el.ticker);
				});
				
				var tickers_string = '';
				
				for (var j = 0; j < tickers.length; j++) {
					if(j == 0) {
						tickers_string += '%22' + tickers[j] + '%22';
					} else {
						tickers_string += ',%22' + tickers[j] + '%22';
					}
				}
				
				var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(' + tickers_string + ')%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=';
				
				get_json(api, function(api_response) {
					var prices = [];
					
					api_response.query.results.quote.forEach(function(stock) {
						// console.log(stock);
						var regex = /<b>(.*?)<\/b>/;
						//var price = undefined;
						// console.log(stock.LastTradeRealtimeWithTime);
						
/*
						if(stock.LastTradeRealtimeWithTime == null) {
							price = 'N/A';
						} else {
							var price = stock.LastTradeRealtimeWithTime.match(regex)[1];
						}
*/
						
						prices.push({
							ticker: stock.symbol,
							price: stock.LastTradePriceOnly
						});
					});
					
					// Suggested Actions
					weekly_json.actionable.forEach(function(el, index) {
						
						var action_object = {
							'action' : el.action,
							'asset' : el.name,
							'ticker' : el.ticker,
							'allocation' : el.percentage_weight,
							'suggested_count' : 0,
							'suggested_price' : el.suggested_price,
							'current_price' : 0
						}
						
						prices.forEach(function(pr, index) {
							if(pr.ticker == el.ticker) {
								action_object.current_price = pr.price;
							}
						});
						
						action_object.suggested_count = Math.floor((req.user.investment_capital * (action_object.allocation / 100)) / action_object.current_price);
						
						// Fix Decimals / Commas:
						action_object.allocation = action_object.allocation.toFixed(1);
						action_object.suggested_price = action_object.suggested_price.toFixed(2);
						action_object.current_price = Number(action_object.current_price).toFixed(2);
						
						suggested_actions.push(action_object);
					});
					
					// Formula Stocks
					assets.forEach(function(el, index) {

						weekly_json.actionable.forEach(function(weekly, index) {
							if(el.ticker == weekly.ticker) {
								var formula_object = {
									'asset' : el.asset,
									'ticker' : el.ticker,
									'allocation' : 0,
									'count' : 0,
									'value' : 0,
									'price' : 0
								}
								
								el.shares.forEach(function(sh, index) {
									fs_total += sh.count * sh.price;
									formula_object.value += sh.count * sh.price;
									formula_object.count += sh.count;
								});
																
								prices.forEach(function(pr, index) {
									if(pr.ticker == el.ticker) {
										formula_object.price = pr.price;
									}
								});
								
								formula_object.allocation = (formula_object.value * 100) / (fs_total + req.user.investment_capital);
								
								// Fix Decimals / Commas:
								formula_object.allocation = formula_object.allocation.toFixed(1);
								formula_object.value = add_commas(formula_object.value.toFixed(2));
								formula_object.price = Number(formula_object.price).toFixed(2);
								
								my_formula_stocks.push(formula_object);
							}
						});
					});
					
					var symbols = [];
					weekly_json.actionable.forEach(function(weekly, index) {
						symbols.push(weekly.ticker);
					});
					
					// Other Stocks
					assets.forEach(function(el, index) {
						if(symbols.indexOf(el.ticker) > -1) {} else {
							
							var other_object = {
								'asset' : el.asset,
								'ticker' : el.ticker,
								'allocation' : 0,
								'count' : 0,
								'value' : 0,
								'price' : 0
							}
							
							el.shares.forEach(function(sh, index) {
								os_total += sh.count * sh.price;
								other_object.value += sh.count * sh.price;
								other_object.count += sh.count;
							});
							
							prices.forEach(function(pr, index) {
								if(pr.ticker == el.ticker) {
									other_object.price = pr.price;
								}
							});
							
							other_object.allocation = (other_object.value * 100) / os_total;
							
							// Fix Decimals / Commas:
							other_object.allocation = other_object.allocation.toFixed(1);
							other_object.value = add_commas(other_object.value.toFixed(2));
							other_object.price = Number(other_object.price).toFixed(2);
							
							my_other_stocks.push(other_object);
						}
					});
					
					
					return_data = {
						'suggested_actions' : suggested_actions,
						'fs_invested' : add_commas(fs_total.toFixed(2)),
						'my_formula_stocks' : my_formula_stocks,
						'os_invested' : add_commas(os_total.toFixed(2)),
						'my_other_stocks' : my_other_stocks
						// 'investment_capital' : add_commas(req.user.investment_capital.toFixed(2)),
						// 'capital_allocation' : ((req.user.investment_capital * 100) / (fs_total + req.user.investment_capital)).toFixed(1)
					}
					
					// res.send(return_data);
					res.render('dashboard', {
						title: 'My Formula Stocks',
						data: return_data
					});
				});
			}
		});
		
	});
}

exports.buy = function(req, res, next) {
	var input = req.body;
	var total = req.user.investment_capital;
	
	var asset_object = {
		user_id: req.user.id,
		asset: input.asset,
		ticker: input.ticker,
		shares: [{
			count: input.quantity,
			price: input.price
		}]
	};
	
	asset_object.shares.forEach(function(el, index) {
		total -= el.count * el.price;
	});
	
	User.update({_id: req.user.id}, {$set: {investment_capital : total}}, function(err) {
		if(err) {
			return next(err);
		} else {
			Asset.find({user_id:req.user.id, ticker: input.ticker}, function(err, obj) {
				if(obj.length > 0) {
					// Stock exists... push to "shares"
					Asset.update({user_id:req.user.id, ticker: input.ticker}, {$push: {shares: {count: input.quantity, price: input.price}}}, function(err) {
						if(err) {
							return next(err);
						} else {
							res.redirect('/portfolio');
						}
					});
				} else {
					// Stock doesn't exist... create new!
					var asset = new Asset(asset_object);
					asset.save(function(err) {
						if(err) {
							return next(err);
						} else {
							res.redirect('/portfolio');
						}
					});
				}
			});
		}
	});
}

exports.sell = function(req, res, next) {
	var input = req.body;
	
	// console.log(input.ticker, req.user.id);
	
	Asset.find({user_id:req.user.id, ticker:input.ticker}, function(err, obj) {
		
		var total_count = 0;		

		obj[0].shares.forEach(function(el, index) {
			total_count += el.count;
		});

		var profit = total_count * input.current_price;
		var ic = profit + req.user.investment_capital;
		
		Asset.remove({user_id:req.user.id, ticker:input.ticker}, function(err) {
			if(err) {
				return next(err);
			} else {
				User.update({_id: req.user.id}, {$set: {investment_capital : ic}}, function(err) {
					if(err) {
						return next(err);
					} else {
						res.redirect('/portfolio');
					}
				});
			}
		});
	});
}