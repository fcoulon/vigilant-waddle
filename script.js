var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function Creature(size, posX, posY) {
	this.vertebraSize = 10;
	this.speed = 2;
	
	let head = new Ball(posX,posY);
	this.backbone = [head];
	
	for (var i = 1; i < size; i++) {
		let parent = this.backbone[i-1];
		this.backbone.push(new Ball(parent.x - this.vertebraSize, posY));
	}
	
	this.draw = function() {
		for (var i = 0; i < size; i++) {
			var point = this.backbone[i];
			point.draw();
		}
	};
	
	this.move = function() {
		let parent = target;
		for (var i = 0; i < size; i++) {
			
			let point = this.backbone[i];
			let dist = point.dist(parent);
			
			point.vx = (parent.x - point.x) / dist * this.speed;
			point.vy = (parent.y - point.y) / dist * this.speed;
			
			if(dist - this.speed > this.vertebraSize) {
				point.x += point.vx;
				point.y += point.vy;
			}
			
			parent = point;
		}
	};
};

function Ball(x,y) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.radius = 3;
  this.color = 'black';
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };
  this.dist = function(pointB) {
	return Math.sqrt((this.x - pointB.x) * (this.x - pointB.x) + (this.y - pointB.y) * (this.y - pointB.y));
  };
};

var bestiau = new Creature(5,150,150);

var target = {
	x : 300,
	y : 300
};

function clear() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

function draw() {
	
  bestiau.move();
  clear();
  bestiau.draw();
  
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener("click",function(e){
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});


canvas.addEventListener('mousemove', function(e){
	target.x = e.clientX;
	target.y = e.clientY;
});

/*
canvas.addEventListener("click",function(e){
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});*/

//ball.draw();
raf = window.requestAnimationFrame(draw);