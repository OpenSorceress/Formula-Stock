(function($) {
	var gtn = false;
	
	$(document).ready(function() {
		/* SHOW ERRORS IF ANY EXIST */
		$('.express-error').slideDown();
		
		/* CHECK TO SEE IF PLAN REQUIRES NEXT */
		if($('body#register').length > 0) {
			check_for_next();
		}
		
		/* REMOVE ERRORS ON FOCUS */
		$('input').focus(function() {
			if($(this).hasClass('error')) {
				$(this).removeClass('error');
			}
			
			if($('.validation').is(':visible')) {
				$('.validation').slideToggle();
			}
		});
		/* SUBSCRIPTION DROP DOWN FUNCTIONALITY */
		$('.selected a').click(function(e) {
			e.preventDefault();
		});
		
		/* TOGGLE DROPDOWN */
		$('.subscription').click(function(e) {
			e.preventDefault();
			toggle_state();
		});
		
		/* PLAN DROPDOWN FUNCTIONALITY */ 
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
				update_plan();
				update_price();
				toggle_state();
			}
		});
		
		/* UPDATE PRICE WHEN RADIO VALUE CHANGES */
		$("input:radio[name ='subscription_checkbox']").change(function () {
			update_price();
			update_plan();
		});
	});
	
	/* CHANGE STATE OF DROPDOWN */
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
	
	/* CHANGE STATE OF REGISTER BUTTON */
	function check_for_next() {
		if($('.option.selected a').attr("href") == 'trial') {
			gtn = false;
			update_button('signup');
		} else {
			gtn = true;
			update_button('next');
		}
	}
	
	/* UPDATE THE REGISTER BUTTON */
	function update_button(action) {
		if(action == 'signup') {
			// Signup Button
			$('button[type="submit"]').html('Sign Up');
			gtn = false;
		} else if(action == 'next') {
			// Next Button
			$('button[type="submit"]').html('Continue to Billing');
			gtn = true;
		}
	}
	
	/* DISABLE ALL RADIO BUTTONS */
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
	
	/* ENABLE ALL RADIO BUTTONS */
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
	
	/* DISABLE MONTHLY RADIO BUTTON */
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
	
	/* UPDATE TOTAL PRICE VALUE */
	function update_price() {
		var amount_due = $('.amount-due');
		
		if($('.current-subscription').html() == '90 Day Free Trial') {
			// Free!
			var price = "0.00";
			amount_due.html(price);
		} else if($('.current-subscription').html().trim() == 'Platinum Formula') {
			// Only get yearly price.
			get_price({name: 'platinum', cycle: 'yearly'}, function(pr) {
				amount_due.html(pr);
			});
		} else {
			var cycle = $("input:radio[name ='subscription_checkbox']:checked").val();
			// Get price of selected term.
			if($('.current-subscription').html().trim() == 'Premium Formula') {
				get_price({name: 'premium', cycle: cycle}, function(pr) {
					amount_due.html(pr);
				});				
			} else if($('.current-subscription').html().trim() == 'Pro Formula') {
				get_price({name: 'pro', cycle: cycle}, function(pr) {
					amount_due.html(pr);
				});
			}
		}
		
		check_for_next();
	}
	
	/* GET CURRENT PRICE OF PLAN FROM DATABASE */
	function get_price(parameters, callback) {
		$.get('/price', parameters, function(data) {
			callback(data.price);
		});
	}
	
	function update_plan() {
		$('#selected_plan').val($('.selected a').attr("href") + "_" + $("input:radio[name ='subscription_checkbox']:checked").val());
	}
})(jQuery);