// total digits of display 
const digitsAllowed = 10;

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
            return (first / second).toFixed(5);
    }
}

const display = document.querySelector("#displayed-input");
const input = document.querySelector(".button.container");
let debounceTimer;

// input types: #, operator, '.', or 'backspace'
input.addEventListener('click', (event) => {
    let target = event.target;
    
    // debounce input handling
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if ( (!isNaN(+target.value) || target.value === '.') && 
        display.innerText.length < 9) {
            handleNumbers(target);
        }
        else if (target.classList.contains("operator")) {
            handleOperator(target);
        }
        else if (target.classList.contains("BACK")) {
            handleBackspace(target); 
        }
    }, 50);
});
    
// no overflow: 10 digit display, 1 digit saved for operator
function handleNumbers(target) {
    // when an operator is on display
    // clear operator 
    if ( /[*/+\-]/.test(display.innerText)) {
        display.innerText = display.innerText.slice(1);
    }
    // when result of operate() is on the screen
    // clear screen before adding new number
    if (args[1] != undefined) {
        display.innerText = "";
    }

    display.innerText += target.value;
    doNotClearDisplay(target);
}

function handleOperator(target) {
     // when firstNum has been entered on display but not saved to args
     if ( args[0] == undefined && (/\d/.test(display.innerText)) ) {
        args[0] = display.innerText;
        args[1] = target.id;
        display.innerText = target.id;
        doNotClearDisplay(target);
    }
    // when firstNum and operator have been saved to args[], but second number is only entered on display
    // call operate()
    else if ( args[2] == undefined && 
        (/\d/.test(display.innerText)) ) {
            args[2] = display.innerText;
            let heldValue = operate(args[0], args[1], args[2]).toString();
            clearDisplay(target);
            if (heldValue.length > digitsAllowed) {
                alert("Digit Overflow");
                return;
            }
            else {
                args[0] = heldValue;
                display.innerText = heldValue;
                args[1] = target.id;
            }   
    }
    // when operate() has been called and its result will be used in another calculation 
    else if (args[0] != undefined) {
        args[1] = target.id;
        display.innerText = target.id;
        doNotClearDisplay(target);
    }
    // bad entry (decimal only, operator selected in wrong order)
    else {
        clearDisplay(target);
    }
}
function handleBackspace(target) {
    // if BACK button clicked once, delete last digit
    if (target.clicks == "none") {
        display.innerText = display.innerText.slice(0, -1);
        target.clicks = "clicked";
    }
    // if BACK button double-clicked, clearDisplay display
    else {             
        clearDisplay(target);
    }
}

// clearDisplay helper fxs
function doNotClearDisplay(target){
    if (target.clicks == "clicked") {
        target.clicks = "none"
    }
}
function clearDisplay(target) {
    display.innerText = "";
    target.clicks = "none";
    args = new Array(3);
}



