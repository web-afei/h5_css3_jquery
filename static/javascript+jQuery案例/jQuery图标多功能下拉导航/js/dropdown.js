$(document).ready(function(){
	/* Nomenclature **************/
	var icon=$('.nav li div.icon');
	var text=$('.nav li div.text');
	
	/* Default values ***********/
	$('ul.menu').hide();
	$(text).hide()
	
	/* Mouse over on (.nav li)****/
	$('.nav li').hover(
	function(){
		/* Nomenclature **************/
		var tOpenMenu= $(this).children('ul.menu');
		var tIcon=$(this).children('.icon');
		var tText=$(this).children('.text');
		
		/*Open menu and show icon*/
		$(tOpenMenu).show();
		$(tText).show()
		$(tIcon).hide();
	},
	/* Mouse leave****/
	function(){
		/* Nomenclature **************/
		var tOpenMenu= $(this).children('ul.menu');
		var tIcon=$(this).children('.icon');
		
		/*Close menu and hide icon*/
		$(tOpenMenu).hide();
		$(tIcon).show();
		
	});
	
	/* Mouse over on (.menu li)****/
	$('.menu li').hover(
	function(){
		/* Nomenclature **************/
		var tSubMenu=$(this).children('.menu#sub-menu');
		
		/*Open sub menu*/
		$(tSubMenu).css({
			'left':'100%',
			'top':'-25%'
		})
	});
});