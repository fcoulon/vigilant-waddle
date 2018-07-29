var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

function Creature(size, posX, posY) {
	
	this.init = function() {
		this.vertebraSize = 10;
		this.speed = 1;
		this.armSize = this.vertebraSize * 2.5;
		this.handSize = this.armSize / 2; 
		this.maxTargetDist = 40;
		this.armSpeed = 5;
		
		if(size < 5) {
			size = 5;
		}
		
		let head = new Vertebra(posX,posY,null);
		this.backbone = [head];
		
		for (var i = 1; i < size; i++) {
			let parent = this.backbone[i-1];
			this.backbone.push(new Vertebra(parent.center.x - this.vertebraSize, posY,parent));
		}
		
		this.leftHand = new Vertebra(this.leftHandTarget().x, this.leftHandTarget().y,this.backbone[2]);
		this.leftFoot = new Vertebra(this.leftFootTarget().x, this.leftFootTarget().y,this.backbone[5]);
		this.rightHand = new Vertebra(this.rightHandTarget().x, this.rightHandTarget().y,this.backbone[2]);
		this.rightFoot = new Vertebra(this.rightFootTarget().x, this.rightFootTarget().y,this.backbone[5]);
		this.isMovingLeftHand =  false;
		this.isMovingRightHand =  true;
		this.isMovingLeftFoot =  true;
		this.isMovingRightFoot =  false;
	};
	
	this.draw = function() {
		for (var i = 0; i < size; i++) {
			let point = this.backbone[i];
			point.draw();
		}
		
		ctx.beginPath();
		ctx.moveTo(this.backbone[0].center.x, this.backbone[0].center.y);
		for (var i = 0; i < size; i++) {
			let point = this.backbone[i];
			ctx.lineTo(point.center.x, point.center.y);
		}
		ctx.stroke();
		
		this.leftHand.draw();
		this.rightHand.draw();
		this.leftFoot.draw();
		this.rightFoot.draw();
		
		this.drawLeftMember(this.leftHand,this.leftHand.parent);
		this.drawRightMember(this.rightHand,this.rightHand.parent);
		this.drawLeftMember(this.leftFoot,this.leftFoot.parent);
		this.drawRightMember(this.rightFoot,this.rightFoot.parent);
		
	};

	this.drawLeftMember = function(hand, parent) {
		let link = new Vector(hand.center.x-parent.center.x, hand.center.y-parent.center.y);
		let linkSize = link.size();
		let angle = Math.asin((linkSize/3*2) / (this.armSize/2));
		let otherAngle = Math.PI - Math.PI/2 - angle;
		link.rotate(-otherAngle);
		link.resize(this.armSize/2);
		let elbow = link.translate(parent.center);

		ctx.beginPath();
		ctx.moveTo(hand.center.x, hand.center.y);
		ctx.lineTo(elbow.x, elbow.y);
		ctx.lineTo(parent.center.x, parent.center.y);
		ctx.stroke();
	}

	this.drawRightMember = function(hand, parent) {
		let link = new Vector(hand.center.x-parent.center.x, hand.center.y-parent.center.y);
		let linkSize = link.size();
		let angle = Math.asin((linkSize/3*2) / (this.armSize/2));
		let otherAngle = Math.PI - Math.PI/2 - angle;
		link.rotate(otherAngle);
		link.resize(this.armSize/2);
		let elbow = link.translate(parent.center);

		ctx.beginPath();
		ctx.moveTo(hand.center.x, hand.center.y);
		ctx.lineTo(elbow.x, elbow.y);
		ctx.lineTo(parent.center.x, parent.center.y);
		ctx.stroke();
	}
	
	this.move = function() {
		let parent = target;
		for (var i = 0; i < size; i++) {
			
			let node = this.backbone[i];
			let dist = Vector.distance(node.center, parent);
			
			let vertebra = new Vector(parent.x - node.center.x, parent.y - node.center.y);
			vertebra.resize(this.speed);
			node.direction = vertebra;
			
			if(dist - this.speed > this.vertebraSize) {
				node.center.x += node.direction.x;
				node.center.y += node.direction.y;
			}
			
			parent = node.center;
		}
		
		this.isMovingLeftHand = this.moveHand(this.leftHand,this.leftHandTarget(),this.isMovingLeftHand);
		this.isMovingRightHand = this.moveHand(this.rightHand,this.rightHandTarget(),this.isMovingRightHand);
		this.isMovingLeftFoot = this.moveHand(this.leftFoot,this.leftFootTarget(),this.isMovingLeftFoot);
		this.isMovingRightFoot = this.moveHand(this.rightFoot,this.rightFootTarget(),this.isMovingRightFoot);
	};
	
	this.moveHand = function(hand, target, isMoving) {
		let dist = Vector.distance(hand.center, target);
		
		let speed = this.speed + this.armSpeed;
		if(dist > this.maxTargetDist) {
			isMoving = true;
		}
		else if(dist <= speed) {
			isMoving = false;
		}
		
		if(isMoving) {
			let dir = new Vector(target.x - hand.center.x, target.y - hand.center.y);
			dir.resize(speed);
			hand.direction = dir;

			hand.center.x += hand.direction.x;
			hand.center.y += hand.direction.y;
		}
		
		return isMoving;
	}
	
	this.leftHandTarget = function() {
		let vertebraDir = this.backbone[2].direction;
		let armDir = new Vector(vertebraDir.x, vertebraDir.y);
		armDir.rotate(-Math.PI/4);
		armDir.resize(this.armSize);
		return armDir.translate(this.backbone[2].center);
	};
	
	this.rightHandTarget = function() {
		let vertebraDir = this.backbone[2].direction;
		let armDir = new Vector(vertebraDir.x, vertebraDir.y);
		armDir.rotate(Math.PI/4);
		armDir.resize(this.armSize);
		return armDir.translate(this.backbone[2].center);
	};
	
	this.leftFootTarget = function() {
		let vertebraDir = this.backbone[5].direction;
		let armDir = new Vector(vertebraDir.x, vertebraDir.y);
		armDir.rotate(-Math.PI/4);
		armDir.resize(this.armSize);
		return armDir.translate(this.backbone[5].center);
	};
	
	this.rightFootTarget = function() {
		let vertebraDir = this.backbone[5].direction;
		let armDir = new Vector(vertebraDir.x, vertebraDir.y);
		armDir.rotate(Math.PI/4);
		armDir.resize(this.armSize);
		return armDir.translate(this.backbone[5].center);
	};
	
	this.init();
};

function Vertebra(x,y,parent) {
  this.center = new Point(x,y);
  this.parent = parent;
  this.direction = new Vector(0,0);
  this.radius = 2;
  this.color = 'black';
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };
};

var bestiau = new Creature(9,150,150);
var target = new Point(300,300);

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