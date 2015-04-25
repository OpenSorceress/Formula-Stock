(function($) {
	var db_query_results = {
		"actionable" : [
			{
				"date" : {
					"day" : "17",
					"month" : "4",
					"year" : "2015"
				},
				"name" : "CARBO CERAMICS      ",
				"ticker" : "CRR",
				"action" : "BUY",
				"suggested_price" : 31.19,
				"percentage_weight" : 99.9983,
				"advanced_data" : [
					{
						"name" : "cyclically_adjusted_earnings_yield",
						"display_name" : "Cyclically Adjusted Earnings Yield",
						"value" : 9.87048,
						"unit" : "percent",
						"description" : "The cyclically adjusted price-to-earnings ratio is a valuation measure usually applied to the US S&P 500 equity market."
					}, {
						"name" : "dividend_yield",
						"display_name" : "Divident Yield",
						"value" : 4.03976,
						"unit" : "percent",
						"description" : "The dividend yield of a share is the dividend per share, divided by the price per share."
					}
				]
			},{
				"date" : {
					"day" : "17",
					"month" : "4",
					"year" : "2015"
				},
				"name" : "CARBO CERAMICS      ",
				"ticker" : "NUS",
				"action" : "BUY",
				"suggested_price" : 60.11,
				"percentage_weight" : 35.9983,
				"advanced_data" : [
					{
						"name" : "cyclically_adjusted_earnings_yield",
						"display_name" : "Cyclically Adjusted Earnings Yield",
						"value" : 9.87048,
						"unit" : "percent",
						"description" : "The cyclically adjusted price-to-earnings ratio is a valuation measure usually applied to the US S&P 500 equity market."
					}, {
						"name" : "dividend_yield",
						"display_name" : "Divident Yield",
						"value" : 4.03976,
						"unit" : "percent",
						"description" : "The dividend yield of a share is the dividend per share, divided by the price per share."
					}
				]
			}
		]
	};
	
	var promises = [];
	
	var elements = [];
	var configs = [];
	var charts = [];
	
	getData(db_query_results.actionable);
	
	function getData(suggestions) {
		var i = 0;
		
		function next() {
			if (i < suggestions.length) {				
				var symbol = formatSymbol(suggestions[i].ticker);
				var trim_end = formatDate(new Date());
				var trim_start = formatDate(new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)));
				var auth_token = "6SfHcXos6YBX51kuAq8B";
				var query = "https://www.quandl.com/api/v1/datasets/WIKI/" + symbol + ".json?trim_start=" + trim_start + "&trim_end=" + trim_end + "&auth_token=" + auth_token;
				
				if(symbol.indexOf("_TO") > -1) {
					query = "https://www.quandl.com/api/v1/datasets/YAHOO/TSX_" + symbol + ".json?trim_start=" + trim_start + "&trim_end=" + trim_end + "&auth_token=" + auth_token;
				}
				
				$.ajax({
					url: query,
					success: function(response) {
						promises.push(response);
						i++;
						next();
					},
					error: function() {
						query = "https://www.quandl.com/api/v1/datasets/GOOG/NASDAQ_" + symbol + ".json?trim_start=" + trim_start + "&trim_end=" + trim_end + "&auth_token=" + auth_token;
						
						$.ajax({
							url: query,
							success: function(response) {
								promises.push(response);
								i++;
								next();
							},
							error: function() {
								query = "https://www.quandl.com/api/v1/datasets/GOOG/NYSE_" + symbol + ".json?trim_start=" + trim_start + "&trim_end=" + trim_end + "&auth_token=" + auth_token;
								
								$.ajax({
									url: query,
									success: function(response) {
										promises.push(response);
										i++;
										next();
									},
									error: function() {
										query = "https://www.quandl.com/api/v1/datasets/GOOG/AMEX_" + symbol + ".json?trim_start=" + trim_start + "&trim_end=" + trim_end + "&auth_token=" + auth_token;
										
										$.ajax({
											url: query,
											success: function(response) {
												promises.push(response);
												i++;
												next();
											},
											error: function() {
												promises.push({
													error: 'Could not retrieve data for ' + symbol
												});
												
												i++;
												next();
											}
										});
									}
								});
							}
						});
					}
				});
			} else {
				// Finished... call method?
				for(var j = 0; j < promises.length; j++) {					
					if(promises[j].error) {
						console.log("There was an error for line-chart-" + j);
						var elem = "#line-chart-" + j;
						$(elem).parent().addClass('line-chart-error');
						var error_string = "Data could not be retrieved for " + suggestions[j].ticker;
						$(elem).html('<p class="chart-error"><i class="fa fa-exclamation-triangle fa-lg"></i><br />' + error_string + '</p>')
					} else {
						// Format Chart Data
						var chart_data = format_chart_data(promises[j], suggestions[j].suggested_price);
						var chart_data = chart_data.reverse();
						var chart_conf = get_chart_config(chart_data, suggestions[j].suggested_price);
						
						var jq_elem = "#line-chart-" + j;
						var am_elem = "line-chart-" + j;
						
						charts.push(AmCharts.makeChart(am_elem, chart_conf));
						
						// console.log(promises[j]);
						console.log("Data was retrieved for line-chart-" + j);
					}
				}
				
				console.log(charts);
			}
		}
		
		next();
	}
	
	function get_chart_config(chart_data, suggested_price) {
		return {
			"type" : "serial",
			"theme" : "light",
			"marginTop" : 9,
			"marginRight" : 17,
			"marginLeft" : 16,
			"marginBottom" : 25,
			"autoMargins" : false,
			"pathToImages" : "/js/amcharts/images/",
			"dataProvider" : chart_data,
			"valueAxes": [{
				"inside": true,
				"axisAlpha": 0
			}],
			"graphs":[{
				"balloonText": "<div style='magin:5px; font-size:18px;'><span style='font-size:13px;'>[[price]]</span></div>",
				"bullet" : "round",
				"bulletBorderAlpha": 1,
				"bulletBorderColor": "#FFFFFF",
				"hideBulletsCount" : 50,
				"lineThickness" : 2,
				"lineColor" : "#D9124A",
				"negativeLineColor": "#12D99E",
				"valueField" : "value",
				"negativeBase" : suggested_price
			}],
			"chartScrollbar" : {},
			"chartCursor" : {},
			"categoryField" : "date",
			"categoryAxis" : {
				"parseDates": true,
				"axisAlpha": 0,
				"minHorizontalGap": 55
			}
		};
	}
	
	function format_chart_data(response, suggested_price) {
		var chartData = [];
		
		response.data.forEach(function(data) {
			chartData.push({
				date: new Date(data[0]),
				price: formatPrice(data[4]),
				value: data[4]
				// percent: (((data[4] / suggested_price) * 100) - 100)
			});
		});
		
		return chartData;
	}
	
	function formatDate(date) {
	    var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();
	
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
	
	    return [year, month, day].join('-');
	}
	
	function formatSymbol(symbol) {
		var replaced = symbol.split('.').join('_');
		return replaced;
	}
	
	function formatPrice(value) {
		while(/(\d+)(\d{3})/.test(value.toString())) {
			value = value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		
		return "$" + value;
	}
	
	function generatechartData() {
	    var chartData = [];
	    var firstDate = new Date();
	    firstDate.setDate(firstDate.getDate() - 150);
	
	    for (var i = 0; i < 150; i++) {
	        // we create date objects here. In your data, you can have date strings
	        // and then set format of your dates using chart.dataDateFormat property,
	        // however when possible, use date objects, as this will speed up chart rendering.
	        var newDate = new Date(firstDate);
	        newDate.setDate(newDate.getDate() + i);
	
	        var visits = Math.round(Math.random() * 90 - 45);
	
	        chartData.push({
	            date: newDate,
	            visits: visits
	        });
	    }
	    return chartData;
	}
})(jQuery);