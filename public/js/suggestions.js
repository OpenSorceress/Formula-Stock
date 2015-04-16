(function($) {
	var percent = 27;
	var value = 360 * percent / 100;
	var remainder = 360 - value;
	console.log(value);
	console.log(remainder);
	
	$(document).ready(function() {
		new Chartist.Pie('.ct-chart', {
		  series: [value, remainder]
		}, {
		  donut: true,
		  donutWidth: 15,
		  total: 360,
		  showLabel: false
		});
		
		new Chartist.Line('.historicalData .ct-chart', {
		  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
		  series: [
		    [12, 9, 7, 8, 5],
		    [2, 1, 3.5, 7, 3],
		    [1, 3, 4, 5, 6]
		  ]
		}, {
		  fullWidth: true
		});
	});
})(jQuery);