$(document).ready(function(){
	//左侧菜单
	 $("#left_nav li.li_1").hover(function(){
		$(this).addClass("li_1_bor").find(".lv_2:first").stop(true,true).show(300);
	 },function(){$(this).removeClass("li_1_bor").find(".lv_2:first").stop(true,true).hide();});
 
	 //科室选项卡
	  $('.tab_list li').mouseover(function(){
			var index = $('.tab_list li').index(this);
			this.kkt = setTimeout(function(){
				$('.tab_list li').eq(index).find('p').addClass('on').parent('li').siblings().find('p').removeClass('on');
				$('.tab_zoom_box .tab_zoom').eq(index).show().siblings().hide()},500);
		}).mouseout(function(){clearTimeout(this.kkt)});
	  //初始
		var listLILen = $('.tab_list li').length-1;
		var keshihover=Math.random();//获取随机数0~1
		keshihover=Math.round(keshihover*listLILen);//获取随机科室的序号
		$('.tab_list li').eq(keshihover).find('p').addClass('on');
		$('.tab_zoom_box .tab_zoom').eq(keshihover).css("display","block");
	//导航
	$(".sy1_ul .sy1_li").hover(
		function(){
			var index = $('.sy1_ul .sy1_li').index(this);
			$(this).addClass("sy1_li_bg").find(".sy2_ul").stop(true,true).fadeIn(350);
			//select隐藏（i6下select始终在最上层的问题）
			$(".searchselect").hide();
		},
		function(){
			var index = $('.sy1_ul .sy1_li').index(this);
			$(this).removeClass("sy1_li_bg").find(".sy2_ul").hide();
			//select 恢复显示
			$(".searchselect").show();
		}
	)
	 $(".sy2_li").hover(
			function(){
				var index=$(this).children("ul").length;
				if(index>0){$(this).addClass("sy2_li_h")}
				$(this).find("ul:first").show()	},
			function(){$(this).removeClass("sy2_li_h").find("ul:first").hide()}
		);
	//导航下拉位置样式控制
	$(".sy2_ul .sy2_li").addClass("bod_1");
	
	//20130517 wsq 添加改版后的科室切换 js
	 $('.tab_title1 li').mouseover(function(){
			var index = $('.tab_title1 li').index(this);
			$(this).css("color","#004F9F");
			this.kkt = setTimeout(function(){
				$('.tab_title1 li').eq(index).addClass('sy_keshihover').siblings("li").removeClass('sy_keshihover');
				$('.tab_zoom_box .ks_tab_con').eq(index).show().siblings().hide()},500);
		}).mouseout(function(){$(this).removeAttr("style");clearTimeout(this.kkt)});
	$(".ul_department .li_department").hover(
		function(){$(this).css("z-index",10).css("position","relative").find(".detail_departmentBox").show()},
		function(){$(this).css("z-index",5).css("position","").find(".detail_departmentBox").hide()}
	)
	//首页特色技术tab切换
	$(".tsjs_contentList li").mouseover(function(){
		var thisNumb = $(".tsjs_contentList li").index(this);
		var thisclassName="hover01";
		if(thisNumb==0){
			thisclassName = "hover00";
		}
		$(this).addClass(thisclassName).siblings("li").removeClass("hover01").removeClass("hover00");
		$(".tsjs_content ul").eq(thisNumb).show().siblings("ul").hide();
	});
});