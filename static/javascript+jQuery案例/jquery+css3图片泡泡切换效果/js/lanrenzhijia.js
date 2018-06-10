/* 代码整理：网页设计之家 mysite.com */
$(function(){
	var photos = [
		'images/lanrenzhijia1.jpg',
		'images/lanrenzhijia2.jpg',
		'images/lanrenzhijia3.jpg',
		'images/lanrenzhijia4.jpg',
		'images/lanrenzhijia5.jpg',
		'images/lanrenzhijia6.jpg'
	];
	
	var lanrenzhijia = $('#lanrenzhijia').bubbleSlideshow(photos);

	$(window).load(function(){
		lanrenzhijia.autoAdvance(4000);
	});
	
	// Other valid method calls:
	
	// slideshow.showNext();
	// slideshow.showPrev();
	// slideshow.stopAutoAdvance();
});