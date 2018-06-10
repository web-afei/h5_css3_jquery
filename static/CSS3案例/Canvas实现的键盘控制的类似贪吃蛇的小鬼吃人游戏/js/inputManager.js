/* 代码整理：网页设计之家 www.mysite.com */
// Constructor
play.InputManager = function() {
	this.KEY = {
		'LEFT': 37, 'UP': 38, 'RIGHT': 39, 'DOWN': 40, 'SPACE': 32,
		'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'ESC': 27,
		'0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55,
		'8': 56, '9': 57, 'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70,
		'G': 71, 'H': 72, 'I': 73, 'J': 74,	'K': 75, 'L': 76, 'M': 77, 'N': 78,
		'O': 79, 'P': 80, 'Q': 81, 'R': 82, 'S': 83, 'T': 84, 'U': 85, 'V': 86,
		'W': 87, 'X': 88, 'Y': 89, 'Z': 90
	};
	this.lastKey = '';
	this.pressedKeys = [];
	this.click = {};
	this.touched = false;
	this.statusUpdated = false;
	this.target = null;
	this.event = null;
}

// Reset all inputs
play.InputManager.prototype.reset = function() {
	this.click = {};
	this.lastKey = '';
	this.pressedKeys = [];
	this.statusUpdated = false;
	this.target = null;
}

// Enable the keyboard
play.InputManager.prototype.enableKeyEvent = function(obj) {
	var self = this;
	obj.addEventListener('keydown',function(event) { self.onKeyDown(event); },false);
	obj.addEventListener('keyup',function(event) { self.onKeyUp(event); },false);
}

// Enable the mouse
play.InputManager.prototype.enableMouseEvent = function(obj) {
	var self = this;
	obj.addEventListener('mousedown',function(event) { self.onTouchStart(event,obj); },false);
	obj.addEventListener('mousemove',function(event) { self.onTouchMove(event,obj); },false);
	document.addEventListener('mouseup',function(event) { self.onTouchEnd(event,obj); },false);
}

// Enable the touch screen
play.InputManager.prototype.enableTouchEvent = function(obj) {
	var self = this;
	obj.addEventListener('touchstart',function(event) { self.onTouchStart(event,obj); },false);
	obj.addEventListener('touchmove',function(event) { self.onTouchMove(event,obj); },false);
	document.addEventListener('touchend',function(event) { self.onTouchEnd(event,obj); },false);
}

// Event handler for keydown
play.InputManager.prototype.onKeyDown = function(event) {
	var key = window.event ? window.event.keyCode : event.which;
	this.click = {};
	if (!this.pressedKeys[key]) {
		this.lastKey = key;
		this.pressedKeys[key] = true;
		this.statusUpdated = true;
		this.target = event.target;
		this.event = event.type;
	}
}

// Event handler for keyup
play.InputManager.prototype.onKeyUp = function(event) {
	var key = window.event ? window.event.keyCode : event.which;
	this.pressedKeys[key] = false;
	this.statusUpdated = true;
	this.target = event.target;
	this.event = event.type;
}

// Event handler for mousedown & touchstart
play.InputManager.prototype.onTouchStart = function(event,obj) {
	this.preventDefault(event);
	this.touched = true;
	this.getPosition(event,obj);
	this.statusUpdated = true;
	this.target = event.target;
	this.event = event.type;
}

// Event handler for mousemove & touchmove
play.InputManager.prototype.onTouchMove = function(event,obj) {
	this.preventDefault(event);
	this.getPosition(event,obj);
	this.statusUpdated = true;
	this.target = event.target;
	this.event = event.type;
}

// Event handler for mouseup & touchend
play.InputManager.prototype.onTouchEnd = function(event,obj) {
	this.touched = false;
	this.statusUpdated = true;
	this.target = event.target;
	this.event = event.type;
}

// Prevent default actions
play.InputManager.prototype.preventDefault = function(event) {
	if (event.preventDefault) event.preventDefault();
	if (event.stopPropagation) event.stopPropagation();
	return false;
}

// Get position of the event
play.InputManager.prototype.getPosition = function(event,obj) {
	var touch, touches,
		rect = obj.getBoundingClientRect();
	
	if ('ontouchstart' in window) {
		touches = event.changedTouches;
		if (touches && touches.length > 0) {
			touch = event.changedTouches[0];
			this.click = { x: touch.pageX - rect.left, y: touch.pageY - rect.top };
		}
	} else  {
		this.click = { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}
}/* 代码整理：网页设计之家 www.mysite.com */