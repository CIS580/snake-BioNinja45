/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var speed = 1/1000;
var appleLocations = [];
var time = 625;
var snake = ["0","0"];
var snakeX = 0;
var snakeY = 0;

var input = {
	up:false,
	down:false,
	left:false,
	right:false
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  update(elapsedTime);
  render(elapsedTime);

  frontCtx.clearRect(0,0,frontBuffer.width,frontBuffer.height);
  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  //window.requestAnimationFrame(loop);
}
var intervalId = setInterval(loop,speed);


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
	//multiply snake speed by elapsedtime to have same speed across refresh rates
	// TODO: Spawn an apple periodically
	var snakeSpeed = speed * elapsedTime;
	
	if(time%625 == 0){
		var height = Math.floor((Math.random() * backBuffer.height) + 1);
		var width = Math.floor((Math.random() * backBuffer.width) + 1);
		appleLocations.push([height,width]);
	}
	time+=1;
	
  
  // TODO: Grow the snake periodically
  // TODO: Move the snake
	if(input.up)snakeY-=1;
	if(input.down)snakeY+=1;
	if(input.left)snakeX-=1;
	if(input.right)snakeX+=1;
	
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle
  
  //Distance formula: d^2 = (x1-x2)^2 + (y1-y2)^2
  //d^2 >=< (r1+r2)^2
  // > is overlap, = is intersect, < is no collision
  
  //Check to see if a box is in collision with another box
  //
  // _____ 
  //|     |
  //|  A _|___
  //|___|_|   |
  //    |  B  |
  //	|_____|
  // Not in collision = (Abot > Btop || Atop > Bbot || Aleft > Bright || Aright > Bleft)
  // In collision = !(Abot > Btop || Atop > Bbot || Aleft > Bright || Aright > Bleft)
  
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  //var arr = []
  //var arr = new Array();
  //var arr = [{(xpos:0,ypos:5,radius:3)}]
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
	backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

	appleLocations.forEach(function(item,index,array){
	  backCtx.fillStyle = "blue";
	  backCtx.fillRect(parseInt(item[0]),parseInt(item[1]),5,5);
	});
	// TODO: Draw the game objects into the backBuffer
	backCtx.fillStyle = "#FF0000";
	backCtx.fillRect(snakeX,snakeY,10,10);
}

window.onkeydown = function(event)
{
	event.preventDefault();
	switch(event.keyCode)
	{
		 case 38:
		 case 87:
			input.up = true;
			break;
		 case 37:
		 case 65:
			input.left = true;
			break;
		 case 40:
		 case 83:
			input.down = true;
			break;
		 case 39:
		 case 68:
			input.right = true;
			break;
	}
}
window.onkeyup = function(event)
{
	event.preventDefault();
	switch(event.keyCode)
	{
		 case 38:
		 case 87:
			input.up = false;
			break;
		 case 37:
		 case 65:
			input.left = false;
			break;
		 case 40:
		 case 83:
			input.down = false;
			break;
		 case 39:
		 case 68:
			input.right = false;
			break;
	}
}

/* Launch the game */
window.requestAnimationFrame(loop);
