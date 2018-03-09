
var myPlane = function(myplane_img, myplane_x, myplane_y, 
		myplane_width, myplane_height, myplane_velocity, myplane_hp, gameStart){
	this.myplane_img = myplane_img;
	this.myplane_x = myplane_x;
	this.myplane_y = myplane_y;
	this.myplane_width = myplane_width;
	this.myplane_height = myplane_height;
	this.myplane_velocity = myplane_velocity;
	this.myplane_hp = myplane_hp;
	this.gs = gameStart;

	this.up = false;
	this.right = false;
	this.down = false;
	this.left = false;

	this.area = [0, this.gs.cvWidth - myplane_width * 2 / 3, 
		this.gs.cvHeight - myplane_height, 0 - myplane_width/3];
};

myPlane.prototype = {
	draw_myPlane: function(fps){
		var myplane_img = this.myplane_img;
		var myplane_x = this.myplane_x;
		var myplane_y = this.myplane_y;
		var myplane_width = this.myplane_width;
		var myplane_height = this.myplane_height;

		if(this.myplane_hp > 0) {
			this.gs.context.drawImage(myplane_img, myplane_x, myplane_y, 
				myplane_width, myplane_height);
			this.move_myPlane(fps);
		} else {
			var bomb1 = new bomb(this.gs.bomb_img, myplane_x, myplane_y,
				myplane_width, myplane_height, this.gs);
			this.gs.bomb_set.add(bomb1);
			this.gs.gameOver();
		}
	},

	move_myPlane: function(fps) {
		var up = this.up;
		var right = this.right;
		var down = this.down;
		var left = this.left;
		var velocity = this.myplane_velocity / fps;

		if(up && !down && !left && !right){			// move up
			if(this.myplane_y > this.area[0]) this.myplane_y -= velocity;
		}
		else if(!up && !down && !left && right){	// move right
			if(this.myplane_x < this.area[1]) this.myplane_x += velocity;
		}
		else if(!up && down && !left && !right) {	// move down
			if(this.myplane_y < this.area[2]) this.myplane_y += velocity;
		}
		else if(!up && !down && left && !right) {	// move left
			if(this.myplane_x > this.area[3]) this.myplane_x -= velocity;
		}
	},

	// monitor key press
	keyDown: function(keyCode) {
		var o = this;
		switch(keyCode) {
			case 37:
				o.left = true;
				break;
			case 38:
				o.up = true;
				break;
			case 39:
				o.right = true;
				break;
			case 40:
				o.down = true;
				break;
		}
	},

	keyUp: function(keyCode) {
		var o = this;
		switch(keyCode) {
			case 37:
				o.left = false;
				break;
			case 38:
				o.up = false;
				break;
			case 39:
				o.right = false;
				break;
			case 40:
				o.down = false;
				break;
		}
	},

	checkCollision: function(){
		var o = this;
		this.gs.enemy_set.forEach(function(item){
			if(tools.checkRectIntersect(o.getMyplaneRect(), item.getEnemyPlaneRect())
				&& item.enemy_hp > 0 && o.myplane_hp > 0) {
				o.myplane_hp -= item.enemy_hurt;
				item.enemy_hp = 0;
			}
		});
	},

	getMyplaneRect: function(){
		return [this.myplane_x, this.myplane_y+this.myplane_height*0.2,
		this.myplane_width, this.myplane_height*0.6];
	}
};