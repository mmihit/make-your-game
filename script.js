var paddle = document.querySelector(".paddle")


let TranslateXOfPaddle=getTheTranslateXPerecntageOfPaddle(paddle.style.transform)

// document.addEventListener('keyup', (e)=>{
//     if(e.keyCode===39){
//         console.log("left right click")
//     }
//     if (e.keyCode===37) {
//         console.log("click")
//     }
// })

document.addEventListener('keydown', (e) => {
    paddle = document.querySelector(".paddle")
    let arg=0
    if (e.keyCode === 39 && TranslateXOfPaddle!=250) {
        arg=20
        updateTheTranslateXPercentageOfPaddle(TranslateXOfPaddle, arg)
    }
    if (e.keyCode === 37 && TranslateXOfPaddle!=-350) {
        arg=-20
        updateTheTranslateXPercentageOfPaddle(TranslateXOfPaddle, arg)
    }
    
})

function getTheTranslateXPerecntageOfPaddle(transform) {
    const translateMatch = transform.match(/translateX\((-?\d+\.?\d*)%\)/);
    if (translateMatch) {
        return parseFloat(translateMatch[1]);
    }
    return 0
}

function updateTheTranslateXPercentageOfPaddle(transform, flag) {
    paddle.style.transform=`TranslateX(${transform+flag}%)`
    TranslateXOfPaddle=transform+flag
    console.log(transform+flag)
    console.log(paddle.style.transform)
}