$(function(){
	$('#skin li').click(function(){
		$("#"+this.id).addClass("selected").siblings().removeClass("selected");
		$('#skinCss').attr("href","css/"+(this.id)+".css");
		});
	})
	// The second line`s effect is finding the Dom tree "li".
	// The third line:add selected.
	// The forth line:change css.
	
	// 小白图库 搜集整理 www.lanrentuku.com