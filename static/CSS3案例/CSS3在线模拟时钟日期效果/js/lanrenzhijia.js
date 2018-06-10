// 代码整理：网页设计之家

        $(function() {
     
              setInterval( function() {
              var seconds = new Date().getSeconds();
              var sdegree = seconds * 6;
              var srotate = "rotate(" + sdegree + "deg)";
              
              $("#sec").css({"-ms-transform" : srotate, "-webkit-transform" : srotate,
							  "-moz-transform" : srotate, "-o-transform" : srotate
							});
                  
              }, 1000 );
               
         
              setInterval( function() {
              var hours = new Date().getHours();
              var mins = new Date().getMinutes();
              var hdegree = hours * 30 + (mins / 2);
              var hrotate = "rotate(" + hdegree + "deg)";
              
              $("#hour").css({"-ms-transform" : hrotate, "-webkit-transform" : hrotate,
							   "-msmoztransform" : hrotate, "-o-transform" : hrotate
							 });
                  
              }, 1000 );
        
        
              setInterval( function() {
              var mins = new Date().getMinutes();
              var mdegree = mins * 6;
              var mrotate = "rotate(" + mdegree + "deg)";
              
              $("#min").css({"-ms-transform" : mrotate, "-webkit-transform" : mrotate,
							 "-moz-transform" : mrotate, "-o-transform" : mrotate});
                  
              }, 1000 );
			  
			  
			  /*
			  function rotate1() {
				  
				      var deg = $("#fan").attr("title");
					  var rotate = "rotate(" + deg + "deg)";
					  $("#fan").css({"-ms-transform" : rotate, "-webkit-transform" : rotate,
									 "-moz-transform" : rotate, "-o-transform" : rotate});
					  deg = parseInt(deg)+10;
					  $("#fan").attr("title",deg);
					  
			   setTimeout(rotate2,300);
              }
			  
			  function rotate2() {
				  
				      var deg = $("#fan").attr("title");
					  var rotate = "rotate(" + deg + "deg)";
					  $("#fan").css({"-ms-transform" : rotate, "-webkit-transform" : rotate,
									 "-moz-transform" : rotate, "-o-transform" : rotate});
					  deg = parseInt(deg)+10;
					  $("#fan").attr("title",deg);
					  
			   setTimeout(rotate1,300);
              }
			  
			  rotate1();			 
            */
        }); 
    