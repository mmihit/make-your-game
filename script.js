const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")

const gameState = {
    start:false,
    ballMoving:false
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false
}

const paddle = {
    speed: 15,
    boundaries: {
        left: -350,
        right: 250
    },
    positionXOfPaddle: -50,
}

const ball = {
    matchPaddleSpeed: 15,
    speed: 5,
    position: [341, 502],
    direction: [1, -1],
    boundaries: {
        left: 0,
        right: 680,
        top: 0,
        bottom: 530
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
})

document.addEventListener('keyup', (e) => {
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
        }
        if (keys.ArrowLeft) {
            paddle.positionXOfPaddle = movePaddleLeft()
        }
    }

    


    updatePaddlePosition(paddle.positionXOfPaddle)


    if (gameState.ballMoving) {
        moveBall()
        updateBallPosition()
    }




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

function updatePaddlePosition(transform) {
    paddleElement.style.transform = `translateX(${transform}px)`
}

function moveBall() {
    ball.position[0] += ball.speed * ball.direction[0]
    ball.position[1] += ball.speed * ball.direction[1]

    if (ball.position[0] <= ball.boundaries.left || ball.position[0] >= ball.boundaries.right) {
        ball.direction[0] *= -1
    }
    if (ball.position[1] <= ball.boundaries.top || ball.position[1] >= ball.boundaries.bottom) {
        ball.direction[1] *= -1
    }
}

function updateBallPosition() {
    ballElement.style.transform = `translate(${ball.position[0]}px, ${ball.position[1]}px)`
}



requestAnimationFrame(gameLoop)


