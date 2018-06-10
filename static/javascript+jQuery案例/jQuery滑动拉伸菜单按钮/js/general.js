jQuery.preloadImages = function()
{
	for(var i = 0; i<arguments.length; i++)
	jQuery("<img>").attr("src", arguments[i]);
}
jQuery.preloadImages("../images/key.gif", "../images/keyo.gif", "../images/rss.gif", "../images/rsso.gif", "../images/sel.gif", "../images/selo.gif");

jQuery(document).ready(function(){
	
	$("#iconbar li a").hover(
		function(){
			var iconName = $(this).children("img").attr("src");
			var origen = iconName.split(".gif")[0];
			$(this).children("img").attr({src: "" + origen + "o.gif"});
			$(this).css("cursor", "pointer");
			$(this).animate({ width: "140px" }, {queue:false, duration:"normal"} );
			$(this).children("span").animate({opacity: "show"}, "fast");
		}, 
		function(){
			var iconName = $(this).children("img").attr("src");
			var origen = iconName.split("o.")[0];
			$(this).children("img").attr({src: "" + origen + ".gif"});			
			$(this).animate({ width: "24px" }, {queue:false, duration:"normal"} );
			$(this).children("span").animate({opacity: "hide"}, "fast");
		});
});