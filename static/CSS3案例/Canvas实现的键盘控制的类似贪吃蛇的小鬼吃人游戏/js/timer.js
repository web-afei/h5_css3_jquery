/* 代码整理：网页设计之家 www.mysite.com */
play.Timer = function(fps) {
	this.fps = fps;
	this.gameTime = 0;
	this.lastTime = 0;
	this.maxInterval = 0.05;
}

// Make the timer tick
play.Timer.prototype.tick = function() {
	var now = Date.now(),
		delta = (now - this.lastTime) / 1000,
		gameDelta = Math.min(delta, this.maxInterval);

	this.updateFrameRate(now);
	this.lastTime = now;
	this.gameTime += gameDelta;
	return gameDelta;
}

// Reset the timer
play.Timer.prototype.reset = function() {
	this.gameTime = 0;
	this.lastTime = 0;
}

// Calculate the FPS
play.Timer.prototype.updateFrameRate = function(now) {
	if (this.lastTime !== 0)
		this.fps = 1000 / (now - this.lastTime);
}/* 代码整理：网页设计之家 www.mysite.com */