(function($) {
	
	var api_urls = ["../api/pro/annually/2014.json", "../api/premium/annually/2014.json", "../api/platinum/annually/2014.json"];
	
	function getData(url) {
		return $.getJSON(url);
	}
	
	var AJAX = [];
	
	$.each(api_urls, function(i, url) {
		AJAX.push(getData(url));
	});
	
	$.when.apply($, AJAX).done(function(){
	    var obj = [];
	    for(var i = 0, len = arguments.length; i < len; i++){
	        obj.push(arguments[i][0]);
	    }
	    
	    returns = [];
	    
	    pro_results = {};
	    premium_results = {};
	    platinum_results = {};
	    
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
	    
	    var next_year = null;
	    
	    var years = [];
	    var pro_values = [];
	    var premium_values = [];
	    var platinum_values = [];
	    
	    $.each(pro_results.logs, function(j, log) {
		    // console.log(log.date);
		    var temp_date = log.date.year + '-' + (Number(log.date.month) < 10 ? "0" + Number(log.date.month) : Number(log.date.month)) + '-' + (Number(log.date.day) < 10 ? "0" + Number(log.date.day) : Number(log.date.day)) + 'T00:00:00Z';
		    
		    years.push(temp_date);
		    //2013-07-11T04:00:00Z
	/*
		    if(next_year == null) {
			    next_year = Number(log.date.year) + 5;
			    years.push(Number(log.date.year));
		    } else if(log.date.year == next_year) {
			    next_year += 5;
			    years.push(Number(log.date.year));
		    } else {
			    years.push('');
		    }
	*/
		    			   
		   // years.push(Number(log.date.year));
		    pro_values.push(Number(log.balance));
	    });
	    
	    // console.log(years);
	    
	    $.each(premium_results.logs, function(j, log) {
		   premium_values.push(Number(log.balance)); 
	    });
	    
	    $.each(platinum_results.logs, function(j, log) {
		   platinum_values.push(Number(log.balance)); 
	    });
	    		
		var pro_records = format_data(years, pro_values);
		var premium_records = format_data(years, premium_values);
		var platinum_records = format_data(years, platinum_values);
		
		var options = {
			chartPadding: 5,
			showArea: false,
			lineSmooth: false,
			fullWidth: true,
			axisX: {
		        labelInterpolationFnc: function getLabels6Hour(value, index) {
		            return value.getFullYear();
		        }
		    },
		    axisY: {
				labelInterpolationFnc: function getLabel(value) {
					var accuracy = Math.pow(10, 5);
					return Math.round(value * accuracy) / accuracy;
				}
			},
		}
		
		var chartData = {
			series: [
				{
					name: 'Pro Formula',
					data: pro_records
				},
				{
					name: 'Premium Formula',
					data: premium_records
				},
				{
					name: 'Platinum Formula',
					data: platinum_records
				}
			]
		};
		
		var logTransform = function(point) {
			return {
				x: point.x,
				y: Math.log10(point.y)
			};
		};
		
		var month = new Array(
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		);
		
		
		console.log(pro_records, premium_records, platinum_records);
		var dateAxis = new Chartist.DateAxis(Chartist.Axis.units.x,{ ticksProvider: new Chartist.DateTicksProvider(Chartist.DateTicksProvider.Year) });
		var chart = new Chartist.LineXY('#chart', chartData, options, undefined, dateAxis, undefined, logTransform);
		
		var $chart = $('.ct-chart');
	
		var $toolTip = $chart
		  .append('<div class="tooltip"></div>')
		  .find('.tooltip')
		  .hide();
		
		$chart.on('mouseenter', '.ct-point', function() {
			// THIS WORKS!!
			// console.log(platinum_records[$(this).index() - 1].y);
		  
			var $point = $(this),
		    seriesName = $point.parent().attr('ct:series-name');
		    
		    if(seriesName == 'Pro Formula') {
			    $toolTip.html('<span class="tooltip-seriesName">' + seriesName + '</span><br><span class="tooltip-price">$' + format_price(Number(pro_records[$(this).index() - 1].y)) + ' USD</span><br><span class="tooltip-date">' + month[pro_records[$(this).index() - 1].x.getMonth()] + ' ' + pro_records[$(this).index() - 1].x.getFullYear() + '</span>').removeClass('tooltip-pro tooltip-premium tooltip-platinum').addClass('tooltip-pro').show();
		    }else if(seriesName == 'Premium Formula') {
			    $toolTip.html('<span class="tooltip-seriesName">' + seriesName + '</span><br><span class="tooltip-price">$' + format_price(Number(premium_records[$(this).index() - 1].y)) + ' USD</span><br><span class="tooltip-date">' + month[premium_records[$(this).index() - 1].x.getMonth()] + ' ' + premium_records[$(this).index() - 1].x.getFullYear() + '</span>').removeClass('tooltip-pro tooltip-premium tooltip-platinum').addClass('tooltip-premium').show();
		    }else if(seriesName == 'Platinum Formula') {
			    $toolTip.html('<span class="tooltip-seriesName">' + seriesName + '</span><br><span class="tooltip-price">$' + format_price(Number(platinum_records[$(this).index() - 1].y)) + ' USD</span><br><span class="tooltip-date">' + month[platinum_records[$(this).index() - 1].x.getMonth()] + ' ' + platinum_records[$(this).index() - 1].x.getFullYear() + '</span>').removeClass('tooltip-pro tooltip-premium tooltip-platinum').addClass('tooltip-platinum').show();
		    }
		});
		
		$chart.on('mouseleave', '.ct-point', function() {
		  $toolTip.hide();
		});
		
		$chart.on('mousemove', function(event) {
		  $toolTip.css({
		    left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
		    top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
		  });
		});
	});
	
	Array.min = function( array ){
	    return Math.min.apply( Math, array );
	};
	
	Array.max = function( array ){
		return Math.max.apply( Math, array );
	}
	
	function format_price(value) {
		while(/(\d+)(\d{3})/.test(value.toString())) {
			value = value.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		
		return value;
	}
	
	function format_data(years, values) {
		var data = [];
		$.each(values, function(i, value) {
			data.push({x:new Date(years[i]), y:value});
		});
		return data;
	}
	
	$('.results-graph-btn').click(function (e) {
		$('#formula-results').fadeToggle();
		$('#chart-overlay').fadeToggle();
	});
	
	$('#back').click(function(e) {
		e.preventDefault();
		
		var back_html = $('#back-formula').html();
		// console.log(back_html);
		
		$('#results-info').fadeToggle();
		$('#results-navigation').fadeToggle(function() {
			update_navigation(back_html);
		});
	});
	
	$('#next').click(function(e) {
		e.preventDefault();
		
		var next_html = $('#next-formula').html();
		// console.log(back_html);
		
		$('#results-info').fadeToggle();
		$('#results-navigation').fadeToggle(function() {
			update_navigation(next_html);
		});
	});
	
	function update_navigation(elem) {
		if(elem == 'Pro Formula') {
			$('#back-formula').html('Platinum Formula');
			$('#current-formula').html('Pro Formula');
			$('#next-formula').html('Premium Formula');
			get_statistics("../api/pro/annually/2014.json", 'Pro Formula');
		} else if(elem == 'Premium Formula') {
			$('#back-formula').html('Pro Formula');
			$('#current-formula').html('Premium Formula');
			$('#next-formula').html('Platinum Formula');
			get_statistics("../api/premium/annually/2014.json", 'Premium Formula');
		} else if(elem == 'Platinum Formula') {
			$('#back-formula').html('Premium Formula');
			$('#current-formula').html('Platinum Formula');
			$('#next-formula').html('Pro Formula');
			get_statistics("../api/platinum/annually/2014.json", 'Platinum Formula');
		}
	}
	
	function get_statistics(url, name) {
		$.getJSON(url, function(data) {
			// console.log(data.statistics);
			var total_return = Number(data.logs[data.logs.length - 1].balance);
			var CAGR = data.statistics.CAGR;
			
			var positives = data.statistics.positives;
			var negatives = data.statistics.negatives;
			
			// Calculate Success Rate
			var success = (positives * 100 / (positives + negatives)).toFixed(2);
			
			// Calculate amount of years.
			var last_year = Number(data.logs[data.logs.length - 1].date.year);
			var first_year = Number(data.logs[0].date.year);
			var years = last_year - first_year + 1;
			
			
			console.log("Years: " + years);
			console.log("Total Return: " + total_return);
			console.log("Average Annual Return: " + CAGR);
			console.log("Successful Stocks: " + positives);
			console.log("Success Rate: " + success + '%');
			
			$('#total_years').html(years);
			$('#start_year').html(first_year);
			$('.results-formula-text').html(name);
			$('.results-gain-text').html('$' + format_price(total_return));
			$('#annual-return .stats-number').html(CAGR + '%');
			$('#success-rate .stats-number').html(success + '%');
			$('#proft .stats-number').html(format_price(positives));
			
		}).done(function() {
			if(!$('#chart-overlay').is(':visible')) {
				$('#chart-overlay').fadeToggle();
				$('#formula-results').fadeToggle();
			}
			$('#results-info').fadeToggle();
			$('#results-navigation').fadeToggle();
		});
	}
})(jQuery);