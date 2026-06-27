(function() {
    // ── LANGUAGE TOGGLE ──
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'es';

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            updateLanguage(currentLang);
            localStorage.setItem('maya-course-lang', currentLang);
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
    const savedLang = localStorage.getItem('maya-course-lang');
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        currentLang = savedLang;
        langBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.lang === savedLang);
        });
        updateLanguage(currentLang);
    }

    // ── NAVIGATION TABS ──
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    function activateSection(sectionId) {
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
        localStorage.setItem('maya-course-section', sectionId);
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateSection(tab.dataset.section);
        });
    });

    // Load section from hash or localStorage
    const hash = window.location.hash.replace('#', '');
    const savedSection = localStorage.getItem('maya-course-section');
    const initialSection = hash || savedSection || 'inicio';
    if (document.getElementById('sec-' + initialSection)) {
        activateSection(initialSection);
    }

    // Handle back/forward browser buttons
    window.addEventListener('hashchange', () => {
        const h = window.location.hash.replace('#', '');
        if (h && document.getElementById('sec-' + h)) {
            activateSection(h);
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
