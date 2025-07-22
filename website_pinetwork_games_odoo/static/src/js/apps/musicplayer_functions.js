// Get references to DOM elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongTime = document.getElementById('current-song-time');
const albumArt = document.getElementById('album-art');
const playlistElement = document.getElementById('playlist');
const fileInput = document.getElementById('file-input');
const folderInput = document.getElementById('folder-input');
const selectFileBtn = document.getElementById('select-file-btn');
const selectFolderBtn = document.getElementById('select-folder-btn');
const clearPlaylistBtn = document.getElementById('clear-playlist-btn');
const playlistSearchInput = document.getElementById('playlist-search-input'); // New search input

// Volume icons
const volumeIconLow = document.getElementById('volume-icon-low');
const volumeIconMedium = document.getElementById('volume-icon-medium');
const volumeIconHigh = document.getElementById('volume-icon-high');

// Repeat one indicator
const repeatOneIndicator = repeatBtn.querySelector('#repeat-one-indicator');


// Global state variables
let playlist = []; // Array to store audio files
let currentSongIndex = -1; // Index of the currently playing song
let isPlaying = false; // Playback status
let isShuffle = false; // Shuffle mode status
let repeatMode = 0; // 0: No repeat, 1: Repeat all, 2: Repeat one

// --- Utility Functions ---

/**
 * Formats time in seconds to MM:SS format.
 * @param {number} seconds - The time in seconds.
 * @returns {string} Formatted time string.
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * Updates the play/pause button icon based on playback state.
 */
function updatePlayPauseIcon() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

/**
 * Updates the repeat button icon/style based on repeat mode.
 */
function updateRepeatButton() {
    // Reset styling for all icons
    shuffleBtn.classList.remove('text-blue-400', 'font-bold');
    repeatBtn.classList.remove('text-blue-400', 'font-bold');
    repeatOneIndicator.classList.add('hidden'); // Hide repeat one indicator by default

    if (isShuffle) {
        shuffleBtn.classList.add('text-blue-400', 'font-bold');
    }

    if (repeatMode === 1) { // Repeat all
        repeatBtn.classList.add('text-blue-400', 'font-bold');
    } else if (repeatMode === 2) { // Repeat one
        repeatBtn.classList.add('text-blue-400', 'font-bold');
        repeatOneIndicator.classList.remove('hidden'); // Show repeat one indicator
    }
}

/**
 * Updates the volume icon based on the current volume level.
 */
function updateVolumeIcon() {
    const volume = audioPlayer.volume;
    volumeIconLow.classList.add('hidden');
    volumeIconMedium.classList.add('hidden');
    volumeIconHigh.classList.add('hidden');

    if (volume === 0) {
        volumeIconLow.classList.remove('hidden'); // Mute icon
    } else if (volume > 0 && volume <= 0.5) {
        volumeIconMedium.classList.remove('hidden'); // Medium volume icon
    } else {
        volumeIconHigh.classList.remove('hidden'); // High volume icon
    }
}

// --- Core Player Functions ---

/**
 * Handles the 'canplaythrough' event, starting playback if intended.
 */
function handleCanPlayThrough() {
    if (isPlaying) {
        audioPlayer.play().catch(e => console.error("Error playing audio after canplaythrough:", e));
    }
    // Remove the event listener once it's triggered to prevent multiple calls
    audioPlayer.removeEventListener('canplaythrough', handleCanPlayThrough);
}

/**
 * Loads a song into the audio player and updates UI.
 * @param {number} index - The index of the song in the playlist.
 */
function loadSong(index) {
    if (index < 0 || index >= playlist.length) {
        console.error("Invalid song index.");
        return false;
    }

    currentSongIndex = index;
    const song = playlist[currentSongIndex];

    // Set the audio source and add the 'canplaythrough' listener
    audioPlayer.src = URL.createObjectURL(song);
    audioPlayer.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

    currentSongTitle.textContent = song.name;
    albumArt.src = "https://latin-chain.com/website_pinetwork_games_odoo/static/src/img/latin-chain-logo.jpeg"; // Reset album art
    progressBar.value = 0;
    currentSongTime.textContent = '0:00 / 0:00';

    // Highlight current song in playlist
    document.querySelectorAll('#playlist li').forEach((item, idx) => {
        if (idx === currentSongIndex) {
            item.classList.add('bg-blue-600', 'text-white', 'font-semibold');
            item.classList.remove('bg-gray-600', 'hover:bg-gray-500');
        } else {
            item.classList.remove('bg-blue-600', 'text-white', 'font-semibold');
            item.classList.add('bg-gray-600', 'hover:bg-gray-500');
        }
    });
    return true;
}

/**
 * Toggles play/pause state.
 */
function togglePlayPause() {
    if (playlist.length === 0) {
        return; // No songs to play
    }

    if (currentSongIndex === -1) {
        loadSong(0); // Load the first song if none is loaded
        isPlaying = true; // Indicate intent to play
    } else {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            // If already loaded, play directly. If not, canplaythrough will handle it.
            audioPlayer.play().catch(e => console.error("Error playing audio:", e));
        }
        isPlaying = !isPlaying;
    }
    updatePlayPauseIcon();
}

/**
 * Plays the next song in the playlist.
 */
function playNextSong() {
    if (playlist.length === 0) return;

    if (repeatMode === 2) { // Repeat one
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * playlist.length);
        while (nextIndex === currentSongIndex && playlist.length > 1) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        }
    } else {
        nextIndex = currentSongIndex + 1;
        if (nextIndex >= playlist.length) {
            nextIndex = 0; // Loop back to the beginning
            if (repeatMode === 0) { // If no repeat, stop after last song
                isPlaying = false;
                updatePlayPauseIcon();
                currentSongTitle.textContent = "Playback finished";
                return;
            }
        }
    }
    loadSong(nextIndex);
    isPlaying = true; // Ensure it plays after changing song
    updatePlayPauseIcon();
}

/**
 * Plays the previous song in the playlist.
 */
function playPrevSong() {
    if (playlist.length === 0) return;

    let prevIndex;
    if (isShuffle) {
        prevIndex = Math.floor(Math.random() * playlist.length);
        while (prevIndex === currentSongIndex && playlist.length > 1) {
            prevIndex = Math.floor(Math.random() * playlist.length);
        }
    } else {
        prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = playlist.length - 1; // Loop back to the end
        }
    }
    loadSong(prevIndex);
    isPlaying = true; // Ensure it plays after changing song
    updatePlayPauseIcon();
}

/**
 * Clears the entire playlist and resets the player state.
 */
function clearPlaylist() {
    audioPlayer.pause();
    audioPlayer.src = ''; // Clear current audio source
    isPlaying = false;
    currentSongIndex = -1;
    playlist = []; // Clear the playlist array

    // Reset UI elements
    currentSongTitle.textContent = 'No song loaded';
    currentSongTime.textContent = '0:00 / 0:00';
    progressBar.value = 0;
    albumArt.src = "https://latin-chain.com/website_pinetwork_games_odoo/static/src/img/latin-chain-logo.jpeg";
    updatePlayPauseIcon();

    // Clear playlist display and add initial message
    playlistElement.innerHTML = '<li class="text-gray-400 text-center py-4">Load files or folders to start.</li>';

    console.log("Playlist cleared.");
}

/**
 * Removes a song from the playlist by its index.
 * @param {number} indexToRemove - The index of the song to remove.
 */
function removeSongFromPlaylist(indexToRemove) {
    if (indexToRemove < 0 || indexToRemove >= playlist.length) {
        console.error("Invalid index for song removal.");
        return;
    }

    const wasPlaying = isPlaying;
    const wasCurrentSong = (indexToRemove === currentSongIndex);

    // Remove from array
    playlist.splice(indexToRemove, 1);

    // Remove from DOM
    const listItemToRemove = playlistElement.querySelector(`li[data-index="${indexToRemove}"]`);
    if (listItemToRemove) {
        playlistElement.removeChild(listItemToRemove);
    }

    // Re-index remaining DOM elements and adjust currentSongIndex
    document.querySelectorAll('#playlist li').forEach((item, idx) => {
        // Only update data-index for items that were after the removed item
        if (parseInt(item.dataset.index) > indexToRemove) {
            item.dataset.index = parseInt(item.dataset.index) - 1;
        }
    });

    if (wasCurrentSong) {
        // If the current song was removed
        audioPlayer.pause();
        isPlaying = false;
        if (playlist.length > 0) {
            // Try to play the next song, or the first if it was the last
            currentSongIndex = Math.min(indexToRemove, playlist.length - 1); // Stay at same index or go to last
            if (currentSongIndex < 0) currentSongIndex = 0; // Ensure it's not -1 if playlist becomes empty
            loadSong(currentSongIndex);
            isPlaying = wasPlaying; // Resume playing if it was playing before removal
            if (isPlaying) {
                audioPlayer.play().catch(e => console.error("Error playing audio after removal:", e));
            }
        } else {
            // If playlist is now empty
            clearPlaylist();
        }
    } else if (indexToRemove < currentSongIndex) {
        // If a song before the current one was removed, decrement currentSongIndex
        currentSongIndex--;
    }
    // If a song after the current one was removed, currentSongIndex remains the same.

    updatePlayPauseIcon();
    // If the playlist becomes empty, ensure the "No song loaded" message is displayed
    if (playlist.length === 0 && playlistElement.children.length === 0) {
        playlistElement.innerHTML = '<li class="text-gray-400 text-center py-4">Load files or folders to start.</li>';
    }
    console.log(`Removed song at index ${indexToRemove}. Total songs: ${playlist.length}`);
}


// --- Event Handlers ---

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
clearPlaylistBtn.addEventListener('click', clearPlaylist);

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    updateRepeatButton(); // Call to update button styling based on new shuffle state
    console.log("Shuffle mode:", isShuffle ? "On" : "Off");
});

repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
    updateRepeatButton();
    console.log("Repeat mode:", repeatMode === 0 ? "No Repeat" : (repeatMode === 1 ? "Repeat All" : "Repeat One"));
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    // Update progress bar
    if (!isNaN(duration)) {
        progressBar.value = (currentTime / duration) * 100;
        currentSongTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
});

audioPlayer.addEventListener('ended', () => {
    playNextSong(); // Automatically play the next song when current one ends
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
    updateVolumeIcon(); // Update icon when volume changes
});

// Initialize volume and icon
audioPlayer.volume = volumeBar.value / 100;
updateVolumeIcon();
updateRepeatButton(); // Set initial repeat button state

// --- File/Folder Loading ---

selectFileBtn.addEventListener('click', () => fileInput.click());
selectFolderBtn.addEventListener('click', () => folderInput.click());

fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    addFilesToPlaylist(files);
});

folderInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    // Filter for audio files (common types)
    const audioFiles = files.filter(file => file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|flac|aac)$/i));
    addFilesToPlaylist(audioFiles);
});

/**
 * Adds files to the playlist and updates the UI.
 * @param {File[]} files - An array of File objects.
 */
function addFilesToPlaylist(files) {
    if (files.length === 0) return;

    // Clear existing playlist if new files are loaded
    if (playlist.length === 0) {
        playlistElement.innerHTML = ''; // Clear initial message
    }

    files.forEach(file => {
        playlist.push(file);
        const newIndex = playlist.length - 1; // Get the index before adding to DOM

        const listItem = document.createElement('li');
        listItem.classList.add(
            'p-3', 'rounded-md', 'bg-gray-600', 'hover:bg-gray-500', 
            'cursor-pointer', 'transition', 'duration-150', 'truncate',
            'flex', 'items-center', 'justify-between' // Flexbox for name and delete button
        );
        listItem.dataset.index = newIndex; // Store index for easy access

        const songNameSpan = document.createElement('span');
        songNameSpan.classList.add('flex-1', 'truncate');
        songNameSpan.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add(
            'delete-song-btn', 'text-red-400', 'hover:text-red-600', 'ml-4', 
            'p-1', 'rounded-full', 'hover:bg-gray-700', 'transition', 
            'duration-150', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500'
        );
        deleteButton.setAttribute('aria-label', 'Remove song');
        deleteButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        `;
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the li click event from firing
            const indexToDelete = parseInt(listItem.dataset.index);
            removeSongFromPlaylist(indexToDelete);
        });

        listItem.appendChild(songNameSpan);
        listItem.appendChild(deleteButton);

        listItem.addEventListener('click', (event) => {
            const clickedIndex = parseInt(event.currentTarget.dataset.index); // Use currentTarget for the li
            if (clickedIndex !== currentSongIndex) {
                loadSong(clickedIndex);
                isPlaying = true; // Start playing immediately
                updatePlayPauseIcon();
            } else {
                togglePlayPause(); // If clicked on current song, toggle play/pause
            }
        });
        playlistElement.appendChild(listItem);
    });

    // If no song is currently loaded, load the first one from the new additions
    /*if (currentSongIndex === -1 && playlist.length > 0) {
        if(loadSong(0))
        {
            isPlaying = true; // Indicate intent to play
            updatePlayPauseIcon();
        }
    }*/

    console.log(`Added ${files.length} files to playlist. Total songs: ${playlist.length}`);
}

// --- Playlist Search Functionality ---
/**
 * Filters the playlist displayed based on the search input.
 */
function filterPlaylist() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    Array.from(playlistElement.children).forEach(listItem => {
        const songName = listItem.querySelector('span').textContent.toLowerCase();
        if (songName.includes(searchTerm)) {
            listItem.style.display = 'flex'; // Show the item
        } else {
            listItem.style.display = 'none'; // Hide the item
        }
    });
}

// Event listener for playlist search input
playlistSearchInput.addEventListener('input', filterPlaylist);


// --- Drag and Drop functionality ---
const dropArea = document.body; // Or a specific div if you prefer

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault(); // Prevent default to allow drop
    dropArea.classList.add('border-blue-500', 'border-dashed'); // Visual feedback
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('border-blue-500', 'border-dashed');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('border-blue-500', 'border-dashed');

    const items = e.dataTransfer.items;
    const filesToProcess = [];

    // Function to recursively read directory entries
    function readEntry(entry) {
        return new Promise(resolve => {
            if (entry.isFile) {
                entry.file(file => {
                    if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|flac|aac)$/i)) {
                        filesToProcess.push(file);
                    }
                    resolve();
                });
            } else if (entry.isDirectory) {
                const dirReader = entry.createReader();
                dirReader.readEntries(entries => {
                    const promises = entries.map(subEntry => readEntry(subEntry));
                    Promise.all(promises).then(resolve);
                });
            } else {
                resolve();
            }
        });
    }

    const entryPromises = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry(); // For directory support
            if (entry) {
                entryPromises.push(readEntry(entry));
            }
        }
    }

    Promise.all(entryPromises).then(() => {
        addFilesToPlaylist(filesToProcess);
    }).catch(error => {
        console.error("Error during drag and drop file processing:", error);
    });
});
