document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");


        const setup = document.getElementById('setup');
        const quiz = document.getElementById('quiz');
        const result = document.getElementById('result');

        const numQuestionsInput = document.getElementById('numQuestions');
        const timeLimitInput = document.getElementById('timeLimit');
        const levelSelect = document.getElementById('level');
        const layoutOption = document.getElementById('layoutOption');
        const layoutSelect = document.getElementById('layout');

        const timerDisplay = document.getElementById('time');
         const answerInput = document.getElementById('inline-answer');

        const columnLayout = document.getElementById('column-layout');
        const rowLayout = document.getElementById('row-layout');
        const carryRow = document.getElementById('carry-row');
        const firstRow = document.getElementById('first-row');
        const operatorRow = document.getElementById('operator-row');
        const secondRow = document.getElementById('second-row');
        const inputRow = document.getElementById('input-row');
        const divider = document.getElementById('divider');
        const scoreDisplay = document.getElementById('score');
        const explanationDisplay = document.getElementById('explanation');
        const optionsContainer = document.getElementById('options-container');
       const operation = document.getElementById('operation');
        const levelSelected = document.getElementById('level-selected');
       const longDivision = document.getElementById('long-division-container');
        const historyStack = [];
       
        let timer;
        let timeRemaining;
        let questions = [];
        let currentQuestionIndex = 0;
        let score = 0;
        
        document.getElementById('startGame').addEventListener('click', startGame);
        document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
        document.getElementById('restartGame').addEventListener('click', () => location.reload());
        
       levelSelect.addEventListener('change', () => {
            if (levelSelect.value === '2') {
                layoutOption.style.display = 'block';
            } else {
                layoutOption.style.display = 'none';
            }
        });

       

        function startGame() {
            currentQuestionIndex = 0; // Initialize the question index
            score = 0; // Initialize the score
        
            const numQuestions = parseInt(numQuestionsInput.value);
            const timeLimit = parseInt(timeLimitInput.value) * 60; // Convert to seconds
            const level = parseInt(levelSelect.value);
            const layout = layoutSelect.value;
            const operation = document.getElementById('operation').value; // Get selected operation
            const divisionMode = document.getElementById('division-options')?.value; // Get division mode (if any)
            const goBackButton = document.getElementById('go-back-btn');
            const timerEnabled = document.getElementById('timerToggle').checked;
        
            goBackButton.style.display = 'inline-block';
            goBackButton.addEventListener('click', () => location.reload());
        
            setup.style.display = 'none';
            quiz.style.display = 'block';
            document.getElementById('startGame').style.display = 'none'; // Show startGame butt
        
            
            const isDivisionMode = operation === 'division' || operation === 'mix';
 
            // Generate questions based on operation
            questions = generateQuestions(numQuestions, level, layout, operation, isDivisionMode ? divisionMode : undefined);
            console.log("Generated Questions:", questions); // Debugging
            document.getElementById('total').textContent = numQuestions;
        
            if (timerEnabled) {
                timeRemaining = timeLimit;
                startTimer();
            } else {
                timerDisplay.textContent = '∞'; // Show infinity symbol if timer is off
            }
        
            loadQuestion();
        }


function startTimer() {
    if (isNaN(timeRemaining) || timeRemaining <= 0) {
        console.error("Invalid timer value:", timeRemaining);
        return;
    }
    timerDisplay.textContent = formatTime(timeRemaining);
    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = formatTime(timeRemaining);
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function generateQuestions(num, level, layout, operation, divisionMode = 'basic1') {
            const questions = [];
            const operators = {
                addition: ['+'],
                subtraction: ['-'],
                multiplication: ['*'],
                division: ['⟌'],
                mix: ['+', '-', '*', '⟌']
            };
        
            const selectedOperators = operators[operation] || [];
            if (selectedOperators.length === 0) {
                console.error("No operators found for the selected operation.");
                return [];
            }
            for (let i = 0; i < num; i++) {
                let question = '';
                let answer = 0;
                let type = layout;
        
                const a = Math.floor(Math.random() * (level === 1 ? 10 : 800)) + 1;
                let b = Math.floor(Math.random() * (level === 1 ? 10 : 800)) + 1;
                const operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];
        
                if (operator === '+') {
                    question = `${a} + ${b}`;
                    answer = a + b;
                } else if (operator === '-') {
                    if (a >= b) {
                        question = `${a} - ${b}`;
                        answer = a - b;
                    } else {
                        question = `${b} - ${a}`;
                        answer = b - a;
                    }
                } else if (operator === '*') {
                    question = `${a} * ${b}`;
                    answer = a * b;
                } else if (operator === '⟌') {
                    const divisionValues = generateDivisionValues(divisionMode);
                    if (!divisionValues) {
                        console.error("Failed to generate division values.");
                        continue;
                    }
                    const { divisor, dividend } = divisionValues;
                    question = `${dividend} ⟌ ${divisor}`;
                    answer = dividend / divisor;
                    type = 'division';
                }
        
                questions.push({ question, answer, type });
            }
            return questions;
        }
        

        function loadQuestion() {
            if (currentQuestionIndex >= questions.length) {
                endGame();
                return;
            }
        
            const current = questions[currentQuestionIndex];
        
            if (current.type === 'column') {
                setupColumnLayout(current.question);
                columnLayout.style.display = 'flex';
                rowLayout.style.display = 'none';
                longDivision.style.display = 'none';
                document.getElementById('submitAnswer').style.display = 'block'; // Show startGame button
        
                

              
               
            } else if (current.type === 'division') {
                const [dividend, divisor] = current.question.split(' ⟌ ').map(Number);
                setupDivisionLayout(dividend, divisor, current.answer);
                rowLayout.style.display = 'none';
                optionsContainer.style.display = 'none';
                document.getElementById('submitAnswer').style.display = 'block'; // Show startGame button
        

                
            } else {
                setupRowLayout(current.question);
                columnLayout.style.display = 'none';
                rowLayout.style.display = 'flex';
                optionsContainer.style.display = 'none';
                document.getElementById('startGame').style.display = 'block'; // Show startGame button
        
            }
        
            document.getElementById('current').textContent = currentQuestionIndex + 1;
            answerInput.value = '';
        }
        
        
        function setupColumnLayout(question) {
    const [a, operator, b] = question.split(' ');

    // Clear previous content
    carryRow.innerHTML = '';
    firstRow.innerHTML = '';
    operatorRow.innerHTML = '';
    secondRow.innerHTML = '';
    inputRow.innerHTML = '';

      // Handle multiplication separately
      if (operator === '*') {
        setupMultiplicationLayout(a, b);
        return; // Exit early since multiplication is handled separately
    }
      // Handle division separately
      if (operator === '⟌') {
        setupDivisionLayout(a, b);
        return;
    }

    // Align the numbers to the right by padding them
    const maxLength = Math.max(a.length, b.length);
    const paddedA = a.padStart(maxLength, ' ');
    const paddedB = b.padStart(maxLength, ' ');

    // Carry/Borrow logic
    for (let i = 0; i < maxLength; i++) {
    const digitA = parseInt(paddedA[i] || '0', 10);
    const digitB = parseInt(paddedB[i] || '0', 10);

    // Create the carry/borrow input box
    const carryInput = document.createElement('input');
    carryInput.type = 'text';
    carryInput.classList.add('input-cell');
    carryInput.style.display = 'none'; // Default: hidden
    
    carryRow.appendChild(carryInput);
   
    if (maxLength <= 2) {
        continue;
    }
    // Check if carry or borrow is needed
    if (operator === '+') {
        if (digitA + digitB >= 10) {
            carryInput.maxLength = 1; // Allow up to 2 digits
            carryInput.style.display = 'block'; // Show if carry is needed
        } 
    } else if (operator === '-') {
        if (digitA < digitB) {
            carryInput.maxLength = 2; // Allow up to 2 digits
            carryInput.style.display = 'block'; // Show if borrow is needed
        }
    }
   
    
}


// Check if any input box in the carry row is visible
const allCarryInputs = carryRow.querySelectorAll('.input-cell');
const anyCarryVisible = Array.from(allCarryInputs).some(input => input.style.display === 'block');

// If any carry/borrow is needed, make all input boxes visible
if (anyCarryVisible) {
    allCarryInputs.forEach(input => {
        input.style.display = 'block'; // Ensure all boxes are visible
    });
} else {
    // If no carry/borrow is needed, ensure all boxes are hidden
    allCarryInputs.forEach(input => {
        input.style.display = 'none';
    });
}

    // First number row
    for (const digit of paddedA) {
        const span = document.createElement('span');
        span.textContent = digit.trim() || ' ';
        firstRow.appendChild(span);
    }
    

    // Operator and second number row
    const operatorSpan = document.createElement('span');
    operatorSpan.textContent = operator;
    operatorRow.appendChild(operatorSpan);

    for (const digit of paddedB) {
        const span = document.createElement('span');
        span.textContent = digit.trim() || ' ';
        secondRow.appendChild(span);
    }
    

    // Calculate the answer to determine the number of input boxes
    let answer;
    switch (operator) {
        case '+':
            answer = parseInt(a) + parseInt(b);
            break;
        case '-':
            answer = parseInt(a) - parseInt(b);
            break;
        case '*':
            answer = parseInt(a) * parseInt(b);
            break;
        case '/':
            answer = Math.floor(parseInt(a) / parseInt(b)); // Integer division
            break;
        default:
            answer = 0;
    }

    const answerStr = answer.toString();

    // Answer input row (corresponding to the length of the answer)
    for (let i = 0; i < answerStr.length; i++) {
        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.classList.add('input-cell');
        answerInput.maxLength = 1; // Allow only one digit
        inputRow.appendChild(answerInput);
    }
    
}

document.addEventListener('input', (event) => {
    if (event.target.classList.contains('input-cell')) {
        const value = event.target.value;

        // Allow only numbers up to 2 digits
        if (!/^\d{1,2}$/.test(value)) {
            event.target.value = value.slice(0, 2); // Truncate to 2 digits
        }
    }
});

        function setupRowLayout(question) {
            const [a, operator, b] = question.split(' ');

            document.getElementById('first-number').textContent = a;
            document.getElementById('operator').textContent = operator;
            document.getElementById('second-number').textContent = b;
        }

   function submitAnswer() {
     
            const current = questions[currentQuestionIndex];
            
            if (!current) {
                console.error("Question is undefined.");
                return;
            }
        
            let isCorrect = false;
        
            // Handle division-specific inputs
            if (current.type === 'division') {
                const quotientInputs = Array.from(document.querySelectorAll('.quotient-input'));
                const userQuotient = quotientInputs.map(input => input.value).join('');
        
                const remainderInput = document.querySelector('.remainder-input');
                const userRemainder = parseInt(remainderInput.value, 10);
        
                if (userQuotient === String(Math.floor(current.answer)) && userRemainder === current.remainder) {
                    isCorrect = true;
                }
            } else if (current.type === 'column') {
                const inputs = Array.from(inputRow.querySelectorAll('.input-cell'));
                const userAnswer = inputs.map(input => input.value).join('');
        
                if (userAnswer === String(current.answer)) {
                    isCorrect = true;
                }
            } else {
                const userAnswer = answerInput.value;
        
                if (userAnswer === String(current.answer)) {
                    isCorrect = true;
                }
            }
        
            if (isCorrect) {
                score++;
            }
        
            currentQuestionIndex++;
        
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                endGame();
            }
        }
        
        function endGame() {
            clearInterval(timer);
            document.getElementById('go-back-btn').style.display = 'none';
            quiz.style.display = 'none';
            result.style.display = 'block';
        
            // Display final score
            scoreDisplay.textContent = `Your Score: ${score}/${questions.length}`;
            explanationDisplay.textContent = 'Review the equations and practice to improve your math skills!';
        }
        

   

// Enable input highlighting for bulk operations
document.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('input-cell')) {
        event.target.classList.toggle('selected'); // Toggle selected state
    }
});

// Ensure mouse dragging highlights multiple inputs
let isMouseDown = false;

document.addEventListener('mousedown', () => (isMouseDown = true));
document.addEventListener('mouseup', () => (isMouseDown = false));
document.addEventListener('mouseover', (event) => {
    if (isMouseDown && event.target.classList.contains('input-cell')) {
        event.target.classList.add('selected'); // Add to selection when dragging
    }
});



let rowInputs = [];
let carryBoxes = [];


// Main function to set up the layout
function setupMultiplicationLayout(multiplicand, multiplier) {
    // Ensure multiplicand is greater than or equal to multiplier
    if (parseInt(multiplicand) < parseInt(multiplier)) {
        [multiplicand, multiplier] = [multiplier, multiplicand];
    }

    // Clear previous content
    carryRow.innerHTML = '';
    firstRow.innerHTML = '';
    operatorRow.innerHTML = '';
    secondRow.innerHTML = '';
    partialResultsRow.innerHTML = '';
    inputRow.innerHTML = '';

    // Align numbers to the right
    const maxLength = Math.max(multiplicand.length, multiplier.length);
    const paddedMultiplicand = multiplicand.padStart(maxLength, ' ');
    const paddedMultiplier = multiplier.padStart(maxLength, ' ');

    // Display the multiplicand
    for (const digit of paddedMultiplicand) {
        const span = document.createElement('span');
        span.textContent = digit.trim() || ' ';
        firstRow.appendChild(span);
    }

    // Display the multiplier
    const operatorSpan = document.createElement('span');
    operatorSpan.textContent = '×';
    operatorRow.appendChild(operatorSpan);

    for (const digit of paddedMultiplier) {
        const span = document.createElement('span');
        span.textContent = digit.trim() || ' ';
        secondRow.appendChild(span);
    }

    // Handle basic multiplication (1-digit multiplier)
    if (multiplier.length === 1) {
        setupBasicMultiplication(paddedMultiplicand, multiplier);
        return;
    }

    // Create two carry boxes (aligned left)
    carryBoxes = [];
    for (let i = 0; i < 2; i++) {
        const carryInput = document.createElement('input');
        carryInput.type = 'text';
        carryInput.classList.add('input-cell', 'carry-cell');
        carryInput.maxLength = 1;
        carryRow.classList.add('carry-rowmultiplication');
        carryRow.appendChild(carryInput);
        carryBoxes.push(carryInput);
    }

    // Create rows for partial products
    let rowShift = 0;
    for (let i = 0; i < multiplier.length; i++) {
        const rowLength = maxLength + 1;
        rowInputs.push(createRowInputs(rowLength, rowShift));
        rowShift++;
    }

    // Add "+" sign and divider
    const plusSign = document.createElement('span');
    plusSign.textContent = '+';
    partialResultsRow.appendChild(plusSign);

    const divider = document.createElement('div');
    divider.classList.add('divider');
    partialResultsRow.appendChild(divider);

    // Add final sum row
    const sumRow = document.createElement('div');
    sumRow.classList.add('sum-row');
    const totalLength = maxLength + multiplier.length - 1;
    for (let i = 0; i < totalLength; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-cell');
        input.maxLength = 1;
        input.addEventListener('input', (e) => handleInput(e, input, rowInputs.length, i));
        sumRow.appendChild(input);
    }
    inputRow.appendChild(sumRow);

    // Initialize and focus inputs
    initializeInputFocus();
    startFocus();
    initializeFirstRow(firstRow);
}
// Generalized bulk delete and backspace handling for all inputs
document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const selectedInputs = document.querySelectorAll('.input-cell.selected, .input-cell:focus');

    if ((event.key === 'Backspace' || event.key === 'Delete') && selectedInputs.length > 0) {
        selectedInputs.forEach(input => {
            input.value = '';  // Clear the value of selected inputs
        });

        // Focus management: move to the next or previous input
        if (activeElement.classList.contains('input-cell')) {
            const nextInput = activeElement.previousElementSibling || activeElement.nextElementSibling;
            if (nextInput && nextInput.classList.contains('input-cell')) {
                nextInput.focus();  // Shift focus
            }
        }
        event.preventDefault();  // Prevent default browser behavior
    }
});

// Enable selection by clicking on input cells
document.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('input-cell')) {
        event.target.classList.toggle('selected');  // Toggle selected state
    }
});

// Deselect inputs on click outside
document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('input-cell')) {
        document.querySelectorAll('.input-cell.selected').forEach(input => {
            input.classList.remove('selected');
        });
    }
});


// Create input rows for partial products
function createRowInputs(length, shift) {
    const row = document.createElement('div');
    row.classList.add('partial-row');

    const inputs = [];
    for (let i = 0; i < length + shift; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-cell');
        input.maxLength = 1;

        if (i >= length) {
            input.disabled = true;
            input.classList.add('shifted-cell');
        }

        input.addEventListener('input', (e) => handleInput(e, input, rowInputs.length, i));
        row.appendChild(input);
        inputs.push(input);
    }

    partialResultsRow.appendChild(row);
    return inputs;
}

// Handle input events and cursor movement
function handleInput(event, input, rowIndex, inputIndex) {
    const value = event.target.value;
    if (value.length === input.maxLength) {
        const carryBox = carryBoxes[inputIndex];
        if (carryBox && !carryBox.disabled) {
            carryBox.focus();
            carryBox.addEventListener('input', () => {
                const nextInput = input.previousElementSibling;
                if (nextInput && !nextInput.disabled) {
                    nextInput.focus();
                } else {
                    moveToNextRow(rowIndex);
                }
            }, { once: true });
            return;
        }

        const nextInput = input.previousElementSibling;
        if (nextInput && !nextInput.disabled) {
            nextInput.focus();
        } else {
            moveToNextRow(rowIndex);
        }
    }
}

// Move to the next row and clear carry boxes
function moveToNextRow(currentRowIndex) {
    if (currentRowIndex < rowInputs.length - 1) {
        currentRowIndex++;
        rowInputs[currentRowIndex][rowInputs[currentRowIndex].length - 1].focus();
    }
}

// Initialize input focus and highlight
function initializeInputFocus() {
    rowInputs.forEach((row, rowIndex) => {
        row.forEach((input, inputIndex) => {
            input.addEventListener('input', (e) => handleInput(e, input, rowIndex, inputIndex));
        });
    });
}

// Focus on the first input
function startFocus() {
    if (rowInputs.length > 0) {
        rowInputs[0][rowInputs[0].length - 1].focus();
    }
}

// Enable slashing on first row
function initializeFirstRow(firstRowElement) {
    enableSlashing(firstRowElement);
}

function enableSlashing(firstRowElement) {
    const spans = firstRowElement.querySelectorAll('span');
    spans.forEach(span => {
        span.addEventListener('click', () => {
            span.classList.toggle('slashed');
        });
    });
}
function setupBasicMultiplication(multiplicand) {
    // Clear previous content
    partialResultsRow.innerHTML = ''; 

    // Loop through each digit of the multiplicand
    for (let i = multiplicand.length - 1; i >= 0; i--) {
        
        // Create an input box for the user to input the product
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-cell');
        input.maxLength = 2; // Allow up to two digits for the product
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 2) {
                e.target.value = value.slice(0, 2); // Ensure input is max two digits
            }
        });

        // Add the input box to the partial results row
        partialResultsRow.prepend(input); // Add to the row (prepend for right alignment)
    }
}
operation.addEventListener('change', ()=>{
    if(operation.value === 'division'){
        levelSelected.style.display = 'none';
        layoutOption.style.display = 'block';
        optionsContainer.style.display = 'block';
       
        
    }else{
        levelSelected.style.display = 'block';
        optionsContainer.style.display = 'none'; // Hide division options
        document.getElementById('startGame').style.display = 'block'; // Show startGame button
    }
})


function generateDivisionValues(mode) {
    let divisor, dividend;

    switch (mode) {
        case 'basic1': // Divisor 1-5, Dividend < 100
            divisor = Math.floor(Math.random() * 5) + 1;
            dividend = divisor * Math.floor(Math.random() * (50 / divisor));
            break;

        case 'basic2': // Divisor 6-10, Dividend < 100
            divisor = Math.floor(Math.random() * 5) + 6;
            dividend = divisor * Math.floor(Math.random() * (100 / divisor));
            break;

        case 'advanced1': // Divisor 1-9, Dividend < 1000
            divisor = Math.floor(Math.random() * 9) + 1;
            dividend = divisor * Math.floor(Math.random() * (1000 / divisor));
            break;

        case 'advanced2': // Divisor 11-99, Dividend < 10000
            divisor = Math.floor(Math.random() * 89) + 11;
            dividend = divisor * Math.floor(Math.random() * (10000 / divisor));
            break;

        case 'advanced3': // Divisor 100-999, Dividend < 10000
            divisor = Math.floor(Math.random() * 900) + 100;
            dividend = divisor * Math.floor(Math.random() * (10000 / divisor));
            break;

        default:
            console.error('Invalid mode selected');
            return null;
    }
    console.log('Generated values:', { divisor, dividend });

    return { divisor, dividend };
}




//Division codes
function setupDivisionLayout(dividend, divisor) {
    
    const container = document.getElementById('long-division-container');
    container.innerHTML = ''; // Clear previous content

    divider.style.display = 'none';
  
    const divisionContainer = document.createElement('div');
    divisionContainer.className = 'long-division-container';
    divisionContainer.innerHTML = '';

    const quotientRow = document.createElement('div');
    quotientRow.classList.add('quotient-row');

    const divisionBar = document.createElement('div');
    divisionBar.classList.add('division-bar');
    divisionBar.style.display = 'block';

    const divisionRow = document.createElement('div');
    divisionRow.classList.add('division-row');

    const divisorDiv = document.createElement('div');
    divisorDiv.classList.add('divisor');
    divisorDiv.textContent = divisor;

    const dividendDiv = document.createElement('div');
    dividendDiv.classList.add('dividend');
    dividendDiv.textContent = dividend;

    divisionRow.appendChild(divisorDiv);
    divisionRow.appendChild(dividendDiv);

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('steps-container');
    document.body.appendChild(stepsContainer);
    
    

    container.appendChild(quotientRow);
    container.appendChild(divisionBar);
    container.appendChild(divisionRow);
    container.appendChild(stepsContainer);

    const dividendDigits = dividend.toString().split('').map(Number);
    let currentRemainder = 0;
    let stepIndex = 0;

   

    // Calculate quotient and generate quotient input boxes
    const quotient = Math.floor(dividend / divisor);
    const quotientDigits = quotient.toString().split('');

    // Generate quotient input boxes
    quotientDigits.forEach(( index) => {
        const quotientInput = document.createElement('input');
        quotientInput.type = 'text';
        quotientInput.maxLength = 1;
        quotientInput.classList.add('quotient-input');
        quotientInput.placeholder = 'Quotient';
        quotientRow.appendChild(quotientInput);

        quotientInput.addEventListener('input', function () {
            const userInput = parseInt(quotientInput.value, 10);
            if (!isNaN(userInput)) {
                const multipliedValue = userInput * divisor;
                renderStep(multipliedValue, stepsContainer, dividendDigits, stepIndex);
            }
        });

        quotientInput.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && quotientInput.value === '') {
                const previousInput = quotientRow.children[index - 1];
                if (previousInput) {
                    previousInput.disabled = false;
                    previousInput.focus();
                }
            }
        });
    });

    function renderStep(multipliedValue, container, digits, index) {
        if (!container) {
            console.error('Container is undefined in renderStep');
            return;
        }
    
        // Create a unique step row for each operation
        const stepRow = document.createElement('div');
        stepRow.classList.add('step-row');
    
  // Ensure the multiplied value is represented as two digits if needed
const multipliedValueStr = multipliedValue.toString(); // Do not pad with '0' here

// Create input boxes for the multiplied digits
const multipliedDigits = multipliedValueStr.split('').map((digit, i) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.classList.add('step-input');
    input.placeholder = 'Digit';

    // Handle leading zero only for multi-digit numbers
    if (i === 0 && digit === '0' && multipliedValueStr.length > 1) {
        input.value = '0';
        input.readOnly = true; // Make the placeholder '0' non-editable
    } else {
        input.value = ''; // Leave input empty for single-digit numbers or other cases
        input.readOnly = false; // Ensure input is editable
    }

    return input;
});

        // Append the digit inputs to the row
        multipliedDigits.forEach(input => stepRow.appendChild(input));
        container.appendChild(stepRow);
    
 // Track multiplied digits in history
 historyStack.push({ type: 'multiplied', element: stepRow });


        // Add a divider after the multiplied digits
        const divider = document.createElement('div');
        divider.classList.add('subtraction-divider');
        container.appendChild(divider);


     
        // Focus on the first editable digit
        const firstEditableInput = multipliedDigits.find(input => !input.readOnly);
        if (firstEditableInput) {
            firstEditableInput.focus();
        }
    
        // Add event listeners for user interaction
        multipliedDigits.forEach((input, i) => {
            input.addEventListener('input', function () {
                if (i < multipliedDigits.length - 1) {
                    multipliedDigits[i + 1].focus();
                } else  {
                    // Create remainder input after the multiplied digits are complete
                    const spanContainer = document.createElement('div');
                    spanContainer.classList.add('span-container');
    
                    const remainderInput = document.createElement('input');
                    remainderInput.type = 'text';
                   
                    remainderInput.classList.add('remainder-input');
                    remainderInput.placeholder = 'Remainder';
                    spanContainer.appendChild(remainderInput);
    
                    container.appendChild(spanContainer);
                       // Track remainder input
                     historyStack.push({ type: 'remainder', element: spanContainer });

                     remainderInput.focus();
    
                    remainderInput.addEventListener('input', function () {
                        const userRemainder = parseInt(remainderInput.value, 10);
                        if (!isNaN(userRemainder)) {
                            currentRemainder = userRemainder;
    
                            // Trigger bring-down if there are more digits
                            const nextDigit = digits[index + 1];
                            if (nextDigit !== undefined) {
                                bringDownDigit(index + 1, container); // Call bringDownDigit with the container
                            } else {
                                renderFinalMessage(); // End the process
                            }
                        }
                    });
    
                    remainderInput.addEventListener('keydown', function (e) {
                        if (e.key === 'Backspace' && remainderInput.value === '') {
                            undoLastStep(); // Undo last step when Backspace is pressed
                        }
                    });
                }
    
            
    

    function bringDownDigit(index) {
       
        // Stop if the index exceeds the last digit of the dividend
        if (index >= dividendDigits.length) {
            renderFinalMessage(); // End process with a final message
            return;
        }
    
        // Check if the last digit has already been processed
        if (index === dividendDigits.length - 1 && currentRemainder === 0) {
            renderFinalMessage(); // No more digits to bring down
            return;
        }
    
        // Create a row for bringing down the digit
        const spanContainer = document.createElement('div');
        spanContainer.classList.add('span-container');

        const bringDownInput = document.createElement('input');
        bringDownInput.type = 'text';
        bringDownInput.maxLength = 1;
        bringDownInput.classList.add('bring-down-input');
        bringDownInput.placeholder = 'Bring Down';
        spanContainer.appendChild(bringDownInput);
        container.appendChild(spanContainer);
        
   // Track bring-down step
   historyStack.push({ type: 'bring-down', element: spanContainer });

   bringDownInput.focus();
   
   
        bringDownInput.addEventListener('input', function () {
            const userBringDown = parseInt(bringDownInput.value, 10);
    
            if (!isNaN(userBringDown)) {
                currentRemainder = currentRemainder * 10 + userBringDown;
                renderStep(/* updated values */);
                // Move to the next quotient input box
                const quotientInput = quotientRow.children[stepIndex+1];
                if (quotientInput) {
                    quotientInput.focus(); // Focus on the next quotient input box
                    stepIndex++; // Increment the index for the next quotient input box
                }
    
                // Stop bring-down process if all digits are handled
                if (index + 1 >= dividendDigits.length) {
                   
                }
            }
        
        });
    
        bringDownInput.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && bringDownInput.value === '') {
                undoLastStep(); // Undo last step when Backspace is pressed
            }
        });
    }

            
    function undoLastStep() {
        if (historyStack.length === 0) {
            console.log('No steps to undo');
            return;
        }
    
        const lastStep = historyStack.pop(); // Get the last step
    
        // Remove the corresponding element from the UI
        if (lastStep.element && lastStep.element.parentNode) {
            lastStep.element.parentNode.removeChild(lastStep.element);
        }
    
        // Reset process based on the type of the last step
        if (lastStep.type === 'remainder') {
            const multipliedInputs = document.querySelectorAll('.step-input');
            if (multipliedInputs.length > 0) {
                multipliedInputs[multipliedInputs.length - 1].focus();
            }
        } else if (lastStep.type === 'bring-down') {
            const remainderInputs = document.querySelectorAll('.remainder-input');
            if (remainderInputs.length > 0) {
                remainderInputs[remainderInputs.length - 1].focus();
            }
        } else if (lastStep.type === 'multiplied') {
            const quotientInputs = document.querySelectorAll('.quotient-input');
            if (quotientInputs.length > 0) {
                quotientInputs[quotientInputs.length - 1].focus();
            }
        }
    }
    
function renderFinalMessage() {
    const finalMessage = document.createElement('div');
    finalMessage.classList.add('final-message');
    finalMessage.textContent = 'Sudah?';
    stepsContainer.appendChild(finalMessage);
}   
});
        });
    }

}
});


    // Ensure highlighting and clearing works for all input rows
function initializeInputHighlighting() {
    const allInputs = document.querySelectorAll('.input-cell');
    allInputs.forEach(input => {
        // Remove previous selection state on focus
        input.addEventListener('focus', () => input.classList.remove('selected'));

        // Add or remove selection on mouse click
        input.addEventListener('click', (event) => {
            if (event.ctrlKey || event.metaKey) {
                input.classList.toggle('selected'); // Toggle selection for multiple inputs
            } else {
                // Clear other selections if Ctrl/Meta is not held
                allInputs.forEach(i => i.classList.remove('selected'));
                input.classList.add('selected'); // Select only the clicked input
            }
        });
    });
}
// CSS for slashing effect and selection
const style = document.createElement('style');
style.textContent = `
    .slashed {
        text-decoration: line-through;
        color: red;
    }
    .selected {
        background-color: lightblue;
    }
`;
document.head.appendChild(style);




