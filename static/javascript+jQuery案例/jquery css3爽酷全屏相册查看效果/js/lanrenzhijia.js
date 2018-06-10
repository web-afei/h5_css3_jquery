// 代码整理：网页设计之家 www.mysite.com
$bg=$("#bg");
	$bgimg=$("#bg #bgimg");
	$preloader=$("#preloader");
	$outer_container=$("#outer_container");
	$outer_container_a=$("#outer_container a");
	$toolbar=$("#toolbar");
	$nextimage_tip=$("#nextimage_tip");
	
$(window).load(function() {
	$customScrollBox=$("#customScrollBox");
	$customScrollBox_container=$("#customScrollBox .container");
	$customScrollBox_content=$("#customScrollBox .content");
	$dragger_container=$("#dragger_container");
	$dragger=$("#dragger");
	
	CustomScroller();
	/* 代码整理：网页设计之家 www.mysite.com */
	function CustomScroller(){
		outerMargin=0;
		innerMargin=20;
		$customScrollBox.height($(window).height()-outerMargin);
		$dragger_container.height($(window).height()-innerMargin);
		visibleHeight=$(window).height()-outerMargin;
		if($customScrollBox_container.height()>visibleHeight){ //custom scroll depends on content height
			$dragger_container,$dragger.css("display","block");
			totalContent=$customScrollBox_content.height();
			draggerContainerHeight=$(window).height()-innerMargin;
			animSpeed=400; //animation speed
			easeType="easeOutCirc"; //easing type
			bottomSpace=1.05; //bottom scrolling space
			targY=0;
			draggerHeight=$dragger.height();
			$dragger.draggable({ 
				axis: "y", 
				containment: "parent", 
				drag: function(event, ui) {
					Scroll();
				}, 
				stop: function(event, ui) {
					DraggerOut();
				}
			});

			//scrollbar click
			$dragger_container.click(function(e) {
				var mouseCoord=(e.pageY - $(this).offset().top);
				var targetPos=mouseCoord+$dragger.height();
				if(targetPos<draggerContainerHeight){
					$dragger.css("top",mouseCoord);
					Scroll();
				} else {
					$dragger.css("top",draggerContainerHeight-$dragger.height());
					Scroll();
				}
			});

			//mousewheel
			$(function($) {
				$customScrollBox.bind("mousewheel", function(event, delta) {
					vel = Math.abs(delta*10);
					$dragger.css("top", $dragger.position().top-(delta*vel));
					Scroll();
					if($dragger.position().top<0){
						$dragger.css("top", 0);
						$customScrollBox_container.stop();
						Scroll();
					}
					if($dragger.position().top>draggerContainerHeight-$dragger.height()){
						$dragger.css("top", draggerContainerHeight-$dragger.height());
						$customScrollBox_container.stop();
						Scroll();
					}
					return false;
				});
			});
/* 代码整理：网页设计之家 www.mysite.com */
			function Scroll(){
				var scrollAmount=(totalContent-(visibleHeight/bottomSpace))/(draggerContainerHeight-draggerHeight);
				var draggerY=$dragger.position().top;
				targY=-draggerY*scrollAmount;
				var thePos=$customScrollBox_container.position().top-targY;
				$customScrollBox_container.stop().animate({top: "-="+thePos}, animSpeed, easeType); //with easing
			}

			//dragger hover
			$dragger.mouseup(function(){
				DraggerOut();
			}).mousedown(function(){
				DraggerOver();
			});

			function DraggerOver(){
				$dragger.css("background", "url(images/round_custom_scrollbar_bg_over.png)");
			}

			function DraggerOut(){
				$dragger.css("background", "url(images/round_custom_scrollbar_bg.png)");
			}
		} else { //hide custom scrollbar if content is short
			$dragger,$dragger_container.css("display","none");
		}
	}

	//resize browser window functions
	$(window).resize(function() {
		FullScreenBackground("#bgimg"); //scale bg image
		$dragger.css("top",0); //reset content scroll
		$customScrollBox_container.css("top",0);
		$customScrollBox.unbind("mousewheel");
		CustomScroller();
	});
	
	LargeImageLoad($bgimg);
});
	
	$toolbar.data("imageViewMode","full"); //set default view mode.
	//loading bg image
	$bgimg.load(function() {
		LargeImageLoad($(this));
	});
	
	function LargeImageLoad($this){
		$preloader.fadeOut("fast"); //hide preloader
		$this.removeAttr("width").removeAttr("height").css({ width: "", height: "" }); //lose all previous dimensions in order to rescale new image data
		if($bg.data("newTitle")){
			$this.attr("title",$bg.data("newTitle")); //set new image title attribute
		}
		FullScreenBackground($this); //scale new image
		$bg.data("nextImage",$($outer_container.data("selectedThumb")).next().attr("href")); //get and store next image
		if(typeof itemIndex!="undefined"){
			if(itemIndex==lastItemIndex){ //check if it is the last image
				$bg.data("lastImageReached","Y");
			} else {
				$bg.data("lastImageReached","N");
			}
		} else {
			$bg.data("lastImageReached","N");
		}
		$this.fadeIn("slow"); //fadein background image
		if($bg.data("nextImage") || $bg.data("lastImageReached")=="Y"){ //don't close thumbs pane on 1st load
			SlidePanels("close"); //close the left pane
		}
		NextImageTip();
	}

	//slide in/out left pane
	$outer_container.hover(
		function(){ //mouse over
			SlidePanels("open");
		},
		function(){ //mouse out
			SlidePanels("close");
		}
	);
	/* 代码整理：网页设计之家 www.mysite.com */
	//Clicking on thumbnail changes the background image
	$outer_container_a.click(function(event){
		event.preventDefault();
		var $this=this;
		$bgimg.css("display","none");
		$preloader.fadeIn("fast"); //show preloader
		//style clicked thumbnail
		$outer_container_a.each(function() {
    		$(this).children(".selected").css("display","none");
  		});
		$(this).children(".selected").css("display","block");
		//get and store next image and selected thumb 
		$outer_container.data("selectedThumb",$this); 
		$bg.data("nextImage",$(this).next().attr("href")); 	
		$bg.data("newTitle",$(this).children("img").attr("title")); //get and store new image title attribute
		itemIndex=getIndex($this); //get clicked item index
		lastItemIndex=($outer_container_a.length)-1; //get last item index
		$bgimg.attr("src", "").attr("src", $this); //switch image
	}); 

	//clicking on large image loads the next one
	$bgimg.click(function(event){
		var $this=$(this);
		if($bg.data("nextImage") && $bg.data("lastImageReached")!="Y"){ //if next image data is stored and last image is not selected
			$this.css("display","none");
			$preloader.fadeIn("fast"); //show preloader
			$($outer_container.data("selectedThumb")).children(".selected").css("display","none"); //deselect thumb
			$($outer_container.data("selectedThumb")).next().children(".selected").css("display","block"); //select new thumb
			//store new selected thumb
			var selThumb=$outer_container.data("selectedThumb");
			$outer_container.data("selectedThumb",$(selThumb).next()); 
			$bg.data("newTitle",$($outer_container.data("selectedThumb")).children("img").attr("title")); //get and store new image title attribute
			itemIndex++;
			$this.attr("src", "").attr("src", $bg.data("nextImage")); //switch image
		}
	});
	
	//function to get element index (fuck you IE!)
	function getIndex(theItem){
		for ( var i = 0, length = $outer_container_a.length; i < length; i++ ) {
			if ( $outer_container_a[i] === theItem ) {
				return i;
			}
		}
	}
	
	//toolbar (image view mode button) hover
	$toolbar.hover(
		function(){ //mouse over
			$(this).stop().fadeTo("fast",1);
		},
		function(){ //mouse out
			$(this).stop().fadeTo("fast",0.8);
		}
	); 
	$toolbar.stop().fadeTo("fast",0.8); //set its original state
	
	//Clicking on toolbar changes the image view mode
	$toolbar.click(function(event){
		if($toolbar.data("imageViewMode")=="normal"){
			ImageViewMode("full");
		} else {
			ImageViewMode("normal");
		}
	});

	//next image balloon tip
	function NextImageTip(){
		if($bg.data("nextImage") && $bg.data("lastImageReached")!="Y"){ //check if this is the first or last image
			$nextimage_tip.stop().css("right",20).fadeIn("fast").fadeOut(2000,"easeInExpo",function(){$nextimage_tip.css("right",$(window).width());});
		}
	}

	//slide in/out left pane function
	function SlidePanels(action){
		var speed=900;
		var easing="easeInOutExpo";
		if(action=="open"){
			$("#arrow_indicator").fadeTo("fast",0);
			$outer_container.stop().animate({left: 0}, speed,easing);
			$bg.stop().animate({left: 585}, speed,easing);
		} else {
			$outer_container.stop().animate({left: -710}, speed,easing);
			$bg.stop().animate({left: 0}, speed,easing,function(){$("#arrow_indicator").fadeTo("fast",1);});
		}
	}

//Image scale function
function FullScreenBackground(theItem){
	var winWidth=$(window).width();
	var winHeight=$(window).height();
	var imageWidth=$(theItem).width();
	var imageHeight=$(theItem).height();
	var picHeight = imageHeight / imageWidth;
	var picWidth = imageWidth / imageHeight;
	if($toolbar.data("imageViewMode")!="normal"){ //image view mode: full
		if ((winHeight / winWidth) < picHeight) {
			$(theItem).css("width",winWidth);
			$(theItem).css("height",picHeight*winWidth);
		} else {
			$(theItem).css("height",winHeight);
			$(theItem).css("width",picWidth*winHeight);
		};
	} else { //image view mode: fit
		if ((winHeight / winWidth) > picHeight) {
			$(theItem).css("width",winWidth);
			$(theItem).css("height",picHeight*winWidth);
		} else {
			$(theItem).css("height",winHeight);
			$(theItem).css("width",picWidth*winHeight);
		};
	}
	//center it
	$(theItem).css("margin-left",(winWidth - $(theItem).width()) / 2);
	$(theItem).css("margin-top",(winHeight - $(theItem).height()) / 2);
}

//image view mode function - full or fit
function ImageViewMode(theMode){
	$toolbar.data("imageViewMode", theMode); //store new mode
	FullScreenBackground($bgimg); //scale bg image
	//re-style button
	if(theMode=="full"){
		$toolbar.html("<span class='lightgrey'>IMAGE VIEW MODE &rsaquo;</span> FULL").css("width",125);
	} else {
		$toolbar.html("<span class='lightgrey'>IMAGE VIEW MODE &rsaquo;</span> FIT").css("width",115);
	}
}

//preload script images
var images=["images/ajax-loader_dark.gif","images/round_custom_scrollbar_bg_over.png"];
$.each(images, function(i) {
  images[i] = new Image();
  images[i].src = this;
});
/* 代码整理：网页设计之家 www.mysite.com */