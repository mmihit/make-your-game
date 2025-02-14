const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")
const scoreElement = document.querySelector(".score")
const headElement = document.querySelector(".head")
document.getElementById("restartButton").onclick = restartGame;
var rectanglesElements

const gameState = {
    start: false,
    ballMoving: false,
    pause: false,
    score: 0,
    currentLevel: 3,
    gameOver: false,
    lives: 3
}

const brick = {
    index: 1,
    recInRows: 10,
    colors: {
        base: ["#FF5733", "#3498DB", "#2ECC71", "#F1C40F", "#9B59B6", "#E67E22", "#FF69B4", "#1ABC9C", "#8B4513", "#7F8C8D"],
        light: ["#FF8A66", "#5DADE2", "#58D68D", "#F7DC6F", "#BB8FCE", "#F5B041", "#FFB6C1", "#76D7C4", "#D2B48C", "#D5DBDB"],
        dark: ["#C44127", "#2874A6", "#239B56", "#B7950B", "#76448A", "#A04000", "#C71585", "#117A65", "#6E2C00", "#424949"],
        colorDirection: ["left", "right", "bottom", "top"],
    }
}

const rectangles = {
    existingRectangles: [],
    solidRectangles: [],
    widthOfRectangleSection: 700,
    heightOfRectagleSection: 385,
    heightOfRectangle: 38.5,
    widthOfRectangle: 70,
    DimsOfCurrentRectangle: [0, 0]
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false
}

const paddle = {
    speed: 5,
    boundaries: {
        left: 0,
        right: 600
    },
    positionXOfPaddle: 300,
    width: 100
}

const ball = {
    speed: 5,
    position: [340, 495],
    direction: [0, -1],
    boundaries: {
        left: 0,
        right: 680,
        top: 0,
        bottom: 530,
        left1: 50,
        right1: 630,
        bottom1: 495
    },
    width: 20
}

buildBricks(gameState.currentLevel)

document.querySelector(".score-section span").textContent = gameState.score




function GameOver() {
    document.getElementById("gameOverScreen").style.display = "flex";
    document.getElementById("finalScore").textContent = gameState.score
    gameState.gameOver = true;
}

function CreateLives() {

    const livelements = document.createElement("div");
    livelements.id = "lives";

    for (let index = 0; index < 3; index++) {
        const lifeElements = document.createElement("div");
        lifeElements.className = "life";
        livelements.appendChild(lifeElements);

    }
    headElement.appendChild(livelements);
}

function RemoveLive() {
    gameState.ballMoving = false
    const livelements = document.getElementById("lives");
    console.log(livelements.children.length);

    if (livelements.children.length > 0) {
        gameState.lives -= 1;
        livelements.removeChild(livelements.firstElementChild);
    } else {
        livelements.remove();
        GameOver();
    }
}

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !gameState.gameOver) {
        keys[e.key] = true
    }
})

document.addEventListener('keyup', (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false
    }

    if (!gameState.gameOver) {
        if (e.key === ' ') {
            if (!gameState.start) {
                gameState.start = true
            }

            if (!gameState.ballMoving && gameState.start) {
                gameState.ballMoving = true
            }
        }

        if (e.key === 'Escape') {
            gameState.pause = !gameState.pause ? true : false
        }
    }
})

function gameLoop() {
    if (gameState.gameOver) {
        GameOver()
    }

    if (!gameState.pause) {
        if (gameState.start) {
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
        score()
    }

    requestAnimationFrame(gameLoop)
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    gameState.gameOver = false;
    gameState.start = true
    gameState.score = 0
    gameState.currentLevel = 1
    document.querySelector(".score-section span").textContent = gameState.score
    buildBricks(1)
    CreateLives();
}

function movePaddleRight() {
    return paddle.positionXOfPaddle < paddle.boundaries.right ? paddle.positionXOfPaddle + paddle.speed : paddle.positionXOfPaddle
}

function movePaddleLeft() {
    return paddle.positionXOfPaddle > paddle.boundaries.left ? paddle.positionXOfPaddle - paddle.speed : paddle.positionXOfPaddle
}

function moveBallRight() {
    return ball.position[0] < ball.boundaries.right1 ? ball.position[0] + paddle.speed : ball.position[0]
}

function moveBallLeft() {
    return ball.position[0] > ball.boundaries.left1 ? ball.position[0] - paddle.speed : ball.position[0]
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
        if (ball.position[1] == ball.boundaries.bottom1) {
            if (ball.position[0] <= paddle.positionXOfPaddle + paddle.width &&
                ball.position[0] + ball.width >= paddle.positionXOfPaddle) {

                let hitPosition = (ball.position[0] + ball.width / 2 - paddle.positionXOfPaddle) / paddle.width;

                let newDirX = (hitPosition - 0.5) * 2;
                let newDirY = -1;

                const magnitude = Math.sqrt(newDirX * newDirX + newDirY * newDirY);

                ball.direction[0] = (newDirX / magnitude) * currentSpeed;
                ball.direction[1] = (newDirY / magnitude) * currentSpeed;
            }
        }

        if (ball.position[1] >= ball.boundaries.bottom) {
            RemoveLive();
            ball.direction = [0, -1]
            ball.position = [341, 495]
            ball.speed = 5
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

function score() {
    if (ball.position[1] <= rectangles.heightOfRectagleSection) {

        let flag = false;

        rectangles.DimsOfCurrentRectangle[0] = Math.max(1, Math.min(10,
            Math.floor((ball.position[0] + ball.width) / rectangles.widthOfRectangle) + 1
        ));

        if (ball.direction[1] <= 0) {
            rectangles.DimsOfCurrentRectangle[1] = Math.max(1, Math.min(10,
                Math.floor((ball.position[1]) / rectangles.heightOfRectangle) + 1
            ));
        } else {
            rectangles.DimsOfCurrentRectangle[1] = Math.max(1, Math.min(10,
                Math.floor((ball.position[1] + ball.width) / rectangles.heightOfRectangle) + 1
            ));
        }

        let currentRectangle = rectangles.DimsOfCurrentRectangle[0] + (rectangles.DimsOfCurrentRectangle[1] - 1) * 10;

        flag = rectangles.existingRectangles.includes(currentRectangle) || rectangles.solidRectangles.includes(currentRectangle);

        if (!flag) {
            rectangles.DimsOfCurrentRectangle[0] = Math.max(1, Math.min(10,
                Math.floor((ball.position[0]) / rectangles.widthOfRectangle) + 1
            ));
            currentRectangle = rectangles.DimsOfCurrentRectangle[0] + (rectangles.DimsOfCurrentRectangle[1] - 1) * 10;
            flag = rectangles.existingRectangles.includes(currentRectangle);
        }

        if (flag) {
            collision()
            console.log(rectangles.solidRectangles)
            if (rectangles.solidRectangles.includes(currentRectangle)) {
                vibrateBrick(currentRectangle)
            } else {
                breakBrick(currentRectangle)
            }
            if (rectangles.existingRectangles.length <= 0) {
                if (!nextLevel()) {
                    console.log("you win")
                }
            }
        }

    }
}

function vibrateBrick(currentRectangle) {
    rectanglesElements[currentRectangle - 1].classList.toggle("vibrateAnimation")
}

function collision() {
    const brickLeft = (rectangles.DimsOfCurrentRectangle[0] - 1) * rectangles.widthOfRectangle;
    const brickRight = brickLeft + rectangles.widthOfRectangle;
    const brickTop = (rectangles.DimsOfCurrentRectangle[1] - 1) * rectangles.heightOfRectangle;
    const brickBottom = brickTop + rectangles.heightOfRectangle;

    const ballLeft = ball.position[0];
    const ballRight = ballLeft + ball.width;
    const ballTop = ball.position[1];
    const ballBottom = ballTop + ball.width;

    const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
    const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

    if (overlapX < overlapY) {
        ball.direction[0] *= -1;
    } else {
        ball.direction[1] *= -1;
    }
}

function breakBrick(currentRectangle) {
    const index = rectangles.existingRectangles.indexOf(currentRectangle);
    rectangles.existingRectangles.splice(index, 1);
    rectanglesElements[currentRectangle - 1].dataset.exist = 'false';
    gameState.score += 70;
    document.querySelector(".score-section span").textContent = gameState.score
}

function nextLevel() {
    if (gameState.currentLevel < 3) {
        gameState.currentLevel++
        buildBricks(gameState.currentLevel)
        gameState.ballMoving = false
        gameState.start = true
        ball.direction = [0, -1]
        ball.position = [341, 495]
        ball.speed = 5
        paddle.positionXOfPaddle = 300
        return true
    }
    return false
}

function divedNumber(nmbr, divisor) {
    let result = nmbr / divisor
    return Number.isInteger(result) ? result - 0.5 : result
}

function rebuildRectangles() {
    const getBricksSection = document.querySelector('.rectangles-section')
    getBricksSection.textContent = ""
    return getBricksSection
}

function buildBricks(level) {
    const bricksSection = rebuildRectangles()
    let rows = level == 1 ? 6 : 10; brick.index = 1

    for (let row = 0; row < rows; row++) {
        for (let rectangle = 0; rectangle < brick.recInRows; rectangle++) {
            const element = document.createElement('div')
            element.classList.add('rectangle')
            element.setAttribute("data-id", brick.index)
            if (level > 1) {
                if (level == 3 && row == 6 && rectangle >= 2 && rectangle <= 7) {
                    element.setAttribute("data-exist", "wall")
                    // element.classList.add("vibrateAnimation")
                } else if (level == 2 && Math.abs(rectangle - 4.5) < 1 || Math.abs(row - divedNumber(rows, 2)) < 1)
                    element.setAttribute("data-exist", true)
                else if (level == 3 && Math.floor((Math.abs(rectangle - 4.5)) + Math.abs(row - divedNumber(rows, 2))) < divedNumber(rows, 2))
                    element.setAttribute("data-exist", true)
                else
                    element.setAttribute("data-exist", false)
            } else {
                element.setAttribute("data-exist", true)
            }
            if (element.getAttribute("data-exist") != "wall") {
                element.style.background = `linear-gradient(to ${brick.colors.colorDirection[(row + brick.index) % 4]}, ${brick.colors.base[row]}, ${brick.colors.dark[row]})`
                element.style.boxShadow = `inset -5px -5px ${brick.colors.light[row]}, inset 5px 5px ${brick.colors.dark[row]}`
            }
            bricksSection.append(element)
            brick.index++
        }
    }
    rectanglesElements = document.querySelectorAll(".rectangle")
    document.querySelector(".level-section span").textContent = gameState.currentLevel
    rectangles.existingRectangles = Array.from(rectanglesElements).filter(e => e.dataset.exist === "true").map(e => parseInt(e.dataset.id))
    rectangles.solidRectangles = Array.from(rectanglesElements).filter(e => e.dataset.exist === "wall").map(e => parseInt(e.dataset.id))
}

function setScore(score, array) {

    for (let i = 0; i < array.length; i++) {
        if (score >= array[i]) {
            let temp = array[i]
            array[i] = score
            score = temp
        }
    }
    return array
}

function highestScore(score) {
    let newScore = [0, 0, 0, 0, 0]
    if (localStorage.getItem("score")) {
        newScore = setScore(score, JSON.parse(localStorage.getItem("score")))
    }
    localStorage.setItem("score", JSON.stringify(newScore))
}
highestScore(99)
CreateLives();
requestAnimationFrame(gameLoop)

