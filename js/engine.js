/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 808;
    canvas.height = 689;

    // reset the game variables for game restart
    //resets player lives, score, timer, level and enemy speed
    doc.addEventListener('keydown', function(e) {
        if ((e.keyCode == 13) && gameRestart ) {
            canvas.width = canvas.width;
            player.lives = 3;
            player.score = 0;
            player.seconds = 60;
            player.level = 1;
            allEnemies.forEach(function(enemy) {
                if (enemy != rockOne && enemy != rockTwo) {
                    enemy.speed -= 50;
                }
            })
            gameRestart = false;
            gameWin = false;
            console.log("entered");
            clock();
        }
    });

    doc.body.appendChild(canvas);


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();


        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
        clock();
    }


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within allEnemies array and player object as defined in app.js
     * and call the player checkcollision() method.
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            player.checkCollision(enemy);
        })
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array except rock objects as defined in app.js
     * and calls their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            if (enemy != rockOne && enemy != rockTwo) {
                enemy.update(dt);
            }
        });
        player.update();
    }

    /* This is called by the render() function. This function checks for the gameRestart
     * status and displays appropriate message on the canvas. Also resets player and
     * enemy after reset.
     */
    function game()
    {
        if(gameRestart) {
            // TODO : Draw text on the canvas for Game Over and Game Restart
            var gameover = document.getElementById('gameover');
            gameover.volume = 0.2;
            gameover.play();

            ctx.font = "30pt Impact";
            ctx.textAlign = "center";
            ctx.lineWidth = "3";
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, 808, 689);
            ctx.fillStyle="white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = "2";

            if (gameWin) {
                ctx.fillText("You Win!!!", canvas.width / 2, 100);
                ctx.fillText("Play Again!!!", canvas.width / 2, 200);
                ctx.strokeText("You Win!!!", canvas.width / 2, 100);
                ctx.strokeText("Play Again!!!", canvas.width / 2, 200);

            }
            else {
                ctx.fillText("Game Over!!!", canvas.width / 2, 100);
                ctx.fillText("Try Again!!!", canvas.width / 2, 200);
                ctx.strokeText("Game Over!!!", canvas.width / 2, 100);
                ctx.strokeText("Try Again!!!", canvas.width / 2, 200);
            }
            ctx.fillText("Last Score: " + player.score, canvas.width / 2, 300);
            ctx.fillText("Press ENTER key to Restart Game", canvas.width / 2, 400);
            ctx.strokeText("Last Score: " + player.score, canvas.width / 2, 300);
            ctx.strokeText("Press ENTER key to Restart Game", canvas.width / 2, 400);

            player.reset();
            allEnemies.forEach(function(enemy) {
                if (enemy != rockOne && enemy != rockTwo) {
                    enemy.reset();
                }
            });
        }
    }

    /* This is called by the init() function. This function implements a One - minute
     * timer. Reduces player life after every minute, resets player position and game.
     */
    function clock() {
        if (player.lives > 0) {
            player.seconds--;
            if(player.seconds > 0 ) {
                setTimeout(clock, 1000);
            }
            else {
                player.lives--;
                player.seconds = 60;
                player.reset();
                if (player.lives == 0) {
                    gameRestart = true;
                }
                setTimeout(clock, 1000);
            }
        }
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 7,
            numCols = 8,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        // draw player Score and Game level
        ctx.font = "20pt Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Level : " + player.level, 310, 80);
        ctx.strokeText("Level : " + player.level, 310, 80);
        ctx.fillText("Score : ", 620, 80);
        ctx.strokeText("Score : " , 620, 80);
        ctx.fillText(player.score, 720, 80);
        ctx.strokeText(player.score ,720, 80);

        //draw player lives on the canvas
        for (var i = 1; i <= player.lives; i++) {
            ctx.drawImage(Resources.get("images/Heart.png"), 5 + (30 * (i - 1)), 50, 30, 30);
        }

        game();

        // display Timer seconds
        if (gameRestart == false) {
        ctx.fillText("Time : ", 430, 80);
        ctx.strokeText("Time : " , 430, 80);
        ctx.fillText("0 : " + (player.seconds < 10 ? "0" : "") + String(player.seconds), 520, 80);
        ctx.strokeText("0 : " + (player.seconds < 10 ? "0" : "") + String(player.seconds) , 520, 80);
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            // enemy.render();
            if (gameRestart == false) {
                enemy.render();
            }
        });

        player.render();

    }


    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {

    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        // 'images/char-boy.png'
        'images/char-princess-girl.png',
        'images/Heart.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
