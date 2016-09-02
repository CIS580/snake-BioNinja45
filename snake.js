/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var speed = 1/5;
var appleLocations = [];
var time = 625;
var snake = [];
var firstHead = [];
firstHead.push(200);
firstHead.push(200);
snake.push(firstHead);
var lastSnakePosition = [];
lastSnakePosition.push(firstHead);
var lastSnakePositionX= 0;
var lastSnakePositionY = 0;
var applesEaten = 0;
var gameOver = false;

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
  
	window.requestAnimationFrame(loop);
  
}
//var intervalId = setInterval(loop,speed);


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
	
	
	if(gameOver)
	{
		return;
	}
	var snakeSpeed = speed * elapsedTime;
	
	time+=1;
	// TODO: Spawn an apple periodically
	if(time%100== 0){
		
		var height = Math.floor((Math.random() * backBuffer.height) + 1);
		var width = Math.floor((Math.random() * backBuffer.width) + 1);
		appleLocations.push([height,width]);
	}
	
	if(input.up||input.down||input.left||input.right){
		for(i=0;i<snake.length;i++){
			var snakeSegment = snake[i];
			// TODO: Move the snake
			if(i==0){
				if(input.up)snakeSegment[1]-=snakeSpeed;
				if(input.down)snakeSegment[1]+=snakeSpeed;
				if(input.left)snakeSegment[0]-=snakeSpeed;
				if(input.right)snakeSegment[0]+=snakeSpeed;
			}
			 // TODO: Grow the snake periodically
			else
			{
				snake[i] = lastSnakePosition[lastSnakePosition.length-i];
				console.log(lastSnakePosition[lastSnakePosition.length-i][0] + " " + lastSnakePosition[lastSnakePosition.length-i][1])
				console.log(i);
			}
			// TODO: Determine if the snake has eaten an apple
			appleLocations.forEach(function(item,index,array){
				var d2 = Math.pow(parseInt(item[0])-snakeSegment[0],2) + Math.pow(parseInt(item[1])-snakeSegment[1],2);
				if(d2<=Math.pow(10+5,2))
				{
					addSnakeSegment = [];
					addSnakeSegment.push(parseInt(lastSnakePositionX));
					addSnakeSegment.push(parseInt(lastSnakePositionY));
					snake.push(addSnakeSegment);
					appleLocations.splice(index,1);
					console.log(lastSnakePosition[0][0] + " " + lastSnakePosition[0][1]);
					console.log(snakeSegment[0] + " " + snakeSegment[1]);
					console.log(snake.length);
					console.log(lastSnakePosition.length);
				}
			});
			
			// TODO: Determine if the snake has moved out-of-bounds (offscreen)
			if(snake[0][0] > backBuffer.width-12 || snake[0][0] < 2 || snake[0][1] > backBuffer.height-12 || snake[0][1] < 2){
				gameOver = true;
			}
			// TODO: Determine if the snake has eaten its tail
			if(i<5){continue;}
			var d2 = Math.pow(snake[0][0]-snake[i][0],2)+ Math.pow(snake[0][1]-snake[i][1],2);
			if(d2<=Math.pow(15,2))
			{
				gameOver = true;
			}
				
		}
	}
  //});
	
  
	
  
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle
  
  //Distance formula: d^2 = (x1-x2)^2 + (y1-y2)^2
  //d^2 <=> (r1+r2)^2
  // < is overlap, = is intersect, > is no collision
  
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
  if(time%2==0)
  {
	  if(input.up||input.down||input.left||input.right){
		  var snakeHead = snake[0];
		  var last = [];
		  last.push(snakeHead[0]);
		  last.push(snakeHead[1]);
		  lastSnakePosition.push(last);
	  }
	  //lastSnakePosition[0] = snakeHead;
	  //lastSnakePositionX=snakeHead[0];
	  //lastSnakePositionY=snakeHead[1];
	  //console.log(lastSnakePosition[0][0]);
	  //console.log(lastSnakePosition[0][1]);
  }
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
	for(i=0;i<snake.length;i++){
		backCtx.fillRect(snake[i][0],snake[i][1],10,10);
	}
	//snake.forEach(function(snakeSegment,index,array){
	//	backCtx.fillRect(snakeSegment[0],snakeSegment[1],10,10);
	
	//});
}

window.onkeydown = function(event)
{
	event.preventDefault();
	switch(event.keyCode)
	{
		 case 38:
		 case 87:
			input.up = true;
			input.left = false;
			input.down = false;
			input.right = false;
			break;
		 case 37:
		 case 65:
			input.left = true;
			input.up = false;
			
			input.down = false;
			input.right = false;
			break;
		 case 40:
		 case 83:
			input.down = true;
			input.up = false;
			input.left = false;
			input.right = false;
			break;
		 case 39:
		 case 68:
			input.right = true;
			input.up = false;
			input.left = false;
			input.down = false;
			
			break;
		 case 32:
			gameOver = false;
			snake = [];
			firstHead = [];
			firstHead.push(200);
			firstHead.push(200);
			snake.push(firstHead);
			appleLocations=[];
			break;
	}
}


/* Launch the game */
window.requestAnimationFrame(loop);
