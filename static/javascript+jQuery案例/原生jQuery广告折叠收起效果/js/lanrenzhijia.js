// 代码版权所有：小白 www.mysite.com  转载请注明出处
$(function(){

	//将内容插入到body开始处，页面加载完毕后自动展开
	$('body').prepend("<div class='lanrenzhijia'><a href='http://www.mysite.com/' target='_blank' class='link'></a></div>");
	$('.lanrenzhijia').slideDown(1500,function(){
		$('.lanrenzhijia').append("<a href='javascript:;' class='up'></a>");									  
	});	
	//设置延时函数
	function adsUp(){
		$('.lanrenzhijia').animate({
			height:'100px'						 
		},1000,function(){
			$(this).find('.up').addClass('down').removeClass('up');	
		});	
	}
	//五秒钟后自动收起
	var t = setTimeout(adsUp,5000);
	//点击收起
	$('.lanrenzhijia a.up').live('click',function(){
		clearTimeout(t);
		$('.lanrenzhijia').animate({
			height:'100px'						 
		},function(){
			$(this).find('.up').addClass('down').removeClass('up');	
		});	 
	});	
	
	//点击下拉
	$('.lanrenzhijia a.down').live('click',function(){
		$(this).css({
			opacity:'0'	,
			filter:'alpha(opacity=0)'
		});
		$('.lanrenzhijia').animate({
			height:'250px'
		},function(){
			$(this).find('.down').addClass('up').removeClass('down').css({opacity:'1',filter:'alpha(opacity=100)'});
		});	 
	});
	
	

});