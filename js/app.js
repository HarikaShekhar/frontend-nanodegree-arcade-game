"use strict";
var gameRestart = false;

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
    if (this.x >= 800) {
        this.reset();
    }
};

Enemy.prototype.reset = function() {
    this.x = -120;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.score = 0;
    this.seconds = 60;
    //The image/sprite for Player
    this.sprite = 'images/char-princess-girl.png';
}


Player.prototype.update = function() {
    if (this.y < 82) {
        //TODO: Add reset for Player
        player.reset();

        //TODO: Increase Score
        this.score += 100;
        if ((this.score % 500 == 0) && this.lives < 3) {
            player.lives++;
        }
    }
};

// Player.prototype.timer = function() {
//     this.seconds--;
//     console.log(this.seconds);

// };

Player.prototype.reset = function() {
    // TODO: add reset Function for Player
    this.x = 300;
    this.y = 497;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.fillText("0:" + (this.seconds < 10 ? "0" : "") + String(this.seconds), 650, 80);
    // ctx.strokeText("0:" + (this.seconds < 10 ? "0" : "") + String(this.seconds) , 650, 80);
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
        if (this.lives == 0) {
            gameRestart = true;
        }
        //TODO: Call reset() for Player
        this.reset();
    }
};

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
var enemyOne = new Enemy(-120, 150, 180);
var enemyTwo = new Enemy(-120, 225, 220);
var enemyThree = new Enemy(-120, 310, 150);
var enemyFour = new Enemy(-120, 150, 80);
var enemyFive = new Enemy(-350, 225, 200);
var enemySix = new Enemy(-350, 310, 300);
var enemySeven = new Enemy(-350, 310, 400);
//Push enemies to the allEnemies array
allEnemies.push(enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive, enemySix, enemySeven);

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

    player.handleInput(allowedKeys[e.keyCode]);
    if(allowedKeys.hasOwnProperty(e.keyCode)) {
        var move = document.getElementById('move');
        move.volume = 0.2;
        move.play();
    }
});