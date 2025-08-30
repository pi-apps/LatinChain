document.addEventListener('DOMContentLoaded', function() {
    // Calculator elements
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const memoryIndicatorElement = document.getElementById('memory-indicator');
    const normalCalc = document.getElementById('normal-calc');
    const scientificCalc = document.getElementById('scientific-calc');
    const normalModeBtn = document.getElementById('normal-mode');
    const scientificModeBtn = document.getElementById('scientific-mode');
    
    // Memory buttons
    const mcButton = document.getElementById('mc-button');
    const mrButton = document.getElementById('mr-button');
    const msButton = document.getElementById('ms-button');
    const mplusButton = document.getElementById('mplus-button');
    const mminusButton = document.getElementById('mminus-button');
    
    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let memory = 0;
    let isScientificMode = false;
    let isRadiansMode = false;
    let waitingForSecondOperand = false;
    let rootIndex = null;
    let memoryStored = false;
    
    // Switch between modes
    normalModeBtn.addEventListener('click', () => {
        isScientificMode = false;
        normalModeBtn.classList.add('active');
        scientificModeBtn.classList.remove('active');
        scientificCalc.style.display = 'none';
    });
    
    scientificModeBtn.addEventListener('click', () => {
        isScientificMode = true;
        scientificModeBtn.classList.add('active');
        normalModeBtn.classList.remove('active');
        scientificCalc.style.display = 'grid';
    });
    
    // Update display
    function updateDisplay() {
        currentOperandElement.innerText = currentOperand;
        if (operation != null) {
            previousOperandElement.innerText = `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            previousOperandElement.innerText = previousOperand;
        }
        
        // Update memory indicator
        if (memoryStored) {
            memoryIndicatorElement.innerText = `Memory: ${memory}`;
            // Add active class to memory buttons
            [mcButton, mrButton, msButton, mplusButton, mminusButton].forEach(btn => {
                btn.classList.add('active');
            });
        } else {
            memoryIndicatorElement.innerText = '';
            // Remove active class from memory buttons
            [mcButton, mrButton, msButton, mplusButton, mminusButton].forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }
    
    // Get operation symbol for display
    function getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            'power': '^',
            'mod': 'mod',
            'nthroot': '√'
        };
        return symbols[operation] || '';
    }
    
    // Add number
    function appendNumber(number) {
        if (waitingForSecondOperand) {
            currentOperand = number;
            waitingForSecondOperand = false;
        } else {
            if (number === '.' && currentOperand.includes('.')) return;
            if (currentOperand === '0' && number !== '.') {
                currentOperand = number;
            } else {
                currentOperand += number;
            }
        }
    }
    
    // Choose operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        waitingForSecondOperand = true;
        
        // For any root, save the index
        if (op === 'nthroot') {
            rootIndex = parseFloat(currentOperand);
            previousOperand = `${rootIndex}√`;
        }
    }
    
    // Perform calculation
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            case 'mod':
                computation = prev % current;
                break;
            case 'nthroot':
                if (rootIndex === 0) {
                    computation = 'Error';
                } else if (current < 0 && rootIndex % 2 === 0) {
                    computation = 'Error';
                } else {
                    computation = Math.pow(current, 1/rootIndex);
                }
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        waitingForSecondOperand = false;
        rootIndex = null;
    }
    
    // Scientific functions
    function scientificFunction(func) {
        const current = parseFloat(currentOperand);
        
        switch (func) {
            case 'sin':
                if (isNaN(current)) return;
                currentOperand = isRadiansMode ? Math.sin(current) : Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                if (isNaN(current)) return;
                currentOperand = isRadiansMode ? Math.cos(current) : Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                if (isNaN(current)) return;
                currentOperand = isRadiansMode ? Math.tan(current) : Math.tan(current * Math.PI / 180);
                break;
            case 'sqrt':
                if (isNaN(current)) return;
                if (current < 0) {
                    currentOperand = 'Error';
                } else {
                    currentOperand = Math.sqrt(current);
                }
                break;
            case 'nthroot':
                chooseOperation('nthroot');
                break;
            case 'square':
                if (isNaN(current)) return;
                currentOperand = Math.pow(current, 2);
                break;
            case 'power':
                chooseOperation('power');
                break;
            case 'log':
                if (isNaN(current)) return;
                if (current <= 0) {
                    currentOperand = 'Error';
                } else {
                    currentOperand = Math.log10(current);
                }
                break;
            case 'ln':
                if (isNaN(current)) return;
                if (current <= 0) {
                    currentOperand = 'Error';
                } else {
                    currentOperand = Math.log(current);
                }
                break;
            case 'pi':
                currentOperand = Math.PI.toString();
                break;
            case 'e':
                currentOperand = Math.E.toString();
                break;
            case 'factorial':
                if (isNaN(current)) return;
                if (current < 0 || !Number.isInteger(current)) {
                    currentOperand = 'Error';
                } else {
                    let result = 1;
                    for (let i = 2; i <= current; i++) {
                        result *= i;
                    }
                    currentOperand = result.toString();
                }
                break;
            case 'exp':
                if (isNaN(current)) return;
                currentOperand = (current * Math.pow(10, current)).toString();
                break;
            case 'sinh':
                if (isNaN(current)) return;
                currentOperand = Math.sinh(current);
                break;
            case 'cosh':
                if (isNaN(current)) return;
                currentOperand = Math.cosh(current);
                break;
            case 'tanh':
                if (isNaN(current)) return;
                currentOperand = Math.tanh(current);
                break;
            case 'asin':
                if (isNaN(current)) return;
                if (current < -1 || current > 1) {
                    currentOperand = 'Error';
                } else {
                    currentOperand = isRadiansMode ? Math.asin(current) : Math.asin(current) * 180 / Math.PI;
                }
                break;
            case 'acos':
                if (isNaN(current)) return;
                if (current < -1 || current > 1) {
                    currentOperand = 'Error';
                } else {
                    currentOperand = isRadiansMode ? Math.acos(current) : Math.acos(current) * 180 / Math.PI;
                }
                break;
            case 'atan':
                if (isNaN(current)) return;
                currentOperand = isRadiansMode ? Math.atan(current) : Math.atan(current) * 180 / Math.PI;
                break;
            case 'rand':
                currentOperand = Math.random().toString();
                break;
            case 'deg':
                isRadiansMode = false;
                break;
            case 'rad':
                isRadiansMode = true;
                break;
            case 'percent':
                if (isNaN(current)) return;
                currentOperand = (current / 100).toString();
                break;
            case 'mod':
                chooseOperation('mod');
                break;
        }
        
        // Format result if too long
        if (typeof currentOperand === 'number') {
            currentOperand = currentOperand.toString();
            if (currentOperand.length > 10) {
                currentOperand = parseFloat(currentOperand).toExponential(5);
            }
        }
        
        // Update display only if not waiting for second operand
        if (func !== 'power' && func !== 'mod' && func !== 'nthroot') {
            updateDisplay();
        }
    }
    
    // Memory functions
    function memoryFunction(func) {
        const current = parseFloat(currentOperand);
        if (isNaN(current)) return;
        
        switch (func) {
            case 'mc': // Memory Clear
                memory = 0;
                memoryStored = false;
                break;
            case 'mr': // Memory Recall
                currentOperand = memory.toString();
                break;
            case 'ms': // Memory Store
                memory = current;
                memoryStored = true;
                break;
            case 'm+': // Memory Add
                memory += current;
                memoryStored = true;
                break;
            case 'm-': // Memory Subtract
                memory -= current;
                memoryStored = true;
                break;
        }
        
        updateDisplay();
    }
    
    // Clear display
    function clearDisplay() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        waitingForSecondOperand = false;
        rootIndex = null;
    }
    
    // Delete last digit
    function deleteDigit() {
        if (waitingForSecondOperand) return;
        
        currentOperand = currentOperand.slice(0, -1);
        if (currentOperand === '') {
            currentOperand = '0';
        }
    }
    
    // Event listeners for buttons
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });
    
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operation'));
            updateDisplay();
        });
    });
    
    document.querySelector('.equals').addEventListener('click', () => {
        calculate();
        updateDisplay();
    });
    
    document.querySelector('.clear').addEventListener('click', () => {
        clearDisplay();
        updateDisplay();
    });
    
    document.querySelector('.delete').addEventListener('click', () => {
        deleteDigit();
        updateDisplay();
    });
    
    document.querySelectorAll('.scientific').forEach(button => {
        button.addEventListener('click', () => {
            scientificFunction(button.getAttribute('data-operation'));
        });
    });
    
    // Memory buttons event listeners
    document.querySelectorAll('.memory').forEach(button => {
        button.addEventListener('click', () => {
            memoryFunction(button.getAttribute('data-memory'));
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(event) {
        if (/[0-9]/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            chooseOperation(event.key);
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            calculate();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            deleteDigit();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clearDisplay();
            updateDisplay();
        } else if (event.key === 'p' && event.ctrlKey) {
            // Ctrl+P for power operation
            event.preventDefault();
            scientificFunction('power');
        }
    });
    
    // Initialize display
    updateDisplay();
});
