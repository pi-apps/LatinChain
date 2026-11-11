// --- IndexedDB Database Manager ---
const DB_NAME = 'QiskitCourseDB';
const DB_VERSION = 1;
const STORE_PROGRESS = 'progress';

class CourseDB {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = (e) => reject('Failed to open IndexedDB');
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
                    db.createObjectStore(STORE_PROGRESS, { keyPath: 'lessonId' });
                }
            };
        });
    }

    async markLessonCompleted(lessonId, isCompleted = true) {
        return new Promise((resolve, reject) => {
            if (!this.db) return resolve();
            const tx = this.db.transaction(STORE_PROGRESS, 'readwrite');
            const store = tx.objectStore(STORE_PROGRESS);
            store.put({ lessonId, completed: isCompleted, timestamp: new Date().toISOString() });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject();
        });
    }

    async getProgress() {
        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            const tx = this.db.transaction(STORE_PROGRESS, 'readonly');
            const store = tx.objectStore(STORE_PROGRESS);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => resolve([]);
        });
    }

    async clearProgress() {
        return new Promise((resolve) => {
            if (!this.db) return resolve();
            const tx = this.db.transaction(STORE_PROGRESS, 'readwrite');
            const store = tx.objectStore(STORE_PROGRESS);
            store.clear();
            tx.oncomplete = () => resolve();
        });
    }
}

// --- Course Curriculum Data Definition ---
const courseData = [
    {
        id: 'mod1-intro',
        module: 'Module 1: Foundations',
        title: 'Introduction to Quantum Computing & Qiskit',
        duration: '8 min',
        subtitle: 'Learn the core principles of qubits, superposition, and setting up IBM\'s Qiskit SDK.',
        content: `
            <p class="text-slate-300">Welcome to the complete practical developer course for <strong>IBM Qiskit</strong>. Unlike classical computers that encode information in binary bits (0 or 1), quantum computers leverage quantum mechanical phenomena using <strong>Qubits</strong>.</p>
            
            <h3 class="text-lg font-semibold text-white mt-4">Key Concepts:</h3>
            <ul class="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong>Qubit State:</strong> Expressed as |Ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes.</li>
                <li><strong>Superposition:</strong> A qubit can exist in a continuum of states between |0⟩ and |1⟩ until measured.</li>
                <li><strong>Qiskit SDK:</strong> IBM's open-source Python framework for working with quantum computers at the level of circuits, algorithms, and applications.</li>
            </ul>

            <div class="my-4 p-4 rounded-lg bg-qiskit-900/30 border border-qiskit-700/40 text-slate-300">
                <div class="font-semibold text-qiskit-500 flex items-center gap-2">
                    <i data-lucide="info" class="w-4 h-4"></i> Did You Know?
                </div>
                <p class="text-xs mt-1">When you execute a Qiskit program, you can run it locally on the <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">AerSimulator</code> or dispatch real quantum jobs to IBM Quantum hardware through IBM Quantum Platform primitives!</p>
            </div>
        `,
        initialCode: `# Module 1: First Qiskit Setup
from qiskit import QuantumCircuit, Aer, execute

# Create a Quantum Circuit with 1 Qubit & 1 Classical bit
qc = QuantumCircuit(1, 1)

# Inspect circuit status
print("Initialized quantum circuit with 1 qubit!")
print(f"Number of qubits: {qc.num_qubits}")
`,
        expectedOutput: "Initialized quantum circuit with 1 qubit!"
    },
    {
        id: 'mod2-gates',
        module: 'Module 2: Quantum Gates',
        title: 'Building Superposition with Hadamard Gates',
        duration: '12 min',
        subtitle: 'Master single-qubit quantum gates: Pauli-X (NOT), Pauli-Z, and the Hadamard (H) gate.',
        content: `
            <p>To manipulate qubits, we apply <strong>Quantum Gates</strong>. Quantum operations are unitary matrices applied to the state vector.</p>

            <h3 class="text-lg font-semibold text-white mt-4">Essential Single-Qubit Gates:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div class="font-mono text-indigo-400 font-bold">X Gate (Bit-Flip)</div>
                    <div class="text-xs text-slate-400 mt-1">Flips |0⟩ to |1⟩ and |1⟩ to |0⟩. Quantum equivalent of classical NOT.</div>
                </div>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div class="font-mono text-qiskit-500 font-bold">H Gate (Hadamard)</div>
                    <div class="text-xs text-slate-400 mt-1">Puts a qubit into an equal superposition: (|0⟩ + |1⟩) / √2.</div>
                </div>
            </div>

            <p>In the interactive editor on the right, apply an <strong>H Gate</strong> to Qubit 0 and observe the 50/50 probability distribution in measurement counts!</p>
        `,
        initialCode: `# Module 2: Creating Superposition
from qiskit import QuantumCircuit

# Initialize circuit with 1 qubit and 1 classical bit
qc = QuantumCircuit(1, 1)

# Apply Hadamard (H) gate to qubit 0
qc.h(0)

# Measure qubit 0 into classical bit 0
qc.measure(0, 0)
`,
        expectedOutput: "Hadamard gate applied"
    },
    {
        id: 'mod3-entanglement',
        module: 'Module 3: Entanglement',
        title: 'Creating Bell States (Quantum Entanglement)',
        duration: '15 min',
        subtitle: 'Combine Hadamard and Controlled-NOT (CNOT) gates to construct maximally entangled qubit pairs.',
        content: `
            <p><strong>Quantum Entanglement</strong> is a phenomenon where two or more qubits become interconnected such that the state of one instantly dictates the state of another, regardless of distance.</p>

            <h3 class="text-lg font-semibold text-white mt-4">The |Φ⁺⟩ Bell State Recipe:</h3>
            <ol class="list-decimal pl-5 space-y-2 text-slate-300">
                <li>Initialize 2 qubits in state |00⟩.</li>
                <li>Apply Hadamard gate <code class="font-mono text-qiskit-500">H</code> to Qubit 0 (creates superposition).</li>
                <li>Apply CNOT gate <code class="font-mono text-indigo-400">cx(0, 1)</code> using Qubit 0 as control and Qubit 1 as target.</li>
                <li>Measure both qubits. You will observe outcomes <code class="font-mono text-emerald-400 font-bold">00</code> or <code class="font-mono text-emerald-400 font-bold">11</code> with equal probability, but NEVER 01 or 10!</li>
            </ol>
        `,
        initialCode: `# Module 3: Bell State Entanglement
from qiskit import QuantumCircuit

# 2 Qubits, 2 Classical Bits
qc = QuantumCircuit(2, 2)

# Put qubit 0 in superposition
qc.h(0)

# Entangle qubit 0 and qubit 1 using CNOT
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])
`,
        expectedOutput: "Entangled state created"
    },
    {
        id: 'mod4-algorithms',
        module: 'Module 4: Quantum Algorithms',
        title: 'Grover\'s Search Algorithm in Qiskit',
        duration: '20 min',
        subtitle: 'Explore how quantum computing provides quadratic speedups for searching unstructured datasets.',
        content: `
            <p>Classical computers search an unsorted list of N items in O(N) time. <strong>Grover\'s Algorithm</strong> performs this search on a quantum device in only <strong>O(√N)</strong> steps using amplitude amplification!</p>

            <h3 class="text-lg font-semibold text-white mt-4">Grover Circuit Steps:</h3>
            <ul class="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>State Preparation:</strong> Put all qubits in uniform superposition.</li>
                <li><strong>Oracle Phase:</strong> Flip the phase of the target marked state.</li>
                <li><strong>Diffuser (Amplifier):</strong> Invert states around the average amplitude, boosting the target probability.</li>
            </ul>
        `,
        initialCode: `# Module 4: Grover's Search Oracle Simulation
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Step 1: Equal Superposition
qc.h(0)
qc.h(1)

# Step 2: Oracle (Marking state |11>)
qc.cz(0, 1)

# Step 3: Grover Diffuser
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])

# Measure
qc.measure([0, 1], [0, 1])
`,
        expectedOutput: "Grover algorithm execution"
    },
    {
        id: 'mod5-full-app',
        module: 'Module 5: Real World Apps',
        title: 'Building & Deploying Quantum Applications',
        duration: '15 min',
        subtitle: 'Integrating Qiskit Runtime Primitives (Sampler & Estimator) with REST APIs and Frontend Apps.',
        content: `
            <p>To build enterprise-grade Quantum Applications, you connect web frontends to IBM Quantum cloud platforms via <strong>Qiskit Runtime</strong> primitives.</p>

            <h3 class="text-lg font-semibold text-white mt-4">Qiskit Runtime Primitives:</h3>
            <div class="space-y-3 my-3">
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span class="text-xs font-bold text-qiskit-500 font-mono">Sampler Primitive</span>
                    <p class="text-xs text-slate-400 mt-0.5">Calculates quasi-probability distributions of bitstrings from quantum circuit outputs (ideal for optimization & algorithms like Grover/QAOA).</p>
                </div>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span class="text-xs font-bold text-indigo-400 font-mono">Estimator Primitive</span>
                    <p class="text-xs text-slate-400 mt-0.5">Calculates expectation values of quantum operators/observables (ideal for Variational Quantum Eigensolvers - VQE in chemistry).</p>
                </div>
            </div>

            <p>Congratulations! You are ready to build full-stack Quantum Apps using Python, Qiskit Runtime, and Web APIs!</p>
        `,
        initialCode: `# Module 5: Qiskit Runtime Sampler Workflow
from qiskit import QuantumCircuit
# Simulation of Runtime Sampler Workflow
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

print("Qiskit Runtime Service session initialized successfully.")
print("Job submitted to IBM Quantum QPU backend: ibm_kyiv")
`,
        expectedOutput: "Qiskit Runtime Service session"
    }
];

// --- Application State ---
let currentLessonIndex = 0;
let dbManager = new CourseDB();
let completedLessonsMap = {};

// --- DOM Elements ---
const moduleListContainer = document.getElementById('module-list');
const lessonTitleEl = document.getElementById('lesson-title');
const lessonSubtitleEl = document.getElementById('lesson-subtitle');
const lessonBodyEl = document.getElementById('lesson-body');
const lessonModuleTag = document.getElementById('lesson-module-tag');
const lessonReadTime = document.getElementById('lesson-read-time');
const codeEditorEl = document.getElementById('code-editor');
const runCodeBtn = document.getElementById('run-code-btn');
const consoleOutput = document.getElementById('console-output');
const circuitDiagram = document.getElementById('circuit-diagram');
const measurementCounts = document.getElementById('measurement-counts');
const execStatus = document.getElementById('exec-status');
const markCompleteBtn = document.getElementById('mark-complete-btn');
const prevLessonBtn = document.getElementById('prev-lesson-btn');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const resetProgressBtn = document.getElementById('reset-progress-btn');
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const closeSidebarBtn = document.getElementById('close-sidebar');

// --- Sidebar (mobile drawer) helpers ---
function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
}

function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
}

// --- Initialize App ---
async function initApp() {
    try {
        await dbManager.init();
        await loadSavedProgress();
    } catch (e) {
        console.warn('IndexedDB unavailable or failed, fallback to memory', e);
    }

    renderSidebarModules();
    loadLesson(0);
    setupEventListeners();
    lucide.createIcons();
}

// --- Load Progress from IndexedDB ---
async function loadSavedProgress() {
    const progressList = await dbManager.getProgress();
    completedLessonsMap = {};
    progressList.forEach(item => {
        if (item.completed) {
            completedLessonsMap[item.lessonId] = true;
        }
    });
    updateOverallProgressUI();
}

// --- Render Sidebar Menu ---
function renderSidebarModules() {
    moduleListContainer.innerHTML = '';
    courseData.forEach((lesson, index) => {
        const isCompleted = !!completedLessonsMap[lesson.id];
        const isActive = index === currentLessonIndex;

        const itemBtn = document.createElement('button');
        itemBtn.className = `w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between gap-2 group ${
            isActive 
                ? 'bg-qiskit-600/20 text-white border border-qiskit-500/40 font-medium' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
        }`;

        itemBtn.onclick = () => {
            loadLesson(index);
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        };

        itemBtn.innerHTML = `
            <div class="flex items-center space-x-2.5 overflow-hidden min-w-0">
                <div class="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : isActive ? 'bg-qiskit-500 text-white' : 'bg-slate-800 text-slate-500'
                }">
                    ${isCompleted ? '✓' : index + 1}
                </div>
                <div class="truncate min-w-0">
                    <div class="truncate font-semibold ${isActive ? 'text-white' : 'text-slate-300'}">${lesson.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${lesson.module}</div>
                </div>
            </div>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"></i>
        `;

        moduleListContainer.appendChild(itemBtn);
    });
    lucide.createIcons();
}

// --- Load Specific Lesson ---
function loadLesson(index) {
    currentLessonIndex = index;
    const lesson = courseData[index];

    lessonModuleTag.textContent = lesson.module;
    lessonReadTime.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5"></i> ${lesson.duration}`;
    lessonTitleEl.textContent = lesson.title;
    lessonSubtitleEl.textContent = lesson.subtitle;
    lessonBodyEl.innerHTML = lesson.content;
    codeEditorEl.value = lesson.initialCode;

    // Reset execution screens
    consoleOutput.textContent = 'Ready to execute quantum circuit.';
    circuitDiagram.innerHTML = '<span class="text-slate-600 italic">Click "Run Circuit" to render output...</span>';
    measurementCounts.innerHTML = '<span class="text-slate-600 italic">No execution data yet.</span>';
    execStatus.textContent = 'Ready';
    execStatus.className = 'shrink-0 text-[10px] font-mono text-slate-500';

    // Button state updates
    prevLessonBtn.disabled = index === 0;
    const isCompleted = !!completedLessonsMap[lesson.id];
    
    if (isCompleted) {
        markCompleteBtn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Completed (Next)`;
        markCompleteBtn.className = "px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-sm";
    } else {
        markCompleteBtn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Complete & Next`;
        markCompleteBtn.className = "px-5 py-2.5 rounded-lg bg-qiskit-600 hover:bg-qiskit-500 text-white font-semibold transition-all shadow-lg shadow-qiskit-600/25 flex items-center gap-2 text-sm";
    }

    renderSidebarModules();
    lucide.createIcons();
}

// --- Simulate Qiskit Execution Engine ---
function executeQiskitCode() {
    const code = codeEditorEl.value;
    execStatus.textContent = 'Simulating Qiskit Aer...';
    execStatus.className = 'shrink-0 text-[10px] font-mono text-amber-400 animate-pulse';

    setTimeout(() => {
        execStatus.textContent = 'Executed (0.04s)';
        execStatus.className = 'shrink-0 text-[10px] font-mono text-emerald-400';

        let outputText = ">>> Running Qiskit AerSimulator local execution...\n";
        let circuitHtml = '';
        let countsHtml = '';

        const currentLesson = courseData[currentLessonIndex];

        if (currentLesson.id === 'mod1-intro') {
            outputText += "Job Status: JOB_DONE\nResult Statevector: [1.+0.j, 0.+0.j]\nQubit count: 1";
            circuitHtml = `
                <div class="font-mono text-xs text-indigo-300">
                    q_0: ───<br>
                    c_0: ═══
                </div>
            `;
            countsHtml = `<div class="flex items-center gap-2"><span class="w-12 font-mono text-slate-400">|0⟩</span><div class="h-4 bg-qiskit-500 rounded w-full"></div><span class="font-mono text-xs text-white">100%</span></div>`;
        } 
        else if (currentLesson.id === 'mod2-gates') {
            outputText += "Job Status: JOB_DONE\nShots: 1024\nCounts: {'0': 518, '1': 506}";
            circuitHtml = `
                <div class="font-mono text-xs text-indigo-300">
                    q_0: ──[ H ]──[ M ]──<br>
                    c_0: ═══════════╩════
                </div>
            `;
            countsHtml = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2"><span class="w-8 font-mono text-slate-400">|0⟩</span><div class="h-3.5 bg-qiskit-500 rounded w-[51%]"></div><span class="font-mono text-[11px] text-slate-300">50.6%</span></div>
                    <div class="flex items-center gap-2"><span class="w-8 font-mono text-slate-400">|1⟩</span><div class="h-3.5 bg-indigo-500 rounded w-[49%]"></div><span class="font-mono text-[11px] text-slate-300">49.4%</span></div>
                </div>
            `;
        } 
        else if (currentLesson.id === 'mod3-entanglement') {
            outputText += "Job Status: JOB_DONE\nBell State: (|00⟩ + |11⟩)/√2\nShots: 1024\nCounts: {'00': 512, '11': 512}";
            circuitHtml = `
                <div class="font-mono text-xs text-indigo-300">
                    q_0: ──[ H ]──■──[ M ]─────<br>
                    q_1: ─────────┼───[ M ]──■──<br>
                    c:   ═════════╩═════╩══════
                </div>
            `;
            countsHtml = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2"><span class="w-8 font-mono text-slate-400">|00⟩</span><div class="h-3.5 bg-qiskit-500 rounded w-[50%]"></div><span class="font-mono text-[11px] text-slate-300">50.0%</span></div>
                    <div class="flex items-center gap-2"><span class="w-8 font-mono text-slate-400">|11⟩</span><div class="h-3.5 bg-emerald-500 rounded w-[50%]"></div><span class="font-mono text-[11px] text-slate-300">50.0%</span></div>
                </div>
            `;
        } 
        else if (currentLesson.id === 'mod4-algorithms') {
            outputText += "Job Status: JOB_DONE\nGrover target state |11⟩ amplified!\nCounts: {'11': 1024}";
            circuitHtml = `
                <div class="font-mono text-xs text-indigo-300">
                    q_0: ──[H]──■──[H]──[X]──■──[X]──[H]──[M]──<br>
                    q_1: ──[H]──■──[H]──[X]──■──[X]──[H]──[M]──
                </div>
            `;
            countsHtml = `
                <div class="flex items-center gap-2"><span class="w-8 font-mono text-slate-400">|11⟩</span><div class="h-4 bg-emerald-500 rounded w-full"></div><span class="font-mono text-xs text-white">100%</span></div>
            `;
        } 
        else {
            outputText += "Job Status: JOB_DONE\nPrimitive: Sampler v2\nOutput Quasi-Distributions: {0: 0.5, 3: 0.5}\nSuccessfully verified quantum runtime workflow!";
            circuitHtml = `
                <div class="font-mono text-xs text-indigo-300">
                    [Qiskit Runtime Session] => Primitive Sampler V2
                </div>
            `;
            countsHtml = `<div class="text-xs text-emerald-400 font-mono">Job status: COMPLETED on backend 'ibm_kyiv'.</div>`;
        }

        consoleOutput.textContent = outputText;
        circuitDiagram.innerHTML = circuitHtml;
        measurementCounts.innerHTML = countsHtml;

        showToast("Circuit executed successfully!", "success");
    }, 300);
}

// --- Update Overall Progress UI ---
function updateOverallProgressUI() {
    const total = courseData.length;
    const completedCount = Object.keys(completedLessonsMap).length;
    const percent = Math.round((completedCount / total) * 100);

    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

// --- Event Handlers & Binding ---
function setupEventListeners() {
    runCodeBtn.onclick = executeQiskitCode;

    markCompleteBtn.onclick = async () => {
        const currentLesson = courseData[currentLessonIndex];
        completedLessonsMap[currentLesson.id] = true;
        await dbManager.markLessonCompleted(currentLesson.id, true);
        updateOverallProgressUI();
        renderSidebarModules();

        showToast(`Completed ${currentLesson.title}`, "success");

        if (currentLessonIndex < courseData.length - 1) {
            loadLesson(currentLessonIndex + 1);
        }
    };

    prevLessonBtn.onclick = () => {
        if (currentLessonIndex > 0) {
            loadLesson(currentLessonIndex - 1);
        }
    };

    resetProgressBtn.onclick = async () => {
        if (confirm('Are you sure you want to reset all lesson progress saved in IndexedDB?')) {
            await dbManager.clearProgress();
            completedLessonsMap = {};
            updateOverallProgressUI();
            loadLesson(0);
            showToast("Progress reset successfully", "info");
        }
    };

    mobileMenuToggle.onclick = () => openSidebar();
    closeSidebarBtn.onclick = () => closeSidebar();
    sidebarBackdrop.onclick = () => closeSidebar();

    // Escape key closes the mobile drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.innerWidth < 768) {
            closeSidebar();
        }
    });

    // If the viewport grows to desktop, make sure the backdrop is gone
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebarBackdrop.classList.add('hidden');
        }
    });
}

// --- Notification Toast Utility ---
function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-2 max-w-full px-4 py-3 rounded-lg shadow-xl text-xs font-medium border text-white transition-all transform translate-y-2 opacity-0 duration-200 ${
        type === 'success' ? 'bg-emerald-900/90 border-emerald-600' : 'bg-slate-800 border-slate-700'
    }`;
    
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
        <span class="break-words">${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Start App on DOM Ready
window.addEventListener('DOMContentLoaded', initApp);
