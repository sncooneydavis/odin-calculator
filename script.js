// ElEMENT SELECTORS
const displayedFirstNum = document.querySelector("#displayed-firstNum");
const displayedOperator = document.querySelector("#displayed-operator");
const displayedSecondNum = document.querySelector("#displayed-secondNum");
const buttonInput = document.querySelector(".button.container");
const decimalBtn = document.querySelector(".decimal.button");

// total digits of display 
const digitsAllowed = 6;

// hold args for operate(number + operator + number)
let args = new Array(3);

// debounce handling
let debounceTimer;

// input types: ###, operator, '.', 'backspace,' or 'DELETE'
buttonInput.addEventListener('click', (event) => {
    let target = event.target;

    // debounce input handling
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {

        if ( (target.classList.contains("number") || 
        target.classList.contains("decimal")) ) {
            handleNumber(target);
        }
        else if (target.classList.contains("operator")) {
            handleOperator(target);
        }
        else if (target.classList.contains("bottom")) {
            handleDelete(target); 
        }
        else if (target.classList.contains("equals")) {
            handleEquals();
        }

    }, 100);
});

function handleNumber(target) {

    // enter firstNum in display
    if (displayedFirstNum.innerText == "###") {

        // after displayOverflowMessage()
        if (displayedOperator.innerText == "😵") {
            clearDisplay();
        }
        
        highlight("FirstNum", "on");
        startEnteringNum(target, displayedFirstNum);
    }

    // continue entering firstNum in display
    else if ( (displayedFirstNum.innerText != "###") && 
    (displayedOperator.innerText == "?") ) {

        continueEnteringNum(target, displayedFirstNum);
    }

    // start entering secondNum in display
    else if (( displayedSecondNum.innerText == "###") &&
    (displayedOperator.innerText != "?") ) {
        
        highlight("SecondNum", "on");
        startEnteringNum(target, displayedSecondNum);
    }

    // continue entering secondNum in display
    else if (displayedSecondNum.innerText != "###") {
        continueEnteringNum(target, displayedSecondNum);
    }
}

// HELPERS
function startEnteringNum(target, num) {
    
    if (target.value != ".") {
        num.innerText = target.value;
    }

    // ensure decimal follows a number
    else if (target.value == ".") {
        target.disabled = true;
        num.innerText = "0" + target.value;
    }
}
function continueEnteringNum(target, num) {
    
    // when user types too many digits
    if (num.innerText.length >= digitsAllowed) {
        displayOverflowMsg();
        return;
    }

    if (target.value == ".") {
        target.disabled = true;
    }

    num.innerText += target.value;
}

function handleOperator(target) {

    // reset decimal button
    if (decimalBtn.disabled == true) {
        decimalBtn.disabled = false;
    }

     // when args[] is empty and firstNum is displayed
     if ( args[0] == undefined && (displayedFirstNum.innerText != "###") ) {
       
        args[0] = displayedFirstNum.innerText;
        args[1] = target.value;

        highlight("Operator", "on");
        displayedOperator.innerText = target.value;
    }

    // when args[] is empty and firstNum not displayed
    else if ( args[0] == undefined && (displayedFirstNum.innerText == "###") ) {
        clearDisplay();
    }

    // when args[0] contains result from operate()
    else if ( (args[0] != undefined) && 
    ((args[1] == undefined) || (args[1]=="")) ) {
        
        args[1] = target.value;

        highlight("Operator", "on");
        displayedOperator.innerText = target.value;
    }

    // change existing operator
    else if ((args[1] != undefined) && 
    (displayedSecondNum.innerText == "###")) {
        args[1] = target.value;
        displayedOperator.innerText = target.value;

    }
    
    // when secondNum is in display and args[1] contains operator
    else if ( (args[2] == undefined || args[2] == "") && 
    (/\d/.test(displayedSecondNum.innerText)) ) {
        
        args[2] = displayedSecondNum.innerText;

        // no dividing by zero
        if ( (args[1] == '/') && (args[2] == '0') ) {
            displayOverflowMsg();
            return;
        }

        let answerStr = operate(args[0], args[1], args[2]);
        clearDisplay();
        highlight("FirstNum", "on");
        highlight("Operator", "on");
        displayAnswer(answerStr);
        args[1] = target.value;
        displayedOperator.innerText = target.value;
    }
}

function handleEquals() {
    
    // when args[] contains firstNum and operator, while secondNum is in display
    if ( (args[2] == undefined || args[2] == "") && 
    (displayedSecondNum.innerText != "###")) {
        
        args[2] = displayedSecondNum.innerText;

        // no dividing by zero
        if ( (args[1] == '/') && (args[2] == '0') ) {
            displayOverflowMsg();
            return;
        }

        let answerStr = operate(args[0], args[1], args[2]);
        clearDisplay();
        highlight("FirstNum", "on");
        displayAnswer(answerStr);
    }
    
    // (edge case) when equals is pressed before secondNum is in display
    else if (displayedSecondNum.innerText == "###" ) {
        clearDisplay();
    }
}

function operate(firstNum, operator, secondNum) {

    let first = parseFloat(firstNum);
    let second = parseFloat(secondNum);
    let possibleFloat;

    switch(operator) {
        case "+":
            possibleFloat = first + second;
            break;
        case "-":
            possibleFloat = first - second;
            break;
        case "*":
            possibleFloat = first * second;
            break;
        case "/":
            possibleFloat = first / second;
            break;
    }
    return checkSize(possibleFloat);
}

function checkSize(possibleFloat) {
    
    if (Number.isInteger(possibleFloat)) {
        if (possibleFloat.toString().length > digitsAllowed*2) {
            displayOverflowMsg();
            return;
        }
        // possibleFloat is both an integer and < digitsAllowed
        return possibleFloat;
    } 

    else if (!Number.isInteger(possibleFloat)) {
        
        let integerPartLen = possibleFloat.toString().indexOf(".");
        
        if (integerPartLen >= digitsAllowed) {
            displayOverflowMsg();
            return;
        }
        // calc how many digits left for decimal places
        let spacesAvailable = digitsAllowed - integerPartLen;
        console.log(spacesAvailable);
        let fixedFloat = possibleFloat.toFixed(spacesAvailable);
        // remove trailing zeros
        return fixedFloat.toString().replace(/(\.\d*?[1-9])0+$/, '$1');
    }
}

function displayAnswer (answerStr) {

    displayedFirstNum.innerText = answerStr;
    args[0] = answerStr;
    args[1] = "";
    args[2] = "";

    // after operate() returns a decimal value
    if (/\./.test(displayedFirstNum.innerText)) {
        decimalBtn.disabled = true;
    }
} 

function clearDisplay() {
    args = new Array(3);
    displayedFirstNum.innerText = "###";
    displayedOperator.innerText = "?";
    displayedSecondNum.innerText = "###";
    decimalBtn.disabled = false;
    highlight("FirstNum", "off");
    highlight("Operator", "off");
    highlight("SecondNum", "off");
}

function displayOverflowMsg() {
    clearDisplay();
    displayedOperator.innerText = "😵";
}

function highlight(arg, toggle) {
    
    let element;
    if (arg == "FirstNum") {
        element = displayedFirstNum;
    }
    else if (arg == "SecondNum") {
        element = displayedSecondNum;
    }
    else if (arg == "Operator") {
        element = displayedOperator;
    }

    if (toggle == "on") {
        element.classList.add("cssHighlighted");
        element.classList.remove("cssNotHighlighted");
    }
    else if (toggle == "off") {
        element.classList.add("cssNotHighlighted");
        element.classList.remove("cssHighlighted");
    }
}

function handleDelete(target) {
    
    if (target.id == "backspace") {
        // delete last entry for firstNum
        if (displayedOperator.innerText == "?") {
            displayedFirstNum.innerText = 
            displayedFirstNum.innerText.slice(0, -1);
            if (/[1-9]/.test(args[0])) {
                args[0] = args[0].toString().slice(0, -1);
            }
        }

        // delete operator
        else if ( (displayedOperator.innerText != "?") && (displayedSecondNum.innerText == "###") ) {
            displayedOperator.innerText = "?";
            args[1] = "";
        }

        // delete last entry for secondNum
        else if (displayedSecondNum.innerText != "###") {
            displayedSecondNum.innerText = 
            displayedSecondNum.innerText.slice(0, -1);
        }
    }
    else if (target.id == "clear") {
        clearDisplay();
    }
}