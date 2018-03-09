window.extend = function(){
	if(arguments.length==0)return {};
	if(!Object.assign){
		var newObj = {};
		for(var i in arguments){
			for(var key in arguments[i]){
				newObj[key] = arguments[i][key];
			}
		}
		return newObj;
	}else{
		return Object.assign.apply({},arguments);
	}
};
/**
 * requestAnimationFrame for different browsers
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
/**
 * Set
 */
window.Set = function(){
	this.arr = [];
};
Set.prototype = {
	size:function(){
		return this.arr.length;
	},
	add:function(item){
		var type = true;
		for(var i=0;i<this.size();i++){
			if(this.arr[i] === item){
				type = false;
				break;
			};
		}
		type&&this.arr.push(item);
	},
	delete:function(item){
		var newArr = [];
		this.forEach(function(v){
			(v===item)||newArr.push(v);
		});
		this.arr = newArr;
	},
	has:function(item){
		var type = null;
		for(var i=0;i<this.size();i++){
			if(this.arr[i] === item){
				type = item;
				break;
			};
		}
		return type===item;
	},
	clear:function(){
		this.arr.length = 0;
	},
	forEach:function(callback){
		this.arr.forEach(callback);
	}
};

window.tools = {
	
	/*
		|			|
		|			|
	----|-----------|------	top_y
		| bullet Or	|		
		| enemyPlane|	
	----|-----------|------	bottom_y
		|			|
		|			|
	left_x        right_x
	*/
	
	checkRectIntersect: function(rect1, rect2) {
		var rect1_left_x = rect1[0];
		var rect1_right_x = rect1[0] + rect1[2];
		var rect1_bottom_y = rect1[1];
		var rect1_top_y = rect1[1] + rect1[3];

		var rect2_left_x = rect2[0];
		var rect2_right_x = rect2[0] + rect2[2];
		var rect2_bottom_y = rect2[1];
		var rect2_top_y = rect2[1] + rect2[3];

		return !(rect1_left_x > rect2_right_x ||
			rect1_right_x < rect2_left_x || 
			rect1_bottom_y > rect2_top_y ||
			rect1_top_y < rect2_bottom_y);
	},
	/**
	 * time for the most recently 
	 */
	fps_lastTime:0,
	/**
	 * requestAnimationFrame for different browsers
	 */
	requestAnimFrame:function(callback,isPause){
		isPause=isPause||false;
		var spf = 1000 / 60;
		var thisTime = new Date().getTime();
		spf = tools.fps_lastTime?(thisTime - tools.fps_lastTime):spf;
		tools.fps_lastTime = thisTime;
		callback&&requestAnimationFrame(function(){
			callback(thisTime,1000/spf);
		});
	}
}