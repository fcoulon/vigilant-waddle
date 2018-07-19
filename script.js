var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var running = false;

var ball = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 1,
  radius: 3,
  color: 'black',
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

var ball2 = Object.create(ball);
ball2.x = 80;
ball2.y = 100;

var ball3 = Object.create(ball);
ball3.x = 60;
ball3.y = 100;

var target = {
	x : 300,
	y : 300
};

function clear() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

function draw() {
	
	var size = Math.sqrt((ball.x - target.x) * (ball.x - target.x) + (ball.y - target.y) * (ball.y - target.y));
	var size2 = Math.sqrt((ball.x - ball2.x) * (ball.x - ball2.x) + (ball.y - ball2.y) * (ball.y - ball2.y));
	var size3 = Math.sqrt((ball2.x - ball3.x) * (ball2.x - ball3.x) + (ball2.y - ball3.y) * (ball2.y - ball3.y));
	var speed = 2;
	
	ball.vx = (target.x - ball.x) / size * speed;
	ball.vy = (target.y - ball.y) / size * speed;
	
	ball2.vx = (ball.x - ball2.x) / size2 * speed;
	ball2.vy = (ball.y - ball2.y) / size2 * speed;
	
	ball3.vx = (ball2.x - ball3.x) / size3 * speed;
	ball3.vy = (ball2.y - ball3.y) / size3 * speed;
	
  clear();
  ball.draw();
  ball2.draw();
  ball3.draw();
  
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  if(size2 > 20) {
	  ball2.x += ball2.vx;
	  ball2.y += ball2.vy;
  }
  
  if(size3 > 20) {
	  ball3.x += ball3.vx;
	  ball3.y += ball3.vy;
  }

  if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
    ball.vx = -ball.vx;
  }

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