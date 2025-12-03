const DateTime = luxon.DateTime;

// --- TIMEZONE DATA ---
let allTimezones = [];

try {
    if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
        allTimezones = Intl.supportedValuesOf('timeZone');
    }
} catch (e) { console.warn("Intl API not supported."); }

if (allTimezones.length === 0) {
    // Fallback list
    allTimezones = [
        "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", 
        "America/Argentina/Buenos_Aires", "America/Bogota", "America/Caracas", 
        "America/Chicago", "America/Lima", "America/Los_Angeles", 
        "America/Mexico_City", "America/New_York", "America/Santiago", 
        "America/Sao_Paulo", "America/Toronto", "Asia/Bangkok", 
        "Asia/Dubai", "Asia/Hong_Kong", "Asia/Kolkata", "Asia/Seoul", 
        "Asia/Shanghai", "Asia/Singapore", "Asia/Tokyo", 
        "Australia/Sydney", "Europe/Amsterdam", "Europe/Berlin", 
        "Europe/Istanbul", "Europe/London", "Europe/Madrid", 
        "Europe/Moscow", "Europe/Paris", "Europe/Rome", "Pacific/Auckland", "UTC"
    ];
}

// --- STATE VARIABLES ---
let selectedSource = DateTime.local().zoneName;
let selectedTarget = "UTC";

// DOM Elements
const inputDate = document.getElementById('inputDate');

const sourceInput = document.getElementById('sourceInput');
const sourceList = document.getElementById('sourceList');
const sourceOffset = document.getElementById('sourceOffset');

const targetInput = document.getElementById('targetInput');
const targetList = document.getElementById('targetList');

const resultTime = document.getElementById('resultTime');
const resultDate = document.getElementById('resultDate');
const resultDiff = document.getElementById('resultDiff');

// Initialize Date
inputDate.value = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm");

// --- LOGIC FUNCTIONS ---

function updateUI() {
    sourceInput.value = selectedSource;
    targetInput.value = selectedTarget;
    calculate();
}

function calculate() {
    try {
        const dateVal = inputDate.value;
        if (!dateVal) return;

        // Create date in source zone
        const sourceDT = DateTime.fromISO(dateVal, { zone: selectedSource });
        
        // Convert to target zone
        const targetDT = sourceDT.setZone(selectedTarget);
        
        // Render
        resultTime.innerText = targetDT.toLocaleString(DateTime.TIME_SIMPLE);
        // Set Locale to English for date display
        resultDate.innerText = targetDT.setLocale('en').toLocaleString(DateTime.DATE_HUGE);
        
        // Difference
        const diff = (targetDT.offset - sourceDT.offset) / 60;
        const sign = diff >= 0 ? "+" : "";
        resultDiff.innerText = `${sign}${diff} Hours difference`;
        
        // Source Info
        sourceOffset.innerText = `Current Zone: GMT${sourceDT.toFormat('Z')}`;

    } catch (error) {
        console.error("Calculation Error", error);
    }
}

// --- DROPDOWN FUNCTIONS ---

function setupDropdown(input, listElement, isSource) {
    const renderList = (filter = "") => {
        listElement.innerHTML = "";
        const cleanFilter = filter.toLowerCase();
        
        const filtered = allTimezones.filter(tz => tz.toLowerCase().includes(cleanFilter));
        
        if (filtered.length === 0) {
            const li = document.createElement('li');
            li.className = "p-3 text-slate-400 italic text-center";
            li.innerText = "No timezones found";
            listElement.appendChild(li);
            return;
        }

        filtered.slice(0, 50).forEach(tz => {
            const li = document.createElement('li');
            li.className = "p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0 text-slate-700 transition-colors";
            li.innerText = tz;
            li.onclick = () => {
                if (isSource) {
                    selectedSource = tz;
                    
                    // --- AUTO-UPDATE LOGIC ---
                    // Set input to current time in the NEW source zone
                    const nowInZone = DateTime.now().setZone(selectedSource);
                    inputDate.value = nowInZone.toFormat("yyyy-MM-dd'T'HH:mm");
                    
                    // Visual feedback (flash)
                    inputDate.classList.remove('flash-update');
                    void inputDate.offsetWidth; 
                    inputDate.classList.add('flash-update');
                }
                else {
                    selectedTarget = tz;
                }
                
                input.value = tz;
                closeAllLists();
                calculate();
            };
            listElement.appendChild(li);
        });
    };

    input.addEventListener('focus', () => {
        closeAllLists();
        renderList(input.value);
        listElement.classList.remove('hidden');
    });

    input.addEventListener('input', () => {
        renderList(input.value);
        listElement.classList.remove('hidden');
    });
}

function closeAllLists() {
    sourceList.classList.add('hidden');
    targetList.classList.add('hidden');
}

setupDropdown(sourceInput, sourceList, true);
setupDropdown(targetInput, targetList, false);

document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.group')) {
        closeAllLists();
    }
});

// Listen to Input
inputDate.addEventListener('input', calculate);

document.getElementById('btnSwap').addEventListener('click', () => {
    const temp = selectedSource;
    selectedSource = selectedTarget;
    selectedTarget = temp;
    
    const icon = document.querySelector('#btnSwap i');
    icon.classList.toggle('rotate-180');
    
    // --- AUTO-UPDATE LOGIC FOR SWAP ---
    // Set input to current time in the NEW source zone
    const nowInZone = DateTime.now().setZone(selectedSource);
    inputDate.value = nowInZone.toFormat("yyyy-MM-dd'T'HH:mm");
    
    // Visual feedback (flash)
    inputDate.classList.remove('flash-update');
    void inputDate.offsetWidth; 
    inputDate.classList.add('flash-update');

    updateUI();
});

// --- My Location Button ---
document.getElementById('btnLocate').addEventListener('click', () => {
    // 1. Reset Zone
    selectedSource = DateTime.local().zoneName;
    
    // 2. Reset Time to NOW
    inputDate.value = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm");
    
    // Visual feedback
    inputDate.classList.remove('flash-update');
    void inputDate.offsetWidth; 
    inputDate.classList.add('flash-update');

    updateUI();
});

// --- Set to Now Button ---
document.getElementById('btnSetNow').addEventListener('click', () => {
    // Set input to current time in the SELECTED source zone
    const nowInZone = DateTime.now().setZone(selectedSource);
    inputDate.value = nowInZone.toFormat("yyyy-MM-dd'T'HH:mm");
    
    // Visual feedback
    inputDate.classList.remove('flash-update');
    void inputDate.offsetWidth; 
    inputDate.classList.add('flash-update');

    calculate();
});

updateUI();
