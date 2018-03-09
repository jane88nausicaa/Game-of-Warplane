var BackGround = function(img,x,y,w,h,v,gameStart){
	this.img = img;
    this.x_int = x;
    this.y_int = y;
    this.w_int = w;
    this.h_int = h;
    this.v_float = v;
    this.gs = gameStart;
};
BackGround.prototype = {
	draw_background:function(spf){
		var bg = this.img;
		var x = this.x_int;
		var y = this.y_int;
		var w = this.w_int;
		var h = this.h_int;
		this.gs.context.drawImage(bg,x,y,w,h);
		this.move(spf);
	},
	
	move: function(fps){
		var v = this.v_float/fps;
		if(this.y_int >= this.h_int){
			this.y_int = 0-this.h_int;
		}
		this.y_int += v;
	}
};