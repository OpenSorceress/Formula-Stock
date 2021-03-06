(function($){
	
	$('.alert').slideDown();
	

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
		$('.scroll-link').on('click',function (e) {
			e.preventDefault();
						
		    var target = this.hash;
		    var $target = $(target);
	
		    $('html, body').stop().animate({
		        'scrollTop': $target.offset().top
		    }, 900, 'swing', function () {
		        window.location.hash = target;
		    });
			
/*
			width = 100%;
		    
			if(this.parent() == 'navbar-header') {
				width = 100%;
				left = 0;
			} else if(this.parent().parent().parent().hasClass('home-nav')) {
				width = this.getBoundingClientRect().width;
				left = this.getBoundingClientRect().left;
			}
				
				
				$('.navigation-bar').css({
					'width' : width,
					'left' : left
				});
			
				anchor_rect = this.getBoundingClientRect();
				width = anchor_rect.width;
				left = anchor_rect.left;
				
				$('.navigation-bar').css({
					'width' : width,
					'left' : left
				});
*/
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