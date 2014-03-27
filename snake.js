$(document).ready(function(){
	$(document).keydown(function(event){
//        console.log(event.which);
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
                
            case 38:
                direction = 0; break; //up
            case 37:
                direction = 1; break; //left
            case 40:
                direction = 2; break; //down
            case 39:
                direction = 3; break; //right
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
    
    var tmpW = 900;
    var tmpH = 600;
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
	//context.save();
	
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
    
    context.fillStyle = "#000000";
    
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
        
        //make a new one
        pellet = game.createFoodPellet();
    }
    else
    {
        game.snakeBody.pop(); //if no pellet, remove the tail
    }
    //check for snake body
//    if({x:posX, y:posY} in game.snakeBody)
//    if($.inArray({x:posX, y:posY}, game.snakeBody, 1))
    var tmp = game.snakeBody.indexOf({x:posX, y:posY});
    console.log(tmp);
//    if(game.snakeBody.indexOf({x:posX, y:posY}) >= 1)
    if(game.snakeBody.contains({x:posX, y:posY}))
    {
        alert("game over");
    }
    
    //TODO avoid shift/unshift
    //remove tail
//    game.snakeBody.pop();
    //insert as new head
    game.snakeBody.unshift({x:posX, y:posY});
    //test
//    console.log(posX+ " " + posY);
    
    
    
    
    //draw the food pellet
    context.fillStyle = "#FFE48D";
    context.fillRect(pellet.x, pellet.y, width, height);
    
    
    //draw the "snake"
    context.fillStyle = "#0000ff";
    context.fillRect(posX, posY, game.blockWidth, game.blockWidth);
    game.drawSnake(context);
    
	
//	var coords = "x: "+mouseX+", y: "+mouseY;
//	context.fillStyle="#000000";
//	context.font="20px Arial";
//	context.fillText(coords, 10, 30);
	
//	$("#text").html("<br>" + coords)
//	.append("<br>radians: " + getRotation(b_x,b_y));
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
//TODO use prototypes to define methods
function SnakeGame(width, height)
{
    //TODO extract snakeBody to new class?
//    var snakeBody = new Array();
//    var snakeBody = [{x:0, y:0}];
    SnakeGame.prototype.snakeBody = [{x:0, y:0}];
    
    var score = 0;
    
    SnakeGame.prototype.blockWidth = 15;
    
    SnakeGame.prototype.createFoodPellet = createFoodPellet;
    
    function createFoodPellet()
    {
        //naive algoritm -- doesn't check that it is possible to get or not intersecting the snake
        var randX = Math.round((Math.random()*width)/this.blockWidth)*this.blockWidth;
        var randY = Math.round((Math.random()*height)/this.blockWidth)*this.blockWidth;
        
        return {x: randX, y:randY};
    }
    
    function getFoodPellet()
    {
        //append to snake
        score++;
        //createFoodPellet()
        //increase speed
    }
    function incrementSpeed()
    {
        
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
}
