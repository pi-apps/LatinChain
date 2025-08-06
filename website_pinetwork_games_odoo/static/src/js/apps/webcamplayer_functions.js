// Get DOM element references
const video = document.getElementById('webcam');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const errorDiv = document.getElementById('error');
const detectionList = document.getElementById('detectionList');
const switchCameraButton = document.getElementById('switchCameraButton');
const askButton = document.getElementById('askButton');
const toggleAutoSpeakButton = document.getElementById('toggleAutoSpeak');
const speechStatusDiv = document.getElementById('speechStatus');
const confidenceThresholdSlider = document.getElementById('confidenceThreshold');
const confidenceValueSpan = document.getElementById('confidenceValue');
const voiceSelect = document.getElementById('voiceSelect'); // New voice select element

let model = undefined;
let animationFrameId = null;
let currentFacingMode = 'user';

let lastDetectionTime = 0;
const detectionInterval = 100; // ms

let lastDetectedPredictions = [];
let minConfidence = parseFloat(confidenceThresholdSlider.value) / 100;

// --- Variables for continuous speech ---
let isAutoSpeakEnabled = false;
let lastSpokenObjects = new Set();
const autoSpeakInterval = 5000; // 5 seconds
let lastSpokenTime = 0;

// --- Variables and Functions for Voice Selection (Web Speech API) ---
let selectedVoice = null; // New variable to hold the selected voice object

// --- Pre-translated phrases for various languages ---
const translatedPhrases = {
    'en': {
        'i_see_a': 'I see a',
        'i_see_and_a': 'I see a ... and a',
        'i_see_and_b': 'I see a ...',
        'i_see_many': 'I see a ',
        'i_no_longer_see_a': 'I no longer see a',
        'no_objects_detected': 'No objects detected recently.',
        'i_am_watching': "I'm watching"
    },
    'es': {
        'i_see_a': 'Veo un/una',
        'i_see_and_a': 'Veo un/una ... y un/una',
        'i_see_and_b': 'Veo un/una',
        'i_see_many': 'Veo un/una ',
        'i_no_longer_see_a': 'Ya no veo un/una',
        'no_objects_detected': 'No se detectaron objetos recientemente.',
        'i_am_watching': 'Estoy viendo'
    },
    'pt': {
        'i_see_a': 'Eu vejo um/uma',
        'i_see_and_a': 'Eu vejo um/uma ... e um/uma',
        'i_see_and_b': 'Eu vejo um/uma',
        'i_see_many': 'Eu vejo um/uma ',
        'i_no_longer_see_a': 'Eu não vejo mais um/uma',
        'no_objects_detected': 'Nenhum objeto detectado recentemente.',
        'i_am_watching': 'Estou vendo'
    },
    'ko': {
        'i_see_a': '하나의',
        'i_see_and_a': '하나의 ... 과(와) 하나의',
        'i_see_and_b': '하나의',
        'i_see_many': '하나의 ',
        'i_no_longer_see_a': '더 이상 하나의',
        'no_objects_detected': '최근에 감지된 개체가 없습니다.',
        'i_am_watching': '보고 있어요'
    },
    'vi': {
        'i_see_a': 'Tôi thấy một',
        'i_see_and_a': 'Tôi thấy một ... và một',
        'i_see_and_b': 'Tôi thấy một',
        'i_see_many': 'Tôi thấy một ',
        'i_no_longer_see_a': 'Tôi không còn thấy một',
        'no_objects_detected': 'Không có đối tượng nào được phát hiện gần đây.',
        'i_am_watching': 'Tôi đang xem'
    },
    'ja': {
        'i_see_a': '私は一つ',
        'i_see_and_a': '私は一つ ... と一つ',
        'i_see_and_b': '私は一つ',
        'i_see_many': '私は一つ ',
        'i_no_longer_see_a': '私はもう一つ',
        'no_objects_detected': '最近検出されたオブジェクトはありません。',
        'i_am_watching': '見ています'
    },
    'zh': {
        'i_see_a': '我看到一个',
        'i_see_and_a': '我看到一个... 和一个',
        'i_see_and_b': '我看到一个',
        'i_see_many': '我看到一个',
        'i_no_longer_see_a': '我不再看到一个',
        'no_objects_detected': '最近没有检测到物体。',
        'i_am_watching': '我正在看'
    },
    'fr': {
        'i_see_a': 'Je vois un',
        'i_see_and_a': 'Je vois un ... et un',
        'i_see_and_b': 'Je vois un',
        'i_see_many': 'Je vois un ',
        'i_no_longer_see_a': 'Je ne vois plus un',
        'no_objects_detected': "Aucun objet n'a été détecté récemment.",
        'i_am_watching': 'Je regarde'
    },
    'de': {
        'i_see_a': 'Ich sehe ein',
        'i_see_and_a': 'Ich sehe ein ... und ein',
        'i_see_and_b': 'Ich sehe ein',
        'i_see_many': 'Ich sehe ein ',
        'i_no_longer_see_a': 'Ich sehe kein',
        'no_objects_detected': 'Kürzlich wurden keine Objekte erkannt.',
        'i_am_watching': 'Ich schaue mir an'
    },
    'it': {
        'i_see_a': 'Vedo un/una',
        'i_see_and_a': 'Vedo un/una ... e un/una',
        'i_see_and_b': 'Vedo un/una',
        'i_see_many': 'Vedo un/una ',
        'i_no_longer_see_a': 'Non vedo più un/una',
        'no_objects_detected': 'Nessun oggetto rilevato di recente.',
        'i_am_watching': 'Sto guardando'
    },
    'ru': {
        'i_see_a': 'Я вижу',
        'i_see_and_a': 'Я вижу ... и',
        'i_see_and_b': 'Я вижу',
        'i_see_many': 'Я вижу ',
        'i_no_longer_see_a': 'Я больше не вижу',
        'no_objects_detected': 'Недавно не было обнаружено ни одного объекта.',
        'i_am_watching': 'Я смотрю'
    },
    'af': {
        'i_see_a': 'Ek sien \'n',
        'i_see_and_a': 'Ek sien \'n ... en \'n',
        'i_see_and_b': 'Ek sien \'n',
        'i_see_many': 'Ek sien \'n ',
        'i_no_longer_see_a': 'Ek sien nie meer \'n',
        'no_objects_detected': 'Geen voorwerpe onlangs opgespoor nie.',
        'i_am_watching': 'Ek kyk'
    }
};

/**
 * A helper function to get the correct translated phrase.
 * Falls back to English if the language is not found.
 * @param {string} key The key for the phrase (e.g., 'i_see_a').
 * @param {string} langCode The language code (e.g., 'es').
 * @returns {string} The translated phrase.
 */
function getTranslation(key, langCode) {
    const shortLangCode = langCode.split('-')[0];
    return (translatedPhrases[shortLangCode] && translatedPhrases[shortLangCode][key]) ?
           translatedPhrases[shortLangCode][key] :
           translatedPhrases['en'][key];
}

/**
 * Populates the voice selection dropdown with the specified languages.
 * Sorts the list alphabetically and sets an English voice as the default.
 */
function populateVoiceList() {
    if (!('speechSynthesis' in window)) {
        console.warn("Web Speech API not supported.");
        voiceSelect.innerHTML = '<option>Speech not supported</option>';
        voiceSelect.disabled = true;
        return;
    }

    const allVoices = window.speechSynthesis.getVoices();
    const supportedShortLangs = [
        'en', 'es', 'pt', 'ko', 'vi', 'ja', 'zh', 'fr', 'de', 'it', 'ru', 'af'
    ];

    // Filter voices by checking if their language code starts with any of the supported short codes
    const filteredVoices = allVoices.filter(voice => {
        const shortLang = voice.lang.split('-')[0];
        return supportedShortLangs.includes(shortLang);
    });
    
    // Sort the voices alphabetically by language
    filteredVoices.sort((a, b) => a.lang.localeCompare(b.lang));

    voiceSelect.innerHTML = '';

    if (filteredVoices.length === 0) {
        console.warn("No suitable voices found.");
        voiceSelect.innerHTML = '<option>No suitable voices available</option>';
        voiceSelect.disabled = true;
        return;
    }
    
    voiceSelect.disabled = false;
    
    let defaultVoice = null;
    filteredVoices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-name', voice.name);
        option.setAttribute('data-lang', voice.lang);
        voiceSelect.appendChild(option);

        if (voice.lang.startsWith('en') && !defaultVoice) {
            defaultVoice = voice;
        }
    });

    if (defaultVoice) {
        selectedVoice = defaultVoice;
        voiceSelect.value = `${defaultVoice.name} (${defaultVoice.lang})`;
    } else {
        selectedVoice = filteredVoices[0];
        voiceSelect.value = `${filteredVoices[0].name} (${filteredVoices[0].lang})`;
    }
    
    console.log("Filtered voices loaded. Default voice selected:", selectedVoice ? selectedVoice.name : 'None');
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList();
}

/**
 * Speaks the given text using the currently selected voice and language.
 * The text is translated if the voice is not English.
 * @param {string} textToSpeak The text to be spoken (in English).
 */
async function speakDetectedObjects(textToSpeak) {
    if ('speechSynthesis' in window && selectedVoice) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        speechStatusDiv.textContent = "Speaking...";
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.pitch = 1;
        utterance.rate = 1;

        utterance.onend = () => {
            speechStatusDiv.textContent = `Last announcement: "${textToSpeak}"`;
        };
        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event.error);
            speechStatusDiv.textContent = "Error speaking.";
        };

        window.speechSynthesis.speak(utterance);
    } else {
        speechStatusDiv.textContent = `Last announcement: "${textToSpeak}"`;
        console.warn("Web Speech API not supported or no voice selected.");
    }
}

/**
 * Event handler for when the user selects a new voice from the dropdown.
 */
voiceSelect.addEventListener('change', () => {
    const selectedOption = voiceSelect.options[voiceSelect.selectedIndex];
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(voice => voice.name === selectedOption.getAttribute('data-name') && voice.lang === selectedOption.getAttribute('data-lang'));
    console.log("New voice selected:", selectedVoice ? selectedVoice.name : 'None');
});

function displayError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove('hidden');
    statusDiv.classList.add('hidden');
}

async function setupWebcam(facingMode) {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
        statusDiv.textContent = `Starting camera (${facingMode === 'user' ? 'front' : 'rear'})...`;
        errorDiv.classList.add('hidden');
       
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
       
        video.srcObject = stream;
        currentFacingMode = facingMode;

        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
       
        statusDiv.textContent = 'Webcam started. Loading model...';
        return video;
    } catch (err) {
        console.error(`Error accessing webcam (${facingMode}):`, err);
        if (facingMode === 'user' && err.name === 'OverconstrainedError') {
            displayError('Front camera not available, trying rear camera...');
            return setupWebcam('environment');
        } else if (facingMode === 'environment' && err.name === 'OverconstrainedError') {
            displayError('Rear camera not available, trying front camera...');
            return setupWebcam('user');
        } else {
            displayError(`Could not access webcam. Make sure you have granted permissions. (${err.message})`);
            return null;
        }
    }
}

async function loadModel() {
    try {
        statusDiv.textContent = 'Loading model...';
        model = await cocoSsd.load();
        statusDiv.textContent = 'Model loaded. Starting detection...';
        statusDiv.classList.add('hidden');
    } catch (err) {
        console.error('Error loading model:', err);
        displayError('Could not load the object detection model.');
    }
}

async function detectObjects(currentTime) {
    if (!model || video.readyState !== 4) {
        animationFrameId = requestAnimationFrame(detectObjects);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (currentTime - lastDetectionTime > detectionInterval) {
        lastDetectionTime = currentTime;

        const predictions = await model.detect(video);
       
        lastDetectedPredictions = predictions.filter(prediction => prediction.score >= minConfidence);

        detectionList.innerHTML = '';
        const currentDetectedClasses = new Set();
       
        lastDetectedPredictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            const label = prediction.class;
            const score = Math.round(prediction.score * 100);

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00FF00';
            ctx.fillStyle = '#00FF00';
            ctx.stroke();

            const fontSize = 16;
            ctx.font = `${fontSize}px Arial`;
            const text = `${label} (${score}%)`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(x, y > fontSize ? y - fontSize : y, textWidth + 8, fontSize + 4);

            ctx.fillStyle = '#000000';
            ctx.fillText(text, x + 4, y > fontSize ? y - 4 : y + fontSize + 4);

            const listItem = document.createElement('li');
            listItem.className = 'detection-item';
            listItem.textContent = `${label} (${score}%)`;
            detectionList.appendChild(listItem);
       
            currentDetectedClasses.add(label);
        });
       
        // --- Logic for continuous speech ---
        if (isAutoSpeakEnabled && currentTime - lastSpokenTime > autoSpeakInterval) {
            const newObjects = Array.from(currentDetectedClasses).filter(
                object => !lastSpokenObjects.has(object)
            );

            const lostObjects = Array.from(lastSpokenObjects).filter(
                object => !currentDetectedClasses.has(object)
            );

            let speechText = '';
            const langCode = selectedVoice ? selectedVoice.lang.split('-')[0] : 'en';

            if (newObjects.length > 0) {
                const last = newObjects.length > 1 ? ` and a ${newObjects.pop()}` : '';
                const comma = newObjects.length > 0 && last ? ', ' : '';
                speechText += `${getTranslation('i_see_a', langCode)} ${newObjects.join(comma + 'a ')}${last}.`;
            }

            if (lostObjects.length > 0) {
                if (speechText !== '') speechText += ' ';
                speechText += `${getTranslation('i_no_longer_see_a', langCode)} ${lostObjects.join(', ')}.`;
            }

            if (speechText !== '') {
                speakDetectedObjects(speechText);
                lastSpokenTime = currentTime;
            }
       
            lastSpokenObjects = currentDetectedClasses;
        }
    }

    animationFrameId = requestAnimationFrame(detectObjects);
}

async function askWhatIsBeingSeen() {
    if (lastDetectedPredictions.length > 0) {
        const detectedClasses = Array.from(new Set(lastDetectedPredictions.map(p => p.class)));
        const langCode = selectedVoice ? selectedVoice.lang.split('-')[0] : 'en';

        let speechText;
        const andPhrase = {
            en: ' and ',
            es: ' y ',
            pt: ' e ',
            ko: '과(와)',
            vi: ' và ',
            ja: 'と',
            zh: '和',
            fr: ' et ',
            de: ' und ',
            it: ' e ',
            ru: ' и ',
            af: ' en '
        }[langCode] || ' and ';
        
        let listString;
        if (detectedClasses.length === 1) {
            listString = detectedClasses[0];
            speechText = `${getTranslation('i_see_a', langCode)} ${listString}.`;
        } else {
            const last = detectedClasses.pop();
            listString = `${detectedClasses.join(', ')},${andPhrase}${last}`;
            speechText = `${getTranslation('i_see_many', langCode)} ${listString}.`;
        }
        
        await speakDetectedObjects(speechText);
    } else {
        const langCode = selectedVoice ? selectedVoice.lang.split('-')[0] : 'en';
        speechStatusDiv.textContent = getTranslation('no_objects_detected', langCode);
    }
}

async function switchCamera() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    const webcamReady = await setupWebcam(newFacingMode);

    if (webcamReady) {
        if (model) {
            lastDetectionTime = 0;
            lastDetectedPredictions = [];
            lastSpokenObjects = new Set();
            animationFrameId = requestAnimationFrame(detectObjects);
        } else {
            await loadModel();
            if (model) {
                lastDetectionTime = 0;
                lastDetectedPredictions = [];
                lastSpokenObjects = new Set();
                animationFrameId = requestAnimationFrame(detectObjects);
            }
        }
    }
}

function toggleAutoSpeak() {
    isAutoSpeakEnabled = !isAutoSpeakEnabled;
    toggleAutoSpeakButton.textContent = isAutoSpeakEnabled ? 'Disable Continuous Detection' : 'Enable Continuous Detection';
    if (isAutoSpeakEnabled) {
        speechStatusDiv.textContent = 'Continuous detection enabled.';
        lastSpokenTime = 0;
    } else {
        speechStatusDiv.textContent = '';
        window.speechSynthesis.cancel();
    }
}

// Add event listeners to buttons
switchCameraButton.addEventListener('click', switchCamera);
askButton.addEventListener('click', askWhatIsBeingSeen);
toggleAutoSpeakButton.addEventListener('click', toggleAutoSpeak);

// Event listener for the confidence slider
confidenceThresholdSlider.addEventListener('input', (event) => {
    minConfidence = parseFloat(event.target.value) / 100;
    confidenceValueSpan.textContent = `${event.target.value}%`;
});

// Startup function when the window has fully loaded
window.onload = async function() {
    const webcamReady = await setupWebcam('user');
    if (webcamReady) {
       
        await loadModel();
       
        if (model) {
            animationFrameId = requestAnimationFrame(detectObjects);
        }
    }
};

window.onbeforeunload = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
};
