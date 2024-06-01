// hold args for operate(number + operator + number)
let args = new Array(3);

function operate(firstNum, operator, secondNum) {
    switch(operator) {
        case "+":
            return firstNum + secondNum;
        case "-":
            return firstNum - secondNum;
        case "*":
            return firstNum * secondNum;
        case "/":
            return firstNum / secondNum;
    }
}

const display = document.querySelector("#displayed-input");
const input = document.querySelector(".input.container");

// button functionality 
input.addEventListener('click', (event) => {
    let target = event.target;
    
    // get rid of initial zero on display
    if (display.innerText == "0") {
        display.innerText = "";
    }

    // update display text only if no overflow 
    // 10 digit display; 1 digit saved for operator
    if ( (!isNaN(+target.value) || target.value === '.') && 
    display.innerText.length < 9) {
        display.innerText += target.value;
        doNotClear(target);
    }

    // apply operators 
    else if (target.class == "operator") {
        if (args[0] != undefined) {
            switch(target.value) {  
                case '/': 
                    args[1] = display.innerText = '/'; 
                    break;
                case '*':
                    args[1] = display.innerText = '*'; 
                    break;
                case '-':
                    args[1] = display.innerText = '-'; 
                    break;
                case '+':
                    if (args[2] == undefined) {
                        args[1] = display.innerText = '+'; 
                        break;
                    }
                    else {
                        display.innerText = operate(args);
                    }
                    
            }
            doNotClear(target);
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

// backspace helper fx
function doNotClear(target){
    if (target.clicks == "clicked") {
        target.clicks = "none"
    }
}

// reset helper fx
function reset(target) {
    display.innerText = "0";
    target.clicks = "none";
    args = new Array(3);
}



