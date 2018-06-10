/* 转载请注明出处：网页设计之家 www.mysite.com */
$(document).ready(function() {
	
	//you have to use keyup, because keydown will not catch the currently entered value
	$('input[type=password]').keyup(function() { 
		
		// set password variable
		var pswd = $(this).val();
		
		//validate the length
		if ( pswd.length < 8 ) {
			$('#length').removeClass('valid').addClass('invalid');
		} else {
			$('#length').removeClass('invalid').addClass('valid');
		}/* 转载请注明出处：网页设计之家 www.mysite.com */
		
		//validate letter
		if ( pswd.match(/[A-z]/) ) {
			$('#letter').removeClass('invalid').addClass('valid');
		} else {
			$('#letter').removeClass('valid').addClass('invalid');
		}
		
		//validate uppercase letter
		if ( pswd.match(/[A-Z]/) ) {
			$('#capital').removeClass('invalid').addClass('valid');
		} else {
			$('#capital').removeClass('valid').addClass('invalid');
		}
		/* 转载请注明出处：网页设计之家 www.mysite.com */
		//validate number
		if ( pswd.match(/\d/) ) {
			$('#number').removeClass('invalid').addClass('valid');
		} else {
			$('#number').removeClass('valid').addClass('invalid');
		}
		
	}).focus(function() {
		$('#pswd_info').show();
	}).blur(function() {
		$('#pswd_info').hide();
	});
	
});
/* 转载请注明出处：网页设计之家 www.mysite.com */