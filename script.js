const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")
const scoreElement = document.querySelector(".score")
const headElement = document.querySelector(".head")
const sounds = document.querySelectorAll(".sounds audio")
const soundsMap = new Map([...sounds].map(elem => [elem.id, elem]));
const time = document.querySelectorAll(".time")


const gameOverBox = document.getElementById("gameOverScreen")

var rectanglesElements

const gameState = {
    start: false,
    ballMoving: false,
    pause: false,
    score: 0,
    currentLevel: 1,
    gameOver: false,
    lives: 3,
    gameOver: false,
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

document.querySelector(".score-section span").textContent = gameState.score
document.querySelector(".level-section span").textContent = gameState.currentLevel

const keys = {
    ArrowLeft: false,
    ArrowRight: false
}

const paddle = {
    speed: 3,
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
    const TopScors = highestScore(gameState.score)
    if (gameOverBox.classList.contains("hideElement")) {
        soundsMap.get("gameWin").play()
        gameOverBox.classList.toggle('hideElement');
    }
    gameOverBox.innerHTML = `
    <div id="gameOverPopup">
            <h1>Gamer Over</h1>
            <p>Your Score: <span id="finalScore">${gameState.score}</span></p>
            <ul>
                <li>1st - ${TopScors[0]}</li>
                <li>2nd - ${TopScors[1]}</li>
                <li>3rd - ${TopScors[2]}</li>
                <li>4th - ${TopScors[3]}</li>
                <li>5th - ${TopScors[4]}</li>
            </ul>
            <button id="restartButton">Restart</button>
    </div>`
    gameState.gameOver = false;
    gameState.pause = true
    document.getElementById("restartButton").onclick = restartGame;
}

function GameWin() {
    if (gameOverBox.classList.contains("hideElement"))
        gameOverBox.classList.toggle('hideElement');
    const TopScors = highestScore(gameState.score)
    gameOverBox.innerHTML = `
     <div id="gameOverPopup">
            <h1>You Win The Game</h1>
            <p>Your Score: <span id="finalScore">${gameState.score}</span></p>
            <h1>Top Records:</h1>
            <ul>
                <li>1st - ${TopScors[0]}</li>
                <li>2nd - ${TopScors[1]}</li>
                <li>3rd - ${TopScors[2]}</li>
                <li>4th - ${TopScors[3]}</li>
                <li>5th - ${TopScors[4]}</li>
            </ul>
            <button id="restartButton">Restart</button>
        </div>`
    gameState.gameOver = false;
    gameState.pause = true
    document.getElementById("restartButton").onclick = restartGame;

}

function Continue() {
    gameState.pause = !gameState.pause ? true : false
    gameOverBox.classList.toggle('hideElement')
    gameOverBox.innerHTML = `
    <div id="gameOverPopup">
        <h1>Pause Game</h1>
        <button id="restartButton">Restart</button>
        <button id="continueButton">Continue</button>
    </div>`
    document.getElementById("continueButton").onclick = Continue;
    document.getElementById("restartButton").onclick = restartGame;

}

function CreateLives() {
    const liveElements = document.querySelectorAll(".life");
    gameState.lives = 3
    liveElements.forEach(elem => elem.style.backgroundColor = "red")
    liveElements.forEach(elem => elem.style.backgroundColor = "red")
}

function RemoveLive() {
    gameState.ballMoving = false
    const liveElements = document.querySelectorAll(".life");

    if (gameState.lives > 0) {
        gameState.lives -= 1;
        soundsMap.get("gameOver").play()
        liveElements[gameState.lives].style.backgroundColor = '#858585'
        liveElements[gameState.lives].style.backgroundColor = '#858585'
    } else {
        gameState.gameOver = true
        // gameState.lives = 3
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
                return
                return
            }

            if (!gameState.ballMoving && gameState.start) {
                console.log(gameState.ballMoving)
                gameState.ballMoving = true
            }
        }

        if (e.key === 'Escape') {
            Continue()
        }
    }
})

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

let seconds = 0
let id
let prevId
let setTime = setInterval(() => {
    
    if (!gameState.pause && gameState.start && id != prevId) {
        ++seconds
        time[0].innerHTML = pad(parseInt(seconds / 60));
        time[1].innerHTML = pad(seconds % 60);
    }
    prevId = id
}, 1000);

function resetCounter(){
    seconds = 0
    time.forEach(elem => elem.innerHTML = '00')
}

function gameLoop() {
    if (gameState.gameOver) {
        resetCounter()
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

    id = requestAnimationFrame(gameLoop)
}

function restartGame() {
    gameState.ballMoving = false
    if (!gameOverBox.classList.contains('hideElement'))
        gameOverBox.classList.toggle("hideElement");

    gameState.gameOver = false
    gameState.start = true
    gameState.score = 0
    paddle.positionXOfPaddle = 300
    ball.position = [340, 495]
    ball.direction = [0, -1]
    gameState.currentLevel = 1
    document.querySelector(".score-section span").textContent = gameState.score
    soundsMap.get("victory").pause()
    buildBricks(1)
    CreateLives();
    gameState.pause = false
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

    if (ball.position[0] <= ball.boundaries.left && ball.direction[0] <= 0) {
        ball.direction[0] *= -1
    }
    if (ball.position[0] >= ball.boundaries.right && ball.direction[0] >= 0) {
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
                soundsMap.get("wheep").play()
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
            flag = rectangles.existingRectangles.includes(currentRectangle) || rectangles.solidRectangles.includes(currentRectangle);
        }

        if (flag) {
            collision()
            if (rectangles.solidRectangles.includes(currentRectangle)) {
                vibrateBrick(currentRectangle)
                soundsMap.get("metal").play()

            } else {
                breakBrick(currentRectangle)
                soundsMap.get("pop2").play()

            }
            if (rectangles.existingRectangles.length <= 0) {
                if (!nextLevel()) {
                    soundsMap.get("victory").play()
                    gameState.ballMoving = false
                    GameWin()
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
    if (array.includes(score))
        return array
    array.push(score)
    array = array.sort((a, b) => b - a)
    array.pop()
    return array
}

function highestScore(score) {
    let newScore = [score, 0, 0, 0, 0]
    if (localStorage.getItem("score")) {
        newScore = setScore(score, JSON.parse(localStorage.getItem("score")))
    }
    localStorage.setItem("score", JSON.stringify(newScore))

    return newScore;
}

CreateLives();
requestAnimationFrame(gameLoop)