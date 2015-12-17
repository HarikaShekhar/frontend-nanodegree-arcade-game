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

    if (this.x >= 800) {
        this.x = -120;
    }
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
    //The image/sprite for Player
    this.sprite = 'images/char-princess-girl.png';
}


Player.prototype.update = function() {
    if (this.x < 0) {
        this.x = 0;
    }
    else if (this.x > 700) {
        this.x = 700;
    }
    else if (this.y < 82) {
        this.y = 497;
    }
    else if (this.y > 497) {
        this.y = 497;
    }
};

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
        this.x = 300;
        this.y = 497;
    }
};

Player.prototype.handleInput = function(keyInput) {
    switch(keyInput) {
        case "left" :
            this.x -= 101;
            break;
        case "up" :
            this.y -= 83;
            break;
        case "right" :
            this.x += 101;
            break;
        case "down" :
            this.y += 83;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyOne = new Enemy(-120, 150, 100);
var enemyTwo = new Enemy(-120, 225, 200);
var enemyThree = new Enemy(-120, 310, 150);
var enemyFour = new Enemy(-120, 150, 20);
var enemyFive = new Enemy(-120, 225, 50);
var enemySix = new Enemy(-120, 310, 30);
//Push enemies to the allEnemies array
allEnemies.push(enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive, enemySix);

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
});


document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        var move = document.getElementById('move');
        move.volume = 0.2;
        move.play();
    }

});