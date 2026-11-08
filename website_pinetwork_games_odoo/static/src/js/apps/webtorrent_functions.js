// Initialize WebTorrent client
const client = new WebTorrent();

// Get references to DOM elements
const magnetLinkInput = document.getElementById('magnet-link');
const torrentFileInput = document.getElementById('torrent-file');
const loadTorrentBtn = document.getElementById('load-torrent-btn');
const cancelTorrentBtn = document.getElementById('cancel-torrent-btn');
const messageArea = document.getElementById('message-area');
const statusMessage = document.getElementById('status-message');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const playerContainer = document.getElementById('player-container');
const peerCountSpan = document.getElementById('peer-count');
const peerIndicatorsDiv = document.getElementById('peer-indicators');

const fileNameDisplay = document.getElementById('file-name-display');

document.addEventListener('DOMContentLoaded', function() {
    torrentFileInput.addEventListener('change', function() {
        if (torrentFileInput.files.length > 0) {
            fileNameDisplay.textContent = `Selected file: ${torrentFileInput.files[0].name}`;
        } else {
            fileNameDisplay.textContent = ''; // Clear the text if no file is selected
        }
    });
});

// Function to display status messages
function showMessage(msg, type = 'info') {
    messageArea.classList.remove('hidden');
    statusMessage.textContent = msg;
    if (type === 'error') {
        statusMessage.classList.add('text-red-400');
        statusMessage.classList.remove('text-gray-300');
    } else {
        statusMessage.classList.remove('text-red-400');
        statusMessage.classList.add('text-gray-300');
    }
}

// Function to update the progress bar
function updateProgress(progress) {
    progressBarContainer.classList.remove('hidden');
    progressBar.style.width = `${progress * 100}%`;
}

// Function to hide the progress bar
function hideProgress() {
    progressBarContainer.classList.add('hidden');
    progressBar.style.width = '0%';
}

// Function to update peer display
function updatePeerDisplay(torrent) {
    const numPeers = torrent.numPeers;
    peerCountSpan.textContent = numPeers;
    peerIndicatorsDiv.innerHTML = ''; // Clear existing indicators

    if (numPeers === 0) {
        const noPeerIndicator = document.createElement('div');
        noPeerIndicator.classList.add('peer-indicator', 'disconnected');
        peerIndicatorsDiv.appendChild(noPeerIndicator);
    } else {
        for (let i = 0; i < numPeers; i++) {
            const peerIndicator = document.createElement('div');
            peerIndicator.classList.add('peer-indicator');
            peerIndicatorsDiv.appendChild(peerIndicator);
        }
    }
}

// Event listener for "Load Torrent" button click
loadTorrentBtn.addEventListener('click', () => {
    // Stop all active torrents
    client.torrents.forEach(torrent => {
        torrent.destroy();
    });
    
    const magnetURI = magnetLinkInput.value.trim();
    const torrentFile = torrentFileInput.files[0];

    // Clear previous player and messages
    playerContainer.innerHTML = '';
    hideProgress();
    messageArea.classList.add('hidden');
    peerCountSpan.textContent = '0';
    peerIndicatorsDiv.innerHTML = '';

    if (magnetURI) {
        // If magnet link is provided, add it to WebTorrent client
        addTorrent(magnetURI);
    } else if (torrentFile) {
        // If a .torrent file is provided, add it to WebTorrent client
        addTorrent(torrentFile);
    } else {
        showMessage('Please enter a magnet link or upload a .torrent file.', 'error');
    }
});

// Event listener for "Cancel Torrent" button click
cancelTorrentBtn.addEventListener('click', () => {
    try {
        Cache.delete();
    } catch (err) {
        console.error(err);
    }
    try {
        window.location.reload(true);
    } catch (err) {
        console.error(err);
    }
});

// Function to add a torrent to the WebTorrent client
function addTorrent(torrentId) {
    showMessage('Loading torrent, please wait...');

    client.add(torrentId, torrent => {
        showMessage('Torrent loaded. Searching for files...');
        updateProgress(0); // Reset progress

        // Find the largest file (usually the main video or audio)
        let file = torrent.files.find(f => {
            return f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm') ||
                   f.name.endsWith('.mp3') || f.name.endsWith('.ogg') || f.name.endsWith('.wav');
        });

        // If no specific video/audio file found, take the largest one
        if (!file) {
            file = torrent.files.reduce((a, b) => a.length > b.length ? a : b);
        }

        if (file) {
            showMessage(`Playing: ${file.name}`);

            // Create a video or audio element
            const mediaElement = document.createElement(file.name.endsWith('.mp3') || file.name.endsWith('.ogg') || file.name.endsWith('.wav') ? 'audio' : 'video');
            mediaElement.controls = true; // Enable player controls
            mediaElement.autoplay = true; // Autoplay
            mediaElement.classList.add('rounded-xl'); // Add Tailwind classes

            // Render the file to the media element
            file.renderTo(mediaElement, {
                autoplay: true,
                controls: true
            }, err => {
                if (err) {
                    showMessage(`Error rendering file: ${err.message}`, 'error');
                    console.error('Error rendering file:', err);
                }
            });

            // Add the media element to the player container
            playerContainer.appendChild(mediaElement);

            // Listen for download progress
            torrent.on('download', () => {
                updateProgress(torrent.progress);
                statusMessage.textContent = `Downloading: ${(torrent.progress * 100).toFixed(2)}% - Speed: ${(torrent.downloadSpeed / 1024 / 1024).toFixed(2)} MB/s`;
            });

            torrent.on('done', () => {
                showMessage('Download complete.', 'info');
                hideProgress();
            });

            // Listen for peer events to update the display
            torrent.on('peer', () => updatePeerDisplay(torrent));
            torrent.on('noPeers', () => updatePeerDisplay(torrent));
            torrent.on('wire', () => updatePeerDisplay(torrent)); // When a new wire (connection) is established
            torrent.on('close', () => updatePeerDisplay(torrent)); // When a connection closes

            // Initial peer display update
            updatePeerDisplay(torrent);

        } else {
            showMessage('No playable media files found in this torrent.', 'error');
        }
    });

    // Handle WebTorrent client errors
    client.on('error', err => {
        showMessage(`WebTorrent Error: ${err.message}`, 'error');
        console.error('WebTorrent Error:', err);
        
        /*setTimeout(function() {
            try {
                Cache.delete();
            } catch (err) {
                console.error(err);
            }
            try {
                window.location.reload(true);
            } catch (err) {
                console.error(err);
            }
        }, 2000);*/
        
    });
}
