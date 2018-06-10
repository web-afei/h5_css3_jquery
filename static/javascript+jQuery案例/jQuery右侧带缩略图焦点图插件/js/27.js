
/*==============[/home/tags/dbh-14.25/app/web/js/jquery/jquery.colorbox.min.js] START =============*/
/*!
	jQuery Colorbox v1.4.11 - 2013-04-09
	(c) 2013 Jack Moore - jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($, document, window) {
	var
	// Default settings object.
	// See http://jacklmoore.com/colorbox for details.
	defaults = {
		transition: "elastic",
		speed: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		fastIframe: true,
		photo: false,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,
		className: false,
		
		// alternate image paths for high-res displays
		retinaImage: false,
		retinaUrl: false,
		retinaSuffix: '@2x.$1',

		// internationalization
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "This content failed to load.",
		imgError: "This image failed to load.",

		open: false,
		returnFocus: true,
		reposition: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i,

		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	boxElement = prefix + 'Element',
	
	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	$events = $('<a/>'),
	
	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	className,
	requests = 0,
	init;

	// ****************
	// HELPER FUNCTIONS
	// ****************
	
	// Convience function for creating new jQuery objects
	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}
	
	// Get the window height using innerHeight when available to avoid an issue with iOS
	// http://bugs.jquery.com/ticket/6724
	function winheight() {
		return window.innerHeight ? window.innerHeight : $(window).height();
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var
		max = $related.length,
		newIndex = (index + increment) % max;
		
		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Convert '%' and 'px' values to integers
	function setSize(size, dimension) {
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by the regex.
	function isImage(settings, url) {
		return settings.photo || settings.photoRegex.test(url);
	}

	function retinaUrl(settings, url) {
		return settings.retinaUrl && window.devicePixelRatio > 1 ? url.replace(settings.photoRegex, settings.retinaSuffix) : url;
	}

	function trapFocus(e) {
		if ('contains' in $box[0] && !$box[0].contains(e.target)) {
			e.stopPropagation();
			$box.focus();
		}
	}

	// Assigns function results to their respective properties
	function makeSettings() {
		var i,
			data = $.data(element, colorbox);
		
		if (data == null) {
			settings = $.extend({}, defaults);
			if (console && console.log) {
				console.log('Error: cboxElement missing settings object');
			}
		} else {
			settings = $.extend({}, data);
		}
		
		for (i in settings) {
			if ($.isFunction(settings[i]) && i.slice(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
				settings[i] = settings[i].call(element);
			}
		}
		
		settings.rel = settings.rel || element.rel || $(element).data('rel') || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.title = settings.title || element.title;
		
		if (typeof settings.href === "string") {
			settings.href = $.trim(settings.href);
		}
	}

	function trigger(event, callback) {
		// for external use
		$(document).trigger(event);

		// for internal use
		$events.trigger(event);

		if ($.isFunction(callback)) {
			callback.call(element);
		}
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		clear,
		set,
		start,
		stop;
		
		if (settings.slideshow && $related[1]) {
			clear = function () {
				clearTimeout(timeOut);
			};

			set = function () {
				if (settings.loop || $related[index + 1]) {
					timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
				}
			};

			start = function () {
				$slideshow
					.html(settings.slideshowStop)
					.unbind(click)
					.one(click, stop);

				$events
					.bind(event_complete, set)
					.bind(event_load, clear)
					.bind(event_cleanup, stop);

				$box.removeClass(className + "off").addClass(className + "on");
			};
			
			stop = function () {
				clear();
				
				$events
					.unbind(event_complete, set)
					.unbind(event_load, clear)
					.unbind(event_cleanup, stop);
				
				$slideshow
					.html(settings.slideshowStart)
					.unbind(click)
					.one(click, function () {
						publicMethod.next();
						start();
					});

				$box.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		} else {
			$box.removeClass(className + "off " + className + "on");
		}
	}

	function launch(target) {
		if (!closing) {
			
			element = target;
			
			makeSettings();
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var data = $.data(this, colorbox),
						relRelated;

					if (data) {
						relRelated =  $(this).data('rel') || data.rel || this.rel;
					}
					
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to Colorbox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			$overlay.css({
				opacity: parseFloat(settings.opacity),
				cursor: settings.overlayClose ? "pointer" : "auto",
				visibility: 'visible'
			}).show();
			

			if (className) {
				$box.add($overlay).removeClass(className);
			}
			if (settings.className) {
				$box.add($overlay).addClass(settings.className);
			}
			className = settings.className;

			$close.html(settings.close).show();

			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				// Show colorbox so the sizes can be calculated in older versions of jQuery
				$box.css({visibility:'hidden', display:'block'});
				
				$loaded = $tag(div, 'LoadedContent', 'width:0; height:0; overflow:hidden').appendTo($content);

				// Cache values needed for size calculations
				interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();
				interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
				loadedHeight = $loaded.outerHeight(true);
				loadedWidth = $loaded.outerWidth(true);
				
				
				// Opens inital empty Colorbox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position();

				slideshow();

				trigger(event_open, settings.onOpen);
				
				$groupControls.add($title).hide();

				$box.focus();
				
				// Confine focus to the modal
				// Uses event capturing that is not supported in IE8-
				if (document.addEventListener) {

					document.addEventListener('focus', trapFocus, true);
					
					$events.one(event_closed, function () {
						document.removeEventListener('focus', trapFocus, true);
					});
				}

				// Return focus on closing
				if (settings.returnFocus) {
					$events.one(event_closed, function () {
						$(element).focus();
					});
				}
			}
			
			load();
		}
	}

	// Colorbox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box && document.body) {
			init = false;
			$window = $(window);
			$box = $tag(div).attr({
				id: colorbox,
				'class': $.support.opacity === false ? prefix + 'IE' : '', // class for optional IE8 & lower targeted CSS.
				role: 'dialog',
				tabindex: '-1'
			}).hide();
			$overlay = $tag(div, "Overlay").hide();
			$loadingOverlay = $tag(div, "LoadingOverlay").add($tag(div, "LoadingGraphic"));
			$wrap = $tag(div, "Wrapper");
			$content = $tag(div, "Content").append(
				$title = $tag(div, "Title"),
				$current = $tag(div, "Current"),
				$prev = $('<button/>').attr({id:prefix+'Previous', type:'button'}),
				$next = $('<button/>').attr({id:prefix+'Next', type:'button'}),
				$slideshow = $tag('button', "Slideshow"),
				$loadingOverlay,
				$close = $('<button/>').attr({id:prefix+'Close', type:'button'})
			);
			
			$wrap.append( // The 3x3 Grid that makes up Colorbox
				$tag(div).append(
					$tag(div, "TopLeft"),
					$topBorder = $tag(div, "TopCenter"),
					$tag(div, "TopRight")
				),
				$tag(div, false, 'clear:left').append(
					$leftBorder = $tag(div, "MiddleLeft"),
					$content,
					$rightBorder = $tag(div, "MiddleRight")
				),
				$tag(div, false, 'clear:left').append(
					$tag(div, "BottomLeft"),
					$bottomBorder = $tag(div, "BottomCenter"),
					$tag(div, "BottomRight")
				)
			).find('div div').css({'float': 'left'});
			
			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none');
			
			$groupControls = $next.add($prev).add($current).add($slideshow);

			$(document.body).append($overlay, $box.append($wrap, $loadingBay));
		}
	}

	// Add Colorbox's event bindings
	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.control)) {
				e.preventDefault();
				launch(this);
			}
		}

		if ($box) {
			if (!init) {
				init = true;

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.overlayClose) {
						publicMethod.close();
					}
				});
				
				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.escKey && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (open && settings.arrowKey && $related[1] && !e.altKey) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});

				if ($.isFunction($.fn.on)) {
					// For jQuery 1.7+
					$(document).on('click.'+prefix, '.'+boxElement, clickHandler);
				} else {
					// For jQuery 1.3.x -> 1.6.x
					// This code is never reached in jQuery 1.9, so do not contact me about 'live' being removed.
					// This is not here for jQuery 1.9, it's here for legacy users.
					$('.'+boxElement).live('click.'+prefix, clickHandler);
				}
			}
			return true;
		}
		return false;
	}

	// Don't do anything if Colorbox already exists.
	if ($.colorbox) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.colorbox.close();
	// Usage from within an iframe: parent.jQuery.colorbox.close();
	// ****************
	
	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this;
		
		options = options || {};
		
		appendHTML();

		if (addBindings()) {
			if ($.isFunction($this)) { // assume a call to $.colorbox
				$this = $('<a/>');
				options.open = true;
			} else if (!$this[0]) { // colorbox being applied to empty collection
				return $this;
			}
			
			if (callback) {
				options.onComplete = callback;
			}
			
			$this.each(function () {
				$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			}).addClass(boxElement);
			
			if (($.isFunction(options.open) && options.open.call($this)) || options.open) {
				launch($this[0]);
			}
		}
		
		return $this;
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		css,
		top = 0,
		left = 0,
		offset = $box.offset(),
		scrollTop,
		scrollLeft;
		
		$window.unbind('resize.' + prefix);

		// remove the modal so that it doesn't influence the document width/height
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.fixed) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}

		// keeps the top and left positions within the browser's viewport.
		if (settings.right !== false) {
			left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
		} else if (settings.left !== false) {
			left += setSize(settings.left, 'x');
		} else {
			left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
		}
		
		if (settings.bottom !== false) {
			top += Math.max(winheight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
		} else if (settings.top !== false) {
			top += setSize(settings.top, 'y');
		} else {
			top += Math.round(Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
		}

		$box.css({top: offset.top, left: offset.left, visibility:'visible'});

		// setting the speed to 0 to reduce the delay between same-sized content.
		speed = ($box.width() === settings.w + loadedWidth && $box.height() === settings.h + loadedHeight) ? 0 : speed || 0;
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = (parseInt(that.style.width,10) - interfaceWidth)+'px';
			$content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = (parseInt(that.style.height,10) - interfaceHeight)+'px';
		}

		css = {width: settings.w + loadedWidth + interfaceWidth, height: settings.h + loadedHeight + interfaceHeight, top: top, left: left};

		if(speed===0){ // temporary workaround to side-step jQuery-UI 1.8 bug (http://bugs.jquery.com/ticket/12273)
			$box.css(css);
		}
		$box.dequeue().animate(css, {
			duration: speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (settings.reposition) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}

				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {
				$loaded.css({height: "auto"});
				settings.h = $loaded.height();
			}
			$loaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var callback, speed = settings.transition === "none" ? 0 : settings.speed;

		$loaded.empty().remove(); // Using empty first may prevent some IE7 issues.

		$loaded = $tag(div, 'LoadedContent').append(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		
		$(photo).css({'float': 'none'});

		callback = function () {
			var total = $related.length,
				iframe,
				frameBorder = 'frameBorder',
				allowTransparency = 'allowTransparency',
				complete;
			
			if (!open) {
				return;
			}
			
			function removeFilter() { // Needed for IE7 & IE8 in versions of jQuery prior to 1.7.2
				if ($.support.opacity === false) {
					$box[0].style.removeAttribute('filter');
				}
			}
			
			complete = function () {
				clearTimeout(loadingTimer);
				$loadingOverlay.hide();
				trigger(event_complete, settings.onComplete);
			};

			
			$title.html(settings.title).add($loaded).show();
			
			if (total > 1) { // handle grouping
				if (typeof settings.current === "string") {
					$current.html(settings.current.replace('{current}', index + 1).replace('{total}', total)).show();
				}
				
				$next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
				$prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
				
				if (settings.slideshow) {
					$slideshow.show();
				}
				
				// Preloads images within a rel group
				if (settings.preloading) {
					$.each([getIndex(-1), getIndex(1)], function(){
						var src,
							img,
							i = $related[this],
							data = $.data(i, colorbox);

						if (data && data.href) {
							src = data.href;
							if ($.isFunction(src)) {
								src = src.call(i);
							}
						} else {
							src = $(i).attr('href');
						}

						if (src && isImage(data, src)) {
							src = retinaUrl(data, src);
							img = new Image();
							img.src = src;
						}
					});
				}
			} else {
				$groupControls.hide();
			}
			
			if (settings.iframe) {
				iframe = $tag('iframe')[0];
				
				if (frameBorder in iframe) {
					iframe[frameBorder] = 0;
				}
				
				if (allowTransparency in iframe) {
					iframe[allowTransparency] = "true";
				}

				if (!settings.scrolling) {
					iframe.scrolling = "no";
				}
				
				$(iframe)
					.attr({
						src: settings.href,
						name: (new Date()).getTime(), // give the iframe a unique name to prevent caching
						'class': prefix + 'Iframe',
						allowFullScreen : true, // allow HTML5 video to go fullscreen
						webkitAllowFullScreen : true,
						mozallowfullscreen : true
					})
					.one('load', complete)
					.appendTo($loaded);
				
				$events.one(event_purge, function () {
					iframe.src = "//about:blank";
				});

				if (settings.fastIframe) {
					$(iframe).trigger('load');
				}
			} else {
				complete();
			}
			
			if (settings.transition === 'fade') {
				$box.fadeTo(speed, 1, removeFilter);
			} else {
				removeFilter();
			}
		};
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				publicMethod.position(0, callback);
			});
		} else {
			publicMethod.position(speed, callback);
		}
	};

	function load () {
		var href, setResize, prep = publicMethod.prep, $inline, request = ++requests;
		
		active = true;
		
		photo = false;
		
		element = $related[index];
		
		makeSettings();
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
		loadingTimer = setTimeout(function () {
			$loadingOverlay.show();
		}, 100);
		
		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when Colorbox closes or loads new content.
			$inline = $tag(div).hide().insertBefore($(href)[0]);

			$events.one(event_purge, function () {
				$inline.replaceWith($loaded.children());
			});

			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(settings, href)) {

			href = retinaUrl(settings, href);

			$(photo = new Image())
			.addClass(prefix + 'Photo')
			.bind('error',function () {
				settings.title = false;
				prep($tag(div, 'Error').html(settings.imgError));
			})
			.one('load', function () {
				var percent;

				if (request !== requests) {
					return;
				}

				photo.alt = $(element).attr('alt') || $(element).attr('data-alt') || '';
				photo.longdesc = $(element).attr('longdesc');

				if (settings.retinaImage && window.devicePixelRatio > 1) {
					photo.height = photo.height / window.devicePixelRatio;
					photo.width = photo.width / window.devicePixelRatio;
				}

				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.mh - photo.height, 0) / 2 + 'px';
				}
				
				if ($related[1] && (settings.loop || $related[index + 1])) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
						publicMethod.next();
					};
				}

				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			$loadingBay.load(href, settings.data, function (data, status) {
				if (request === requests) {
					prep(status === 'error' ? $tag(div, 'Error').html(settings.xhrError) : $(this).contents());
				}
			});
		}
	}
		
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (settings.loop || $related[index + 1])) {
			index = getIndex(1);
			launch($related[index]);
		}
	};
	
	publicMethod.prev = function () {
		if (!active && $related[1] && (settings.loop || index)) {
			index = getIndex(-1);
			launch($related[index]);
		}
	};

	// Note: to use this within an iframe use the following format: parent.jQuery.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix);
			
			$overlay.fadeTo(200, 0);
			
			$box.stop().fadeTo(300, 0, function () {
			
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				$loaded.empty().remove(); // Using empty first may prevent some IE7 issues.
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// Removes changes Colorbox made to the document, but does not remove the plugin.
	publicMethod.remove = function () {
		if (!$box) { return; }

		$box.stop();
		$.colorbox.close();
		$box.stop().remove();
		$overlay.remove();
		closing = false;
		$box = null;
		$('.' + boxElement)
			.removeData(colorbox)
			.removeClass(boxElement);

		$(document).unbind('click.'+prefix);
	};

	// A method for fetching the current element Colorbox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;

}(jQuery, document, window));


$(function() {
	$.extend($.colorbox.settings, {
		opacity: 0.8, 
		loop:false, 
		initialWidth:40, 
		initialHeight:40, 
		speed:300,
		maxWidth: "990px", 
		maxHeight: "95%", 
		scrolling:false, 
		transition:"fade",
		onClosed: function(){
			$('#colorbox').removeClass();
		}
	});
});
/*==============[/home/tags/dbh-14.25/app/web/js/jquery/jquery.colorbox.min.js] END =============*/
/*==============[/home/tags/dbh-14.25/app/web/js/manu.js] START =============*/
jQuery(function() {
	manu.init();
});

(function( window ) {
	gDisableJSValidation = false;
	gJsHandlers = [];
	gValidateRules = new Object;
	gValidateRules1 = new Object;
	gMessages = new Object;
	pageloadflag = true;
	lasthash = "";

var manu = {

	debugJavascript: true,
	supportHistoryPlugin : false,
	dialogElement : null,
	pendingJs : [],
	executedHandlers : [],
	ajaxError: false,
	loadedScripts: [],
	loadedStyles: [],
	inAdmin: false,
	loadTimestamp: null,

	// initialize
	init : function() {
	
		if (manu.supportHistoryPlugin) {
			if (location.hash) {
				manu.pagination.handlePageload(location.hash);
			}
			$.historyInit(manu.utils.handlePageload);
		}
		$.ajaxSetup( {
			cache : false,
			dataFilter : manu.sanitizeResponseData
		});

		$("#loading").hide();
		$("#loading").ajaxSend(function(event, xhr, options) {
			if(options.dataType == "json") {
				xhr.setRequestHeader('Fw-Json', 1);
			}
			xhr.setRequestHeader('Fw-Ajax', 1);
			$(this).show();
		});
		$("#loading").ajaxComplete(function(event, xhr, options) {
			$(this).hide();
			manu.executePendingJs();
		});
		$("#loading").ajaxError(function(event, request, settings) {
			manu.handleAjaxError(request.responseText, settings.url);
			return false;
		});
		
		$('.popup').live('click', function(e)
		{
		  e.stopPropagation();
		  var href = $(this).attr('href');
		  var height = $(this).attr('data-popup-height');
		  var width = $(this).attr('data-popup-width');
		  var params = {width: parseInt(width), height: parseInt(height), modal: true};
		  manu.ajaxDialog(href,{}, params);
		  
		  return false;
		});

		$('a.admin-feature').live('click', function(e){
			e.preventDefault();
			$.get($(this).attr('href'), function(data) {
				location.reload();
			});
		});
		
		if (document.URL.match("designbyhumans.com/admin/")) {
			manu.inAdmin = true;
		}
		
		// Set global timestamp
		manu.loadTimestamp = $("body").attr("data-timestamp");
	},

	// handle the metadata (debug data, javascript) that framework sends along with the main data
	sanitizeResponseData : function(data, type) {
		if(data.indexOf("<!--FW_SEPARATOR-->") <= 0) return data;
		var temp = data.split("<!--FW_SEPARATOR-->");
		var fwdata = temp[0];
		data = temp[1];
		if (fwdata.match(/[\s\S]*<!--FW_DEBUG-->[\s\S]*/)) {
			var debugData = fwdata.replace(
					/^[\s\S]*?<!--FW_DEBUG-->([\s\S]*?)<!--FW_DEBUG-->[\s\S]*?$/,
			"$1");
			if (debugData) {
				$("#fw_debug_ajax_actions").append(debugData);
			}
		}
		if (fwdata.match(/[\s\S]*<!--FW_JS-->[\s\S]*/)) {
			var js = fwdata.replace(
					/^[\s\S]*?<!--FW_JS-->([\s\S]*?)<!--FW_JS-->[\s\S]*?$/,
			"$1");
			if (js) {
				manu.pendingJs.push(js);
			}
		}
		return data;
	},

	log: function(msg) {
		if (typeof console != "undefined") {
			if(console.log) {
				console.log(msg);
			}
		}
	},

	debug: function(msg) {
		if (typeof console != "undefined") {
			if(console.log && manu.debugJavascript && window.location.host != 'www.designbyhumans.com') {
				console.log(msg);
			}
		}
	},

	objectSize: function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	},

 	// execute all the pending js (from metadata)
	executePendingJs: function () {
		if (manu.pendingJs.length > 0) {
			var js = manu.pendingJs.pop();
			eval(js);
		}
	},

	loadScripts: function(scripts) {
		if(!scripts) return;
		for (var i in scripts) {
			var script = scripts[i];
			manu.debug("loading script " + script);
			if($.inArray(script, manu.loadedScripts) == -1) {
				$.ajax({
					  url: script,
					  dataType: 'script',
					  async: false
					});
				manu.loadedScripts.push(script);
			}
			else {
				manu.log('script already loaded');
			}
		}
	},

	loadStyles: function(styles) {
		if(!styles) return;
		for (var i in styles) {
			var style = styles[i];
			manu.debug("loading style " + style);
			if($.inArray(style, manu.loadedStyles) == -1) {
				$('<link rel="stylesheet" type="text/css" href="'+ style +'" >')
				   .appendTo("head");
				manu.loadedStyles.push(style);
			}
			else {
				manu.log('style already loaded');
			}
		}
	},

	// execute the javascript handlers
	executeJsHandlers: function(handlers) {
		if(handlers === undefined) return;
		for(var id in handlers) {
			var h = handlers[id];
			if (h === undefined) continue;
			manu.executeJsHandler(id, h.name, h.params, h.alwaysExec);
		}
	},

	// execute the javascript handler. execute a handler only once unless requested otherwise
	executeJsHandler : function(id, handler, params, alwaysExec) {
		if (!alwaysExec	&& jQuery.inArray(id, manu.executedHandlers) != -1) {
			return;
		}
		if (handler == '') {	return; }
		var handler1 = eval(handler);
		if(!handler1) {
			throw "Handler " + handler + " is not defined";
		}
		var fparams = [];
		for(var i in params) {
			fparams.push(params[i]);
		}
		manu.debug("Executing handler [" + handler + "]" + "[" + fparams.join(",") + "]");
		handler1.apply(params, fparams);
		if (jQuery.inArray(id, manu.executedHandlers) == -1) {
			manu.executedHandlers.push(id);
		}
	},

	// get the localized static messages
	getMsg : function(msg_id, args) {
		arg_array = manu.utils.is_array(args);
		msg = gStaticMessages[msg_id];
		if (arg_array) {
			for ( var i = 0; i < args.length; i++) {
				msg = msg.replace("{" + (i + 1) + "}", args[i]);
			}
		} else {
			msg = msg.replace("{1}", args);
		}
		return msg;
	},

	alertMsg : function(msg_id, args) {
		alert(manu.getMsg(msg_id, args));
	},

	// show the localized msg as confirm window
	confirmMsg : function(msg_id, args) {
		return confirm(manu.getMsg(msg_id, args));
	},

	// Wrappers around jquery.get
	// TODO: evaluate if the functionality can be moved to jquery ajax fns.

	getAction : function(action, params, callback) {
		var actionUrl = URL_PREFIX_AJAX + action;
		return this.get(actionUrl, params, callback);
	},

	get : function(url, params, callback) {
//		console.log('jQuery.get');
		return jQuery.get(url, params, function(data) {
			var ret = manu.handleAjaxError(data, url);
			if (!ret)
				return;
			if (callback)
				callback(data);
		});
	},

	// Wrappers around jquery.post
	postAction : function(action, params, callback) {
		var actionUrl = URL_PREFIX_AJAX + action;
		return this.post(actionUrl, params, callback);
	},

	post: function(url, params, callback) {
//		console.log('jQuery.post');
		return jQuery.post(url, params, function(data) {
			var ret = manu.handleAjaxError(data, url);
			if (!ret)
				return;
			if (callback)
				callback(data);
		});
	},

	// Wrappers around jquery.getJSON
	getJSONAction : function(action, params, callback) {
		var actionUrl = URL_PREFIX_AJAX + action;
//		console.log('jQuery.getJSON');
		return jQuery.getJSON(actionUrl, params, function(data) {
			var error_flag = false;
			for ( var i in data['messages']) {
				if (data['messages'][i]['type'] == 'E') {
					error_flag = true;
				}
			}
			for ( var i in data['verrors']) {
				error_flag = true;
			}
			manu.validation.displayMessages(action, data['messages'], true);
			manu.executeJsHandlers(data['handlers']);
			if (callback && !error_flag) {
				callback(data);
			}
		});
	},

	// Wrappers around jquery.load
	load: function(target, url, params, callback) {
//		console.log('jQuery.load (jquery.get)');
		return jQuery.get(url, params, function(data) {
			var ret = manu.handleAjaxError(data, url);
			if (!ret)
				return;
			$(target).html(data);
			if (callback) {
				callback(data);
			}
		});
	},

	loadAction : function(target, action, params, callback) {
		if (manu.inAdmin) {
			params['in_admin'] = true;	
		}
		var actionUrl = URL_PREFIX_AJAX + action;
		return this.load(target, actionUrl, params, callback);
	},


	// Wrappers around jquery.ajaxSubmit (provided by jquery.form )
	ajaxSubmitAction : function(form_id, callback) {
		var form = document.getElementById(form_id);
		var action = manu.getFormAction(form);
		var ret = manu.form.validateForm(form);
		if (!ret)
			return;
//		console.log('jquery.ajaxSubmit');
		$(form).ajaxSubmit( {
			success : function(data) {
			var ret = manu.handleAjaxError(data, action);
			if (!ret)
				return;
			if (callback) {
				callback(data);
			}
		}
		});
	},

	ajaxSubmitJSON : function(form_id, callback, errorcallback) {
		var form = document.getElementById(form_id);
		var ret = manu.form.validateForm1(form);
		if (!ret) {
			return;
		}
//		console.log('jquery.ajaxSubmit (ajaxSubmitJSON)');
		$(form).ajaxSubmit( {
			dataType : 'json',
			success : function(data) {
			var error_flag = false;
			for (i in data['messages']) {
				if (data['messages'][i]['type'] == 'E') {
					error_flag = true;
				}
			}

			for (i in data['verrors']) {
				error_flag = true;
			}

			var action = manu.getFormAction(form);
			manu.validation.displayMessages(action, data['messages'], true);

			for ( var h in data['handlers']) {
				var alwaysExec = data['handlers'][h];
				manu.executeJsHandler(h, alwaysExec);
			}

			if (errorcallback && error_flag) {
				errorcallback(data);
			}

			if (callback && !error_flag) {
				callback(data);
			}
		},

		error : function(data) {
			if (errorcallback) {
				errorcallback(data);
			}
		}
		});
	},

	handleAjaxError : function(data, url) {
		if (!data)
			return true;
		if (data.match(/FW_PHP_ERROR/)) {
			var error = data.replace(/<!--FW_PHP_ERROR-->/g, '');
			alert("Oops! Something went wrong. Please try again.");
			return false;
		} else if (data.match(/FW_PHP_EXCEPTION/)) {
			alert("Oops! Something went wrong. Please try again.");
			return false;
		} else if (data.match(/FW_AJAX_REDIRECT/)) {
			var redirect_url = data.replace(
					/.*<!--FW_AJAX_REDIRECT-->(.*?)<!--FW_AJAX_REDIRECT-->.*/m,
			"$1");
			window.location.href = redirect_url;
			return false;
		}
		return true;
	},

	clearActionMessages : function(action) {
		$(".alert, .alertbox").each(
				function() {
					if (!this.className
							.match("m_" + action.toLowerCase() + "-")) {
						return;
					}
					$(this).html("");
					$(this).hide();
					$(this).parents('form.normal').find('label').removeClass('error_label');
				});
	},

	getFormAction : function(form) {
		var action = form.action;
		if (!action) {
			var path = location.pathname;
			action = path.replace(/^(\w+).*/, "$1");
		}
		action = action.toLowerCase();
		action = action.replace(/(\w+)\?/, "$1");
		action = action.replace(/^.*?(\w+)$/g, "$1");
		return action;
	},

	// should move to a plugin
	typeAhead : function($input, func, minChars, maxChars, delay) {
		var timeout = false;
		if ($.browser.mozilla)
			$input.keypress(processKey); // onkeypress repeats arrow keys in
		// Mozilla/Opera
		else
			$input.keydown(processKey); // onkeydown repeats arrow keys in
		// IE/Safari

		function processKey(e) {
			// printable chars
			if (($(this).val().length < minChars - 1)
					|| ($(this).val().length > maxChars - 1))
				return;
			if (e.which >= 32 && e.which < 127 || e.which == 8) {
				if (timeout)
					clearTimeout(timeout);
				timeout = setTimeout(func, delay);
			}
		}
	},

	// wrapper around jquery ui dialog
	dialog : function(jelem, params) {
	  var defaults = {dialogClass: 'm-dialog'};
	  params = $.extend({}, defaults, params);
		jelem.dialog(params).dialog('open');
		manu.dialogElement = jelem;
	},

	closeDialog : function() {
		if (manu.dialogElement != null) {
			manu.dialogElement.dialog('destroy');
			//manu.dialogElement.remove();
			manu.dialogElement = null;
		}
		return false;
	},
	
	ajaxDialog: function(url, urlParams, popParams, callback)
    {
      //alert('will load '+url);
      $('.m-ajaxDialog').empty();
      manu.load('.m-ajaxDialog', url, urlParams, callback);
      manu.dialog($('.m-ajaxDialog'), popParams);
      
    },

	// Obsolete. should use jquery ui dialog instead
	actionDialog : function(msg, callbacks, params) {
		$("#action_dialog").remove();
		var html = '<div id="action_dialog"><div id="action_dialog_msg">' + msg + '</div>';
		if (callbacks) {
			for ( var action in callbacks) {
				html += '<a id="action_dialog_' + action
				+ '" href="javascript:void(0);" class="btn">' + action
				+ '</a>';
			}
		}
		if (params == null) {
			params = {};
		}
		if (params.width == null)
			params.width = 300;
		manu.dialog($(html), params);
		if (callbacks) {
			for ( var action in callbacks) {
				var cb = callbacks[action];
				$("#action_dialog_" + action).click(cb);
			}
		}
	},

	// obsolete. should use jquery dialog
	modal : function(jelem, params) {
		if ($('#jqm_window').length == 0) {
			$("body")
			.append(
			'<div id="jqm_container" ><div id="jqm_window" class="jqmWindow"><a href="#" class="jqmClose"></a></div></div>');
		}
		$('#jqm_window').append(jelem.html());
		$('#jqm_window').jqm( {
			modal : true
		});
		$('#jqm_window').jqmShow();
	}


	};

	manu.validation = {

	displayMessages : function(action, messages, ajax) {

		var alert_flag = false;

		// Hide existing alert messages for an action
		for ( var msg_id1 in messages) {
			var msg_style = messages[msg_id1]['style'];
			if (msg_style == 'A') {
				alert_flag = true;
			}
		}
		if (alert_flag) {
			if ($("#alert_messages").length > 0) {
				$("#alert_messages").html("");
			} else {
				$("body").append('<div id="alert_messages"></div>');
			}
		}
		jQuery(".m_global").html("");
		jQuery(".m_global").hide("");

		if (ajax) {
			manu.clearActionMessages(action);
		}

		for ( var msg_id1 in messages) {
			var msg_str = messages[msg_id1]['msg'];
			var msg_type = messages[msg_id1]['type'];
			var msg_style = messages[msg_id1]['style'];
			var global_flag = messages[msg_id1]['global'];
			var custom_var = messages[msg_id1]['custom_var'];
			// for normal loading actions, do not show messages other than alert
			// and flash
			// those messages are shown by function.msg.php
//			if (!ajax && !msg_style)
//				continue;
			if (global_flag) {
				this.displayGlobalMessage(msg_str, msg_type);
			} else {
				this.displayMessage(action, msg_id1, msg_str, msg_type,	msg_style, custom_var);
			}
		}
		if (alert_flag) {
			if (jQuery().dialog) {
				manu.dialog($("#alert_messages"), {
					buttons : {
					"Ok" : function() {
					manu.closeDialog();
				}
				},
				closeText : ''
				});
			} else {
				manu.modal($("#alert_messages"));
			}
		}
	},

	displayGlobalMessage : function(msg_str, msg_type) {
		var error_class = "";
		if (msg_type == 'S') {
			error_class = "success";
		} else if (msg_type == 'W') {
			error_class = "warning";
		} else if (msg_type == 'E') {
			error_class = "error";
		} else if (msg_type == 'I') {
			error_class = "info";
		}
		$(".m_global").append(
				"<div class='" + error_class + "'>" + msg_str + "</div>");
		$(".m_global").show();
	},

	displayMessage: function(action, msg_id, msg_str, msg_type, msg_style, custom_var) {
// manu.log('DISPLAY MESSAGE');
// manu.log(msg_id);
// manu.log(msg_str);

		var error_classes = {S: "success", W: "warning", E: "error", I: "info"};
		var error_class = error_classes[msg_type];
		if (!msg_style) msg_style = "";
		if (msg_style == 'A') {
			$("#alert_messages").append("<span class='" + error_class + "'>" + msg_str + "</span>");
			return;
		}
		var msg_html = "<span class='" + error_class + "' >" + msg_str + "</span>";
		action = action.replace(/[^a-z_\-\.]+/gi, "_");
		var elem_id = ".m_" + action + "-" + msg_id + ((custom_var!=undefined)?'[rel="'+custom_var+'"]':'');
		var rest_id = ".m_" + action + "-REST" + ((custom_var!=undefined)?'[rel="'+custom_var+'"]':'');
		var all_id = ".m_" + action + "-ALL" + ((custom_var!=undefined)?'[rel="'+custom_var+'"]':'');
		manu.debug(elem_id);
		manu.debug(rest_id);
		if ($(elem_id).length > 0) {
			$(elem_id).append(msg_html).height("").show(400);
		}
		else if ($(rest_id).length > 0) {
			$(rest_id).append(msg_html).height("").show(400);
		}
		else if ($(all_id).length > 0) {
			$(all_id).append(msg_html).height("").show(400);
		}

		if (msg_style == "F") {
			/*
			$(error_elem_id).show("fast", function() {
				setTimeout('$("' + error_elem_id + '").hide()', 5000);
			});
			*/
		}
	  }
	};
	manu.utils = {
		is_array : function(mixed_var) {
			return (mixed_var instanceof Array);
		},
		is_object : function(mixed_var) {
			if (mixed_var instanceof Array) {
				return false;
			} else {
				return (mixed_var !== null) && (typeof (mixed_var) == 'object');
			}
		},
	
		stripslashes : function(elem) {
			return elem.replace(/^\/+|\/+$/g, "");
		},
	
		truncate : function(str, len) {
			if(str.length <= len) return str;
			return str.substr(0, len-3)+'...';
		},
	
		// Encoding HTML special characters(<, >, &, ', ") present in the string
		htmlSpecialCharsEncode : function(string) {
			string = string.replace(/\&/g, "&amp;");
			string = string.replace(/>/g, "&gt;");
			string = string.replace(/</g, "&lt;");
			string = string.replace(/\"/g, "&quot;");
			string = string.replace(/\'/g, "&#39;");
	
			return string;
		},
	
		// Decoding HTML special characters(<, >, &, ', ") present in the string
		htmlSpecialCharsDecode : function(string) {
			string = string.replace(/\&gt;/g, ">");
			string = string.replace(/\&lt;/g, "<");
			string = string.replace(/\&quot;/g, "\"");
			string = string.replace(/\&#039;/g, "'");
			string = string.replace(/\&#39;/g, "'");
			string = string.replace(/\&apos;/g, "'");
			string = string.replace(/\&amp;/g, "&");
	
			return string;
		},
	
		alertObj : function(obj) {
			var output = "";
			for ( var i in obj) {
				output += i + "=" + obj[i];
			}
		}
	};

	window.manu = manu;
	window.Global = manu;
	window.Utils = manu.utils;

})(window);

/*==============[/home/tags/dbh-14.25/app/web/js/manu.js] END =============*/

/*==============[/home/tags/dbh-14.25/app/web/js/dbh.js] START =============*/
//var elemClicked = 0;
var fileProcessing = []; // Using the literal notation for new Array();

/*
 * DBH common functions
 */
var DBH = {
	
	checkFileUploadDone: function(e) {
		$("#file_error").hide();
		if(fileProcessing.length > 0) {
			$("#file_error").show();
			e.stopImmediatePropagation();
			return false;
		}
		return true;
	},
	
	authElementClicked: null,
	
	/** triggers the FCBKcomplete function for the particular element * */
	FCBKComplete: function (jelem, options) {
		jelem.fcbkcomplete( options );
	},

	/* once the image is processed, show the uploaded image and hide the iframe */
	handleAddedImage: function(file_obj, cont_id) {
		var curr_container = $("#" + cont_id);
/* var file_path_name = file_obj.split(/~~~/); */
		curr_container.find("iframe").hide();
		curr_container.find(".file_path").val(file_obj.file_id).attr("checked", "checked");
		curr_container.find(".file_name").html(file_obj.file_name);
		curr_container.find(".file_path_link").val(file_obj.file_name + "~~" + file_obj.file_path);
		curr_container.find(".file_content").show();
	},
 
	toggleIframeFileObject: function() {
		/*
		 * toggle the iframe window. while showing the iframe window clear the
		 * old file values
		 */
		$(".file_path").live("click", function() {
			var curr_obj = $(this).parents(".iframe_cont");
			curr_obj.find(".file_path").val('').removeAttr("checked");
			curr_obj.find(".file_name").html('');
			curr_obj.find(".file_content").hide();
			curr_obj.find("iframe").show();
		});
	},
	
	//Authentication handler.
	authHandler : function(event){
		if (gIsLogged)
		 return true;
		DBH.authElementClicked = this;
		if(!gIsLogged){
			$('#poplogin').trigger('click');
			event.stopImmediatePropagation();
			return false; 
		} else if ($(this).hasClass("quick-vote")) {
			return true;
		} else if ($(this).hasClass("stock-status")) {
			return true;
		} else if (!is_user_verified) {
			Global.alertMsg('user_dont_have_privileges');
			event.stopImmediatePropagation();
			return false;
		}
	},

	// Floating Menus
	slideTrackMenu: function() {
		var top_check = $('.slide-track nav').offset().top - parseFloat($('.slide-track nav').css('marginTop').replace(/auto/,0));
		
		$(window).scroll(function (event) {
			// what the y position of the scroll is
			var y = $(this).scrollTop();
			
			// whether that's below the form
			if (y >= top_check) {
				// if so, ad the fixed class
				$('.slide-track nav').addClass('fixed');
			} else {
				// otherwise remove it
				$('.slide-track nav').removeClass('fixed');
			}
		});
	}
 };

/*
 * Process the functions associated with Profile
 */
var Profile = {
	// Handles the password change events
	handlePasswordChangeEvents: function(){
		$('#change_user_password').live("click",function(){
			Global.ajaxSubmitJSON("change_password_form",function(data){
				if(data.response.password_changed){
					$('#change_password_form').clearForm();
					$('#poplogin').trigger('click');
				}
			});
		});
	}
};

var Slideshow = {
	Home: {
		delay: 10000,
		autoHide: false,
		init: function() {
			// sotd countdown
			shirt_of_the_day_countdown();
			// start autoslide
			var slide_timer = setTimeout(Slideshow.Home.autoSlide, Slideshow.Home.delay);
			// progress bar
			Slideshow.Home.progressBar();
			// slide change
			$('#slideshow-nav').on("click", ".nav", function(e){
				// disable default
				e.preventDefault();
				// restart autoslide
				clearTimeout(slide_timer);
				slide_timer = setInterval(Slideshow.Home.autoSlide, Slideshow.Home.delay);
				// do stuff if not active
				if(!$(this).hasClass('btn-blue')) {
					// toggle active
					$('#slideshow-nav .nav').removeClass('btn-blue');
					$(this).addClass('btn-blue');
					// slide
					$('#slideshow-slides').animate({scrollLeft: $(this).attr('data-slideTo')}, 800);
				}
				// restart progress bar
				Slideshow.Home.progressBar();
			}).on('mouseenter', function(){
				$('#slideshow-nav .nav').removeClass('hide');
			}).on('mouseleave', function(){
				$('#slideshow-nav .nav').addClass('hide');
			});
		},
		autoSlide: function() {
			// hide nav
			if(Slideshow.Home.autoHide == false){
				$('#slideshow-nav .nav').addClass('hide');
				Slideshow.Home.autoHide = true;
			}
			// whats next
			var next = $('#slideshow-nav .btn-blue').next();
			if(next.length) {
				// next
				next.trigger('click');
			} else {
				// go back to beginning
				$('#slideshow-nav .nav:first-child').trigger('click');
			}
		},
		progressBar: function(){
			// reset progress bar
			$('#slideshow-nav .progress').stop().css({'width':'0'});
			// animate progress bar
			$('#slideshow-nav .btn-blue .progress').animate({ "width": "100%" }, Slideshow.Home.delay, 'linear');
		}
	},
	Winners: {
		delay: 5000,
		init: function() {
			// start autoslide
			var slide_timer = setTimeout(Slideshow.Winners.autoSlide, Slideshow.Winners.delay);
			// progress bar
			Slideshow.Winners.progressBar();
			// slide change
			$('#winners-slideshow-nav').on("click", ".nav", function(e){
				// disable default
				e.preventDefault();
				// restart autoslide
				clearTimeout(slide_timer);
				slide_timer = setInterval(Slideshow.Winners.autoSlide, Slideshow.Winners.delay);
				// do stuff if not active
				if(!$(this).hasClass('btn-blue')) {
					// toggle active
					$('#winners-slideshow-nav .nav').removeClass('btn-blue');
					$(this).addClass('btn-blue');
					// slide
					$('#winners-slideshow-slides').animate({scrollLeft: $(this).attr('data-slideTo')}, 800);
				}
				// restart progress bar
				Slideshow.Winners.progressBar();
			});
		},
		autoSlide: function() {
			// whats next
			var next = $('#winners-slideshow-nav .btn-blue').next();
			if(next.length) {
				// next
				next.trigger('click');
			} else {
				// go back to beginning
				$('#winners-slideshow-nav .nav:first-child').trigger('click');
			}
		},
		progressBar: function(){
			// reset progress bar
			$('#winners-slideshow-nav .progress').stop().css({'width':'0'});
			// animate progress bar
			$('#winners-slideshow-nav .btn-blue .progress').animate({ "width": "100%" }, Slideshow.Winners.delay, 'linear');
		}
	},

	Badges: {
		init: function() {
			$('#news-module .container:last').addClass('last');
		}
	}
};


function shirt_of_the_day_countdown() {

	seconds = time = $('#shirt_of_the_day_countdown').attr('data-seconds');
	
	// number of days
	days = Math.floor(seconds / (60 * 60 * 24));
	// update seconds
	seconds -= days * 60 * 60 * 24;
	
	// number of hours
	hours = Math.floor(seconds / (60 * 60));
	// update seconds
	seconds -= hours * 60 * 60;
	
	// number of minutes
	minutes = Math.floor(seconds / 60);
	// update seconds
	seconds -= minutes * 60;
	
	// our leading 0's
	hours = leadingZero(hours+days*24);
	minutes = leadingZero(minutes);
	seconds = leadingZero(seconds);
	function leadingZero(time_val) {
		return (String(time_val).length >= 2) ? time_val : "0" + time_val;
	};
	
	// output
	$('#shirt_of_the_day_countdown').html(hours+':'+minutes+':'+seconds).attr({'data-seconds':(time - 1)});
	
	// stop if 0
	if(time > 0) {
		setTimeout("shirt_of_the_day_countdown()",1000);
	}
};

/*==============[/home/tags/dbh-14.25/app/web/js/dbh.js] END =============*/
/*==============[/home/tags/dbh-14.25/app/web/js/shop.js] START =============*/
/* Handles the events associated with Shop.
 * Declared the obj Shop
 */

var Shop ={
	handleShopEvents : function(){
		//Handles the quick shop
		/*
		$('.quick-shop').live("click",function() {
		 var row_id = $(this).closest('.product-row').attr('id').substr(12);
		 var product_id = $(this).closest('.product').attr('id').substr(8);
		 Global.getAction("ShopProductBasicDetails", {product_id:product_id}, function(data){
				$('#quick-shop-row-'+row_id).html(data);
		 });
		 $(this).closest('.product-row').children('.product').fadeOut('medium', function() {
				$('#quick-shop-row-'+row_id).fadeIn('medium');
		 });
		});*/
		
	// shop filters handler
		$("a.shop-filters").live("click",function() {
				var data_url = $(this).attr("data-url");
			Global.loadAction("#shop-filter-container", "ShopFilter", {uri : data_url}, function() {
					Global.loadAction("#main", "ShowBrowseTees", {uri : data_url}, function(){});
			});
			return false;
		});
		
		/*
		$('.product-img-wrapper').live('mouseover', function() {
				$('.quick-shop', this).stop().animate( {
					top: '387',
				}, 100, 'linear');
			});
			$('.product-img-wrapper').live('mouseout', function() {
				$('.quick-shop', this).stop().animate( {
					top: '409'
				}, 500, 'linear');
		 });*/
	},

	//Handles toggling of blank tees
	handleTeesToggle : function(){
		$('ul#product-types >li.blanks').live("click",function(){

			var params = $(this).attr('data-index').split("-");
			var category = params[0];
			var blank_id = params[1];
			var product_id =  $('#product_id').val();

			var request_params = {blank_id:blank_id,product_id:product_id,category:category};

			Global.loadAction('#display_image',"ShopProductImage",request_params, function(data) {
			});
			Global.loadAction('#gender_container',"ShopGenderSpecifications",request_params, function(data) {
			});
		});
	},

	//This handles the common events for both shop and home page
	handleShopCommonEvents : function(){
		//Back to top
		$('#top').live("click",function(){
			window.scrollTo(0,0);
			return false;
		});
		// Enable quickview icon
		$('a.quickview').show();
	},
	
	// Trigger GV Redemption Confirmation
	rockOn : function(){
		manu.getAction('GiftVoucherBalance', {curraction: $("body").attr("data-class")}, function(data) {
			manu.closeDialog();
			$("#gift-voucher-balance-popup").html(data);
			manu.dialog($("#gift-voucher-balance-popup"), {width: 480, resizable: false, modal: true, draggable: false});
			$('.ui-dialog-title').remove();
		});
	},

	/* Gets the common values such as gender ,size and color for shop page*/
	commonValues : function(){
		var men = $('div.mens li' ).hasClass('selected');
				var gender;
				var women = $('div.womens li' ).hasClass('selected');
				if ( men||women ){
					if( men )
						gender = 'M';
					else if ( women)
						gender = 'F';
				}
		 var size = $('.gender').find('ul li.selected').text();
		 var price = $('.price').find('ul li.selected').text();
		 var color = $('.colors').find('ul li.selected').text();

		 var details = new Array(gender,size,price,color);
		 return details;
	},
	
	handleColorbox: function(){
		
	},
	
	handleProductDetailThumb: function(){
		
		// image thumb
		$('.product-thumb').colorbox({
			loop: true,
			onLoad:function(){
				// hide zoom colors
				$('#product-zoom-colors').hide();
			},
			onComplete:function(){
				// add theme
				$('#colorbox').addClass('cboxInvert');
				// show zoom colors
				$('#product-zoom-colors').show();
			},
			onClosed:function(){
				// remove theme
				$('#colorbox').removeClass('cboxInvert');
				// hide zoom colors
				$('#product-zoom-colors').hide();
			}
		});
		
		// video thumb
		$('.video-thumb').colorbox({
			iframe:true,
			innerWidth:600,
			innerHeight:400,
			loop: true,
			onLoad:function(){
				// hide zoom colors
				$('#product-zoom-colors').hide();
			},
			onComplete:function(){
				// add theme
				$('#colorbox').addClass('cboxInvert');
				// show zoom colors
				$('#product-zoom-colors').show();
			},
			onClosed:function(){
				// remove theme
				$('#colorbox').removeClass('cboxInvert');
				// hide zoom colors
				$('#product-zoom-colors').hide();
			}
		});
		
		// thumb click
		$('#product-thumbs').on('click', '.thumb', function(){
			
			// constants
			var type = $(this).attr('data-type');
			var color = $(this).attr('data-color');
			var id = $(this).attr('data-id');
			
			// image
			var img = '#product-image .img[data-type="'+type+'"][data-color="'+color+'"][data-id="'+id+'"]';
			var src = $(img+' .src');
			
			// change active image
			$('#product-image .img').removeClass('active');
			$(img).addClass('active');
			
			// load image
			if(src.length) {
				$(img).addClass('loading');
				$('<img>').attr({'src':src.attr('data-src')})
				.bind('load', function(){
					src.replaceWith(this);
					$(img).removeClass('loading');
				});
			};
			
			// disable colorbox
			return false;
			
		});
		
		// gender click
		$('#product-options-gender').on('click', '.gender-label', function(){
			
			var value = $(this).children('input').val();
			var input = $('#product-options-colors .default-color[data-type="'+value+'"]');
			
			// change color
			$('.color-label').addClass('hidden');
			$('.color-input[data-type="'+value+'"]').parent().removeClass('hidden');
			input.trigger('click').trigger('change');
			
			// change size
			if(value == 'F'){
				if($('input[value="2XL"]').is(":checked")) $('input[value="XL"]').trigger('click');
				$('input[value="2XL"]').attr('disabled',true).prop('checked', false).parent().addClass('hidden');
			} else {
				$('input[value="2XL"]').attr('disabled',false).parent().removeClass('hidden');
			}
		});
		
		// image click for popup
		$(".notquickview #product-image").on('click', '.img', function(e){
			$('.product-thumb[data-type="'+$(this).attr('data-type')+'"][data-color="'+$(this).attr('data-color')+'"][data-id="'+$(this).attr('data-id')+'"]').colorbox({open: true});
		});
		
		// out of stock
		Shop.handleOutOfStock($('#product-options .color-input:checked'));
		
		// color change
		$('#product-options-colors .color-input').change(function(){
			
			// constants
			var type = $(this).attr('data-type');
			var color = $(this).attr('data-color');
			var id = $('#product-image .active').attr('data-id');
			
			// label
			$('#current-color').html($(this).attr('data-name'));
			
			// thumbs
			var thumbs = '#product-thumbs .thumb[data-type="'+type+'"][data-color="'+color+'"]';
			var src = $(thumbs+' .src');
			
			// change active thumbs
			$('#product-thumbs .thumb').removeClass('active');
			$(thumbs).addClass('active');
			
			// thumb click
			$('#product-thumbs .thumb[data-type="'+type+'"][data-color="'+color+'"][data-id="'+id+'"]').trigger('click');
			
			// load thumbs
			if(src.length){
				src.each(function(){
					$(this).replaceWith('<img src="'+$(this).attr('data-src')+'">');
				});
			};
			
			// out of stock
			Shop.handleOutOfStock($(this));
			
		});
		
		// zoom color change
		$('#product-zoom-colors .color-label').click(function(){			
			if(!$(this).hasClass('checked')){
				var color_input = $(this).children('.color-input');
				var type = color_input.attr('data-type');
				var color = color_input.attr('data-color');
				var id = $('#product-thumbs .product-thumb[href="'+$(".cboxPhoto").attr('src')+'"]').attr('data-id');
				$('.notquickview #product-image .img[data-type="'+type+'"][data-color="'+color+'"][data-id="'+id+'"]').trigger('click');
			}
		});
		
		// append zoom colors to colorbox
		$('#product-zoom-colors').appendTo('#cboxContent');
	},
	
	handleOutOfStock: function(object){
		
		// oos attr must exist
		var oos = object.attr('data-oos');
		if(oos){
			OOSProducts = oos.split(',');
			
			// clear out of stock
			$('label.outofstock').each(function(){
				$(this).removeClass("outofstock disabled");
				$(this).find('span').removeClass("outofstock");
				$(this).find('input').removeAttr('disabled');
			});
			
			// add out of stock
			for(i in OOSProducts){
				cSize = OOSProducts[i].split('-');
				if (cSize[0] == $('input[name="gender"]:checked').val()) {
					var size_label = $('input[name="size"][value='+cSize[1]+']').parent();
					size_label.removeClass("checked").removeClass("active").addClass("outofstock disabled");
					size_label.children('input').prop('checked', false).attr('disabled','disabled');
					size_label.children('span').removeClass("checked").addClass("outofstock");
				}
			}
		}
		
	},
	
	handleProductOptions: function(){
		$('#product-options .size .label').live('click', function(){
			$this = $(this).parent();
			if(!$this.hasClass('disabled') && !$this.hasClass('active') && !$this.hasClass('outofstock')){
				$('#product-options .size').removeClass('active');
				$this.addClass('active');
				$(this).addClass('foo');
				if(!$('#size_chart_nav a[data-gender="'+$this.attr('data-gender')+'"]').hasClass('active')) {
					// size chart
					$('#size_chart_nav a').removeClass('active');
					$('#size_chart_nav a[data-gender="'+$this.attr('data-gender')+'"]').addClass('active');
					changeSizeChartGender($this);
				}
				if($('#product-image .active').attr('data-type') !== $this.attr('data-type')){
					$('#product-thumbs .thumb[data-type="'+$this.attr('data-type')+'"]:first').trigger('click');
					
				}
					$('#product-image .listing').removeClass('active');
					$('#product-image .listing[data-gender="'+$this.attr('data-gender')+'"]').addClass('active');
			}
		});
	},

    handleFilter: function(){
            $("input.shop-filter").live("click", function(e){
                    // 'SIZE' CHECKBOXES
                    var cur_elem = $(this);
                    var id_string = cur_elem.attr("id");
                    var id_parts = id_string.split("-");
                    var filter_type = id_parts[2];

					var filter_value_arr = id_parts.slice(3);
					var filter_value = filter_value_arr.toString().replace(/,/g,"-");

                    if ($(this).attr("id") == 'shop-filter-size-all' && $(this).is(':checked')) {
                            $('#shop-filter-size-small').prop("checked", false);
                            $('#shop-filter-size-medium').prop("checked", false);
                            $('#shop-filter-size-large').prop("checked", false);
                            $('#shop-filter-size-xlarge').prop("checked", false);
                            $('#shop-filter-size-xxlarge').prop("checked", false);
                    } else if(filter_type == 'size' && $(this).is(':checked')) {
                            $('#shop-filter-size-all').prop("checked", false);
                    }

					var shop_filters = new Object();

					$.each($("input:checked"),function() {
							var cur_elem = $(this);
							var id_string = cur_elem.attr("id");
							var id_parts = id_string.split("-");
							var filter_type = id_parts[2];

							var filter_value_arr = id_parts.slice(3);
							var filter_value = filter_value_arr.toString().replace(/,/g,"-");

							if (!shop_filters[filter_type]) {
									shop_filters[filter_type] = new Array()
							}
							shop_filters[filter_type].push(filter_value);
					});

					var filterURL = "";
					var view_per_page_default = $("#view_per_page_default").val();
					var url_filter_delimiter = '-';
					var url_filter_operator = '-';

					var xparams = new Array();
					var xparams_str = '';
					var normal_filters = false;
					$.each(shop_filters, function(key, value) {
							if (key != 'undefined' && value != 'undefined' && value != 'all' && value.indexOf('all') == -1) {
								switch (key) {
									case 'style':
										xparams['s'] = value;
									break;
									case 'price':
										xparams['pr'] = value;
									break;
									default:
										filterURL=filterURL+value.sort()+url_filter_delimiter;
								}
							}
					});

					if ( $('#shop-filter-search').val() != undefined ) {
						xparams['q'] = $('#shop-filter-search').val();
					}

					if ( $('#shop-filter-artview').val() == 'artwork') {
						xparams['av'] = 'artwork';
					}

					var shop_filter_view = $('#shop-filter-view').val();
					if (shop_filter_view != view_per_page_default && (shop_filter_view > 0 || shop_filter_view == 'all')) {
						xparams['v'] = $('#shop-filter-view').val();
					}

					if (manu.objectSize(xparams) > 0) {
						// var xparams_str = '?'+$.params(xparams);
						xparams_str = '?';
						var i = 1; 
						for (k in xparams) {
							if (i > 1) xparams_str += '&';
							xparams_str += k+'='+xparams[k];
							i++;
						}
					}

					var shop_filter_sortby = $('#shop-filter-sortby').val();
					if (shop_filter_sortby) {
						filterURL = shop_filter_sortby+'-'+filterURL;
					}

					var final_url = '/shop/'+filterURL;
					final_url = final_url.replace(/,/g,"-").toLowerCase();

					if (!final_url.match('hoodies') && !final_url.match("shop/$")) {
						final_url += 't-shirts/';
					}
					final_url += xparams_str;

					window.location = final_url;
			});
	},

	
	handleReprint: function(){
		$("button.stock-status").live("click", function(e){
			e.preventDefault();
		 	var cur_elem = $(this);
			if(cur_elem.hasClass("stock-requested")){
				cur_elem.html('Thanks');
			 	//$("<div>You have already requested for the reprint.</div>").dialog({resizable : false,modal: true});
			 	return false;
		 	}
			var product_id = cur_elem.attr("data-product-id");
		 	var subproduct_id = cur_elem.attr("data-subproduct-id");
		 	Global.getJSONAction('ReprintRequest', {product_id: product_id, subproduct_id: subproduct_id},function(data){
				if(!data.response.is_exist){
					cur_elem.addClass("stock-requested");
					cur_elem.html('Thanks');
				 //$("<div>Reprint Requested.</div>").dialog({resizable : false,modal: true});
				} else {
					cur_elem.addClass("stock-requested");
					cur_elem.html('Thanks');
				}
		 	});
		});
		
		$('section#gender_container dl dt.reprint-button').hover(function(){
			$(this).html("SOLD OUT");
		}, function(){
			$(this).html($(this).attr("data-size"));
		});
	},
	
	handleSocialPopups: function(){
		if($('.fb_share_count_inner').html() == '&nbsp;'){
			$('.fb_share_count_inner').html('0');
		}
		$('#product-social .social_popup').click(function(){
			popName = 'social';
			popURL = $(this).attr('href');
			
			popHeight	= $(this).attr('data-popheight') ? $(this).attr('data-popheight') : 400;
			popWidth	= $(this).attr('data-popwidth') ? $(this).attr('data-popwidth') : 500;
			
			// update count
			if(!$(this).hasClass('reddit')){
				$(this).next().html(parseInt($(this).next().text()) + 1);
			}
			
			var windowFeatures = 'height=' + popHeight + ',width=' + popWidth + ',toolbar=no,scrollbars=yes,status=no,resizable=no,location=no,menuBar=no';
			
			var centeredY,centeredX;
					
			if ($.browser.msie) {
				centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (popHeight/2)));
				centeredX = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (popWidth/2)));
			}else{
				centeredY = window.screenY + (((window.outerHeight/2) - (popHeight/2)));
				centeredX = window.screenX + (((window.outerWidth/2) - (popWidth/2)));
			}
			
			var urlParts = popURL.split('/');
			var urlDomain = urlParts[2].split('.');
			var network = urlDomain[(urlDomain.length-2)];
			
			window.open(popURL, popName, windowFeatures+',left=' + centeredX +',top=' + centeredY).focus();
			
			$("body").css("cursor", "default");
			
			if (location.href.indexOf('shop') > 0) {
				$.ajax((location.href+'/social,'+network).replace('//social','/social'));
			}
			
			return false;
		});
		$('#product-social .social_colorbox').click(function(){
			popHeight	= $(this).attr('data-popheight') ? $(this).attr('data-popheight') : 400;
			popWidth	= $(this).attr('data-popwidth') ? $(this).attr('data-popwidth') : 500;
			
			$(this).colorbox({iframe:true, width:popWidth, height:popHeight});	
		});
	},
	
	handleNotifyMeSuccess: function(data){
		var formMessages = data.messages;
		var error_flag = false;

		for (var i in formMessages) {
			if (formMessages[i]['type'] == 'E') {
				error_flag = true;
			}
		}
		if(data.status == -1) { error_flag = true; }

		if ( error_flag == false ) {
			$('#notify-me-container').delay(1000).fadeOut('slow', function() {
				$(this).remove();
			});
		}
	},
	
	handleSizeChart: function(){
		
		$('.size_chart_toggle').live('click', function(){
			if(!$(this).hasClass('animating')){
				$('.size_chart_toggle').addClass('animating').toggleClass('active');
				$('#size_chart').fadeToggle("fast", "linear", function(){
					$('.size_chart_toggle').removeClass('animating');
				});
			};
		});
		
		$('#size_chart_nav a').live('click', function(){
			if(!$(this).hasClass('animating') && !$(this).hasClass('active')){
				$this = $(this);
				$this.siblings().removeClass('active');
				$this.addClass('active');
				//$('#size_chart_nav a').addClass('animating');
				changeSizeChartGender($this);
			};
		});
		$('#size_chart_mesurements a').live('click', function(){
			
			if(!$(this).hasClass('active')){
			
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				
				$('#size_chart table.active').removeClass('active');
				$('#size_chart table.'+$(this).attr('data-rel')).addClass('active');
			};
		});
		
	},
	
	sotdClock: function(){
		var serverDate = new Date($('#curDate').val());
		var today = new Date();

		var msDiff = serverDate.getTime() - today.getTime(); 
		var next_sotd = ((today.getTime())+(parseInt($('#secondsToNextSOTD').val())*1000));

		var target = new Date(next_sotd+msDiff);

		$('#sotd-countdown').countdown({timestamp: target});
	}
};

function changeSizeChartGender($this){
		
	//$('#size_chart .gender.active').fadeOut('fast', 'linear', function(){
		$('#size_chart .gender').removeClass('active');
		$('#size_chart .gender.'+$this.attr('data-gender')).addClass('active');
		//.css({'display':'none'})
		//.fadeIn('fast', 'linear', function(){
		//	$('#size_chart_nav a').removeClass('animating');
		//});
	//});
	
};

/*==============[/home/tags/dbh-14.25/app/web/js/shop.js] END =============*/







/*==============[/home/tags/dbh-14.25/app/web/js/common.js] START =============*/
/*
 * Common events
 */
var Common = {

	commonJsHandler: function() {
		
		//
		$('body').removeClass('nojs').addClass('js');
		
		if ($.fn.lazyload) {
			// Acitvate Lazy Loader
			$("img.lazy").show().lazyload({ threshold : 600 });
			
			$("img.lazy-child").each(function(){
				
				var lazyChild = $(this);
			
				lazyChild.show().lazyload({
					container: lazyChild.closest(".lazy-parent"),
					effect: "fadeIn"
				});
			});
		}
		
		//
		Common.customInputs();
		
		//
		$('.state_block').hide();
		if($('#recaptcha_holder').length){
			Recaptcha.create("6Ld5IwkAAAAAAM55ClRMNzlAyItw4m_8_lYkqCb9",'recaptcha_holder', {
				 theme: 'red',
				 tabindex: 0,
				 callback: Recaptcha.focus_response_field
			 });
		}
		
		//
		$('.close-dialog').live('click', function(){
			manu.closeDialog();
		});
	
		// Hide States field upon selecting country other than US
		$('select[name=country]').change(function(){
			if( $(this).val()!= 'US'){
				$('.state_block').hide();
			}else{
				$('.state_block').show();
			}
		});
	
		// submit design
		$('#submit_artwork').live('click', function(){
			 // restricting user from submitting duplicates
			 if (elemClicked == 1) { return false; }
			 elemClicked = 1;
	
			 $(this).closest("form").submit();
			 return;
		});
		
		// tabs
		$('.tabs').on('click', 'a.tab-nav', function(){
			// tab nav remove
			$(this).siblings('a.tab-nav').removeClass('tab-nav-active');
			// tab nav add
			$(this).addClass('tab-nav-active');
			// tab remove
			$(this).siblings('.tab').removeClass('tab-active');
			// tab add
			$(this).siblings('' + $(this).attr('data-href') + '').addClass('tab-active');
		});
		
		//Authenticator class,by clicking which will show the login pop up.
		$('.auth').live("click", DBH.authHandler);
		
		$('.disable_button').live("click", function(event){
				event.stopImmediatePropagation();
				return false;
		});
		
		$('.resource_code').click(function(){
			$(this).colorbox({html:$(this).next().clone()});
		});
		
		$('.inline-popup').each(function(){
			$(this).colorbox({inline:true});
		});
		
		colorboxHandler();
		cboxPrefix = 'cbox';
		cboxThemes = ['Dark','Light','Invert'];
		cboxThemesAll = cboxPrefix+cboxThemes.join(' '+cboxPrefix);
		function colorboxHandler(){
			$('.colorbox').each(function(e){
				$(this).colorbox({
					href: $(this).attr('href')+'?ajax=true',
					onLoad:function(){
						$('#colorbox').removeClass(cboxThemesAll);
					},
					onComplete: function() {
						if($.inArray($.colorbox.element().attr("data-cboxTheme"), cboxThemes) > -1){
							$('#colorbox').addClass(cboxPrefix+$.colorbox.element().attr("data-cboxTheme"));
						}
						if(typeof(Shop) != 'undefined'){
							Shop.handleProductDetailThumb();
						}
						if(typeof(dtg) != 'undefined'){
							dtg.profile.chart.shop();
							dtg.profile.chart.product();
							dtg.profile.addTee();
						}
						$.colorbox.resize();
						colorboxHandler();
					},
				innerWidth:($(this).attr('data-cboxWidth') ? $(this).attr('data-cboxWidth') : false), 
					rel:$(this).attr('data-rel'),
					scalePhotos:false,
					maxHeight:false
				});
			});
		}
		
		$('.colorbox-iframe').each(function(){
			$(this).colorbox({
				iframe:true, 
				innerWidth:($(this).attr('data-cboxWidth') ? $(this).attr('data-cboxWidth') : 425), 
				innerHeight:($(this).attr('data-cboxHeight') ? $(this).attr('data-cboxHeight') : 344), 
				rel:$(this).attr('data-rel'), 
				scrolling: true
			});
		});
		
		/*
		$('.listings .listing').live('mouseenter', function(){
			artObj = $(this).find('span[data-class="art"]');
			artSrc = artObj.attr('data-src');
			artAlt = artObj.attr('data-alt');
			artWidth = artObj.attr('data-width');
			artHeight = artObj.attr('data-height');
			if(artObj.length){
				$('<img>')
				.attr({'src':artSrc + '&i=' + new Date().getTime(), 'alt':artAlt, 'width':artWidth, 'height': artHeight})
				.addClass('art')
				.load(function(){
					img = $(this);
					imgSrc = img.attr('src');
					$('span[data-src="'+imgSrc.split('&')[0]+'"]').replaceWith(img);
					setTimeout(function(){
						img.addClass('active');
					}, 100);
				});
			} else {
				imgObj = $(this).find('.art');
				imgObj.addClass('active');
			}
		});
		*/
		
		// Check for session messages
		var msg_wrapper_selector = '#session_messages';
		if ($(msg_wrapper_selector).length) {
			if ($('article div.title-bar').length) {
				$('article').eq(0).prepend($('#session_messages'));
			} else if ($('div.title-bar').length) {
				// $('div.title-bar').eq(0).append($('#session_messages'));
				$('#session_messages').insertAfter('div.title-bar:eq(0)');
			} else if($('article').length) {
				$('article').eq(0).prepend($('#session_messages'));
			} else {
				$('#session_messages').insertAfter('#content h1:eq(0):parent');
			}
			$('#session_messages').children('span').css('padding-top','5px');
			$('#session_messages span').css('display','block').show();
		}
		
		// load customer service
		$('.customer-service-trigger').click(function(e){
			e.preventDefault();
			manu.getAction('CustomerService', {curraction: $("body").attr("data-class")}, function(data) {
				manu.closeDialog();
				$("#customer-service-placeholder").replaceWith(data);
				manu.dialog($("#customer-service"), {width: 602, resizable: false, modal: true, draggable: false});
				$('.ui-dialog-title').remove();
			});
		});
	},
	
	ourStory: function() {
		$('#our-story').on('change', 'input[name=page]', function(){
			$('#our-story .section').removeClass('active');
			$(this).next('.section').addClass('active');
		}).on('click', 'label[for]', function(){
			$('input[id="'+$(this).attr('for')+'"]').trigger('change');
		});
	},
	
	colorboxResize: function() {
		setTimeout( function() {$.colorbox.resize()}, 100);
	},
	
	customInputs: function(){
		
		//
		//
		// start 
		// add checked classes for :checked inputs
		//
		// radio on load
		$('input[type=radio]:checked').each(function(){
			$(this).closest('form').find('input[name='+this.name+']').each(function(){
				// remove class from input
				$(this).removeClass('checked');
				// remove class from label
				$('label[for="'+this.id+'"]').removeClass('checked');
			});
			// add class to input
			$(this).addClass('checked');
			// add class to label
			$('label[for="'+this.id+'"]').addClass('checked');
			
		});
		// radio on change
		$('input[type=radio]').live('change', function(){
			if (!$(this).closest('label').hasClass('outofstock')) {
				$(this).closest('form').find('input[name='+this.name+']').each(function(){
					// remove class from input
					$(this).removeClass('checked');
					// remove class from label
					$('label[for="'+this.id+'"]').removeClass('checked');
				});
				// add class to input
				$(this).addClass('checked');
				// add class to label
				$('label[for="'+this.id+'"]').addClass('checked');
				// remove class to whatever is the parent
				$('input[name='+this.name+']').parent().removeClass('checked');
				// add class to whatever is the parent
				$(this).parent().toggleClass('checked', $(this).is(':checked'));
				
				// unfocus to hide outline
				setTimeout(function(){
					$('input[type=radio]').blur();
				},50);
			}
		});
		// checkbox on load
		$('input[type=checkbox]:checked').each(function(){
			$('label[for="'+this.id+'"]').addClass('checked');
		});
		// checkbox on change
		$('input[type=checkbox]').live('change', function(){
			$('label[for="'+this.id+'"]').toggleClass('checked');
			$(this).toggleClass('checked',$(this).is(':checked'));
			$(this).parent().toggleClass('checked',$(this).is(':checked'));
			$(this).closest('form').toggleClass('hover',$(this).is(':checked'));
			
			// unfocus to hide outline
			//setTimeout(function(){
			//	$('input[type=checkbox]').blur();
			//},50);
		});
		
		// image labels, just in case
		//$('label img').live('click', function(){
			//$(this).closest('label').trigger('click');
			//$('input[id='+$(this).closest('label').attr('for')+']').trigger('change');
		//});
		
		// common search input
		$('#common_search-input').focusin(function() {
			if(!$('#common_search-toggle').is(':checked')) {
				$('.common_search-toggle').trigger('click');
				$('#common_search-toggle').attr('checked', true);
			}
		});
	},
	
	dbhSlider: function(){
		
		// click
		// silly body event listener workaraound because slide is sometimes injected
		$('body').on('click', '.dbh-slider-b', function(){
		// $('.dbh-slider-b').on('click', function(){
			// scroller
			var s = $(this).parent().find('.dbh-slider-parent');
			// if is not moving
			if(!s.hasClass('animating')){
				// slide width
				var slide_w = s.width();
				// is moving
				s.addClass('animating');
				// prev / next
				var x = $(this).hasClass('next') ? slide_w : -slide_w;
				// destination
				to = s.scrollLeft() + x;
				var child_w = s.children().size() * s.children().outerWidth();
				// if end of list (jump to begining)
				if(to >= child_w) to = 0;
				// if start of list (jump to end)
				if(to == -slide_w) to = child_w;
				// animate
				s.animate({scrollLeft : to}, '1000', 'easeInOutQuad', function(){
					// no longer moving
					s.removeClass('animating');
				});
			};
		});
		
		// autoscroll (only one per page)
		$(window).load(function(){
			$('.dbh-slider-autoscroll').each(function(){
				dbhSliderAutoscroll($(this));
			});
			// pause on hover
			//$('.dbh-slider-autoscroll').mouseenter(function(){
			//	clearTimeout(autoscroll);
			//}).mouseleave(function(){
			//	dbhSliderAutoscroll($(this));
			//});
		});
		function dbhSliderAutoscroll(obj){
			autoscroll = setTimeout(function(){
				obj.children('.next').trigger('click');
				dbhSliderAutoscroll(obj);
			}, 10000);
		}
	},
	
	jsPing: function(data) {
		manu.log('Common.jsPing()');
		Global.getJSONAction("JsPing", {}, function(data) {});
		setTimeout(function(){  //pass it an anonymous function that calls foo
			Common.jsPing();
    	},(5*60*1000));
	},	

	handleSelectedProduct: function(data) {
		location.href = data.id;
	},	

	handleRedirectEvents: function(data) {

		is_user_verified = data.response.is_user_verified;
		// Checks whether the user is un verified
		if (is_user_verified === 0) {
			manu.getAction("CheckUserVerificationStatus", {}, function(data){
			$(".show_verification_msg").replaceWith(data);
			});
		}
	
		is_wholesaler = data.response.is_wholesaler;
		if (is_wholesaler == 1) {
			window.location.reload();
			return;
		}
	
		manu.closeDialog();
		if($(".register").length > 0) {
			location.href = MAIN_URL + "home";
			return;
		}
										
		// Look up previous payment methods and allow users to save new payment methods
		manu.getAction('CIMPreviousPayments', {}, function(data) {
			$("ul#payment-card-details").prepend(data);
			$("ul#payment-card-details li.checkrow2").show();
		});
	
		// Refreshing The Header
		manu.getAction('ShowTopNavigations', {curraction: $("body").attr("data-class")}, function(data) {
			$("#header").html(data);
		});

		// Show the comments field, hide the login link
		if ($("body").attr("data-class") == "forum-detail") {
			$("#forum_comment_loggedin").show();
			$("#forum_comment_login").hide();
		}
	
		gIsLogged = true;
	
		var email = $('input[name="user_email"]').val(data.response.user_email);
		$('#notify-if-printed .notify-input').addClass('loggedin');
		$('#notify-if-printed .submit').remove();
	
		//If the user is logged in, perform the desired action.
		if(DBH.authElementClicked !== null) {
			if(DBH.authElementClicked.tagName != "BUTTON"){
				if(!DBH.authElementClicked.href.match(/javascript|#/) && !DBH.authElementClicked.is("button")){
					window.location.href = DBH.authElementClicked.href;
					return;
				}
			}
			$(DBH.authElementClicked).click();
		}
		if ( (location.pathname == "/checkout/start" || location.pathname == "/checkout/register") && data.request._submit == "register_form" && data.response.success == true) {
			window.location = MAIN_URL + "checkout/";
		// } else if (location.pathname.match("/checkout/success") && data.request._submit == "register_form") {
		// 	window.location = MAIN_URL + "home";
		}
	
		if (location.pathname == "/checkout/login" && data.request._submit == "login_form" && data.response.success == true) {
			window.location = MAIN_URL + "checkout/";
		}

	},
	
	submitSpecialPickVote: function() {
		$('.icon.like, .icon.dislike').live("click", function(){
			
			var cur_obj = $(this);			
			var product_id = cur_obj.attr("data-id");
			var picker_id = $('#picks').attr("data-id");
			var vote_status = cur_obj.hasClass('dislike') ? 'dislike' : 'like';
			
			Global.getJSONAction("SpecialPickQuickVote",{product_id: product_id, vote_status: vote_status, picker_id: picker_id}, function(data){
				if(data.response.is_success){
					// Update stats
					$('#like_count_'+product_id).html(data.response.vote.likes);
					$('#fill_'+product_id).css('width', data.response.vote.ratio+'%');

					// Update icons
					cur_obj.addClass('active').siblings().removeClass('active');
				} 
				
			});
			
			return false;
		});
	},
	
	twitterContestTweet: function() {
		$('#twitter-contest-txt').on('keyup', function(){
			$('#twitter-contest-btn').attr({'href':'https://twitter.com/intent/tweet?text=' + encodeURIComponent( $(this).attr('data-tweet') + ' ' + $(this).val() + ' #IAMHuman http://bit.ly/12DwJwZ' ) });
		});
	}

};


/*
 * Handles the functions associated with LOGIN
 */
var elemClicked = 0;
//$('a#poplogin').click(function() {
//	manu.form.clearFormMessages($("#login_cont").find("form").attr("id"));
//	if($(this).attr('data-attr') == 'inline') {
//		//$("#login").clearForm();
//		manu.dialog($("#login_cont"), {width: 692, resizable: false, modal: true, draggable: false});
//		$("#ui-dialog-title-login_cont").remove();
//		return false;
//	}
//});
var Login = {

	/* handle all kind of login events */
	handleLoginPopupEvents : function() {
		/* show login overlay window */
		$('a#poplogin, #button-poplogin, #d3login').click(function() {
			manu.form.clearFormMessages($("#login_cont").find("form").attr("id"));
			if($(this).attr('data-attr') == 'inline') {
				//$("#login").clearForm();
				manu.closeDialog();
				manu.dialog($("#login_cont"), {width: 662, resizable: false, modal: true, draggable: false});
				$("#ui-dialog-title-login_cont").remove();
				return false;
			}
		});
//		$('a#poplogin').trigger('click');
		// function updateButton(response) {
		button = $('.fb-auth, #fb-auth, #fb-register');
		$(button).unbind("click").click(function() {
	    	if(typeof(FB) == 'undefined') return;

	    	// Authenticate with Facebook
			FB.login(function(response) {
				if (response.authResponse) {
					FB.api('/me', function(info) {
						if (!info.error) {
							var user_info = new Object();
							user_info.id = info.id;
							user_info.name = info.name;
							user_info.email = info.email;
							user_info.gender = info.gender;

							gv_hash = $('input[name$="gv_hash"]').val();

							Global.getJSONAction("RegisterSocial", {network: 'facebook', user_info: user_info, gv_hash: gv_hash}, function(data) {
								if (data.response.success) {
									manu.getAction('ShowTopNavigations', {curraction: $("body").attr("data-class")}, function(data) {
									gIsLogged = true;
			    						manu.closeDialog();
									$("#header").html(data);
									  
									  // Look up previous payment methods and allow users to save new payment methods
									  manu.getAction('CIMPreviousPayments', {}, function(data) {
										 $("ul#payment-card-details").prepend(data);
										 $("ul#payment-card-details li.checkrow2").show();
									  });
								    });
									if ( location.pathname.match("/checkout/login") ) {
									  location.href = MAIN_URL + "checkout/";
									} else if ( location.pathname.match("/redeem-gift-voucher") ) {
									  location.href = MAIN_URL + "shop";
									} else if ( location.pathname.match("/checkout/start") ) {
									  location.href = MAIN_URL + "checkout/";
									} else if ( location.pathname.match("/login") ) {
									  location.href = MAIN_URL + "account";
									}
								} else {
									if (data.response.formError) {
console.log(data.response.formError);
										$('#'+data.response.formError).html('<span class="error">'+data.response.login_status+'</span>');
									} else {
										alert ("Something went wrong: "+data.response.login_status);
									}
								}
							});
						}
					});
				}
			},
			{scope:'email'});
		});
		
		//	}
			// run once with current status and whenever the status changes
		//	FB.getLoginStatus(updateButton);
		//	FB.Event.subscribe('auth.statusChange', updateButton);
		//	updateButton();
	},
	
	// login success handler
	redirectPage: function(data){
		if(data.response.success) {
			Common.handleRedirectEvents(data);
		}
	},
	
	// login error handler
	errorHandler: function(data) {
		if(data.response.is_user_verified) {
			Login.redirectPage(data);
		}
	},

	// login success handler
	redeemSuccess: function(data){
		if(data.response.success) {
			window.location = MAIN_URL + "shop/";
		}
	},

	// login success handler
	redeemFail: function(data){
	//
	},

	loginFocus: function(){
		
		$(window).load(function () {
			
			absolute_labels('.labeled-inputs');
			absolute_labels('#login_form');
			absolute_labels('#checkout-preview-page #register_form');
			
		});
			
			function absolute_labels(form_object){
				$(form_object+' .input').each(function(){
					if(this.value == ''){
						$(this).prev().show();
					}
				}).bind("focusout", function(){
					if(this.value == ''){
						$(this).prev().show();	
					} else {
						$(this).prev().hide();
					}
				}).focus(function(){
					$(this).prev().hide();
				});
				
				$(form_object+' .username').keyup(function(){
					if($(form_object+' .pwd').val() == ''){
						$(form_object+' .pwd').prev().show();	
					} else {
						$(form_object+' .pwd').prev().hide();
					}
				});
				
				$(form_object+' .label').click(function(){
				$(this).hide().next().focus();
				});
			};
	}
};

/*
 * Handles the function associated with register
 */
var Register = {

	// Shows the overlay register
	showRegisterOverlayWindow : function() {
		/* Showing the overlay of Register form */
		$('a#popregister, #dbh-welcome-popregister, #button-popregister').click(function() {
			manu.form.clearFormMessages($("#register_cont").find("form").attr("id"));
			if ($(this).attr('data-attr') == 'inline') {
				manu.closeDialog();
				manu.dialog($("#register_cont"), {width : 662, resizable: false, modal: true, draggable: false});
				$("#ui-dialog-title-register_cont").remove();
				return false;
			}
		});
	},

  // handling the user name change functionality for registration.
  handleUsernameChange : function() {
    var user_name = $.trim($(this).val()).length;
    
    var regex = '/[^\d\w]/i';

    if ($(this).val().match(regex)) {
      $('#user_avail').html("<font color='red'>Not available</font>");
    }
    else if (user_name > 0 && user_name < 4) {
      $('#user_avail').html("<font color='red'>Too short</font>");
      return;
    } else if (user_name > 15) {
      $('#user_avail').html("<font color='red'>Too long</font>");
      return;
    } else if (user_name >= 3 && user_name <= 15) {
      Register.checkAvailability($(this).val());
      return;
    } else {
      $('#user_avail').html("");
    }
  },

  // handling the password change functionality for registration.
  handlePasswordChange: function() {
    var pass = $.trim($(this).val()).length;
    if (pass > 0 && pass < 6) {
      $('#pass_avail').html("<font color='red'>Too short</font>");
    } else if (pass >= 6 && pass <= 20) {
      Register.checkStrength();
    } else {
      $('#pass_avail').html(" ");
    }
  },

  // Checks the maching of both the password and confirm password fields
  checkNormalRegisterPasswords : function() {
    $("#conf_pwd").live("blur", function() {
      var password = $.trim($("#pwd_register").val());
      var re_pass = $.trim($("#conf_pwd").val());
      if (re_pass && (password != re_pass)) {
        $("#password_mismatch").html("<font color='red'>Passwords do not match</font>");
        $("#password_mismatch").show();
      } else if (!re_pass || (re_pass && (password == re_pass))) {
        $("#password_mismatch").text("");
      }
    });
  },

  // register success handler
  redirectPage: function(data){
	// Funky redirect hack
	if (
		location.pathname.match("/checkout/success") && 
		(data.request.page == "home" || (data.request._submit == "register_form" && data.response.success == true))
	) {
        location.href = MAIN_URL + "account";
        return;
    } else if(data.response.success) {
      Common.handleRedirectEvents(data);
	}
  },

 // register error handler
  errorHandler: function(data) {
    if(data.response.register) {
      
      Register.redirectPage(data);
    }
  },

  // Checks the availability of the user name
  checkAvailability : function(username) {
      Global.getJSONAction('CheckUserAvailability', {username : username}, function(data) {
        $('#user_avail').html(data.response.msg);
        $('#user_avail').show();
      });
  },


  // Checks the strength of the password
  checkStrength : function() {
    $('#pass_avail').html(Register.passwordStrength($(this).val(), $("input[name='user_name']").val()));
  },



  // Calculating the strength of the password
  passwordStrength : function(password, username) {
  if(!password) return;
    
    var defaultstr = "Strength:";
    var badPass = defaultstr + " <span class='red'>Bad</span>";
    var goodPass = defaultstr + " <span class='green'>Good</span>";
    var strongPass = defaultstr + " <span class='green'>Strong</span>";

    var score = 0;

    // password == username
    if (password.toLowerCase() == username.toLowerCase())
      return badPass;

    // password length
    score += password.length * 6;
    score += (Register.checkRepetition(1, password).length - password.length) * 1;
    score += (Register.checkRepetition(2, password).length - password.length) * 1;
    score += (Register.checkRepetition(3, password).length - password.length) * 1;
    score += (Register.checkRepetition(4, password).length - password.length) * 1;

    // password has 3 numbers
    if (password.match(/(.*[0-9].*[0-9].*[0-9])/))
      score += 5;

    // password has 2 sybols
    if (password.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/))
      score += 5;

    // password has Upper and Lower chars
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))
      score += 10;

    // password has number and chars
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
      score += 15;

    // password has number and symbol
    if (password.match(/([!,@,#,$,%,\^,&,*,?,_,~])/) && password.match(/([0-9])/))
      score += 15;

    // password has char and symbol
    if (password.match(/([!,@,#,$,%,\^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/))
      score += 15;

    // password is just a nubers or chars
    if (password.match(/^\w+$/) || password.match(/^\d+$/))
      score -= 10;

    // verifing 0 < score < 100
    if (score < 0)
      score = 0;
    if (score > 100)
      score = 100;

    if (score < 34)
      return badPass;

    if (score < 68)
      return goodPass;

    return strongPass;
  },

  // Checks the repetition
  checkRepetition : function(pLen, str) {
    var res = "";
    for (var i = 0; i < str.length; i++) {
     var repeated = true;
      for (var j = 0; j < pLen && (j + i + pLen) < str.length; j++)
        repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen));
      if (j < pLen)
        repeated = false;
      if (repeated) {
        i += pLen - 1;
        repeated = false;
      } else {
        res += str.charAt(i);
      }
    }
    return res;
  },

  handleChangeUsername : function() {
//
  },

  changeUsernameSuccessHandler : function() {
    // Swap out comment form
	var URL = window.location.pathname+'?userUpdated#add_post';
	var regex = '/^([\/]+)/g';
	URL = URL.replace(regex,'');
    window.location = MAIN_URL + URL;
  },

  changeUsernameErrorHandler : function() {
//
  }

};

//Handles search related functions
var Search = {
  handleSearchResult: function(item) {
    $('div.header').children().removeClass('active');
    manu.loadAction("#forums_details",'ForumByCategory',{topic_id:item._value},function(){
    });
  }
};

//Handles Free Shipping functions
var FreeShipping = {
  handleFreeShippingLabel: function(item) {
  
  
  $('#free_shipping_label-heading').mouseenter(function(){
  	$('#free_shipping_label').stop().animate({height:'51px'}, 250, function(){});	
  }).mouseleave(function(){
  	$('#free_shipping_label').stop().animate({height:'30px'}, 250, function(){});	
  });
  
   
  }
};


var ProductCategorize = {

  // Shows the overlay register
  successHandler : function() {
	$("#categorize_form").append('<span class="m-alert" display:block;"><span class="success">Product updated</span></span>');
  },

  errorHandler : function() {
	$("#categorize_form").append('<span class="m-alert" display:block;"><span class="error">Update failed</span></span>');
  }
};

/*==============[/home/tags/dbh-14.25/app/web/js/common.js] END =============*/
jQuery(function() {
var handlers = {"Common.jsPing":{"name":"Common.jsPing","params":[],"alwaysExec":false},"FreeShipping.handleFreeShippingLabel":{"name":"FreeShipping.handleFreeShippingLabel","params":[],"alwaysExec":false},"Common.commonJsHandler":{"name":"Common.commonJsHandler","params":[],"alwaysExec":false},"Common.dbhSlider":{"name":"Common.dbhSlider","params":[],"alwaysExec":false},"Login.handleLoginPopupEvents":{"name":"Login.handleLoginPopupEvents","params":[],"alwaysExec":false},"Login.loginFocus":{"name":"Login.loginFocus","params":[],"alwaysExec":false},"Register.showRegisterOverlayWindow":{"name":"Register.showRegisterOverlayWindow","params":[],"alwaysExec":false},"Slideshow.Home.init":{"name":"Slideshow.Home.init","params":[],"alwaysExec":false}};manu.executeJsHandlers(handlers);var handlers = {"manu.form.handleFormEvents--583772a46d19e92a3a8e9df858b32ab5":{"name":"manu.form.handleFormEvents","params":["login_form"],"alwaysExec":true}};manu.executeJsHandlers(handlers);gValidateRules1["f_login_form"] = {"username":{"rules":[{"name":"required","args":{"label":"Username"},"msg":"Username is required"}]},"pwd":{"rules":[{"name":"required","args":{"label":"Password"},"msg":"Password is required"}]},"submit":[],"rememberme":[],"redirect":[]};var handlers = {"manu.form.handleFormEvents--c3caa886aa0dc6789c2c7c89aa08ac94":{"name":"manu.form.handleFormEvents","params":["register_form"],"alwaysExec":true}};manu.executeJsHandlers(handlers);gValidateRules1["f_register_form"] = {"user_name":{"rules":[{"name":"required","args":{"label":"Username"},"msg":"Username is required"},{"name":"alphanumeric","args":[],"msg":"Username must only contain letters and numbers."},{"name":"minLength","args":[4],"msg":"Username must be at least 4 characters long."},{"name":"maxLength","args":[40],"msg":"Username must not exceed 40 characters."}]},"pwd_register":{"rules":[{"name":"required","args":{"label":"Password"},"msg":"Password is required"},{"name":"minLength","args":[4],"msg":"Password must be non-empty, at least 4 characters."}]},"conf_pwd":{"rules":[{"name":"required","args":{"label":"Confirm Password"},"msg":"Confirm Password is required"},{"name":"matchOther","args":["pwd_register"],"msg":"Confirm Password must match Password."}]},"email":{"rules":[{"name":"required","args":{"label":"Email Address"},"msg":"Email Address is required"},{"name":"email","args":[],"msg":"Email Address must be valid."}]},"conf_email":{"rules":[{"name":"required","args":{"label":"Confirm Email"},"msg":"Confirm Email is required"},{"name":"email","args":[],"msg":"Confirm Email must be valid."},{"name":"matchOther","args":["email"],"msg":"Confirm Email must match Email Address."}]},"countrylist":{"rules":[{"name":"required","args":{"label":"Country"},"msg":"Country is required"}]},"promos":[],"terms":{"rules":[{"name":"required","args":{"label":"Agree to the terms and conditions."},"msg":"You need agree to the terms and conditions before continuing."}]},"_submit":[],"submit":[]};var handlers = {"manu.form.handleFormEvents--732f83b1a626ac9a007fa76146e7fc9f":{"name":"manu.form.handleFormEvents","params":["join-news-letter-form"],"alwaysExec":true}};manu.executeJsHandlers(handlers);gValidateRules1["f_join-news-letter-form"] = {"news_letter_email":{"rules":[{"name":"email","args":[],"msg":"News letter email must be valid."}]},"submit":[]};
});
FW_DEBUG = false;
URL_PREFIX_AJAX = "/a/";
URL_PREFIX_IMAGE = "http://sc.chinaz.com/";
MAIN_URL = "http://sc.chinaz.com/";
URL_PREFIX_ADMIN_CMS = "";
ENVIRONMENT = "prd";
gIsLogged = 0;
user = "";
is_user_verified = 0;
post_edit_time = '180';
gStaticMessages = [];
gStaticMessages['cart_empty'] = "Your Cart is empty. You need to fill your cart before proceeding.";
gStaticMessages['postal_code_required'] = "Enter a valid postal code.";
gStaticMessages['user_dont_have_privileges'] = "You don't have any privilege to access this page.";
gStaticMessages['payment_methods_delete'] = "Are you sure you want to delete this payment method?";