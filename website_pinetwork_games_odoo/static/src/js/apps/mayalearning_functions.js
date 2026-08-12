(async function() {
    // --- INDEXEDDB SETUP ---
    const DB_NAME = 'MayaCourseDB';
    const STORE_NAME = 'SettingsStore';
    const DB_VERSION = 1;

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async function setItem(key, value) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async function getItem(key) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    // ── LANGUAGE TOGGLE ──
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'es';

    langBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            updateLanguage(currentLang);
            
            try {
                await setItem('maya-course-lang', currentLang);
                
                if(localStorage.getItem('maya-course-lang'))
                    localStorage.removeItem('maya-course-lang');
            } catch (error) {
                console.error('Error al guardar el idioma en IndexedDB:', error);
            }
        });
    });

    function updateLanguage(lang) {
        document.querySelectorAll('[data-es][data-en]').forEach(el => {
            const text = el.getAttribute('data-' + lang);
            if (text) el.innerHTML = text;
        });
        // Update nav tab spans
        document.querySelectorAll('.nav-tab span[data-es][data-en]').forEach(span => {
            const text = span.getAttribute('data-' + lang);
            if (text) span.textContent = text;
        });
    }

    // Load saved language
    try {
        const savedLang = await getItem('maya-course-lang');
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            currentLang = savedLang;
            langBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.lang === savedLang);
            });
            updateLanguage(currentLang);
        }
    } catch (error) {
        console.error('Error al cargar el idioma desde IndexedDB:', error);
    }

    // ── NAVIGATION TABS ──
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    async function activateSection(sectionId) {
        sections.forEach(s => s.classList.remove('active'));
        navTabs.forEach(t => t.classList.remove('active'));

        const targetSection = document.getElementById('sec-' + sectionId);
        if (targetSection) targetSection.classList.add('active');

        const targetTab = document.querySelector(`.nav-tab[data-section="${sectionId}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Save to URL hash
        if (history.pushState) {
            history.pushState(null, null, '#' + sectionId);
        }
        
        try {
            await setItem('maya-course-section', sectionId);
            
            if(localStorage.getItem('maya-course-section'))
                localStorage.removeItem('maya-course-section');
        } catch (error) {
            console.error('Error al guardar la sección en IndexedDB:', error);
        }
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            await activateSection(tab.dataset.section);
        });
    });

    // Load section from hash or IndexedDB
    try {
        const hash = window.location.hash.replace('#', '');
        const savedSection = await getItem('maya-course-section');
        const initialSection = hash || savedSection || 'inicio';
        
        if (document.getElementById('sec-' + initialSection)) {
            await activateSection(initialSection);
        }
    } catch (error) {
        console.error('Error al cargar la sección desde IndexedDB:', error);
        // Fallback en caso de error
        if (document.getElementById('sec-inicio')) {
            await activateSection('inicio');
        }
    }

    // Handle back/forward browser buttons
    window.addEventListener('hashchange', async () => {
        const h = window.location.hash.replace('#', '');
        if (h && document.getElementById('sec-' + h)) {
            await activateSection(h);
        }
    });

    // ── SMOOTH SCROLL FOR ALL IN-PAGE LINKS ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('🌿 Maayat\'aan Course Ready!');
    console.log('📱 Mobile-first | 🗣️ Phonetics | 🔢 1→1B | 👤 All Pronouns');
    console.log('🌎 ES/EN bilingual interface active');
})();
