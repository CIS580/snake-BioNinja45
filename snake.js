/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var newTime = performance.now();
var oldTime = performance.now();
var speed = 1/4;
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
var obstacle = [];
var obstacleHeight = 150;
var obstacleWidth = 150;
obstacle.push(obstacleHeight);
obstacle.push(obstacleWidth);
var obstacleLocations = [];
obstacleLocations.push(obstacle);

var input = {
	up:false,
	down:false,
	left:false,
	right:true
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
	var t0 = performance.now();
   
    
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  update(elapsedTime);
  var t1 = performance.now();
    console.log("update: " + (t1 - t0));
  render(elapsedTime);
  var t2 = performance.now();
    console.log("Render: " + (t2 - t1));
  frontCtx.clearRect(0,0,frontBuffer.width,frontBuffer.height);
  
  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  
	//window.requestAnimationFrame(loop);
  
}
var intervalId = setInterval(loop,60);


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
	var snakeSpeed = speed * 25;
	time+=1;
	// TODO: Spawn an apple periodically
	if(time%10== 0){
		
		var height = Math.floor((Math.random() * backBuffer.height) + 1);
		var width = Math.floor((Math.random() * backBuffer.width) + 1);
		appleLocations.push([height,width]);
	}
	
	if(input.up||input.down||input.left||input.right){
		for(i=0;i<snake.length;i++){
			
			if(gameOver){continue;}
			
			
			var snakeSegment = snake[i];
			// TODO: Move the snake
			if(i==0){
				if(input.up && !input.down)snakeSegment[1]-=snakeSpeed;
				if(input.down && !input.up)snakeSegment[1]+=snakeSpeed;
				if(input.left && !input.right)snakeSegment[0]-=snakeSpeed;
				if(input.right && !input.left)snakeSegment[0]+=snakeSpeed;
			}
			 // TODO: Grow the snake periodically
			else
			{
				snake[i] = lastSnakePosition[lastSnakePosition.length-i];
				//console.log(lastSnakePosition[lastSnakePosition.length-i][0] + " " + lastSnakePosition[lastSnakePosition.length-i][1])
				//console.log(i);
			}
			// TODO: Determine if the snake has eaten an apple
			appleLocations.forEach(function(item,index,array){
				var d2 = Math.pow(parseInt(item[0])-snakeSegment[0],2) + Math.pow(parseInt(item[1])-snakeSegment[1],2);
				if(d2<=Math.pow(9,2))
				{
					addSnakeSegment = [];
					addSnakeSegment.push(parseInt(lastSnakePositionX));
					addSnakeSegment.push(parseInt(lastSnakePositionY));
					snake.push(addSnakeSegment);
					appleLocations.splice(index,1);
					//console.log(lastSnakePosition[0][0] + " " + lastSnakePosition[0][1]);
					//console.log(snakeSegment[0] + " " + snakeSegment[1]);
					//console.log(snake.length);
					//console.log(lastSnakePosition.length);
				}
			});
			
			// TODO: Determine if the snake has moved out-of-bounds (offscreen)
			if(snake[0][0] > backBuffer.width-10 || snake[0][0] < 0 || snake[0][1] > backBuffer.height-10 || snake[0][1] < 0){
				GameOver();
				return;
			}
			// TODO: Determine if the snake has eaten its tail
			if(i<3){continue;}
			var d2 = Math.pow(snake[0][0]-snake[i][0],2)+ Math.pow(snake[0][1]-snake[i][1],2);
			if(d2<=Math.pow(12,2))
			{
				GameOver();
				return;
			}
			
			
				
		}
		// TODO: [Extra Credit] Determine if the snake has run into an obstacle
			obstacleLocations.forEach(function(item,index,array){
				//console.log("hi");
				var d2 = Math.pow(snake[0][0]-item[0]+5,2) + Math.pow(snake[0][1]-item[1]+5,2);
				//console.log(item[0] + " " + item[1]);
				//console.log(snake[0][0] + " " + snake[0][1]);
				//console.log(d2);
				if(d2<=Math.pow(55,2)){
					//console.log(Math.pow(55,2));
					GameOver();
					return;
				}
			});
	}
  //});
	
  
  
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
  
	 
	  if(input.up||input.down||input.left||input.right){
		  var snakeHead = snake[0];
		  var last = [];
		  last.push(snake[0][0]);
		  last.push(snake[0][1]);
		  lastSnakePosition.push(last);
	  }
	  if(lastSnakePosition.length > 100){
		  lastSnakePosition.shift();
	  }
	  //console.log(lastSnakePosition.length);
	  //lastSnakePosition[0] = snakeHead;
	  //lastSnakePositionX=snakeHead[0];
	  //lastSnakePositionY=snakeHead[1];
	  //console.log(lastSnakePosition[0][0]);
	  //console.log(lastSnakePosition[0][1]);
  
}

function GameOver(){
	input.right = true;
	input.up = false;
	input.left = false;
	input.down = false;
	gameOver = true;
	snake = [];
	appleLocations = [];
}
/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
	if(gameOver){
		backCtx.fillStyle = "black";
		backCtx.font = "100px Arial";
		backCtx.fillText("GAME OVER",100,200);
		backCtx.font = "50px Arial";
		backCtx.fillText("Press Space to restart",140,300);
		clearInterval(intervalId)
		return;
	}
	// TODO: Draw the game objects into the backBuffer
	backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
	
	 
	// TODO: Show current score to user at all times
	backCtx.fillStyle = "black";
		backCtx.font = "25px Arial";
		backCtx.fillText(snake.length-1,backBuffer.width - 35,25);
	
	obstacleLocations.forEach(function(item,index,array){
		backCtx.fillStyle = "green";
		backCtx.arc(item[0],item[1],50,2*Math.PI,false);
		backCtx.fill();
		//backCtx.fillRect(item[0],item[1],100,100);
	});
	
	appleLocations.forEach(function(item,index,array){
	  backCtx.fillStyle = "blue";
	  backCtx.fillRect(parseInt(item[0]),parseInt(item[1]),5,5);
	});
	
	backCtx.fillStyle = "#FF0000";
	for(i=0;i<snake.length;i++){
		backCtx.fillRect(snake[i][0],snake[i][1],10,10);
	}
	
	
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
			firstHead = [];
			firstHead.push(200);
			firstHead.push(200);
			snake.push(firstHead);
			intervalId = setInterval(loop,60);
			break;
	}
}


/* Launch the game */
//window.requestAnimationFrame(loop);
