(function($) {
	$(document).ready(function() {
		
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
				} else if($(this).attr('href') == 'pro') {
					$('span.current-subscription').html('Pro Formula');
				} else if($(this).attr('href') == 'premium') {
					$('span.current-subscription').html('Premium Formula');
				} else if($(this).attr('href') == 'platinum') {
					$('span.current-subscription').html('Platinum Formula');
				}
						
				toggle_state();
			}
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
	
	function update_price() {
		
	}
})(jQuery);