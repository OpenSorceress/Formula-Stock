(function($){
	
	$('.alert').slideDown();
	
	$('input').focus(function() {
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