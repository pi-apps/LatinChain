// --- INTERNATIONALIZATION CONFIG ---
const isSpanish = location.pathname.substring(0, 3) === '/es';
const lang = isSpanish ? 'es' : 'en';

const i18n = {
    en: {
        title: "Certified IQ Test",
        desc: "This test consists of <span class='font-bold text-blue-600'>35 questions</span> randomly selected from a bank of 500 items.",
        l1: "Evaluates logic, numerical patterns, and verbal reasoning.",
        l2: "<strong>Time impacts your score.</strong> Try to be quick but accurate.",
        l3: "You will receive a certificate with your estimated score upon completion.",
        nameLabel: "Enter your name for the certificate:",
        placeholder: "Your Full Name",
        startBtn: "Start Test",
        lastBtn: "View Last Certificate",
        highBtn: "View Higer Scored Certificate",
        qLabel: "Question",
        qOf: "of",
        next: "Next",
        certTitle: "CERTIFICATE",
        certSub: "OF INTELLECTUAL COMPETENCE",
        certBody: "This document certifies that",
        scoreLabel: "IQ Score",
        dateLabel: "Date",
        roleLabel: "Chief Evaluator",
        warn: "⚠ IMPORTANT: Please take a screenshot.",
        shotText: "Take Screenshot Now",
        restart: "Restart Test",
        categories: { "Logic": "Logic", "Verbal": "Verbal", "Spatial": "Spatial", "Math": "Math", "Patterns": "Patterns" },
        levels: {
            "Genius / Very Superior": "Genius / Very Superior",
            "Superior": "Superior",
            "High Average": "High Average",
            "Average": "Average",
            "Low Average": "Low Average",
            "Below Average": "Below Average"
        }
    },
    es: {
        title: "Test de IQ Certificado",
        desc: "Esta prueba consta de <span class='font-bold text-blue-600'>35 preguntas</span> seleccionadas aleatoriamente de un banco de 500 ítems.",
        l1: "Evalúa lógica, patrones numéricos y razonamiento verbal.",
        l2: "<strong>El tiempo afecta tu puntaje.</strong> Intenta ser rápido pero preciso.",
        l3: "Al finalizar, recibirás un certificado con tu puntuación estimada.",
        nameLabel: "Ingresa tu nombre para el certificado:",
        placeholder: "Tu Nombre Completo",
        startBtn: "Comenzar Prueba",
        lastBtn: "Ver Último Certificado",
        highBtn: "Ver Certificado con nota más alta",
        qLabel: "Pregunta",
        qOf: "de",
        next: "Siguiente",
        certTitle: "CERTIFICADO",
        certSub: "DE COMPETENCIA INTELECTUAL",
        certBody: "Este documento certifica que",
        scoreLabel: "Coeficiente (IQ)",
        dateLabel: "Fecha",
        roleLabel: "Director de Evaluación",
        warn: "⚠ IMPORTANTE: Toma una captura de pantalla.",
        shotText: "Tomar Captura Ahora",
        restart: "Reiniciar Prueba",
        categories: { "Logic": "Lógica", "Verbal": "Verbal", "Spatial": "Espacial", "Math": "Matemática", "Patterns": "Patrones" },
        levels: {
            "Genius / Very Superior": "Genio / Muy Superior",
            "Superior": "Superior",
            "High Average": "Promedio Alto",
            "Average": "Promedio",
            "Low Average": "Promedio Bajo",
            "Below Average": "Bajo Promedio"
        }
    }
};

// Use a more specific variable name to avoid global scope collisions
const translations = i18n[lang];

// --- APPLY TRANSLATIONS ON LOAD ---
function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = translations.title;
    
    // Start Screen
    document.getElementById('ui-title').innerText = translations.title;
    document.getElementById('ui-desc').innerHTML = translations.desc;
    document.getElementById('ui-li1').innerText = translations.l1;
    document.getElementById('ui-li2').innerHTML = translations.l2;
    document.getElementById('ui-li3').innerText = translations.l3;
    document.getElementById('ui-label-name').innerText = translations.nameLabel;
    document.getElementById('username').placeholder = translations.placeholder;
    document.getElementById('ui-btn-start').innerText = translations.startBtn;
    document.getElementById('last-result-btn').innerText = translations.lastBtn;
    document.getElementById('high-result-btn').innerText = translations.highBtn;

    // Quiz Screen
    document.getElementById('ui-q-label').innerText = translations.qLabel;
    document.getElementById('ui-q-of').innerText = translations.qOf;
    document.getElementById('next-btn').innerText = translations.next;

    // Result Screen
    document.getElementById('cert-title-main').innerText = translations.certTitle;
    document.getElementById('cert-subtitle').innerText = translations.certSub;
    document.getElementById('cert-body-text').innerText = translations.certBody;
    document.getElementById('cert-score-label').innerText = translations.scoreLabel;
    document.getElementById('cert-date-label').innerText = translations.dateLabel;
    document.getElementById('cert-role-label').innerText = translations.roleLabel;
    document.getElementById('ui-warn').innerText = translations.warn;
    document.getElementById('ui-btn-shot-text').innerText = translations.shotText;
    document.getElementById('ui-btn-restart').innerText = translations.restart;
}

// --- QUESTION DATABASE (Bilingual) ---

const manualQuestionsEn = [
    { t: "Logic", q: "What number comes next? 2, 5, 10, 17, ...", opts: ["24", "26", "25", "27"], a: 1 },
    { t: "Verbal", q: "Light is to Darkness as Heat is to...", opts: ["Fire", "Cold", "Ice", "Winter"], a: 1 },
    { t: "Logic", q: "If some Blips are Blops and all Blops are Blups, then...", opts: ["All Blips are Blups", "Some Blips are Blups", "No Blip is a Blup", "All Blups are Blips"], a: 1 },
    { t: "Spatial", q: "Which object does not belong in the group?", opts: ["Cube", "Sphere", "Pyramid", "Square"], a: 3 },
    { t: "Math", q: "If 20% of X is 40, what is X?", opts: ["100", "200", "400", "80"], a: 1 },
    { t: "Logic", q: "Peter is taller than John. John is taller than Louis. Who is the shortest?", opts: ["Peter", "John", "Louis", "Impossible to know"], a: 2 },
    { t: "Verbal", q: "Synonym of 'Ephemeral'", opts: ["Eternal", "Fleeting", "Hard", "Ancient"], a: 1 },
    { t: "Patterns", q: "1, 1, 2, 3, 5, 8, ...", opts: ["11", "12", "13", "15"], a: 2 },
    { t: "Verbal", q: "Fish is to Swim as Bird is to...", opts: ["Sky", "Feather", "Fly", "Nest"], a: 2 },
    { t: "Logic", q: "Which letter continues? A, C, E, G, ...", opts: ["H", "I", "J", "K"], a: 1 },
    { t: "Math", q: "What is half of 2 + 2?", opts: ["3", "2", "1", "4"], a: 0 },
    { t: "Logic", q: "If YESTERDAY was Thursday, what day is TOMORROW?", opts: ["Saturday", "Sunday", "Monday", "Friday"], a: 0 },
    { t: "Spatial", q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], a: 1 },
    { t: "Verbal", q: "Find the odd one out:", opts: ["Apple", "Pear", "Banana", "Carrot"], a: 3 },
    { t: "Logic", q: "If you turn left three times, where are you facing relative to the start?", opts: ["Left", "Right", "Back", "Same"], a: 1 },
    { t: "Math", q: "100 divided by half", opts: ["50", "200", "25", "10"], a: 1 },
    { t: "Verbal", q: "Guitar is to String as Trumpet is to...", opts: ["Metal", "Wind", "Sound", "Music"], a: 1 },
    { t: "Logic", q: "Mother is to Daughter as Grandmother is to...", opts: ["Granddaughter", "Mother", "Aunt", "Niece"], a: 1 }, 
    { t: "Patterns", q: "1000, 500, 250, ...", opts: ["100", "125", "150", "120"], a: 1 },
    { t: "Logic", q: "What weighs more? A pound of iron or a pound of feathers.", opts: ["Iron", "Feathers", "Equal", "Depends"], a: 2 },
    { t: "Math", q: "7 x 8 - 6", opts: ["56", "50", "48", "60"], a: 1 },
    { t: "Verbal", q: "Antonym of 'Candid'", opts: ["Naive", "Deceptive", "White", "Pure"], a: 1 },
    { t: "Logic", q: "If 3 cats hunt 3 mice in 3 minutes, how many cats hunt 100 mice in 100 minutes?", opts: ["100", "3", "30", "1"], a: 1 },
    { t: "Spatial", q: "What shape results from cutting a cube diagonally in half?", opts: ["Pyramid", "Triangular Prism", "Rectangle", "Sphere"], a: 1 },
    { t: "Logic", q: "A is B's father, but B is not A's son. Who is B?", opts: ["Grandfather", "Daughter", "Uncle", "Grandson"], a: 1 },
    { t: "Math", q: "Smallest prime number", opts: ["0", "1", "2", "3"], a: 2 },
    { t: "Verbal", q: "Water : Thirst :: Food : ...", opts: ["Hunger", "Taste", "Mouth", "Plate"], a: 0 },
    { t: "Patterns", q: "Z, X, V, T, ...", opts: ["S", "R", "Q", "P"], a: 1 },
    { t: "Logic", q: "An electric train heads North. Where does the smoke go?", opts: ["South", "North", "East", "No smoke"], a: 3 },
    { t: "Math", q: "Square root of 144", opts: ["10", "11", "12", "14"], a: 2 }
];

const manualQuestionsEs = [
    { t: "Logic", q: "¿Qué número sigue? 2, 5, 10, 17, ...", opts: ["24", "26", "25", "27"], a: 1 },
    { t: "Verbal", q: "Luz es a Oscuridad como Calor es a...", opts: ["Fuego", "Frío", "Hielo", "Invierno"], a: 1 },
    { t: "Logic", q: "Si algunos Blips son Blops y todos los Blops son Blups, entonces...", opts: ["Todos los Blips son Blups", "Algunos Blips son Blups", "Ningún Blip es Blup", "Todos los Blups son Blips"], a: 1 },
    { t: "Spatial", q: "¿Cuál objeto no pertenece al grupo?", opts: ["Cubo", "Esfera", "Pirámide", "Cuadrado"], a: 3 },
    { t: "Math", q: "Si el 20% de X es 40, ¿Cuánto vale X?", opts: ["100", "200", "400", "80"], a: 1 },
    { t: "Logic", q: "Pedro es más alto que Juan. Juan es más alto que Luis. ¿Quién es el más bajo?", opts: ["Pedro", "Juan", "Luis", "Imposible saber"], a: 2 },
    { t: "Verbal", q: "Sinónimo de 'Efímero'", opts: ["Eterno", "Pasajero", "Duro", "Antiguo"], a: 1 },
    { t: "Patterns", q: "1, 1, 2, 3, 5, 8, ...", opts: ["11", "12", "13", "15"], a: 2 },
    { t: "Verbal", q: "Pez es a Nadar como Pájaro es a...", opts: ["Cielo", "Pluma", "Volar", "Nido"], a: 2 },
    { t: "Logic", q: "¿Qué letra sigue? A, C, E, G, ...", opts: ["H", "I", "J", "K"], a: 1 },
    { t: "Math", q: "¿Cuál es la mitad de 2 + 2?", opts: ["3", "2", "1", "4"], a: 0 },
    { t: "Logic", q: "Si AYER fue Jueves, ¿qué día es MAÑANA?", opts: ["Sábado", "Domingo", "Lunes", "Viernes"], a: 0 },
    { t: "Spatial", q: "¿Cuántos lados tiene un hexágono?", opts: ["5", "6", "7", "8"], a: 1 },
    { t: "Verbal", q: "Encuentra el intruso:", opts: ["Manzana", "Pera", "Plátano", "Zanahoria"], a: 3 },
    { t: "Logic", q: "Si giras a la izquierda 3 veces, ¿hacia dónde miras respecto al inicio?", opts: ["Izquierda", "Derecha", "Atrás", "Igual"], a: 1 },
    { t: "Math", q: "100 dividido por la mitad", opts: ["50", "200", "25", "10"], a: 1 },
    { t: "Verbal", q: "Guitarra es a Cuerda como Trompeta es a...", opts: ["Metal", "Viento", "Sonido", "Música"], a: 1 },
    { t: "Logic", q: "Madre es a Hija como Abuela es a...", opts: ["Nieta", "Madre", "Tía", "Sobrina"], a: 1 }, 
    { t: "Patterns", q: "1000, 500, 250, ...", opts: ["100", "125", "150", "120"], a: 1 },
    { t: "Logic", q: "¿Qué pesa más? Un kilo de hierro o un kilo de plumas.", opts: ["Hierro", "Plumas", "Igual", "Depende"], a: 2 },
    { t: "Math", q: "7 x 8 - 6", opts: ["56", "50", "48", "60"], a: 1 },
    { t: "Verbal", q: "Antónimo de 'Cándido'", opts: ["Ingenuo", "Malicioso", "Blanco", "Puro"], a: 1 },
    { t: "Logic", q: "Si 3 gatos cazan 3 ratones en 3 minutos, ¿cuántos gatos cazan 100 ratones en 100 minutos?", opts: ["100", "3", "30", "1"], a: 1 },
    { t: "Spatial", q: "¿Qué forma resulta de cortar un cubo por la mitad diagonalmente?", opts: ["Pirámide", "Prisma Triangular", "Rectángulo", "Esfera"], a: 1 },
    { t: "Logic", q: "A es padre de B, pero B no es hijo de A. ¿Quién es B?", opts: ["Abuelo", "Hija", "Tío", "Nieto"], a: 1 },
    { t: "Math", q: "Número primo más pequeño", opts: ["0", "1", "2", "3"], a: 2 },
    { t: "Verbal", q: "Agua : Sed :: Comida : ...", opts: ["Hambre", "Gusto", "Boca", "Plato"], a: 0 },
    { t: "Patterns", q: "Z, X, V, T, ...", opts: ["S", "R", "Q", "P"], a: 1 },
    { t: "Logic", q: "Un tren eléctrico va al Norte. ¿Hacia dónde va el humo?", opts: ["Sur", "Norte", "Este", "Sin humo"], a: 3 },
    { t: "Math", q: "Raíz cuadrada de 144", opts: ["10", "11", "12", "14"], a: 2 }
];

// Generator functions updated for Bilingual support
function generateMathQuestions(count, language) {
    const generated = [];
    const txt = {
        en: { next: "What follows?", whatIs: "What is", series: "Series", pct: "of" },
        es: { next: "¿Qué sigue?", whatIs: "¿Cuánto es", series: "Serie", pct: "de" }
    }[language];

    for (let i = 0; i < count; i++) {
        const type = i % 4;
        let qObj = {};
        
        if (type === 0) { // Simple Series
            const start = Math.floor(Math.random() * 10) + 1;
            const step = Math.floor(Math.random() * 5) + 2;
            const seq = [start, start+step, start+(step*2), start+(step*3)];
            qObj = {
                t: "Patterns",
                q: `${txt.next} ${seq.join(", ")}, ...`,
                opts: [
                    (start+(step*4)).toString(), 
                    (start+(step*4) + 1).toString(), 
                    (start+(step*4) - 1).toString(), 
                    (start+(step*5)).toString()
                ],
                a: 0
            };
        } else if (type === 1) { // Simple Multiplication
            const n1 = Math.floor(Math.random() * 10) + 5;
            const n2 = Math.floor(Math.random() * 10) + 5;
            const ans = n1 * n2;
            qObj = {
                t: "Math",
                q: `${txt.whatIs} ${n1} x ${n2}?`,
                opts: [
                    (ans).toString(), 
                    (ans + Math.floor(Math.random()*5)+1).toString(), 
                    (ans - Math.floor(Math.random()*5)-1).toString(), 
                    (ans + 10).toString()
                ],
                a: 0
            };
        } else if (type === 2) { // Letter Logic
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const startIdx = Math.floor(Math.random() * 20);
            const skip = Math.floor(Math.random() * 2) + 1;
            const seq = [letters[startIdx], letters[startIdx+skip], letters[startIdx+(skip*2)]];
            const correct = letters[startIdx+(skip*3)];
            const wrong = letters[startIdx+(skip*3)+1] || "A";
            qObj = {
                t: "Logic",
                q: `${txt.series}: ${seq.join("-")}-...`,
                opts: [correct, wrong, letters[startIdx], "Z"],
                a: 0
            };
        } else { // Percentages
            const total = (Math.floor(Math.random() * 20) + 1) * 10;
            const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
            const ans = (total * percent) / 100;
            qObj = {
                t: "Math",
                q: `${percent}% ${txt.pct} ${total}`,
                opts: [ans.toString(), (ans*2).toString(), (ans/2).toString(), (ans+5).toString()],
                a: 0
            };
        }
        
        // Shuffle options
        const correctVal = qObj.opts[qObj.a];
        const shuffledOpts = qObj.opts.map((val) => ({ val, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ val }) => val);
        qObj.opts = shuffledOpts;
        qObj.a = shuffledOpts.indexOf(correctVal);
        
        generated.push(qObj);
    }
    return generated;
}

const baseQuestions = isSpanish ? manualQuestionsEs : manualQuestionsEn;
const allQuestions = [...baseQuestions, ...generateMathQuestions(470, lang)];

// --- APP STATE ---
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let timerInterval;
let startTime;

// DOM References
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progressBar = document.getElementById('progress-bar');
const nextBtn = document.getElementById('next-btn');
const nameInput = document.getElementById('username');
const lastResultBtn = document.getElementById('last-result-btn');
const highResultBtn = document.getElementById('high-result-btn');

// Check for saved result on load
window.onload = function() {
    applyLanguage();
    const savedData = localStorage.getItem('iq_test_last_result');
    if (savedData) {
        lastResultBtn.classList.remove('hidden');
        highResultBtn.classList.remove('hidden');
    }
};

function startQuiz() {
    userName = nameInput.value.trim() || (isSpanish ? "Anónimo" : "Anonymous");
    
    // Randomly select 35 questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    currentQuestions = shuffled.slice(0, 35);
    
    currentQuestionIndex = 0;
    score = 0;
    
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    // Initialize Timer
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    
    renderQuestion();
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${minutes}:${seconds}`;
}

function renderQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    
    document.getElementById('current-q-num').innerText = currentQuestionIndex + 1;
    document.getElementById('category-badge').innerText = translations.categories[q.t] || q.t;
    
    const progress = ((currentQuestionIndex) / 35) * 100;
    progressBar.style.width = `${progress}%`;

    document.getElementById('question-text').innerText = q.q;

    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';

    q.opts.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition flex items-center group`;
        btn.onclick = () => selectOption(index, btn);
        btn.innerHTML = `
            <span translate="no" class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4 font-bold group-hover:bg-blue-200 group-hover:text-blue-700 transition">
                ${String.fromCharCode(65 + index)}
            </span>
            <span class="text-gray-700 font-medium">${opt}</span>
        `;
        optsContainer.appendChild(btn);
    });

    nextBtn.disabled = true;
    nextBtn.className = "bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-lg cursor-not-allowed transition";
}

let selectedAnswerIndex = null;

function selectOption(index, btnElement) {
    const buttons = document.getElementById('options-container').children;
    for (let b of buttons) {
        b.className = `w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition flex items-center group`;
        b.children[0].className = "w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4 font-bold group-hover:bg-blue-200 group-hover:text-blue-700 transition";
    }

    btnElement.className = `w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50 transition flex items-center shadow-md`;
    btnElement.children[0].className = "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-4 font-bold transition";

    selectedAnswerIndex = index;
    
    nextBtn.disabled = false;
    nextBtn.className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform active:scale-95 shadow-lg";
}

function nextQuestion() {
    if (selectedAnswerIndex === currentQuestions[currentQuestionIndex].a) {
        score++;
    }

    currentQuestionIndex++;
    selectedAnswerIndex = null;

    if (currentQuestionIndex < 35) {
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function calculateIQ(rawScore, timeSeconds) {
    // Base calculation: Base 70 + (Score * 2.5)
    // Max raw score 35 -> 157.5
    let iq = 70 + (rawScore * 2.5);
    
    // Time Adjustment logic:
    if (rawScore > 10) {
        const standardTime = 1200; // 20 minutes
        const timeDiff = standardTime - timeSeconds; 
        const timeAdjustment = Math.round(timeDiff / 60);
        const cappedAdjustment = Math.max(-20, Math.min(20, timeAdjustment));
        iq += cappedAdjustment;
    }

    // Clamp final IQ
    return Math.max(40, Math.min(180, Math.round(iq)));
}

function getIQCategory(iq) {
    if (iq >= 140) return translations.levels["Genius / Very Superior"];
    if (iq >= 120) return translations.levels["Superior"];
    if (iq >= 110) return translations.levels["High Average"];
    if (iq >= 90) return translations.levels["Average"];
    if (iq >= 80) return translations.levels["Low Average"];
    return translations.levels["Below Average"];
}

function finishQuiz() {
    clearInterval(timerInterval);
    const timeTaken = (Date.now() - startTime) / 1000; // in seconds
    
    const iq = calculateIQ(score, timeTaken);
    const category = getIQCategory(iq);
    const date = new Date().toLocaleDateString();

    // Save to LocalStorage
    const resultData = {
        name: userName,
        iq: iq,
        category: category,
        date: date
    };
    localStorage.setItem('iq_test_last_result', JSON.stringify(resultData));

    // Show Certificate
    renderCertificate(userName, iq, category, date);
    
    setIQResult(userName, iq, category, date);
    
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Show the "view last" button on subsequent refreshes
    lastResultBtn.classList.remove('hidden');
}

function viewLastCertificate() {
    const savedData = JSON.parse(localStorage.getItem('iq_test_last_result'));
    if (savedData) {
        setIQResult(savedData.name, savedData.iq, savedData.category, savedData.date);
        renderCertificate(savedData.name, savedData.iq, savedData.category, savedData.date);
        startScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
}

function viewHigherScoreCertificate() {
    const savedData = startCommonAppsAIVars;
    if (savedData) {
        var dateObj = new Date(savedData.iq_date);
        const month   = dateObj.getMonth() + 1; // months from 1-12
        const day     = dateObj.getDate();
        const year    = dateObj.getFullYear();
        dateObj = new Date(day + "/" + month + "/" + year);
        
        renderCertificate(savedData.iq_name, savedData.iq_result, savedData.iq_category, dateObj.toLocaleDateString());
        startScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
}

function renderCertificate(name, iq, category, date) {
    document.getElementById('cert-name').innerText = name;
    document.getElementById('iq-score').innerText = iq;
    document.getElementById('iq-category').innerText = category;
    document.getElementById('cert-date').innerText = date;
}

async function setIQResult(iq_name, iq_result, iq_category, iq_date) {
    var pi_user_id = startCommonAppsAIVars.pi_user_id;
    var pi_user_code = startCommonAppsAIVars.pi_user_code;
    var accessToken = startCommonAppsAIVars.accessToken;
    
    if(pi_user_id != "" && pi_user_code != "")
    {
        var data = {
                    'pi_user_id': pi_user_id,
                    'pi_user_code': pi_user_code,
                    'accessToken': accessToken,
                    'csrf_token': odoo.csrf_token,
                    'iq_name': iq_name,
                    'iq_result': iq_result,
                    'iq_category': iq_category,
                    'iq_date': iq_date
                };
        //$.ajaxSetup({async: false});
        return $.post( "/set-iq-result", data).done(function(data) {
            data = JSON.parse(data);
            if(data.result)
            {
                //alert("IQ was saved");
            }
        }).fail(function() {
            
        });
    }
}
