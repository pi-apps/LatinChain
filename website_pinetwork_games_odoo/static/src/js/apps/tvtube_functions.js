// Initialize Lucide Icons
lucide.createIcons();

// Dark Mode Logic
const themeToggle = document.getElementById('themeToggle');

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

// Data: YouTube Channels (Custom user list)
const channelsData = [
    { id: 'UCUdOoVWuWmgo1wByzcsyKDQ', name: 'France 24 Español', country: 'International', category: 'News', color: 'from-blue-800 to-blue-900' },
    { id: 'UCNye-wNBqNL5ZzHSJj3l8Bg', name: 'Al Jazeera (EN)', country: 'International', category: 'News', color: 'from-orange-500 to-orange-700' },
    { id: 'UCknLrEdhRCp1aegoMqRaCZg', name: 'DW News (EN)', country: 'International', category: 'News', color: 'from-blue-500 to-cyan-600' },
    { id: '', videoId: '3MOrgUjiigE', name: 'Radio Online', country: 'Germany', category: 'Radio', color: 'from-red-800 to-red-800' },
    { id: '', videoId: 'iipR5yUp36o', name: 'ABC News', country: 'USA', category: 'News', color: 'from-red-600 to-red-800' },
    { id: 'UC83jt4dlz1Gjl58fzQrrKZg', name: 'CNA 24/7 (EN)', country: 'Singapore', category: 'News', color: 'from-red-700 to-red-900' },
    { id: 'UCQKQTgZJo3PlxA-9V1Z51XA', name: 'Daily Seoul', country: 'South Korea', category: 'Exploration', color: 'from-pink-500 to-rose-700' },
    { id: 'UCGfM15CKSjHl8bGp16P6P8g', name: 'Japan Explorer (Live only in Japan time)', country: 'Japan', category: 'Exploration', color: 'from-pink-500 to-rose-700' },
    { id: 'UCOmQKHnw9n126vfCOQc_F8w', name: 'César OpenSorce Expert', country: 'Venezuela', category: 'Entertainment', color: 'from-blue-500 to-blue-700' },
    { id: 'UCPxs1siPSF6YKGtKP_Zyvtw', name: 'Televen (Sport, Entertainment)', country: 'Venezuela', category: 'Entertainment', color: 'from-red-500 to-red-700' },
    { id: 'UCSI-RoQCVFFv7LI6PwjQrVw', name: 'As Claro por W Deportes', country: 'Mexico', category: 'Sport', color: 'from-green-500 to-green-700' },
    { id: '', videoId: 'PMDQ82w1pAE', name: 'Yahoo Sports', country: 'USA', category: 'Sport', color: 'from-green-500 to-green-700' },
    { id: '', videoId: 'rEKifG2XUZg', name: 'Boomerang UK', country: 'UK', category: 'Cartoon', color: 'from-green-700 to-brown-700' },
    //{ id: '', videoId: 'XdGkaTi6Yio', name: 'Harry Potter', country: 'USA', category: 'Movies', color: 'from-blue-700 to-rose-700' },
];

// DOM Elements
const grid = document.getElementById('channelsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('noResults');
const playerSection = document.getElementById('playerSection');
const videoContainer = document.getElementById('videoContainer');
const currentChannelName = document.getElementById('currentChannelName');
const currentChannelCountry = document.getElementById('currentChannelCountry');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const openInYoutubeBtn = document.getElementById('openInYoutubeBtn');

let currentFilter = 'all';

// Initial Render
renderChannels(channelsData);

// Render Function
function renderChannels(channels) {
    grid.innerHTML = '';
    
    if (channels.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        
        channels.forEach(channel => {
            const card = document.createElement('div');
            
            // FORZAR ACELERACIÓN POR HARDWARE EN MÓVILES (Fix para el glitch de desaparición al hacer scroll)
            // Añadimos transform-gpu y will-change-transform para obligar al renderizador a mantener la tarjeta pintada.
            card.className = 'group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 transform transform-gpu will-change-transform md:hover:-translate-y-1 flex flex-col h-full';
            
            const initials = channel.name.substring(0, 2).toUpperCase();
            
            card.innerHTML = `
                <!-- Agregamos shrink-0 para asegurar que la imagen no aplaste al texto en cálculos móviles -->
                <div class="aspect-video w-full shrink-0 bg-gradient-to-br ${channel.color} relative flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                    <span class="text-4xl font-black text-white/50 tracking-tighter mix-blend-overlay">${initials}</span>
                    
                    <!-- Live Indicator -->
                    <div translate="yes" class="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-slow"></span>
                        Live TV
                    </div>
                    
                    <!-- Play Overlay (shows on hover) -->
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <i data-lucide="play" class="w-6 h-6 fill-current"></i>
                        </div>
                    </div>
                </div>
                <!-- Reforzamos la caja de texto eliminando z-10 que causa conflictos de renderizado -->
                <div class="p-3 md:p-4 flex flex-col grow justify-between bg-white dark:bg-gray-800">
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2 leading-tight mb-1">${channel.name}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3 h-3"></i>
                            ${channel.country}
                        </p>
                    </div>
                    <div class="mt-2 text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
                        ${channel.category}
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => openPlayer(channel));
            grid.appendChild(card);
        });
        
        lucide.createIcons();
    }
}

// Open Player Logic
function openPlayer(channel) {
    var channel_stream = "";
    if(channel.videoId)
        channel_stream = `https://www.youtube.com/embed/${channel.videoId}`;
    else if(channel.id)
        channel_stream = `https://www.youtube.com/embed/live_stream?channel=${channel.id}`;

    const iframeHTML = `
        <iframe
            src="${channel_stream}" 
            title="${channel.name} - Live TV" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    videoContainer.innerHTML = iframeHTML;
    currentChannelName.textContent = channel.name;
    currentChannelCountry.textContent = `Broadcasting from ${channel.country}`;
    
    // UPDATE CONTINGENCY BUTTON: 
    // Directs to the native URL of the live stream of that channel on YouTube
    openInYoutubeBtn.href = `https://www.youtube.com/channel/${channel.id}/live`;
    
    playerSection.classList.remove('hidden');
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close Player Logic
closePlayerBtn.addEventListener('click', () => {
    playerSection.classList.add('hidden');
    videoContainer.innerHTML = '';
});

// Search Logic
searchInput.addEventListener('input', (e) => {
    filterData(e.target.value.toLowerCase(), currentFilter);
});

// Category Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-brand-600', 'text-white', 'hover:bg-brand-500', 'border-transparent');
            b.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'border', 'border-gray-200', 'dark:border-gray-700');
        });
        
        const targetBtn = e.target;
        targetBtn.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'border-gray-200', 'dark:border-gray-700');
        targetBtn.classList.add('bg-brand-600', 'text-white', 'hover:bg-brand-500', 'border-transparent');
        
        currentFilter = targetBtn.getAttribute('data-filter');
        filterData(searchInput.value.toLowerCase(), currentFilter);
    });
});

// Filter Function Combine Search and Category
function filterData(searchTerm, category) {
    const filtered = channelsData.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(searchTerm) || 
                              channel.country.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || channel.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    renderChannels(filtered);
}
