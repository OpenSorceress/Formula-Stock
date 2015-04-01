(function($){
	
	$('.alert').slideDown();
	
	
	$('input').focus(function() {
		$('.alert').slideUp();
		if($('label[for="' + this.id + '"]').hasClass('labelError')) {
			$('label[for="' + this.id + '"]').removeClass('labelError').addClass('labelFocus');
			$(this).removeClass('inputError');
		} else {
			$('label[for="' + this.id + '"]').addClass('labelFocus');
		}
		
		console.log('Label should be blue!');
	}).blur(function() {
		$('label').removeClass('labelFocus');
	});
	
	$('#loginButton').click(function(e) {
		console.log($('#username')[0].value);
		
		if($('#username')[0].value && $('#password')[0].value) {
			console.log('The submit button was clicked.');
		} else {
			e.preventDefault();
			
			if(!$('#username')[0].value) {
				console.log($('#username')[0].value);
				$('label[for="username"]').addClass('labelError');
				$('#username').addClass('inputError');
				$('#username').effect('shake', {distance: 5, times: 2});
				$('label[for="username"]').effect('shake', {distance: 5, times: 2});
			}
			
			if(!$('#password')[0].value) {
				console.log($('#password')[0].value);
				$('label[for="password"]').addClass('labelError');
				$('#password').addClass('inputError');
				$('#password').effect('shake', {distance: 5, times: 2});
				$('label[for="password"]').effect('shake', {distance: 5, times: 2});
			}
		}
	});	
})(jQuery);