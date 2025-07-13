// Array of Spanish learning lessons, categorized by level
const lessonsData = [
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

// Object to store the completion status of each lesson
let progress = {};

// Get references to DOM elements
const learningContent = document.getElementById('learningContent');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetProgressBtn = document.getElementById('resetProgressBtn');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');
const overlay = document.getElementById('overlay');

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
 * Loads the user's progress from LocalStorage.
 * If no progress is found, initializes an empty object.
 */
function loadProgress() {
    try {
        const storedProgress = localStorage.getItem('spanishLearningProgress'); // Changed key
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
 * Saves the current progress object to LocalStorage.
 */
function saveProgress() {
    try {
        localStorage.setItem('spanishLearningProgress', JSON.stringify(progress)); // Changed key
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
 * Resets all progress by clearing LocalStorage and re-rendering.
 */
async function resetProgress() {
    const confirmed = await showConfirmation('Are you sure you want to reset all your progress? This action cannot be undone.');
    if (confirmed) {
        localStorage.removeItem('spanishLearningProgress'); // Changed key
        progress = {}; // Reset the progress object
        renderLessons(); // Re-render to reflect reset
        updateProgressDisplay(); // Update progress display
    }
}

// Event listener for the reset button
resetProgressBtn.addEventListener('click', resetProgress);

// Event listeners for lightbox close button and overlay
lightboxCloseBtn.addEventListener('click', closeLightbox);
overlay.addEventListener('click', closeLightbox); // Close lightbox when clicking outside

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProgress(); // Load saved progress
    renderLessons(); // Render lessons based on loaded progress
    updateProgressDisplay(); // Update the progress display
});
