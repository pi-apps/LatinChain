// Configuración de los feeds RSS solicitados. Se han actualizado a HTTPS para mejorar la fiabilidad.
const FEED_CONFIGS = [
    { name: "BBC News (Global)", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "CNN (World News)", url: "http://rss.cnn.com/rss/cnn_world.rss" },
    //{ name: "CNN en español", url: "https://cnnespanol.cnn.com/feed/" },
    { name: "China Daily", url: "http://www.chinadaily.com.cn/rss/world_rss.xml" },
    { name: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms" },
    { name: "SCMP (South China Morning Post)", url: "https://www.scmp.com/rss/91/feed" },
    { name: "Contelegraph", url: "https://cointelegraph.com/rss" },
    { name: "TSMH (The Sydney Morning Herald)", url: "https://www.smh.com.au/rss/feed.xml" },
    { name: "Telesur English", url: "https://www.telesurenglish.net/feed/" },
    { name: "Aljazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { name: "HispanTV", url: "https://www.hispantv.com/services/news.asmx/Rss?category=-1" },
    { name: "RT (News)", url: "https://www.rt.com/rss/news" },
];

const feedsContainer = document.getElementById('feeds-container');
const loadingIndicator = document.getElementById('loading-indicator');

/**
 * Función para parsear el XML de un feed RSS y extraer los artículos.
 * Se aplica limpieza previa del texto para eliminar caracteres XML inválidos.
 * @param {string} xmlText - El texto XML del feed.
 * @returns {Array<Object>} Lista de artículos con título, enlace y fecha.
 */
function parseRss(xmlText) {
    // Limpieza de caracteres inválidos de XML que pueden causar 'error de sintaxis'.
    // Elimina caracteres de control (excepto tab, newline, carriage return)
    const cleanXmlText = xmlText.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
    
    const parser = new DOMParser();
    
    // Intentar parsear con "text/xml" limpio
    const xmlDoc = parser.parseFromString(cleanXmlText, "text/xml");
    
    // Si el parsing falla, se comprueba si hay un error de parseo.
    if (xmlDoc.querySelector('parsererror')) {
        // Si sigue fallando, registramos el error de sintaxis y devolvemos un array vacío
        console.error("Error al parsear el XML. Posiblemente mal formado:", xmlDoc.querySelector('parsererror').textContent);
        return [];
    }
    
    const items = xmlDoc.querySelectorAll("item");
    const articles = [];

    items.forEach(item => {
        const titleElement = item.querySelector("title");
        const linkElement = item.querySelector("link");
        
        // Adaptación para aceptar múltiples formatos de fechas, incluyendo ISO 8601 (2017-12-12T...).
        // Busca en orden: pubDate (RSS estándar), date, updated, o published (común en Atom o extensiones RSS).
        const dateElement = item.querySelector("pubDate") || 
                            item.querySelector("pubdate") || 
                            item.querySelector("date") ||
                            item.querySelector("updated") ||
                            item.querySelector("published");

        if (titleElement && linkElement) {
            const title = titleElement.textContent.trim();
            const link = linkElement.textContent.trim();
             
            let formattedDate = 'Fecha desconocida';
            let dateText = dateElement ? dateElement.textContent : null;
            
            if (dateText) {
                // FIX: Limpieza de la cadena de fecha para formatos RFC (ej. Mon, 12 Dec...)
                // que a menudo contienen comas o nombres de zona horaria entre paréntesis.
                // Esta limpieza es segura y no afecta negativamente al formato ISO 8601 solicitado.
                
                // 1. Eliminar contenido entre paréntesis (ej. nombres de zonas horarias).
                let cleanedDateText = dateText.replace(/\s+\(.*?\)/g, '');
                // 2. Reemplazar comas por espacios, ya que confunden el parseo en algunos formatos RFC.
                cleanedDateText = cleanedDateText.replace(/,/g, ' ').trim(); 

                // new Date() es compatible con ISO 8601 (2017-12-12T...) y RFC (Mon, 12 Dec...)
                const date = new Date(cleanedDateText);
                
                // Verificar la validez de la fecha utilizando getTime()
                if (date && !isNaN(date.getTime())) {
                    // Formatea la fecha a español
                    formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                }
            }

            // Limpiar el título de posibles prefijos "CDATA:" o "Feeds:"
            const cleanTitle = title.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim();

            articles.push({
                title: cleanTitle,
                link: link,
                date: formattedDate
            });
        }
    });

    // Limitar a los 5 artículos más recientes por feed para mantener la UI limpia
    return articles.slice(0, 5);
}

/**
 * Renderiza una sección completa de feed en el contenedor.
 * @param {string} feedName - Nombre de la fuente.
 * @param {Array<Object>} articles - Lista de artículos.
 */
function renderFeedSection(feedName, articles) {
    const feedSection = document.createElement('div');
    feedSection.className = "bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full";
    
    // Título de la fuente
    feedSection.innerHTML = `
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-primary-blue mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25m-18 0a2.25 2.25 0 0 0 2.25-2.25V5.625c0-.621.504-1.125 1.125-1.125H12M10.5 6H7.5m0 3h7.5m-9 3h9m-9 3h9" />
            </svg>
            ${feedName}
        </h2>
        <ul class="space-y-4 flex-grow">
            ${articles.map(article => `
                <li class="border-b last:border-b-0 pb-3">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="block group">
                        <p class="text-gray-900 font-medium group-hover:text-primary-blue transition-colors duration-200">${article.title}</p>
                        <span class="text-xs text-gray-500 mt-1 block">${article.date}</span>
                    </a>
                </li>
            `).join('')}
        </ul>
    `;
    feedsContainer.appendChild(feedSection);
}

/**
 * Maneja el caso de error o feed no cargado.
 * @param {string} feedName - Nombre de la fuente.
 * @param {string} message - Mensaje de error.
 */
function renderErrorSection(feedName, message) {
    const errorSection = document.createElement('div');
    errorSection.className = "bg-red-50 p-5 rounded-xl shadow-md border border-red-200 flex flex-col h-full";
    errorSection.innerHTML = `
        <h2 class="text-xl font-bold text-red-700 mb-4 border-b border-red-300 pb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.731 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            ${feedName} - Error
        </h2>
        <p class="text-red-600">${message}</p>
        <p class="text-xs text-red-500 mt-2">Intente más tarde. Es posible que la fuente RSS o el servicio proxy no estén disponibles.</p>
    `;
    feedsContainer.appendChild(errorSection);
}

/**
 * Intenta realizar un fetch utilizando un proxy CORS con reintentos y retroceso exponencial.
 * Se utiliza 'https://corsproxy.io/?' que devuelve el contenido directamente (no JSON).
 * @param {string} url - URL original del feed.
 * @param {number} retries - Número de reintentos restantes.
 * @returns {Promise<string>} El texto XML del feed.
 */
async function fetchAndProxyRss(url, retries = 3) {
    // Se utiliza corsproxy.io que devuelve el XML directamente, lo que debe solucionar el error 400.
    const PROXY_URL = 'https://corsproxy.io/?'; 
    // El proxy espera la URL codificada como parámetro directo
    const proxiedUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
    const factor = 1000; // 1 second

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(proxiedUrl);
            if (!response.ok) {
                // El status podría ser del proxy o del servidor destino (ej. 404, 500)
                throw new Error(`HTTP error! status: ${response.status} from proxy/target`);
            }
            
            // El proxy devuelve el texto plano (XML) directamente.
            const xmlText = await response.text();
            
            if (xmlText.trim().length === 0) {
                 throw new Error("Proxy returned empty content.");
            }
            
            return xmlText; 

        } catch (error) {
            if (i === retries - 1) {
                console.error(`Error final al obtener ${url} (a través de proxy):`, error);
                throw error;
            }
            const delay = Math.pow(2, i) * factor + Math.random() * factor;
            console.warn(`Error al obtener ${url}. Reintentando en ${Math.round(delay / 100) / 10}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // Si el bucle termina, significa que todos los reintentos fallaron
    throw new Error(`Fallo la obtención del feed después de ${retries} reintentos.`);
}

/**
 * Función principal para cargar y renderizar todos los feeds.
 */
async function loadAllFeeds() {
    // Limpiar errores anteriores si los hay
    feedsContainer.innerHTML = '';
    feedsContainer.appendChild(loadingIndicator);
    loadingIndicator.style.display = 'block'; // Mostrar indicador

    const fetchPromises = FEED_CONFIGS.map(async (config) => {
        try {
            // Ahora se utiliza la función con el nuevo proxy
            const xmlText = await fetchAndProxyRss(config.url);
            
            const articles = parseRss(xmlText);
            if (articles.length > 0) {
                renderFeedSection(config.name, articles);
            } else {
                renderErrorSection(config.name, "Feed cargado pero no se encontraron artículos (o el formato no es compatible).");
            }
        } catch (error) {
            // Si falla el fetch (ej. por CORS, red o error HTTP)
            console.error(`Fallo la carga del feed ${config.name}:`, error);
            renderErrorSection(config.name, `No se pudo cargar el feed. (${error.message || 'Error desconocido'})`);
        }
    });

    // Esperar a que todos los fetches terminen (exitosos o fallidos)
    await Promise.allSettled(fetchPromises);
    
    // Ocultar indicador
    loadingIndicator.style.display = 'none';
}

// Iniciar la carga de los feeds al cargar la página
window.onload = loadAllFeeds;
