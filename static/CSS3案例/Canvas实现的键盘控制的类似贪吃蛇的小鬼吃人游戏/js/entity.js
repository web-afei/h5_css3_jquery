/* 代码整理：网页设计之家 www.mysite.com */
// Constructor
play.Entity = function(x,y,width,height,sprite,layer,game) {
	this.x = x;
	this.y = y;
	this.speed = 0;
	this.width = width;
	this.height = height;
	this.layer = layer;
	this.sprite = sprite;
	this.game = game;
}

// Draws the entity into the canvas
play.Entity.prototype.draw = function() {
	this.layer.ctx.drawImage(this.sprite,this.x,this.y);
}

// Move the entity in a set angle width
play.Entity.prototype.move = function(angle) {
	var radians = angle*Math.PI/180;
	this.x += Math.cos(radians)*this.speed*this.game.time;
	this.y -= Math.sin(radians)*this.speed*this.game.time;

	// Check if the entity is between the canvas limits
	this.layer.checkLimits(this);
}

// Move the entity to a given point (x,y)
play.Entity.prototype.moveTo = function(x,y) {
	//If the entity has arrived, stop
	if (this.x == x && this.y == y) return;

	var dx = x - this.x,
		dy = y - this.y,
		distance = Math.sqrt(dx*dx + dy*dy),
		moves = Math.floor(distance/(this.speed*this.game.time)),
		xunits = dx/moves,
		yunits = dy/moves;
		
	if (moves > 0) {
		moves--;
		this.x += xunits;
		this.y += yunits;
		// Check if the entity is between the canvas limits
		this.layer.checkLimits(this);
	}
}

// Check if the entity is touching an object
play.Entity.prototype.checkCollisions = function(obj) {
	return (this.x <= obj.x + obj.width &&
			obj.x <= this.x + this.width &&
			this.y <= obj.y + obj.height &&
			obj.y <= this.y + this.height);
}/* 代码整理：网页设计之家 www.mysite.com */