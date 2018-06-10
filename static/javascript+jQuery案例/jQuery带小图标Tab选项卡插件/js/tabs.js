$(document).ready(function(){
	var label= $('.label');
	var content= $('.content');
	
	$(content).hide();
	$('.content:first').show();
	$('.label a').addClass('default');
	$('.label:first a').addClass('clicked');
	
	$(label).on("click",
	function(){
		var tLabel = $(this);
		var tLabelColor = $(this).find('a');
		var tContent = $(this).next('.content');
		
		$(content).hide();
		$(tContent).show();
			
		$('.label a').removeClass('clicked');
		$(tLabelColor).addClass('clicked');
	});
	
	$(label).hover(
	function(){
		var tLabelColor = $(this).find('a');
		$(tLabelColor).addClass('hover');
	},
	function(){
		$('.label a').removeClass('hover');
		
	});	
});