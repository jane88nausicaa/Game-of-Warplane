var Bullet = function(img, x, y, w, h, vx, vy, hurt, isLive, gameStart){
	this.img = img;
	this.x_int = x;
	this.y_int = y;
	this.w_int = w;
	this.h_int = h;
	this.vx_float = vx;
	this.vy_float = vy;
	this.hurt_int = hurt;
	this.isLive_bool = isLive;
	this.gs = gameStart;
};

Bullet.prototype = {
	draw_bullet: function(fps) {
		var img = this.img;
		var x = this.x_int;
		var y = this.y_int;
		var w = this.w_int;
		var h = this.h_int;

		if(this.isLive_bool){
			this.gs.context.drawImage(img, x, y, w, h);
			this.move_bullet(fps);
		}
		else {
			this.gs.myplane_bullets_set.delete(this);
		}
	},

	move_bullet: function (fps) {
		this.y_int -= this.vy_float/fps;
		this.x_int -= this.vx_float/fps;

		if(this.y_int < 0 - this.h_int)
			this.isLive_bool = false;
	},

	checkCollision: function() {
		var o = this;
		this.gs.enemy_set.forEach(function(item) {
			if(tools.checkRectIntersect(o.getBulletRect(), item.getEnemyPlaneRect()) && 
				item.enemy_hp > 0 && o.isLive_bool) {
				o.isLive_bool = false;
				item.enemy_hp -= o.hurt_int;
				o.gs.playAudio(o.gs.hitEnemy_audio);
			}
		});
	},

	getBulletRect: function() {
		return [this.x_int, this.y_int + this.h_int*0.2, this.w_int, this.h_int*0.6];		// ??
	}
};