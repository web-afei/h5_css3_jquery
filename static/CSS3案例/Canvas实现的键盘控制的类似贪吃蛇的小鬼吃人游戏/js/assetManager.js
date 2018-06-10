/* 代码整理：网页设计之家 www.mysite.com */
// Constructor
play.AssetManager = function () {
	this.queue = [];
	this.assets = {};
	this.loaded = 0;
	this.errors = 0;
	this.numAssets = 0;
}

// Add an asset to the queue
play.AssetManager.prototype.addAsset = function(id,asset) {
	this.queue.push({'id':id,'src':asset});
}

// Return an asset
play.AssetManager.prototype.getAsset = function(id) {
	return this.assets[id];
}

// Load all the assets in the queue and execute a function when it's over
play.AssetManager.prototype.loadAssets = function(callback) {
	var self = this,
		i = 0,
		id;

	console.log('Loading assets');
	for (i; i < this.queue.length; i++) {
		id = this.queue[i].id;
		this.assets[id] = new Image();
		this.assets[id].src = this.queue[i].src;
		this.assets[id].addEventListener("load", function() {
			console.log(this.src + ' is loaded');
			self.loaded++;
			if (self.isDone()) callback();
		}, false);
		this.assets[id].addEventListener("error", function() {
			console.log(this.src + ' couldn´t been loaded');
			self.errors++;
			if (self.isDone()) callback();
		}, false);
	}

	this.queue = [];

	// If there's no assets, execute function
	if (this.isDone()) callback();
}

// Check if the load process has finished
play.AssetManager.prototype.isDone = function() {
	return (this.numAssets === this.loaded + this.errors);
}

// Get the progress percentage
play.AssetManager.prototype.getProgress = function() {
	return ((this.loaded + this.errors)*100)/this.numAssets;
}

// Delete all items from the asset manager
play.AssetManager.prototype.reset = function() {
	this.queue = [];
	this.assets = {};
	this.loaded = 0;
	this.errors = 0;
	this.numAssets = 0;
}/* 代码整理：网页设计之家 www.mysite.com */