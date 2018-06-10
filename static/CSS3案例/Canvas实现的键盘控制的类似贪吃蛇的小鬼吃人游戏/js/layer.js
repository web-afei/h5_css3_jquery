/* 代码整理：网页设计之家 www.mysite.com */
// Constructor
play.Layer = function(container,id,w,h,z) {
	this.z = z;
	this.width = w;
	this.height = h;
	this.speed = 0;
	this.canvas = document.createElement('canvas');
	this.canvas.id = id;
	this.canvas.width = w;
	this.canvas.height = h;
	this.canvas.style.zIndex = z;
	this.ctx = this.canvas.getContext('2d');
	container.appendChild(this.canvas);
}

// Resize a layer
play.Layer.prototype.resize = function(w,h) {
	this.width = w;
	this.height = h;
	this.canvas.width = w;
	this.canvas.height = h;
}

// Clear a canvas zone
play.Layer.prototype.clear = function(ctx,x,y,w,h) {
	ctx.clearRect(x,y,w,h);
}

// Clear the entire canvas
play.Layer.prototype.clearLayer = function() {
	this.clear(this.ctx,0,0,this.width,this.height);
}

// Change the fillstyle of the layer
play.Layer.prototype.fillStyle = function(color) {
	if (color.r !== undefined) 
		this.ctx.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
	else this.ctx.fillStyle = color;
}

// Write in the layer
play.Layer.prototype.addText = function(text,x,y,font,color,align,valign) {
	if (font !== undefined && font !== '') this.ctx.font = font;
	if (color !== undefined && color !== '') this.fillStyle(color);
	if (align !== undefined && align !== '') this.ctx.textAlign = align;
	if (valign !== undefined && valign !== '') this.ctx.textBaseline = valign;
	this.ctx.fillText(text,x,y);
}

// Fill the layer with a solid color
play.Layer.prototype.fill = function(color) {
	this.drawRect(0,0,this.width,this.height,color);
}

// Draw an horizontal line
play.Layer.prototype.drawHorizontalLine = function(y) {
	this.ctx.beginPath();
	this.ctx.moveTo(y,0);
	this.ctx.lineTo(y,this.height);
	this.ctx.closePath();
	this.ctx.stroke();
}

// Draw a vertical line
play.Layer.prototype.drawVerticalLine = function(x) {
	this.ctx.beginPath();
	this.ctx.moveTo(0,x);
	this.ctx.lineTo(this.width,x);
	this.ctx.closePath();
	this.ctx.stroke();
}

// Draw guidelines
play.Layer.prototype.drawGuidelines = function(x,y,linewidth,color) {
   this.ctx.strokeStyle = 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
   this.ctx.lineWidth = linewidth;
   this.drawVerticalLine(x);
   this.drawHorizontalLine(y);
}

// Draw a rectangle
play.Layer.prototype.drawRect = function(x,y,w,h,color) {
	this.fillStyle(color);
	this.ctx.fillRect(x,y,w,h);
}

// Draw a grid
play.Layer.prototype.drawGrid = function(squareSize,linewidth,color) {
	var cols = this.width/(squareSize+linewidth),
		rows = this.height/(squareSize+linewidth),
		i = 0;
	// Initial settings
	this.ctx.lineWidth = linewidth;
	this.ctx.strokeStyle = 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
	// Draw into the buffer
	for (; i < rows; i++){
		this.drawVerticalLine(i*(squareSize+linewidth));
	}
	for (i = 0; i < cols; i++){
		this.drawHorizontalLine(i*(squareSize+linewidth));
	}
}

// Create a pattern and fill the layer with it
play.Layer.prototype.drawPattern = function(pattern,x,y) {
	this.ctx.fillStyle = this.ctx.createPattern(pattern,'repeat');
	this.ctx.fillRect(x,y,this.width,this.height);
}

// Draw a image in the layer
play.Layer.prototype.drawImage = function(img,x,y) {
	this.ctx.drawImage(img,x,y);
}

// Panning a background with a pattern
play.Layer.prototype.panningPatternBG = function(pattern,angle,time) {
	var angle = angle*Math.PI/180,
		x = Math.round(this.speed*time*Math.round(Math.cos(angle))) % this.width,
		y = Math.round(-this.speed*time*Math.round(Math.sin(angle))) % this.height;
	
	this.clearLayer(this.ctx);
	this.ctx.save();
	this.ctx.translate(x,y);
	this.drawPattern(pattern,-x,-y);
	this.ctx.restore();
}

// Panning a background with a image
play.Layer.prototype.panningImgBG = function(img,angle,time) {
		var angle = angle*Math.PI/180,
		x = Math.round(Math.cos(angle)),
		y = Math.round(Math.sin(angle)),
		despX = Math.round(this.speed*time*x) % img.width,
		despY = -Math.round(this.speed*time*y) % img.height;
	
	this.clearLayer(this.ctx);
	this.ctx.save();
	this.ctx.translate(despX,despY);
	this.drawImage(img,0,0);
	this.drawImage(img,-img.width*x,img.height*y);
	this.ctx.restore();
}
/* 代码整理：网页设计之家 www.mysite.com */
// Check if an entity is between the canvas limits
play.Layer.prototype.checkLimits = function(obj) {
	if (obj.x > this.width - obj.width) obj.x = this.width - obj.width;
	else if (obj.x < 0) obj.x = 0;
	if (obj.y > this.height - obj.height) obj.y = this.height - obj.height;
	else if (obj.y < 0) obj.y = 0;
}