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

      entries.forEach(entry => {
        // Si el elemento es visible y no lo hemos leído antes
        if (entry.isIntersecting && !spokenElements.has(entry.target)) {
          const textToSpeak = entry.target.textContent;
          if (textToSpeak.trim()) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const systemLanguage = navigator.language;
            const shortLang = systemLanguage.split(/[-_]/)[0];
            
            //alert("lang_synthesis " + lang_synthesis);
            const voices = window.speechSynthesis.getVoices();
            var voice_var;
            
            if(shortLang == "es")
            {
                voice_var = voices.find(v => v.lang.startsWith('es')) ||
                        voices.find(v => v.lang.startsWith('en'));
            }else
            {
                voice_var = voices.find(v => v.lang.startsWith('en'));
            }
                
            
            if (voice) {
              utterance.voice = voice_var;
            }

            window.speechSynthesis.speak(utterance);
            // Marcar el elemento como "leído" para no repetirlo
            spokenElements.add(entry.target);
          }
        }
      });
    };

    observer = new IntersectionObserver(callback, options);

    // Selecciona todos los elementos que quieres que sean leídos.
    // Puedes ajustar este selector para ser más específico (ej: 'p, h1, h2, li').
    document.querySelectorAll('p, h1, h2, li').forEach(element => {
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

$( document ).ready(function() {

    const STORAGE_KEY_BACKEND = 'speech_synthesis_active';

    if (localStorage.getItem(STORAGE_KEY_BACKEND) !== 'true' || !('speechSynthesis' in window)) {
        speechModule.deactivate();
    }else
    {
        speechModule.activate();
    }
});
