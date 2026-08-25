// State Variables
let currentScreen = 'languages';
let selectedLangId = null;
let selectedLevel = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnimating = false;

const DB_NAME = 'LingoQuestDB';
// 1. Aumentamos la versión de la base de datos para forzar la actualización
const DB_VERSION = 3; 
let db;

// Data Structure
const languages = [
    { id: 'es', name: 'Spanish', target: 'Spanish', source: 'English speakers', icon: '🇪🇸', promptFormat: 'How do you say', bg: 'bg-orange-100', border: 'border-orange-200' },
    { id: 'en', name: 'English', target: 'English', source: 'Spanish speakers', icon: '🇬🇧', promptFormat: '¿Cómo se dice', bg: 'bg-blue-100', border: 'border-blue-200' },
    { id: 'kr', name: 'Korean', target: 'Korean', source: 'English speakers', icon: '🇰🇷', promptFormat: 'How do you say', bg: 'bg-pink-100', border: 'border-pink-200' },
    { id: 'cn', name: 'Chinese (Mandarin)', target: 'Chinese', source: 'English speakers', icon: '🇨🇳', promptFormat: 'How do you say', bg: 'bg-red-100', border: 'border-red-200' },
    { id: 'jp', name: 'Japanese', target: 'Japanese', source: 'English speakers', icon: '🇯🇵', promptFormat: 'How do you say', bg: 'bg-purple-100', border: 'border-purple-200' },
    { id: 'vn', name: 'Vietnamese', target: 'Vietnamese', source: 'English speakers', icon: '🇻🇳', promptFormat: 'How do you say', bg: 'bg-yellow-100', border: 'border-yellow-200' }
];

// Question Database (Mantenida intacta)
const initialQuestionDB = {
    'es': {
        'Beginner': [
            { q: 'Hello', a: 'Hola', wrong: ['Adiós', 'Gracias', 'Por favor'] },
            { q: 'Cat', a: 'Gato', wrong: ['Perro', 'Pájaro', 'Ratón'] },
            { q: 'Water', a: 'Agua', wrong: ['Leche', 'Jugo', 'Vino'] },
            { q: 'Book', a: 'Libro', wrong: ['Mesa', 'Silla', 'Lápiz'] },
            { q: 'Yes', a: 'Sí', wrong: ['No', 'Tal vez', 'Nunca'] }
        ],
        'Intermediate': [
            { q: 'Library', a: 'Biblioteca', wrong: ['Librería', 'Escuela', 'Edificio'] },
            { q: 'Always', a: 'Siempre', wrong: ['Nunca', 'A veces', 'Pronto'] },
            { q: 'To understand', a: 'Entender', wrong: ['Hablar', 'Caminar', 'Dormir'] },
            { q: 'Window', a: 'Ventana', wrong: ['Puerta', 'Pared', 'Techo'] },
            { q: 'Fast', a: 'Rápido', wrong: ['Lento', 'Fuerte', 'Débil'] }
        ],
        'Advanced': [
            { q: 'Although', a: 'Aunque', wrong: ['Sin embargo', 'Además', 'Por lo tanto'] },
            { q: 'Development', a: 'Desarrollo', wrong: ['Investigación', 'Descubrimiento', 'Proceso'] },
            { q: 'Environment', a: 'Medio ambiente', wrong: ['Naturaleza', 'Clima', 'Paisaje'] },
            { q: 'To summarize', a: 'Resumir', wrong: ['Explicar', 'Analizar', 'Evaluar'] },
            { q: 'Challenge', a: 'Desafío', wrong: ['Problema', 'Oportunidad', 'Misterio'] }
        ]
    },
    'en': {
        'Beginner': [
            { q: 'Perro', a: 'Dog', wrong: ['Cat', 'Bird', 'Fish'] },
            { q: 'Manzana', a: 'Apple', wrong: ['Banana', 'Orange', 'Grape'] },
            { q: 'Casa', a: 'House', wrong: ['Car', 'Tree', 'Road'] },
            { q: 'Rojo', a: 'Red', wrong: ['Blue', 'Green', 'Yellow'] },
            { q: 'Hola', a: 'Hello', wrong: ['Goodbye', 'Please', 'Thanks'] }
        ],
        'Intermediate': [
            { q: 'Ciudad', a: 'City', wrong: ['Town', 'Village', 'Country'] },
            { q: 'Pensar', a: 'Think', wrong: ['Know', 'Believe', 'Feel'] },
            { q: 'Viaje', a: 'Journey', wrong: ['Ticket', 'Station', 'Luggage'] },
            { q: 'Hermano', a: 'Brother', wrong: ['Sister', 'Father', 'Uncle'] },
            { q: 'Llover', a: 'Rain', wrong: ['Snow', 'Wind', 'Cloud'] }
        ],
        'Advanced': [
            { q: 'Lograr', a: 'Achieve', wrong: ['Fail', 'Attempt', 'Ignore'] },
            { q: 'Conocimiento', a: 'Knowledge', wrong: ['Wisdom', 'Ignorance', 'Thought'] },
            { q: 'Desafío', a: 'Challenge', wrong: ['Agreement', 'Comfort', 'Routine'] },
            { q: 'Abordar', a: 'Tackle', wrong: ['Avoid', 'Release', 'Drop'] },
            { q: 'Sutil', a: 'Subtle', wrong: ['Obvious', 'Loud', 'Bright'] }
        ]
    },
    'kr': {
        'Beginner': [
            { q: 'Hello', a: '안녕하세요 (Annyeonghaseyo)', wrong: ['감사합니다 (Gamsahamnida)', '네 (Ne)', '아니요 (Aniyo)'] },
            { q: 'Thank you', a: '감사합니다 (Gamsahamnida)', wrong: ['사랑해요 (Saranghaeyo)', '미안해요 (Mianhaeyo)', '괜찮아요 (Gwaenchanayo)'] },
            { q: 'Yes', a: '네 (Ne)', wrong: ['아니요 (Aniyo)', '아마도 (Amado)', '절대 (Jeoldae)'] },
            { q: 'Water', a: '물 (Mul)', wrong: ['불 (Bul)', '흙 (Heuk)', '바람 (Baram)'] },
            { q: 'Friend', a: '친구 (Chingu)', wrong: ['가족 (Gajok)', '선생님 (Seonsaengnim)', '학생 (Haksaeng)'] }
        ],
        'Intermediate': [
            { q: 'School', a: '학교 (Hakgyo)', wrong: ['병원 (Byeongwon)', '식당 (Sikdang)', '공원 (Gongwon)'] },
            { q: 'Time', a: '시간 (Sigan)', wrong: ['날짜 (Naljja)', '요일 (Yoil)', '년도 (Nyeondo)'] },
            { q: 'To eat', a: '먹다 (Meokda)', wrong: ['마시다 (Masida)', '자다 (Jada)', '가다 (Gada)'] },
            { q: 'Weather', a: '날씨 (Nalssi)', wrong: ['기분 (Gibun)', '하늘 (Haneul)', '계절 (Gyejeol)'] },
            { q: 'Beautiful', a: '아름답다 (Areumdapda)', wrong: ['귀엽다 (Gwiyeopda)', '멋있다 (Meositda)', '나쁘다 (Nappeuda)'] }
        ],
        'Advanced': [
            { q: 'Experience', a: '경험 (Gyeongheom)', wrong: ['기억 (Gieok)', '상상 (Sangsang)', '이론 (Iron)'] },
            { q: 'Responsibility', a: '책임 (Chaegim)', wrong: ['의무 (Uimu)', '권리 (Gwonri)', '자유 (Jayu)'] },
            { q: 'Society', a: '사회 (Sahoe)', wrong: ['국가 (Gukga)', '세계 (Segye)', '자연 (Jayeon)'] },
            { q: 'To improve', a: '개선하다 (Gaeseonhada)', wrong: ['악화되다 (Akhwadoeda)', '유지하다 (Yujihada)', '포기하다 (Pogihada)'] },
            { q: 'Complex', a: '복잡한 (Bokjaphan)', wrong: ['단순한 (Dansunhan)', '명확한 (Myeonghwakhan)', '평범한 (Pyeongbeomhan)'] }
        ]
    },
    'cn': {
        'Beginner': [
            { q: 'Hello', a: '你好 (Nǐ hǎo)', wrong: ['谢谢 (Xièxiè)', '再见 (Zàijiàn)', '对不起 (Duìbùqǐ)'] },
            { q: 'Thank you', a: '谢谢 (Xièxiè)', wrong: ['不客气 (Bù kèqì)', '好 (Hǎo)', '是 (Shì)'] },
            { q: 'Good', a: '好 (Hǎo)', wrong: ['坏 (Huài)', '大 (Dà)', '小 (Xiǎo)'] },
            { q: 'Water', a: '水 (Shuǐ)', wrong: ['火 (Huǒ)', '茶 (Chá)', '酒 (Jiǔ)'] },
            { q: 'Person', a: '人 (Rén)', wrong: ['狗 (Gǒu)', '猫 (Māo)', '鸟 (Niǎo)'] }
        ],
        'Intermediate': [
            { q: 'Computer', a: '电脑 (Diànnǎo)', wrong: ['电视 (Diànshì)', '电话 (Diànhuà)', '冰箱 (Bīngxiāng)'] },
            { q: 'Tomorrow', a: '明天 (Míngtiān)', wrong: ['昨天 (Zuótiān)', '今天 (Jīntiān)', '后天 (Hòutiān)'] },
            { q: 'Because', a: '因为 (Yīnwèi)', wrong: ['所以 (Suǒyǐ)', '但是 (Dànshì)', '如果 (Rúguǒ)'] },
            { q: 'To eat', a: '吃 (Chī)', wrong: ['喝 (Hē)', '跑 (Pǎo)', '走 (Zǒu)'] },
            { q: 'Beautiful', a: '漂亮 (Piàoliang)', wrong: ['丑陋 (Chǒulòu)', '奇怪 (Qíguài)', '聪明 (Cōngmíng)'] }
        ],
        'Advanced': [
            { q: 'Influence', a: '影响 (Yǐngxiǎng)', wrong: ['结果 (Jiéguǒ)', '原因 (Yuányīn)', '目的 (Mùdì)'] },
            { q: 'Experience', a: '经验 (Jīngyàn)', wrong: ['理论 (Lǐlùn)', '知识 (Zhīshì)', '猜测 (Cāicè)'] },
            { q: 'Complicated', a: '复杂 (Fùzá)', wrong: ['简单 (Jiǎndān)', '容易 (Róngyì)', '清楚 (Qīngchǔ)'] },
            { q: 'To develop', a: '发展 (Fāzhǎn)', wrong: ['停止 (Tíngzhǐ)', '破坏 (Pòhuài)', '消失 (Xiāoshī)'] },
            { q: 'Society', a: '社会 (Shèhuì)', wrong: ['自然 (Zìrán)', '太空 (Tàikōng)', '个人的 (Gèrén de)'] }
        ]
    },
    'jp': {
        'Beginner': [
            { q: 'Hello', a: 'こんにちは (Konnichiwa)', wrong: ['さようなら (Sayounara)', 'ありがとう (Arigatou)', 'はい (Hai)'] },
            { q: 'Cat', a: '猫 (Neko)', wrong: ['犬 (Inu)', '鳥 (Tori)', '魚 (Sakana)'] },
            { q: 'Water', a: '水 (Mizu)', wrong: ['お茶 (Ocha)', '酒 (Sake)', '牛乳 (Gyūnyū)'] },
            { q: 'Yes', a: 'はい (Hai)', wrong: ['いいえ (Iie)', 'たぶん (Tabun)', 'いつも (Itsumo)'] },
            { q: 'Thank you', a: 'ありがとう (Arigatou)', wrong: ['すみません (Sumimasen)', 'おはよう (Ohayou)', 'おやすみ (Oyasumi)'] }
        ],
        'Intermediate': [
            { q: 'Book', a: '本 (Hon)', wrong: ['雑誌 (Zasshi)', '新聞 (Shinbun)', '手紙 (Tegami)'] },
            { q: 'Tomorrow', a: '明日 (Ashita)', wrong: ['昨日 (Kinō)', '今日 (Kyō)', '来週 (Raishū)'] },
            { q: 'To eat', a: '食べる (Taberu)', wrong: ['飲む (Nomu)', '寝る (Neru)', '行く (Iku)'] },
            { q: 'Friend', a: '友達 (Tomodachi)', wrong: ['家族 (Kazoku)', '先生 (Sensei)', '学生 (Gakusei)'] },
            { q: 'Fast', a: '早い (Hayai)', wrong: ['遅い (Osoi)', '高い (Takai)', '安い (Yasui)'] }
        ],
        'Advanced': [
            { q: 'Economy', a: '経済 (Keizai)', wrong: ['政治 (Seiji)', '文化 (Bunka)', '歴史 (Rekishi)'] },
            { q: 'Preparation', a: '準備 (Junbi)', wrong: ['結果 (Kekka)', '原因 (Gen\'in)', '計画 (Keikaku)'] },
            { q: 'To solve', a: '解決する (Kaiketsu suru)', wrong: ['失敗する (Shippai suru)', '無視する (Mushi suru)', '忘れる (Wasureru)'] },
            { q: 'Environment', a: '環境 (Kankyō)', wrong: ['自然 (Shizen)', '都市 (Toshi)', '宇宙 (Uchū)'] },
            { q: 'Complicated', a: '複雑な (Fukuzatsuna)', wrong: ['簡単な (Kantan na)', '明らかな (Akiraka na)', '普通の (Futsū no)'] }
        ]
    },
    'vn': {
        'Beginner': [
            { q: 'Hello', a: 'Xin chào', wrong: ['Cảm ơn', 'Tạm biệt', 'Vâng'] },
            { q: 'Thank you', a: 'Cảm ơn', wrong: ['Xin lỗi', 'Không', 'Có'] },
            { q: 'Water', a: 'Nước', wrong: ['Lửa', 'Đất', 'Gió'] },
            { q: 'Cat', a: 'Con mèo', wrong: ['Con chó', 'Con chim', 'Con cá'] },
            { q: 'House', a: 'Ngôi nhà', wrong: ['Trường học', 'Bệnh viện', 'Chợ'] }
        ],
        'Intermediate': [
            { q: 'School', a: 'Trường học', wrong: ['Công viên', 'Nhà hàng', 'Khách sạn'] },
            { q: 'Today', a: 'Hôm nay', wrong: ['Ngày mai', 'Hôm qua', 'Tuần tới'] },
            { q: 'Delicious', a: 'Ngon', wrong: ['Dở', 'Ngọt', 'Mặn'] },
            { q: 'To sleep', a: 'Ngủ', wrong: ['Ăn', 'Uống', 'Chạy'] },
            { q: 'Beautiful', a: 'Đẹp', wrong: ['Xấu', 'Cao', 'Thấp'] }
        ],
        'Advanced': [
            { q: 'Environment', a: 'Môi trường', wrong: ['Khí hậu', 'Tự nhiên', 'Thời tiết'] },
            { q: 'Development', a: 'Phát triển', wrong: ['Suy thoái', 'Dừng lại', 'Phá hủy'] },
            { q: 'Experience', a: 'Kinh nghiệm', wrong: ['Lý thuyết', 'Thực hành', 'Kiến thức'] },
            { q: 'To protect', a: 'Bảo vệ', wrong: ['Tấn công', 'Bỏ qua', 'Phá hoại'] },
            { q: 'Challenge', a: 'Thử thách', wrong: ['Cơ hội', 'Thất bại', 'Dễ dàng'] }
        ]
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        initLanguageList();
        updateHeader();
        // 2. Cargamos y mostramos el score total apenas inicia la app
        await updateGlobalScoreDisplay();
    } catch (error) {
        console.error("Failed to initialize database", error);
    }
});

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            if (database.objectStoreNames.contains('questions')) {
                database.deleteObjectStore('questions');
            }
            
            const store = database.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
            store.createIndex('lang_level', ['lang', 'level'], { unique: false });

            // 3. Creamos un store nuevo para los puntajes del usuario
            if (!database.objectStoreNames.contains('userScores')) {
                database.createObjectStore('userScores', { keyPath: 'sectionId' });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            checkAndSeedDB().then(resolve).catch(reject);
        };

        request.onerror = (event) => reject(event.target.error);
    });
}

// 4. Funciones nuevas para manejar el puntaje total
async function saveScoreToDB(lang, level, finalScore) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['userScores'], 'readwrite');
        const store = transaction.objectStore('userScores');
        
        // Creamos un ID único por sección (ej. "es_Beginner")
        const sectionId = `${lang}_${level}`;
        
        // .put() sobrescribe si el ID ya existe, ideal para el recálculo
        const request = store.put({ sectionId, score: finalScore });
        
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}

async function getGlobalScore() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['userScores'], 'readonly');
        const store = transaction.objectStore('userScores');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const scores = request.result;
            const total = scores.reduce((sum, item) => sum + item.score, 0);
            resolve(total);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

async function updateGlobalScoreDisplay() {
    try {
        const totalScore = await getGlobalScore();
        
        // 1. Look for an existing element in your HTML with id="global-total-score"
        const existingScoreSpan = document.getElementById('global-total-score');
        
        if (existingScoreSpan) {
            // If you added <span id="global-total-score"></span> manually, just update it
            existingScoreSpan.textContent = totalScore;
        } else {
            // 2. If it doesn't exist, automatically find the <header> tag and append a styled badge
            const headerElement = document.querySelector('header');
            
            if (headerElement) {
                // Ensure the header doesn't cut off our new element
                headerElement.style.display = 'flex';
                headerElement.style.alignItems = 'center';
                headerElement.style.justifyContent = 'space-between';
                
                const scoreWrapper = document.createElement('div');
                scoreWrapper.id = 'global-score-container';
                scoreWrapper.className = 'flex items-center gap-1 font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-sm ml-auto';
                scoreWrapper.innerHTML = `🌟 <span id="global-total-score">${totalScore}</span> pts`;
                
                headerElement.appendChild(scoreWrapper);
                
                $('#global-score-container').off('click').on('click', function(){
                    startCommonAppsAIVars.showCert('You have currently 🌟 ' + totalScore + ' pts in Language Quizes');
                });
            }
        }
    } catch (error) {
        console.error("Error updating global score:", error);
    }
}

async function checkAndSeedDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const countRequest = store.count();

        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                seedDB().then(resolve).catch(reject);
            } else {
                resolve();
            }
        };
        countRequest.onerror = (e) => reject(e.target.error);
    });
}

async function seedDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');

        for (const lang in initialQuestionDB) {
            for (const level in initialQuestionDB[lang]) {
                initialQuestionDB[lang][level].forEach(q => {
                    store.add({ ...q, lang, level });
                });
            }
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = (e) => reject(e.target.error);
    });
}

async function getQuestionsFromDB(lang, level) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const index = store.index('lang_level');
        const request = index.getAll([lang, level]);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function initLanguageList() {
    const list = document.getElementById('language-list');
    list.innerHTML = '';
    
    languages.forEach(lang => {
        const btn = document.createElement('button');
        btn.className = `w-full flex items-center p-4 rounded-2xl bg-white border-2 border-gray-100 hover:${lang.border} shadow-sm transition group text-left relative`;
        btn.onclick = () => selectLanguage(lang.id);
        
        btn.innerHTML = `
            <div class="w-14 h-14 ${lang.bg} rounded-xl flex items-center justify-center text-3xl mr-4 z-10 shrink-0">
                ${lang.icon}
            </div>
            <div class="z-10 flex-1">
                <h3 class="font-bold text-gray-800 text-lg">${lang.name}</h3>
                <p class="text-gray-400 text-xs font-medium">For ${lang.source}</p>
            </div>
            <div class="absolute right-4 text-gray-300 group-hover:text-indigo-500 transition z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        `;
        list.appendChild(btn);
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');
    currentScreen = screenId;
    updateHeader();
}

function updateHeader() {
    const backBtn = document.getElementById('btn-back');
    if (currentScreen === 'languages') {
        backBtn.classList.add('invisible');
    } else if (currentScreen === 'levels' || currentScreen === 'game') {
        backBtn.classList.remove('invisible');
    } else if (currentScreen === 'results') {
        backBtn.classList.add('invisible');
    }
}

function navigateBack() {
    if (currentScreen === 'levels') {
        switchScreen('languages');
    } else if (currentScreen === 'game') {
        switchScreen('levels');
    }
}

function navigateHome() {
    switchScreen('languages');
}

function selectLanguage(langId) {
    selectedLangId = langId;
    const lang = languages.find(l => l.id === langId);
    document.getElementById('level-lang-icon').textContent = lang.icon;
    document.getElementById('level-title').textContent = `${lang.target} Levels`;
    switchScreen('levels');
}

async function selectLevel(level) {
    selectedLevel = level;
    
    try {
        const dbQuestions = await getQuestionsFromDB(selectedLangId, level);
        if (!dbQuestions || dbQuestions.length === 0) {
            console.error("No data for this combination.");
            return;
        }
        
        currentQuestions = [...dbQuestions].sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        
        updateScoreUI();
        switchScreen('game');
        renderQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function renderQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    isAnimating = false;
    const lang = languages.find(l => l.id === selectedLangId);
    const qData = currentQuestions[currentQuestionIndex];
    
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('game-progress-text').textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    
    document.getElementById('question-prompt').textContent = `${lang.promptFormat}:`;
    document.getElementById('question-word').textContent = `"${qData.q}"`;

    const options = [qData.a, ...qData.wrong];
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm hover:border-indigo-300 hover:bg-indigo-50 font-medium text-gray-700 text-lg transition-all duration-200 outline-none tap-highlight-transparent`;
        btn.textContent = opt;
        
        btn.onclick = () => checkAnswer(btn, opt, qData.a);
        container.appendChild(btn);
    });
}

function checkAnswer(clickedBtn, selectedAnswer, correctAnswer) {
    if (isAnimating) return;
    isAnimating = true;

    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        clickedBtn.classList.add('anim-correct');
        score++;
        updateScoreUI();
    } else {
        clickedBtn.classList.add('anim-wrong');
        const buttons = document.getElementById('options-container').querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('anim-reveal-correct');
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        renderQuestion();
    }, 1000);
}

function updateScoreUI() {
    document.getElementById('game-score-text').textContent = `Score: ${score}`;
}

// 5. Convertimos endGame en asíncrono para guardar los datos al terminar
async function endGame() {
    document.getElementById('progress-bar').style.width = `100%`;
    
    // Guardar el puntaje en DB y actualizar el total global de inmediato
    await saveScoreToDB(selectedLangId, selectedLevel, score);
    await updateGlobalScoreDisplay();
    
    setTimeout(() => {
        const total = currentQuestions.length;
        document.getElementById('final-score').textContent = `${score} / ${total}`;
        
        const emojiEl = document.getElementById('result-emoji');
        const titleEl = document.getElementById('result-title');
        const msgEl = document.getElementById('result-message');
        
        const percentage = score / total;
        
        if (percentage === 1) {
            emojiEl.textContent = '🏆';
            titleEl.textContent = 'Perfect!';
            msgEl.textContent = 'Flawless victory. You are a natural!';
        } else if (percentage >= 0.6) {
            emojiEl.textContent = '👏';
            titleEl.textContent = 'Great Job!';
            msgEl.textContent = 'You have a solid understanding. Keep going!';
        } else {
            emojiEl.textContent = '💪';
            titleEl.textContent = 'Good Effort!';
            msgEl.textContent = 'Practice makes perfect. Try again!';
        }

        switchScreen('results');
    }, 300);
}
