/*
	playJS Game Engine v0.2
	Copyright (c) 2012-2013, David López

	playJS is licensed under the MIT License.
	http://www.opensource.org/licenses/mit-license.php
*//* 代码整理：网页设计之家 www.mysite.com */

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame || 
			function(callback, element) {
				return window.setTimeout(callback, 1000 / 60);
			};
})();

// Start the app
var play = play || {},
	game = null;

window.onload = function() {
	game = new play.Game();
};

window.onresize = function() {
	if (game !== undefined)
		game.resize();
};

play.Game = function() {
	// Game constants
	this.GAME_STATE_TITLE = 0;
	this.GAME_STATE_NEW_GAME = 1;
	this.GAME_STATE_PLAY_GAME = 2;
	this.GAME_STATE_GAME_PAUSED = 3;
	this.GAME_STATE_GAME_OVER = 4;
	this.GAME_STATE_HELP = 5;
	this.GAME_STATE_OPTIONS = 6;

	// Game properties
	this.container = document.getElementById('container');
	this.width = 720;
	this.height = 480;
	this.layers = {};
	this.entities = {};
	this.currentState = 0;
	this.currentStateFunction = null;
	this.assetManager = new play.AssetManager();
	this.inputManager = new play.InputManager();
	this.timer = new play.Timer(this.fps);
	this.time = 0;
	this.fps = 60;
	this.carrots = 0;

	// Initialize the game
	this.init();
}

play.Game.prototype.init = function() {
	if (!this.canvasSupport()) return;
	if (!this.container) { throw Error('Container does not exists.'); }
	console.log('Init game');

	var self = this,
		z = 0;

	// Set the canvas dimensions
	this.setDimensions(this.width,this.height);

	// Init the background canvas
	this.layers['bgCanvas'] = new play.Layer(this.container,'bgCanvas',this.width,this.height,z++);
	// Init the main canvas
	this.layers['mainCanvas'] = new play.Layer(this.container,'mainCanvas',this.width,this.height,z++);
	// Init the info layer
	this.layers['infoCanvas'] = new play.Layer(this.container,'infoCanvas',this.width,this.height,z++);

	// Add event handlers
	this.inputManager.enableKeyEvent(document);
	this.inputManager.enableMouseEvent(this.container);
	this.inputManager.enableTouchEvent(this.container);

	// Define assets
	this.assetManager.addAsset('font','http://fonts.googleapis.com/css?family=Press+Start+2P');
	this.assetManager.addAsset('background','images/bg.png');
	this.assetManager.addAsset('carrot','images/carrot.png');
	this.assetManager.addAsset('hero','images/hero.png');
	this.assetManager.addAsset('monster','images/monster.png');
	this.assetManager.addAsset('restart','images/restart.png');
	this.assetManager.addAsset('pause','images/pause.png');
	this.assetManager.addAsset('help','images/help.png');
	this.assetManager.addAsset('gamehelp','images/gamehelp.png');
	
	// Load all game assets before the games starts
	this.assetManager.loadAssets(function() {
		self.switchGameState(self.currentState);
		self.loop();
	});
}

// Check if the browser supports the canvas
play.Game.prototype.canvasSupport = function() {
	return !!document.createElement('canvas').getContext;
}

// Set the dimensions of the game
play.Game.prototype.setDimensions = function(w,h) {
	if (w == window.innerWidth && h == window.innerHeight) {
		this.container.className = 'fullscreen';	
		this.width = w;
		this.height = h;
	} else {
		this.container.className = 'custom';
		this.container.style.width = w + 'px'; 
		this.container.style.height = h + 'px';
		this.container.style.marginTop = -h/2 + 'px';
		this.container.style.marginLeft = -w/2 + 'px'; 
	}	
}

// Main game loop
play.Game.prototype.loop = function() {
	var that = this;
	this.checkInput();
	this.time = this.timer.tick();
	this.currentStateFunction();
	requestAnimFrame(function () { that.loop(); } );
}

// Check if there's any user interaction
play.Game.prototype.checkInput = function() {
	var KEY = this.inputManager.KEY,
		pressedKeys = this.inputManager.pressedKeys,
		touched = this.inputManager.touched,
		click = this.inputManager.click,
		event = this.inputManager.event;

	if (!this.inputManager.statusUpdated) return;

	// Check keyboard
	if (pressedKeys[KEY.SPACE]) {
		// If space pressed, go to another game state 
		switch(this.currentState) {
			case this.GAME_STATE_TITLE:
				this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
			case this.GAME_STATE_PLAY_GAME:
				this.switchGameState(this.GAME_STATE_GAME_PAUSED);
				break;
			case this.GAME_STATE_GAME_PAUSED:
				this.switchGameState(this.GAME_STATE_PLAY_GAME);
				break;
			case this.GAME_STATE_HELP:
				this.switchGameState(this.GAME_STATE_PLAY_GAME);
				break;
			case this.GAME_STATE_GAME_OVER:
				this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
		}
	} else if (pressedKeys[KEY.R]) {
		// If R key pressed, restart
		switch(this.currentState) {
			case this.GAME_STATE_PLAY_GAME:
				this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
		}
	} else if (pressedKeys[KEY.H]) {
		// If H key pressed, help
		switch(this.currentState) {
			case this.GAME_STATE_PLAY_GAME:
				this.switchGameState(this.GAME_STATE_HELP);
				break;
			case this.GAME_STATE_HELP:
				this.switchGameState(this.GAME_STATE_PLAY_GAME);
				break;
		}
	}

	// Check mouse and screen
	if (touched && event === 'mousedown') {
		switch(this.currentState) {
			case this.GAME_STATE_TITLE:
				this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
			case this.GAME_STATE_PLAY_GAME:
				if (click.x > this.width-25 &&
					click.x < this.width &&
					click.y < 25)
					this.switchGameState(this.GAME_STATE_HELP);
				else if (click.x > this.width-50 &&
						click.x < this.width-25 &&
						click.y < 25)
					this.switchGameState(this.GAME_STATE_GAME_PAUSED);
				else if (click.x > this.width-75 &&
						click.x < this.width-50 &&
						click.y < 25)
					this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
			case this.GAME_STATE_GAME_PAUSED:
				if (click.x > this.width-50 &&
					click.x < this.width &&
					click.y < 25)
					this.switchGameState(this.GAME_STATE_PLAY_GAME);
				this.inputManager.touched = false;
				break;
			case this.GAME_STATE_HELP:
				this.switchGameState(this.GAME_STATE_PLAY_GAME);
				this.inputManager.touched = false;
				break;
			case this.GAME_STATE_GAME_OVER:
				this.switchGameState(this.GAME_STATE_NEW_GAME);
				break;
		}
	}

	this.inputManager.statusUpdated = false;
}

// Switch between game states
play.Game.prototype.switchGameState = function(new_state) {
	this.currentState = new_state;

	switch(this.currentState) {
		case this.GAME_STATE_TITLE:
			this.currentStateFunction = this.titleScreen;
			break;
		case this.GAME_STATE_NEW_GAME:
			this.currentStateFunction = this.startGame;
			break;
		case this.GAME_STATE_PLAY_GAME:
			this.currentStateFunction = this.playGame;
			break;
		case this.GAME_STATE_GAME_PAUSED:
			this.currentStateFunction = this.pauseGame;
			break;
		case this.GAME_STATE_GAME_OVER:
			this.currentStateFunction = this.gameOver;
			break;
		case this.GAME_STATE_HELP:
			this.currentStateFunction = this.help;
			break;
		case this.GAME_STATE_OPTIONS:
			this.currentStateFunction = this.gameOptions;
			break;
	}
}

// Title screen
play.Game.prototype.titleScreen = function() {
	console.log('Title screen');

	// Clear the layers
	this.clear();

	// Background
	this.layers['bgCanvas'].fill('#111111');
	
	// Text
	this.layers['infoCanvas'].drawImage(this.assetManager.getAsset('gamehelp'),
		this.width/2-200,this.height/2-103);
}
/* 代码整理：网页设计之家 www.mysite.com */
// Start a new game
play.Game.prototype.startGame = function() {
	console.log('New game');

	// Restart global variables
	this.time = 0;
	this.timer.reset();
	this.entities = {};
	this.carrots = 0;
	this.inputManager.reset();

	var x,y,
		heroWidth = 16,
		monsterWidth = 24,
		charHeight = 32,
		itemWidth = 24;

	// Place a carrot in a random place
	x = Math.floor(Math.random() * (this.width - itemWidth));
	y = Math.floor(Math.random() * (this.height - itemWidth));
	this.entities['carrot'] = new play.Entity(x,y,itemWidth,itemWidth,
		this.assetManager.getAsset('carrot'),this.layers['mainCanvas'],this);

	// Place the hero at the center
	this.entities['hero'] = new play.Entity(this.width/2,this.height/2,heroWidth,charHeight,
		this.assetManager.getAsset('hero'),this.layers['mainCanvas'],this);
	this.entities['hero'].speed = 150;
	
	// Place a monster in a random place
	this.entities['monster'] = new play.Entity(0,0,monsterWidth,charHeight,
		this.assetManager.getAsset('monster'),this.layers['mainCanvas'],this);
	this.entities['monster'].speed = 75;

	// Go to next game state
	this.switchGameState(this.GAME_STATE_PLAY_GAME);
}

// Play game
play.Game.prototype.playGame = function() {
	console.log('Playing');
	this.updateGame();
	this.draw();
}

// Update game entities
play.Game.prototype.updateGame = function() {
	var randomX, randomY,
		KEY = this.inputManager.KEY,
		pressedKeys = this.inputManager.pressedKeys,	
		click = this.inputManager.click;

	// Hero moves
	if (pressedKeys[KEY.UP]) { this.entities['hero'].move(90); } // Player holding up
	if (pressedKeys[KEY.DOWN]) { this.entities['hero'].move(270); } // Player holding down
	if (pressedKeys[KEY.LEFT]) { this.entities['hero'].move(180); }// Player holding left		
	if (pressedKeys[KEY.RIGHT]) { this.entities['hero'].move(0); } // Player holding right
	if (this.inputManager.touched) { this.entities['hero'].moveTo(click.x,click.y); } //Mouse or touchscreen

	// Monster moves
	this.entities['monster'].moveTo(this.entities['hero'].x,this.entities['hero'].y);

	// Check if the hero caught the carrot
	if (this.entities['hero'].checkCollisions(this.entities['carrot'])) {
		this.carrots++;
		randomX = Math.floor(Math.random() * (this.width - 32));
		randomY = Math.floor(Math.random() * (this.height - 32));

		this.entities['carrot'].x = randomX;
		this.entities['carrot'].y = randomY;
	}

	// Check if the moster killed the hero
	if (this.entities['monster'].checkCollisions(this.entities['hero'])) { 
		this.switchGameState(this.GAME_STATE_GAME_OVER);
		return;
	}	
}

// Draw game entities
play.Game.prototype.draw = function() {
	var layers = this.layers;

	// Clear the layers
	this.clear();

	// Create background pattern
	this.layers['bgCanvas'].drawPattern(this.assetManager.getAsset('background'),0,0);

	// Game info
	this.layers['infoCanvas'].addText("Carrots: " + this.carrots,10,10,
									"10px 'Press Start 2P'",'#F5DA01','left','top');
	// Restart, pause and help
	this.layers['infoCanvas'].drawImage(this.assetManager.getAsset('restart'),this.width-75,5);
	this.layers['infoCanvas'].drawImage(this.assetManager.getAsset('pause'),this.width-50,5);
	this.layers['infoCanvas'].drawImage(this.assetManager.getAsset('help'),this.width-25,5);

	// Draw entities
	for (e in this.entities) {
		entity = this.entities[e];
		entity.draw();
	}
}

// Clear all layers
play.Game.prototype.clear = function() {
	var id = null,
		layers = this.layers;

	for (id in layers) { layers[id].clearLayer(); }
}

// Pause game
play.Game.prototype.pauseGame = function() {
	console.log('Game paused');

	// Draw game
	this.draw();

	// Pause text
	this.layers['infoCanvas'].addText("GAME PAUSED",this.width/2,100,
									"10px 'Press Start 2P'",'#FFFFFF','center');
}

// Game over
play.Game.prototype.gameOver = function() {
	console.log('Game over');

	// Restart global variables
	this.entities = {};
	this.inputManager.reset();

	// Clear the layers
	this.clear();

	// Background
	this.layers['bgCanvas'].fill('#000000');

	//Game over text
	this.layers['infoCanvas'].addText("GAME OVER",this.width/2,100,
									"16px 'Press Start 2P'",'#FFFFFF','center');
	this.layers['infoCanvas'].addText(this.carrots + " carrots collected",this.width/2,250);
	this.layers['infoCanvas'].addText("Press Space to play again",this.width/2,300);
}

// 'How to play' screen
play.Game.prototype.help = function() {
	console.log('Help');

	// Draw game
	this.draw();

	// Draw help box
	var color = { r:11, g:11, b:11, a:0.5 };
	this.layers['infoCanvas'].drawRect(this.width/2-220,this.height/2-123,450,240,color);
	this.layers['infoCanvas'].drawImage(this.assetManager.getAsset('gamehelp'),
		this.width/2-200,this.height/2-103);
}

// Options screen
play.Game.prototype.gameOptions = function() {
	console.log('Game options');
}

// Full screen for mobile devices
play.Game.prototype.resize = function() {
	var w = window.innerWidth,
	    h = window.innerHeight;
	    
	if (window.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/i) ) {
		this.setDimensions(w,h);
		for (var i in this.layers) {
			this.layers[i].resize(w,h);
		}
	}
}/* 代码整理：网页设计之家 www.mysite.com */