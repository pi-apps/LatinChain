// Array of photo objects (initially empty)
let photos = [];
let currentPhotoIndex = 0; // Current photo index
let ocrWorker = null; // Tesseract.js worker instance

// Get DOM element references
const photoDisplay = document.getElementById('photo-display');
const photoTitle = document.getElementById('photo-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const uploadInput = document.getElementById('upload-input');
const clearBtn = document.getElementById('clear-btn');
const textrecognitionBtn = document.getElementById('textrecognition-btn');
const noPhotoMessage = document.getElementById('no-photo-message');

// References to text recognition elements
const recognizedTextElement = document.getElementById('recognized-text');
const ocrLoadingElement = document.getElementById('ocr-loading');

// References to zoom modal elements
const zoomModal = document.getElementById('zoom-modal');
const zoomedImage = document.getElementById('zoomed-image');
const zoomCloseButton = document.getElementById('zoom-close-button');

const selectElement = document.getElementById('language-select');
const outputDiv = document.getElementById('output');
const codesParagraph = document.getElementById('language-codes');

/**
 * Recognizes text from the current image and updates the UI.
 */
async function recognizeText() {
    if (photos.length === 0) {
        recognizedTextElement.textContent = '';
        return;
    }

    // Show loading state
    recognizedTextElement.classList.add('hidden');
    ocrLoadingElement.classList.remove('hidden');

    try {
        const selectedOptions = Array.from(selectElement.selectedOptions);
        const languageCodes = selectedOptions.map(option => option.value);
        
        if (languageCodes.length > 0) {
            // Create a comma-separated string of language codes
            const languageString = languageCodes.join('+');
            codesParagraph.textContent = languageString;
            outputDiv.classList.remove('hidden');

            if(ocrWorker)
                await ocrWorker.terminate();
             
            ocrWorker = await Tesseract.createWorker(languageString,
                1, 
                {
                    logger: m => {
                        // Optional: Log Tesseract.js progress
                        // console.log(m);
                    },
                    // Use a worker path to ensure compatibility and correct loading
                    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
                    //preserve_interword_spaces: '1'
                }
            );

            // You can set parameters here. `preserve_interword_spaces` is a Tesseract parameter.
            // Note: Some parameters might not be directly available in `createWorker` and
            // are better set using `setParameters`.
            await ocrWorker.setParameters({
                preserve_word_spaces: '1' // Note: The parameter name is usually `preserve_word_spaces`
            });

            // Recognize text from the current photo's URL
            const { data: { text } } = await ocrWorker.recognize(photos[currentPhotoIndex].url);
             
            // Update the UI with the recognized text
            recognizedTextElement.textContent = text.trim() || "No text found.";
             
            await ocrWorker.terminate();
        }
    } catch (error) {
        console.error("Tesseract.js OCR failed:", error);
        recognizedTextElement.textContent = "Waiting for image.";
    } finally {
        // Hide loading state and show the result
        ocrLoadingElement.classList.add('hidden');
        recognizedTextElement.classList.remove('hidden');
    }
}


/**
 * Saves the selected language codes to local storage.
 */
function saveLanguagesToLocalStorage() {
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const languageCodes = selectedOptions.map(option => option.value);
    localStorage.setItem('selectedLanguages', JSON.stringify(languageCodes));
    detectLanguages(); // Update the UI display after saving
}

/**
 * Loads the selected language codes from local storage and updates the UI.
 */
function loadLanguagesFromLocalStorage() {
    const savedLanguages = localStorage.getItem('selectedLanguages');
    if (savedLanguages) {
        const languageCodes = JSON.parse(savedLanguages);
        // Deselect all options first
        Array.from(selectElement.options).forEach(option => {
            option.selected = false;
        });
        // Then select the saved ones
        languageCodes.forEach(code => {
            const option = selectElement.querySelector(`option[value="${code}"]`);
            if (option) {
                option.selected = true;
            }
        });
    }
    detectLanguages(); // Update the UI display with the loaded languages
}

/**
 * Detects languages and displays them.
 */
async function detectLanguages() {
    // Create a comma-separated string of language codes
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const languageCodes = selectedOptions.map(option => option.value);
     
    if (languageCodes.length > 0) {
        const languageString = languageCodes.join('+');
        codesParagraph.textContent = languageString;
        outputDiv.classList.remove('hidden');
    } else {
        codesParagraph.textContent = "";
        outputDiv.classList.add('hidden');
    }
}

/**
 * Updates the state of navigation buttons (enabled/disabled).
 */
function updateNavigationButtons() {
    const hasPhotos = photos.length > 0;
    prevBtn.disabled = !hasPhotos;
    nextBtn.disabled = !hasPhotos;
    clearBtn.disabled = !hasPhotos; // Disable clear button if no photos
    // Only allow clicking on the main image if photos are loaded
    photoDisplay.style.cursor = hasPhotos ? 'zoom-in' : 'default';
}

/**
 * Displays the current photo in the viewer or a message if no photos.
 */
function displayPhoto() {
    if (photos.length === 0) {
        photoDisplay.src = ""; // Clear image
        photoDisplay.classList.add('hidden'); // Hide image
        noPhotoMessage.classList.remove('hidden'); // Show message
        photoTitle.textContent = "Upload your photos to get started.";
        recognizedTextElement.textContent = "";
        recognizedTextElement.classList.remove('hidden');
        ocrLoadingElement.classList.add('hidden');
    } else {
        photoDisplay.classList.remove('hidden'); // Show image
        noPhotoMessage.classList.add('hidden'); // Hide message
        photoDisplay.src = photos[currentPhotoIndex].url;
        photoTitle.textContent = photos[currentPhotoIndex].title;

        // Immediately start text recognition for the new photo
        recognizeText();

        // Handle image loading errors
        photoDisplay.onerror = () => {
             // In case of an image loading error, we'll display a placeholder
            photoDisplay.src = `https://placehold.co/600x400/CCCCCC/666666?text=Waiting+to+load+image`;
            photoTitle.textContent = "Waiting to load image.";
            recognizedTextElement.textContent = "Text recognition skipped.";
            recognizedTextElement.classList.remove('hidden');
            ocrLoadingElement.classList.add('hidden');
        };
    }
    updateNavigationButtons(); // Update button state
}

/**
 * Advances to the next photo.
 * If it's the last photo, loops back to the beginning.
 */
function nextPhoto() {
    if (photos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    displayPhoto();
}

/**
 * Goes back to the previous photo.
 * If it's the first photo, loops to the end.
 */
function prevPhoto() {
    if (photos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    displayPhoto();
}

/**
 * Handles image file uploads from the input.
 * Allows multiple file uploads and adds them to the existing gallery.
 */
function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const initialPhotosCount = photos.length; // Number of photos before upload
        let loadedCount = 0; // Counter for photos loaded in this session

        var files_length = files.length;
        for (let i = 0; i < files_length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    photos.push({
                        url: e.target.result,
                        title: `Uploaded Photo (${file.name})`
                    });
                    loadedCount++;

                    // If all photos from this upload have finished processing
                    if (loadedCount === files_length) {
                        // If there were no photos before, or it's the first upload, show the first of the new ones
                        if (initialPhotosCount === 0) {
                            currentPhotoIndex = 0;
                        } else {
                            // If there were already photos, show the first of the newly added ones
                            currentPhotoIndex = initialPhotosCount;
                        }
                        displayPhoto();
                    }
                };
                reader.readAsDataURL(file);
            } else {
                console.warn(`File is not an image and was ignored: ${file.name}`);
            }
        }
        // Clear the input value to allow uploading the same files again
        event.target.value = '';
    }
}

/**
 * Clears all loaded photos from the gallery.
 */
function clearPhotos() {
    photos = []; // Empty the photos array
    currentPhotoIndex = 0; // Reset the index
    displayPhoto(); // Update the viewer to show the empty state
}

/**
 * Opens the zoom modal with the current image.
 */
function openZoomModal() {
    if (photos.length === 0) return; // Don't open if no photos
    zoomedImage.src = photoDisplay.src; // Set the image source in the modal
    zoomedImage.classList.remove('hidden'); // Hide image
    zoomModal.classList.add('active'); // Show the modal
}

/**
 * Closes the zoom modal.
 */
function closeZoomModal() {
    zoomModal.classList.remove('active'); // Hide the modal
    zoomedImage.classList.add('hidden'); // Hide image
    zoomedImage.src = ""; // Clear the image source from the modal
}

// Assign events to buttons
nextBtn.addEventListener('click', nextPhoto);
prevBtn.addEventListener('click', prevPhoto);
uploadInput.addEventListener('change', handleImageUpload);
clearBtn.addEventListener('click', clearPhotos);
textrecognitionBtn.addEventListener('click', recognizeText);

// Call the save function whenever the selection changes
selectElement.addEventListener('change', saveLanguagesToLocalStorage);

// New: Assign click event to the main image to open zoom
photoDisplay.addEventListener('click', openZoomModal);
// New: Assign click event to the modal close button
zoomCloseButton.addEventListener('click', closeZoomModal);
// New: Close modal if clicked outside the image (on the modal background)
zoomModal.addEventListener('click', (e) => {
    if (e.target === zoomModal) { // Only if the click is directly on the modal background
        closeZoomModal();
    }
});


// Display initial state on page load (no photos)
document.addEventListener('DOMContentLoaded', () => {
    // Load languages from local storage before displaying anything
    loadLanguagesFromLocalStorage();
    displayPhoto();
});
