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

const getTranslationValue = (Lang, phraseKey) => {
    // --- Pre-translated phrases for various languages ---
    const translatedPhrases = {
        'en': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'es': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'pt': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'ko': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'vi': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'ja': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'zh': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'fr': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'de': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'it': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'ru': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        },
        'af': {
            'i_see_a': "I see a",
            'i_see_many': "I see a ",
            'i_no_longer_see_a': "I no longer see a",
            'no_objects_detected': "No objects detected recently.",
            'and': " and ",
        }
    };
    
    // Return the translation for the current language and phrase key
    return translatedPhrases[Lang]?.[phraseKey] || '';
};

const languages = ['en', 'es', 'pt', 'ko', 'vi', 'ja', 'zh', 'fr', 'de', 'it', 'ru', 'af'];

/*const andPhrase = {
    en: getTranslationValue("and"),
    es: getTranslationValue("and"),
    pt: getTranslationValue("and"),
    ko: getTranslationValue("and"),
    vi: getTranslationValue("and"),
    ja: getTranslationValue("and"),
    zh: getTranslationValue("and"),
    fr: getTranslationValue("and"),
    de: getTranslationValue("and"),
    it: getTranslationValue("and"),
    ru: getTranslationValue("and"),
    af: getTranslationValue("and")
};*/

/**
 * A helper function to get the correct translated phrase.
 * Falls back to English if the language is not found.
 * @param {string} key The key for the phrase (e.g., 'i_see_a').
 * @param {string} langCode The language code (e.g., 'es').
 * @returns {string} The translated phrase.
 */
function getTranslation(key, langCode) {
    const shortLangCode = langCode.split(/[-_]/)[0];
    return getTranslationValue('en', key) || getTranslationValue('en', key);
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
    console.log("All available voices:", allVoices); // Log all voices for debugging
    
    const supportedShortLangs = [
        'en', 'es', 'pt', 'ko', 'vi', 'ja', 'zh', 'fr', 'de', 'it', 'ru', 'af'
    ];

    // Filter voices by checking if their language code starts with any of the supported short codes
    /*const filteredVoices = allVoices.filter(voice => {
        const shortLang = voice.lang.split(/[-_]/)[0];
        return supportedShortLangs.includes(shortLang);
    });*/
    
    const filteredVoices = allVoices;
    
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

        var savedLanguage1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/)[0];
        
        // If a language was found, set the URL hash to load it automatically.
        // This is still needed to trigger the initial translation on page load.
        if (voice.lang.startsWith(savedLanguage1) && !defaultVoice) {
            defaultVoice = voice;
        }
    });
    
    filteredVoices.forEach(voice => {
        // If a language was found, set the URL hash to load it automatically.
        // This is still needed to trigger the initial translation on page load.
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

/*checkLang = () => {
    var lang = window.document.documentElement.getAttribute('lang').split(/[-_]/)[0];
    
    if(lang)
    {
        if(window.location.pathname.substring(0, 3) == "/es" && lang != "es")
        {
            localStorage.setItem('lastTranslateLanguage', lang);
        }else if(location.pathname.substring(0, 3) != "/es" && lang != "en")
        {
            localStorage.setItem('lastTranslateLanguage', lang);
        }else if(window.location.pathname.substring(0, 3) == "/es" && lang == "es"){
            localStorage.setItem('lastTranslateLanguage', "es");
        }else if(window.location.pathname.substring(0, 3) != "/es" && lang == "en"){
            localStorage.setItem('lastTranslateLanguage', "en");
        }
    }
    loadLang();
};*/

loadLang = () => {
    if(!is_changing_page)
    {
        var lang1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/);
        var savedLanguage1 = lang1[0];
        try{
            if(lang1[1])
                savedLanguage1 += "-" + lang1[1];
        }catch(e){
        }
        
        // If a language was found, set the URL hash to load it automatically.
        // This is still needed to trigger the initial translation on page load.
        if (savedLanguage1) {
            var original_lang = "en";
            if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 != "es")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 != "en")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 == "es")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 == "en")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 == "auto")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(es|es)`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 == "auto")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(en|en)`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }
            
            voiceSelect.innerHTML = "";
            if ('speechSynthesis' in window) {
                populateVoiceList();
            }
        }
    }
};

/**
 * Speaks the given text using the currently selected voice and language.
 * @param {string} textToSpeak The text to be spoken.
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
            const langCode = selectedVoice ? selectedVoice.lang.split(/[-_]/)[0] : 'en';

            if (newObjects.length > 0) {
                const last = newObjects.length > 1 ? `${getTranslation('and', langCode) || ' and '}a ${newObjects.pop()}` : '';
                const comma = newObjects.length > 0 && last ? ', ' : '';
                speechText += `${getTranslation('i_see_a', langCode)} ${newObjects.join(comma + 'a ')}${last}.`;
            }

            if (lostObjects.length > 0) {
                if (speechText !== '') speechText += ' ';
                speechText += `${getTranslation('i_no_longer_see_a', langCode)} ${lostObjects.join(', ')}.`;
            }
            
            $(".whole-phrase").text(speechText);
            await delayAsync(3000);
            speechText = $(".whole-phrase").text();

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
        const langCode = selectedVoice ? selectedVoice.lang.split(/[-_]/)[0] : 'en';

        let speechText;
        const andPhraseText = getTranslation('and', langCode) || ' and ';
        
        let listString;
        if (detectedClasses.length === 1) {
            listString = detectedClasses[0];
            speechText = `${getTranslation('i_see_a', langCode)} ${listString}.`;
        } else {
            const last = detectedClasses.pop();
            listString = `${detectedClasses.join(', ')}${andPhraseText}${last}`;
            speechText = `${getTranslation('i_see_many', langCode)} ${listString}.`;
        }
        
        $(".whole-phrase").text(speechText);
        await delayAsync(3000);
        speechText = $(".whole-phrase").text();
        
        await speakDetectedObjects(speechText);
    } else {
        const langCode = selectedVoice ? selectedVoice.lang.split(/[-_]/)[0] : 'en';
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

/*
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
};*/

async function load_function()
{
    // Add event listeners to buttons
    switchCameraButton.addEventListener('click', switchCamera);
    askButton.addEventListener('click', askWhatIsBeingSeen);
    toggleAutoSpeakButton.addEventListener('click', toggleAutoSpeak);

    // Event listener for the confidence slider
    confidenceThresholdSlider.addEventListener('input', (event) => {
        minConfidence = parseFloat(event.target.value) / 100;
        confidenceValueSpan.textContent = `${event.target.value}%`;
    });
    
    const webcamReady = await setupWebcam('user');
    if (webcamReady) {
       
        await loadModel();
       
        if (model) {
            animationFrameId = requestAnimationFrame(detectObjects);
        }
    }
}

document.addEventListener('DOMContentLoaded', load_function);

window.onbeforeunload = () => {
    is_changing_page = true;
    observer1.disconnect();
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    if ('speechSynthesis' in window)
    {
        window.speechSynthesis.cancel();
    }
};

/*googleTranslateElementInit = () => {
    var lang_google='en';
    
    new google.translate.TranslateElement({pageLanguage: lang_google,
                                        autoDisplay: true,
                                        multilanguagePage: false,
                                        layout: google.translate.TranslateElement.InlineLayout.VERTICAL}, 
                                        'google_translate_element');

    //const el = document.querySelector('#goog-gt-');
    //const el2 = document.querySelector('.skiptranslate');
    const el3 = document.querySelector('circle');
    //const el4 = document.querySelector('.goog-te-gadget');
    const observer = new window.IntersectionObserver(([entry]) => {
        document.getElementsByTagName("circle")[0].parentNode.parentNode.style.display = "none";
    }, {
        root: null,
        threshold: 0.1, // set offset 0.1 means trigger if atleast 10% of element in viewport
    });

    //observer.observe(el);
    //observer.observe(el2);
    observer.observe(el3);
    //observer.observe(el4);
};*/
