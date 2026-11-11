// ==========================================
// 1. COURSE DATA MODULES
// ==========================================
const courseModules = [
    {
        id: "mod-1",
        title: "1. Introduction & Ecosystem Overview",
        icon: "fa-rocket",
        summary: "Understand the Pi Browser, Developer Portal, and architecture of Pi Apps.",
        content: `
            <p class="text-sm text-slate-600 mb-3">Pi Network applications run inside the <strong>Pi Browser</strong>. They are standard web apps (HTML/JS/CSS) that communicate with the Pi blockchain and user wallets using the <strong>Pi JavaScript SDK</strong>.</p>
            <h4 class="font-bold text-slate-800 text-sm mb-1">Key Requirements:</h4>
            <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 mb-4">
                <li>Pi Browser installed on mobile or desktop testnet environment.</li>
                <li>Account created on Developer Portal (develop.pi).</li>
                <li>An HTTPS enabled web domain (or localhost via tunnels like Ngrok for testing).</li>
            </ul>
            <div class="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800 rounded">
                <strong>Tip:</strong> You do not write smart contracts in Solidity for Pi Apps! Logic resides on your web server, and transactions are authorized via the Pi SDK.
            </div>
        `
    },
    {
        id: "mod-2",
        title: "2. Setting Up Developer Portal & App Engine",
        icon: "fa-sliders",
        summary: "Configure your App ID, API Key, and setup Sandbox/Testnet environment.",
        content: `
            <p class="text-sm text-slate-600 mb-3">To begin development, register your dApp on the Pi Developer Portal inside the Pi Browser.</p>
            <ol class="list-decimal list-inside text-xs text-slate-600 space-y-2 mb-4">
                <li>Open <strong>develop.pi</strong> in Pi Browser.</li>
                <li>Click <strong>New App</strong> and select target network (Testnet / Mainnet).</li>
                <li>Note down your <strong>App ID</strong> and generate an <strong>API Key</strong> (keep this secret on your backend server).</li>
                <li>Configure your Development URL (e.g., <code>https://my-pi-app.test</code>).</li>
            </ol>
        `
    },
    {
        id: "mod-3",
        title: "3. Integrating Pi JS SDK & User Authentication",
        icon: "fa-code",
        summary: "Learn how to include SDK script and authenticate Pioneers securely.",
        content: `
            <p class="text-sm text-slate-600 mb-3">Include the official Pi SDK script in your web page's <code>&lt;head&gt;</code> section:</p>
            
<pre><code><span class="code-comment">&lt;!-- Include Pi SDK in your HTML --&gt;</span>
&lt;script src="https://sdk.minepi.com/pi-sdk.js"&gt;&lt;/script&gt;

&lt;script&gt;
<span class="code-keyword">const</span> Pi = window.Pi;

<span class="code-comment">// 1. Initialize SDK</span>
Pi.init({ version: <span class="code-string">"2.0"</span>, sandbox: <span class="code-keyword">true</span> });

<span class="code-comment">// 2. Authenticate User</span>
<span class="code-keyword">async function</span> <span class="code-function">login</span>() {
<span class="code-keyword">try</span> {
<span class="code-keyword">const</span> scopes = [<span class="code-string">'username'</span>, <span class="code-string">'payments'</span>];
<span class="code-keyword">function</span> <span class="code-function">onIncompletePaymentFound</span>(payment) {
console.log(<span class="code-string">"Incomplete payment found:"</span>, payment);
};

<span class="code-keyword">const</span> auth = <span class="code-keyword">await</span> Pi.authenticate(scopes, onIncompletePaymentFound);
console.log(<span class="code-string">\`Authenticated user: \${auth.user.username}\`</span>);
} <span class="code-keyword">catch</span> (err) {
console.error(<span class="code-string">"Auth Error:"</span>, err);
}
}
&lt;/script&gt;</code></pre>
        `
    },
    {
        id: "mod-4",
        title: "4. Pi Payments API & Transaction Flow",
        icon: "fa-coins",
        summary: "Master App-to-User and User-to-App payment lifecycles and server callbacks.",
        content: `
            <p class="text-sm text-slate-600 mb-3">Pi Payments follow a 4-step callback handshake (Server-side verification required for production):</p>
            <ol class="list-decimal list-inside text-xs text-slate-600 space-y-1.5 mb-4">
                <li><strong>onReadyForServerApproval:</strong> Pass paymentId to your backend to approve item purchase.</li>
                <li><strong>onReadyForServerCompletion:</strong> Pass txid to backend to complete transaction on Pi Blockchain.</li>
                <li><strong>onCancel:</strong> Handle user cancellation.</li>
                <li><strong>onError:</strong> Handle payment pipeline errors.</li>
            </ol>
<pre><code><span class="code-keyword">const</span> paymentData = {
amount: <span class="code-string">1.5</span>,
memo: <span class="code-string">"Purchase Digital Item"</span>,
metadata: { itemId: <span class="code-string">"item_99"</span> }
};

<span class="code-keyword">const</span> callbacks = {
onReadyForServerApproval: (paymentId) => { <span class="code-comment">/* Server approves */</span> },
onReadyForServerCompletion: (paymentId, txid) => { <span class="code-comment">/* Complete tx */</span> },
onCancel: (paymentId) => { <span class="code-comment">/* User cancelled */</span> },
onError: (error, payment) => { <span class="code-comment">/* Payment error */</span> }
};

Pi.createPayment(paymentData, callbacks);</code></pre>
        `
    },
    {
        id: "mod-5",
        title: "5. Testing, Mainnet Migration & Guidelines",
        icon: "fa-circle-check",
        summary: "Deploy your app on Pi Testnet, pass security audits, and request Mainnet listing.",
        content: `
            <p class="text-sm text-slate-600 mb-3">Before launching on Mainnet, ensure your app fulfills the Pi Community Guidelines:</p>
            <ul class="list-disc list-inside text-xs text-slate-600 space-y-2 mb-3">
                <li><strong>Utility First:</strong> Application must provide genuine utility for Pi currency.</li>
                <li><strong>No Real Money Gambling:</strong> Apps offering games of chance with real monetary value are strictly moderated.</li>
                <li><strong>Mobile UX Optimization:</strong> Ensure rapid load times and touch-friendly interface inside Pi Browser context.</li>
            </ul>
        `
    }
];

// ==========================================
// 2. INDEXED DB CONTROLLER
// ==========================================
class CourseDB {
    constructor() {
        this.dbName = "PiDevCourseDB";
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("progress")) {
                    db.createObjectStore("progress", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("user_data")) {
                    db.createObjectStore("user_data", { keyPath: "key" });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getProgress() {
        return new Promise((resolve) => {
            const tx = this.db.transaction("progress", "readonly");
            const store = tx.objectStore("progress");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async saveModuleProgress(id, completed) {
        return new Promise((resolve) => {
            const tx = this.db.transaction("progress", "readwrite");
            const store = tx.objectStore("progress");
            store.put({ id, completed, timestamp: new Date().toISOString() });
            tx.oncomplete = () => resolve();
        });
    }

    async clearProgress() {
        return new Promise((resolve) => {
            const tx = this.db.transaction("progress", "readwrite");
            const store = tx.objectStore("progress");
            store.clear();
            tx.oncomplete = () => resolve();
        });
    }

    async getUserNotes() {
        return new Promise((resolve) => {
            const tx = this.db.transaction("user_data", "readonly");
            const store = tx.objectStore("user_data");
            const request = store.get("notes");
            request.onsuccess = () => resolve(request.result ? request.result.value : "");
        });
    }

    async saveUserNotes(notes) {
        return new Promise((resolve) => {
            const tx = this.db.transaction("user_data", "readwrite");
            const store = tx.objectStore("user_data");
            store.put({ key: "notes", value: notes });
            tx.oncomplete = () => resolve();
        });
    }
}

const courseDB = new CourseDB();

// ==========================================
// 3. APPLICATION INITIALIZATION & RENDER
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await courseDB.init();
        await renderModules();
        await loadUserNotes();
        setupEventListeners();
    } catch (err) {
        console.error("Initialization Failed", err);
    }
});

async function renderModules() {
    const container = document.getElementById("modules-container");
    const completedItems = await courseDB.getProgress();
    const completedMap = new Map(completedItems.map(item => [item.id, item.completed]));

    container.innerHTML = "";

    let completedCount = 0;

    courseModules.forEach((mod) => {
        const isCompleted = completedMap.get(mod.id) || false;
        if (isCompleted) completedCount++;

        const moduleEl = document.createElement("div");
        moduleEl.className = `bg-white rounded-xl border ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'} shadow-sm overflow-hidden transition-all duration-200`;

        moduleEl.innerHTML = `
            <div class="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors" onclick="toggleModuleAccordion('${mod.id}')">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-lg ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-pi-purple/10 text-pi-purple'} flex items-center justify-center font-bold text-sm">
                        <i class="fa-solid ${mod.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm md:text-base">${mod.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-1">${mod.summary}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="event.stopPropagation(); toggleModuleCompletion('${mod.id}', ${!isCompleted})" class="text-xs px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 ${isCompleted ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        <i class="fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'}"></i>
                        <span>${isCompleted ? 'Done' : 'Mark Done'}</span>
                    </button>
                    <i id="chevron-${mod.id}" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200"></i>
                </div>
            </div>
            <div id="content-${mod.id}" class="hidden border-t border-slate-100 p-4 bg-slate-50/50 text-slate-700">
                ${mod.content}
            </div>
        `;

        container.appendChild(moduleEl);
    });

    updateProgressUI(completedCount, courseModules.length);
}

function toggleModuleAccordion(id) {
    const content = document.getElementById(`content-${id}`);
    const chevron = document.getElementById(`chevron-${id}`);

    if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        chevron.classList.add("rotate-180");
    } else {
        content.classList.add("hidden");
        chevron.classList.remove("rotate-180");
    }
}

async function toggleModuleCompletion(id, newState) {
    await courseDB.saveModuleProgress(id, newState);
    await renderModules();
}

function updateProgressUI(completed, total) {
    const percent = Math.round((completed / total) * 100);
    document.getElementById("global-progress-text").innerText = `${percent}% Complete`;
    document.getElementById("progress-percent-label").innerText = `${percent}%`;
    document.getElementById("course-progress-bar").style.width = `${percent}%`;
}

// ==========================================
// 4. NOTES & PLAYGROUND SIMULATOR LOGIC
// ==========================================
async function loadUserNotes() {
    const notes = await courseDB.getUserNotes();
    const textarea = document.getElementById("user-notes");
    textarea.value = notes || "";
}

function setupEventListeners() {
    // Notes auto-save with debounce
    const textarea = document.getElementById("user-notes");
    const statusTag = document.getElementById("notes-status-tag");

    let timeout = null;
    textarea.addEventListener("input", () => {
        statusTag.innerText = "Typing...";
        statusTag.className = "text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium";
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await courseDB.saveUserNotes(textarea.value);
            statusTag.innerText = "Auto-saved";
            statusTag.className = "text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium";
        }, 1000);
    });

    document.getElementById("save-notes-btn").addEventListener("click", async () => {
        await courseDB.saveUserNotes(textarea.value);
        statusTag.innerText = "Saved!";
        statusTag.className = "text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium";
    });

    // Reset Progress
    document.getElementById("reset-progress-btn").addEventListener("click", async () => {
        if(confirm("Are you sure you want to reset all module progress?")) {
            await courseDB.clearProgress();
            await renderModules();
        }
    });

    // SDK Simulator
    document.getElementById("run-sim-btn").addEventListener("click", () => {
        const selected = document.getElementById("sdk-sim-select").value;
        const output = document.getElementById("sim-output");

        const now = new Date().toLocaleTimeString();

        if (selected === "init") {
            output.innerText = `[${now}] Executing Pi.init()...\nSuccess: Pi SDK v2.0 initialized in SANDBOX mode.`;
        } else if (selected === "authenticate") {
            output.innerText = `[${now}] Requesting Auth Scopes ['username', 'payments']...\n` +
                `User Approved.\nReturned User Payload:\n{\n  "accessToken": "eyJhbGciOi...",\n  "user": {\n    "uid": "pi_user_9921",\n    "username": "PioneerDeveloper"\n  }\n}`;
        } else if (selected === "payment") {
            output.innerText = `[${now}] Creating Mock Payment...\nPayment Created ID: "pay_7f920a11"\nStatus: Pending Server Approval.\nWaiting for onReadyForServerApproval callback...`;
        }
    });
}
