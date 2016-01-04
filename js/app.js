"use strict";
//restart switch: game restarts for true and displays restart instructions
var gameRestart = false;
//holds game win status
var gameWin = false;
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //TODO: Call reset() when enemy moves out of boundary
    //reset enemy position after a certain point
    if (this.x >= 800) {
        this.reset();
    }
};

//resets enemy position
Enemy.prototype.reset = function() {
    this.x = -120;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//rock the player should avoid collision
var Rock = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Rock.png';
};

//draw the rocks on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    //total lives
    this.lives = 3;
    //initial score
    this.score = 0;
    //initial timer
    this.seconds = 60;
    //initial game level
    this.level = 1;
    //The image/sprite for Player
    this.sprite = 'images/char-princess-girl.png';
}

//update player position
Player.prototype.update = function() {
    if (this.y < 82) {
        //TODO: Add reset for Player
        //reset player position if he reaches first line of water
        this.reset();

        //TODO: Increase Score
        //update score if the player reaches first line of water
        //add life for every 500 points and total lives is less than 3
        this.score += 100;
        if ((this.score % 500 == 0) && this.lives < 3) {
            this.lives++;
        }
        //Increase enemy speed for each level, for every 1000 score
        if (this.score > 0 && this.score % 1000 == 0 && this.level < 3) {
            this.level++;
            console.log(this.level);
            allEnemies.forEach(function(enemy) {
                enemy.speed = enemy.speed + 25;
            });
        }
        //restart game at level 3 and max score : 3000
        if(this.score == 3000 && this.level == 3) {
            gameWin = true;
            gameRestart = true;
        }

    }
};

//resets player position
Player.prototype.reset = function() {
    // TODO: add reset Function for Player
    this.x = 300;
    this.y = 497;
};


//draw player on the canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The checkCollision function checks for a collision between a player and enemy.
//The function resets the player to original position, after every collision.
Player.prototype.checkCollision = function(enemy) {
    if (this.x < enemy.x + 60 && this.x + 65 > enemy.x && this.y < enemy.y + 45 && this.y + 60 > enemy.y) {
        var crash = document.getElementById('crash');
        crash.volume = 0.05;
        crash.play();
        //Minus 1 total number of lives
        this.lives--;
        // TODO: Add functionality for Game Restart after losing 3 lives.
        //restart game after losing 3 lives
        if (this.lives == 0) {
            gameRestart = true;
        }
        //TODO: Call reset() for Player
        //reset player position after collision
        this.reset();
    }
};

//function to move player on the canvas
Player.prototype.handleInput = function(keyInput) {
    switch(keyInput) {
        case "left" :
            if (this.x > 0) {
                this.x -= 101;
                }
            break;
        case "up" :
            this.y -= 83;
            break;
        case "right" :
            if (this.x < 700) {
                this.x += 101;
                }
            break;
        case "down" :
            if (this.y < 497) {
                this.y += 83;
                }
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyOne = new Enemy(-120, 150, 130);
var enemyTwo = new Enemy(-120, 225, 170);
var enemyThree = new Enemy(-120, 310, 100);
var enemyFour = new Enemy(-120, 150, 30);
var enemyFive = new Enemy(-350, 225, 150);
var enemySix = new Enemy(-350, 310, 250);
var enemySeven = new Enemy(-350, 310, 350);
var enemyEight = new Enemy(-180, 150, 400);
var rockOne = new Rock(303, 230);
var rockTwo = new Rock(604, 145);
//Push enemies  and rocks to the allEnemies array
allEnemies.push(enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive, enemySix, enemySeven, enemyEight, rockOne, rockTwo);

//player object for the game
var player = new Player(300, 497);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    //sounds for player movement across the canvas
    player.handleInput(allowedKeys[e.keyCode]);
    if(allowedKeys.hasOwnProperty(e.keyCode)) {
        var move = document.getElementById('move');
        move.volume = 0.2;
        move.play();
    }
});