// 代码整理：网页设计之家

$(function(){  
		  
		   var card = $(".card");
		   //Card——————————————————————————————————————————
		  $(".card").click(function(){		
			$(".search").hide();	   						 
			$(this).fadeTo(1300,0);
			$(".content").fadeOut(900,skew);
			
			function skew(){
			$(".content2").removeClass("skew");
			}
			
			var list = $(this).siblings(".card");
			var i = 0;
			(function cover() {
				list.eq(i++).addClass("cover").fadeTo(90,0,cover);
			})();
			
			var title = $(this).find("img").attr("alt");
			$(".content2 span").html(title).fadeTo(900,1);
		  })
		   
		   
		   //Back——————————————————————————————————————————
		  $(".middle").click(function(){
		   $(".search").hide();
		   $(".content2").addClass("skew");
		   $(".content").fadeIn(900);
		   
			var j = 0;
			(function cover2() {
				card.eq(j++).removeClass("cover").fadeTo(90,1,cover2);
			})();
			
			$(".content2 span").fadeTo(100,0);
		  })
		   
		  //MultiTasking——————————————————————————————————————————
		   $(".right").click(function(){
			$(".search").slideToggle(300);	   
		   })
		   
		    $(".left").click(function(){
			$(".search").hide();	   						 
			$(".content").fadeOut(900,skew);
			
			function skew(){
			$(".content2").removeClass("skew");
			}
			
			var list = $(".card");
			var i = 0;
			(function cover() {
				list.eq(i++).addClass("cover").fadeTo(90,0,cover);
			})();
			
			var text = "multiTasking";
			$(".content2 span").html(text).fadeTo(900,1);
		   })
		   
		 
})
           startTime(); 
		  //时钟——————————————————————————————————————————
		  function startTime()
		  {
		  var today=new Date()
		  var h=today.getHours()
		  var m=today.getMinutes()
		  var s=today.getSeconds()
		  // add a zero in front of numbers<10
		  m=checkTime(m)
		  s=checkTime(s)
		  
		  document.getElementById("time").innerHTML=h+":"+m
		  t=setTimeout('startTime()',500)
		  }
		  
		  function checkTime(i)
		  {
		  if (i<10) 
			{i="0" + i}
			return i
		  }