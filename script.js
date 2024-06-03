// ElEMENT SELECTORS
const displayedFirstNum = document.querySelector("#displayed-firstNum");
const displayedOperator = document.querySelector("#displayed-operator");
const displayedSecondNum = document.querySelector("#displayed-secondNum");
const buttonInput = document.querySelector(".button.container");

// total digits of display 
const digitsAllowed = 8;

// hold args for operate(number + operator + number)
let args = new Array(3);

// debounce handling
let debounceTimer;

// input types: ###, operator, '.', or 'backspace'
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
        else {
            clearDisplay();
        }

    }, 200);
});

function handleNumber(target) {

    // start entering firstNum
    if (displayedFirstNum.innerText == "###") {

        // after displayOverflowMessage()
        if (displayedOperator.innerHTML == "&#128565") {
            displayedOperator.innerHTML = "";
            displayedOperator.innerText = "?";
        }
       
        // display decimals correctly 
        if (target.value != ".") {
            displayedFirstNum.innerText = target.value;
        }
        else if (target.value == ".") {
            displayedFirstNum.innerText = "0" + target.value;
        }
        return;
    }
    // continue entering firstNum
    else if ( (displayedFirstNum.innerText != "###") && 
    (displayedOperator.innerText == "?") ) {
        
        // when user types too many digits
        if (displayedFirstNum.innerText.length >= digitsAllowed) {
            displayOverflowMsg();
        }
        else {
            displayedFirstNum.innerText += target.value;
        }
        return;
    }
    // start entering secondNum
    else if (( displayedSecondNum.innerText == "###") &&
    (displayedOperator.innerText != "?") ) {
       
        // display decimals correctly
        if (target.value != ".") {
            displayedSecondNum.innerText = target.value;
        }
        else if (target.value == ".") {
            displayedSecondNum.innerText = "0" + target.value;
        }
        return;
    }
    // continue entering secondNum
    else if (displayedSecondNum.innerText != "###") {
        
        // when user types too many digits
        if (displayedSecondNum.innerText.length >= digitsAllowed) {
            displayOverflowMsg();
        }
        else {
            displayedSecondNum.innerText += target.value;
        }
        return;
    }
    else {
        console.log("error from entering number unaccounted for");
    }
}

function handleOperator(target) {

     // when args[] is empty and firstNum is displayed
     if ( args[0] == undefined && (displayedFirstNum.innerText != "###") ) {
       
        args[0] = displayedFirstNum.innerText;
        args[1] = target.value;

        displayedOperator.innerText = target.value;
    }

    // when args[] is empty and firstNum not displayed
    if ( args[0] == undefined && (displayedFirstNum.innerText == "###") ) {
        clearDisplay();
    }

    // when args[] firstNum only
    else if ( (args[0] != undefined) && 
    ((args[1] == undefined) || (args[1]=="")) ) {
        args[1] = target.value;
        displayedOperator.innerText = target.value;
    }
    
    // when secondNum is in display and args[] contains up to operator
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
        displayAnswer(answerStr);
    }
    // (edge case) when equals is pressed before secondNum is in display
    else if (displayedSecondNum.innerText == "###" ) {
        clearDisplay();
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
        else if ( (displayedOperator.innerText != "?") &&
        (displayedSecondNum == "###") ) {
            displayedOperator.innerText == "?";
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
    
    if (Number.isInteger(possibleFloat) && 
    possibleFloat.toString().length > digitsAllowed) {
        displayOverflowMsg();
        return;
    }

    else if (!Number.isInteger(possibleFloat)) {
        let integerPartLen = possibleFloat.toString().match(/^[^.]*/).length;
        
        if (integerPartLen > digitsAllowed) {
            displayOverflowMsg();
            return;
        }
        // calc how many digits left for decimal places
        let spacesAvailable = digitsAllowed - integerPartLen;
        let fixedFloat = possibleFloat.toFixed(spacesAvailable);
        // remove trailing zeros
        return fixedFloat.toString().replace(/(\.\d*?[1-9])0+$/, '$1');
    }
    // possibleFloat is both an integer and < digitsAllowed
    return possibleFloat;
}

function displayAnswer (answerStr) {

            displayedFirstNum.innerText = answerStr;
            args[0] = answerStr;
            args[1] = "";
            args[2] = "";
} 

function displayOverflowMsg() {
    clearDisplay();
    displayedFirstNum.innerText = "###";
    displayedOperator.innerHTML = "&#128565";
    displayedSecondNum.innerText = "###";
}

function clearDisplay() {
    displayedFirstNum.innerText = "###";
    displayedOperator.innerText = "?";
    displayedSecondNum.innerText = "###";

    args = new Array(3);
}

