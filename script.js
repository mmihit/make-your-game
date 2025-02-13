const paddleElement = document.querySelector(".paddle")
const ballElement = document.querySelector(".ball")
const scoreElement = document.querySelector(".score")
const headElement = document.querySelector(".head")
document.getElementById("restartButton").onclick = restartGame;

const brick = {
    index : 1,
    recInRows : 10,
    colors : {
        base: ["#FF5733", "#3498DB", "#2ECC71", "#F1C40F", "#9B59B6", "#E67E22", "#FF69B4", "#1ABC9C", "#8B4513", "#7F8C8D"],
        light: ["#FF8A66", "#5DADE2", "#58D68D", "#F7DC6F", "#BB8FCE", "#F5B041", "#FFB6C1", "#76D7C4", "#D2B48C", "#D5DBDB"],
        dark: ["#C44127", "#2874A6", "#239B56", "#B7950B", "#76448A", "#A04000", "#C71585", "#117A65", "#6E2C00", "#424949"],
        colorDirection: ["left", "right", "bottom", "top"],
    }
}

buildBricks(2)
const rectanglesElements = document.querySelectorAll(".rectangle")

const rectangles = {
    existingRectangles: new Map(Array.from(rectanglesElements).filter(e => e.dataset.exist === "true").map(e => [e.dataset.id, true])),
    MarginWithTopBoundariesCanvas: 20,
    widthOfRectangleSection: 700,
    heightOfRectagleSection: 385,
    DimsOfCurrentRectangle: [0, 0]
}

console.log(rectangles.existingRectangles)

rectangles.existingRectangles['4']='false'
rectanglesElements[15].setAttribute('data-exist', 'false')
console.log(rectangles.existingRectangles)


const gameState = {
    start: false,
    ballMoving: false,
    gameOver :true,
    lives:3
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

function GameOver() {
    document.getElementById("gameOverScreen").style.display = "flex";
    gameState.start = false;
    gameState.ballMoving = false;
    gameState.gameOver = false;

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
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false
    }

    if (e.key === ' ') {
        if (!gameState.start && gameState.gameOver) {
            gameState.start = true
        }else{
            if (!gameState.ballMoving && gameState.gameOver) {
                gameState.ballMoving = true
            }
        }
    }
})
function gameLoop() {

    console.log(requestId);
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
   requestAnimationFrame(gameLoop)
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    gameState.gameOver = true;
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

function score() {
    if (ball.position[1] <= rectangles.MarginWithTopBoundariesCanvas + rectangles.heightOfRectagleSection) {
        if (ball.position[1] >= rectangles.MarginWithTopBoundariesCanvas) {
            rectangles.DimsOfCurrentRectangle[0] = Math.floor(10 * ball.position[0] / rectangles.widthOfRectangleSection)+1 == 0 ? 1 : Math.floor(10 * ball.position[0] / rectangles.widthOfRectangleSection)+1
            rectangles.DimsOfCurrentRectangle[1] = Math.floor(10 * (ball.position[1] - rectangles.MarginWithTopBoundariesCanvas) / rectangles.heightOfRectagleSection) +1 == 11 ? 10 : Math.floor(10 * (ball.position[1] - rectangles.MarginWithTopBoundariesCanvas) / rectangles.heightOfRectagleSection)+1
            const  currentRectangle = rectangles.DimsOfCurrentRectangle[0]+(rectangles.DimsOfCurrentRectangle[1]-1)*(rectangles.DimsOfCurrentRectangle[0])
            if (rectangles.existingRectangles[toString(currentRectangle)]){
                console.log(currentRectangle)
                direction[1]*=-1
            }
        }
    }
}

function divedNumber(nmbr, divisor) {
    let result = nmbr / divisor
    return Number.isInteger(result) ? result - 0.5 : result
}

function rebuildRectangles(){
    const getBricksSection = document.querySelector('.rectangles-section')
    getBricksSection.textContent = ""
    return getBricksSection
}

function buildBricks(level) {
    const bricksSection = rebuildRectangles()
    let rows = level == 1 ? 6 : 10; brick.index = 0
    
    for (let row = 0; row < rows; row++) {
        for (let rectangle = 0; rectangle < brick.recInRows; rectangle++) {
            const element = document.createElement('div')
            element.classList.add('rectangle')
            element.setAttribute("data-id", brick.index)
            if (level > 1) {
                if (level == 2 && Math.abs(rectangle - 4.5) < 1 || Math.abs(row - divedNumber(rows, 2)) < 1)
                    element.setAttribute("data-exist", true)
                else if (level == 3 && Math.floor((Math.abs(rectangle - 4.5)) + Math.abs(row - divedNumber(rows, 2))) < divedNumber(rows, 2))
                    element.setAttribute("data-exist", true)
                else
                    element.setAttribute("data-exist", false)
            } else {
                element.setAttribute("data-exist", true)
            }

            element.style.background = `linear-gradient(to ${brick.colors.colorDirection[(row + brick.index) % 4]}, ${brick.colors.base[row]}, ${brick.colors.dark[row]})`
            element.style.boxShadow = `inset -5px -5px ${brick.colors.light[row]}, inset 5px 5px ${brick.colors.dark[row]}`
            bricksSection.append(element)
            brick.index++
        }
    }
}
CreateLives();
requestAnimationFrame(gameLoop);
