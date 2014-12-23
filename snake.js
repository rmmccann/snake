$(document).ready(function(){
	$(document).keydown(function(event){
        switch(event.which)
        {
            case 119:
                direction = 0; break; //w
            case 97:
                direction = 1; break; //a
            case 115:
                direction = 2; break; //s
            case 100:
                direction = 3; break; //d
                
            case 38: //up
                if(game.snakeBody.length == 1 || !down()) direction = 0; break;
            case 37: //left
                if(game.snakeBody.length == 1 || !right()) direction = 1; break;
            case 40: //down
                if(game.snakeBody.length == 1 || !up()) direction = 2; break;
            case 39: //right
                if(game.snakeBody.length == 1 || !left()) direction = 3; break;

            case 192: // '`'
                if(location.protocol !== "file:") return; //only enable debugging for local versions
                game.debug.duplicateTail(6);
                game.debug.printFoodLocation();
        }
    });
    
//    setInterval(update, 1000/60); //60fps
    var fps = 10;
    setInterval(update, 1000/fps);
    
    posX = 0;
    posY = 0;
    width = 15;
    height = 15;
    
    direction = 3;
    
    var tmpW = 750;
    var tmpH = 495;
    game = new SnakeGame(tmpW, tmpH);
    pellet = game.createFoodPellet();
    console.log(game);
    
//    var Game = new SnakeGame(tmpW, tmpH);
//    var Game = new SnakeGame(canvas.width, canvas.height);
});

var posX, posY, width, height;
var direction;
    
//var canvas = document.getElementById("canvas");
//var context = canvas.getContext("2d");

var game;
var pellet;

//specific to this game (assumes all elements are unique {x,y} tuples)
Array.prototype.contains = function(elem)
{
    for(var i in this)
    {
        if(this[i].x==elem.x && this[i].y==elem.y) return true;
    }
    return false;
}

function update()
{
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
    
    //update the square position
    posX += deltaX()+canvas.width;
    posY += deltaY()+canvas.height;
    //wrapping
    posX = posX % canvas.width;
    posY = posY % canvas.height;
    
    //if there is a pellet there,
    if(posX===pellet.x && posY===pellet.y) //extract to function
    {
        //eat the pellet!
        game.eatFoodPellet();
        
        //make a new one
        pellet = game.createFoodPellet();
    }
    else
    {
        game.snakeBody.pop(); //if no pellet, remove the tail
    }
    
    //check for snake body
    if(game.snakeBody.contains({x:posX, y:posY}))
    {
        alert("Game Over!");
        game.reset();
    }
    
    //TODO avoid shift/unshift
    //insert as new head
    game.snakeBody.unshift({x:posX, y:posY});
    
    context.clearRect(0,0,canvas.width,canvas.height);
    
    //clear background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,game.width,game.height);
    
    //draw the food pellet
    context.fillStyle = "#FFE48D";
//    context.fillStyle = "#CCCCCC";
    context.fillRect(pellet.x, pellet.y, width, height);
    
    //draw the "snake"
    context.fillRect(posX, posY, game.blockWidth, game.blockWidth);
    game.drawSnake(context);
}

function up(){return direction===0}
function down(){return direction===2}
function left(){return direction===1}
function right(){return direction===3}

function deltaX(){
    var d = 0;
    d += left()?-1*width:0;
    d += right()?width:0;
    return d;
}
function deltaY(){
    var d = 0;
    d += up()?-1*width:0;
    d += down()?width:0;
    return d;
}

//Object that controls game logic
function SnakeGame(width, height)
{
    //TODO extract snakeBody to new class?
    SnakeGame.prototype.snakeBody = [{x:0, y:0}];
    
    var score = 0;
    
    this.width = width;
    this.height = height;
    
    SnakeGame.prototype.blockWidth = 15;
    
    SnakeGame.prototype.createFoodPellet = createFoodPellet;
    SnakeGame.prototype.eatFoodPellet = eatFoodPellet;
    
    function createFoodPellet()
    {
        /*
		naive algoritm
		-make sure pellet is within game bounds
		-as snake gets larger, more collisions will occur
		*/
        var randX = Math.round((Math.random()*(width-this.blockWidth))/this.blockWidth)*this.blockWidth;
        var randY = Math.round((Math.random()*(height-this.blockWidth))/this.blockWidth)*this.blockWidth;
		var newPellet = {x: randX, y:randY};
		
		//if the snake is already occupying that position, recurse and generate a different point
		if(this.snakeBody.contains(newPellet)) {
			newPellet = createFoodPellet();
		}
        
        return newPellet;
    }
    
    function eatFoodPellet()
    {
        //append to snake
        score++;
        $("#scoreText").text(score);
        //createFoodPellet()
        //increase speed
    }
    function incrementSpeed()
    {
        
    }
    
    SnakeGame.prototype.reset = function()
    {
        score = 0;
        $("#scoreText").text(0);
        //reset snakeBody
        this.snakeBody.splice(0, Number.MAX_VALUE);
    }
    
    SnakeGame.prototype.drawSnake = function(context)
    {
        context.fillStyle = "#000000";
        for(var segment in this.snakeBody)
        {
            segment = this.snakeBody[segment];
            context.fillRect(segment.x, segment.y, game.blockWidth, game.blockWidth);
        }
    }

    SnakeGame.prototype.debug =
    {
        duplicateTail: function(numTimes)
        {
            var tail = game.snakeBody[game.snakeBody.length-1];
            for(var i=0; i<numTimes; i++)
            {
                game.snakeBody.push(tail);
            }
            score+=numTimes;
        },
        printFoodLocation: function()
        {
            console.log("Food pellet at: (" + pellet.x + ", " + pellet.y + ")");
        }
    }
}
