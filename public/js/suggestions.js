(function($) {
	var percent = 27;
	var value = 360 * percent / 100;
	var remainder = 360 - value;
	console.log(value);
	console.log(remainder);
	
	$(document).ready(function() {
		// Make Line Chart
		var chartData = generatechartData();

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


		var line_chart = AmCharts.makeChart("line-chart", {
		    "theme": "light",
		    "type": "serial",
		    "marginTop":9,
		    "marginRight":17,
		    "marginLeft":16,
		    "marginBottom":25,
		    "autoMargins":false,
		    "pathToImages": "http://www.amcharts.com/lib/3/images/",
		    "dataProvider": chartData,
		    "valueAxes": [{
		        "inside":true,
		        "axisAlpha": 0
		    }],
		    "graphs": [{
		        "id":"g1",
		        "balloonText": "<div style='margin:5px; font-size:19px;'><span style='font-size:13px;'>[[category]]</span><br>[[value]]</div>",
		        "bullet": "round",
		        "bulletBorderAlpha": 1,
		        "bulletBorderColor": "#FFFFFF",
		        "hideBulletsCount": 50,
		        "lineThickness": 2,
		        "lineColor": "#d9124a",
		        "negativeLineColor": "#12d99e",
		        "valueField": "visits"
		    }],
		    "chartScrollbar": {
				"dragIconHeight":50,
				"dragIconWidth":25
		    },
		    "chartCursor": {},
		    "categoryField": "date",
		    "categoryAxis": {
		        "parseDates": true,
		        "axisAlpha": 0,
		        "minHorizontalGap": 55
		    }
		});

		line_chart.addListener("dataUpdated", zoomChart);
		zoomChart();

		function zoomChart() {
		    if (line_chart) {
		        if (line_chart.zoomToIndexes) {
		            line_chart.zoomToIndexes(130, chartData.length - 1);
		        }
		    }
		}
		
		// Make Pie Chart	
		var pie_chart = AmCharts.makeChart( "donut-chart", {
		  "type": "pie",
		  "theme": "light",
		  "dataProvider": [ {
		    "value": value,
		     "color": "#1baed3"
		  }, {
		    "value": remainder,
		    "color":"#bdbdbd"
		  } ],
		  "colors" : ["#1baed3", "#e6e6e6"],
		  "titleField": "title",
		  "valueField": "value",
		  "labelRadius": 5,
		
		  "radius": "42%",
		  "innerRadius": "65%",
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
		    "enabled": true,
		    "libs": {
		      "path": "http://www.amcharts.com/lib/3/plugins/export/libs/"
		    }
		  }
		});
	});
})(jQuery);