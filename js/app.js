const modal = document.querySelector('.modal');
const resetBtn = document.querySelector('.reset');
const starCounth3 = document.querySelector('.star-count')
const modalStarCount = document.querySelector('.star-count-modal')
const start = true;
let starCount = 0;
// Enemies our player must avoid
class Enemy {
    constructor(posX, posY, speed) {
        this.sprite = 'images/enemy-bug.png';
        this.posX = posX;
        this.posY = posY;
        this.speed = this.enemySpeed();
    }

    enemySpeed() {
        if (start) {
            return RNG(500, 250)
        } else {
            return 0
        }
    }

    //When an enemy goes off-screen it will go back to start with a new random speed.
    enemyLoop(el) {
        if (el.posX > 500) {
            el.posX = -100;
            el.speed = RNG(500, 250);
        }
    }
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.posX = this.posX += this.speed * dt;

        this.enemyLoop(this);
        this.enemyLoop(this);
        this.enemyLoop(this);
    }
    // render enemy on canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}



// Player class
class Player {
    constructor(posX, posY) {
        this.character = 'images/char-cat-girl.png';
        this.posX = posX;
        this.posY = posY;
    }

    //Checks which allowed key is pressed 
    handleInput(aK) {
        if (aK === 'left' && this.posX > 0) {
            this.posX = this.posX -= 100;
        }
        if (aK === 'up' && this.posY > 0) {
            this.posY = this.posY -= 85;
        }
        if (aK === 'right' && this.posX < 400) {
            this.posX = this.posX += 100;
        }
        if (aK === 'down' && this.posY < 400) {
            this.posY = this.posY += 85;
        }
    }

    //Detects wether the player collided with an obj 
    detectCollision(array) {
        for (let obj of array) {
            if (this.posX > obj.posX && this.posX < obj.posX + 75 && this.posY === obj.posY) {
                this.onCollide();
            }
            if (this.posX < obj.posX && this.posX > obj.posX - 75 && this.posY === obj.posY) {
                this.onCollide();
            }
        }
    }

    detectStarCollision() {
        if (this.posY === star1.posY && this.posX === star1.posX) {
            star1.posX = randomCoord(xCoords)
            star1.posY = randomCoord(yCoords)
            starCount++
            starCounth3.innerHTML = `Star Count ${starCount}`
        }
    }

    //When player collides, reset.
    onCollide() {
        gameOver()
        
    }
    //checks to see if the player has reached the water
    checkWin() {
        if (this.posY < 40) {
            modalStarCount.innerHTML = `Star Count: ${starCount}`
            modal.style.display = 'block';
            allEnemies.forEach(el => {
                el.speed = 0;
            })
            
        }
    }

    update(dt) {
        this.detectCollision(allEnemies);
        this.detectStarCollision()
        this.checkWin();
    }

    render() {
        ctx.drawImage(Resources.get(this.character), this.posX, this.posY);
    }
}

//CODE FOR MAKING STAR APPEAR IN RANDOM SPOTS
const xCoords = [400, 300, 200, 100, 0]
const yCoords = [60, 145, 230]

function randomCoord(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

//STAR CLASS
class Star {
    constructor(posX, posY) {
        this.star = 'images/Star.png'
        this.posX = posX
        this.posY = posY
    }

    update(dt) {
        
    }

    render() {
        ctx.drawImage(Resources.get(this.star), this.posX, this.posY)
    }
}


let enemy1 = new Enemy(-100, 60);
let enemy2 = new Enemy(-100, 145);
let enemy3 = new Enemy(-100, 230);
const player = new Player(200, 400);
let star1 = new Star(randomCoord(xCoords), randomCoord(yCoords))
const allEnemies = [enemy1, enemy2, enemy3]
const allStars = [star1]

//Random number generator 
function RNG(a, b) {
    return Math.floor(Math.random() * (a - b) + b);
}

function gameOver() {
    allEnemies.forEach(enemy => {
        enemy.speed = 0;
    })
    reset()
}

//function to reset the game
function reset() {
    player.posX = 200;
    player.posY = 400;
    modal.style.display = 'none';
    starCount = 0;
    starCounth3.innerHTML = `Star Count: ${starCount}`
    allEnemies.forEach(el => {
        el.posX = -100;
        el.speed = RNG(500, 250);
    });
};

//Event listener for reset button
resetBtn.addEventListener('click', reset);


document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (enemy1.speed !== 0) {
        player.handleInput(allowedKeys[e.keyCode]);
    }

});
