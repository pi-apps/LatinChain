// Base de datos del curso con contexto cultural para La Guajira venezolana
const courseData = {
    beginner: [
        {
            id: "b0",
            title: { es: "Alfabeto Wayuunaiki", en: "Wayuunaiki Alphabet" },
            desc: { es: "El alfabeto completo y sus sonidos fundamentales.", en: "The complete alphabet and its fundamental sounds." },
            icon: "ph-text-aa", 
            color: "bg-orange-100 text-guajira-clay",
            vocab: [
                { w: "a, aa", es: "Vocal A (corta y larga)", en: "Vowel A (short and long)", pron: { es: "a / aa", en: "ah / ahh" } },
                { w: "ch", es: "Consonante Ch", en: "Consonant Ch", pron: { es: "che", en: "cheh" } },
                { w: "e, ee", es: "Vocal E (corta y larga)", en: "Vowel E (short and long)", pron: { es: "e / ee", en: "eh / ehh" } },
                { w: "i, ii", es: "Vocal I (corta y larga)", en: "Vowel I (short and long)", pron: { es: "i / ii", en: "ee / eee" } },
                { w: "j", es: "Consonante J (suave, como la aspiración en inglés)", en: "Consonant J (soft, like English h)", pron: { es: "je", en: "heh" } },
                { w: "k", es: "Consonante K", en: "Consonant K", pron: { es: "ke", en: "keh" } },
                { w: "l", es: "Consonante L (lengua detrás de los dientes superiores)", en: "Consonant L (tongue behind upper teeth)", pron: { es: "le", en: "leh" } },
                { w: "m", es: "Consonante M", en: "Consonant M", pron: { es: "me", en: "meh" } },
                { w: "n", es: "Consonante N", en: "Consonant N", pron: { es: "ne", en: "neh" } },
                { w: "ñ", es: "Consonante Ñ", en: "Consonant Ñ", pron: { es: "ñe", en: "nyeh" } },
                { w: "o, oo", es: "Vocal O (corta y larga)", en: "Vowel O (short and long)", pron: { es: "o / oo", en: "oh / ohh" } },
                { w: "p", es: "Consonante P", en: "Consonant P", pron: { es: "pe", en: "peh" } },
                { w: "r", es: "Consonante R (vibrante fuerte)", en: "Consonant R (strong trill)", pron: { es: "re", en: "reh" } },
                { w: "s", es: "Consonante S", en: "Consonant S", pron: { es: "se", en: "seh" } },
                { w: "sh", es: "Consonante Sh (fricativa, como pedir silencio)", en: "Consonant Sh (fricative, like asking for silence)", pron: { es: "she", en: "sheh" } },
                { w: "t", es: "Consonante T", en: "Consonant T", pron: { es: "te", en: "teh" } },
                { w: "u, uu", es: "Vocal U (corta y larga)", en: "Vowel U (short and long)", pron: { es: "u / uu", en: "oo / ooo" } },
                { w: "ü, üü", es: "Vocal Ü (cerrada, sonido gutural y palatal)", en: "Vowel Ü (close central unrounded)", pron: { es: "entre la i y la u", en: "between i and u" } },
                { w: "w", es: "Consonante W", en: "Consonant W", pron: { es: "we", en: "weh" } },
                { w: "y", es: "Consonante Y", en: "Consonant Y", pron: { es: "ye", en: "yeh" } },
                { w: "' (Saltillo)", es: "Corte glotal (Pausa breve en la palabra)", en: "Glottal stop (Brief pause in the word)", pron: { es: "Pausa en la garganta", en: "Pause in the throat" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> El alfabeto Wayuunaiki oficial está compuesto por 6 vocales (que pueden ser cortas o largas), 14 consonantes y el saltillo ('). La vocal 'ü' es un sonido particular que se pronuncia con los labios estirados como para decir 'i', pero intentando decir 'u'. El saltillo o corte glotal (') indica una interrupción o golpe seco de aire en la garganta, y es crucial porque puede cambiar por completo el significado de una palabra.",
                en: "<strong>Guajira Immersion:</strong> The official Wayuunaiki alphabet consists of 6 vowels (which can be short or long), 14 consonants, and the glottal stop ('). The vowel 'ü' is a unique sound pronounced with lips stretched as if saying 'i', but trying to say 'u'. The glottal stop (') indicates an interruption or sharp burst of air in the throat, and it is crucial because it can completely change the meaning of a word."
            }
        },
        {
            id: "b1",
            title: { es: "Saludos y Etiqueta", en: "Greetings & Etiquette" },
            desc: { es: "Lo básico para interactuar con respeto en la Guajira.", en: "Basics to interact respectfully in La Guajira." },
            icon: "ph-hand-waving", color: "bg-orange-100 text-guajira-clay",
            vocab: [
                // Saludos Básicos
                { w: "Jamaya", es: "¿Cómo estás?", en: "How are you?", pron: { es: "ja-MA-ya", en: "hah-MAH-yah" } },
                { w: "Ketta'a", es: "Buenos días", en: "Good morning", pron: { es: "ke-TA-a", en: "keh-TAH-ah" } },
                { w: "Asaa", es: "Hola / De acuerdo", en: "Hello / Agreed", pron: { es: "a-SA-a", en: "ah-SAH-ah" } },
                { w: "Anashii", es: "Bien / Bueno", en: "Good / Well", pron: { es: "a-NA-shi", en: "ah-NAH-shee" } },
                
                // Pronombres Personales Completos
                { w: "Taya", es: "Yo", en: "I / Me", pron: { es: "TA-ya", en: "TAH-yah" } },
                { w: "Pia", es: "Tú", en: "You (singular)", pron: { es: "PI-a", en: "PEE-ah" } },
                { w: "Nia", es: "Él", en: "He", pron: { es: "NI-a", en: "NEE-ah" } },
                { w: "Jia", es: "Ella / Ustedes", en: "She / You (plural)", pron: { es: "JI-a", en: "HEE-ah" } },
                { w: "Waya", es: "Nosotros / Nosotras", en: "We", pron: { es: "WA-ya", en: "WAH-yah" } },
                { w: "Naya", es: "Ellos / Ellas", en: "They", pron: { es: "NA-ya", en: "NAH-yah" } },

                // Conversaciones en contexto (adaptadas a la interfaz)
                { w: "💬 Jamaya pia?", es: "💬 ¿Cómo estás tú?", en: "💬 How are you?", pron: { es: "ja-MA-ya PI-a", en: "hah-MAH-yah PEE-ah" } },
                { w: "💬 Anashii taya", es: "💬 Yo estoy bien", en: "💬 I am fine", pron: { es: "a-NA-shi TA-ya", en: "ah-NAH-shee TAH-yah" } },
                { w: "💬 Ketta'a, jamaya?", es: "💬 Buenos días, ¿cómo estás?", en: "💬 Good morning, how are you?", pron: { es: "ke-TA-a, ja-MA-ya", en: "keh-TAH-ah, hah-MAH-yah" } },
                { w: "💬 Asaa, anashii waya", es: "💬 Hola, nosotros estamos bien", en: "💬 Hello, we are fine", pron: { es: "a-SA-a, a-NA-shi WA-ya", en: "ah-SAH-ah, ah-NAH-shee WAH-yah" } }
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
            icon: "ph-identification-card", 
            color: "bg-red-100 text-guajira-earth",
            vocab: [
                // Vocabulario original
                { w: "Alijuna", es: "Extranjero / No Wayuu", en: "Foreigner / Non-Wayuu", pron: { es: "a-li-JU-na", en: "ah-lee-HOO-nah" } },
                { w: "Wayuu", es: "Persona Indígena", en: "Indigenous person", pron: { es: "wa-YUU", en: "wah-YOO" } },
                { w: "Mma", es: "Tierra / Territorio", en: "Earth / Territory", pron: { es: "M-ma", en: "M-mah" } },
                { w: "Pala'a", es: "Mar", en: "Sea", pron: { es: "pa-LA-a", en: "pah-LAH-ah" } },
                { w: "Uchi", es: "Monte / Selva", en: "Bush / Jungle", pron: { es: "U-chi", en: "OO-chee" } },
                
                // Vocabulario ampliado (Entorno y pronombres)
                { w: "Wüin", es: "Agua", en: "Water", pron: { es: "WÜ-in", en: "WUH-een" } },
                { w: "Ka'i", es: "Sol / Día", en: "Sun / Day", pron: { es: "KA-i", en: "KAH-ee" } },
                { w: "Kashi", es: "Luna / Mes", en: "Moon / Month", pron: { es: "KA-shi", en: "KAH-shee" } },
                { w: "Taya", es: "Yo (Pronombre)", en: "I / Me", pron: { es: "TA-ya", en: "TAH-yah" } },
                { w: "Pia", es: "Tú (Pronombre)", en: "You", pron: { es: "PI-a", en: "PEE-ah" } },

                // Frases conversacionales (Ajustadas a la misma interfaz)
                { w: "💬 Wayuu taya", es: "💬 Yo soy Wayuu", en: "💬 I am Wayuu", pron: { es: "wa-YUU TA-ya", en: "wah-YOO TAH-yah" } },
                { w: "💬 Alijuna pia?", es: "💬 ¿Tú eres extranjero?", en: "💬 Are you a foreigner?", pron: { es: "a-li-JU-na PI-a", en: "ah-lee-HOO-nah PEE-ah" } },
                { w: "💬 Anasü mma", es: "💬 La tierra es hermosa/buena", en: "💬 The land is beautiful/good", pron: { es: "a-NA-sü M-ma", en: "ah-NAH-suh M-mah" } },
                { w: "💬 Eesü wüin?", es: "💬 ¿Hay agua?", en: "💬 Is there water?", pron: { es: "EE-sü WÜ-in", en: "EH-suh WUH-een" } }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Prepárate para ser llamado 'Alijuna'. No es un insulto, es la categorización del mundo: estás tú (Alijuna) y ellos (Wayuu). La Tierra (Mma) no es algo que se posee, es de donde se viene. Al presentarte, usa 'taya' (yo) después del sustantivo.",
                en: "<strong>Guajira Immersion:</strong> Be prepared to be called 'Alijuna'. It's not an insult, just a category. The Earth (Mma) is not owned, it's where one comes from. When introducing yourself, use 'taya' (I/me) after the noun."
            }
        },
        {
            "id": "b3",
            "title": { "es": "Supervivencia y Comida", "en": "Survival & Food" },
            "desc": { "es": "Vocabulario vital para el día a día y frases prácticas.", "en": "Vital vocabulary for daily life and practical phrases." },
            "icon": "ph-bowl-food", 
            "color": "bg-amber-100 text-amber-700",
            "vocab": [
                { "w": "Wüin", "es": "Agua", "en": "Water", "pron": { "es": "WU-in", "en": "WOO-in" } },
                { "w": "Eküülü", "es": "Comida", "en": "Food", "pron": { "es": "e-KÜÜ-lü", "en": "eh-KOO-loo" } },
                { "w": "Juriicha", "es": "Friche (Plato de chivo)", "en": "Friche (Goat dish)", "pron": { "es": "ju-RII-cha", "en": "hoo-REE-chah" } },
                { "w": "Uujolu", "es": "Chicha de maíz", "en": "Traditional corn drink", "pron": { "es": "uu-JO-lu", "en": "oo-HO-loo" } },
                { "w": "Ka'ula", "es": "Chivo / Cabra", "en": "Goat", "pron": { "es": "ka-U-la", "en": "kah-OO-lah" } },
                { "w": "Asala", "es": "Carne", "en": "Meat", "pron": { "es": "a-SA-la", "en": "ah-SAH-lah" } },
                { "w": "Asaa wüin", "es": "Tomar agua", "en": "Drink water", "pron": { "es": "a-SA-a WU-in", "en": "ah-SAH-ah WOO-in" } },
                { "w": "Ekiisha / Jamü", "es": "Hambre", "en": "Hunger", "pron": { "es": "e-KII-sha / ja-MÜ", "en": "eh-KEE-shah / hah-MOO" } },
                { "w": "💬 Eesü wüin?", "es": "💬 ¿Hay agua?", "en": "💬 Is there water?", "pron": { "es": "EE-sü WU-in", "en": "EH-soo WOO-in" } },
                { "w": "💬 Püpa taya wüin", "es": "💬 Dame agua", "en": "💬 Give me water", "pron": { "es": "PU-pa ta-ya WU-in", "en": "POO-pah tah-yah WOO-in" } },
                { "w": "💬 Jamüshi taya", "es": "💬 Tengo hambre (lo dice un hombre)", "en": "💬 I am hungry (male speaker)", "pron": { "es": "ja-MU-shi ta-ya", "en": "hah-MOO-shee tah-yah" } },
                { "w": "💬 Jamüsu taya", "es": "💬 Tengo hambre (lo dice una mujer)", "en": "💬 I am hungry (female speaker)", "pron": { "es": "ja-MU-su ta-ya", "en": "hah-MOO-soo tah-yah" } },
                { "w": "💬 Anaasü ma'in eküülü", "es": "💬 La comida está muy buena", "en": "💬 The food is very good", "pron": { "es": "a-NAA-sü ma-IN e-KÜÜ-lü", "en": "ah-NAH-soo mah-EEN eh-KOO-loo" } }
            ],
            "extendedNote": {
                "es": "<strong>Inmersión Guajira:</strong> El agua (Wüin) es el recurso más sagrado y escaso en la Guajira. Si te ofrecen chicha de maíz (Uujolu) o Friche (Juriicha - chivo frito en su sangre), acéptalo. Rechazar comida es una gran ofensa.",
                "en": "<strong>Guajira Immersion:</strong> Water (Wüin) is sacred and scarce. If offered corn drink (Uujolu) or Friche (traditional goat), accept it. Rejecting food is deeply offensive."
            }
        }
    ],
    intermediate: [
        {
            id: "i1",
            title: { es: "Números y Cantidades", en: "Numbers and Quantities" },
            desc: { es: "La base decimal del Wayuunaiki y su uso en la vida diaria.", en: "The decimal base of Wayuunaiki and its daily use." },
            icon: "ph-list-numbers", 
            color: "bg-yellow-100 text-guajira-sun",
            vocab: [
                // Vocabulario Base (1 al 10)
                { w: "Wanee", es: "Uno", en: "One", pron: { es: "wa-NEE", en: "wah-NEH" } },
                { w: "Piama", es: "Dos", en: "Two", pron: { es: "PIA-ma", en: "PYAH-mah" } },
                { w: "Apünüin", es: "Tres", en: "Three", pron: { es: "a-PU-nu-in", en: "ah-POO-noo-in" } },
                { w: "Pienchi", es: "Cuatro", en: "Four", pron: { es: "PIEN-chi", en: "PYEN-chee" } },
                { w: "Ja'rai", es: "Cinco", en: "Five", pron: { es: "JA-rai", en: "HAH-rye" } },
                { w: "Aipirua", es: "Seis", en: "Six", pron: { es: "ai-PI-ru-a", en: "eye-PEE-roo-ah" } },
                { w: "Akaraishi", es: "Siete", en: "Seven", pron: { es: "a-ka-RAI-shi", en: "ah-kah-RYE-shee" } },
                { w: "Mekiisat", es: "Ocho", en: "Eight", pron: { es: "me-KII-sat", en: "meh-KEE-saht" } },
                { w: "Meketsat", es: "Nueve", en: "Nine", pron: { es: "me-KE-tsat", en: "meh-KEH-tsaht" } },
                { w: "Po'loo", es: "Diez", en: "Ten", pron: { es: "po-LOO", en: "poh-LOO" } },
                
                // Vocabulario Intermedio (Expansión numérica)
                { w: "Po'loo waneemüin", es: "Once (Diez con uno)", en: "Eleven (Ten with one)", pron: { es: "po-LOO wa-nee-MU-in", en: "poh-LOO wah-neh-MOO-in" } },
                { w: "Piama shikii", es: "Veinte (Dos dieces)", en: "Twenty (Two tens)", pron: { es: "PIA-ma shi-KII", en: "PYAH-mah shee-KEE" } },
                { w: "Apünüin shikii", es: "Treinta (Tres dieces)", en: "Thirty (Three tens)", pron: { es: "a-PU-nu-in shi-KII", en: "ah-POO-noo-in shee-KEE" } },
                { w: "Po'loo shikii", es: "Cien (Diez dieces)", en: "One hundred (Ten tens)", pron: { es: "po-LOO shi-KII", en: "poh-LOO shee-KEE" } },

                // Conversaciones Profundas (Integradas en la misma estructura para la UI)
                { 
                    w: "💬 ¿Je'ra juya püpünaa?", 
                    es: "💬 ¿Cuántos años tienes?", 
                    en: "💬 How old are you?", 
                    pron: { es: "JE-ra JU-ya pu-PU-naa", en: "HEH-rah HOO-yah poo-POO-nah" } 
                },
                { 
                    w: "💬 Piama shikii juya tapünaa", 
                    es: "💬 Tengo veinte años", 
                    en: "💬 I am twenty years old", 
                    pron: { es: "PIA-ma shi-KII JU-ya ta-PU-naa", en: "PYAH-mah shee-KEE HOO-yah tah-POO-nah" } 
                },
                { 
                    w: "💬 ¿Je'ratsü nülia tüü?", 
                    es: "💬 ¿Cuánto cuesta esto? (Precio)", 
                    en: "💬 How much does this cost?", 
                    pron: { es: "je-RA-tsu nu-LIA TUU", en: "heh-RAH-tsoo noo-LYAH TOO" } 
                },
                { 
                    w: "💬 Püpa apünüin tamüin, maa", 
                    es: "💬 Dame tres, por favor", 
                    en: "💬 Give me three, please", 
                    pron: { es: "PU-pa a-PU-nu-in ta-MU-in, MAA", en: "POO-pah ah-POO-noo-in tah-MOO-in, MAH" } 
                },
                { 
                    w: "💬 Eeshii po'loo wayuu yaa", 
                    es: "💬 Hay diez personas aquí", 
                    en: "💬 There are ten people here", 
                    pron: { es: "EE-shii po-LOO wa-YUU YAA", en: "EH-shee poh-LOO wah-YOO YAH" } 
                }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> El Wayuunaiki tiene un sistema de base 10 perfecto. Para decir 11, dices 'Po'loo waneemüin' (Diez con uno), y para las decenas usas 'shikii' (Piama shikii = 20). Es vital dominar estos números combinados para regatear pasajes en los carritos por puesto hacia Sinamaica o expresar tu edad en una presentación formal.",
                en: "<strong>Guajira Immersion:</strong> Wayuunaiki uses a perfect base-10 system. To say 11, you say 'Po'loo waneemüin' (Ten with one), and for tens you use 'shikii' (Piama shikii = 20). Mastering these combined numbers is vital for bargaining transportation or expressing your age formally."
            }
        },
        {
            id: "i2",
            title: { es: "Cifras Mayores y Comercio", en: "Large Numbers & Trade" },
            desc: { es: "Comprando en el mercado de Los Filúos.", en: "Shopping in the local markets." },
            icon: "ph-storefront", 
            color: "bg-green-100 text-green-700",
            vocab: [
                // Vocabulario Base
                { w: "Piama shikii", es: "Veinte (Dos decenas)", en: "Twenty", pron: { es: "PIA-ma shi-KII", en: "PYAH-mah shee-KEE" } },
                { w: "Po'loo shikii", es: "Cien (Diez decenas)", en: "One Hundred", pron: { es: "po-LOO shi-KII", en: "poh-LOO shee-KEE" } },
                { w: "Waneeshi miyo'u", es: "Un Millón", en: "One Million", pron: { es: "wa-NEE-shi mi-YO-u", en: "wah-NEH-shee mee-YOH-oo" } },
                { w: "Miyo'u ma'in", es: "Mil Millones (Cantidad inmensa)", en: "One Billion", pron: { es: "mi-YO-u MA-in", en: "mee-YOH-oo MAH-in" } },
                { w: "Nnerü", es: "Dinero", en: "Money", pron: { es: "N-ne-ru", en: "N-neh-roo" } },
                { w: "Katsüin / Motso", es: "Caro / Barato", en: "Expensive / Cheap", pron: { es: "ka-TSU-in / MO-tso", en: "kah-TSOO-in / MOH-tsoh" } },
                
                // Vocabulario Ampliado (Verbos de comercio)
                { w: "Aya'lajaa", es: "Comprar", en: "To buy", pron: { es: "a-ya-LA-haa", en: "ah-yah-LAH-hah" } },
                { w: "Oikaa", es: "Vender", en: "To sell", pron: { es: "oi-KAA", en: "oy-KAH" } },
                { w: "Je'ra sülüwa?", es: "¿Cuánto cuesta?", en: "How much is it?", pron: { es: "HE-ra su-LU-wa", en: "HEH-rah soo-LOO-wah" } },

                // Sección de Conversaciones en Contexto (Adaptadas al UI actual)
                { 
                    w: "💬 —Je'ra sülüwa tüü? —Piama shikii.", 
                    es: "💬 —¿Cuánto cuesta esto? —Veinte.", 
                    en: "💬 —How much is this? —Twenty.", 
                    pron: { es: "HE-ra su-LU-wa TU-u? PIA-ma shi-KII", en: "HEH-rah soo-LOO-wah TOO-oo? PYAH-mah shee-KEE" } 
                },
                { 
                    w: "💬 —Katsüin ma'in! —Nnojo, motso ma'in.", 
                    es: "💬 —¡Es muy caro! —No, es muy barato.", 
                    en: "💬 —It's very expensive! —No, it's very cheap.", 
                    pron: { es: "ka-TSU-in MA-in! n-NO-ho, MO-tso MA-in", en: "kah-TSOO-in MAH-in! n-NOH-hoh, MOH-tsoh MAH-in" } 
                },
                { 
                    w: "💬 —Taya'lajeerü, eesü tanneetse.", 
                    es: "💬 —Lo compraré, tengo dinero.", 
                    en: "💬 —I will buy it, I have money.", 
                    pron: { es: "ta-ya-la-HEE-ru, EE-su tan-NEE-tse", en: "tah-yah-lah-HEE-roo, EE-soo tahn-NEH-tseh" } 
                }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> 'Shikii' significa cabeza/decena. 20 es 'dos cabezas' (Piama shikii). Para montos inmensos por la devaluación (millones), se adaptan préstamos del español o se dice 'Miyo'u ma'in' (demasiado grande). El regateo es común, por lo que usar 'Katsüin' (caro/duro) y 'Motso' (barato/pequeño) es esencial en mercados como Los Filúos.",
                en: "<strong>Guajira Immersion:</strong> 'Shikii' means head/ten. 20 is 'two tens'. For massive economic figures like millions, they adapt Spanish words or use 'Miyo'u ma'in' (very large). Bargaining is culturally standard, making words like 'Katsüin' (expensive/hard) and 'Motso' (cheap/small) essential in markets like Los Filúos."
            }
        },
        {
            "id": "i3",
            "title": { "es": "Tiempo y Clima", "en": "Time & Weather" },
            "desc": { "es": "Entendiendo los ciclos del desierto.", "en": "Understanding desert cycles." },
            "icon": "ph-sun", 
            "color": "bg-blue-100 text-blue-700",
            "vocab": [
                { "w": "Ka'i", "es": "Sol / Día", "en": "Sun / Day", "pron": { "es": "KA-i", "en": "KAH-ee" } },
                { "w": "Kashi", "es": "Luna / Mes", "en": "Moon / Month", "pron": { "es": "KA-shi", "en": "KAH-shee" } },
                { "w": "Juyá", "es": "Lluvia / Año", "en": "Rain / Year", "pron": { "es": "ju-YA", "en": "hoo-YAH" } },
                { "w": "Jemiai", "es": "Frío (de noche)", "en": "Cold", "pron": { "es": "je-MIAI", "en": "heh-MYEYE" } },
                { "w": "Joutai", "es": "Viento / Brisa", "en": "Wind / Breeze", "pron": { "es": "jou-TAI", "en": "how-TIE" } },
                { "w": "Siruma", "es": "Cielo / Nubes", "en": "Sky / Clouds", "pron": { "es": "si-RU-ma", "en": "see-ROO-mah" } },
                { "w": "Maalia", "es": "Madrugada / Amanecer", "en": "Dawn / Early morning", "pron": { "es": "MAA-lia", "en": "MAAH-lyah" } },
                { "w": "Aliika", "es": "Tarde", "en": "Afternoon", "pron": { "es": "a-LII-ka", "en": "ah-LEE-kah" } },
                { "w": "Aipa'a", "es": "Noche", "en": "Night", "pron": { "es": "ai-PA-a", "en": "eye-PAH-ah" } },
                { "w": "💬 Katsüinsü ka'i", "es": "💬 El sol está muy fuerte", "en": "💬 The sun is very strong", "pron": { "es": "ka-TSÜIN-sü KA-i", "en": "kah-TSWEEN-soo KAH-ee" } },
                { "w": "💬 Antüshi Juyá", "es": "💬 Viene la lluvia (Habrá vida/abundancia)", "en": "💬 The rain is coming (There will be life/abundance)", "pron": { "es": "an-TÜ-shi ju-YA", "en": "ahn-TOO-shee hoo-YAH" } },
                { "w": "💬 Maima kashi", "es": "💬 Han pasado muchas lunas (Hace mucho tiempo)", "en": "💬 Many moons have passed (A long time ago)", "pron": { "es": "MAI-ma KA-shi", "en": "MY-mah KAH-shee" } },
                { "w": "💬 Watta'a maalü", "es": "💬 Nos vemos mañana muy temprano", "en": "💬 See you early tomorrow morning", "pron": { "es": "wat-TA-a MAA-lü", "en": "waht-TAH-ah MAAH-loo" } }
            ],
            "extendedNote": {
                "es": "<strong>Inmersión Guajira:</strong> En la Guajira el tiempo se mide por el entorno. 'Juyá' es la lluvia, pero también significa 'Año' y es una entidad masculina que fecunda a 'Mma' (la Tierra). Si llueve, hay fiesta y prosperidad. Para expresar el paso del tiempo largo, los wayuu hablan de cuántas lunas ('kashi') han pasado.",
                "en": "<strong>Guajira Immersion:</strong> Time is measured by the environment. 'Juyá' (Rain) also means 'Year', acting as a male entity that fertilizes the Earth. Rain means prosperity. To express the passage of long periods of time, the Wayuu speak of how many moons ('kashi') have passed."
            }
        }
    ],
    advanced: [
        {
            "id": "a1",
            "title": { "es": "El Sistema de Clanes", "en": "The Clan System" },
            "desc": { "es": "La estructura matrilineal (Eiruku).", "en": "The matrilineal structure." },
            "icon": "ph-users-three", 
            "color": "bg-purple-100 text-purple-700",
            "vocab": [
                { "w": "Eiruku", "es": "Clan / Carne", "en": "Clan / Flesh", "pron": { "es": "ei-RU-ku", "en": "ay-ROO-koo" } },
                { "w": "Ta'laüla", "es": "Tío materno", "en": "Maternal uncle", "pron": { "es": "ta-LA-u-la", "en": "tah-LAH-oo-lah" } },
                { "w": "Eirü", "es": "Madre / Tía materna", "en": "Mother / Maternal aunt", "pron": { "es": "EI-ru", "en": "AY-roo" } },
                { "w": "Uriana / Jayaliyuu", "es": "Nombres de clanes", "en": "Clan names", "pron": { "es": "u-RIA-na", "en": "oo-RYAH-nah" } },
                { "w": "Apüshii", "es": "Familia materna / Parientes de sangre", "en": "Maternal family / Blood relatives", "pron": { "es": "a-PU-shi", "en": "ah-POO-shee" } },
                { "w": "Oupayu", "es": "Familia paterna / Parientes por alianza", "en": "Paternal family / Relatives by alliance", "pron": { "es": "ou-PA-yu", "en": "ow-PAH-yoo" } },
                { "w": "Pütchipü'ü", "es": "Palabrero (Mediador de conflictos)", "en": "Word-bearer (Conflict mediator)", "pron": { "es": "put-chi-PU-u", "en": "poot-chee-POO-oo" } },
                { "w": "Alaülaa", "es": "Anciano / Autoridad mayor del clan", "en": "Elder / Major clan authority", "pron": { "es": "a-LA-u-la", "en": "ah-LAH-oo-lah" } },
                { "w": "💬 ¿Kasa eiruku pia?", "es": "💬 ¿De qué clan eres? (Lit: ¿Qué carne eres?)", "en": "💬 Which clan are you from? (Lit: What flesh are you?)", "pron": { "es": "KA-sa ei-RU-ku PIA", "en": "KAH-sah ay-ROO-koo PEE-ah" } },
                { "w": "💬 Taya wayuu Uriana, tapüshii shia...", "es": "💬 Soy Wayuu del clan Uriana, mi familia materna es...", "en": "💬 I am Wayuu of the Uriana clan, my maternal family is...", "pron": { "es": "TA-ya wa-YUU u-RIA-na, ta-PU-shi SHIA", "en": "TAH-yah wah-YOO oo-RYAH-nah, tah-POO-shee SHEE-ah" } },
                { "w": "💬 Nümaale'eya chi ta'laülakai pütchikalü", "es": "💬 La decisión final la tiene mi tío materno", "en": "💬 The final decision belongs to my maternal uncle", "pron": { "es": "nu-maa-LE-e-ya chi ta-la-U-la-kai put-chi-KA-lu", "en": "noo-mah-LEH-eh-yah chee tah-lah-OO-lah-kye poot-chee-KAH-loo" } },
                { "w": "💬 Müleka nnojolüin nünüiki chi pütchipü'ükai...", "es": "💬 Si no hay palabra del palabrero (no hay acuerdo)...", "en": "💬 If there is no word from the mediator (no agreement)...", "pron": { "es": "MU-le-ka nno-HO-lu-in nu-NUI-ki chi put-chi-PU-u-kai", "en": "MOO-leh-kah nno-HO-loo-een noo-NWEE-kee chee poot-chee-POO-oo-kye" } }
            ],
            "extendedNote": {
                "es": "<strong>Inmersión Guajira:</strong> ESTO ES VITAL. Los Wayuu son matrilineales. Tú heredas la sangre y el apellido (el clan) de tu MADRE, no de tu padre. El hombre más importante en la vida de un niño no es su padre biológico, sino su tío materno (Ta'laüla), quien es la autoridad legal del clan. Para asuntos graves, la familia materna (Apüshii) negocia a través del Palabrero (Pütchipü'ü).",
                "en": "<strong>Guajira Immersion:</strong> CRUCIAL: Wayuu are matrilineal. You inherit your clan from your MOTHER. The most important male figure is the maternal uncle (Ta'laüla), who holds legal authority. For serious matters, the maternal bloodline (Apüshii) negotiates through the traditional mediator (Pütchipü'ü)."
            }
        },
        {
            "id": "a2",
            "title": { 
                "es": "Ley y Justicia Wayuu", 
                "en": "Wayuu Law & Justice" 
            },
            "desc": { 
                "es": "Cómo se resuelven los desacuerdos.", 
                "en": "How disagreements are resolved." 
            },
            "icon": "ph-scales", 
            "color": "bg-indigo-100 text-indigo-700",
            "vocab": [
                { 
                    "w": "Pütchipü'ü", 
                    "es": "El Palabrero", 
                    "en": "The Word Carrier", 
                    "pron": { "es": "pu-tchi-PU-u", "en": "poo-chee-POO-oo" } 
                },
                { 
                    "w": "Pütchi", 
                    "es": "La Palabra / El mensaje", 
                    "en": "The Word / Message", 
                    "pron": { "es": "PU-tchi", "en": "POO-chee" } 
                },
                { 
                    "w": "Maüna", 
                    "es": "Compensación (pago/arreglo)", 
                    "en": "Compensation (payment/settlement)", 
                    "pron": { "es": "MA-u-na", "en": "MAH-oo-nah" } 
                },
                { 
                    "w": "Kasachiki", 
                    "es": "El problema / El desacuerdo", 
                    "en": "The problem / The disagreement", 
                    "pron": { "es": "ka-sa-CHI-ki", "en": "kah-sah-CHEE-kee" } 
                },
                { 
                    "w": "Anaawaa", 
                    "es": "La paz / La armonía", 
                    "en": "Peace / Harmony", 
                    "pron": { "es": "a-NAA-waa", "en": "ah-NAH-wah" } 
                },
                { 
                    "w": "E'iruku", 
                    "es": "El clan / La familia materna", 
                    "en": "The clan / Maternal family", 
                    "pron": { "es": "e-i-RU-ku", "en": "eh-ee-ROO-koo" } 
                },
                { 
                    "w": "Kojutaa", 
                    "es": "El respeto", 
                    "en": "Respect", 
                    "pron": { "es": "ko-JU-taa", "en": "koh-HOO-tah" } 
                },
                { 
                    "w": "💬 ¿Kasa waa'inrajatka süpüla anaawaa?", 
                    "es": "💬 ¿Qué debemos hacer para restaurar la armonía?", 
                    "en": "💬 What must we do to restore harmony?", 
                    "pron": { "es": "KA-sa wa-a-in-ra-JAT-ka su-PU-la a-NAA-waa?", "en": "KAH-sah wah-ah-een-rah-HAHT-kah soo-POO-lah ah-NAH-wah?" } 
                },
                { 
                    "w": "💬 Cho'ujaasü aashajawaa süpüla nnojoitpa kasachiki", 
                    "es": "💬 Se requiere dialogar para que termine el problema.", 
                    "en": "💬 Dialogue is needed so the problem ends.", 
                    "pron": { "es": "cho-u-JAA-su a-a-sha-ja-WAA su-PU-la nno-JOIT-pa ka-sa-CHI-ki", "en": "choh-oo-HAH-soo ah-ah-shah-hah-WAH soo-POO-lah nnoh-HOYT-pah kah-sah-CHEE-kee" } 
                },
                { 
                    "w": "💬 Chi pütchipü'ükai nütüja ama'ana pütchi namüin na e'irukukana", 
                    "es": "💬 El palabrero lleva el mensaje (de acuerdo) a los clanes involucrados.", 
                    "en": "💬 The word carrier brings the message (of agreement) to the involved clans.", 
                    "pron": { "es": "chi pu-tchi-PU-u-kai nu-tu-JA a-MA-a-na PU-tchi na-MU-in na e-i-ru-KU-ka-na", "en": "chee poo-chee-POO-oo-kye noo-too-HAH ah-MAH-ah-nah POO-chee nah-MOO-een nah eh-ee-roo-KOO-kah-nah" } 
                },
                { 
                    "w": "💬 Aja'ttüsü tü kasachikika süka wanee maüna", 
                    "es": "💬 El desacuerdo termina mediante una compensación justa.", 
                    "en": "💬 The disagreement ends through a fair compensation.", 
                    "pron": { "es": "a-JAT-tu-su tu ka-sa-chi-KI-ka su-KA wa-NEE MA-u-na", "en": "ah-HAHT-too-soo too kah-sah-chee-KEE-kah soo-KAH wah-NEH MAH-oo-nah" } 
                }
            ],
            "extendedNote": {
                "es": "<strong>Inmersión Guajira:</strong> Si surge un malentendido o desacuerdo, NUNCA busques a la policía ordinaria (Alijuna). Los asuntos se resuelven mediante el diálogo entre clanes ('E'iruku'). Se llama a un 'Pütchipü'ü' (Palabrero, Patrimonio de la Humanidad por la UNESCO) quien media a través de la palabra para establecer un acuerdo o compensación material/simbólica ('Maüna') y así devolver el respeto ('Kojutaa') y la armonía ('Anaawaa') a la comunidad.",
                "en": "<strong>Guajira Immersion:</strong> If a misunderstanding or disagreement arises, never call regular police. Matters are resolved through dialogue between clans ('E'iruku'). A 'Pütchipü'ü' (Word Carrier) mediates to set a material/symbolic agreement or compensation ('Maüna') to restore respect ('Kojutaa') and harmony ('Anaawaa') to the community."
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
                { w: "Seyuu", es: "Espíritu protector", en: "Protector spirit", pron: { es: "se-YUU", en: "seh-YOO" } },
                { w: "Jepira", es: "El paraíso Wayuu (Cabo de la Vela)", en: "Wayuu paradise (Cabo de la Vela)", pron: { es: "je-PI-ra", en: "heh-PEE-rah" } },
                { w: "Ouutsu", es: "Mujer chamán / Sanadora", en: "Shaman woman / Healer", pron: { es: "o-UU-tsu", en: "oh-OO-tsoo" } },
                { w: "Wanülüü", es: "Espíritu maligno / Enfermedad", en: "Evil spirit / Illness", pron: { es: "wa-nu-LUU", en: "wah-noo-LOO" } },
                { w: "Juya", es: "Lluvia (Padre creador)", en: "Rain (Creator father)", pron: { es: "ju-YA", en: "hoo-YAH" } },
                { w: "Pulowi", es: "Deidad del inframundo y sequía", en: "Deity of the underworld and drought", pron: { es: "pu-LO-wi", en: "poo-LOH-wee" } },
                
                // Sección conversacional integrada en el diccionario
                { 
                    w: "💬 —¿Jamüshi pa'alijüin lapükat? —Shiimüin tü nüküjakalü taya chi yolujaakai.", 
                    es: "💬 —¿Por qué interpretas el sueño? —Es verdad lo que me dijo el espíritu.", 
                    en: "💬 —Why do you interpret the dream? —What the spirit told me is true.", 
                    pron: { es: "ja-MU-shi pa-a-li-JU-in la-pu-kat? shii-MU-in tu nu-ku-JA-ka-lu ta-ya chi yo-lu-JAA-kai", en: "hah-MOO-shee pah-ah-lee-HOO-een lah-poo-kaht? shee-MOO-een too noo-koo-HAH-kah-loo tah-yah chee yoh-loo-HAH-kye" } 
                },
                { 
                    w: "💬 Alatüsü nünüiki Maleiwa süka sa'in tü ouutsukalü.", 
                    es: "💬 La palabra de Dios pasa a través del corazón de la chamana (durante la sanación).", 
                    en: "💬 God's word passes through the shaman's heart (during healing).", 
                    pron: { es: "a-LA-tu-su nu-NUI-ki ma-LEI-wa su-KA sa-IN tu o-uu-TSU-ka-lu", en: "ah-LAH-too-soo noo-NOO-ee-kee mah-LAY-wah soo-KAH sah-EEN too oh-oo-TSOO-kah-loo" } 
                },
                { 
                    w: "💬 Na wayuukana o'unushii eemüinre Jepira, süpüla nükülin juya.", 
                    es: "💬 Los hombres parten hacia Jepira, para luego regresar como la lluvia.", 
                    en: "💬 Men depart to Jepira, to later return as the rain.", 
                    pron: { es: "na wa-YUU-ka-na o-u-NU-shii ee-MUI-in-re je-PI-ra, su-PU-la nu-KU-lin ju-ya", en: "nah wah-YOO-kah-nah oh-oo-NOO-shee eh-MOO-een-reh heh-PEE-rah, soo-POO-lah noo-KOO-leen hoo-yah" } 
                },
                { 
                    w: "💬 Nnojoishii wanülüü yaa, eeshi wanee seyuu kachukuwa'ipakai.", 
                    es: "💬 No hay espíritus malignos aquí, hay un espíritu protector cuidando.", 
                    en: "💬 There are no evil spirits here, there is a protector spirit watching over.", 
                    pron: { es: "nno-JOI-shii wa-nu-LUU ya-a, EE-shi wa-NEE se-YUU ka-chu-ku-wa-I-pa-kai", en: "nnoh-HOY-shee wah-noo-LOO yah-ah, EH-shee wah-NAY seh-YOO kah-choo-koo-wah-EE-pah-kye" } 
                }
            ],
            extendedNote: {
                es: "<strong>Inmersión Guajira:</strong> Los sueños ('Lapü') no son fantasías, son mensajes reales del más allá. Si un Wayuu sueña algo malo, se toman medidas inmediatas (baños, consultas con la 'Ouutsu'). Los difuntos no desaparecen, se vuelven 'Yolujaa' y viajan a Jepira (el cabo de la Vela), para luego volver a la tierra como lluvia ('Juya'). Al usar estas frases en conversaciones profundas, demuestras un gran respeto por el equilibrio espiritual Wayuu.",
                en: "<strong>Guajira Immersion:</strong> Dreams ('Lapü') are real messages from beyond. If a Wayuu dreams something bad, immediate rituals are done (baths, consultations with the 'Ouutsu'). The dead become 'Yolujaa' and travel to Jepira, later returning to earth as rain ('Juya'). By using these phrases in deep conversations, you show great respect for the Wayuu spiritual balance."
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
