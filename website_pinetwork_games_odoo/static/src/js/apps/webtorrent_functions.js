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

function updateProgress(progress) {
    progressBarContainer.classList.remove('hidden');
    progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
}

function hideProgress() {
    progressBarContainer.classList.add('hidden');
    progressBar.style.width = '0%';
}

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

loadTorrentBtn.addEventListener('click', () => {
    client.torrents.forEach(torrent => torrent.destroy());
    
    const magnetURI = magnetLinkInput.value.trim();
    const torrentFile = torrentFileInput.files[0];

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

function addTorrent(torrentId) {
    showMessage('Connecting to peer swarm, fetching metadata...');

    client.add(torrentId, torrent => {
        showMessage('Metadata received. Indexing files...');
        updateProgress(0);

        // Track live download metrics
        torrent.on('download', () => {
            updateProgress(torrent.progress);
            statusMessage.textContent = `Downloading: ${(torrent.progress * 100).toFixed(2)}% - Speed: ${(torrent.downloadSpeed / 1024 / 1024).toFixed(2)} MB/s`;
        });

        torrent.on('done', () => {
            showMessage('Download complete.', 'info');
            hideProgress();
        });

        torrent.on('peer', () => updatePeerDisplay(torrent));
        torrent.on('noPeers', () => updatePeerDisplay(torrent));
        torrent.on('wire', () => updatePeerDisplay(torrent));
        torrent.on('close', () => updatePeerDisplay(torrent));
        updatePeerDisplay(torrent);

        // Deselect all non-essential files in the swarm
        torrent.deselect(0, torrent.pieces.length - 1, 0);

        // Target the primary video/audio track
        let file = torrent.files.find(f => {
            return f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm') ||
                   f.name.endsWith('.mp3') || f.name.endsWith('.ogg') || f.name.endsWith('.wav');
        });

        if (!file) {
            file = torrent.files.reduce((a, b) => a.length > b.length ? a : b);
        }

        if (file) {
            showMessage(`Buffering container header for: ${file.name}`);

            // 1. Mark file for high priority sequential streaming
            file.select();

            // 2. High-priority fetch on head & tail pieces (MOOV atom / Cues index)
            const startPiece = Math.floor(file._startPiece);
            const endPiece = Math.floor(file._endPiece);
            
            // Prioritize first 5 pieces (start of file)
            torrent.priority(startPiece, Math.min(startPiece + 5, endPiece), 10);
            // Prioritize last 5 pieces (end of file for MOOV atom metadata)
            torrent.priority(Math.max(startPiece, endPiece - 5), endPiece, 10);

            const isAudio = file.name.endsWith('.mp3') || file.name.endsWith('.ogg') || file.name.endsWith('.wav');
            const mediaElement = document.createElement(isAudio ? 'audio' : 'video');
            mediaElement.controls = true;
            mediaElement.autoplay = true;
            mediaElement.playsInline = true;
            mediaElement.classList.add('rounded-xl', 'w-full', 'max-h-[70vh]');

            playerContainer.appendChild(mediaElement);

            // 3. Render directly using WebTorrent's MediaSource engine with stream priorities
            file.renderTo(mediaElement, {
                autoplay: true,
                controls: true,
                maxBufferLength: 30 // Keep immediate buffer focused around current playback head
            }, (err) => {
                if (err) {
                    console.error('Render error:', err);
                    showMessage(`Render warning: ${err.message}. Retrying via fallback stream...`, 'error');
                }
            });

            // Player state listeners
            mediaElement.addEventListener('waiting', () => {
                showMessage(`Buffering video stream from peers...`, 'info');
            });

            mediaElement.addEventListener('playing', () => {
                showMessage(`Streaming live: ${file.name}`, 'info');
            });

            mediaElement.addEventListener('canplay', () => {
                mediaElement.play().catch(e => console.log('Waiting for user playback action:', e));
            });

        } else {
            showMessage('No media files found in this torrent.', 'error');
        }
    });

    client.on('error', err => {
        showMessage(`WebTorrent Error: ${err.message}`, 'error');
        console.error('WebTorrent Error:', err);
    });
}
