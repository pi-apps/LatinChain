"use strict";

const delayAsync = ms => new Promise(res => setTimeout(res, ms));

async function loadMessageLatinChain(){
    
    try{
        
        const loading_latinchain = document.getElementById('loading-message');

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
        video_latinchain.addEventListener('playing', () => {
            video_latinchain.style.display="block";
            //video_latinchain.width=250;
            //video_latinchain.height=150;
            video_latinchain_section.style.display="block";
        }, { once: true });
        
        video_latinchain.play();
        
    }catch(e)
    {
    }
    
}

document.addEventListener("DOMContentLoaded", () => {

    loadMessageLatinChain();
    
});

/*document.addEventListener('DOMContentLoaded', (event) => {
    $.ajaxSetup({
        timeout: 600000,
    });
});*/

function validateYouTubeUrl(url)
{
    if (url) {
        var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var match = url.match(regExp);
        if(match) {
            return match;
        }
    }
    return false;
}

function startLatinChainSports(show_content_div)
{
    $(show_content_div).html('<iframe src="https://www.scorebat.com/embed/livescore/" frameborder="0" width="600" height="760" allowfullscreen="true" allow="autoplay; fullscreen" style="width:100%;height:760px;overflow:hidden;display:block;" class="_scorebatEmbeddedPlayer_"></iframe>');
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://www.scorebat.com/embed/embed.js?v=arrv';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'scorebat-jssdk'));
}

function startLatinChainAcademy(show_content_div)
{
    $(show_content_div).html('<iframe src="https://drive.google.com/embeddedfolderview?id=1jhETR4rv-YCA1QDApX2lhTMvo8PMQnVR#list" style="width:100%; height:600px; border:0;"></iframe>');
}

function getGeminiImage()
{
    var img_array = ["/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Buenos_Aires.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Caracas.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Los_Angeles.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Mexico_City.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Seoul.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Shanghai.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Tokyo.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Vietnam.png?v=1.101",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Honduras.png?v=1.101"];
    
    var random_integer = Math.floor(Math.random() * img_array.length);
    
    return img_array[random_integer];
}

// speech-module.js

/**
 * Módulo para gestionar la síntesis de voz (Text-to-Speech) con localStorage.
 * Utiliza IntersectionObserver para leer solo el contenido visible.
 */
const speechModule = (() => {
  const STORAGE_KEY = 'speech_synthesis_active';
  let observer = null;
  const spokenElements = new Set();

  /**
   * 1. Activa la síntesis de voz en localStorage e inicia el observador.
   *
   * @returns {void}
   */
  const activateSpeech = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      console.log('Síntesis de voz activada.');
      setupObserver();
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  };

  /**
   * 2. Inicia el IntersectionObserver para monitorear los elementos visibles.
   * Lee el contenido de los elementos a medida que entran en el viewport.
   * Esta función ahora es interna.
   *
   * @returns {void}
   */
  const setupObserver = () => {
    if (!('IntersectionObserver' in window)) {
      console.error('IntersectionObserver no es compatible con este navegador.');
      return;
    }
    
    // Si ya hay un observador activo, lo desconecta primero.
    if (observer) {
        observer.disconnect();
    }

    // Opciones del observador: el callback se dispara cuando el 50% del elemento es visible.
    const options = {
      root: null, // El viewport
      rootMargin: '0px',
      threshold: 0.5,
    };

    const callback = (entries) => {
      if (localStorage.getItem(STORAGE_KEY) !== 'true' || !('speechSynthesis' in window)) {
        return;
      }
      
      window.speechSynthesis.cancel();
      spokenElements.clear();

      setTimeout(function() {
          entries.forEach(entry => {
            // Si el elemento es visible y no lo hemos leído antes
            if ((entry.isIntersecting) && !spokenElements.has(entry.target)) {
              const textToSpeak = entry.target.textContent;
              if (textToSpeak.trim()) {
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                const systemLanguage = navigator.language;
                const shortLang = systemLanguage.split(/[-_]/)[0];
                
                //alert("lang_synthesis " + lang_synthesis);
                const voices = window.speechSynthesis.getVoices();
                
                var savedLanguage1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/)[0];
                
                var voice = "";
                
                if (savedLanguage1) {
                    voice = voices.find(v => v.lang.startsWith(savedLanguage1)) ||
                            voices.find(v => v.lang.startsWith('en_US')) ||
                            voices.find(v => v.lang.startsWith('en-US')) ||
                            voices.find(v => v.lang.startsWith('en')) ||
                            voices.find(v => v.lang.startsWith(shortLang));
                }else
                {
                    voice = voices.find(v => v.lang.startsWith('en_US')) ||
                            voices.find(v => v.lang.startsWith('en-US')) ||
                            voices.find(v => v.lang.startsWith('en')) ||
                            voices.find(v => v.lang.startsWith(shortLang));
                }
                
                if(location.pathname.substring(0, 3) == "/es")
                {
                    if (savedLanguage1) {
                        voice = voices.find(v => v.lang.startsWith(savedLanguage1)) ||
                                voices.find(v => v.lang.startsWith('es_US')) ||
                                voices.find(v => v.lang.startsWith('es-US')) ||
                                voices.find(v => v.lang.startsWith('es')) ||
                                voices.find(v => v.lang.startsWith('en_US')) ||
                                voices.find(v => v.lang.startsWith('en-US')) ||
                                voices.find(v => v.lang.startsWith('en')) ||
                                voices.find(v => v.lang.startsWith(shortLang));
                    }else
                    {
                        voice = voices.find(v => v.lang.startsWith('es_US')) ||
                                voices.find(v => v.lang.startsWith('es-US')) ||
                                voices.find(v => v.lang.startsWith('es')) ||
                                voices.find(v => v.lang.startsWith('en_US')) ||
                                voices.find(v => v.lang.startsWith('en-US')) ||
                                voices.find(v => v.lang.startsWith('en')) ||
                                voices.find(v => v.lang.startsWith(shortLang));
                    }
                }
                
                if (voice) {
                    utterance.voice = voice;
                    utterance.lang = voice.lang;
                    utterance.pitch = 1;
                    utterance.rate = 1;
                    
                    /*if (voice) {
                        utterance.voice = voice;
                    }*/

                    window.speechSynthesis.speak(utterance);
                    // Marcar el elemento como "leído" para no repetirlo
                    spokenElements.add(entry.target);
                }
              }
            }
          });
      }, 1000);
    };

    observer = new IntersectionObserver(callback, options);

    // Selecciona todos los elementos que quieres que sean leídos.
    // Puedes ajustar este selector para ser más específico (ej: 'p, h1, h2, li').
    document.querySelectorAll('p, h1, h2, h3, h4, h5').forEach(element => {
      observer.observe(element);
    });
  };

  /**
   * 3. Desactiva la síntesis de voz en localStorage y detiene el observador.
   *
   * @returns {void}
   */
  const deactivateSpeech = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      spokenElements.clear();
      window.speechSynthesis.cancel(); // Detiene cualquier lectura en curso
      console.log('Síntesis de voz desactivada.');
    } catch (e) {
      console.error('Error al remover de localStorage:', e);
    }
  };

  // Se retornan solo las funciones públicas para su uso.
  return {
    activate: activateSpeech,
    deactivate: deactivateSpeech,
    observer: setupObserver
  };
})();

async function speak(textIncome){
    const textToSpeak = textIncome;
    if (textToSpeak.trim()) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const systemLanguage = navigator.language;
        const shortLang = systemLanguage.split(/[-_]/)[0];

        //alert("lang_synthesis " + lang_synthesis);
        const voices = window.speechSynthesis.getVoices();
        
        var savedLanguage1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/)[0];
                
        var voice = "";
        
        if (savedLanguage1) {
            voice = voices.find(v => v.lang.startsWith(savedLanguage1)) ||
                    voices.find(v => v.lang.startsWith('en_US')) ||
                    voices.find(v => v.lang.startsWith('en-US')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices.find(v => v.lang.startsWith(shortLang));
        }else
        {
            voice = voices.find(v => v.lang.startsWith('en_US')) ||
                    voices.find(v => v.lang.startsWith('en-US')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices.find(v => v.lang.startsWith(shortLang));
        }
        
        if(location.pathname.substring(0, 3) == "/es")
        {
            if (savedLanguage1) {
                voice = voices.find(v => v.lang.startsWith(savedLanguage1)) ||
                        voices.find(v => v.lang.startsWith('es_US')) ||
                        voices.find(v => v.lang.startsWith('es-US')) ||
                        voices.find(v => v.lang.startsWith('es')) ||
                        voices.find(v => v.lang.startsWith('en_US')) ||
                        voices.find(v => v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith(shortLang));
            }else
            {
                voice = voices.find(v => v.lang.startsWith('es_US')) ||
                        voices.find(v => v.lang.startsWith('es-US')) ||
                        voices.find(v => v.lang.startsWith('es')) ||
                        voices.find(v => v.lang.startsWith('en_US')) ||
                        voices.find(v => v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith(shortLang));
            }
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
    if(location.pathname.substring(0, 13) != "/webcamplayer" && 
        location.pathname.substring(0, 16) != "/es/webcamplayer" &&
        location.pathname.substring(0, 19) != "/texttospeechplayer" && 
        location.pathname.substring(0, 22) != "/es/texttospeechplayer" &&
        location.pathname.substring(0, 5) != "/web" && 
        location.pathname.substring(0, 8) != "/es/web" &&
        location.pathname.substring(0, 5) != "/web/" && 
        location.pathname.substring(0, 8) != "/es/web/" &&
        location.pathname.substring(0, 5) != "/web?" && 
        location.pathname.substring(0, 8) != "/es/web?")
    {
        const STORAGE_KEY_BACKEND = 'speech_synthesis_active';
        
        if (localStorage.getItem(STORAGE_KEY_BACKEND) !== 'true'){ // || !('speechSynthesis' in window)) {
            speechModule.deactivate();
        }else
        {
            speechModule.activate();
        }
    }
}

document.addEventListener('DOMContentLoaded', loadSpeechLanguages);

/*
 * Here starts the language translation
 * */

var is_changing_page = false;

var avoidAsking = false;

var observer1_state = false;
var observer1 = false;

if(location.pathname.substring(0, 5) != "/web" && 
    location.pathname.substring(0, 8) != "/es/web" && 
    location.pathname.substring(0, 5) != "/web/" && 
    location.pathname.substring(0, 8) != "/es/web/" && 
    location.pathname.substring(0, 5) != "/web?" && 
    location.pathname.substring(0, 8) != "/es/web?")
{
    observer1 = new MutationObserver(() => checkLang());
    observer1_state = true;
}else
{
    observer1_state = false;
}

var hashLatinChainGoogleTranslate = "";

var checkLang = () => {
    if(!is_changing_page)
    {
        var lang1 = window.document.documentElement.getAttribute('lang').split(/[-_]/);
        var lang = lang1[0];
        try{
            if(lang1[1])
                lang += "-" + lang1[1];
        }catch(e){
        }
        
        if(lang)
        {
            if(window.location.pathname.substring(0, 3) == "/es" && lang != "es")
            {
                localStorage.setItem('lastTranslateLanguage', lang);
            }else if(location.pathname.substring(0, 3) != "/es" && lang != "en")
            {
                localStorage.setItem('lastTranslateLanguage', lang);
            }else if(window.location.pathname.substring(0, 3) == "/es" && lang == "es")
            {
                localStorage.setItem('lastTranslateLanguage', "es");
            }else if(location.pathname.substring(0, 3) != "/es" && lang == "en")
            {
                localStorage.setItem('lastTranslateLanguage', "en");
            }
        }
        loadLang();
    }else if(is_changing_page == "changing")
    {
        is_changing_page = false;
    }
};

var loadLang = () => {
    if(!is_changing_page)
    {
        var lang1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/);
        var savedLanguage1 = lang1[0];
        try{
            if(lang1[1])
                savedLanguage1 += "-" + lang1[1];
        }catch(e){
        }
        
        // If a language was found, set the URL hash to load it automatically.
        // This is still needed to trigger the initial translation on page load.
        if (savedLanguage1) {
            var original_lang = "en";
            if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 != "es")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 != "en")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 == "es")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 == "en")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(${original_lang}|${savedLanguage1})`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) == "/es" && savedLanguage1 == "auto")
            {
                original_lang = "es";
                window.location.hash = `#googtrans(es|es)`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }else if(window.location.pathname.substring(0, 3) != "/es" && savedLanguage1 == "auto")
            {
                original_lang = "en";
                window.location.hash = `#googtrans(en|en)`;
                hashLatinChainGoogleTranslate = window.location.hash;
            }
        }
    }
};

var loadLangInitial = () => {
    if (localStorage.getItem('lastTranslateLanguage') != null) {
        var lang1 = localStorage.getItem('lastTranslateLanguage').split(/[-_]/);
        var savedLanguage1 = lang1[0];
        try{
            if(lang1[1])
                savedLanguage1 += "-" + lang1[1];
        }catch(e){
        }
        
        // If a language was found, set the URL hash to load it automatically.
        // This is still needed to trigger the initial translation on page load.
        
        if (savedLanguage1) {
            document.documentElement.setAttribute('lang', savedLanguage1);
        }
    }else{
        if(window.location.pathname.substring(0, 3) == "/es")
        {
            document.documentElement.setAttribute('lang', 'es');
            localStorage.setItem('lastTranslateLanguage', 'es');
        }else if(location.pathname.substring(0, 3) != "/es")
        {
            document.documentElement.setAttribute('lang', 'en');
            localStorage.setItem('lastTranslateLanguage', 'en');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    is_changing_page = false;
    
    if(observer1_state)
    {
        observer1.observe(window.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        loadLangInitial();
    }
});

window.onbeforeunload = () => {
    is_changing_page = true;
    if(observer1_state)
        observer1.disconnect();
    
    if('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    /*if(!avoidAsking)
    {
        observer1 = new MutationObserver(() => checkLang());
        observer1.observe(window.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        is_changing_page = "changing";    
        
        return true;
    }*/
};
                        
function unloadMessage(on) {
    if(on)
    {
        window.onbeforeunload = () => {
            is_changing_page = true;
            if(observer1_state)
                observer1.disconnect();
            
            if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            
            if(!avoidAsking)
            {
                if(observer1_state)
                {
                    observer1 = new MutationObserver(() => checkLang());
                    observer1.observe(window.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
                }
                is_changing_page = "changing";    
                
                return true;
            }
        };
    }else
    {
        window.onbeforeunload = () => {
            is_changing_page = true;
            if(observer1_state)
                observer1.disconnect();
            
            if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }
}

var googleTranslateElementInit = () => {
    if(location.pathname.substring(0, 5) != "/web" && 
        location.pathname.substring(0, 8) != "/es/web" && 
        location.pathname.substring(0, 5) != "/web/" && 
        location.pathname.substring(0, 8) != "/es/web/" && 
        location.pathname.substring(0, 5) != "/web?" && 
        location.pathname.substring(0, 8) != "/es/web?")
    {
        var lang_google='en';
        if(location.pathname.substring(0, 16) == "/es/webcamplayer")
        {
          lang_google='en';
        }else if(location.pathname.substring(0, 3) == "/es")
        {
          lang_google='es';
        }

        new google.translate.TranslateElement({pageLanguage: lang_google,
                                            autoDisplay: true,
                                            multilanguagePage: false,
                                            layout: google.translate.TranslateElement.InlineLayout.VERTICAL}, 
                                            'google_translate_element');

        //const el = document.querySelector('#goog-gt-');
        //const el2 = document.querySelector('.skiptranslate');
        const el3 = document.querySelector('circle');
        var translateWidth;
        var translateImg;
        //const el4 = document.querySelector('.goog-te-gadget');
        const observer = new window.IntersectionObserver(([entry]) => {
            /*for(var i = 0; i &lt; document.getElementsByClassName("skiptranslate").length; i++)
            {
                for(var j = 0; j &lt; document.getElementsByClassName("skiptranslate")[i].childNodes.length; j++)
                {
                    if(document.getElementsByClassName("skiptranslate")[i].childNodes[j].tagName == "IFRAME")
                        document.getElementsByClassName("skiptranslate")[i].style.display = "none";
                }
            }
            document.getElementById("goog-gt-").style.display = "none";*/
            document.getElementsByTagName("circle")[0].parentNode.parentNode.style.display = "none";
            
            translateWidth = document.querySelector('a[href="https://translate.google.com"]');

            if (translateWidth) {
                
                translateWidth.style.maxWidth = "500px";
                translateWidth.style.width = "fit-content";
                translateWidth.style.display = "inline-flex";
                translateWidth.style.alignItems = "baseline";
                translateWidth.style.height = "auto";
                
                translateImg = translateWidth.querySelector('img');
                
                translateImg.style.alignItems = "baseline";
                translateImg.style.height = "auto";
                translateImg.style.marginTop = "auto";
            }
        }, {
            root: null,
            threshold: 0.1, // set offset 0.1 means trigger if atleast 10% of element in viewport
        });

        //observer.observe(el);
        //observer.observe(el2);
        observer.observe(el3);
        //observer.observe(el4);
    }
};


/*
 * Here finish the language translation
 * */

function showModalAllApps(message, title = 'Notification') {
    // 1. Prevent duplicate modals from stacking
    if (document.getElementById('isolated-js-modal-host')) {
        return;
    }

    // 2. Create the host element for the Shadow DOM
    const host = document.createElement('div');
    host.id = 'isolated-js-modal-host';
    host.style.position = 'relative';
    host.style.zIndex = '2147483647'; // Maximum possible z-index

    // 3. Attach the Shadow DOM to isolate styles
    const shadow = host.attachShadow({ mode: 'open' });

    // 4. Define the HTML and Mobile-First CSS internally
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
            :host {
                all: initial; /* Reset inherited styles */
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.65);
                display: flex;
                justify-content: center;
                /* MOBILE FIRST: Align bottom for easier thumb reach */
                align-items: flex-end; 
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                backdrop-filter: blur(3px);
                z-index: 2147483647;
            }
            .modal {
                /* MOBILE FIRST Base Styles */
                width: 100%;
                margin: 0;
                padding: 24px 20px 32px 20px; /* Extra bottom padding for mobile safe areas */
                border-radius: 24px 24px 0 0; /* Rounded top corners only */
                box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                
                background-color: #ffffff;
                color: #111827;
            }
            .title {
                margin: 0 0 12px 0;
                font-size: 1.25rem;
                font-weight: 700;
                line-height: 1.4;
            }
            .message {
                margin: 0 0 24px 0;
                font-size: 1rem;
                line-height: 1.6;
                color: #4b5563;
            }
            .close-btn {
                display: block;
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.2s ease, transform 0.1s ease;
                background-color: #f3f4f6;
                color: #1f2937;
                touch-action: manipulation; /* Improves mobile tap responsiveness */
            }
            .close-btn:active { 
                transform: scale(0.97); 
                background-color: #e5e7eb;
            }

            /* Automatic Dark Mode Resistance */
            @media (prefers-color-scheme: dark) {
                .modal {
                    background-color: #1f2937;
                    color: #f9fafb;
                    border-top: 1px solid #374151;
                }
                .message {
                    color: #d1d5db;
                }
                .close-btn {
                    background-color: #374151;
                    color: #f9fafb;
                }
                .close-btn:active { 
                    background-color: #4b5563; 
                }
            }

            /* DESKTOP/TABLET OVERRIDES (min-width handles responsiveness) */
            @media (min-width: 640px) {
                .overlay {
                    align-items: center; /* Center the modal on larger screens */
                }
                .modal {
                    width: 90%;
                    max-width: 420px;
                    padding: 24px;
                    border-radius: 16px; /* Fully rounded on desktop */
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
                    animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    border: none; /* Remove dark mode top-border override */
                }
                @media (prefers-color-scheme: dark) {
                    .modal { border: 1px solid #374151; }
                }
                .close-btn:hover {
                    background-color: #e5e7eb;
                }
                @media (prefers-color-scheme: dark) {
                    .close-btn:hover { background-color: #4b5563; }
                }
            }

            /* Animations */
            @keyframes slideUp {
                0% { transform: translateY(100%); }
                100% { transform: translateY(0); }
            }
            @keyframes popIn {
                0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
        </style>

        <div class="overlay">
            <div class="modal">
                <h2 class="title"></h2>
                <p class="message"></p>
                <button class="close-btn">Close</button>
            </div>
        </div>
    `;

    // 5. Inject the template
    shadow.appendChild(template.content.cloneNode(true));

    // 6. Set text safely
    shadow.querySelector('.title').textContent = title;
    shadow.querySelector('.message').textContent = message;

    // 7. Handle closing logic
    const overlay = shadow.querySelector('.overlay');
    const closeBtn = shadow.querySelector('.close-btn');

    const closeModal = () => {
        document.body.removeChild(host);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // 8. Append to display
    document.body.appendChild(host);
}
