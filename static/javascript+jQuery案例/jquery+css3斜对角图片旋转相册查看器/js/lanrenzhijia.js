/* ��������  www.mysite.com  ת����ע������ */
$(document).ready(function(){
	
	$('.portfolio li').click(function() {
		
		var new_feature = $(this);
		
		if (!new_feature.hasClass('feature')){
		
			$('li.feature').removeClass('feature');
		
			setTimeout(function(){

				new_feature.addClass('feature');

			}, 500);
		
		}
		
	});
	
});
/* ��������  www.mysite.com  ת����ע������ */