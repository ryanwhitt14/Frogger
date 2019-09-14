const modal = document.querySelector('.modal');
const resetBtn = document.querySelector('.reset');

// Enemies our player must avoid
class Enemy {
    constructor(posX, posY, speed) {
        this.sprite = 'images/enemy-bug.png';
        this.posX = posX;
        this.posY = posY;
        this.speed = RNG(250, 100);
    }
    //When an enemy goes off-screen it will go back to start with a new random speed.
    enemyLoop(el) {
        if (el.posX > 500) {
            el.posX = -100;
            el.speed = RNG(250, 100);
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
        this.character = 'images/char-boy.png';
        this.posX = 200;
        this.posY = 400;
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
    //Detects wether the player collided with an enemy 
    detectCollision() {
        for (let enemy of allEnemies) {
            if (this.posX > enemy.posX && this.posX < enemy.posX + 75 && this.posY === enemy.posY) {
                this.onCollide();
            }
            if (this.posX < enemy.posX && this.posX > enemy.posX - 75 && this.posY === enemy.posY) {
                this.onCollide();
            }
        }
    }
    //When player collides, reset.
    onCollide() {
        reset();
    }
    //checks to see if the player has reached the water
    checkWin() {
        if (this.posY < 40) {
            modal.style.display = 'block';
            allEnemies.forEach(el => {
                el.speed = 0;
            })
        }
    }

    update(dt) {
        this.detectCollision();
        this.checkWin();
    }

    render() {
        ctx.drawImage(Resources.get(this.character), this.posX, this.posY);
    }
}

let enemy1 = new Enemy(-100, 60);
let enemy2 = new Enemy(-100, 145);
let enemy3 = new Enemy(-100, 230);
const allEnemies = [enemy1, enemy2, enemy3];
const player = new Player();

//Random number generator 
function RNG(a, b) {
    return Math.floor(Math.random() * (a - b) + b);
}

//function to reset the game
function reset() {
    player.posX = 200;
    player.posY = 400;
    modal.style.display = 'none';
    allEnemies.forEach(el => {
        el.posX = -100;
        el.speed = RNG(250, 100);
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

    player.handleInput(allowedKeys[e.keyCode]);
});