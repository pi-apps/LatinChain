// --- Lesson Data for Spanish for English Speakers ---
const spanishLessonsData = [
    // Beginner Level
    {
        id: 's1',
        title: 'Basic Greetings and Introductions',
        description: 'Learn fundamental Spanish greetings, farewells, and how to introduce yourself.',
        level: 'Beginner',
        content: `
            <p>Starting with greetings is essential for any language. In Spanish, common greetings include:</p>
            <ul>
                <li><strong>Hola:</strong> Hello (most common)</li>
                <li><strong>Buenos días:</strong> Good morning</li>
                <li><strong>Buenas tardes:</strong> Good afternoon/evening</li>
                <li><strong>Buenas noches:</strong> Good night</li>
            </ul>
            <h3>Introducing Yourself:</h3>
            <p>To say "My name is..." you can use:</p>
            <p class="example-text"><strong>Me llamo [Your Name].</strong> (Literally: I call myself [Your Name].)</p>
            <p>Or more formally:</p>
            <p class="example-text"><strong>Mi nombre es [Your Name].</strong> (My name is [Your Name].)</p>
            <p>To ask someone's name:</p>
            <p class="example-text"><strong>¿Cómo te llamas?</strong> (Informal: What's your name?)</p>
            <p class="example-text"><strong>¿Cómo se llama?</strong> (Formal: What's your name?)</p>
            <h3>Farewells:</h3>
            <ul>
                <li><strong>Adiós:</strong> Goodbye</li>
                <li><strong>Hasta luego:</strong> See you later</li>
                <li><strong>Nos vemos:</strong> See you</li>
            </ul>
        `
    },
    {
        id: 's2',
        title: 'Numbers 1-10 and Basic Questions',
        description: 'Master counting from one to ten and asking simple questions like "How many?".',
        level: 'Beginner',
        content: `
            <p>Numbers are fundamental for daily interactions. Let's learn 1-10:</p>
            <ol>
                <li><strong>Uno</strong></li>
                <li><strong>Dos</strong></li>
                <li><strong>Tres</strong></li>
                <li><strong>Cuatro</strong></li>
                <li><strong>Cinco</strong></li>
                <li><strong>Seis</strong></li>
                <li><strong>Siete</strong></li>
                <li><strong>Ocho</strong></li>
                <li><strong>Nueve</strong></li>
                <li><strong>Diez</strong></li>
            </ol>
            <h3>Basic Questions:</h3>
            <p>To ask "How many?":</p>
            <p class="example-text"><strong>¿Cuántos/Cuántas?</strong> (Use <em>cuántos</em> for masculine nouns, <em>cuántas</em> for feminine nouns)</p>
            <p>Examples:</p>
            <p class="example-text"><strong>¿Cuántos libros tienes?</strong> (How many books do you have?)</p>
            <p class="example-text"><strong>¿Cuántas manzanas quieres?</strong> (How many apples do you want?)</p>
            <p>Other useful questions:</p>
            <ul>
                <li><strong>¿Qué?</strong> (What?)</li>
                <li><strong>¿Quién?</strong> (Who?)</li>
                <li><strong>¿Dónde?</strong> (Where?)</li>
            </ul>
        `
    },
    {
        id: 's3',
        title: 'Common Nouns and Articles (El, La, Los, Las)',
        description: 'Learn everyday nouns and how to use definite articles (the) correctly.',
        level: 'Beginner',
        content: `
            <p>Spanish nouns have gender (masculine or feminine) and number (singular or plural). Articles must agree with the noun.</p>
            <h3>Definite Articles (The):</h3>
            <ul>
                <li><strong>El:</strong> The (masculine singular) - e.g., <em>el perro</em> (the dog)</li>
                <li><strong>La:</strong> The (feminine singular) - e.g., <em>la casa</em> (the house)</li>
                <li><strong>Los:</strong> The (masculine plural) - e.g., <em>los perros</em> (the dogs)</li>
                <li><strong>Las:</strong> The (feminine plural) - e.g., <em>las casas</em> (the houses)</li>
            </ul>
            <h3>Common Nouns:</h3>
            <ul>
                <li><strong>Hombre:</strong> man</li>
                <li><strong>Mujer:</strong> woman</li>
                <li><strong>Niño/Niña:</strong> boy/girl</li>
                <li><strong>Agua:</strong> water</li>
                <li><strong>Comida:</strong> food</li>
            </ul>
            <p>Practice identifying gender by looking at the noun's ending (often -o for masculine, -a for feminine).</p>
        `
    },
    {
        id: 's4',
        title: 'Basic Verbs: Ser and Estar (To Be)',
        description: 'Understand the crucial difference between "ser" and "estar" for "to be".',
        level: 'Beginner',
        content: `
            <p>Spanish has two verbs for "to be": <strong>ser</strong> and <strong>estar</strong>. Their usage depends on whether the state is permanent or temporary.</p>
            <h3>Ser (Permanent/Essential Qualities):</h3>
            <ul>
                <li><strong>Origin:</strong> <em>Soy de España.</em> (I am from Spain.)</li>
                <li><strong>Identity:</strong> <em>Ella es doctora.</em> (She is a doctor.)</li>
                <li><strong>Time/Date:</strong> <em>Son las tres.</em> (It is three o'clock.)</li>
                <li><strong>Characteristics:</strong> <em>Él es alto.</em> (He is tall.)</li>
            </ul>
            <h3>Estar (Temporary States/Location):</h3>
            <ul>
                <li><strong>Location:</strong> <em>Estoy en casa.</em> (I am at home.)</li>
                <li><strong>Feelings/Emotions:</strong> <em>Estoy feliz.</em> (I am happy.)</li>
                <li><strong>Temporary Conditions:</strong> <em>La puerta está abierta.</em> (The door is open.)</li>
                <li><strong>Health:</strong> <em>Estoy enfermo.</em> (I am sick.)</li>
            </ul>
            <p>This is a challenging but vital concept. Practice with many examples!</p>
        `
    },
    {
        id: 's5',
        title: 'Simple Present Tense (Regular -AR, -ER, -IR Verbs)',
        description: 'Learn to conjugate regular verbs in the present tense for everyday actions.',
        level: 'Beginner',
        content: `
            <p>The present tense is used for actions happening now, habitual actions, and general truths.</p>
            <h3>Regular -AR Verbs (e.g., <em>hablar</em> - to speak):</h3>
            <ul>
                <li>Yo habl<strong>o</strong> (I speak)</li>
                <li>Tú habl<strong>as</strong> (You speak - informal)</li>
                <li>Él/Ella/Usted habl<strong>a</strong> (He/She/You speak - formal)</li>
                <li>Nosotros/as habl<strong>amos</strong> (We speak)</li>
                <li>Vosotros/as habl<strong>áis</strong> (You all speak - informal, Spain)</li>
                <li>Ellos/Ellas/Ustedes habl<strong>an</strong> (They/You all speak)</li>
            </ul>
            <h3>Regular -ER Verbs (e.g., <em>comer</em> - to eat):</h3>
            <ul>
                <li>Yo com<strong>o</strong></li>
                <li>Tú com<strong>es</strong></li>
                <li>Él/Ella/Usted com<strong>e</strong></li>
                <li>Nosotros/as com<strong>emos</strong></li>
                <li>Vosotros/as com<strong>éis</strong></li>
                <li>Ellos/Ellas/Ustedes com<strong>en</strong></li>
            </ul>
            <h3>Regular -IR Verbs (e.g., <em>vivir</em> - to live):</h3>
            <ul>
                <li>Yo viv<strong>o</strong></li>
                <li>Tú viv<strong>es</strong></li>
                <li>Él/Ella/Usted viv<strong>e</strong></li>
                <li>Nosotros/as viv<strong>imos</strong></li>
                <li>Vosotros/as viv<strong>ís</strong></li>
                <li>Ellos/Ellas/Ustedes viv<strong>en</strong></li>
            </ul>
        `
    },
    {
        id: 's6',
        title: 'Basic Adjectives and Agreement',
        description: 'Use descriptive words and ensure they match nouns in gender and number.',
        level: 'Beginner',
        content: `
            <p>Adjectives describe nouns. In Spanish, they must agree in gender and number with the noun they modify.</p>
            <h3>Gender Agreement:</h3>
            <ul>
                <li>If a masculine noun ends in -o, the adjective often ends in -o: <em>el libro roj<strong>o</strong></em> (the red book)</li>
                <li>If a feminine noun ends in -a, the adjective often ends in -a: <em>la casa roj<strong>a</strong></em> (the red house)</li>
                <li>Adjectives ending in -e or a consonant usually don't change for gender: <em>el coche grand<strong>e</strong></em> (the big car), <em>la ciudad grand<strong>e</strong></em> (the big city)</li>
            </ul>
            <h3>Number Agreement:</h3>
            <ul>
                <li>Add -s if the adjective ends in a vowel: <em>los libros rojo<strong>s</strong></em>, <em>las casas roja<strong>s</strong></em></li>
                <li>Add -es if the adjective ends in a consonant: <em>los coches grand<strong>es</strong></em>, <em>las ciudades grand<strong>es</strong></em></li>
            </ul>
            <h3>Placement:</h3>
            <p>Most adjectives come AFTER the noun they describe.</p>
            <p class="example-text"><em>Tengo un coche nuevo.</em> (I have a new car.)</p>
        `
    },
    {
        id: 's7',
        title: 'Asking for Directions and Places',
        description: 'Learn phrases to ask for and give directions, and identify common places.',
        level: 'Beginner',
        content: `
            <p>Navigating in a Spanish-speaking country requires specific vocabulary:</p>
            <h3>Asking for Directions:</h3>
            <ul>
                <li><strong>¿Dónde está [place]?</strong> (Where is [place]?)</li>
                <li><strong>¿Cómo llego a [place]?</strong> (How do I get to [place]?)</li>
                <li><strong>¿Está lejos/cerca?</strong> (Is it far/near?)</li>
            </ul>
            <h3>Giving Directions:</h3>
            <ul>
                <li><strong>Gira a la derecha/izquierda:</strong> Turn right/left</li>
                <li><strong>Sigue recto:</strong> Go straight</li>
                <li><strong>Está al lado de:</strong> It's next to</li>
                <li><strong>Está enfrente de:</strong> It's in front of</li>
            </ul>
            <h3>Common Places:</h3>
            <ul>
                <li><strong>Banco:</strong> bank</li>
                <li><strong>Restaurante:</strong> restaurant</li>
                <li><strong>Hotel:</strong> hotel</li>
                <li><strong>Tienda:</strong> store</li>
                <li><strong>Mercado:</strong> market</li>
            </ul>
        `
    },
    {
        id: 's8',
        title: 'Food and Drink Vocabulary',
        description: 'Expand your vocabulary to order food and beverages in Spanish.',
        level: 'Beginner',
        content: `
            <p>Eating and drinking are central to culture. Here's some essential vocabulary:</p>
            <h3>Food:</h3>
            <ul>
                <li><strong>Desayuno:</strong> breakfast</li>
                <li><strong>Almuerzo:</strong> lunch</li>
                <li><strong>Cena:</strong> dinner</li>
                <li><strong>Agua:</strong> water</li>
                <li><strong>Café:</strong> coffee</li>
                <li><strong>Pan:</strong> bread</li>
                <li><strong>Carne:</strong> meat</li>
                <li><strong>Pollo:</strong> chicken</li>
                <li><strong>Pescado:</strong> fish</li>
                <li><strong>Verduras:</strong> vegetables</li>
                <li><strong>Frutas:</strong> fruits</li>
            </ul>
            <h3>Ordering:</h3>
            <p class="example-text"><strong>Quisiera [item], por favor.</strong> (I would like [item], please.)</p>
            <p class="example-text"><strong>¿Me trae [item]?</strong> (Could you bring me [item]?)</p>
            <p class="example-text"><strong>La cuenta, por favor.</strong> (The bill, please.)</p>
        `
    },

    // Intermediate Level
    {
        id: 'i1',
        title: 'Preterite vs. Imperfect Tense',
        description: 'Master the two past tenses for completed actions vs. ongoing/habitual actions.',
        level: 'Intermediate',
        content: `
            <p>Understanding the difference between the preterite and imperfect tenses is crucial for describing past events.</p>
            <h3>Preterite (Pretérito Indefinido):</h3>
            <ul>
                <li>Used for completed actions in the past.</li>
                <li>Has a definite beginning and end.</li>
                <li>Often answers "what happened?".</li>
            </ul>
            <p class="example-text"><em>Ayer <strong>comí</strong> paella.</em> (Yesterday I ate paella. - completed action)</p>
            <h3>Imperfect (Pretérito Imperfecto):</h3>
            <ul>
                <li>Used for ongoing, habitual, or descriptive actions in the past.</li>
                <li>Describes "what was happening" or "what used to happen."</li>
                <li>No definite beginning or end specified.</li>
            </ul>
            <p class="example-text"><em>Cuando era niño, <strong>jugaba</strong> al fútbol.</em> (When I was a child, I used to play soccer. - habitual action)</p>
            <p class="example-text"><em>Mientras <strong>leía</strong>, sonó el teléfono.</em> (While I was reading, the phone rang. - ongoing action)</p>
        `
    },
    {
        id: 'i2',
        title: 'Direct and Indirect Object Pronouns',
        description: 'Learn to use "lo, la, los, las" and "le, les" to simplify sentences.',
        level: 'Intermediate',
        content: `
            <p>Object pronouns replace nouns to avoid repetition.</p>
            <h3>Direct Object Pronouns (answers "what?" or "whom?"):</h3>
            <ul>
                <li><strong>Me:</strong> me</li>
                <li><strong>Te:</strong> you (informal)</li>
                <li><strong>Lo/La:</strong> him/her/it/you (formal)</li>
                <li><strong>Nos:</strong> us</li>
                <li><strong>Os:</strong> you all (informal, Spain)</li>
                <li><strong>Los/Las:</strong> them/you all (formal)</li>
            </ul>
            <p class="example-text"><em>Compré el libro. -> <strong>Lo</strong> compré.</em> (I bought the book. -> I bought it.)</p>
            <h3>Indirect Object Pronouns (answers "to whom?" or "for whom?"):</h3>
            <ul>
                <li><strong>Me:</strong> to/for me</li>
                <li><strong>Te:</strong> to/for you (informal)</li>
                <li><strong>Le:</strong> to/for him/her/it/you (formal)</li>
                <li><strong>Nos:</strong> to/for us</li>
                <li><strong>Os:</strong> to/for you all (informal, Spain)</li>
                <li><strong>Les:</strong> to/for them/you all (formal)</li>
            </ul>
            <p class="example-text"><em>Di el regalo a María. -> <strong>Le</strong> di el regalo.</em> (I gave the gift to Maria. -> I gave her the gift.)</p>
            <p>When both are present, indirect comes before direct: <em>Se lo di.</em> (I gave it to him/her/them/you all).</p>
        `
    },
    {
        id: 'i3',
        title: 'The Subjunctive Mood',
        description: 'Understand and apply the subjunctive for wishes, doubts, emotions, and impersonal expressions.',
        level: 'Intermediate',
        content: `
            <p>The subjunctive mood expresses subjectivity, uncertainty, emotion, or desire, rather than objective facts.</p>
            <h3>Common Triggers for Subjunctive:</h3>
            <ul>
                <li><strong>Wishes/Desires:</strong> <em>Espero que <strong>vengas</strong>.</em> (I hope you come.)</li>
                <li><strong>Emotions:</strong> <em>Me alegra que <strong>estés</strong> aquí.</em> (It makes me happy that you are here.)</li>
                <li><strong>Doubt/Uncertainty:</strong> <em>Dudo que <strong>sepa</strong> la respuesta.</em> (I doubt he knows the answer.)</li>
                <li><strong>Impersonal Expressions:</strong> <em>Es importante que <strong>estudies</strong>.</em> (It's important that you study.)</li>
                <li><strong>Recommendations/Suggestions:</strong> <em>Te recomiendo que <strong>leas</strong> el libro.</em> (I recommend that you read the book.)</li>
            </ul>
            <p>Conjugation often involves changing the vowel ending of the present tense verb (e.g., -ar verbs take -e endings, -er/-ir verbs take -a endings).</p>
        `
    },
    {
        id: 'i4',
        title: 'Future and Conditional Tenses',
        description: 'Learn to talk about future events and hypothetical situations.',
        level: 'Intermediate',
        content: `
            <p>The future and conditional tenses are relatively straightforward as they use the infinitive form of the verb.</p>
            <h3>Future Simple (Futuro Simple):</h3>
            <ul>
                <li>Expresses actions that will happen in the future.</li>
                <li>Add endings to the infinitive: <strong>-é, -ás, -á, -emos, -éis, -án</strong>.</li>
            </ul>
            <p class="example-text"><em>Mañana <strong>hablaré</strong> con él.</em> (Tomorrow I will speak with him.)</p>
            <p class="example-text"><em>Ellos <strong>comerán</strong> la cena.</em> (They will eat dinner.)</p>
            <h3>Conditional Simple (Condicional Simple):</h3>
            <ul>
                <li>Expresses what would happen or hypothetical situations.</li>
                <li>Add endings to the infinitive: <strong>-ía, -ías, -ía, -íamos, -íais, -ían</strong>.</li>
            </ul>
            <p class="example-text"><em>Me <strong>gustaría</strong> viajar.</em> (I would like to travel.)</p>
            <p class="example-text"><em>Si tuviera tiempo, <strong>iría</strong> al cine.</em> (If I had time, I would go to the cinema.)</p>
        `
    },
    {
        id: 'i5',
        title: 'Reflexive Verbs and Pronouns',
        description: 'Understand verbs where the action reflects back on the subject (e.g., "lavarse" - to wash oneself).',
        level: 'Intermediate',
        content: `
            <p>Reflexive verbs are used when the subject performs the action on itself. They are always accompanied by a reflexive pronoun that matches the subject.</p>
            <h3>Reflexive Pronouns:</h3>
            <ul>
                <li><strong>Me:</strong> myself</li>
                <li><strong>Te:</strong> yourself (informal)</li>
                <li><strong>Se:</strong> himself/herself/itself/yourself (formal)</li>
                <li><strong>Nos:</strong> ourselves</li>
                <li><strong>Os:</strong> yourselves (informal, Spain)</li>
                <li><strong>Se:</strong> themselves/yourselves (formal)</li>
            </ul>
            <h3>Example (<em>lavarse</em> - to wash oneself):</h3>
            <ul>
                <li>Yo <strong>me</strong> lavo (I wash myself)</li>
                <li>Tú <strong>te</strong> lavas (You wash yourself)</li>
                <li>Él/Ella/Usted <strong>se</strong> lava (He/She/You wash yourself)</li>
                <li>Nosotros/as <strong>nos</strong> lavamos (We wash ourselves)</li>
                <li>Vosotros/as <strong>os</strong> laváis (You all wash yourselves)</li>
                <li>Ellos/Ellas/Ustedes <strong>se</strong> lavan (They/You all wash yourselves)</li>
            </ul>
            <p class="example-text"><em>Ella <strong>se</strong> viste rápidamente.</em> (She dresses herself quickly.)</p>
        `
    },
    {
        id: 'i6',
        title: 'Por vs. Para',
        description: 'Differentiate between "por" and "para" for "for" or "by".',
        level: 'Intermediate',
        content: `
            <p>The distinction between <strong>por</strong> and <strong>para</strong> is one of the most challenging aspects of Spanish grammar for English speakers, as both can often translate to "for" or "by".</p>
            <h3>Por (Reasons, Means, Duration, Exchange, Movement Through):</h3>
            <ul>
                <li><strong>Cause/Reason:</strong> <em>Gracias <strong>por</strong> la ayuda.</em> (Thanks for the help.)</li>
                <li><strong>Means/Method:</strong> <em>Viajamos <strong>por</strong> tren.</em> (We traveled by train.)</li>
                <li><strong>Duration:</strong> <em>Estudié <strong>por</strong> dos horas.</em> (I studied for two hours.)</li>
                <li><strong>Exchange:</strong> <em>Pagué diez dólares <strong>por</strong> el libro.</em> (I paid ten dollars for the book.)</li>
                <li><strong>Movement through:</strong> <em>Caminamos <strong>por</strong> el parque.</em> (We walked through the park.)</li>
            </ul>
            <h3>Para (Purpose, Destination, Recipient, Deadline, Opinion):</h3>
            <ul>
                <li><strong>Purpose/Goal:</strong> <em>Estudio <strong>para</strong> aprender.</em> (I study in order to learn.)</li>
                <li><strong>Destination:</strong> <em>Salgo <strong>para</strong> Madrid.</em> (I leave for Madrid.)</li>
                <li><strong>Recipient:</strong> <em>Este regalo es <strong>para</strong> ti.</em> (This gift is for you.)</li>
                <li><strong>Deadline:</strong> <em>Necesito el informe <strong>para</strong> el lunes.</em> (I need the report by Monday.)</li>
                <li><strong>Opinion:</strong> <em><strong>Para</strong> mí, es importante.</em> (For me, it's important.)</li>
            </ul>
            <p>Practice is key to mastering these prepositions!</p>
        `
    },
    {
        id: 'i7',
        title: 'Commands (Imperative Mood)',
        description: 'Form affirmative and negative commands for various situations.',
        level: 'Intermediate',
        content: `
            <p>The imperative mood is used to give commands or make requests.</p>
            <h3>Affirmative Commands:</h3>
            <ul>
                <li><strong>Tú (informal singular):</strong> For -AR verbs, use the él/ella form of the present tense (e.g., <em>Habla!</em> - Speak!). For -ER/-IR verbs, use the tú form minus the -s (e.g., <em>Come!</em> - Eat!, <em>Vive!</em> - Live!). Irregular forms exist.</li>
                <li><strong>Usted (formal singular):</strong> Use the subjunctive form (e.g., <em>Hable!</em>, <em>Coma!</em>, <em>Viva!</em>).</li>
                <li><strong>Nosotros/as (we):</strong> Use the subjunctive form (e.g., <em>Hablemos!</em>, <em>Comamos!</em>, <em>Vivamos!</em>).</li>
                <li><strong>Ustedes (formal plural):</strong> Use the subjunctive form (e.g., <em>Hablen!</em>, <em>Coman!</em>, <em>Vivan!</em>).</li>
            </ul>
            <h3>Negative Commands:</h3>
            <p>For all forms, use the negative particle "no" followed by the subjunctive form of the verb.</p>
            <p class="example-text"><em>No <strong>hables</strong>!</em> (Don't speak! - tú)</p>
            <p class="example-text"><em>No <strong>coma</strong>!</em> (Don't eat! - usted)</p>
        `
    },
    {
        id: 'i8',
        title: 'Comparatives and Superlatives',
        description: 'Compare items using "more/less than" and describe the "most/least" of something.',
        level: 'Intermediate',
        content: `
            <p>Comparatives and superlatives are used to compare nouns and describe their qualities.</p>
            <h3>Comparatives (More/Less Than):</h3>
            <ul>
                <li><strong>Más... que:</strong> more... than (e.g., <em>más grande que</em> - bigger than)</li>
                <li><strong>Menos... que:</strong> less... than (e.g., <em>menos rápido que</em> - slower than)</li>
                <li><strong>Tan... como:</strong> as... as (e.g., <em>tan alto como</em> - as tall as)</li>
            </ul>
            <p class="example-text"><em>Ella es <strong>más inteligente que</strong> él.</em> (She is more intelligent than him.)</p>
            <h3>Superlatives (The Most/Least):</h3>
            <ul>
                <li><strong>El/La/Los/Las más... de:</strong> the most... of (e.g., <em>el más alto de</em> - the tallest of)</li>
                <li><strong>El/La/Los/Las menos... de:</strong> the least... of (e.g., <em>la menos interesante de</em> - the least interesting of)</li>
            </ul>
            <p class="example-text"><em>Es <strong>la ciudad más bonita del</strong> mundo.</em> (It's the most beautiful city in the world.)</p>
        `
    },

    // Expert Level
    {
        id: 'e1',
        title: 'Perfect Tenses (Present, Past, Future Perfect)',
        description: 'Master compound tenses using "haber" to express completed actions relative to another point in time.',
        level: 'Expert',
        content: `
            <p>Perfect tenses use the auxiliary verb <strong>haber</strong> (to have) followed by a past participle.</p>
            <h3>Present Perfect (Pretérito Perfecto Compuesto):</h3>
            <ul>
                <li><strong>Haber (present) + past participle (-ado/-ido)</strong></li>
                <li>Used for actions completed recently or with relevance to the present.</li>
            </ul>
            <p class="example-text"><em>Yo <strong>he comido</strong>.</em> (I have eaten.)</p>
            <h3>Past Perfect (Pluscuamperfecto):</h3>
            <ul>
                <li><strong>Haber (imperfect) + past participle</strong></li>
                <li>Used for actions completed before another past action.</li>
            </ul>
            <p class="example-text"><em>Cuando llegué, ella ya <strong>había salido</strong>.</em> (When I arrived, she had already left.)</p>
            <h3>Future Perfect (Futuro Perfecto):</h3>
            <ul>
                <li><strong>Haber (future) + past participle</strong></li>
                <li>Used for actions that will be completed by a certain time in the future.</li>
            </ul>
            <p class="example-text"><em>Para mañana, <strong>habré terminado</strong> el proyecto.</em> (By tomorrow, I will have finished the project.)</p>
        `
    },
    {
        id: 'e2',
        title: 'Passive Voice (Ser + Past Participle)',
        description: 'Construct sentences where the subject receives the action, rather than performs it.',
        level: 'Expert',
        content: `
            <p>The passive voice is used when the focus is on the action being received, rather than who performed it.</p>
            <h3>Structure:</h3>
            <p><strong>Subject + Ser (conjugated) + Past Participle (agrees in gender/number) + por + Agent (optional)</strong></p>
            <ul>
                <li>The past participle must agree in gender and number with the subject.</li>
            </ul>
            <p class="example-text"><em>La casa <strong>fue construida</strong> por mi abuelo.</em> (The house was built by my grandfather.)</p>
            <p class="example-text"><em>Los libros <strong>son leídos</strong> por muchos estudiantes.</em> (The books are read by many students.)</p>
            <h3>Alternatives to Passive Voice:</h3>
            <p>Spanish often prefers active voice or the impersonal "se" construction:</p>
            <p class="example-text"><em><strong>Se habla</strong> español aquí.</em> (Spanish is spoken here. / One speaks Spanish here.)</p>
        `
    },
    {
        id: 'e3',
        title: 'Advanced Uses of Subjunctive',
        description: 'Explore complex scenarios requiring the subjunctive, including adverbial clauses and indefinite antecedents.',
        level: 'Expert',
        content: `
            <p>Beyond basic triggers, the subjunctive is used in more nuanced contexts:</p>
            <ul>
                <li><strong>Adverbial Clauses:</strong>
                    <ul>
                        <li><strong>Time (cuando, después de que, hasta que):</strong> If the action in the dependent clause is anticipated or hypothetical. <p class="example-text"><em>Te llamaré cuando <strong>llegue</strong>.</em> (I'll call you when I arrive - future arrival)</p></li>
                        <li><strong>Purpose (para que):</strong> <p class="example-text"><em>Estudio para que <strong>tenga</strong> buenas notas.</em> (I study so that I have good grades.)</p></li>
                        <li><strong>Concession (aunque):</strong> If the concession is uncertain. <p class="example-text"><em>Aunque <strong>llueva</strong>, saldremos.</em> (Even if it rains, we'll go out - uncertainty).</p></li>
                    </ul>
                </li>
                <li><strong>Indefinite Antecedents:</strong> When the noun being described is unknown or uncertain. <p class="example-text"><em>Busco un libro que <strong>sea</strong> interesante.</em> (I'm looking for a book that is interesting - any interesting book).</p></li>
                <li><strong>Negative/Uncertain Antecedents:</strong> <p class="example-text"><em>No hay nadie que <strong>sepa</strong> la respuesta.</em> (There's no one who knows the answer.)</p></li>
            </ul>
        `
    },
    {
        id: 'e4',
        title: 'Conditional Sentences (If Clauses)',
        description: 'Construct complex "if...then" sentences using various tenses and moods.',
        level: 'Expert',
        content: `
            <p>Conditional sentences express hypothetical situations and their consequences.</p>
            <h3>Type 1: Real/Possible Conditions (If + Present, then + Present/Future/Command)</h3>
            <p class="example-text"><em>Si <strong>estudias</strong>, <strong>aprenderás</strong> mucho.</em> (If you study, you will learn a lot.)</p>
            <h3>Type 2: Unreal/Hypothetical Conditions (If + Imperfect Subjunctive, then + Conditional)</h3>
            <p class="example-text"><em>Si <strong>tuviera</strong> dinero, <strong>compraría</strong> un coche.</em> (If I had money, I would buy a car.)</p>
            <h3>Type 3: Impossible Past Conditions (If + Past Perfect Subjunctive, then + Conditional Perfect)</h3>
            <p class="example-text"><em>Si <strong>hubieras estudiado</strong>, <strong>habrías aprobado</strong> el examen.</em> (If you had studied, you would have passed the exam.)</p>
            <p>Mastering these structures allows for nuanced expression of possibilities and regrets.</p>
        `
    },
    {
        id: 'e5',
        title: 'Idioms and Common Expressions',
        description: 'Learn and use popular Spanish idioms to sound more natural and fluent.',
        level: 'Expert',
        content: `
            <p>Idioms are phrases whose meaning isn't obvious from the individual words. They are key to sounding like a native speaker.</p>
            <h3>Examples:</h3>
            <ul>
                <li><strong>Estar en las nubes:</strong> To be in the clouds (to be daydreaming)</li>
                <li><strong>No tener pelos en la lengua:</strong> To not have hairs on the tongue (to be outspoken, to speak one's mind)</li>
                <li><strong>Costar un ojo de la cara:</strong> To cost an eye of the face (to be very expensive)</li>
                <li><strong>Meter la pata:</strong> To put the paw in (to mess up, to put one's foot in one's mouth)</li>
                <li><strong>De tal palo, tal astilla:</strong> From such a stick, such a splinter (like father, like son / chip off the old block)</li>
            </ul>
            <p>The best way to learn idioms is to encounter them in context and practice using them.</p>
        `
    },
    {
        id: 'e6',
        title: 'Formal vs. Informal Speech (Usted vs. Tú)',
        description: 'Deepen your understanding of when to use formal "usted" and informal "tú" forms.',
        level: 'Expert',
        content: `
            <p>Choosing between <strong>tú</strong> (informal "you") and <strong>usted</strong> (formal "you") is crucial for social appropriateness.</p>
            <h3>Tú (Informal):</h3>
            <ul>
                <li>Friends, family, children, peers.</li>
                <li>People you know well.</li>
                <li>Often used in more casual settings.</li>
            </ul>
            <h3>Usted (Formal):</h3>
            <ul>
                <li>Elders, superiors, strangers, people in positions of authority.</li>
                <li>In formal business settings.</li>
                <li>To show respect.</li>
            </ul>
            <p>In Latin America, <em>usted</em> is often used more broadly, even among acquaintances, depending on the region. In Spain, <em>vosotros</em> (informal plural) is used, while in Latin America, <em>ustedes</em> (formal plural, but often used for all plural "you") is common.</p>
            <p>When in doubt, it's generally safer to use <em>usted</em> to show respect.</p>
        `
    },
    {
        id: 'e7',
        title: 'Regional Dialects and Accents',
        description: 'Explore the diversity of Spanish dialects and common accent variations.',
        level: 'Expert',
        content: `
            <p>Spanish is spoken in many countries, leading to a rich variety of dialects and accents.</p>
            <h3>Key Variations:</h3>
            <ul>
                <li><strong>Castilian Spanish (Spain):</strong> Known for the "th" sound for 'c' before 'e/i' and 'z' (e.g., <em>gracias</em> sounds like "grathias"). Uses <em>vosotros</em>.</li>
                <li><strong>Latin American Spanish:</strong> Generally uses 's' sound for 'c' and 'z'. Does not use <em>vosotros</em>, instead using <em>ustedes</em> for all plural "you".</li>
                <li><strong>Rioplatense Spanish (Argentina/Uruguay):</strong> Distinct "sh" sound for 'll' and 'y'. Uses <em>vos</em> instead of <em>tú</em>.</li>
                <li><strong>Caribbean Spanish:</strong> Often drops 's' sounds at the end of syllables, faster pace.</li>
            </ul>
            <p>Understanding these variations enhances listening comprehension and cultural appreciation.</p>
        `
    },
    {
        id: 'e8',
        title: 'Spanish Culture and Etiquette',
        description: 'Gain insights into cultural norms, social customs, and etiquette in Spanish-speaking countries.',
        level: 'Expert',
        content: `
            <p>Language learning goes hand-in-hand with cultural understanding.</p>
            <h3>Key Cultural Aspects:</h3>
            <ul>
                <li><strong>Greetings:</strong> Kisses on the cheek (one or two, depending on region) are common among friends and family. Handshakes are typical in formal settings.</li>
                <li><strong>Punctuality:</strong> While business meetings usually require punctuality, social gatherings might have a more relaxed approach to time.</li>
                <li><strong>Personal Space:</strong> People generally stand closer to each other than in some other cultures.</li>
                <li><strong>Meal Times:</strong> Lunch (almuerzo) is often the largest meal and eaten later (e.g., 2-4 PM). Dinner (cena) is typically very late (e.g., 9 PM onwards).</li>
                <li><strong>Hospitality:</strong> Spanish speakers are often very welcoming and generous.</li>
                <li><strong>Fiestas/Celebrations:</strong> Festivals and holidays are vibrant and important social events.</li>
            </ul>
            <p>Being aware of these customs helps you integrate and communicate more effectively.</p>
        `
    }
];

// --- Lesson Data for English for Spanish Speakers ---
const englishLessonsData = [
    // Beginner Level
    {
        id: 'ees1',
        title: 'Saludos y Presentaciones Básicas',
        description: 'Aprende saludos fundamentales en inglés, despedidas y cómo presentarte.',
        level: 'Beginner',
        content: `
            <p>Empezar con los saludos es esencial para cualquier idioma. En inglés, los saludos comunes incluyen:</p>
            <ul>
                <li><strong>Hello:</strong> Hola (el más común)</li>
                <li><strong>Good morning:</strong> Buenos días</li>
                <li><strong>Good afternoon:</strong> Buenas tardes</li>
                <li><strong>Good evening:</strong> Buenas noches (al llegar)</li>
                <li><strong>Good night:</strong> Buenas noches (al despedirse o ir a dormir)</li>
            </ul>
            <h3>Presentarse:</h3>
            <p>Para decir "Me llamo..." puedes usar:</p>
            <p class="example-text"><strong>My name is [Tu Nombre].</strong></p>
            <p>O más informalmente:</p>
            <p class="example-text"><strong>I'm [Tu Nombre].</strong></p>
            <p>Para preguntar el nombre de alguien:</p>
            <p class="example-text"><strong>What's your name?</strong></p>
            <h3>Despedidas:</h3>
            <ul>
                <li><strong>Goodbye:</strong> Adiós</li>
                <li><strong>See you later:</strong> Hasta luego</li>
                <li><strong>Bye:</strong> Adiós (informal)</li>
            </ul>
        `
    },
    {
        id: 'ees2',
        title: 'Números 1-10 y Preguntas Simples',
        description: 'Domina el conteo del uno al diez y haz preguntas sencillas como "¿Cuántos?".',
        level: 'Beginner',
        content: `
            <p>Los números son fundamentales para las interacciones diarias. Aprendamos del 1 al 10:</p>
            <ol>
                <li><strong>One</strong></li>
                <li><strong>Two</strong></li>
                <li><strong>Three</strong></li>
                <li><strong>Four</strong></li>
                <li><strong>Five</strong></li>
                <li><strong>Six</strong></li>
                <li><strong>Seven</strong></li>
                <li><strong>Eight</strong></li>
                <li><strong>Nine</strong></li>
                <li><strong>Ten</strong></li>
            </ol>
            <h3>Preguntas Básicas:</h3>
            <p>Para preguntar "¿Cuántos/Cuántas?":</p>
            <p class="example-text"><strong>How many?</strong></p>
            <p>Ejemplos:</p>
            <p class="example-text"><strong>How many books do you have?</strong> (¿Cuántos libros tienes?)</p>
            <p class="example-text"><strong>How many apples do you want?</strong> (¿Cuántas manzanas quieres?)</p>
            <p>Otras preguntas útiles:</p>
            <ul>
                <li><strong>What?</strong> (¿Qué?)</li>
                <li><strong>Who?</strong> (¿Quién?)</li>
                <li><strong>Where?</strong> (¿Dónde?)</li>
            </ul>
        `
    },
    {
        id: 'ees3',
        title: 'Sustantivos Comunes y Artículos (A/An, The)',
        description: 'Aprende sustantivos cotidianos y cómo usar los artículos (un/una, el/la) correctamente.',
        level: 'Beginner',
        content: `
            <p>En inglés, los sustantivos no tienen género gramatical como en español, pero sí número (singular o plural). Los artículos son importantes.</p>
            <h3>Artículos Indefinidos (A/An - Un/Una):</h3>
            <ul>
                <li><strong>A:</strong> Se usa antes de sustantivos que empiezan con sonido de consonante. E.g., <em>a book</em> (un libro), <em>a car</em> (un coche).</li>
                <li><strong>An:</strong> Se usa antes de sustantivos que empiezan con sonido de vocal. E.g., <em>an apple</em> (una manzana), <em>an hour</em> (una hora - la 'h' es muda).</li>
            </ul>
            <h3>Artículo Definido (The - El/La/Los/Las):</h3>
            <ul>
                <li><strong>The:</strong> Se usa para referirse a algo específico, sin importar el género o número. E.g., <em>the dog</em> (el perro), <em>the dogs</em> (los perros), <em>the house</em> (la casa), <em>the houses</em> (las casas).</li>
            </ul>
            <h3>Sustantivos Comunes:</h3>
            <ul>
                <li><strong>Man:</strong> hombre</li>
                <li><strong>Woman:</strong> mujer</li>
                <li><strong>Boy/Girl:</strong> niño/niña</li>
                <li><strong>Water:</strong> agua</li>
                <li><strong>Food:</strong> comida</li>
            </ul>
        `
    },
    {
        id: 'ees4',
        title: 'Verbos Básicos: To Be (Ser y Estar)',
        description: 'Comprende el uso del verbo "to be" en inglés, que equivale a "ser" y "estar" en español.',
        level: 'Beginner',
        content: `
            <p>A diferencia del español, el inglés solo tiene un verbo para "ser" y "estar": <strong>to be</strong>. Su conjugación cambia según el pronombre.</p>
            <h3>Conjugación de "To Be" en Presente:</h3>
            <ul>
                <li><strong>I am:</strong> Yo soy/estoy</li>
                <li><strong>You are:</strong> Tú eres/estás (o Usted es/está, Ustedes son/están)</li>
                <li><strong>He/She/It is:</strong> Él/Ella/Ello es/está</li>
                <li><strong>We are:</strong> Nosotros/as somos/estamos</li>
                <li><strong>They are:</strong> Ellos/Ellas son/están</li>
            </ul>
            <h3>Ejemplos:</h3>
            <ul>
                <li><strong>Identity:</strong> <em>I am a student.</em> (Soy estudiante.)</li>
                <li><strong>Location:</strong> <em>She is at home.</em> (Ella está en casa.)</li>
                <li><strong>Feelings:</strong> <em>We are happy.</em> (Estamos felices.)</li>
                <li><strong>Characteristics:</strong> <em>He is tall.</em> (Él es alto.)</li>
            </ul>
            <p>El contexto te ayudará a saber si significa "ser" o "estar".</p>
        `
    },
    {
        id: 'ees5',
        title: 'Presente Simple (Verbos Regulares)',
        description: 'Aprende a conjugar verbos regulares en presente simple para acciones cotidianas.',
        level: 'Beginner',
        content: `
            <p>El presente simple se usa para acciones habituales, verdades generales y horarios.</p>
            <h3>Formación:</h3>
            <ul>
                <li>Para <strong>I, You, We, They</strong>: el verbo en su forma base. E.g., <em>I speak</em>, <em>You eat</em>, <em>We live</em>.</li>
                <li>Para <strong>He, She, It</strong>: se añade <strong>-s</strong> al final del verbo. E.g., <em>He speak<strong>s</strong></em>, <em>She eat<strong>s</strong></em>, <em>It live<strong>s</strong></em>.</li>
            </ul>
            <h3>Ejemplos:</h3>
            <ul>
                <li><em>I <strong>work</strong> every day.</em> (Trabajo todos los días.)</li>
                <li><em>She <strong>studies</strong> English.</em> (Ella estudia inglés.)</li>
                <li><em>They <strong>play</strong> soccer.</em> (Ellos juegan fútbol.)</li>
            </ul>
            <h3>Negación e Interrogación:</h3>
            <p>Se usa el auxiliar <strong>do/does</strong> (para He/She/It) + not para negar, y <strong>Do/Does</strong> al principio para preguntar.</p>
            <p class="example-text"><em>I <strong>do not</strong> work.</em> (No trabajo.)</p>
            <p class="example-text"><em><strong>Does</strong> she study English?</em> (¿Ella estudia inglés?)</p>
        `
    },
    {
        id: 'ees6',
        title: 'Adjetivos Básicos y Concordancia',
        description: 'Usa palabras descriptivas y asegúrate de que concuerden con los sustantivos.',
        level: 'Beginner',
        content: `
            <p>Los adjetivos describen sustantivos. En inglés, a diferencia del español, los adjetivos NO cambian por género o número.</p>
            <h3>Concordancia de Género y Número (¡No Cambian!):</h3>
            <ul>
                <li><strong>Red:</strong> rojo/roja/rojos/rojas. E.g., <em>a red book</em> (un libro rojo), <em>red houses</em> (casas rojas).</li>
                <li><strong>Big:</strong> grande/grandes. E.g., <em>a big car</em> (un coche grande), <em>big cities</em> (ciudades grandes).</li>
            </ul>
            <h3>Posición:</h3>
            <p>Los adjetivos en inglés casi siempre van ANTES del sustantivo que describen.</p>
            <p class="example-text"><em>I have a <strong>new car</strong>.</em> (Tengo un coche nuevo.)</p>
            <p>Algunos adjetivos comunes:</p>
            <ul>
                <li><strong>Happy:</strong> feliz</li>
                <li><strong>Sad:</strong> triste</li>
                <li><strong>Tall:</strong> alto</li>
                <li><strong>Short:</strong> bajo</li>
                <li><strong>Beautiful:</strong> hermoso/a</li>
            </ul>
        `
    },
    {
        id: 'ees7',
        title: 'Preguntar Direcciones y Lugares',
        description: 'Aprende frases para preguntar y dar direcciones, e identificar lugares comunes.',
        level: 'Beginner',
        content: `
            <p>Navegar en un país de habla inglesa requiere vocabulario específico:</p>
            <h3>Preguntar Direcciones:</h3>
            <ul>
                <li><strong>Where is [place]?</strong> (¿Dónde está [lugar]?)</li>
                <li><strong>How do I get to [place]?</strong> (¿Cómo llego a [lugar]?)</li>
                <li><strong>Is it far/near?</strong> (¿Está lejos/cerca?)</li>
            </ul>
            <h3>Dar Direcciones:</h3>
            <ul>
                <li><strong>Turn right/left:</strong> Gira a la derecha/izquierda</li>
                <li><strong>Go straight:</strong> Sigue recto</li>
                <li><strong>It's next to:</strong> Está al lado de</li>
                <li><strong>It's in front of:</strong> Está enfrente de</li>
            </ul>
            <h3>Lugares Comunes:</h3>
            <ul>
                <li><strong>Bank:</strong> banco</li>
                <li><strong>Restaurant:</strong> restaurante</li>
                <li><strong>Hotel:</strong> hotel</li>
                <li><strong>Store:</strong> tienda</li>
                <li><strong>Market:</strong> mercado</li>
            </ul>
        `
    },
    {
        id: 'ees8',
        title: 'Vocabulario de Comida y Bebida',
        description: 'Amplía tu vocabulario para pedir comida y bebidas en inglés.',
        level: 'Beginner',
        content: `
            <p>Comer y beber son centrales en la cultura. Aquí hay vocabulario esencial:</p>
            <h3>Comida:</h3>
            <ul>
                <li><strong>Breakfast:</strong> desayuno</li>
                <li><strong>Lunch:</strong> almuerzo</li>
                <li><strong>Dinner:</strong> cena</li>
                <li><strong>Water:</strong> agua</li>
                <li><strong>Coffee:</strong> café</li>
                <li><strong>Bread:</strong> pan</li>
                <li><strong>Meat:</strong> carne</li>
                <li><strong>Chicken:</strong> pollo</li>
                <li><strong>Fish:</strong> pescado</li>
                <li><strong>Vegetables:</strong> verduras</li>
                <li><strong>Fruits:</strong> frutas</li>
            </ul>
            <h3>Ordenar:</h3>
            <p class="example-text"><strong>I would like [item], please.</strong> (Quisiera [item], por favor.)</p>
            <p class="example-text"><strong>Can I have [item]?</strong> (¿Me trae [item]?)</p>
            <p class="example-text"><strong>The bill, please.</strong> (La cuenta, por favor.)</p>
        `
    },

    // Intermediate Level
    {
        id: 'eesi1',
        title: 'Pasado Simple vs. Pasado Continuo',
        description: 'Domina los dos tiempos pasados para acciones completadas vs. acciones en progreso en el pasado.',
        level: 'Intermediate',
        content: `
            <p>Comprender la diferencia entre el pasado simple (Simple Past) y el pasado continuo (Past Continuous) es crucial para describir eventos pasados.</p>
            <h3>Pasado Simple (Simple Past):</h3>
            <ul>
                <li>Se usa para acciones completadas en el pasado.</li>
                <li>A menudo responde a "¿qué pasó?".</li>
                <li>Verbos regulares: se añade <strong>-ed</strong> (e.g., <em>walked, played</em>).</li>
                <li>Verbos irregulares: cambian su forma (e.g., <em>ate, went, saw</em>).</li>
            </ul>
            <p class="example-text"><em>Yesterday I <strong>ate</strong> paella.</em> (Ayer comí paella. - acción completada)</p>
            <h3>Pasado Continuo (Past Continuous):</h3>
            <ul>
                <li>Se usa para acciones que estaban en progreso en un momento específico del pasado.</li>
                <li>Formación: <strong>was/were + verbo-ing</strong>.</li>
                <li>Describe "lo que estaba pasando".</li>
            </ul>
            <p class="example-text"><em>While I <strong>was reading</strong>, the phone rang.</em> (Mientras leía, sonó el teléfono. - acción en progreso)</p>
            <p class="example-text"><em>At 8 PM, I <strong>was watching</strong> TV.</em> (A las 8 PM, estaba viendo la televisión.)</p>
        `
    },
    {
        id: 'eesi2',
        title: 'Pronombres de Objeto Directo e Indirecto',
        description: 'Aprende a usar pronombres como "me, him, her, them" para simplificar oraciones.',
        level: 'Intermediate',
        content: `
            <p>Los pronombres de objeto reemplazan a los sustantivos para evitar repeticiones.</p>
            <h3>Pronombres de Objeto Directo (responden "¿qué?" o "¿a quién?"):</h3>
            <ul>
                <li><strong>Me:</strong> me</li>
                <li><strong>You:</strong> te/le/les (a ti/usted/ustedes)</li>
                <li><strong>Him:</strong> le (a él)</li>
                <li><strong>Her:</strong> le (a ella)</li>
                <li><strong>It:</strong> lo/la (a ello)</li>
                <li><strong>Us:</strong> nos</li>
                <li><strong>Them:</strong> los/las (a ellos/ellas)</li>
            </ul>
            <p class="example-text"><em>I bought the book. -> I bought <strong>it</strong>.</em> (Compré el libro. -> Lo compré.)</p>
            <h3>Pronombres de Objeto Indirecto (responden "¿a quién?" o "¿para quién?"):</h3>
            <p>Los pronombres de objeto indirecto en inglés son los mismos que los directos, y generalmente van ANTES del objeto directo si no hay preposición.</p>
            <p class="example-text"><em>I gave the gift to Maria. -> I gave <strong>her</strong> the gift.</em> (Di el regalo a María. -> Le di el regalo a ella.)</p>
            <p class="example-text"><em>I gave <strong>it to her</strong>.</em> (Se lo di.)</p>
        `
    },
    {
        id: 'eesi3',
        title: 'Verbos Modales (Can, Could, Should, Must)',
        description: 'Comprende y aplica verbos modales para expresar habilidad, posibilidad, obligación y consejo.',
        level: 'Intermediate',
        content: `
            <p>Los verbos modales (modal verbs) se usan para expresar habilidad, posibilidad, permiso, obligación, consejo, etc. Siempre van seguidos de un verbo en su forma base (infinitivo sin "to").</p>
            <h3>Modales Comunes:</h3>
            <ul>
                <li><strong>Can:</strong> habilidad, posibilidad, permiso. <p class="example-text"><em>I <strong>can</strong> speak English.</em> (Puedo hablar inglés.)</p></li>
                <li><strong>Could:</strong> habilidad en el pasado, posibilidad, sugerencia. <p class="example-text"><em>I <strong>could</strong> swim when I was five.</em> (Podía nadar cuando tenía cinco años.)</p></li>
                <li><strong>Should:</strong> consejo, recomendación. <p class="example-text"><em>You <strong>should</strong> study more.</em> (Deberías estudiar más.)</p></li>
                <li><strong>Must:</strong> obligación fuerte, deducción lógica. <p class="example-text"><em>You <strong>must</strong> finish your homework.</em> (Debes terminar tu tarea.)</p></li>
                <li><strong>May/Might:</strong> posibilidad, permiso. <p class="example-text"><em>It <strong>may</strong> rain tomorrow.</em> (Puede que llueva mañana.)</p></li>
            </ul>
            <p>Los modales no cambian con el sujeto (no se añade -s para he/she/it).</p>
        `
    },
    {
        id: 'eesi4',
        title: 'Futuro Simple y "Going To"',
        description: 'Aprende a hablar sobre eventos futuros utilizando "will" y "be going to".',
        level: 'Intermediate',
        content: `
            <p>El inglés tiene varias formas de expresar el futuro. Las más comunes son "will" y "be going to".</p>
            <h3>Future Simple (Will):</h3>
            <ul>
                <li>Se usa para decisiones espontáneas, predicciones generales, promesas y ofertas.</li>
                <li>Formación: <strong>will + verbo en forma base</strong>.</li>
            </ul>
            <p class="example-text"><em>I <strong>will talk</strong> to him tomorrow.</em> (Hablaré con él mañana. - Decisión espontánea)</p>
            <p class="example-text"><em>It <strong>will rain</strong> soon.</em> (Lloverá pronto. - Predicción)</p>
            <h3>"Be Going To":</h3>
            <ul>
                <li>Se usa para planes o intenciones ya decididas, y predicciones basadas en evidencia presente.</li>
                <li>Formación: <strong>am/is/are + going to + verbo en forma base</strong>.</li>
            </ul>
            <p class="example-text"><em>I <strong>am going to eat</strong> dinner.</em> (Voy a cenar. - Plan)</p>
            <p class="example-text"><em>Look at those clouds! It's <strong>going to rain</strong>.</em> (¡Mira esas nubes! Va a llover. - Evidencia)</p>
        `
    },
    {
        id: 'eesi5',
        title: 'Verbos Frasales Comunes',
        description: 'Comprende y utiliza verbos frasales (verb + preposition/adverb) para un inglés más natural.',
        level: 'Intermediate',
        content: `
            <p>Los verbos frasales (phrasal verbs) son combinaciones de un verbo y una o más preposiciones o adverbios que cambian el significado del verbo original. Son muy comunes en el inglés hablado y escrito.</p>
            <h3>Ejemplos Comunes:</h3>
            <ul>
                <li><strong>Look up:</strong> buscar (en un diccionario, internet). <p class="example-text"><em>I need to <strong>look up</strong> this word.</em> (Necesito buscar esta palabra.)</p></li>
                <li><strong>Give up:</strong> rendirse, dejar de hacer algo. <p class="example-text"><em>Don't <strong>give up</strong>!</em> (¡No te rindas!)</p></li>
                <li><strong>Take off:</strong> despegar (avión), quitarse (ropa). <p class="example-text"><em>The plane <strong>took off</strong> at 7 AM.</em> (El avión despegó a las 7 AM.)</p></li>
                <li><strong>Turn on/off:</strong> encender/apagar. <p class="example-text"><em>Please <strong>turn on</strong> the light.</em> (Por favor, enciende la luz.)</p></li>
                <li><strong>Get up:</strong> levantarse. <p class="example-text"><em>I <strong>get up</strong> at 6 AM.</em> (Me levanto a las 6 AM.)</p></li>
            </ul>
            <p>El significado de los phrasal verbs a menudo no es literal, por lo que es importante aprenderlos y practicarlos.</p>
        `
    },
    {
        id: 'eesi6',
        title: 'Preposiciones de Lugar y Tiempo',
        description: 'Usa "in, on, at" y otras preposiciones para indicar ubicación y momento.',
        level: 'Intermediate',
        content: `
            <p>Las preposiciones son pequeñas palabras que indican la relación entre elementos en una oración, especialmente de lugar y tiempo.</p>
            <h3>Preposiciones de Lugar:</h3>
            <ul>
                <li><strong>In:</strong> dentro de (espacios cerrados, ciudades, países). <p class="example-text"><em><strong>In</strong> the box, <strong>in</strong> London, <strong>in</strong> Spain.</em></p></li>
                <li><strong>On:</strong> sobre (superficies, calles, días de la semana). <p class="example-text"><em><strong>On</strong> the table, <strong>on</strong> Oxford Street, <strong>on</strong> Monday.</em></p></li>
                <li><strong>At:</strong> en (puntos específicos, direcciones, eventos). <p class="example-text"><em><strong>At</strong> the bus stop, <strong>at</strong> 23 Main Street, <strong>at</strong> the party.</em></p></li>
                <li><strong>Next to:</strong> al lado de</li>
                <li><strong>Between:</strong> entre (dos cosas)</li>
                <li><strong>Among:</strong> entre (varias cosas)</li>
            </ul>
            <h3>Preposiciones de Tiempo:</h3>
            <ul>
                <li><strong>In:</strong> meses, años, estaciones, partes del día (excepto "at night"). <p class="example-text"><em><strong>In</strong> July, <strong>in</strong> 2025, <strong>in</strong> the morning.</em></p></li>
                <li><strong>On:</strong> días específicos, fechas. <p class="example-text"><em><strong>On</strong> Sunday, <strong>on</strong> July 14th.</em></p></li>
                <li><strong>At:</strong> horas, momentos específicos. <p class="example-text"><em><strong>At</strong> 3 PM, <strong>at</strong> night, <strong>at</strong> midnight.</em></p></li>
            </ul>
        `
    },
    {
        id: 'eesi7',
        title: 'Comparativos y Superlativos',
        description: 'Compara elementos usando "más/menos que" y describe "el más/el menos" de algo.',
        level: 'Intermediate',
        content: `
            <p>Los comparativos y superlativos se usan para comparar sustantivos y describir sus cualidades.</p>
            <h3>Comparativos (Más/Menos Que):</h3>
            <ul>
                <li><strong>Adjetivos cortos (1 sílaba o 2 terminadas en -y):</strong> Adjetivo<strong>-er + than</strong>. E.g., <em>tall<strong>er than</strong></em> (más alto que), <em>happi<strong>er than</strong></em> (más feliz que).</li>
                <li><strong>Adjetivos largos (2+ sílabas):</strong> <strong>More/Less + adjetivo + than</strong>. E.g., <em><strong>more intelligent than</strong></em> (más inteligente que), <em><strong>less expensive than</strong></em> (menos caro que).</li>
            </ul>
            <p class="example-text"><em>She is <strong>smarter than</strong> him.</em> (Ella es más inteligente que él.)</p>
            <h3>Superlativos (El Más/El Menos):</h3>
            <ul>
                <li><strong>Adjetivos cortos:</strong> <strong>The + adjetivo-est</strong>. E.g., <em><strong>the tallest</strong></em> (el más alto), <em><strong>the happiest</strong></em> (el más feliz).</li>
                <li><strong>Adjetivos largos:</strong> <strong>The most/least + adjetivo</strong>. E.g., <em><strong>the most beautiful</strong></em> (el más hermoso), <em><strong>the least interesting</strong></em> (el menos interesante).</li>
            </ul>
            <p class="example-text"><em>It's <strong>the most beautiful city in</strong> the world.</em> (Es la ciudad más bonita del mundo.)</p>
        `
    },
    {
        id: 'eesi8',
        title: 'Voz Pasiva',
        description: 'Construye oraciones donde el sujeto recibe la acción, en lugar de realizarla.',
        level: 'Intermediate',
        content: `
            <p>La voz pasiva se usa cuando el enfoque está en la acción que se recibe, no en quién la realizó.</p>
            <h3>Estructura:</h3>
            <p><strong>Sujeto + To Be (conjugado) + Participio Pasado (verbo en 3ª columna) + by + Agente (opcional)</strong></p>
            <ul>
                <li>El participio pasado es la tercera forma del verbo (e.g., <em>eaten, built, seen</em>).</li>
            </ul>
            <p class="example-text"><em>The house <strong>was built</strong> by my grandfather.</em> (La casa fue construida por mi abuelo.)</p>
            <p class="example-text"><em>The books <strong>are read</strong> by many students.</em> (Los libros son leídos por muchos estudiantes.)</p>
            <h3>Usos Comunes:</h3>
            <ul>
                <li>Cuando el agente es desconocido o no importante.</li>
                <li>En contextos formales o científicos.</li>
            </ul>
        `
    },

    // Expert Level
    {
        id: 'eese1',
        title: 'Tiempos Perfectos (Presente, Pasado, Futuro Perfecto)',
        description: 'Domina los tiempos compuestos usando "have/had/will have" para acciones completadas en relación con otro momento.',
        level: 'Expert',
        content: `
            <p>Los tiempos perfectos usan el auxiliar <strong>have</strong> (o sus formas <em>has, had, will have</em>) seguido de un participio pasado.</p>
            <h3>Presente Perfecto (Present Perfect):</h3>
            <ul>
                <li><strong>Have/Has + participio pasado</strong></li>
                <li>Se usa para acciones completadas recientemente o con relevancia para el presente.</li>
            </ul>
            <p class="example-text"><em>I <strong>have eaten</strong>.</em> (He comido.)</p>
            <p class="example-text"><em>She <strong>has finished</strong> her homework.</em> (Ella ha terminado su tarea.)</p>
            <h3>Pasado Perfecto (Past Perfect):</h3>
            <ul>
                <li><strong>Had + participio pasado</strong></li>
                <li>Se usa para acciones completadas antes de otra acción pasada.</li>
            </ul>
            <p class="example-text"><em>When I arrived, she <strong>had already left</strong>.</em> (Cuando llegué, ella ya se había ido.)</p>
            <h3>Futuro Perfecto (Future Perfect):</h3>
            <ul>
                <li><strong>Will have + participio pasado</strong></li>
                <li>Se usa para acciones que estarán completadas en un momento determinado en el futuro.</li>
            </ul>
            <p class="example-text"><em>By tomorrow, I <strong>will have finished</strong> the project.</em> (Para mañana, habré terminado el proyecto.)</p>
        `
    },
    {
        id: 'eese2',
        title: 'Oraciones Condicionales (If Clauses)',
        description: 'Construye oraciones complejas "si... entonces" usando varios tiempos y modos.',
        level: 'Expert',
        content: `
            <p>Las oraciones condicionales expresan situaciones hipotéticas y sus consecuencias.</p>
            <h3>Tipo 0: Verdades Generales (If + Present Simple, then + Present Simple)</h3>
            <p class="example-text"><em>If you <strong>heat</strong> water, it <strong>boils</strong>.</em> (Si calientas agua, hierve.)</p>
            <h3>Tipo 1: Condiciones Reales/Posibles (If + Present Simple, then + Future Simple)</h3>
            <p class="example-text"><em>If you <strong>study</strong>, you <strong>will learn</strong> a lot.</em> (Si estudias, aprenderás mucho.)</p>
            <h3>Tipo 2: Condiciones Irreales/Hipotéticas (If + Past Simple, then + Conditional Simple)</h3>
            <p class="example-text"><em>If I <strong>had</strong> money, I <strong>would buy</strong> a car.</em> (Si tuviera dinero, compraría un coche.)</p>
            <h3>Tipo 3: Condiciones Imposibles en el Pasado (If + Past Perfect, then + Conditional Perfect)</h3>
            <p class="example-text"><em>If you <strong>had studied</strong>, you <strong>would have passed</strong> the exam.</em> (Si hubieras estudiado, habrías aprobado el examen.)</p>
        `
    },
    {
        id: 'eese3',
        title: 'Reportar Discurso (Reported Speech)',
        description: 'Transforma el discurso directo en discurso indirecto, prestando atención a los cambios de tiempo y pronombres.',
        level: 'Expert',
        content: `
            <p>El discurso reportado (Reported Speech o Indirect Speech) se usa para contar lo que alguien dijo sin citar sus palabras exactas.</p>
            <h3>Cambios Comunes:</h3>
            <ul>
                <li><strong>Cambio de tiempo verbal:</strong> El tiempo verbal en la oración reportada suele "retroceder" un paso en el pasado.
                    <ul>
                        <li>Present Simple -> Past Simple</li>
                        <li>Present Continuous -> Past Continuous</li>
                        <li>Past Simple -> Past Perfect</li>
                        <li>Future Simple (will) -> Conditional (would)</li>
                    </ul>
                </li>
                <li><strong>Cambio de pronombres:</strong> Ajustar pronombres según el contexto.</li>
                <li><strong>Cambio de expresiones de tiempo y lugar:</strong>
                    <ul>
                        <li>Now -> then</li>
                        <li>Today -> that day</li>
                        <li>Here -> there</li>
                    </ul>
                </li>
            </ul>
            <h3>Ejemplos:</h3>
            <p class="example-text">Direct: <em>He said, "I am happy."</em></p>
            <p class="example-text">Reported: <em>He said that he <strong>was</strong> happy.</em></p>
            <p class="example-text">Direct: <em>She asked, "Where is the bank?"</em></p>
            <p class="example-text">Reported: <em>She asked where the bank <strong>was</strong>.</em></p>
        `
    },
    {
        id: 'eese4',
        title: 'Usos Avanzados de Artículos y Cuantificadores',
        description: 'Profundiza en el uso de "a/an, the, no article" y cuantificadores como "much, many, few, little".',
        level: 'Expert',
        content: `
            <p>El uso de artículos y cuantificadores en inglés puede ser complejo.</p>
            <h3>Artículos (A/An, The, No Article):</h3>
            <ul>
                <li><strong>A/An:</strong> Para sustantivos contables singulares no específicos.</li>
                <li><strong>The:</strong> Para sustantivos específicos (contables o incontables, singulares o plurales).</li>
                <li><strong>No Article:</strong> Para sustantivos plurales o incontables en general, o para nombres propios.</li>
            </ul>
            <p class="example-text"><em>I like <strong>music</strong>.</em> (Me gusta la música - en general)</p>
            <p class="example-text"><em>I like <strong>the music</strong> in this restaurant.</em> (Me gusta la música en este restaurante - específica)</p>
            <h3>Cuantificadores:</h3>
            <ul>
                <li><strong>Much:</strong> con sustantivos incontables (e.g., <em>much water</em>).</li>
                <li><strong>Many:</strong> con sustantivos contables plurales (e.g., <em>many books</em>).</li>
                <li><strong>A lot of/Lots of:</strong> con ambos (e.g., <em>a lot of money, a lot of friends</em>).</li>
                <li><strong>Few/A few:</strong> con contables (pocos/unos pocos).</li>
                <li><strong>Little/A little:</strong> con incontables (poco/un poco).</li>
            </ul>
        `
    },
    {
        id: 'eese5',
        title: 'Modismos y Expresiones Idiomáticas',
        description: 'Aprende y utiliza modismos populares en inglés para sonar más natural y fluido.',
        level: 'Expert',
        content: `
            <p>Los modismos (idioms) son frases cuyo significado no es obvio a partir de las palabras individuales. Son clave para sonar como un hablante nativo.</p>
            <h3>Ejemplos:</h3>
            <ul>
                <li><strong>It's raining cats and dogs:</strong> Llueve a cántaros.</li>
                <li><strong>Break a leg:</strong> ¡Mucha suerte! (literalmente: rómpete una pierna)</li>
                <li><strong>Bite the bullet:</strong> Afrontar una situación difícil con valentía.</li>
                <li><strong>Hit the road:</strong> Ponerse en marcha, irse.</li>
                <li><strong>Piece of cake:</strong> Pan comido, algo muy fácil.</li>
            </ul>
            <p>La mejor manera de aprender modismos es encontrarlos en contexto y practicarlos.</p>
        `
    },
    {
        id: 'eese6',
        title: 'Diferencias entre Inglés Británico y Americano',
        description: 'Explora las variaciones en vocabulario, pronunciación y gramática entre el inglés británico y americano.',
        level: 'Expert',
        content: `
            <p>Aunque mutuamente inteligibles, el inglés británico (BrE) y el americano (AmE) tienen diferencias notables.</p>
            <h3>Vocabulario:</h3>
            <ul>
                <li><strong>BrE:</strong> lift, flat, lorry, rubbish, pavement</li>
                <li><strong>AmE:</strong> elevator, apartment, truck, garbage, sidewalk</li>
            </ul>
            <h3>Pronunciación:</h3>
            <ul>
                <li>La 'r' al final de la palabra se pronuncia en AmE (e.g., car), pero no en BrE (e.g., car suena como "ca").</li>
                <li>La 't' entre vocales en AmE a menudo suena como 'd' suave (e.g., water), mientras que en BrE es una 't' clara.</li>
            </ul>
            <h3>Gramática:</h3>
            <ul>
                <li><strong>Present Perfect:</strong> BrE lo usa más para acciones recientes. AmE a menudo usa Past Simple. <p class="example-text">BrE: <em>I've just eaten.</em> AmE: <em>I just ate.</em></p></li>
                <li><strong>Got/Gotten:</strong> BrE usa "got" como participio pasado de "get". AmE usa "gotten".</li>
            </ul>
            <p>Elegir un dialecto para enfocarse puede ayudar, pero entender las diferencias es beneficioso.</p>
        `
    },
    {
        id: 'eese7',
        title: 'Pronunciación Avanzada y Entonación',
        description: 'Mejora tu pronunciación y entonación para sonar más natural y comprensible.',
        level: 'Expert',
        content: `
            <p>La pronunciación y la entonación son clave para la fluidez y la comprensión.</p>
            <h3>Aspectos Clave:</h3>
            <ul>
                <li><strong>Sonidos vocálicos:</strong> El inglés tiene más sonidos vocálicos que el español, incluyendo diptongos y vocales reducidas (schwa).</li>
                <li><strong>Sonidos consonánticos:</strong> Diferencias en la 'r', 'th', 'w', 'v'.</li>
                <li><strong>Estrés de la palabra:</strong> La sílaba tónica en inglés es muy importante y puede cambiar el significado (e.g., 'present' - regalo vs. presentar).</li>
                <li><strong>Estrés de la oración y ritmo:</strong> Algunas palabras en una oración se enfatizan más que otras. El inglés es un idioma con "estrés de sílaba" (stress-timed language).</li>
                <li><strong>Entonación:</strong> El patrón de subida y bajada del tono de voz. Es crucial para expresar preguntas, afirmaciones, emociones.</li>
            </ul>
            <p>Practicar con hablantes nativos y usar recursos de audio es fundamental.</p>
        `
    },
    {
        id: 'eese8',
        title: 'Cultura y Etiqueta Anglosajona',
        description: 'Obtén información sobre las normas culturales, costumbres sociales y etiqueta en países de habla inglesa.',
        level: 'Expert',
        content: `
            <p>Aprender un idioma va de la mano con comprender su cultura.</p>
            <h3>Aspectos Culturales Clave:</h3>
            <ul>
                <li><strong>Saludos:</strong> Un apretón de manos es común en la mayoría de las situaciones. Los abrazos y besos son más reservados para amigos cercanos y familiares.</li>
                <li><strong>Puntualidad:</strong> La puntualidad es generalmente muy valorada, especialmente en entornos profesionales.</li>
                <li><strong>Espacio Personal:</strong> La gente tiende a mantener una mayor distancia física en las conversaciones que en muchas culturas hispanas.</li>
                <li><strong>Horarios de Comidas:</strong> Las comidas suelen ser más tempranas que en España o América Latina (e.g., almuerzo al mediodía, cena a partir de las 6-7 PM).</li>
                <li><strong>Conversación:</strong> Evitar temas muy personales al principio. El humor y las bromas son comunes.</li>
                <li><strong>Propina (Tipping):</strong> Es una práctica común y esperada en muchos servicios (restaurantes, taxis).</li>
            </ul>
            <p>Ser consciente de estas costumbres te ayudará a integrarte y comunicarte de manera más efectiva.</p>
        `
    }
];

// Global variables for the app
let currentCourse = 'spanish'; // 'spanish' or 'english'
let lessonsData = spanishLessonsData; // Initially set to Spanish lessons
let progress = {};

// Get references to DOM elements
const appTitle = document.getElementById('appTitle');
const mainTitle = document.getElementById('mainTitle');
const mainSubtitle = document.getElementById('mainSubtitle');
const learningContent = document.getElementById('learningContent');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetProgressBtn = document.getElementById('resetProgressBtn');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');
const overlay = document.getElementById('overlay');

// Course selector buttons
const spanishCourseBtn = document.getElementById('spanishCourseBtn');
const englishCourseBtn = document.getElementById('englishCourseBtn');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

/**
 * Shows a custom confirmation dialog.
 * @param {string} message - The message to display.
 * @returns {Promise<boolean>} - A promise that resolves to true if confirmed, false if canceled.
 */
function showConfirmation(message) {
    return new Promise((resolve) => {
        messageText.textContent = message;
        messageBox.style.display = 'block';
        overlay.style.display = 'block';

        const onConfirm = () => {
            messageBox.style.display = 'none';
            overlay.style.display = 'none';
            confirmButton.removeEventListener('click', onConfirm);
            cancelButton.removeEventListener('click', onCancel);
            resolve(true);
        };

        const onCancel = () => {
            messageBox.style.display = 'none';
            overlay.style.display = 'none';
            confirmButton.removeEventListener('click', onConfirm);
            cancelButton.removeEventListener('click', onCancel);
            resolve(false);
        };

        confirmButton.addEventListener('click', onConfirm);
        cancelButton.addEventListener('click', onCancel);
    });
}

/**
 * Loads the user's progress from LocalStorage based on the current course.
 * If no progress is found, initializes an empty object.
 */
function loadProgress() {
    try {
        const storageKey = `${currentCourse}LearningProgress`;
        const storedProgress = localStorage.getItem(storageKey);
        if (storedProgress) {
            progress = JSON.parse(storedProgress);
        } else {
            progress = {}; // Initialize empty if nothing found
        }
    } catch (e) {
        console.error("Failed to load progress from LocalStorage:", e);
        progress = {}; // Fallback to empty progress on error
    }
}

/**
 * Saves the current progress object to LocalStorage based on the current course.
 */
function saveProgress() {
    try {
        const storageKey = `${currentCourse}LearningProgress`;
        localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
        console.error("Failed to save progress to LocalStorage:", e);
    }
}

/**
 * Updates the progress display (text and progress bar).
 */
function updateProgressDisplay() {
    const completedLessons = Object.values(progress).filter(status => status).length;
    const totalLessons = lessonsData.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    progressText.textContent = `${percentage}% Complete (${completedLessons}/${totalLessons} Lessons)`;
    progressBar.style.width = `${percentage}%`;
}

/**
 * Toggles the completion status of a lesson.
 * @param {string} lessonId - The ID of the lesson to toggle.
 */
function toggleLessonCompletion(lessonId) {
    // Toggle the status
    progress[lessonId] = !progress[lessonId];
    saveProgress(); // Save updated progress
    renderLessons(); // Re-render to update UI
    updateProgressDisplay(); // Update progress text and bar
}

/**
 * Opens the lightbox with specific lesson content.
 * @param {object} lesson - The lesson object containing title and content.
 */
function openLightbox(lesson) {
    lightboxTitle.textContent = lesson.title;
    lightboxContent.innerHTML = lesson.content; // Use innerHTML for rich content
    lightbox.style.display = 'block';
    overlay.style.display = 'block';
}

/**
 * Closes the lightbox.
 */
function closeLightbox() {
    lightbox.style.display = 'none';
    overlay.style.display = 'none';
}

/**
 * Renders all lessons dynamically into the HTML.
 * Groups lessons by their level.
 */
function renderLessons() {
    learningContent.innerHTML = ''; // Clear existing content

    // Group lessons by level
    const groupedLessons = lessonsData.reduce((acc, lesson) => {
        if (!acc[lesson.level]) {
            acc[lesson.level] = [];
        }
        acc[lesson.level].push(lesson);
        return acc;
    }, {});

    // Iterate over each level and create its section
    for (const level in groupedLessons) {
        const levelSection = document.createElement('section');
        levelSection.className = 'mb-8'; // Margin below each level section

        const levelTitle = document.createElement('h2');
        levelTitle.className = 'level-title';
        levelTitle.textContent = `${level} Level`;
        levelSection.appendChild(levelTitle);

        // Create a grid for lessons within each level for better responsiveness
        const lessonsGrid = document.createElement('div');
        lessonsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'; // Responsive grid

        groupedLessons[level].forEach(lesson => {
            const lessonCard = document.createElement('div');
            lessonCard.className = 'card'; // Apply card styling
            lessonCard.setAttribute('data-lesson-id', lesson.id); // Store lesson ID for easy lookup

            // Add click listener to the card itself to open the lightbox
            lessonCard.addEventListener('click', (event) => {
                // Prevent click on the button from also opening the lightbox
                if (!event.target.classList.contains('complete-button')) {
                    openLightbox(lesson);
                }
            });

            const lessonTitle = document.createElement('h3');
            lessonTitle.className = 'lesson-title';
            lessonTitle.textContent = lesson.title;
            lessonCard.appendChild(lessonTitle);

            const lessonDescription = document.createElement('p');
            lessonDescription.className = 'lesson-description';
            lessonDescription.textContent = lesson.description;
            lessonCard.appendChild(lessonDescription);

            const completeButton = document.createElement('button');
            completeButton.id = `btn-${lesson.id}`;
            completeButton.className = 'complete-button w-full'; // Full width button

            // Check if the lesson is completed and set button text/class accordingly
            if (progress[lesson.id]) {
                completeButton.textContent = 'Mark as Incomplete';
                completeButton.classList.add('completed');
            } else {
                completeButton.textContent = 'Mark as Complete';
                completeButton.classList.remove('completed');
            }

            // Add event listener to toggle completion status
            completeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent card's click event from firing
                toggleLessonCompletion(lesson.id);
            });
            lessonCard.appendChild(completeButton);

            lessonsGrid.appendChild(lessonCard);
        });
        levelSection.appendChild(lessonsGrid);
        learningContent.appendChild(levelSection);
    }
}

/**
 * Resets all progress for the current course.
 */
async function resetProgress() {
    const confirmed = await showConfirmation(`Are you sure you want to reset all your progress for the ${currentCourse === 'spanish' ? 'Spanish' : 'English'} course? This action cannot be undone.`);
    if (confirmed) {
        const storageKey = `${currentCourse}LearningProgress`;
        localStorage.removeItem(storageKey);
        progress = {}; // Reset the progress object
        renderLessons(); // Re-render to reflect reset
        updateProgressDisplay(); // Update progress display
    }
}

/**
 * Switches the active learning course.
 * @param {string} courseName - 'spanish' or 'english'.
 */
function switchCourse(courseName) {
    
    //if (currentCourse === courseName) return; // No change needed

    currentCourse = courseName;

    // Update main titles and subtitles
    if (currentCourse === 'spanish') {
        lessonsData = spanishLessonsData;
        mainTitle.textContent = 'Spanish Learning Path';
        mainSubtitle.textContent = 'Your journey from beginner to Spanish expert!';
        spanishCourseBtn.classList.add('active');
        englishCourseBtn.classList.remove('active');
    } else {
        lessonsData = englishLessonsData;
        mainTitle.textContent = 'English Learning Path';
        mainSubtitle.textContent = 'Your journey from beginner to English expert!';
        spanishCourseBtn.classList.remove('active');
        englishCourseBtn.classList.add('active');
    }

    loadProgress(); // Load progress for the new course
    renderLessons(); // Render lessons for the new course
    updateProgressDisplay(); // Update progress display for the new course
    
    localStorage.setItem('lastActiveCourse', currentCourse);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for course selector buttons
    spanishCourseBtn.addEventListener('click', () => switchCourse('spanish'));
    englishCourseBtn.addEventListener('click', () => switchCourse('english'));

    // Event listener for the reset button
    resetProgressBtn.addEventListener('click', resetProgress);

    // Event listeners for lightbox close button and overlay
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox); // Close lightbox when clicking outside
    
    // Determine initial course based on previous state or default to Spanish
    const lastCourse = localStorage.getItem('lastActiveCourse');
    if (lastCourse === 'english') {
        switchCourse('english');
    } else {
        switchCourse('spanish'); // Default to Spanish
    }
    // Save the last active course when the page is closed or reloaded
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('lastActiveCourse', currentCourse);
    });
});
