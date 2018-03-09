var enemyPlane = function(enemy_img, enemy_x, enemy_y, enemy_width, enemy_height,
			enemy_velocity, enemy_hp, enemy_hurt, enemy_score, gameStart) {
	this.enemy_img = enemy_img;
	this.enemy_x = enemy_x;
	this.enemy_y = enemy_y;
	this.enemy_width = enemy_width;
	this.enemy_height = enemy_height;
	this.enemy_velocity = enemy_velocity;
	this.enemy_hp = enemy_hp;
	this.enemy_hurt = enemy_hurt;
	this.enemy_score = enemy_score;
	this.gs = gameStart;
};

enemyPlane.prototype = {
	draw_enemyPlane: function(fps) {
		var enemy_img = this.enemy_img;
		var enemy_x = this.enemy_x;
		var enemy_y = this.enemy_y;
		var enemy_width = this.enemy_width;
		var enemy_height = this.enemy_height;

		if(this.enemy_hp > 0){
			this.gs.context.drawImage(enemy_img, enemy_x, enemy_y, 
				enemy_width, enemy_height);
			this.move_enemyPlane(fps);
		} else {
			this.gs.enemy_set.delete(this);
			this.gs.score += this.enemy_score;

			if(this.enemy_hp <= 0 && enemy_y < this.gs.cvHeight){
				var bomb1 = new bomb(this.gs.bomb_img, enemy_x, enemy_y,
					enemy_width, enemy_height, this.gs);
				this.gs.bomb_set.add(bomb1);
			}
		}
	},

	move_enemyPlane: function(fps) {
		this.enemy_y += this.enemy_velocity/fps;
	},

	getEnemyPlaneRect:function(){
		return [this.enemy_x,this.enemy_y+this.enemy_height*0.2,this.enemy_width,this.enemy_height*0.6];
	}
};