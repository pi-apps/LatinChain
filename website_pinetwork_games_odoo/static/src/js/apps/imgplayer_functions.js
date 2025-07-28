// Array of photo objects (initially empty)
let photos = [];
let currentPhotoIndex = 0; // Current photo index

// Get DOM element references
const photoDisplay = document.getElementById('photo-display');
const photoTitle = document.getElementById('photo-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const uploadInput = document.getElementById('upload-input');
const clearBtn = document.getElementById('clear-btn');
const noPhotoMessage = document.getElementById('no-photo-message');

// References to zoom modal elements
const zoomModal = document.getElementById('zoom-modal');
const zoomedImage = document.getElementById('zoomed-image');
const zoomCloseButton = document.getElementById('zoom-close-button');

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
        alert("12345");
        photoDisplay.src = ""; // Clear image
        photoDisplay.classList.add('hidden'); // Hide image
        noPhotoMessage.classList.remove('hidden'); // Show message
        photoTitle.textContent = "Upload your photos to get started.";
    } else {
        alert("123456");
        photoDisplay.classList.remove('hidden'); // Show image
        noPhotoMessage.classList.add('hidden'); // Hide message
        photoDisplay.src = photos[currentPhotoIndex].url;
        photoTitle.textContent = photos[currentPhotoIndex].title;

        // Handle image loading errors
        photoDisplay.onerror = () => {
            /*photoDisplay.src = "https://placehold.co/600x400/CCCCCC/666666?text=Error+loading+image";
            photoTitle.textContent = "Error loading image.";*/
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
                    
                    alert("loadedCount " + loadedCount);
                    alert("loadedCount " + loadedCount + " files.length " + files_length);

                    // If all photos from this upload have finished processing
                    if (loadedCount === files_length) {
                        alert("01234567");
                        // If there were no photos before, or it's the first upload, show the first of the new ones
                        if (initialPhotosCount === 0) {
                            alert("012301");
                            currentPhotoIndex = 0;
                        } else {
                            alert("012300");
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
    zoomModal.classList.add('active'); // Show the modal
}

/**
 * Closes the zoom modal.
 */
function closeZoomModal() {
    zoomModal.classList.remove('active'); // Hide the modal
    zoomedImage.src = ""; // Clear the image source from the modal
}

// Assign events to buttons
nextBtn.addEventListener('click', nextPhoto);
prevBtn.addEventListener('click', prevPhoto);
uploadInput.addEventListener('change', handleImageUpload);
clearBtn.addEventListener('click', clearPhotos);

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
document.addEventListener('DOMContentLoaded', displayPhoto);
