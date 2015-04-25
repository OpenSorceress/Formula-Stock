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
				"suggested_price" : 42.29,
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
	//Test
	
	for(var i = 0; i < db_query_results.actionable.length; i++) {
		var chart_data = format_chart_data(db_query_results.actionable[i]);
		var chart_elem = "pie-chart-" + i;
		var chart = AmCharts.makeChart(chart_elem, {
			"type":	"pie",
			"theme": "light",
			"dataProvider":	[{
					"value": chart_data.value,
					"color": "#18AED5"
				},{
					"value": chart_data.remainder,
					"color": "#ECECEC"
				}],
			"valueField": "value",
			"colorField": "color",
			"labelRadius": 5,
			"radius": "42%",
			"innerRadius": "80%",
			"startEffect": ">",
			"startRadius": 30,
			"labelsEnabled": false,
			"autoMargins": false,
			"marginTop": 0,
			"marginBottom": 0,
			"marginLeft": 0,
			"marginRight": 0,
			"pullOutRadius": 0,
			"labelText": "[[title]]",
			"balloonText": "",
			"export": {
				"enabled" : true,
				"libs": {
					"path": "/js/plugins/export/libs/"
			    }
			}
		});
	}
	
	function format_chart_data(actionable_object) {		
		var percent = actionable_object.percentage_weight;
		var value = 360 * percent / 100;
		var remainder = 360 - value;
		
		var data = {
			value:		value,
			remainder:	remainder
		};
		
		return data;
	}
})(jQuery);