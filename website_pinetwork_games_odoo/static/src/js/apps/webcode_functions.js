const languageConfig = {
    javascript: {
        cmMode: 'javascript',
        defaultCode: `// Native execution in the browser using Web Workers\nconsole.log("Hello World from Isolated JavaScript!");\n\nconst add = (a, b) => a + b;\nconsole.log("Sum:", add(5, 7));`
    },
    python: {
        cmMode: 'python',
        defaultCode: `# Python running in the browser thanks to Pyodide (WASM)\n\nprint("Hello World from Python (WASM)!")\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(f"Fibonacci of 8 is: {fibonacci(8)}")`
    },
    c: {
        cmMode: 'text/x-csrc',
        defaultCode: `#include <stdio.h>\n\n/* Executed using the JSCPP interpreter in the browser */\nint main() {\n    printf("Hello World from C! (With accents: áéíóú)\\n");\n    int a = 10;\n    int b = 20;\n    printf("Sum: %d\\n", a + b);\n    return 0;\n}`
    },
    cpp: {
        cmMode: 'text/x-c++src',
        defaultCode: `#include <iostream>\nusing namespace std;\n\n/* Executed using the JSCPP interpreter in the browser */\nint main() {\n    cout << "Hello World from C++!" << endl;\n    for(int i = 0; i < 3; i++) {\n        cout << "Loop " << i << endl;\n    }\n    return 0;\n}`
    },
    php: {
        cmMode: 'application/x-httpd-php',
        defaultCode: `<?php\n// Executed 100% offline using the JS library 'Uniter'\n\necho "Hello World from OpenSource PHP!\\n";\n\n$a = 5;\n$b = 7;\necho "The sum of $a and $b is: " . ($a + $b) . "\\n";\n\nfor($i = 1; $i <= 3; $i++) {\n    echo "Iteration: $i\\n";\n}\n?>`
    },
    java: {
        cmMode: 'text/x-java',
        defaultCode: `// Offline execution via a Pseudo-Transpiler to JS\n// (Supports basic variables, loops, and System.out.println)\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World from Java (Offline)!");\n        \n        int a = 15;\n        int b = 30;\n        System.out.println("The sum is: " + (a + b));\n        \n        for(int i = 1; i <= 3; i++) {\n            System.out.println("For loop: " + i);\n        }\n    }\n}`
    }
};

const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: languageConfig.javascript.cmMode,
    theme: 'dracula',
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true
});

const langSelect = document.getElementById('language-select');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const outputTerminal = document.getElementById('output-terminal');
const runIcon = document.getElementById('run-icon');
const loadingIcon = document.getElementById('loading-icon');
const runText = document.getElementById('run-text');

editor.setValue(languageConfig.javascript.defaultCode);

// --- WEB WORKER ENGINE ---
const workerScript = `
    self.window = self;
    self.global = self; 
    self.module = { exports: {} };
    self.exports = self.module.exports;

    let pyodideInstance = null;
    let JSCPP_Engine = null;

    self.onmessage = async function(e) {
        const { lang, code } = e.data;
        let output = '';

        const originalLog = console.log;
        console.log = (...args) => {
            output += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n';
        };

        try {
            // --- JAVASCRIPT ---
            if (lang === 'javascript') {
                const execJS = new Function(code);
                execJS();
                self.postMessage({ type: 'success', output: output || 'Program finished.' });
            } 
            
            // --- PYTHON ---
            else if (lang === 'python') {
                if (!pyodideInstance) {
                    self.postMessage({ type: 'info', output: 'Downloading Pyodide engine (Python WASM)...' });
                    try {
                        importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
                        pyodideInstance = await loadPyodide({
                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
                        });
                    } catch(err) {
                        throw new Error("Failed to download Python WASM engine. Check your network.");
                    }
                }
                
                pyodideInstance.runPython(\`
import sys
import io
sys.stdout = io.StringIO()
                \`);
                
                pyodideInstance.runPython(code);
                const pyOutput = pyodideInstance.runPython("sys.stdout.getvalue()");
                self.postMessage({ type: 'success', output: pyOutput || 'Program finished with no output.' });
            }
            
            // --- C / C++ ---
            else if (lang === 'c' || lang === 'cpp') {
                let jscppLoaded = false;
                
                if (!JSCPP_Engine) {
                    self.postMessage({ type: 'info', output: 'Attempting to load C/C++ interpreter...' });
                    
                    const cdns = [
                        'https://cdn.jsdelivr.net/npm/JSCPP@2.0.6/dist/JSCPP.es5.min.js',
                        'https://unpkg.com/jscpp@2.0.6/lib/JSCPP.es5.js'
                    ];
                    
                    for(let i=0; i<cdns.length; i++) {
                        try { 
                            importScripts(cdns[i]); 
                            JSCPP_Engine = self.JSCPP || self.module.exports.JSCPP || self.module.exports || self.window.JSCPP;
                            if (JSCPP_Engine && typeof JSCPP_Engine.run === 'function') {
                                jscppLoaded = true; 
                                break; 
                            }
                        } catch(e) {}
                    }
                } else {
                    jscppLoaded = true;
                }
                
                let jscppSuccess = false;

                if (jscppLoaded) {
                    try {
                        // UTF-8 Preprocessor
                        let safeCode = code.replace(/[\\u0080-\\uFFFF]/g, function(match) {
                            let utf8 = unescape(encodeURIComponent(match));
                            let result = '';
                            for (let i = 0; i < utf8.length; i++) {
                                let hex = utf8.charCodeAt(i).toString(16).toUpperCase();
                                result += '\\\\x' + (hex.length === 1 ? '0' + hex : hex);
                            }
                            return result;
                        });

                        let cppOutput = '';
                        JSCPP_Engine.run(safeCode, '', {
                            stdio: { write: (s) => { cppOutput += s; } }
                        });

                        try {
                            cppOutput = decodeURIComponent(escape(cppOutput));
                        } catch(e) {}

                        self.postMessage({ type: 'success', output: cppOutput || 'Program finished with no output.' });
                        jscppSuccess = true;
                    } catch(err) {
                        self.postMessage({ type: 'info', output: '[Warning]: JSCPP failed (' + err.message + '). Using Local Transpiler fallback...\\n\\n' });
                    }
                } 
                
                if (!jscppSuccess) {
                    if (!jscppLoaded) {
                        self.postMessage({ type: 'info', output: '[Warning]: Network blocked. Using Local C/C++ Transpiler...\\n\\n' });
                    }
                    
                    let jsCode = code;
                    
                    jsCode = jsCode.replace(/#include\\s*<.*>/g, '');
                    jsCode = jsCode.replace(/using\\s+namespace\\s+[\\w:]+;/g, '');
                    jsCode = jsCode.replace(/int\\s+main\\s*\\([^)]*\\)\\s*\\{/g, 'function main() {');
                    
                    jsCode = jsCode.replace(/(?:std::)?cout\\s*<<([^;]+);/g, function(match, p1) {
                        let args = p1.replace(/endl/g, '""').replace(/\\\\n/g, '').split('<<').map(s => s.trim()).filter(s => s !== '""' && s !== '');
                        return 'console.log(' + args.join(' + ') + ');';
                    });
                    
                    jsCode = jsCode.replace(/printf\\s*\\(\\s*"([^"]*)"\\s*(?:,([^;]+))?\\);/g, function(match, stringFmt, vars) {
                        let cleanStr = stringFmt.replace(/%[a-z]/g, '').replace(/\\\\n/g, '').trim();
                        let outputLog = [];
                        if (cleanStr) outputLog.push('"' + cleanStr + '"');
                        if (vars) {
                            let varsList = vars.split(',').map(v => v.trim());
                            outputLog = outputLog.concat(varsList);
                        }
                        return 'console.log(' + outputLog.join(', ') + ');';
                    });
                    
                    jsCode = jsCode.replace(/\\b(int|float|double|char|bool|long|short|unsigned)\\b/g, 'let');
                    jsCode = jsCode.replace(/return\\s+0;/g, 'return;');
                    jsCode += '\\n\\nmain();';
                    
                    try {
                        const execCppAsJS = new Function(jsCode);
                        execCppAsJS();
                        self.postMessage({ type: 'success', output: output || 'Program finished.' });
                    } catch(cErr) {
                        throw new Error("C/C++ syntax error (or transpiler limitation): " + cErr.message);
                    }
                }
            }

            // --- PHP ---
            else if (lang === 'php') {
                if (!self.uniterInstance) {
                    self.postMessage({ type: 'info', output: 'Loading PHP interpreter...' });
                    try {
                        self.module = { exports: {} }; 
                        importScripts('https://cdn.jsdelivr.net/npm/uniter@2.11.1/dist/uniter.js');
                        self.uniterInstance = self.uniter || self.window.uniter || self.module.exports;
                    } catch(e) {
                        throw new Error("Failed to download PHP.");
                    }
                }

                if (!self.uniterInstance || typeof self.uniterInstance.createEngine !== 'function') {
                    throw new Error("Error: Uniter (PHP) did not export the engine correctly.");
                }

                let phpOutput = '';
                const engine = self.uniterInstance.createEngine('PHP');
                engine.getStdout().on('data', text => { phpOutput += text; });
                engine.getStderr().on('data', text => { phpOutput += '[Error] ' + text + '\\n'; });
                
                try {
                    engine.execute(code);
                    self.postMessage({ type: 'success', output: phpOutput || 'Program finished.' });
                } catch(phpErr) {
                    self.postMessage({ type: 'error', output: phpOutput + '\\nFatal Error: ' + phpErr.toString() });
                }
            }

            // --- JAVA ---
            else if (lang === 'java') {
                self.postMessage({ type: 'info', output: '[Note]: Executing Java via an offline local Transpiler...\\n' });
                
                let jsCode = code;
                jsCode = jsCode.replace(/import\\s+[\\w.]+;/g, '');
                jsCode = jsCode.replace(/public\\s+class\\s+\\w+\\s*\\{/g, '');
                jsCode = jsCode.replace(/public\\s+static\\s+void\\s+main\\s*\\([^)]*\\)\\s*\\{/g, 'function main() {');
                
                const lastBrace = jsCode.lastIndexOf('}');
                if (lastBrace !== -1) jsCode = jsCode.substring(0, lastBrace) + jsCode.substring(lastBrace + 1);
                
                jsCode = jsCode.replace(/System\\.out\\.println/g, 'console.log');
                jsCode = jsCode.replace(/System\\.out\\.print/g, 'console.log');
                jsCode = jsCode.replace(/\\b(int|double|float|boolean|String|char|long|short|byte)\\b/g, 'let');
                
                jsCode += '\\n\\nmain();';
                
                try {
                    const execJavaAsJS = new Function(jsCode);
                    execJavaAsJS();
                    self.postMessage({ type: 'success', output: output || 'Program finished.' });
                } catch(jErr) {
                    throw new Error("Java syntax or Transpilation error: " + jErr.message);
                }
            }
            
        } catch (error) {
            let errorMsg = error.toString();
            if(errorMsg.includes("PythonError")) errorMsg = "Python Error:\\n" + error.message;
            self.postMessage({ type: 'error', output: errorMsg });
        } finally {
            console.log = originalLog;
        }
    };
`;

const blob = new Blob([workerScript], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
let worker;
let executionTimeout;

function initWorker() {
    if (worker) worker.terminate();
    worker = new Worker(workerUrl);
    
    worker.onmessage = function(e) {
        const { type, output } = e.data;
        
        if (type === 'info') {
            printToTerminal(output + '\n', false, true);
        } else if (type === 'error') {
            printToTerminal(output, true);
            setLoading(false);
            clearTimeout(executionTimeout);
        } else {
            printToTerminal(output);
            setLoading(false);
            clearTimeout(executionTimeout);
        }
    };
}

function handleLanguageChange() {
    const selectedLang = langSelect.value;
    const config = languageConfig[selectedLang];
    editor.setOption('mode', config.cmMode);
    editor.setValue(config.defaultCode);
    printToTerminal('');
}

function executeCode() {
    const codeContent = editor.getValue();
    if (!codeContent.trim()) {
        printToTerminal("Error: The editor is empty.", true);
        return;
    }

    setLoading(true);
    printToTerminal("Starting execution...\n", false, true);

    if (!worker) initWorker();

    executionTimeout = setTimeout(() => {
        stopExecution();
        printToTerminal("\nError: Execution time exceeded (Timeout).", true);
    }, 15000);

    worker.postMessage({
        lang: langSelect.value,
        code: codeContent
    });
}

function stopExecution() {
    if (worker) {
        worker.terminate();
        worker = null;
        initWorker();
    }
    setLoading(false);
    clearTimeout(executionTimeout);
    printToTerminal("\n[!] Execution stopped.", true);
}

function printToTerminal(text, isError = false, isInfo = false) {
    if (!isInfo && text !== '') {
        outputTerminal.textContent = text;
    } else if (text === '') {
        outputTerminal.textContent = '';
    } else {
        outputTerminal.textContent += text;
    }
    
    outputTerminal.classList.remove('text-gray-300', 'text-green-400', 'text-red-400', 'text-yellow-400');
    
    if (isError) {
        outputTerminal.classList.add('text-red-400');
    } else if (isInfo) {
        outputTerminal.classList.add('text-yellow-400');
    } else {
        outputTerminal.classList.add('text-green-400');
    }
}

function setLoading(isLoading) {
    runBtn.disabled = isLoading;
    if (isLoading) {
        //runIcon.classList.add('hidden');
        //loadingIcon.classList.remove('hidden');
        runText.textContent = "Running...";
        runBtn.classList.replace('bg-green-600', 'bg-gray-600');
        stopBtn.classList.remove('hidden');
    } else {
        //runIcon.classList.remove('hidden');
        //loadingIcon.classList.add('hidden');
        runText.textContent = "Run";
        runBtn.classList.replace('bg-gray-600', 'bg-green-600');
        stopBtn.classList.add('hidden');
    }
}

langSelect.addEventListener('change', handleLanguageChange);
runBtn.addEventListener('click', executeCode);
stopBtn.addEventListener('click', stopExecution);
clearBtn.addEventListener('click', () => printToTerminal(''));

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
    }
});

initWorker();
window.addEventListener('resize', () => editor.refresh());
setTimeout(() => editor.refresh(), 100);
