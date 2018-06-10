//代码整理：小白www.mysite.com
(function($) {		
	jQuery.fn.fixed = function(options) {
		var defaults = {
			x:0,
			y:0
		};
		var o = jQuery.extend(defaults, options);
		var isIe6 = !window.XMLHttpRequest;
		var html= $('html');
		if (isIe6 && html.css('backgroundAttachment') !== 'fixed') {
			html.css('backgroundAttachment','fixed').css('backgroundImage','url(about:blank)');
		};
		return this.each(function() {
			var domThis=$(this)[0];
			var objThis=$(this);
			if(isIe6){
				objThis.css('position' , 'absolute');
				domThis.style.setExpression('left', 'eval((document.documentElement).scrollLeft + ' + o.x + ') + "px"');
				domThis.style.setExpression('top', 'eval((document.documentElement).scrollTop + ' + o.y + ') + "px"');
			} else {
				objThis.css('position' , 'fixed').css('top',o.y).css('left',o.x);
			}
		});
	};
})(jQuery)

$(function(){
	var myCode = '<div id="slide"><dl><dd><a href="#" class="count">账户</a></dd><dd><a href="#" class="search">查询</a></dd><dd><a href="#" class="zc">资产</a></dd><dd><a href="#" class="tousu">投诉</a></dd><dd><a href="#" class="my">中心</a></dd><dd><a href="#" class="charge">充值</a></dd><dd><a href="#" class="message">留言</a></dd><dt><a href="javascript:;" class="close"></a></dt></dl></div>';
		$(myCode).hide().appendTo("body").fixed({x:0,y:0}).fadeIn(500);
		$("#slide dt").click(function(){
			var _left = $("#slide").offset().left;
			if(_left>=0){
				$("#slide").animate({left:-44},300,'swing',function(){
					$("#slide dt a.close").hide().width('68px').fadeIn(500);
				});
			} else {
				$("#slide dt a.close").width('44px');
				$("#slide").animate({left:0},300,'swing',function(){
				});
			}
		});	   
});

//代码整理：小白www.mysite.com