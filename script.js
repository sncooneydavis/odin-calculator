// hold args for operate(number + operator + number)
let args = new Array(3);

function operate(firstNum, operator, secondNum) {
    let first = parseFloat(firstNum);
    let second = parseFloat(secondNum);
    switch(operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            return first / second;
    }
}

const display = document.querySelector("#displayed-input");
const input = document.querySelector(".button.container");

// button functionality 
input.addEventListener('click', (event) => {
    let target = event.target;

    // update display text only if no overflow 
    // 10 digit display; 1 digit saved for operator
    if ( (!isNaN(+target.value) || target.value === '.') && 
    display.innerText.length < 9) {
        display.innerText += target.value;
        doNotClear(target);
    }

    // apply operators 
    else if (target.classList.contains("operator")) {
        if ( args[0] == undefined && (/\d/.test(display.innerText)) ) {
                args[0] = display.innerText;
                args[1] = display.innerText = target.value;
                doNotClear(target);
                display.innerText = "";
            }
        else if ( args[2] == undefined && 
        (/\d/.test(display.innerText)) ) {
            args[2] = display.innerText;
            let heldValue = operate(args[0], args[1], args[2]);
            reset(target);
            args[0] = display.innerText = heldValue;
        }
        else {
            reset(target);
        }
    }

    //update display with deletions
    else {
        // if BACK button clicked once, delete last digit
        if (target.clicks == "none") {
            display.innerText = display.innerText.slice(0, -1);
            target.clicks = "clicked";
        }
        // if BACK button double-clicked, reset display
        else {             
            reset(target);
        } 
    }
})

// reset helper fxs
function doNotClear(target){
    if (target.clicks == "clicked") {
        target.clicks = "none"
    }
}
function reset(target) {
    display.innerText = "";
    target.clicks = "none";
    args = new Array(3);
}



