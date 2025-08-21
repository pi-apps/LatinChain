document.addEventListener('DOMContentLoaded', () => {
    // References to DOM elements
    const articleText = document.getElementById('articleText');
    const fileInput = document.getElementById('fileInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const messageBox = document.getElementById('messageBox');
    const charCount = document.getElementById('charCount');
    const charLimitMessage = document.getElementById('charLimitMessage');
    const trimBtn = document.getElementById('trimBtn');
    
    // Define a max character limit to prevent browser issues
    const MAX_CHAR_LIMIT = 4000;
    
    // Function to update the character counter
    function updateCharCounter() {
        const length = articleText.value.length;
        charCount.textContent = length;
        if (length > MAX_CHAR_LIMIT) {
            charLimitMessage.classList.remove('hidden');
            playBtn.disabled = true;
            playBtn.classList.add('opacity-50', 'cursor-not-allowed');
            trimBtn.classList.remove('hidden');
        } else {
            charLimitMessage.classList.add('hidden');
            playBtn.disabled = false;
            playBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            trimBtn.classList.add('hidden');
        }
    }
    
    // Add an input event listener to the textarea for character counting
    articleText.addEventListener('input', updateCharCounter);
    updateCharCounter(); // Initial count

    // Load text from a file
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        messageBox.textContent = 'Loading file...';
        articleText.value = '';

        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                articleText.value = event.target.result;
                messageBox.textContent = '.txt file loaded successfully.';
                updateCharCounter();
            };
            reader.onerror = () => {
                messageBox.textContent = 'Error reading the file.';
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                
                const pdfjsLib = window['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

                const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let textContent = '';
                
                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map(item => item.str).join(' ') + '\n\n';
                }
                
                articleText.value = textContent;
                messageBox.textContent = '.pdf file loaded successfully.';
                updateCharCounter();
            } catch (error) {
                messageBox.textContent = 'Error processing the PDF file.';
                console.error('Error processing PDF:', error);
            }
        } else {
            messageBox.textContent = 'Unsupported file format. Please upload a .txt or .pdf file.';
        }
    });
    
    // Event listener for the new trim button
    trimBtn.addEventListener('click', () => {
        articleText.value = articleText.value.substring(0, MAX_CHAR_LIMIT);
        updateCharCounter();
        messageBox.textContent = 'Text trimmed to 4000 characters.';
    });

    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance();
        let voices = [];

        // Function to fill the voice selector and restore last selection
        function populateVoiceList() {
            voices = window.speechSynthesis.getVoices().sort((a, b) => {
                const aname = a.name.toUpperCase();
                const bname = b.name.toUpperCase();
                if (aname < bname) return -1;
                if (aname > bname) return 1;
                return 0;
            });
            voiceSelect.innerHTML = '<option value="" disabled selected>Select a voice</option>';
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.textContent = `${voice.name} (${voice.lang})`;
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                voiceSelect.appendChild(option);
            });

            // Restore the last selected voice from localStorage
            const lastVoiceName = localStorage.getItem('lastVoiceName');
            if (lastVoiceName) {
                const savedVoiceOption = [...voiceSelect.options].find(option => option.dataset.name === lastVoiceName);
                if (savedVoiceOption) {
                    savedVoiceOption.selected = true;
                }
            }
        }
        
        // Cargar la lista de voces solo cuando esté disponible
        if (window.speechSynthesis.getVoices().length > 0) {
            populateVoiceList();
        } else {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        // Save the selected voice to localStorage
        voiceSelect.addEventListener('change', () => {
            const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
            localStorage.setItem('lastVoiceName', selectedVoiceName);
        });

        // Play event listener
        playBtn.addEventListener('click', () => {
            if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
                // If playback is paused, resume it.
                window.speechSynthesis.resume();
                messageBox.textContent = 'Resuming playback...';
            } else if (articleText.value.trim() !== '') {
                // If not speaking, start a new playback.
                window.speechSynthesis.cancel(); // Cancel any previous utterance to start fresh.
                speech.text = articleText.value;
                const selectedOption = voiceSelect.selectedOptions[0];
                
                if (selectedOption) {
                    const selectedVoiceName = selectedOption.getAttribute('data-name');
                    const selectedVoiceLang = selectedOption.getAttribute('data-lang');
                    
                    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
                    
                    if (selectedVoice) {
                        speech.voice = selectedVoice;
                        speech.lang = selectedVoiceLang;
                        window.speechSynthesis.speak(speech);
                        messageBox.textContent = 'Playing...';
                    } else {
                        messageBox.textContent = 'Please select a valid voice.';
                    }
                } else {
                    messageBox.textContent = 'Please select a voice.';
                }
            } else {
                messageBox.textContent = 'Please enter some text to play.';
            }
        });

        // Pause event listener
        pauseBtn.addEventListener('click', () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                messageBox.textContent = 'Playback paused.';
            } else {
                messageBox.textContent = 'Nothing is currently playing to pause.';
            }
        });

        // Stop event listener
        stopBtn.addEventListener('click', () => {
            window.speechSynthesis.cancel();
            messageBox.textContent = 'Playback stopped.';
        });

        // Event when playback ends
        speech.onend = () => {
            messageBox.textContent = 'Playback finished.';
        };

        // Error event
        speech.onerror = (event) => {
            messageBox.textContent = 'Error in speech synthesis: ' + event.error;
        };

    } else {
        // Message if the API is not available
        messageBox.textContent = 'Sorry, your browser does not support the Text-to-Speech API.';
        //[playBtn, pauseBtn, stopBtn, fileInput, voiceSelect].forEach(el => el.disabled = true);
        [playBtn, pauseBtn, stopBtn, voiceSelect].forEach(el => el.disabled = true);
    }
});

window.onbeforeunload = () => {
    is_changing_page = true;
    observer1.disconnect();
    if ('speechSynthesis' in window)
    {
        window.speechSynthesis.cancel();
    }
};
