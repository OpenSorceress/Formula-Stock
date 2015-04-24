(function($) {

var _signup_firstname			= undefined;
var _signup_lastname			= undefined;
var _signup_email				= undefined;
var _signup_password			= undefined;
var _signup_password_confirm 	= undefined;
var _signup_plan				= undefined;
var _signup_cycle				= undefined;
var _signup_bot_check			= undefined;

	$('#signup button[type="submit"]').click(function(e) {
		e.preventDefault();
		
		_signup_firstname = $("#firstname").val();
		_signup_lastname = $("#lastname").val();
		_signup_email = $("#email").val();
		_signup_password = $("#password").val();
		_signup_password_confirm = $("#confirm_password").val();
		_signup_plan = $("#selected_plan").val();
		_signup_cycle = $("input:radio[name ='subscription_checkbox']:checked").val();
		_signup_bot_check = $("#bot-check").val();
		
		console.log("VALIDATING FORM...");
		
		if(_signup_bot_check) {
			// Return error: "Bot detected!"
			$('.error-message').html("Our system detected a bot! Please refresh the page and try again. If the error persits, contact support.");
			$('.validation').slideToggle();
		} else {
			if(all_filled()) {
				if(valid_email()) {
					if(passwords_match()) {
						if(is_trial()) {
							register();
						} else {
							if(has_cycle()) {
								// Go to next page.
								register();
								// continue_to_billing();
							} else {
								// Return error: "Please select a cycle."
								$('.validation').toggleSlide();
								$('.error-message').html("Please select a billing cycle");
							}
						}
					} else {
						// Return error: "Passwords do not match."
						$('.validation').slideToggle();
						$('.error-message').html("Passwords do not match.");
						$("#password").addClass('error');
						$("#confirm_password").addClass('error');
					}
				} else {
					// Return error: "Email is invalid."
					$('.validation').slideToggle();
					$('.error-message').html("Email address is invalid.");
					$("#email").addClass('error');
				}
			} else {
				// Return error: "Please make sure all fields are input.
				$('.validation').slideToggle();
				$('.error-message').html("Please check to make sure all inputs are filled in.");
			}	
		}
	});
	
	/* Registers User */
	function register() {
		$("#signup").attr("action", "/register");
		$("#total_price").val($('.amount-due').html());
		$("#signup").submit();
	}
	
	/* Takes user to billing */
	function continue_to_billing() {
		$("#signup").attr("action", "/billing");
		$("#total_price").val($('.amount-due').html());
		$("#signup").submit();
	}
	
	/* Checks to see if plan has a cycle */
	function has_cycle() {
		if(is_filled(_signup_cycle)) {
			return true;
		} else {
			return false;
		}
	}
	
	/* Check to see if plan is a trial */
	function is_trial() {
		if(_signup_plan === 'trial') {
			return true;
		} else {
			return false;
		}
	}
	
	/* Check to see if passwords match */
	function passwords_match() {
		if(_signup_password === _signup_password_confirm) {
			return true;
		} else {
			return false;
		}
	}
	
	/* REGEX validates eail */
	function valid_email() {
		if(_signup_email.match('^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$')) {
			return true;
		} else {
			return false;
		}
	}
	
	/* Checks to see if all elements are filled. */
	function all_filled() {
		if(
		is_filled(_signup_firstname) && 
		is_filled(_signup_lastname) && 
		is_filled(_signup_email) && 
		is_filled(_signup_password) && 
		is_filled(_signup_password_confirm) &&
		is_filled(_signup_plan)) {
			return true;
		} else {
			return false;
		}
	}
	
	/* Checks to see if individual element is filled. */
	function is_filled(element) {
		if(element != '' && element != undefined && element != null) {
			return true;
		} else {
			return false;
		}
	}
})(jQuery);