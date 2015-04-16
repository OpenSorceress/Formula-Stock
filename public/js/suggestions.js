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
	});
})(jQuery);