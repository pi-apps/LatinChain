// Base de datos del curso con contexto cultural para La Guajira venezolana
const courseData = {
    beginner: [
        {
            id: "b1",
            title: { es: "Saludos y Etiqueta", en: "Greetings & Etiquette" },
            desc: { es: "Lo básico para interactuar con respeto en la Guajira.", en: "Basics to interact respectfully in La Guajira." },
            icon: "ph-hand-waving", color: "bg-orange-100 text-guajira-clay",
            vocab: [
                { w: "Jamaya", es: "¿Cómo estás?", en: "How are you?", pron: { es: "ja-MA-ya", en: "hah-MAH-yah" } },
                { w: "Ketta'a", es: "Buenos días", en: "Good morning", pron: { es: "ke-TA-a", en: "keh-TAH-ah" } },
                { w: "Asaa", es: "Hola / De acuerdo", en: "Hello / Agreed", pron: { es: "a-SA-a", en: "ah-SAH-ah" } },
                { w: "Anashii", es: "Bien / Bueno", en: "Good / Well", pron: { es: "a-NA-shi", en: "ah-NAH-shee" } },
                { w: "Taya", es: "Yo", en: "I / Me", pron: { es: "TA-ya", en: "TAH-yah" } },
                { w: "Pia", es: "Tú", en: "You", pron: { es: "PI-a", en: "PEE-ah" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Al llegar a una ranchería (comunidad), la etiqueta es fundamental. No interrumpas. El saludo 'Jamaya' a menudo se responde con 'Anashii' (bien). El Wayuunaiki diferencia el género: la forma en que hablas cambia ligeramente si te diriges a un hombre o a una mujer.",
                en: "<strong>Guajira Immersion:</strong> When arriving at a 'ranchería' (community), etiquette is key. 'Jamaya' is often answered with 'Anashii'. Wayuunaiki differentiates gender based on who you speak to."
            }
        },
        {
            id: "b2",
            title: { es: "Identidad y Entorno", en: "Identity & Environment" },
            desc: { es: "Quién eres y el mundo natural que te rodea.", en: "Who you are and the natural world around you." },
            icon: "ph-identification-card", color: "bg-red-100 text-guajira-earth",
            vocab: [
                { w: "Alijuna", es: "Extranjero / No Wayuu", en: "Foreigner / Non-Wayuu", pron: { es: "a-li-JU-na", en: "ah-lee-HOO-nah" } },
                { w: "Wayuu", es: "Persona Indígena", en: "Indigenous person", pron: { es: "wa-YUU", en: "wah-YOO" } },
                { w: "Mma", es: "Tierra / Territorio", en: "Earth / Territory", pron: { es: "M-ma", en: "M-mah" } },
                { w: "Pala'a", es: "Mar", en: "Sea", pron: { es: "pa-LA-a", en: "pah-LAH-ah" } },
                { w: "Uchi", es: "Monte / Selva", en: "Bush / Jungle", pron: { es: "U-chi", en: "OO-chee" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Prepárate para ser llamado 'Alijuna'. No es un insulto, es la categorización del mundo: estás tú (Alijuna) y ellos (Wayuu). La Tierra (Mma) no es algo que se posee, es de donde se viene.",
                en: "<strong>Guajira Immersion:</strong> Be prepared to be called 'Alijuna'. It's not an insult, just a category. The Earth (Mma) is not owned, it's where one comes from."
            }
        },
        {
            id: "b3",
            title: { es: "Supervivencia y Comida", en: "Survival & Food" },
            desc: { es: "Vocabulario vital para el día a día.", en: "Vital vocabulary for daily life." },
            icon: "ph-bowl-food", color: "bg-amber-100 text-amber-700",
            vocab: [
                { w: "Wüin", es: "Agua", en: "Water", pron: { es: "WU-in", en: "WOO-in" } },
                { w: "Juriicha", es: "Friche (Plato de chivo)", en: "Friche (Goat dish)", pron: { es: "ju-RII-cha", en: "hoo-REE-chah" } },
                { w: "Asaa wüin", es: "Tomar agua", en: "Drink water", pron: { es: "a-SA-a WU-in", en: "ah-SAH-ah WOO-in" } },
                { w: "Ekiisha", es: "Hambre", en: "Hunger", pron: { es: "e-KII-sha", en: "eh-KEE-shah" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> El agua (Wüin) es el recurso más sagrado y escaso en la Guajira. Si te ofrecen chicha de maíz (Uujolu) o Friche (Juriicha - chivo frito en su sangre), acéptalo. Rechazar comida es una gran ofensa.",
                en: "<strong>Guajira Immersion:</strong> Water (Wüin) is sacred and scarce. If offered corn drink or Friche (traditional goat), accept it. Rejecting food is deeply offensive."
            }
        }
    ],
    intermediate: [
        {
            id: "i1",
            title: { es: "Números (1 al 10)", en: "Numbers (1 to 10)" },
            desc: { es: "La base decimal del Wayuunaiki.", en: "The decimal base of Wayuunaiki." },
            icon: "ph-list-numbers", color: "bg-yellow-100 text-guajira-sun",
            vocab: [
                { w: "Wanee", es: "Uno", en: "One", pron: { es: "wa-NEE", en: "wah-NEH" } },
                { w: "Piama", es: "Dos", en: "Two", pron: { es: "PIA-ma", en: "PYAH-mah" } },
                { w: "Apünüin", es: "Tres", en: "Three", pron: { es: "a-PU-nu-in", en: "ah-POO-noo-in" } },
                { w: "Pienchi", es: "Cuatro", en: "Four", pron: { es: "PIEN-chi", en: "PYEN-chee" } },
                { w: "Ja'rai", es: "Cinco", en: "Five", pron: { es: "JA-rai", en: "HAH-rye" } },
                { w: "Aipirua", es: "Seis", en: "Six", pron: { es: "ai-PI-ru-a", en: "eye-PEE-roo-ah" } },
                { w: "Akaraishi", es: "Siete", en: "Seven", pron: { es: "a-ka-RAI-shi", en: "ah-kah-RYE-shee" } },
                { w: "Mekiisat", es: "Ocho", en: "Eight", pron: { es: "me-KII-sat", en: "meh-KEE-saht" } },
                { w: "Meketsat", es: "Nueve", en: "Nine", pron: { es: "me-KE-tsat", en: "meh-KEH-tsaht" } },
                { w: "Po'loo", es: "Diez", en: "Ten", pron: { es: "po-LOO", en: "poh-LOO" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> El Wayuunaiki tiene un sistema de base 10 perfecto. Para decir 11, dices 'Po'loo waneemüin' (Diez con uno). Es vital dominar del 1 al 10 para regatear pasajes en los carritos por puesto hacia Sinamaica o Paraguaipoa.",
                en: "<strong>Guajira Immersion:</strong> Wayuunaiki uses a perfect base-10 system. Mastering 1-10 is vital for bargaining transportation to local towns."
            }
        },
        {
            id: "i2",
            title: { es: "Cifras Mayores y Comercio", en: "Large Numbers & Trade" },
            desc: { es: "Comprando en el mercado de Los Filúos.", en: "Shopping in the local markets." },
            icon: "ph-storefront", color: "bg-green-100 text-green-700",
            vocab: [
                { w: "Piama shikii", es: "Veinte (Dos decenas)", en: "Twenty", pron: { es: "PIA-ma shi-KII", en: "PYAH-mah shee-KEE" } },
                { w: "Po'loo shikii", es: "Cien (Diez decenas)", en: "One Hundred", pron: { es: "po-LOO shi-KII", en: "poh-LOO shee-KEE" } },
                { w: "Waneeshi miyo'u", es: "Un Millón", en: "One Million", pron: { es: "wa-NEE-shi mi-YO-u", en: "wah-NEH-shee mee-YOH-oo" } },
                { w: "Miyo'u ma'in", es: "Mil Millones (Cantidad inmensa)", en: "One Billion", pron: { es: "mi-YO-u MA-in", en: "mee-YOH-oo MAH-in" } },
                { w: "Nnerü", es: "Dinero", en: "Money", pron: { es: "N-ne-ru", en: "N-neh-roo" } },
                { w: "Katsüin / Motso", es: "Caro / Barato", en: "Expensive / Cheap", pron: { es: "ka-TSU-in / MO-tso", en: "kah-TSOO-in / MOH-tsoh" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> 'Shikii' significa cabeza/decena. 20 es 'dos cabezas' (Piama shikii). Para montos como millones o miles de millones (por la inflación en bolívares o pesos colombianos), los Wayuu a menudo usan préstamos del español adaptados, o dicen 'Miyo'u ma'in' (demasiado grande).",
                en: "<strong>Guajira Immersion:</strong> 'Shikii' means ten. 20 is 'two tens'. For massive economic figures like millions/billions, they adapt Spanish words or use descriptions like 'very large'."
            }
        },
        {
            id: "i3",
            title: { es: "Tiempo y Clima", en: "Time & Weather" },
            desc: { es: "Entendiendo los ciclos del desierto.", en: "Understanding desert cycles." },
            icon: "ph-sun", color: "bg-blue-100 text-blue-700",
            vocab: [
                { w: "Ka'i", es: "Sol / Día", en: "Sun / Day", pron: { es: "KA-i", en: "KAH-ee" } },
                { w: "Kashi", es: "Luna / Mes", en: "Moon / Month", pron: { es: "KA-shi", en: "KAH-shee" } },
                { w: "Juyá", es: "Lluvia / Año", en: "Rain / Year", pron: { es: "ju-YA", en: "hoo-YAH" } },
                { w: "Jemiai", es: "Frío (de noche)", en: "Cold", pron: { es: "je-MIAI", en: "heh-MYEYE" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> En la Guajira el tiempo se mide por el entorno. 'Juyá' es la lluvia, pero también significa 'Año' y es una entidad masculina que fecunda a 'Mma' (la Tierra). Si llueve, hay fiesta y prosperidad.",
                en: "<strong>Guajira Immersion:</strong> Time is measured by the environment. 'Juyá' (Rain) also means 'Year', acting as a male entity that fertilizes the Earth. Rain means prosperity."
            }
        }
    ],
    advanced: [
        {
            id: "a1",
            title: { es: "El Sistema de Clanes", en: "The Clan System" },
            desc: { es: "La estructura matrilineal (Eiruku).", en: "The matrilineal structure." },
            icon: "ph-users-three", color: "bg-purple-100 text-purple-700",
            vocab: [
                { w: "Eiruku", es: "Clan / Carne", en: "Clan / Flesh", pron: { es: "ei-RU-ku", en: "ay-ROO-koo" } },
                { w: "Ta'laüla", es: "Tío materno", en: "Maternal uncle", pron: { es: "ta-LA-u-la", en: "tah-LAH-oo-lah" } },
                { w: "Eirü", es: "Madre / Tía materna", en: "Mother / Maternal aunt", pron: { es: "EI-ru", en: "AY-roo" } },
                { w: "Uriana / Jayaliyuu", es: "Nombres de clanes", en: "Clan names", pron: { es: "u-RIA-na", en: "oo-RYAH-nah" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> ESTO ES VITAL. Los Wayuu son matrilineales. Tú heredas la sangre y el apellido (el clan) de tu MADRE, no de tu padre. El hombre más importante en la vida de un niño no es su padre biológico, sino su tío materno (Ta'laüla), quien es la autoridad legal del clan.",
                en: "<strong>Guajira Immersion:</strong> CRUCIAL: Wayuu are matrilineal. You inherit your clan from your MOTHER. The most important male figure is the maternal uncle (Ta'laüla), who holds legal authority."
            }
        },
        {
            id: "a2",
            title: { es: "Ley y Justicia Wayuu", en: "Wayuu Law & Justice" },
            desc: { es: "Cómo se resuelven los conflictos.", en: "How conflicts are resolved." },
            icon: "ph-scales", color: "bg-indigo-100 text-indigo-700",
            vocab: [
                { w: "Pütchipü'ü", es: "El Palabrero", en: "The Word Carrier", pron: { es: "pu-tchi-PU-u", en: "poo-chee-POO-oo" } },
                { w: "Pütchi", es: "La Palabra / El mensaje", en: "The Word / Message", pron: { es: "PU-tchi", en: "POO-chee" } },
                { w: "Maüna", es: "Compensación (pago)", en: "Compensation (payment)", pron: { es: "MA-u-na", en: "MAH-oo-nah" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Si tienes un problema (accidente, ofensa), NUNCA busques a la policía ordinaria (Alijuna). El conflicto es entre clanes. Se llama a un 'Pütchipü'ü' (Palabrero, Patrimonio de la Humanidad por la UNESCO) quien media para establecer una compensación ('Maüna', pagada en chivos, collares o dinero) para restaurar la paz.",
                en: "<strong>Guajira Immersion:</strong> For conflicts, never call regular police. Conflicts are clan-based. A 'Pütchipü'ü' (Word Carrier) mediates to set a 'Maüna' (compensation in goats/money) to restore peace."
            }
        },
        {
            id: "a3",
            title: { es: "Espiritualidad", en: "Spirituality" },
            desc: { es: "El mundo de los sueños y los muertos.", en: "The world of dreams and the dead." },
            icon: "ph-sparkle", color: "bg-fuchsia-100 text-fuchsia-700",
            vocab: [
                { w: "Maleiwa", es: "Dios creador", en: "Creator God", pron: { es: "ma-LEI-wa", en: "mah-LAY-wah" } },
                { w: "Lapü", es: "Los Sueños", en: "Dreams", pron: { es: "LA-pu", en: "LAH-poo" } },
                { w: "Yolujaa", es: "Espíritu de los muertos", en: "Spirit of the dead", pron: { es: "yo-lu-JA-a", en: "yoh-loo-HAH-ah" } },
                { w: "Seyuu", es: "Espíritu protector", en: "Protector spirit", pron: { es: "se-YUU", en: "seh-YOO" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Los sueños ('Lapü') no son fantasías, son mensajes reales del más allá. Si un Wayuu sueña algo malo, se toman medidas inmediatas (baños, sacrificios). Los difuntos no desaparecen, se vuelven 'Yolujaa' y viajan a Jepira (el cabo de la Vela), para luego volver como lluvia.",
                en: "<strong>Guajira Immersion:</strong> Dreams ('Lapü') are real messages from beyond. If a Wayuu dreams something bad, immediate rituals are done. The dead become 'Yolujaa' and travel to Jepira."
            }
        }
    ]
};

// State variables
let currentLang = localStorage.getItem('wayuunaiki_lang') || 'es';
let currentLevel = 'beginner';

// i18n Dictionary
const i18n = {
    es: {
        subtitle: "Aprende & Conecta",
        welcomeTitle: "Bienvenido a la Guajira",
        welcomeDesc: "Aprende el idioma de la gente de arena, sol y viento. Selecciona tu nivel para comenzar tu inmersión cultural.",
        lblBeginner: "Básico",
        lblIntermediate: "Intermedio",
        lblAdvanced: "Avanzado",
        footerText: "Diseñado para prepararte para la vida en la Guajira venezolana.",
        startLesson: "Ver Lección",
        closeLesson: "Completar Lección",
        pronunciationTitle: "Guía de pronunciación:",
        deepDive: "Notas de Inmersión Cultural"
    },
    en: {
        subtitle: "Learn & Connect",
        welcomeTitle: "Welcome to La Guajira",
        welcomeDesc: "Learn the language of the people of sand, sun, and wind. Select your level to begin your cultural immersion.",
        lblBeginner: "Beginner",
        lblIntermediate: "Intermediate",
        lblAdvanced: "Advanced",
        footerText: "Designed to prepare you for life in the Venezuelan Guajira.",
        startLesson: "View Lesson",
        closeLesson: "Complete Lesson",
        pronunciationTitle: "Pronunciation guide:",
        deepDive: "Deep Cultural Notes"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    
    // Guardar en localStorage
    try {
        localStorage.setItem('wayuunaiki_lang', lang);
    } catch (e) {
        console.warn("localStorage no está disponible", e);
    }
    
    // Update toggle UI
    document.getElementById('btn-es').className = `px-3 py-1 rounded-full text-sm font-semibold transition-colors ${lang === 'es' ? 'bg-guajira-sun text-white' : 'text-gray-500 hover:text-guajira-dark'}`;
    document.getElementById('btn-en').className = `px-3 py-1 rounded-full text-sm font-semibold transition-colors ${lang === 'en' ? 'bg-guajira-sun text-white' : 'text-gray-500 hover:text-guajira-dark'}`;
    
    // Update static texts
    document.getElementById('header-subtitle').innerText = i18n[lang].subtitle;
    document.getElementById('welcome-title').innerText = i18n[lang].welcomeTitle;
    document.getElementById('welcome-desc').innerText = i18n[lang].welcomeDesc;
    document.getElementById('lbl-beginner').innerText = i18n[lang].lblBeginner;
    document.getElementById('lbl-intermediate').innerText = i18n[lang].lblIntermediate;
    document.getElementById('lbl-advanced').innerText = i18n[lang].lblAdvanced;
    document.getElementById('footer-text').innerText = i18n[lang].footerText;
    document.getElementById('btn-close-modal').innerText = i18n[lang].closeLesson;

    // Re-render current modules to update their language
    renderModules();
}

function setLevel(level) {
    currentLevel = level;
    
    // Reset all tabs styles
    const tabs = ['beginner', 'intermediate', 'advanced'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (t === level) {
            el.className = "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-guajira-clay text-white shadow-md";
        } else {
            el.className = "flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-gray-500 hover:text-guajira-earth";
        }
    });

    renderModules();
}

function renderModules() {
    const grid = document.getElementById('modules-grid');
    grid.innerHTML = ''; // Clear current

    const modules = courseData[currentLevel];
    
    modules.forEach(mod => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1";
        card.onclick = () => openModal(mod.id);
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${mod.color}">
                    <i class="ph ${mod.icon}"></i>
                </div>
                <div class="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    ${i18n[currentLang][`lbl${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}`]}
                </div>
            </div>
            <h3 class="text-xl font-bold text-guajira-dark mb-2">${mod.title[currentLang]}</h3>
            <p class="text-gray-600 text-sm mb-5 line-clamp-2">${mod.desc[currentLang]}</p>
            <div class="flex items-center text-guajira-clay font-bold text-sm">
                <span>${i18n[currentLang].startLesson}</span>
                <i class="ph ph-arrow-right ml-2 text-lg"></i>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openModal(id) {
    // Find module data
    const allModules = [...courseData.beginner, ...courseData.intermediate, ...courseData.advanced];
    const mod = allModules.find(m => m.id === id);
    if (!mod) return;

    // Set Header
    document.getElementById('modal-title').innerText = mod.title[currentLang];
    document.getElementById('modal-icon').className = `ph ${mod.icon}`;
    document.getElementById('modal-icon-container').className = `w-10 h-10 rounded-full flex items-center justify-center text-xl ${mod.color}`;

    // Build Content
    let html = `<div class="space-y-4">`;
    
    // Vocab List
    mod.vocab.forEach(v => {
        html += `
            <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h4 class="text-2xl font-black text-guajira-clay mb-1">${v.w}</h4>
                    <p class="text-gray-600 font-medium">${v[currentLang]}</p>
                </div>
                <div class="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm flex items-center gap-2 w-fit">
                    <i class="ph ph-quotes text-guajira-sun text-lg"></i>
                    <div>
                        <span class="text-xs text-gray-400 block mb-0.5">${i18n[currentLang].pronunciationTitle}</span>
                        <span class="font-mono text-guajira-dark font-bold select-all">${v.pron[currentLang]}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    // Extended cultural note
    if (mod.extendedNote) {
        html += `
            <div class="mt-8 p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                <div class="flex items-center gap-2 text-guajira-earth mb-3">
                    <i class="ph ph-compass text-xl"></i>
                    <h5 class="font-bold uppercase tracking-wider text-sm">${i18n[currentLang].deepDive}</h5>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">${mod.extendedNote[currentLang]}</p>
            </div>
        `;
    }

    document.getElementById('modal-content').innerHTML = html;

    // Show Modal & trigger animation
    const modal = document.getElementById('lesson-modal');
    const container = document.getElementById('modal-container');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Scroll to top automatically (Fixed placement so it works reliably)
    setTimeout(() => {
        document.getElementById('modal-content').scrollTop = 0;
    }, 10);
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        container.classList.remove('translate-y-full');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('lesson-modal');
    const container = document.getElementById('modal-container');
    
    container.classList.add('translate-y-full');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Initialize App
setLanguage(currentLang); // This also calls renderModules()
