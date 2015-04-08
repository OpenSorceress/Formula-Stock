(function($){
	
	$('.alert').slideDown();
	
	if($("#home").length) {
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
			    }
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
			
			var month = new Array();
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "August";
			month[8] = "September";
			month[9] = "October";
			month[10] = "November";
			month[11] = "December";
			
			
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
				console.log(platinum_records[$(this).index() - 1].y);
			  
				var $point = $(this),
			    seriesName = $point.parent().attr('ct:series-name');
			    
			    if(seriesName == 'Pro Formula') {
				    $toolTip.html(seriesName + '<br>' + pro_records[$(this).index() - 1].y).show();
			    }else if(seriesName == 'Premium Formula') {
				    $toolTip.html(seriesName + '<br>' + premium_records[$(this).index() - 1].y).show();
			    }else if(seriesName == 'Platinum Formula') {
				    $toolTip.html(seriesName + '<br>' + platinum_records[$(this).index() - 1].y + '<br>' + month[platinum_records[$(this).index() - 1].x.getMonth()] + ' ' + platinum_records[$(this).index() - 1].x.getFullYear()).show();
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
		
	}
	
	function format_data(years, values) {
		var data = [];
		$.each(values, function(i, value) {
			data.push({x:new Date(years[i]), y:value});
		});
		return data;
	}

	$('input').focus(function() {
		
		if( $("#get-in-touch").length ) {
			return;
		}
		
		$('.alert').slideUp();
		
		if(this.id == 'lastname' || this.id == 'firstname') {
			if($('label[for="firstname"]').hasClass('labelError')) {
				if(this.id == 'firstname') {
					if($('#lastname').hasClass('inputError')) {
						$(this).removeClass('inputError');
					} else if(!$('#lastname').hasClass('inputError')) {
						$('label[for="firstname"]').removeClass('labelError').addClass('labelFocus');
						$(this).removeClass('inputError');
					}
				} else if (this.id == 'lastname') {
					if($('#firstname').hasClass('inputError')) {
						$(this).removeClass('inputError');
					} else {
						$('label[for="firstname"]').removeClass('labelError').addClass('labelFocus');
						$(this).removeClass('inputError');
					}
				}
			} else {
				$('label[for="firstname"]').addClass('labelFocus');
			}
		} else {
			if($('label[for="' + this.id + '"]').hasClass('labelError')) {
				$('label[for="' + this.id + '"]').removeClass('labelError').addClass('labelFocus');
				$(this).removeClass('inputError');
			} else {
				$('label[for="' + this.id + '"]').addClass('labelFocus');
			}	
		}	
	}).blur(function() {
		$('label').removeClass('labelFocus');
	});
	
	$('#loginButton').click(function(e) {		
		if($('#username')[0].value != '' && $('#password')[0].value != '') {
			// Submit the form.
		} else {
			e.preventDefault();
			
			if(!$('#username')[0].value) {
				$('label[for="username"]').addClass('labelError');
				$('#username').addClass('inputError');
				
				if (!$('#username').is(":animated") && !$('label[for="username"]').is(':animated')) {
					$('#username').stop(true).effect('shake', {distance: 5, times: 2});
					$('label[for="username"]').stop(true).effect('shake', {distance: 5, times: 2});
				}
			}
			
			if(!$('#password')[0].value) {
				$('label[for="password"]').addClass('labelError');
				$('#password').addClass('inputError');
				
				if (!$('#password').is(":animated") && !$('label[for="password"]').is(':animated')) {
					$('#password').stop(true).effect('shake', {distance: 5, times: 2});
					$('label[for="password"]').stop(true).effect('shake', {distance: 5, times: 2});
				}			
			}
		}
	});
	
	$('#registerButton').click(function(e) {
		if($('#firstname')[0].value != '' && $('#lastname')[0].value != '' &&('#email')[0].value != '' && $('#password')[0].value != '') {
			// Submit the form.
		} else {
			e.preventDefault();
			
			if(!$('#firstname')[0].value && !('#lastname')[0].value) {
				$('label[for="firstname"]').addClass('labelError');
				$('#firstname').addClass('inputError');
				$('#lastname').addClass('inputError');
				
				if (!$('#firstname').is(":animated") && !$('#lastname').is(":animated") && !$('label[for="firstname"]').is(':animated')) {
					$('#firstname').stop(true).effect('shake', {distance: 5, times: 2});
					$('#lastname').stop(true).effect('shake', {distance: 5, times: 2});
					$('label[for="firstname"]').stop(true).effect('shake', {distance: 5, times: 2});
				}
			} else {
				if(!$('#firstname')[0].value) {
					$('label[for="firstname"]').addClass('labelError');
					$('#firstname').addClass('inputError');
					
					if (!$('#firstname').is(":animated") && !$('label[for="fistname"]').is(':animated')) {
						$('#firstname').stop(true).effect('shake', {distance: 5, times: 2});
						$('label[for="firstname"]').stop(true).effect('shake', {distance: 5, times: 2});
					}
				} else if(!$('#lastname')[0].value) {
					$('label[for="firstname"]').addClass('labelError');
					$('#lastname').addClass('inputError');
					
					if (!$('#lastname').is(":animated") && !$('label[for="lastname"]').is(':animated')) {
						$('#lastname').stop(true).effect('shake', {distance: 5, times: 2});
						$('label[for="firstname"]').stop(true).effect('shake', {distance: 5, times: 2});
					}
				}
			}
			
			if(!$('#email')[0].value) {
				$('label[for="email"]').addClass('labelError');
				$('#email').addClass('inputError');
				
				if (!$('#email').is(":animated") && !$('label[for="email"]').is(':animated')) {
					$('#email').stop(true).effect('shake', {distance: 5, times: 2});
					$('label[for="email"]').stop(true).effect('shake', {distance: 5, times: 2});
				}
			}
			
			if(!$('#password')[0].value) {
				$('label[for="password"]').addClass('labelError');
				$('#password').addClass('inputError');
				
				
				if (!$('#password').is(":animated") && !$('label[for="password"]').is(':animated')) {
					$('#password').stop(true).effect('shake', {distance: 5, times: 2});
					$('label[for="password"]').stop(true).effect('shake', {distance: 5, times: 2});
				}
			}
		}
	});
	
	$('.edit-sub').click(function() {
		toggle_state();
	});
	
	$('span.subscription').click(function() {
		toggle_state();
	});
	
	$('.option_item').click(function(e) {
		e.preventDefault();
		
		$('.selected').removeClass('selected');
		$(this).parent().addClass('selected');
		
		if($(this).attr('href') == 'trial') {
			$('span.subscription').html('90 Day Free Trial');
		} else if($(this).attr('href') == 'pro_month') {
			$('span.subscription').html('Pro Formula $49.95 Monthly');
		} else if($(this).attr('href') == 'premium_month') {
			$('span.subscription').html('Premium Formula $99.95 Monthly');
		} else if($(this).attr('href') == 'pro_year') {
			$('span.subscription').html('Pro Formula $549.95 Annually');
		} else if($(this).attr('href') == 'premium_year') {
			$('span.subscription').html('Premium Formula $999.95 Annually');
		} else if($(this).attr('href') == 'platinum_year') {
			$('span.subscription').html('Platinum Formula $20,000 Annually');
		}
				
		toggle_state();
	});
	
	$(document).ready(function(){
		$('a[href^="#"]').on('click',function (e) {
		    e.preventDefault();
			
			console.log("menu clicked");
			
		    var target = this.hash;
		    var $target = $(target);
	
		    $('html, body').stop().animate({
		        'scrollTop': $target.offset().top
		    }, 900, 'swing', function () {
		        window.location.hash = target;
		    });
		});		
	});
	
	$("textarea").mousemove(function(e) {
        var myPos = $(this).offset();
        myPos.bottom = $(this).offset().top + $(this).outerHeight();
        myPos.right = $(this).offset().left + $(this).outerWidth();
        
        if (myPos.bottom > e.pageY && e.pageY > myPos.bottom - 16 && myPos.right > e.pageX && e.pageX > myPos.right - 16) {
            $(this).css({ cursor: "nw-resize" });
        }
        else {
            $(this).css({ cursor: "" });
        }
    })
    //  the following simple make the textbox "Auto-Expand" as it is typed in
    .keyup(function(e) {
        //  this if statement checks to see if backspace or delete was pressed, if so, it resets the height of the box so it can be resized properly
        if (e.which == 8 || e.which == 46) {
            $(this).height(parseFloat($(this).css("min-height")) != 0 ? parseFloat($(this).css("min-height")) : parseFloat($(this).css("font-size")));
        }
        //  the following will help the text expand as typing takes place
        while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
            $(this).height($(this).height()+1);
        };
    });
	
	function toggle_state() {
		if($('.edit-sub').html() == '<i class="fa fa-sort-desc"></i>' || !($('.edit-sub').hasClass('activeState'))) {
			$('.edit-sub').fadeOut(function() {
				$('.edit-sub').html('<i class="fa fa-sort-asc"></i>');
				$('.edit-sub').addClass('activeState');
				$('.edit-sub').css('top', '28px');
			}).fadeIn();
			
		} else {
			$('.edit-sub').fadeOut(function() {
				$('.edit-sub').html('<i class="fa fa-sort-desc"></i>');
				$('.edit-sub').removeClass('activeState');
				$('.edit-sub').css('top', '17px');
			}).fadeIn();
		}
		
		$('.subscription_menu').animate({
			height: "toggle",
			opacity: "toggle"
		});
	}
})(jQuery);