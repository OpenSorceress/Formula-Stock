(function($) {
	var gtn = false;
	
	$(document).ready(function() {
		check_for_next();
		
		/* TEXTAREA AUTO EXPAND FUNCTIONALITY */
		$("textarea").mousemove(function(e) {
			var position = $(this).offset();
			position.bottom = $(this).offset().top + $(this).outerHeight();
			position.right	= $(this).offset().left + $(this).outerWidth();
			
			if(	position.bottom > e.pageY && 
				e.pageY > position.bottom - 16 &&
				position.right > e.pageX &&
				e.pageX > position.right - 16) {
				$(this).css({
					cursor: "nw-resize"
				});
			} else {
				$(this).css({
					cursor: ""
				});
			}
		})
		// The following makes the textarea auto-expand as it is typed in. 
		.keyup(function(e) {
			// This checks to see if a backspace or delete was pressed. 
			// If so, it resets the height of the box so it can be resized properly.
			if(e.which == 8 || e.which == 46) {
				$(this).height(parseFloat($(this).css("min-height")) != 0 ? parseFloat($(this).css("min-height")) : parseFloat($(this).css("font-size")));
			}
			
			// This will help the textarea expand as typing takes place.
			while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
				$(this).height($(this).height() + 1);
			}
		});
		
		
		/* SUBSCRIPTION DROP DOWN FUNCTIONALITY */
		$('.selected a').click(function(e) {
			e.preventDefault();
		});
		
		$('.subscription').click(function(e) {
			e.preventDefault();
			toggle_state();
		});
		
		$('.option_item').click(function(e) {
			e.preventDefault();
			if($(this).parent().hasClass('selected')) {
				return;
			} else {
				$('.selected').removeClass('selected');
				$(this).parent().addClass('selected');
				
				if($(this).attr('href') == 'trial') {
					$('span.current-subscription').html('90 Day Free Trial');
					disable_buttons();
					update_button('signup');
				} else if($(this).attr('href') == 'pro') {
					$('span.current-subscription').html('Pro Formula');
					enable_buttons();
				} else if($(this).attr('href') == 'premium') {
					$('span.current-subscription').html('Premium Formula');
					enable_buttons();
				} else if($(this).attr('href') == 'platinum') {
					$('span.current-subscription').html('Platinum Formula');
					disable_month_only();
					
				}
				
				update_price();
				toggle_state();
			}
		});
		
		$("input:radio[name ='subscription_checkbox']").change(function () {
			update_price();
		});
		
		$('#signup button[type="submit"]').click(function(e) {
			e.preventDefault();
			console.log(gtn);
		});
	});
	
	function toggle_state() {
		if($('.edit-sub').html() == '<i class="fa fa-sort-desc"></i>' || !($('.edit-sub').hasClass('activeState'))) {
			$('.edit-sub').fadeOut(function() {
				$('.edit-sub').html('<i class="fa fa-sort-asc"></i>');
				$('.edit-sub').addClass('activeState');
				$('.edit-sub').css('top', '-1px');
			}).fadeIn();
		} else {
			$('.edit-sub').fadeOut(function() {
				$('.edit-sub').html('<i class="fa fa-sort-desc"></i>');
				$('.edit-sub').removeClass('activeState');
				$('.edit-sub').css('top', '-10px');
			}).fadeIn();
		}
		
		$('.subscription_menu').animate({
			height: "toggle",
			opacity: "toggle"
		});
	}
	
	function check_for_next() {
		if($('.option.selected a').attr("href") == 'trial') {
			console.log($('.option.selected a').attr("href"));
			gtn = false;
			update_button('signup');
		} else {
			gtn = true;
			update_button('next');
		}
	}
	
	function update_button(action) {
		if(action == 'signup') {
			// Signup Button
			$('button[type="submit"]').html('Sign Up');
			gtn = false;
		} else if(action == 'next') {
			// Next Button
			$('button[type="submit"]').html('Next');
			gtn = true;
		}
	}
	
	function disable_buttons() {
		$('#checkbox_monthly').attr("disabled", true);
		$('#checkbox_yearly').attr("disabled", true);
		
		if($('#checkbox_monthly').is(':checked')) {
			$('#checkbox_monthly').prop("checked", false);
		}
		
		if($('#checkbox_yearly').is(':checked')) {
			$('#checkbox_yearly').prop("checked", false);
		}
	}
	
	function enable_buttons() {
		$('#checkbox_monthly').attr("disabled", false);
		$('#checkbox_yearly').attr("disabled", false);
		
		if($('#checkbox_monthly').is(':checked') || $('#checkbox_yearly').is(':checked')) {
			// Do nothing...
		} else {
			// No buttons are checked... Check one.
			$('#checkbox_monthly').prop("checked", true);
		}
	}
	
	function disable_month_only() {
		if($('#checkbox_yearly').is(':disabled')) {
			// Enable the Yearly Checkbox
			$('#checkbox_yearly').attr("disabled", false);
		}
		
		if($('#checkbox_monthly').is(':disabled')) {
			// Do Nothing
		} else {
			// Disable the monthly checkbox
			$('#checkbox_monthly').attr("disabled", true);
		}
		
		if($('#checkbox_monthly').is(':checked')) {
			$('#checkbox_monthly').prop("checked", false);
		}
		
		if($('#checkbox_yearly').is(':checked')) {
			// Do Nothing
		} else {
			$('#checkbox_yearly').prop("checked", true);
		}
	}
	
	function update_price() {
		var amount_due = $('.amount-due');
		
		if($('.current-subscription').html() == '90 Day Free Trial') {
			// Free!
			var price = "0.00";
			amount_due.html(price);
		} else if($('.current-subscription').html() == 'Platinum Formula') {
			// Only get yearly price.
			get_price({name: 'platinum', cycle: 'yearly'}, function(pr) {
				amount_due.html(pr);
			});
		} else {
			var cycle = $("input:radio[name ='subscription_checkbox']:checked").val();
			console.log(cycle);
			// Get price of selected term.
			if($('.current-subscription').html() == 'Premium Formula') {
				get_price({name: 'premium', cycle: cycle}, function(pr) {
					amount_due.html(pr);
				});				
			} else if($('.current-subscription').html() == 'Pro Formula') {
				get_price({name: 'pro', cycle: cycle}, function(pr) {
					amount_due.html(pr);
				});
			}
		}
		
		check_for_next();
	}
	
	function get_price(parameters, callback) {
		$.get('/price', parameters, function(data) {
			callback(data.price);
		});
	}
})(jQuery);