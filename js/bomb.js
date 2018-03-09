var bomb = function(imgArr, x, y, w, h, gameStart){
	this.bomb_imgArr = imgArr;
	this.bomb_x = x;
	this.bomb_y = y;
	this.bomb_width = w;
	this.bomb_height = h;
	this.gs = gameStart;

	this.fpsNum = 0; 
};

bomb.prototype = {
	draw_bomb: function() {
		var bomb_imgArr = this.bomb_imgArr;
		var bomb_x = this.bomb_x;
		var bomb_y = this.bomb_y;
		var bomb_width = this.bomb_width;
		var bomb_height = this.bomb_height;

		this.gs.context.drawImage(bomb_imgArr[this.fpsNum++], 
			bomb_x, bomb_y, bomb_width, bomb_height);

		if(this.fpsNum == bomb_imgArr.length){
			this.gs.bomb_set.delete(this);
		}
	}
};