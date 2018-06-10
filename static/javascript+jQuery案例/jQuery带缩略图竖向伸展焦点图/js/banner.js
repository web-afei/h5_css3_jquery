//banner
(function ($) {
    jQuery.fn.bannerScroll = function (options) {
        var o = $.extend({}, $.fn.bannerScrollInit, options);
        this.each(function () {
            var $sorllList = $(".index_banner_scroll");
            var index = o.index;
            var $sorllDiv = $sorllList.find("div");
            var numsize = $sorllDiv.length;
			var $scrollB = $(".banner_btn");
            var $sorllBtnList = $(".banner_list");
			var $sorllBtn = $(".banner_span");
 
            var $sorllBtnSpan1 = $sorllBtnList.find("span");
		    var $sorllBtnSpan = $sorllBtn.find("a");
			$sorllBtnSpan1.eq(0).addClass("current");
            $sorllBtnSpan.eq(0).addClass("current");
            $sorllDiv.eq(0).show().siblings().hide();
			
			$scrollB.hover(function(){
				$sorllBtnList.hide();
				$sorllBtn.show();
			},function(){
				$sorllBtnList.show();
				$sorllBtn.hide();		
			})

            function autoplay() {
                index++;
                if (index >= numsize) {
                    index = 0;
                };

                $sorllBtnSpan.eq(index).addClass("current").siblings().removeClass("current");
				$sorllBtnSpan1.eq(index).addClass("current").siblings().removeClass("current");
                $sorllDiv.eq(index).fadeIn("700").siblings().fadeOut("700");
            };
			
            if (o.auto) {
                var MyMal = setInterval(autoplay, o.speed);
                $sorllBtnSpan.bind("click",function() {
                    MyMal = setInterval(autoplay, o.speed);
                });
            }

            $sorllBtnSpan.bind("click",function () {
                index = $(this).index() - 1;
                clearInterval(MyMal);
                autoplay();
            });

        })
    }
    $.fn.bannerScrollInit = {
        speed: 4000,
        auto: true,
        index: 0
    }
})(jQuery)

$(document).ready(function () {
        $(".index_banner_cont").bannerScroll();
 });
$(document).ready(function() {
	$(".btn4").css("borderRight","0");
	function wheel(event){
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
    delta = event.wheelDelta/120;
    if (window.opera) delta = -delta;
    } else if (event.detail) {
    delta = -event.detail/3;
    }
    if (delta)
    handle(delta);
    }
    if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;
	//游览器判断
	if(!$.browser.msie){ 
		$(".index-btn").addClass("browser");
	}
	_win();
	$(window).resize(function(){
		_win();
	});
	function _win(){
		if($(window).width()>1024){
			$(".index-banner").width($(window).width());
		}else{
			$(".index-banner").width(1180);
		}
	}
	
	
	//banner下面滑出菜单
	var $M = $(".index_menu_item");
	var bro = $.browser;
	$M.css({"height":"0","paddingTop":"0","overflow":"hidden"});
		$(".index-btn span").mouseover(function(){
			if(bro.msie && bro.version<7) {
				var index = $(this).index() - 12;	
				$(this).parent().find("span").eq(index).addClass("cur1").siblings().removeClass("cur");
			}else{
				var index = $(this).index();
				//alert(index)
				$(this).addClass("cur").siblings().removeClass("cur");
			}
			
			$M.eq(index).stop().animate({"height":"240px","paddingTop":"20px","overflow":"visible","top":"-260px"});		
		}).mouseout(function(){
			//var index = $(this).index() - 4;
			if(bro.msie && bro.version<7) {
				var index = $(this).index() - 12;	
				$(this).removeClass("cur");
			}else{
				var index = $(this).index();
				$(this).removeClass("cur");
			}
			$M.eq(index).stop().animate({"height":"0","paddingTop":"0","overflow":"hidden","top":"0"})	  	
		});
		
		$(".index_menu_item").mouseover(function(){
			var index = $(this).index();
			
				$(".index-btn span").eq(index).addClass("cur").siblings().removeClass("cur");
				$M.eq(index).stop().animate({"height":"240px","paddingTop":"20px","overflow":"visible","top":"-260px"});		
		}).mouseout(function(){
			var index = $(this).index();
			$(".index-btn span").eq(index).removeClass("cur");
			$M.eq(index).stop().animate({"height":"0","paddingTop":"0","overflow":"hidden","top":"0"})	  	
		});	
}); 