"use strict";

const delayAsync = ms => new Promise(res => setTimeout(res, ms));

async function loadMessageLatinChain() {
    try {
        const loading_latinchain = document.getElementById('loading-message');
        if (!loading_latinchain) return;

        const loading_latinchain_pre = loading_latinchain.innerHTML;

        loading_latinchain.innerHTML = '<div style="display: block; ">' +
            '<div style="display: block; ">' +
            loading_latinchain_pre +
            '</div>' +
            '<div id="loading-message-section" class="justify-content-center text-center" style="display: none; margin-top: 15px;">' +
            '<video style="display: none; border-radius: 30% !important; max-width: 250px !important; max-height: 150px !important; min-width: 250px !important; min-height: 150px !important; width: 250px !important; height: 150px !important; aspect-ratio: 16 / 9 !important; object-fit: cover !important;" id="loading-message-video" muted="muted" playsinline="playsinline" loop="loop" width="250" height="150">' +
            '<source src="/website_pinetwork_games_odoo/static/src/video/video-presentation-latinchain.mp4?v=1.103" type="video/mp4" />' +
            '</video>' +
            '</div>' +
            '</div>';

        const video_latinchain = document.getElementById('loading-message-video');
        const video_latinchain_section = document.getElementById('loading-message-section');

        if (video_latinchain && video_latinchain_section) {
            video_latinchain.addEventListener('playing', () => {
                video_latinchain.style.display = "block";
                video_latinchain_section.style.display = "block";
            }, { once: true });

            video_latinchain.play().catch(err => {
                console.warn("Autoplay prevented or failed:", err);
            });
        }
    } catch (e) {
        console.error("Error in loadMessageLatinChain:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadMessageLatinChain();
});

function validateYouTubeUrl(url) {
    if (url) {
        var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var match = url.match(regExp);
        if (match) {
            return match;
        }
    }
    return false;
}

function startLatinChainSports(show_content_div) {
    $(show_content_div).html('<iframe src="https://www.scorebat.com/embed/livescore/" frameborder="0" width="600" height="760" allowfullscreen="true" allow="autoplay; fullscreen" style="width:100%;height:760px;overflow:hidden;display:block;" class="_scorebatEmbeddedPlayer_"></iframe>');
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://www.scorebat.com/embed/embed.js?v=arrv';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'scorebat-jssdk'));
}

function startLatinChainAcademy(show_content_div) {
    $(show_content_div).html('<iframe src="https://drive.google.com/embeddedfolderview?id=1jhETR4rv-YCA1QDApX2lhTMvo8PMQnVR#list" style="width:100%; height:600px; border:0;"></iframe>');
}

function getGeminiImage() {
    var img_array = [
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Buenos_Aires.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Caracas.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Los_Angeles.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Mexico_City.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Seoul.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Shanghai.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Tokyo.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Vietnam.png?v=1.101",
        "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Honduras.png?v=1.101"
    ];

    var random_integer = Math.floor(Math.random() * img_array.length);
    return img_array[random_integer];
}

// speech-module.js
const speechModule = (() => {
    const STORAGE_KEY = 'speech_synthesis_active';
    let observer = null;
    const spokenElements = new Set();

    const activateSpeech = () => {
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
            setupObserver();
        } catch (e) {
            console.error('Error in localStorage:', e);
        }
    };

    const setupObserver = () => {
        if (!('IntersectionObserver' in window)) return;

        if (observer) {
            observer.disconnect();
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const callback = (entries) => {
            if (localStorage.getItem(STORAGE_KEY) !== 'true' || !('speechSynthesis' in window)) {
                return;
            }

            window.speechSynthesis.cancel();
            spokenElements.clear();

            setTimeout(function () {
                entries.forEach(entry => {
                    if ((entry.isIntersecting) && !spokenElements.has(entry.target)) {
                        const textToSpeak = entry.target.textContent;
                        if (textToSpeak && textToSpeak.trim()) {
                            const utterance = new SpeechSynthesisUtterance(textToSpeak);
                            const systemLanguage = navigator.language;
                            const shortLang = systemLanguage.split(/[-_]/)[0];
                            const voices = window.speechSynthesis.getVoices();

                            var lastLang = localStorage.getItem('lastTranslateLanguage');
                            var savedLanguage1 = lastLang ? lastLang.split(/[-_]/)[0] : shortLang;

                            var voice = "";
                            if (savedLanguage1) {
                                voice = voices.find(v => v.lang.startsWith(savedLanguage1)) ||
                                    voices.find(v => v.lang.startsWith('en'));
                            }

                            if (location.pathname.startsWith("/es")) {
                                voice = voices.find(v => v.lang.startsWith('es')) || voice;
                            }

                            if (voice) {
                                utterance.voice = voice;
                                utterance.lang = voice.lang;
                                utterance.pitch = 1;
                                utterance.rate = 1;

                                window.speechSynthesis.speak(utterance);
                                spokenElements.add(entry.target);
                            }
                        }
                    }
                });
            }, 1000);
        };

        observer = new IntersectionObserver(callback, options);
        document.querySelectorAll('p, h1, h2, h3, h4, h5').forEach(element => {
            observer.observe(element);
        });
    };

    const deactivateSpeech = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            spokenElements.clear();
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    };

    return {
        activate: activateSpeech,
        deactivate: deactivateSpeech,
        observer: setupObserver
    };
})();

async function speak(textIncome) {
    const textToSpeak = textIncome;
    if (textToSpeak && textToSpeak.trim()) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const systemLanguage = navigator.language;
        const shortLang = systemLanguage.split(/[-_]/)[0];
        const voices = window.speechSynthesis.getVoices();

        var lastLang = localStorage.getItem('lastTranslateLanguage');
        var savedLanguage1 = lastLang ? lastLang.split(/[-_]/)[0] : shortLang;
        var voice = voices.find(v => v.lang.startsWith(savedLanguage1)) || voices.find(v => v.lang.startsWith('en'));

        if (location.pathname.startsWith("/es")) {
            voice = voices.find(v => v.lang.startsWith('es')) || voice;
        }

        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
            utterance.pitch = 1;
            utterance.rate = 1;
            window.speechSynthesis.speak(utterance);
        }
    }
}

function loadSpeechLanguages() {
    if (!location.pathname.includes("/webcamplayer") &&
        !location.pathname.includes("/texttospeechplayer") &&
        !location.pathname.includes("/web")) {
        const STORAGE_KEY_BACKEND = 'speech_synthesis_active';
        if (localStorage.getItem(STORAGE_KEY_BACKEND) !== 'true') {
            speechModule.deactivate();
        } else {
            speechModule.activate();
        }
    }
}

document.addEventListener('DOMContentLoaded', loadSpeechLanguages);

/*
 * Translation Logic
 */

var is_changing_page = false;
var avoidAsking = false;
var observer1_state = false;
var observer1 = false;

if (!location.pathname.includes("/web")) {
    observer1 = new MutationObserver(() => checkLang());
    observer1_state = true;
} else {
    observer1_state = false;
}

var hashLatinChainGoogleTranslate = "";

var checkLang = () => {
    if (!is_changing_page) {
        var lang1 = window.document.documentElement.getAttribute('lang').split(/[-_]/);
        var lang = lang1[0];
        if (lang1[1]) lang += "-" + lang1[1];

        if (lang) {
            localStorage.setItem('lastTranslateLanguage', lang);
        }
        loadLang();
    } else if (is_changing_page === "changing") {
        is_changing_page = false;
    }
};

var loadLang = () => {
    if (!is_changing_page) {
        var lastLang = localStorage.getItem('lastTranslateLanguage');
        if (!lastLang) return;

        var lang1 = lastLang.split(/[-_]/);
        var savedLanguage1 = lang1[0];
        if (lang1[1]) savedLanguage1 += "-" + lang1[1];

        if (savedLanguage1) {
            var original_lang = location.pathname.startsWith("/es") ? "es" : "en";
            window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
            hashLatinChainGoogleTranslate = window.location.hash;
        }
    }
};

var loadLangInitial = () => {
    var lastLang = localStorage.getItem('lastTranslateLanguage');
    if (lastLang !== null) {
        var lang1 = lastLang.split(/[-_]/);
        var savedLanguage1 = lang1[0];
        if (lang1[1]) savedLanguage1 += "-" + lang1[1];

        if (savedLanguage1) {
            document.documentElement.setAttribute('lang', savedLanguage1);
        }
    } else {
        var defaultLang = location.pathname.startsWith("/es") ? 'es' : 'en';
        document.documentElement.setAttribute('lang', defaultLang);
        localStorage.setItem('lastTranslateLanguage', defaultLang);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    is_changing_page = false;

    if (observer1_state) {
        observer1.observe(window.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        loadLangInitial();
    }
});

window.onbeforeunload = () => {
    is_changing_page = true;
    if (observer1_state && observer1) observer1.disconnect();

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};

function unloadMessage(on) {
    if (on) {
        window.onbeforeunload = () => {
            is_changing_page = true;
            if (observer1_state && observer1) observer1.disconnect();

            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }

            if (!avoidAsking) {
                if (observer1_state) {
                    observer1 = new MutationObserver(() => checkLang());
                    observer1.observe(window.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
                }
                is_changing_page = "changing";
                return true;
            }
        };
    } else {
        window.onbeforeunload = () => {
            is_changing_page = true;
            if (observer1_state && observer1) observer1.disconnect();

            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }
}

var googleTranslateElementInit = () => {
    if (!location.pathname.includes("/web")) {
        var lang_google = location.pathname.startsWith("/es") ? 'es' : 'en';

        new google.translate.TranslateElement({
            pageLanguage: lang_google,
            autoDisplay: true,
            multilanguagePage: false,
            layout: google.translate.TranslateElement.InlineLayout.VERTICAL
        }, 'google_translate_element');

        const el3 = document.querySelector('circle');
        if (el3) {
            const observer = new window.IntersectionObserver(([entry]) => {
                const circleParent = document.getElementsByTagName("circle")[0];
                if (circleParent && circleParent.parentNode && circleParent.parentNode.parentNode) {
                    circleParent.parentNode.parentNode.style.display = "none";
                }

                const translateWidth = document.querySelector('a[href="https://translate.google.com"]');
                if (translateWidth) {
                    translateWidth.style.maxWidth = "500px";
                    translateWidth.style.width = "fit-content";
                    translateWidth.style.display = "inline-flex";
                    translateWidth.style.alignItems = "baseline";
                    translateWidth.style.height = "auto";

                    const translateImg = translateWidth.querySelector('img');
                    if (translateImg) {
                        translateImg.style.alignItems = "baseline";
                        translateImg.style.height = "auto";
                        translateImg.style.marginTop = "auto";
                    }
                }
            }, { root: null, threshold: 0.1 });

            observer.observe(el3);
        }
    }
};

/*
 * Shadow DOM Modals
 */

function showModalAllApps(message, title = 'Notification') {
    if (document.getElementById('isolated-js-modal-host')) return;

    const host = document.createElement('div');
    host.id = 'isolated-js-modal-host';
    host.style.position = 'relative';
    host.style.zIndex = '2147483647';

    const shadow = host.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
            :host { all: initial; }
            .overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: rgba(0, 0, 0, 0.65);
                display: flex; justify-content: center; align-items: flex-end; 
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                backdrop-filter: blur(3px); z-index: 2147483647;
            }
            .modal {
                width: 100%; margin: 0; padding: 24px 20px 32px 20px;
                border-radius: 24px 24px 0 0; box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.2);
                box-sizing: border-box; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                background-color: #ffffff; color: #111827;
            }
            .title { margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 700; line-height: 1.4; }
            .message { margin: 0 0 24px 0; font-size: 1rem; line-height: 1.6; color: #4b5563; white-space: pre-wrap; }
            .close-btn {
                display: block; width: 100%; padding: 14px; border: none; border-radius: 12px;
                font-size: 1rem; font-weight: 600; cursor: pointer;
                transition: background-color 0.2s ease, transform 0.1s ease;
                background-color: #f3f4f6; color: #1f2937; touch-action: manipulation;
            }
            .close-btn:active { transform: scale(0.97); background-color: #e5e7eb; }
            @media (prefers-color-scheme: dark) {
                .modal { background-color: #1f2937; color: #f9fafb; border-top: 1px solid #374151; }
                .message { color: #d1d5db; }
                .close-btn { background-color: #374151; color: #f9fafb; }
                .close-btn:active { background-color: #4b5563; }
            }
            @media (min-width: 640px) {
                .overlay { align-items: center; }
                .modal {
                    width: 90%; max-width: 420px; padding: 24px; border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .close-btn:hover { background-color: #e5e7eb; }
                @media (prefers-color-scheme: dark) { .close-btn:hover { background-color: #4b5563; } }
            }
            @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
            @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        </style>
        <div class="overlay">
            <div class="modal">
                <h2 class="title"></h2>
                <p class="message"></p>
                <button class="close-btn">Close</button>
            </div>
        </div>
    `;

    shadow.appendChild(template.content.cloneNode(true));
    shadow.querySelector('.title').textContent = title;
    shadow.querySelector('.message').textContent = message;

    const overlay = shadow.querySelector('.overlay');
    const closeBtn = shadow.querySelector('.close-btn');

    const closeModal = () => {
        if (document.body.contains(host)) {
            document.body.removeChild(host);
        }
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    document.body.appendChild(host);
}

function showModalAllAppsHTML(message, title = 'Notification') {
    if (document.getElementById('isolated-js-modal-host')) return;

    const host = document.createElement('div');
    host.id = 'isolated-js-modal-host';
    host.style.position = 'relative';
    host.style.zIndex = '2147483647';

    const shadow = host.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
            :host { all: initial; }
            .overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: rgba(0, 0, 0, 0.65);
                display: flex; justify-content: center; align-items: flex-end; 
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                backdrop-filter: blur(3px); z-index: 2147483647;
            }
            .modal {
                width: 100%; margin: 0; padding: 24px 20px 32px 20px;
                border-radius: 24px 24px 0 0; box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.2);
                box-sizing: border-box; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                background-color: #ffffff; color: #111827;
            }
            .title { margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 700; line-height: 1.4; }
            .message { margin: 0 0 24px 0; font-size: 1rem; line-height: 1.6; color: #4b5563; white-space: normal; }
            .message img { max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 4px auto; }
            .close-btn {
                display: block; width: 100%; padding: 14px; border: none; border-radius: 12px;
                font-size: 1rem; font-weight: 600; cursor: pointer;
                transition: background-color 0.2s ease, transform 0.1s ease;
                background-color: #f3f4f6; color: #1f2937; touch-action: manipulation;
            }
            .close-btn:active { transform: scale(0.97); background-color: #e5e7eb; }
            @media (prefers-color-scheme: dark) {
                .modal { background-color: #1f2937; color: #f9fafb; border-top: 1px solid #374151; }
                .message { color: #d1d5db; }
                .close-btn { background-color: #374151; color: #f9fafb; }
                .close-btn:active { background-color: #4b5563; }
            }
            @media (min-width: 640px) {
                .overlay { align-items: center; }
                .modal {
                    width: 90%; max-width: 420px; padding: 24px; border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .close-btn:hover { background-color: #e5e7eb; }
                @media (prefers-color-scheme: dark) { .close-btn:hover { background-color: #4b5563; } }
            }
            @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
            @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        </style>
        <div class="overlay">
            <div class="modal">
                <h2 class="title"></h2>
                <div class="message"></div>
                <button class="close-btn">Close</button>
            </div>
        </div>
    `;

    shadow.appendChild(template.content.cloneNode(true));
    shadow.querySelector('.title').textContent = title;
    shadow.querySelector('.message').innerHTML = message;

    const overlay = shadow.querySelector('.overlay');
    const closeBtn = shadow.querySelector('.close-btn');

    const closeModal = () => {
        if (document.body.contains(host)) {
            document.body.removeChild(host);
        }
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    document.body.appendChild(host);
}