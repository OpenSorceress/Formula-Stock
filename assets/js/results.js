(function($) {
	var AJAX = [];
	var api_urls = [
		"../api/pro/annually/2014.json", 
		"../api/premium/annually/2014.json", 
		"../api/platinum/annually/2014.json"
	];
	
	$(document).ready(function() {
		$.each(api_urls, function(i, url) {
			AJAX.push(get_data(url));
		});
		
		$.when.apply($, AJAX).done(function() {
			var obj = [];
			var returns = [];
			
			var next_year = null;
		    var years = [];
		    var pro_values = [];
		    var premium_values = [];
		    var platinum_values = [];
		    var chart_data = [];
			
			var pro_results = {};
			var premium_results = {};
			var platinum_results = {};
			
			for(var i = 0, len = arguments.length; i < len; i++) {
				obj.push(arguments[i][0]);
			}
			
			// Determine each total_return value for the results.
			$.each(obj, function(j, log) {
				returns.push(log.statistics.total_return);
			});
			
			// Determine the minimum and the maximum.
			var minimum = Array.min(returns);
			var maximum = Array.max(returns);
			
			// Determine which results belong to which plans.
			$.each(obj, function(j, log) {
				if(log.statistics.total_return == maximum) {
					platinum_results = log;
				}else if(log.statistics.total_return == minimum) {
					pro_results = log;
				}else {
					premium_results = log;
				}
			});
			
			$.each(pro_results.logs, function(j, log) {
			    var temp_date = log.date.year + '-' + (Number(log.date.month) < 10 ? "0" + Number(log.date.month) : Number(log.date.month)) + '-' + (Number(log.date.day) < 10 ? "0" + Number(log.date.day) : Number(log.date.day));
		    
			    years.push(temp_date);
			    pro_values.push(Number(log.balance));
	    	});
	    	
	    	$.each(premium_results.logs, function(j, log) {
			   premium_values.push(Number(log.balance)); 
		    });
		    
		    $.each(platinum_results.logs, function(j, log) {
			   platinum_values.push(Number(log.balance)); 
		    });
		    
		    
		    // Here is when you have all the data.
		    for (var i = 0; i < years.length; i++) {
			    chart_data.push({
				   date : years[i],
				   pro : pro_values[i],
				   premium: premium_values[i],
				   platinum: platinum_values[i],
				   pro_balloon : format_price(pro_values[i]),
				   premium_balloon : format_price(premium_values[i]),
				   platinum_balloon : format_price(platinum_values[i])
			    });
		    }
/*
			var chartData = [{
				date : years,
				pro : pro_values,
				premium : premium_values,
				platinum : platinum_values	
			}];
*/
			
			// Load the chart
			var log_scale = AmCharts.makeChart("log-scale", {
			    "type": "serial",
			    "theme": "light",
			    "marginRight": 30,
			    "marginTop": 17,
			    "autoMarginOffset": 20,
			    "pathToImages": "http://www.amcharts.com/lib/3/images/",
			    "dataProvider": chart_data,
			    "valueAxes": [{
			        "logarithmic": true,
			        "dashLength": 1,
			        "guides": [{
			            "dashLength": 6,
			            "inside": true,
			            "label": "average",
			            "lineAlpha": 1,
			            "value": 90.4
			        }],
			        "position": "left"
			    }],
			    "graphs": [{
			        "bullet": "none",
			        "id": "g1",
			        "bulletBorderAlpha": 1,
			        "lineColor" : "#D3D3D3",
			        "bulletColor": "#FFFFFF",
			        "bulletSize":0,
			        "lineThickness": 1,
			        "title": "Pro Formula",
			        "useLineColorForBulletBorder": true,
			        "valueField": "pro",
			        "balloonText" : "<b>Pro Formula</b> <br />[[pro_balloon]]"
			    }, {
				   "bullet": "none",
			        "id": "g2",
			        "bulletBorderAlpha": 1,
			        "lineColor" : "#49494A",
			        "bulletColor": "#FFFFFF",
			        "bulletSize": 0,
			        "lineThickness": 1,
			        "title": "Premium Formula",
			        "useLineColorForBulletBorder": true,
			        "valueField": "premium",
			        "balloonText" : "<b>Premium Formula</b> <br />[[premium_balloon]]"
			    }, {
				    "bullet": "none",
			        "id": "g3",
			        "bulletBorderAlpha": 1,
			        "lineColor" : "#18AED5",
			        "bulletColor": "#FFFFFF",
			        "bulletSize": 0,
			        "lineThickness": 1,
			        "title": "Platinum Formula",
			        "useLineColorForBulletBorder": true,
			        "valueField": "platinum",
			        "balloonText" : "<b>Platinum Formula</b> <br />[[platinum_balloon]]"
			    }],
			    "chartScrollbar": {
				    "enabled" : true,
				    "scrollbarHeight" : 10,
				    "dragIconWidth" : 20
			    },
			    "chartCursor": {
			        "valueLineEnabled": true,
			        "valueLineBalloonEnabled": true,
			        "valueLineAlpha": 0.5,
			        "fullWidth": true,
			        "cursorAlpha": 0.05
			    },
			    "dataDateFormat": "YYYY-MM-DD",
			    "categoryField": "date",
			    "categoryAxis": {
			        "parseDates": true
			    },
			    "export": {
			        "enabled": false
			    }
			});
			
			log_scale.addListener("dataUpdated", zoomChart);
			
			function zoomChart() {
				var start = new Date(years[0]);
				var end = new Date(years[years.length - 1]);
			    log_scale.zoomToDates(start, end);
			}
		});
	});
	
	function format_price(value) {
		while(/(\d+)(\d{3})/.test(value.toString())) {
			value = value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		
		var price = '$' + value + ' USD';
		
		return price;
	}
	
	function get_data(url) {
		return $.getJSON(url);
	}
	
	Array.min = function( array ){
	    return Math.min.apply( Math, array );
	};
	
	Array.max = function( array ){
		return Math.max.apply( Math, array );
	}
	
})(jQuery);