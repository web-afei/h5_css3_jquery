$(function(){

// 设置html内容	
var clock = [
	'<ul id="clock">',
	'<li id="date"></li>',
	'<li id="seconds"></li>',
	'<li id="hours"></li>',
	'<li id="minutes"></li>',
	'</ul>'].join('');			
		
//将html内容引入到页面中
$(clock).fadeIn().appendTo('body');

(function Clock(){
	//获取系统当前时间
	var date = new Date().getDate(),
         hours = new Date().getHours(),
         minutes = new Date().getMinutes();
		 seconds = new Date().getSeconds(),
              
	// 将获取的日期赋值给对应的html
	$("#date").html(date);

             
	var hrotate = hours * 30 + (minutes / 2);
    $("#hours").css({
		'transform'	:  'rotate('+ hrotate +'deg)',
		'-moz-transform'	:'rotate('+ hrotate +'deg)',
		'-webkit-transform'	:'rotate('+ hrotate +'deg)'
	});
				  
	var mrotate = minutes * 6;
                        
    $("#minutes").css({
		'transform'	:  'rotate('+ mrotate +'deg)',
		'-moz-transform'	:'rotate('+ mrotate +'deg)',
		'-webkit-transform'	:'rotate('+ mrotate +'deg)'
	});  
				  
    var srotate = seconds * 6;
              
    $("#seconds").css({
	    'transform'	:  'rotate('+ srotate +'deg)',
		'-moz-transform'	:'rotate('+ srotate +'deg)',
		'-webkit-transform'	:'rotate('+ srotate +'deg)'
	});
             
setTimeout(Clock,1000);
})();


// 代码整理：网页设计之家 www.mysite.com

});