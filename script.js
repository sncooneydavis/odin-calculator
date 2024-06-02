// ElEMENT SELECTORS
const displayedInput = document.querySelector("#displayed-input");
const displayedOutput = document.querySelector("#displayed-output");
const buttonInput = document.querySelector(".button.container");

// total digits of display 
const digitsAllowed = 10;

// hold args for operate(number + operator + number)
let args = new Array(3);

// debounce handling
let debounceTimer;

// input types: #, operator, '.', or 'backspace'
buttonInput.addEventListener('click', (event) => {
    let target = event.target;

    if (!target.matches('button')) return;

    // debounce input handling
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {

        if ( (target.classList.contains("number") || 
        target.classList.contains("decimal") ) && 
        displayedInput.innerText.length < digitsAllowed) {
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

    }, 2000);
});

function handleNumber(target) {

    if (displayedInput.innerText >= digitsAllowed) {
        displayOverflowMsg();
        return;
    }
    if (displayedInput.innerText == "0") {
        if (target.value != ".") {
            displayedInput.innerText = target.value;
        }
        else {
            displayedInput.innerText += target.value;
        }
    }
}

function handleOperator(target) {

     // when args[] is empty
     if ( args[0] == undefined && (/[1-9]/.test(displayedInput.innerText)) ) {
       
        args[0] = displayedInput.innerText;
        args[1] = target.value;

        displayedInput.innerText += target.value;
    }

    // when args[] contains firstNum and operator, while secondNum is held in display-input
    else if (args[2] == undefined && (/[*/+\-]\d/.test(displayedInput.innerText))) {
        args[2] = extractNumTwo(displayedInput.innerText);
    
        let answerStr = operate(args[0], args[1], args[2]).toString();
        displayAnswer(answerStr);
    }
              
    // when args[] contains firstNum and operator, but secondNum is NOT held in display-input (i.e. two operators clicked in succession)
    else if (args[2] == undefined && (/\d+[+\-*/](?!\d)/.test(displayedInput.innerText))) {
            
        displayedInput.innerText.slice(0, -1);
        displayedInput.innerText += target.value;
        let operatorRegEx = /[+\-*/]/;
        args[1] = operatorRegEx.exec(input)[0];
    }

    // when bad entry (decimal only, operator selected first)
    else {
        clearDisplay();
    }
}

function handleDelete(target) {
    if (target.id == "backspace") {
        displayedInput.innerText.slice(0, -1);
    }
    else if (target.id == "clear") {
        clearDisplay();
    }
}

function handleEquals() {
    // when args[] contains firstNum and operator, while secondNum is held in display-input 
    if (args[2] == undefined && (/[*/+\-]\d/.test(displayedInput.innerText))) {
        
        args[2] = extractNumTwo(displayedInput.innerText);

        let answerStr = operate(args[0], args[1], args[2]).toString();
        displayAnswer(answerStr);
        args = new Array(3);
    }
}

function extractNumTwo(input) {
    let operatorRegEx = /[+\-*/]/;
    let numTwoFromStr = operatorRegEx.exec(input);
    return input.substring(numTwoFromStr.index + 1);
}

function operate(firstNum, operator, secondNum) {

    let first = parseFloat(firstNum);
    let second = parseFloat(secondNum);

    switch(operator) {
        case "+":
            return (first + second);
        case "-":
            return (first - second);
        case "*":
            return (first * second);
        case "/":
            return (first / second).toFixed(3);
    }
}

function displayAnswer (answerStr) {
  
        if (answerStr.length > digitsAllowed) {
            displayOverflowMsg();
            return;
        }
        else {
            displayedOutput.innerText = answerStr;
            args[0] = answerStr;
            args[1] = target.value;
            args[2] = "";
            return;
        } 
}

function displayOverflowMsg() {
    displayedOutput.innerText = "OVERFLOW";
    displayedInput.innerText = "press CLEAR to continue";
}

function clearDisplay() {
    displayedInput.innerText = "0";
    displayedOutput.innerText = "";
    args = new Array(3);
}

