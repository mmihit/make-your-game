const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")
const scoreElement = document.querySelector(".score")
const headElement = document.querySelector(".head")

const gameState = {
    start: false,
    ballMoving: false,
    addLive: 0,
    removeLive:3
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false
}

const paddle = {
    speed: 15,
    boundaries: {
        left: 1,
        right: 600
    },
    positionXOfPaddle: 300,
    width: 100
}

const ball = {
    matchPaddleSpeed: 15,
    speed: 5,
    position: [341, 495],
    direction: [0, -1],
    boundaries: {
        left: 1,
        right: 680,
        top: 0,
        bottom: 530,
        left1: 50,
        right1: 630,
        bottom1: 495
    },
    width: 20
}

function CreateLives() {

    const livelements = document.createElement("div");
    livelements.id = "lives";

    for (let index = 0; index < 3; index++) {
        gameState.addLive +=1
        const lifeElements = document.createElement("div");
        lifeElements.className = "life";
        livelements.appendChild(lifeElements);
        
    }
    console.log(gameState.addLive);
    headElement.appendChild(livelements);
}

function RemoveLive() {

    const livelements = document.getElementById("lives");
    if (livelements.children.length > 0) {
        gameState.removeLive -= 1;
        console.log(gameState.removeLive);
        livelements.removeChild(livelements.firstElementChild);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false
    }

    if (e.key === ' ') {
        if (!gameState.start) {
            gameState.start = true
        }
    }
})

function gameLoop() {
    if (gameState.start) {
        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                if (!gameState.ballMoving) {
                    gameState.ballMoving = true
                }
            }
        })
        if (keys.ArrowRight) {
            paddle.positionXOfPaddle = movePaddleRight()
            if (!gameState.ballMoving) {
                ball.position[0] = moveBallRight()
            }
        }
        if (keys.ArrowLeft) {
            paddle.positionXOfPaddle = movePaddleLeft()
            if (!gameState.ballMoving) {
                ball.position[0] = moveBallLeft()
            }
        }
    }
    updatePaddlePosition(paddle.positionXOfPaddle)

    if (gameState.ballMoving) {
        moveBall()
    }
    updateBallPosition()
    requestAnimationFrame(gameLoop)
}

function movePaddleRight() {
    return paddle.positionXOfPaddle < paddle.boundaries.right ? paddle.positionXOfPaddle + paddle.speed : paddle.positionXOfPaddle
}

function movePaddleLeft() {
    return paddle.positionXOfPaddle > paddle.boundaries.left ? paddle.positionXOfPaddle - paddle.speed : paddle.positionXOfPaddle
}

function moveBallRight() {
    return ball.position[0] < ball.boundaries.right1 ? ball.position[0] + ball.matchPaddleSpeed : ball.position[0]
}

function moveBallLeft() {
    return ball.position[0] > ball.boundaries.left1 ? ball.position[0] - ball.matchPaddleSpeed : ball.position[0]
}

function moveBall() {
    const currentSpeed = Math.sqrt(
        ball.direction[0] * ball.direction[0] +
        ball.direction[1] * ball.direction[1]
    );

    ball.position[0] += ball.speed * ball.direction[0]
    ball.position[1] += ball.speed * ball.direction[1]

    if (ball.position[0] <= ball.boundaries.left || ball.position[0] >= ball.boundaries.right) {
        ball.direction[0] *= -1
    }

    if (ball.position[1] <= ball.boundaries.top) {
        ball.direction[1] *= -1
    }

    if (ball.position[1] >= ball.boundaries.bottom1) {
        if (ball.position[1]==ball.boundaries.bottom1) {
            if (ball.position[0] <= paddle.positionXOfPaddle + paddle.width &&
                ball.position[0] >= paddle.positionXOfPaddle) {
    
                let hitPosition = (ball.position[0] - paddle.positionXOfPaddle) / paddle.width;
    
                let newDirX = (hitPosition - 0.5) * 2;
                let newDirY = -1; 
    
                const magnitude = Math.sqrt(newDirX * newDirX + newDirY * newDirY);
    
                ball.direction[0] = (newDirX / magnitude) * currentSpeed;
                ball.direction[1] = (newDirY / magnitude) * currentSpeed;
            }
        }

        if (ball.position[1] - ball.width >= ball.boundaries.bottom) {
            gameState.ballMoving = false
            gameState.start = true
            ball.direction = [0, -1]
            ball.position = [341, 495]
            ball.speed = 5
            paddle.positionXOfPaddle = 300
            RemoveLive();
        }
    }
}

function updatePaddlePosition(transform) {
    paddleElement.style.transform = `translateX(${transform}px)`
}

function updateBallPosition() {
    ballElement.style.transform = `translate(${ball.position[0]}px, ${ball.position[1]}px)`
}

CreateLives();
gameLoop();