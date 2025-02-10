const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")

const gameState = {
    start: false,
    ballMoving: false
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
    direction: [1, -1],
    boundaries: {
        left: 1,
        right: 680,
        top: 0,
        bottom: 530,
        left1: 50,
        right1: 630,
        bottom1: 495
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

function getPaddlePosition(transform) {
    const translateMatch = transform.match(/translateX\((-?\d+\.?\d*)px\)/);
    if (translateMatch) {
        return parseFloat(translateMatch[1]);
    }
    return 0
}

function movePaddleRight() {
    return paddle.positionXOfPaddle < paddle.boundaries.right ? paddle.positionXOfPaddle + paddle.speed : paddle.positionXOfPaddle
}

function movePaddleLeft() {
    return paddle.positionXOfPaddle > paddle.boundaries.left ? paddle.positionXOfPaddle - paddle.speed : paddle.positionXOfPaddle
}

function moveBallRight() {
    console.log(ball.position[0] < ball.boundaries.right1)
    return ball.position[0] < ball.boundaries.right1 ? ball.position[0] + ball.matchPaddleSpeed : ball.position[0]
}

function moveBallLeft() {
    return ball.position[0] > ball.boundaries.left1 ? ball.position[0] - ball.matchPaddleSpeed : ball.position[0]
}

function moveBall() {
    ball.position[0] += ball.speed * ball.direction[0]
    ball.position[1] += ball.speed * ball.direction[1]

    if (ball.position[0] <= ball.boundaries.left || ball.position[0] >= ball.boundaries.right) {
        ball.direction[0] *= -1
    }

    if (ball.position[1] <= ball.boundaries.top) {
        ball.direction[1] *= -1
    }

    if (ball.position[1] >= ball.boundaries.bottom1) {

        if (ball.position[1] >= ball.boundaries.bottom1 && ball.position[0] <= paddle.positionXOfPaddle + paddle.width && ball.position[0] >= paddle.positionXOfPaddle) {
            ball.direction[1] *= -1
        }

        if (ball.position[1] >= ball.boundaries.bottom) {
            gameState.ballMoving = false
            gameState.start = true
            ball.direction = [1, -1]
            ball.position = [341, 495]
            paddle.positionXOfPaddle = 300
        }
        
    }
}



function updatePaddlePosition(transform) {
    paddleElement.style.transform = `translateX(${transform}px)`
}

function updateBallPosition() {
    ballElement.style.transform = `translate(${ball.position[0]}px, ${ball.position[1]}px)`
}

requestAnimationFrame(gameLoop)


