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
            fileNameDisplay.textContent = ''; 
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
    peerIndicatorsDiv.innerHTML = ''; 

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
    // Stop all active torrents & revoke blob URLs if any
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
        addTorrent(magnetURI);
    } else if (torrentFile) {
        addTorrent(torrentFile);
    } else {
        showMessage('Please enter a magnet link or upload a .torrent file.', 'error');
    }
});

// Event listener for "Cancel Torrent" button click
cancelTorrentBtn.addEventListener('click', () => {
    client.torrents.forEach(torrent => torrent.destroy());
    playerContainer.innerHTML = '';
    hideProgress();
    messageArea.classList.add('hidden');
    magnetLinkInput.value = '';
    torrentFileInput.value = '';
    fileNameDisplay.textContent = '';
    peerCountSpan.textContent = '0';
    peerIndicatorsDiv.innerHTML = '';
    showMessage('Torrent session cleared.', 'info');
});

// Function to add a torrent to the WebTorrent client
function addTorrent(torrentId) {
    showMessage('Loading torrent, please wait...');

    client.add(torrentId, torrent => {
        showMessage('Torrent loaded. Searching for media files...');
        updateProgress(0);

        // Find the best video/audio file
        let file = torrent.files.find(f => {
            return f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm') ||
                   f.name.endsWith('.mp3') || f.name.endsWith('.ogg') || f.name.endsWith('.wav');
        });

        if (!file) {
            file = torrent.files.reduce((a, b) => a.length > b.length ? a : b);
        }

        if (file) {
            showMessage(`Preparing: ${file.name}`);

            const isAudio = file.name.endsWith('.mp3') || file.name.endsWith('.ogg') || file.name.endsWith('.wav');
            const mediaElement = document.createElement(isAudio ? 'audio' : 'video');
            mediaElement.controls = true;
            mediaElement.autoplay = true;
            mediaElement.playsInline = true;
            mediaElement.classList.add('rounded-xl', 'w-full', 'max-h-[70vh]');

            // Add the media element to the player container early
            playerContainer.appendChild(mediaElement);

            // Attempt rendering with WebTorrent's renderTo, with fallback to Blob URL stream
            try {
                file.renderTo(mediaElement, { autoplay: true, controls: true }, (err, elem) => {
                    if (err) {
                        console.warn('renderTo failed, attempting Blob URL fallback...', err);
                        fallbackToBlobStream(file, mediaElement);
                    }
                });
            } catch (ex) {
                console.warn('renderTo exception, falling back to Blob URL...', ex);
                fallbackToBlobStream(file, mediaElement);
            }

            // Fallback strategy for stubborn PeerTube/MKV codecs
            function fallbackToBlobStream(targetFile, targetElement) {
                targetFile.getBlob((err, blob) => {
                    if (err) {
                        showMessage(`Error rendering file: ${err.message}`, 'error');
                        console.error('Blob generation error:', err);
                        return;
                    }
                    const blobURL = URL.createObjectURL(blob);
                    targetElement.src = blobURL;
                    targetElement.load();
                    targetElement.play().catch(e => console.log("Autoplay blocked or waiting for buffer:", e));
                    showMessage(`Playing via stream fallback: ${targetFile.name}`);
                });
            }

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
            torrent.on('wire', () => updatePeerDisplay(torrent));
            torrent.on('close', () => updatePeerDisplay(torrent));

            updatePeerDisplay(torrent);

        } else {
            showMessage('No playable media files found in this torrent.', 'error');
        }
    });

    // Handle WebTorrent client errors
    client.on('error', err => {
        showMessage(`WebTorrent Error: ${err.message}`, 'error');
        console.error('WebTorrent Error:', err);
    });
}
