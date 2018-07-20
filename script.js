var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function Creature(size, posX, posY) {
	
	this.init = function() {
		this.vertebraSize = 10;
		this.speed = 2;
		this.armSize = 20;
		this.armSpeed = 0.5;
		
		if(size < 4) {
			size = 4;
		}
		
		let head = new Ball(posX,posY);
		this.backbone = [head];
		
		for (var i = 1; i < size; i++) {
			let parent = this.backbone[i-1];
			this.backbone.push(new Ball(parent.x - this.vertebraSize, posY));
		}
		
		this.leftHand = new Ball(this.leftHandTarget().x, this.leftHandTarget().y);
		this.isMovingLeftHand =  false;
		this.rightHand = new Ball(this.rightHandTarget().x-this.armSize, this.rightHandTarget().y);
		this.isMovingRightHand =  true;
		this.leftFoot = new Ball(this.leftFootTarget().x, this.leftFootTarget().y);
		this.isMovingLeftFoot =  true;
		this.rightFoot = new Ball(this.rightFootTarget().x-this.armSize, this.rightFootTarget().y);
		this.isMovingRightFoot =  false;
	};
	
	this.draw = function() {
		for (var i = 0; i < size; i++) {
			var point = this.backbone[i];
			point.draw();
		}
		
		this.leftHand.draw();
		this.rightHand.draw();
		this.leftFoot.draw();
		this.rightFoot.draw();
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
		
		this.isMovingLeftHand = this.moveHand(this.leftHand,this.leftHandTarget(),this.isMovingLeftHand);
		this.isMovingRightHand = this.moveHand(this.rightHand,this.rightHandTarget(),this.isMovingRightHand);
		this.isMovingLeftFoot = this.moveHand(this.leftFoot,this.leftFootTarget(),this.isMovingLeftFoot);
		this.isMovingRightFoot = this.moveHand(this.rightFoot,this.rightFootTarget(),this.isMovingRightFoot);
	};
	
	this.moveHand = function(hand, target, isMoving) {
		let dist = hand.dist(target);
		let speed = this.speed + this.armSpeed;
		if(dist > this.armSize) {
			isMoving = true;
		}
		else if(dist <= this.speed + this.armSpeed) {
			isMoving = false;
		}
		
		if(isMoving) {
			hand.vx = (target.x - hand.x) / dist * speed;
			hand.vy = (target.y - hand.y) / dist * speed;
			hand.x += hand.vx;
			hand.y += hand.vy;
		}
		
		return isMoving;
	}
	
	this.leftHandTarget = function() {
		 return {
			 x : this.backbone[1].x +this.backbone[1].vy*4,
			 y : this.backbone[1].y - this.backbone[1].vx*4
		 };
	};
	
	this.rightHandTarget = function() {
		 return {
			 x : this.backbone[1].x -this.backbone[1].vy*4,
			 y : this.backbone[1].y + this.backbone[1].vx*4
		 };
	};
	
	this.leftFootTarget = function() {
		 return {
			 x : this.backbone[3].x +this.backbone[3].vy*4,
			 y : this.backbone[3].y - this.backbone[3].vx*4
		 };
	};
	
	this.rightFootTarget = function() {
		 return {
			 x : this.backbone[3].x -this.backbone[3].vy*4,
			 y : this.backbone[3].y + this.backbone[3].vx*4
		 };
	};
	
	this.init();
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

var bestiau = new Creature(7,150,150);

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