/* 代码整理：网页设计之家 www.mysite.com */
(function($){

	// An array with photos to show on the page. In a normal web app
	// you would fetch this array from your server with AJAX.

	var photos = [
		'http://demo.lanrenzhijia.com/2014/pic0721/images/1.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/2.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/3.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/4.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/5.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/6.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/7.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/8.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/9.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/10.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/11.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/12.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/13.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/14.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/15.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/16.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/17.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/18.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/19.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/20.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/21.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/22.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/23.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/24.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/25.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/26.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/27.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/28.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/29.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/30.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/31.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/32.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/33.jpg',	'http://demo.lanrenzhijia.com/2014/pic0721/images/34.jpg',
		'http://demo.lanrenzhijia.com/2014/pic0721/images/35.jpg'
	];

	$(document).ready(function(){		

		var page = 0,
			loaded = 0,
			perpage = 35,
			main = $('#main'),
			expected = perpage,
			loadMore = $('#loadMore');

		// Listen for custom events

		main.on('image-loaded', function(){

			// When such an event occurs, advance the progress bar

			loaded++;

			// This function takes a number between 0 and 1
			NProgress.set(loaded/expected);

			if(page*perpage >= photos.length){

				// If there are no more photos to show,
				// remove the load button from the page

				loadMore.remove();
			}
		});

		// When the load button is clicked, show 10 more images 
		// (controlled by the perpage variable)

		loadMore.click(function(e){

			e.preventDefault();

			loaded = 0;
			expected = 0;

			var deferred = $.Deferred().resolve();

			// Get a slice of the photos array, and show the photos. Depending
			// on the size of the array, there may be less than perpage photos shown:

			$.each(photos.slice(page*perpage, page*perpage + perpage), function(){
				deferred = main.showImage(this, deferred);
				expected++;
			});

			// Start the progress bar animation
			NProgress.start();
	
			page++;
		});

		loadMore.click();
	});

	// Create a new jQuery plugin, which takes two arguments:
	//	  src - the URL of an image
	//	  deferred - a jQuery deferred object, created by the previously shown photo

	$.fn.showImage = function(src, deferred){

		var elem = $(this);

		// The deferred that this function will return
		var result = $.Deferred();

		// Construct the markup

		var holder = $('<div class="photo" />').appendTo(elem);

		// Start loading the the image

		var img = $('<img>');

		img.load(function(){

			// The photo has been loaded! Use the always method of the deferred
			// to get notified when the previous image has been loaded. When this happens,
			// show the current one.

			deferred.always(function(){

				// Trigger a custom event on the #main div:
				elem.trigger('image-loaded');

				// Append the image to the page and reveal it with an animation

				img.hide().appendTo(holder).delay(100).fadeIn('fast', function(){

					// Resolve the returned deferred. This will notifiy
					// the next photo on the page and call its always callback

					result.resolve()
				});
			});

		});

		img.attr('src', src);

		// Return the deferred (it has not been resolved at this point)
		return result;
	} 

})(jQuery);
/* 代码整理：网页设计之家 www.mysite.com */