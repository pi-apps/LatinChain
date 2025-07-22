const videoPlayer = document.getElementById('videoPlayer');
const videoPlayerSection = document.getElementById('videoPlayerSection');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = playPauseBtn.querySelector('i');
const progressBarWrapper = document.getElementById('progressBarWrapper');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const muteBtn = document.getElementById('muteBtn');
const muteIcon = muteBtn.querySelector('i');
const volumeSlider = document.getElementById('volumeSlider');
const playbackSpeedSelect = document.getElementById('playbackSpeed');
const fullscreenBtn = document.getElementById('fullscreenBtn');

const singleVideoInput = document.getElementById('singleVideoInput');
const multiVideoInput = document.getElementById('multiVideoInput');
const videoInfo = document.getElementById('videoInfo');
const errorMessage = document.getElementById('errorMessage'); // Still get reference for potential future use, but hidden
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playlistElement = document.getElementById('playlist');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const playlistSearchInput = document.getElementById('playlistSearchInput'); // New search input
const clearSearchBtn = document.getElementById('clearSearchBtn'); // New clear search button

let playlist = []; // Stores File objects for the playlist
let currentVideoIndex = -1;
let isDragging = false;
let draggedItem = null;

// --- Utility Functions ---
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Modified to only log errors to console, not display on UI
function displayError(message) {
    console.error('Video Player Error:', message);
    // errorMessage.textContent = message; // Removed UI update
    // errorMessage.classList.remove('hidden'); // Removed UI update
}

// No longer needed as errors are not displayed on UI
function clearError() {
    // errorMessage.textContent = ''; // Removed UI update
    // errorMessage.classList.add('hidden'); // Ensure it stays hidden
}

// --- Playlist Management ---
function addVideoToPlaylist(file) {
    playlist.push(file);
    renderPlaylist();
    updateNavigationButtons();
    clearError(); // Still call to clear previous console errors
}

function removeVideoFromPlaylist(index) {
    if (index > -1 && index < playlist.length) {
        const wasPlaying = (currentVideoIndex === index);
        playlist.splice(index, 1);

        if (playlist.length === 0) {
            currentVideoIndex = -1;
            videoPlayer.src = '';
            videoInfo.textContent = 'No video loaded';
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        } else if (wasPlaying) {
            // If the currently playing video was removed, play the next one or the first one
            currentVideoIndex = Math.min(index, playlist.length - 1);
            loadVideo(playlist[currentVideoIndex]);
        } else if (index < currentVideoIndex) {
            // If a video before the current one was removed, adjust currentVideoIndex
            currentVideoIndex--;
        }
        renderPlaylist();
        updateNavigationButtons();
    }
}

function clearPlaylist() {
    if (playlist.length === 0) {
        return; // Do nothing if already empty
    }
    
    currentTimeDisplay.textContent = "00:00";
    durationDisplay.textContent = "00:00";
    const progress = 0;
    progressBar.style.width = `${progress}%`;

    playlist = []; // Empty the playlist array
    currentVideoIndex = -1; // Reset current video index
    videoPlayer.src = ''; // Clear video player source
    videoInfo.textContent = 'No video loaded'; // Update info text
    playPauseIcon.classList.remove('fa-pause'); // Reset play/pause icon
    playPauseIcon.classList.add('fa-play');
    renderPlaylist(); // Re-render the empty playlist
    updateNavigationButtons(); // Update button states
    clearError(); // Clear any existing errors
}

// Modified renderPlaylist to accept a filtered list
function renderPlaylist(filteredList = playlist) {
    playlistElement.innerHTML = ''; // Clear existing list
    if (filteredList.length === 0) {
        playlistElement.innerHTML = '<li class="text-slate-500 text-center py-3 md:py-4">No videos found.</li>';
        // If the original playlist is also empty, disable clear button
        if (playlist.length === 0) {
            clearPlaylistBtn.disabled = true;
        }
        return;
    }
    clearPlaylistBtn.disabled = false; // Enable clear button if playlist has items

    filteredList.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('playlist-item');
        // Find the original index of the file in the main playlist array
        const originalIndex = playlist.indexOf(file);
        if (originalIndex === currentVideoIndex) {
            listItem.classList.add('active');
        }
        listItem.dataset.index = originalIndex; // Use original index for drag/drop and playback
        listItem.draggable = true; // Make items draggable

        const itemName = document.createElement('span');
        itemName.classList.add('playlist-item-name');
        itemName.textContent = file.name;
        listItem.appendChild(itemName);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('playlist-item-remove');
        removeBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
        removeBtn.title = 'Remove from playlist';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent playing video when removing
            removeVideoFromPlaylist(originalIndex); // Remove using original index
        });
        listItem.appendChild(removeBtn);

        listItem.addEventListener('click', () => {
            if (!isDragging) { // Only play if not currently dragging
                currentVideoIndex = originalIndex; // Play using original index
                loadVideo(playlist[currentVideoIndex]);
                renderPlaylist(); // Re-render to update active class
                updateNavigationButtons();
            }
        });

        // Drag and Drop listeners
        listItem.addEventListener('dragstart', (e) => {
            isDragging = true;
            draggedItem = listItem;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', originalIndex); // Store original index for reordering
            setTimeout(() => listItem.classList.add('dragging'), 0); // Add class after drag starts
        });

        listItem.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            const boundingBox = listItem.getBoundingClientRect();
            const offset = e.clientY - boundingBox.top;
            if (offset < boundingBox.height / 2) {
                listItem.classList.remove('insert-after');
                listItem.classList.add('insert-before');
            } else {
                listItem.classList.remove('insert-before');
                listItem.classList.add('insert-after');
            }
        });

        listItem.addEventListener('dragleave', () => {
            listItem.classList.remove('insert-before', 'insert-after');
        });

        listItem.addEventListener('drop', (e) => {
            e.preventDefault();
            listItem.classList.remove('insert-before', 'insert-after');

            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = parseInt(listItem.dataset.index);

            if (fromIndex !== toIndex) {
                const [movedItem] = playlist.splice(fromIndex, 1);
                playlist.splice(toIndex, 0, movedItem);

                // Adjust currentVideoIndex if the playing video was moved
                if (currentVideoIndex === fromIndex) {
                    currentVideoIndex = toIndex;
                } else if (currentVideoIndex > fromIndex && currentVideoIndex <= toIndex) {
                    currentVideoIndex--;
                } else if (currentVideoIndex < fromIndex && currentVideoIndex >= toIndex) {
                    currentVideoIndex++;
                }

                renderPlaylist(); // Re-render the full playlist after reordering
                updateNavigationButtons();
            }
        });

        listItem.addEventListener('dragend', () => {
            isDragging = false;
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            // Clean up any lingering insert classes
            document.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('insert-before', 'insert-after');
            });
        });

        playlistElement.appendChild(listItem);
    });
}

// --- Video Player Core Logic ---
function loadVideo(file) {
    clearError();
    if (file) {
        const fileURL = URL.createObjectURL(file);
        videoPlayer.src = fileURL;
        videoPlayer.load(); // Load the new video source
        videoPlayer.play().catch(e => {
            displayError('Error playing video: ' + e.message + '. Format might not be supported, or browser autoplay restrictions are active.');
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        });
        videoInfo.textContent = `Playing: ${file.name}`;
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        videoPlayer.src = '';
        videoInfo.textContent = 'No video loaded';
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
}

function updateNavigationButtons() {
    prevBtn.disabled = currentVideoIndex <= 0 || playlist.length === 0;
    nextBtn.disabled = currentVideoIndex >= playlist.length - 1 || playlist.length === 0;
    clearPlaylistBtn.disabled = playlist.length === 0; // Also update clear button state here
}

// --- Event Listeners ---

// File Inputs
singleVideoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
        addVideoToPlaylist(file);
        currentVideoIndex = playlist.length - 1; // Play the newly added video
        loadVideo(playlist[currentVideoIndex]);
        renderPlaylist();
    } else {
        displayError('Please select a valid video file.');
    }
    event.target.value = null; // Clear input for next selection
});

// Event listener for the new multi-file input
multiVideoInput.addEventListener('change', (event) => {
    const files = event.target.files;
    let videosFound = 0;
    if (files.length > 0) {
        // Convert FileList to array, filter, and sort
        const newVideos = Array.from(files).filter(file => file.type.startsWith('video/'));
        newVideos.sort((a, b) => a.name.localeCompare(b.name));

        newVideos.forEach(file => {
            addVideoToPlaylist(file);
            videosFound++;
        });

        if (videosFound > 0) {
            if (currentVideoIndex === -1) { // If playlist was empty, start playing the first added video
                currentVideoIndex = 0;
                loadVideo(playlist[currentVideoIndex]);
            }
            renderPlaylist();
        } else {
            displayError('No valid video files found.');
        }
    } else {
        displayError('No files selected.');
    }
    event.target.value = null; // Clear input for next selection
});

// Custom Video Controls
playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.play().catch(e => {
            displayError('Error playing: ' + e.message);
        });
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        videoPlayer.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
});

videoPlayer.addEventListener('play', () => {
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
});

videoPlayer.addEventListener('pause', () => {
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
});

videoPlayer.addEventListener('timeupdate', () => {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;

    currentTimeDisplay.textContent = formatTime(currentTime);
    if (!isNaN(duration)) {
        durationDisplay.textContent = formatTime(duration);
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

videoPlayer.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(videoPlayer.duration);
    volumeSlider.value = videoPlayer.volume; // Set slider to current volume
    muteIcon.classList.toggle('fa-volume-mute', videoPlayer.muted);
    muteIcon.classList.toggle('fa-volume-up', !videoPlayer.muted);
    // Set initial playback speed select value
    // Ensure the value exists in the options, otherwise default to 1x
    const rate = videoPlayer.playbackRate.toString();
    if (Array.from(playbackSpeedSelect.options).some(option => option.value === rate)) {
        playbackSpeedSelect.value = rate;
    } else {
        playbackSpeedSelect.value = '1'; // Default to 1x if current rate is not in options
    }
});

// New event listener for 'ratechange' to update the select box
videoPlayer.addEventListener('ratechange', () => {
    // Ensure the value exists in the options, otherwise default to 1x
    const rate = videoPlayer.playbackRate.toString();
    if (Array.from(playbackSpeedSelect.options).some(option => option.value === rate)) {
        playbackSpeedSelect.value = rate;
    } else {
        playbackSpeedSelect.value = '1'; // Default to 1x if current rate is not in options
    }
});

progressBarWrapper.addEventListener('click', (e) => {
    const rect = progressBarWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    videoPlayer.currentTime = videoPlayer.duration * percent;
});

muteBtn.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    muteIcon.classList.toggle('fa-volume-mute', videoPlayer.muted);
    muteIcon.classList.toggle('fa-volume-up', !videoPlayer.muted);
});

volumeSlider.addEventListener('input', () => {
    videoPlayer.volume = volumeSlider.value;
    videoPlayer.muted = (volumeSlider.value == 0); // Mute if volume is 0
    muteIcon.classList.toggle('fa-volume-mute', videoPlayer.muted);
    muteIcon.classList.toggle('fa-volume-up', !videoPlayer.muted);
});

playbackSpeedSelect.addEventListener('change', () => {
    videoPlayer.playbackRate = parseFloat(playbackSpeedSelect.value);
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        videoPlayerSection.requestFullscreen().catch(err => {
            displayError(`Error trying to enter fullscreen: ${err.message} (Your browser might not allow it without direct user interaction or due to security restrictions).`);
        });
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.querySelector('i').classList.remove('fa-expand');
        fullscreenBtn.querySelector('i').classList.add('fa-compress');
        videoPlayerSection.classList.add('fullscreen');
    } else {
        fullscreenBtn.querySelector('i').classList.remove('fa-compress');
        fullscreenBtn.querySelector('i').classList.add('fa-expand');
        videoPlayerSection.classList.remove('fullscreen');
    }
});

// Playlist Navigation Buttons
prevBtn.addEventListener('click', () => {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        loadVideo(playlist[currentVideoIndex]);
        renderPlaylist();
        updateNavigationButtons();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentVideoIndex < playlist.length - 1) {
        currentVideoIndex++;
        loadVideo(playlist[currentVideoIndex]);
        renderPlaylist();
        updateNavigationButtons();
    } else {
        videoInfo.textContent = 'End of playlist.';
        videoPlayer.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
});

// Event listener for the new "Clear Playlist" button
clearPlaylistBtn.addEventListener('click', clearPlaylist);

// Video ended event
videoPlayer.addEventListener('ended', () => {
    if (currentVideoIndex < playlist.length - 1) {
        currentVideoIndex++;
        loadVideo(playlist[currentVideoIndex]);
        renderPlaylist();
    } else {
        videoInfo.textContent = 'End of playlist.';
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        videoPlayer.pause();
    }
    updateNavigationButtons();
});

// --- Search Functionality ---
playlistSearchInput.addEventListener('input', () => {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    if (searchTerm) {
        const filtered = playlist.filter(file => file.name.toLowerCase().includes(searchTerm));
        renderPlaylist(filtered);
        clearSearchBtn.classList.remove('hidden');
    } else {
        renderPlaylist(playlist); // Show full playlist if search term is empty
        clearSearchBtn.classList.add('hidden');
    }
});

clearSearchBtn.addEventListener('click', () => {
    playlistSearchInput.value = '';
    renderPlaylist(playlist);
    clearSearchBtn.classList.add('hidden');
});


// Initial render and button state
renderPlaylist();
updateNavigationButtons();
