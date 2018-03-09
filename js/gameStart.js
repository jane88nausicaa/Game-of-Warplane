var gameStart = function(){

	this.cvWidth = 800;
	this.cvHeight = 600;
	console.log("ffffff");
	this.canvas = document.getElementById('canvas');
	this.canvas.width = this.cvWidth;
	this.canvas.height = this.cvHeight;
	this.context = canvas.getContext('2d');

	this.myplane_img = this.getImg('image/myplane1.png');
	this.bg_img = [this.getImg('image/bg_01.jpg'),
		this.getImg('image/bg_02.jpg'),
		this.getImg('image/bg_03.jpg'),
		this.getImg('image/bg_04.jpg'),
		this.getImg('image/bg_05.jpg')];
	this.enemy_img = [this.getImg('image/enemy10.png'),
		this.getImg('image/enemy6.png'),
		this.getImg('image/enemy1.png')];
	this.bullet_img1 = this.getImg('image/bullet1.png');
	this.bomb_img = [this.getImg('image/b11.gif'),
		this.getImg('image/b10.gif'),
		this.getImg('image/b9.gif'),
		this.getImg('image/b8.gif'),
		this.getImg('image/b7.gif'),
		this.getImg('image/b6.gif'),
		this.getImg('image/b5.gif'),
		this.getImg('image/b4.gif'),
		this.getImg('image/b3.gif'),
		this.getImg('image/b2.gif'),
		this.getImg('image/b1.gif')];
	this.HP_img4 = this.getImg('image/img_HP.png');
	this.num_img = [this.getImg('image/0.png'),
		this.getImg('image/1.png'),
		this.getImg('image/2.png'),
		this.getImg('image/3.png'),
		this.getImg('image/4.png'),
		this.getImg('image/5.png'),
		this.getImg('image/6.png'),
		this.getImg('image/7.png'),
		this.getImg('image/8.png'),
		this.getImg('image/9.png')];

	this.gameOver_img = this.getImg("image/gameOver.png");

	var thisTime = new Date().getTime();

	
	// my plane
	this.myplane_hp = 80;
	var myplane_width = 96;
	var myplane_height = 64;
	var myplane_x = (this.cvWidth - myplane_width) / 2;
	var myplane_y = this.cvHeight - myplane_height - 50;
	var myplane_velocity = 240;
	this.myplane = new myPlane(this.myplane_img, myplane_x, myplane_y, 
		myplane_width, myplane_height, myplane_velocity,this.myplane_hp,this);

	// enemy
	this.enemy_set = new Set();
	this.enemy_hp = [5, 15, 30];
	this.enemy_width = [80, 100, 150];
	this.enemy_height = [50, 80, 100];
	this.enemy_velocity_y = [120, 72, 66];
	this.enemy_hurt = [10, 20, 30]; //?
	this.enemy_interval = [3000, 10000, 24000];
	this.enemy_time = [thisTime, thisTime, thisTime];
	this.enemy_score = [100, 300, 600];

	// myplane bullets set
	this.myplane_bullets_set = new Set();
	this.bullet_width = 15;
	this.bullet_height = 30;
	this.bullet_velocity_x = 0;
	this.bullet_velocity_y = 600;
	this.bullet_hurt = 5; 		
	this.bullet_interval = 150;
	this.bullet_time = thisTime;	

	// enemy plane bomb set
	this.bomb_set = new Set();
	
	// other parameters
	this.score = 0;
	this.hitEnemy_audio = this.getAudio('audio/hitEnemy_audio.mp3');

	var bg_this = this.bg_img[parseInt(Math.random()*4.99)];
	this.bg1 = new BackGround(bg_this,0,0,this.cvWidth,this.cvHeight,42,this);
	this.bg2 = new BackGround(bg_this,0,0-this.cvHeight,this.cvWidth,this.cvHeight,42,this);
	
	this._init(this);
}
gameStart.prototype = {

	getImg:function(src){
		var o = this;
		var img = new Image();
		img.onload = function(){o.progress_int++};
		img.onerror = function(){alert('Image Loading Fail'+src)};
		img.src = src;
		return img;
	},

	_init:function(obj){
		obj.showFrame();
	},



	showFrame:function(){
		var o = this;
		var isPause = false;
		
		window.addEventListener("keydown", function(event) {
			
			/*
			If e exists, keep e. If it doesn't exist, y
			ou are using an older version of IE and 
			we assign the windows.event object to e. 
			*/

			var e = event || window.event;
			o.myplane.keyDown(e.keyCode);
		});
		window.addEventListener("keyup", function(event) {
			var e = event || window.event;

			if(e.keyCode == 32) {
				if(isPause) {
					isPause = false;
					tools.fps_lastTime = 0;
					animate(new Date().getTime(), 1000/60);
				} else {
					isPause = true;
				}
			} else {
				o.myplane.keyUp(e.keyCode);
			}
		});

		// draw canvas recursively
		animate(new Date().getTime(),1000/60);
		function animate(thisTime,fps) {
		    if(!isPause){
		    	tools.requestAnimFrame(animate,isPause);
		    }
		    thisTime = new Date().getTime();
		    o.draw(thisTime,fps);
		}
	},

	getAudio: function(src, repeatOrNot, autoplay) {
		repeatOrNot = repeatOrNot || false;
		autoplay = autoplay || false;
		var o = this;
		var audio = document.createElement('audio');
		audio.repeatOrNot = repeatOrNot;
		audio.src = src;
		return audio;
	},

	playAudio: function(audio){
		var newAudio = document.createElement("audio");
		newAudio.repeatOrNot = false;
		newAudio.autoplay = true;
		newAudio.onended = function() {
			newAudio = null
		};
		newAudio.src = audio.src;
		newAudio.play();
	},

	draw: function(thisTime,fps){
		this.gaming(thisTime,fps);
	},

	gaming: function(thisTime,fps){
		// draw background
		this.bg1.draw_background(fps);
		this.bg2.draw_background(fps);

		// draw enemy plane
		if(thisTime - this.enemy_time[2] > this.enemy_interval[2]){
			this.createEnemyPlane(2);
			this.enemy_time[2] = thisTime;
		}
		if(thisTime - this.enemy_time[1] > this.enemy_interval[1]){
			this.createEnemyPlane(1);
			this.enemy_time[1] = thisTime;
		}
		if(thisTime - this.enemy_time[0] > this.enemy_interval[0]){
			this.createEnemyPlane(0);
			this.enemy_time[0] = thisTime;
		}

		this.enemy_set.forEach(function(item){
			item.draw_enemyPlane(fps);
		});

		// draw myplane bullets
		if(thisTime - this.bullet_time > this.bullet_interval){
			this.createBullet();
			this.bullet_time = thisTime;
		}

		this.myplane_bullets_set.forEach(function(item){
			item.draw_bullet(fps);
			item.checkCollision();
		});

		// draw bomb
		this.bomb_set.forEach(function(item){
			item.draw_bomb(fps);
		});

		// draw my plane
		this.myplane.draw_myPlane(fps);
		this.myplane.checkCollision();

		this.showScore();
		this.showHP();
	},

	showScore: function(){
		var o = this;
		var score_str = '' + o.score;
		var x = o.cvWidth - 52 - score_str.length * 32;
		var y = 15;
		score_str = score_str.split('');	// ???

		score_str.forEach(function(item){
			var item_int = parseInt(item);
			o.context.drawImage(o.num_img[item_int], x += 32, y, 28, 38);
		});

	},

	showHP: function() {
		var mp = this.myplane;

		// draw hit point 
		this.context.beginPath();
		this.context.fillStyle = "red";
		this.context.fillRect(48, 20, 140 * mp.myplane_hp/this.myplane_hp, 24);	// ??
		this.context.closePath();

		// draw hit point edges
		this.context.beginPath();
		this.context.strokeSytle = "#bb3e00";
		this.context.lineWidth = 3;
		this.context.strokeRect(48, 20, 140, 24);
		this.context.closePath();
		// HP icon
		var hp_img = this.HP_img4;
		this.context.drawImage(hp_img, 10, 14, 57, 34);

	},

	createEnemyPlane: function(index) {
		var myplane = this.myplane;
		var enemy_img = this.enemy_img[index];
		var enemy_width = this.enemy_width[index];
		var enemy_height = this.enemy_height[index];
		var enemy_x = parseInt(Math.random() * (this.cvWidth - enemy_width));
		var enemy_y = 0 - enemy_height;
		var enemy_velocity = this.enemy_velocity_y[index];
		var enemy_hp = this.enemy_hp[index];
		var enemy_hurt = this.enemy_hurt[index];
		var enemy_score = this.enemy_score[index];
		var enemy = new enemyPlane(enemy_img, enemy_x, enemy_y, enemy_width, enemy_height,
			enemy_velocity, enemy_hp, enemy_hurt, enemy_score, this);
		this.enemy_set.add(enemy);
	},

	createBullet: function() {
		var mp = this.myplane;
		if(mp.myplane_hp <= 0)
			return;
		var img = this.bullet_img1;
		var w = this.bullet_width;
		var h = this.bullet_height;
		var x = mp.myplane_x + (mp.myplane_width - w)/2;
		var y = mp.myplane_y - h;
		var vx = this.bullet_velocity_x;
		var vy = this.bullet_velocity_y;
		var hurt = this.bullet_hurt;
		var bullet = new Bullet(img, x, y, w, h, vx, vy, hurt, true, this);
		this.myplane_bullets_set.add(bullet);
	},

	gameOver: function() {
		var gameOver_img = this.gameOver_img;
		this.context.drawImage(gameOver_img, 275, 225, 250, 150);
	}
};
