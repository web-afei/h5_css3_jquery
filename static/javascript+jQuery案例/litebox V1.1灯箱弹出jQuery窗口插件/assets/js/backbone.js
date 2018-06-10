//	Backbone v1.4, Copyright 2014, Joe Mottershaw, https://github.com/joemottershaw/
//	================================================================================

//	Table of Contents
//	==================================================
//		#Scroll To Top


//	#Scroll To Top
//	==================================================
/* 代码整理：网页设计之家 www.mysite.com */
	$(document).ready(function() {
		$('.scroll-to-top').click(function() {
			$('html, body').animate({ scrollTop: 0 }, 1600, 'easeInOutQuart');
			return false;
		});
	});