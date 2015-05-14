(function($) {
	// Testing Environment Only - Change key before launch.
	Stripe.setPublishableKey('pk_test_hh5vsZ7wNnMi80XJgzHVanEm');
	
	$(document).ready(function() {
		/* REGISTER BUTTON CLICK FUNCTIONALITY */
		$('button[type="submit"]').click(function(e) {
			e.preventDefault();
			
			var exp = $("#exp-date").val();
			var exp = splitPath(exp);
			console.log(exp);
			
			$('#exp-month').val(exp[0]);
			$('#exp-year').val(exp[1]);
			
			var customer_name = $('#name').val();
			
			Stripe.card.createToken({
				name: customer_name,
				number: $('#number').val(),
				cvc: $('#cvc').val(),
				exp_month: $('#exp-month').val(),
				exp_year: $('#exp-year').val(),
				plan: getPlan($("#selected_plan").val(), $("#subscription_checkbox").val())
			}, stripeResponseHandler);
		});		
	});
	
	/* STRIPE RESPONSE HANDLER */
	function stripeResponseHandler(status, response) {
		var $form = $('#billing-form');
		
		if(response.error) {
			$('.validation .error-message').html(response.error.message);
			$('.validation').slideToggle();
			console.log("Stripe payment was an error!");
			
			if(response.error.code == "invalid_cvc") {
				$('#cvc').addClass("error");
			}
			
			if(response.error.code == "incorrect_number") {
				$('#number').addClass("error");
			}
			
			if(response.error.code == "invalid_expiry_year") {
				$('#exp-date').addClass("error");
			}			
		} else {
			var token = response.id;
			$form.append($('<input type="hidden" name="stripeToken" />').val(token));
			$form.attr("action", "/billing");
			$form.get(0).submit();
		}
	}
	
	/* USED TO GET VALUES FROM EXPIRATION DATE INPUT FIELD */
	function splitPath(str) {
	    var rawParts = str.split("/"), parts = [];
	    for (var i = 0, len = rawParts.length, part; i < len; ++i) {
	        part = "";
	        while (rawParts[i].slice(-1) == "\\") {
	            part += rawParts[i++].slice(0, -1) + "/";
	        }
	        parts.push(part + rawParts[i]);
	    }
	    return parts;
	}
	
	/* RETURNS THE PLAN THAT THE USER IS TRYING TO SUBSCRIBE TO */
	function getPlan(plan, cycle) {
		return plan + "_" + cycle;
	}
})(jQuery);