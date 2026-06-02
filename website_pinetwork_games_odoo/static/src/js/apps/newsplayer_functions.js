// Define our target Crypto RSS feeds globally
const CRYPTO_FEEDS = [
    { id: 'coindesk', name: 'CoinDesk', icon: '📰', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { id: 'cointelegraph', name: 'Cointelegraph', icon: '⚡', url: 'https://cointelegraph.com/rss' },
    { id: 'bitcoin', name: 'Bitcoin.com', icon: '₿', url: 'https://news.bitcoin.com/feed/' },
    { id: 'cryptoslate', name: 'CryptoSlate', icon: '📈', url: 'https://cryptoslate.com/feed/' },
    { id: 'decrypt', name: 'Decrypt', icon: '🌐', url: 'https://decrypt.co/feed' }
];

// Retrieve saved order from localStorage or use default
const defaultOrder = CRYPTO_FEEDS.map(s => s.id);
let userOrder = JSON.parse(localStorage.getItem('cryptoFeedOrder')) || defaultOrder;

// Cleanup: In case feeds were added/removed from our list vs localStorage state
userOrder = userOrder.filter(id => CRYPTO_FEEDS.some(s => s.id === id));
CRYPTO_FEEDS.forEach(s => { if (!userOrder.includes(s.id)) userOrder.push(s.id); });

let feedsDataCache = {}; // Prevent excessive API calls
window.articleCache = {}; // Global cache for modals

// Utility: Strip HTML tags to ensure safe and clean description output
function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// Utility: Human readable dates
function formatDate(dateStr) {
    if (!dateStr) return '';
    
    // Fix for rss2json API: it returns "YYYY-MM-DD HH:mm:ss" in UTC without a timezone indicator.
    // We convert it to standard ISO 8601 so the browser correctly parses it as UTC first.
    let safeDateStr = dateStr;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        safeDateStr = dateStr.replace(' ', 'T') + 'Z';
    }
    
    const date = new Date(safeDateStr);
    return date.toLocaleString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short' 
    });
}

// Fetch Function using Public APIs to bypass CORS
async function fetchFeed(feedId) {
    const feed = CRYPTO_FEEDS.find(s => s.id === feedId);
    if (!feed) return [];

    // Attempt 1: rss2json API (clean, fast JSON format)
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        const data = await res.json();
        if (data.status === 'ok') {
            return data.items.map(item => ({
                title: stripHtml(item.title),
                link: item.link,
                pubDate: item.pubDate,
                description: stripHtml(item.description),
                thumbnail: item.thumbnail || (item.enclosure && item.enclosure.link) || null
            }));
        }
    } catch (e) {
        console.warn("Primary RSS fetch failed, attempting fallback...", e);
    }

    // Attempt 2: AllOrigins proxy with native DOMParser fallback
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'application/xml');
        const items = xml.querySelectorAll('item');
        
        return Array.from(items).map(item => {
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            let thumbnail = null;
            
            // Locate image elements in XML
            const enclosure = item.querySelector('enclosure');
            if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
                thumbnail = enclosure.getAttribute('url');
            } else {
                const media = item.getElementsByTagNameNS('*', 'thumbnail')[0];
                if(media && media.getAttribute('url')) {
                    thumbnail = media.getAttribute('url');
                }
            }
            return { title: stripHtml(title), link, pubDate, description: stripHtml(description), thumbnail };
        });
    } catch (e) {
        console.error("All fetch methods failed for:", feedId, e);
        return [];
    }
}

// Render skeleton loading screens for results (horizontal ticker)
function renderResultsSkeletons(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = Array(3).fill(0).map(() => `
        <div class="min-w-[240px] bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse shrink-0">
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    `).join('');
}

// Render skeleton loading screens for news (vertical)
function renderNewsSkeletons(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = Array(3).fill(0).map(() => `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4 mb-4">
            <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Establish the layout sections in the order specified by the user
function renderFeedSections() {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = '';

    userOrder.forEach(feedId => {
        const feed = CRYPTO_FEEDS.find(s => s.id === feedId);
        const section = document.createElement('div');
        section.className = 'pt-2 mb-10 border-b border-gray-200 pb-6 last:border-0';
        section.innerHTML = `
            <h2 class="text-xl font-extrabold mb-5 flex items-center gap-3 text-gray-800">
                <span class="text-2xl bg-white shadow-sm border border-gray-100 p-2 rounded-xl">${feed.icon}</span> 
                ${feed.name}
            </h2>
            
            <!-- Market Updates Section (Shows First) -->
            <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Market Updates & Prices</h3>
                <div id="results-${feedId}" class="flex overflow-x-auto gap-4 pb-2 hide-scrollbar snap-x snap-mandatory"></div>
            </div>

            <!-- News Section -->
            <div>
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Latest Stories</h3>
                <div id="news-${feedId}" class="flex flex-col gap-4"></div>
            </div>
        `;
        feedContainer.appendChild(section);
        renderResultsSkeletons(`results-${feedId}`);
        renderNewsSkeletons(`news-${feedId}`);
    });
}

// Load items concurrently and inject them into their respective sections
async function fetchAndPopulate(forceRefresh = false) {
    if (forceRefresh) {
        feedsDataCache = {};
        renderFeedSections(); // Clear and show skeletons again
    }

    // Map all fetches onto Promises so they execute simultaneously
    const fetchPromises = userOrder.map(async feedId => {
        if (!feedsDataCache[feedId]) {
            feedsDataCache[feedId] = await fetchFeed(feedId);
        }
        
        const resultsContainer = document.getElementById(`results-${feedId}`);
        const newsContainer = document.getElementById(`news-${feedId}`);
        if (!resultsContainer || !newsContainer) return; 
        
        resultsContainer.innerHTML = '';
        newsContainer.innerHTML = '';
        
        const items = feedsDataCache[feedId] || [];
        
        // Crypto Smart Filter: Detect items related to price movements, market analysis, or rapid shifts
        const marketRegex = /\$|\b(price|surges|plummets|drops|hits|rallies|analysis|prediction|bull|bear|ATH|ETF)\b/i;
        let results = items.filter(item => marketRegex.test(item.title));
        let news = items.filter(item => !marketRegex.test(item.title));

        // If feed doesn't have obvious market updates, borrow top items to act as the "Latest Updates" ticker
        if (results.length < 4) {
            const needed = 4 - results.length;
            results = [...results, ...news.slice(0, needed)];
            news = news.slice(needed);
        }

        results = results.slice(0, 6); // Up to 6 results for the horizontal ticker
        news = news.slice(0, 5);       // Up to 5 news items for the vertical feed

        // Populate Market Updates (Horizontal Ticker)
        if (results.length > 0) {
            results.forEach(item => {
                window.articleCache[item.link] = item;
                const card = document.createElement('button');
                card.onclick = () => openNewsModal(item.link);
                card.className = 'text-left min-w-[240px] max-w-[240px] h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform shrink-0 flex flex-col justify-between snap-start hover:border-indigo-300 focus:outline-none';
                card.innerHTML = `
                    <div>
                        <p class="text-[10px] text-green-600 font-bold mb-2 uppercase tracking-wider flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            ${formatDate(item.pubDate)}
                        </p>
                        <h4 class="text-sm font-bold text-gray-900 leading-snug line-clamp-3">${item.title}</h4>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = `<p class="text-sm text-gray-400 italic">No recent updates found.</p>`;
        }

        // Populate News (Vertical Cards)
        if (news.length > 0) {
            news.forEach(item => {
                window.articleCache[item.link] = item;
                const imgHtml = item.thumbnail ? `<img src="${item.thumbnail}" alt="Thumbnail" class="w-full h-48 object-cover border-b border-gray-100" onerror="this.style.display='none'">` : '';
                const card = document.createElement('button');
                card.onclick = () => openNewsModal(item.link);
                card.className = 'text-left w-full block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform hover:border-indigo-300 focus:outline-none';
                card.innerHTML = `
                    ${imgHtml}
                    <div class="p-5">
                        <p class="text-xs text-indigo-600 font-bold mb-2 uppercase tracking-wider">${formatDate(item.pubDate)}</p>
                        <h3 class="text-lg font-bold leading-snug mb-2 text-gray-900">${item.title}</h3>
                        <p class="text-sm text-gray-600 line-clamp-2">${item.description}</p>
                    </div>
                `;
                newsContainer.appendChild(card);
            });
        } else {
             newsContainer.innerHTML = `
                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                    <p class="text-gray-500 text-sm">No recent news available right now.</p>
                </div>`;
        }
    });

    await Promise.all(fetchPromises); // Wait for all lists to populate
}

// ================= Settings & Ordering UI =================

function renderSettingsList() {
    const list = document.getElementById('sortable-list');
    list.innerHTML = '';
    
    userOrder.forEach((feedId, index) => {
        const feed = CRYPTO_FEEDS.find(s => s.id === feedId);
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-200 transition-colors';
        li.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-2xl">${feed.icon}</span>
                <span class="font-bold text-gray-700">${feed.name}</span>
            </div>
            <div class="flex gap-2">
                <!-- Move Up -->
                <button onclick="moveFeed(${index}, -1)" class="p-2.5 bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 rounded-lg disabled:opacity-30 disabled:hover:text-gray-600 active:scale-95 transition-all" ${index === 0 ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
                </button>
                <!-- Move Down -->
                <button onclick="moveFeed(${index}, 1)" class="p-2.5 bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 rounded-lg disabled:opacity-30 disabled:hover:text-gray-600 active:scale-95 transition-all" ${index === userOrder.length - 1 ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Global function attached to window for inline onclick handlers
window.moveFeed = function(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= userOrder.length) return;
    
    // Swap array elements
    const temp = userOrder[index];
    userOrder[index] = userOrder[newIndex];
    userOrder[newIndex] = temp;
    
    // Instantly re-render the list visually
    renderSettingsList();
};

// Modal Listeners
document.getElementById('open-settings-btn').addEventListener('click', () => {
    renderSettingsList();
    document.getElementById('settings-modal').classList.remove('hidden');
});

document.getElementById('close-settings-btn').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
});

// Save layout to LocalStorage and refresh the feed immediately
document.getElementById('save-order-btn').addEventListener('click', () => {
    localStorage.setItem('cryptoFeedOrder', JSON.stringify(userOrder));
    document.getElementById('settings-modal').classList.add('hidden');
    renderFeedSections(); 
    fetchAndPopulate(false); // Re-render using cached data (no need to re-fetch on simple re-order)
});

// Pull new data listener
document.getElementById('refresh-btn').addEventListener('click', () => {
    fetchAndPopulate(true);
});

// ================= News Lightbox Modal Logic =================
window.openNewsModal = function(link) {
    const item = window.articleCache[link];
    if (!item) return;

    document.getElementById('news-modal-title').textContent = item.title;
    document.getElementById('news-modal-date').textContent = formatDate(item.pubDate);
    document.getElementById('news-modal-content').innerHTML = item.description || 'No summary available.';
    
    // Wire up the custom confirm button
    const linkBtn = document.getElementById('news-modal-link-btn');
    linkBtn.onclick = () => {
        document.getElementById('proceed-link-btn').href = item.link;
        document.getElementById('confirm-modal').classList.remove('hidden');
    };

    const imgContainer = document.getElementById('news-modal-image-container');
    const imgEl = document.getElementById('news-modal-image');
    if (item.thumbnail) {
        imgEl.src = item.thumbnail;
        imgContainer.classList.remove('hidden');
    } else {
        imgContainer.classList.add('hidden');
        imgEl.src = '';
    }

    document.getElementById('news-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

document.getElementById('close-news-modal-btn').addEventListener('click', () => {
    document.getElementById('news-modal').classList.add('hidden');
    document.body.style.overflow = '';
});

// Custom Confirm Modal Listeners
document.getElementById('cancel-confirm-btn').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.add('hidden');
});

document.getElementById('proceed-link-btn').addEventListener('click', () => {
    // Hide the confirm modal when they click the actual link
    document.getElementById('confirm-modal').classList.add('hidden');
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderFeedSections();
    fetchAndPopulate(false);
});
