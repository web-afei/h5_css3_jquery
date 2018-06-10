// 代码整理：网页设计之家


$(function(){
			 
		   var siri = 0;
		   $(".icon").click(function(){
				 $("#siri").removeClass("slice");
		   })
		   
		  
		   $("#icon_reminder").click(function(){
				if(siri==1){}
				else{
			   siri = 1;
			   $(".ask span").text("I wonna set a reminder.");
			   $(".module,.module2").not("#reminder").addClass("rotate");
			   $(".answer").slideUp(200);
				}
		   })
		   
		   $("#icon_clock").click(function(){	
				if(siri==2){}
				else{							   
			   siri = 2;
			   $(".ask span").text("What time is it now?");  
			   $(".module,.module2").not("#clock").addClass("rotate");
			   $(".answer").slideUp(200);
				}
		   })
		   
		    $("#icon_alarm").click(function(){	
				if(siri==3){}
				else{								
			   siri = 3;
			   $(".ask span").text("Wake me up at 7:00!"); 
			   $(".module,.module2").not("#alarm").addClass("rotate");
			   $(".answer").slideUp(200);
				}
		   })
			
			 $("#icon_contact").click(function(){	
				if(siri==4){}
				else{								
			   siri = 4;
			   $(".ask span").text("Find Sunny."); 
			   $(".module,.module2").not("#contact").addClass("rotate");
			   $(".answer").slideUp(200);
				}
		   })
			 
			 $("#icon_mail").click(function(){	
				if(siri==5){}
				else{								
			   siri = 5;
			   $(".ask span").text("Send a mail to Sunny."); 
			   $(".module,.module2").not("#mail").addClass("rotate");
			   $(".answer").slideUp(200);
				}
				
		   })
			 
			 $("#icon_cut").click(function(){	
				if(siri==6){}
				else{								
			   siri = 6;
			   $(".ask span").text("Find me coffee house nearby."); 
			   $(".module,.module2").not("#cut").addClass("rotate");
			   $(".answer").slideUp(200);
				}
				
		   })
			 
			 $("#icon_hole").click(function(){	
				if(siri==7){}
				else{								
			   siri = 7;
			   $(".ask span").text("Tell me the reslut of 1+1."); 
			   $(".module,.module2").not("#hole").addClass("rotate");
			   $(".answer").slideUp(200);
				}
				
		   })
		   
			 $("#icon_blue").click(function(){	
				if(siri==8){}
				else{								
			   siri = 8;
			   $(".ask span").text("Will it rain this weekend?"); 
			   $(".module,.module2").not("#blue").addClass("rotate");
			   $(".answer").slideUp(200);
				}
				
		   })		   
		   //Main Function——————————————————————————————————————————   
		   $("#siri").click(function(){	
				
				 switch(siri)
						   {
						   case 1: reminder();break;
						   case 2: timer(); break;
						   case 3: alarm(); break;
						   case 4: contact(); break;
						   case 5: mail(); break;
						   case 6: cut(); break;
						   case 7: hole(); break;
						   case 8: blue(); break;
						   default:
						   }
							
							
                  function reminder(){
					$(".answer span").text("OK! I've set your reminder!");
					$(".answer").slideDown(300);  
					$("#reminder").removeClass("rotate");
					
				  }
				  
				  function timer(){
					$(".answer span").text("The time is as following...");
				    $(".answer").slideDown(300);  
					$("#timer").removeClass("rotate");
				  }
				  
				  function alarm(){	
				    $(".answer span").text("OK! I've set your alarm!");
				    $(".answer").slideDown(300);  
					$("#alarm").removeClass("rotate");
				  }
				  
				   function contact(){	
				    $(".answer span").text("Here's the contact!");
				    $(".answer").slideDown(300);  
					$("#contact").removeClass("rotate");
					$("#siri").addClass("slice");
				  }
				  
				   function mail(){	
				    $(".answer span").text("Here's your mail!");
				    $(".answer").slideDown(300);  
					$("#mail").removeClass("rotate");
				  }
				  
				   function cut(){	
				    $(".answer span").text("Here's your result!");
				    $(".answer").slideDown(300);  
					$("#cut").removeClass("rotate");
				  }
				  
				  function hole(){	
				    $(".answer span").text("The answer is as following!");
				    $(".answer").slideDown(300);  
					$("#hole").removeClass("rotate");
				  }
				  
				  function blue(){	
				    $(".answer span").text("No,it's sunny!");
				    $(".answer").slideDown(300);  
					$("#blue").removeClass("rotate");
					$("#siri").addClass("slice");
				  }				  
		   })
		   
		   
		   $(".button").click(function(){	
					 siri = 1;			   
		            $(".module,.buttonSet").addClass("rotate").fadeOut(300);
		   })
		   //Time——————————————————————————————————————————   
		   
		      setInterval( function() {
              var hours = new Date().getHours();
              var mins = new Date().getMinutes();
			  hours=checkTime(hours);
			  mins=checkTime(mins);
		 

              var hdegree = hours * 30 + (mins / 2);
              var hrotate = "rotate(" + hdegree + "deg)";
              $(".time").text(hours+":"+mins);
              $("#hour").css({"-ms-transform" : hrotate, "-webkit-transform" : hrotate,
							   "-moz-transform" : hrotate, "-o-transform" : hrotate
							 });
                  
              }, 1000 );
        
        
              setInterval( function() {
              var mins = new Date().getMinutes();
              var mdegree = mins * 6;
              var mrotate = "rotate(" + mdegree + "deg)";
              
              $("#min").css({"-ms-transform" : mrotate, "-webkit-transform" : mrotate,
							 "-moz-transform" : mrotate, "-o-transform" : mrotate});
                  
              }, 1000 );
			  
			  	function checkTime(i){
									  if (i<10) 
										{i="0" + i}
										return i
									  }
		   
		  //Calendar——————————————————————————————————————————   
		   var d=new Date()
		   var weekday=new Array("Sunday", "Monday", "Tuesday", "Wednesday", " Thursday", "Friday", "Saturday");
		   var Months=new Array("Jan", "Feb" ,"Mar", "Apr", " May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov","Dec" );

		   $(".weekday").text(weekday[d.getDay()]);
		   $(".date").text(d.getDate());
		   $(".month").text(Months[d.getMonth()]);
		   $(".year").text("20"+(parseInt(d.getYear())-100));
		   
		   
		   //SlideCheckBox——————————————————————————————————————————   
		   $(".slide").click(function(){      
                        $(this).toggleClass("hover");
						 $(".alarmClock span").toggle();
			})
		   
		   //Marks——————————————————————————————————————————   
		   $(".mark").click(function(){      
                        $(this).toggleClass("marked");
			})
		   
		   //Shadow——————————————————————————————————————————   
		   $(".shadow").each(function(){
				var top = $(this).parents().height()+30-9;
				$(this).css({"top":top});
			})
		   
		   /*$("#siri img").click(function(){
								$(this).attr({"src":"images/siri2.png"});		 
										 })
		   */
})
