// 代码整理：网页设计之家

$(function(){   
		  
		  var interval;
		   $(".container img").click(function cover(){
					$(this).addClass("zoom").fadeOut(700,append);		
					function append(){
					$(this).removeClass("zoom").appendTo(".container").show();
					var name = $(".container").children("img").first().attr("alt");
					 $(".name p").text("No "+name);
					}	
			  
			})
		   
		   function auto(){
			        var play = $(".container").children("img").first();
					play.addClass("zoom").fadeOut(700,append);		
					function append(){
					$(this).removeClass("zoom").appendTo(".container").show();
					var name = $(this).parent().children("img").first().attr("alt");
					 $(".name p").text("No "+name);
					}
					interval = setTimeout(auto,5000);
		   }
		   
		   $(".container img").hover(function(){
					stopPlay();
			},function(){
				    interval = setTimeout(auto,5000);
			})
		   
		   function stopPlay()
				  {
				  clearTimeout(interval)
				  }
		   auto();
					
})
