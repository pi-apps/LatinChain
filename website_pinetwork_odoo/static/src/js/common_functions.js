const delayAsync = ms => new Promise(res => setTimeout(res, ms));

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
    var img_array = ["/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Buenos_Aires.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Caracas.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Los_Angeles.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Mexico_City.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Seoul.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Shanghai.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Tokyo.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Vietnam.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Honduras.png"];
    
    var random_integer = Math.floor(Math.random() * 9);
    
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
var observer1;

var changeLanguage = () => {
    // Get the new language from the 'lang' attribute
    var newLang = document.documentElement.getAttribute('lang').split(/[-_]/)[0];

    // Get the base language of the page based on the URL path
    var pageLang = window.location.pathname.startsWith('/es') ? 'es' : 'en';

    // Update the Google Translate hash to trigger the translation
    // Only set the hash if the target language is different from the page's original language
    //window.location.hash = `#googtrans(${pageLang}|${newLang})`;
    if (newLang != pageLang) {
        window.location.hash = `#googtrans(${pageLang}|${newLang})`;
    } else {
        // If the language is the same as the page's base language or null,
        // we can clear the hash to remove the translation bar.
        window.location.hash = '';
    }

    // Save the new language to local storage
    if (newLang) {
        localStorage.setItem('lastTranslateLanguage', newLang);
    }
};

const setupLanguageObserver = () => {
    // Disconnect any existing observer to prevent duplicates
    if (observer1) {
        observer1.disconnect();
    }

    // Create a new MutationObserver
    observer1 = new MutationObserver(() => {
        // Only run the language change logic if we are not in the process of leaving the page
        if (!is_changing_page) {
            changeLanguage();
        } else {
            // If the user cancelled the page change, reset the flag and reconnect the observer
            is_changing_page = false;
        }
    });

    // Start observing the 'lang' attribute on the <html> tag
    observer1.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });
};

const setInitialLanguage = () => {
    const savedLang = localStorage.getItem('lastTranslateLanguage');
    const pageLang = window.location.pathname.startsWith('/es') ? 'es' : 'en';

    // If a language was previously saved, set the 'lang' attribute
    // to trigger the initial translation.
    if (savedLang) {
        document.documentElement.setAttribute('lang', savedLang.split(/[-_]/)[0]);
    } else {
        // If no language is saved, set the 'lang' attribute based on the page URL
        document.documentElement.setAttribute('lang', pageLang);
        localStorage.setItem('lastTranslateLanguage', pageLang);
    }
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    setInitialLanguage();
    setupLanguageObserver();
});

window.onbeforeunload = () => {
    // When the user attempts to leave the page, set the flag.
    is_changing_page = true;
    
    if ('speechSynthesis' in window)
    {
        window.speechSynthesis.cancel();
    }
};
                        
function unloadMessage(on) {
    if(on)
    {
        window.onbeforeunload = () => {
            // When the user attempts to leave the page, set the flag.
            is_changing_page = true;
            
            if ('speechSynthesis' in window)
            {
                window.speechSynthesis.cancel();
            }
            
            return true;
        };
    }else
    {
        window.onbeforeunload = () => {
            // When the user attempts to leave the page, set the flag.
            is_changing_page = true;
            
            if ('speechSynthesis' in window)
            {
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
        if(location.pathname.substring(0, 3) == "/es")
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
