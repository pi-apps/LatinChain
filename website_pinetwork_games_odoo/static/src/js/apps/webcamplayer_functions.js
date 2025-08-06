// Get DOM element references
const video = document.getElementById('webcam');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const errorDiv = document.getElementById('error');
const detectionList = document.getElementById('detectionList');
const switchCameraButton = document.getElementById('switchCameraButton');
const askButton = document.getElementById('askButton');
const toggleAutoSpeakButton = document.getElementById('toggleAutoSpeak'); // New button
const speechStatusDiv = document.getElementById('speechStatus');
const confidenceThresholdSlider = document.getElementById('confidenceThreshold');
const confidenceValueSpan = document.getElementById('confidenceValue');

let model = undefined;
let animationFrameId = null;
let currentFacingMode = 'user';

let lastDetectionTime = 0;
const detectionInterval = 100; // ms

let lastDetectedPredictions = [];
let minConfidence = parseFloat(confidenceThresholdSlider.value) / 100;

// --- New variables for continuous speech ---
let isAutoSpeakEnabled = false;
let lastSpokenObjects = new Set();
const autoSpeakInterval = 5000; // 5 seconds
let lastSpokenTime = 0;

// --- Variables and Functions for Voice Selection (Web Speech API) ---
let voicesLoaded = false;
let englishVoice = null;

function loadVoices() {
    if (voicesLoaded) return;

    if ('speechSynthesis' in window)
    {
        const voices = window.speechSynthesis.getVoices();
        englishVoice = voices.find(voice => voice.lang === 'en-US' && voice.localService) ||
                         voices.find(voice => voice.lang === 'en-US') ||
                         voices.find(voice => voice.lang.startsWith('en'));

        if (englishVoice) {
            console.log("English voice selected:", englishVoice.name);
        } else {
            console.warn("No suitable English voice found. Using default browser voice.");
        }
        voicesLoaded = true;
    }
}

if ('speechSynthesis' in window)
{
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

if ('speechSynthesis' in window)
{
    loadVoices();
}

async function speakDetectedObjects(textToSpeak) {
    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        speechStatusDiv.textContent = "Speaking...";
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 1;

        if (englishVoice) {
            utterance.voice = englishVoice;
        } else {
            loadVoices();
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
        }

        utterance.onend = () => {
            speechStatusDiv.textContent = `Last announcement: "${textToSpeak}"`;
        };
        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event.error);
            speechStatusDiv.textContent = "Error speaking.";
        };

        window.speechSynthesis.speak(utterance);
    } else {
        //speechStatusDiv.textContent = "Your browser does not support speech synthesis.";
        //console.warn("Web Speech API (SpeechSynthesis) not supported in this browser.");
        speechStatusDiv.textContent = `Last announcement: "${textToSpeak}"`;
    }
}

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

// Modified detection function
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
     
        // --- New logic for continuous speech ---
        if (isAutoSpeakEnabled && currentTime - lastSpokenTime > autoSpeakInterval) {
            // Find new objects that were not in the last spoken set
            const newObjects = Array.from(currentDetectedClasses).filter(
                object => !lastSpokenObjects.has(object)
            );

            // Find objects that are no longer in view
            const lostObjects = Array.from(lastSpokenObjects).filter(
                object => !currentDetectedClasses.has(object)
            );

            let speechText = '';
            if (newObjects.length > 0) {
                speechText += `I see a ${newObjects.join(', a ')}.`;
            }

            if (lostObjects.length > 0) {
                if (speechText !== '') speechText += ' ';
                speechText += `I no longer see a ${lostObjects.join(', a ')}.`;
            }

            if (speechText !== '') {
                speakDetectedObjects(speechText);
                lastSpokenTime = currentTime;
            }
       
            // Update the set of last spoken objects
            lastSpokenObjects = currentDetectedClasses;
        }
    }

    animationFrameId = requestAnimationFrame(detectObjects);
}

async function askWhatIsBeingSeen() {
    if (lastDetectedPredictions.length > 0) {
        const detectedClasses = new Set();
        lastDetectedPredictions.forEach(prediction => {
            detectedClasses.add(prediction.class);
        });

        const classNames = Array.from(detectedClasses);
        let speechText = "I'm watching ";

        if (classNames.length === 1) {
            speechText += `a ${classNames[0]}.`;
        } else if (classNames.length === 2) {
            speechText += `a ${classNames[0]} and a ${classNames[1]}.`;
        } else {
            const last = classNames.pop();
            speechText += `a ${classNames.join(', a ')}, and a ${last}.`;
        }
        await speakDetectedObjects(speechText);
    } else {
        speechStatusDiv.textContent = "No objects detected recently.";
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

// New function to toggle continuous speech
function toggleAutoSpeak() {
    isAutoSpeakEnabled = !isAutoSpeakEnabled;
    toggleAutoSpeakButton.textContent = isAutoSpeakEnabled ? 'Disable Continuous Speech' : 'Enable Continuous Speech';
    if (isAutoSpeakEnabled) {
        speechStatusDiv.textContent = 'Continuous speech enabled.';
        // Force a speech update immediately
        lastSpokenTime = 0;
    } else {
        speechStatusDiv.textContent = '';
        window.speechSynthesis.cancel(); // Stop any ongoing speech
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
