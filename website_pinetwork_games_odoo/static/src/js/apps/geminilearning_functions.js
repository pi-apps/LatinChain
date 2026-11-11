// Course Curriculum Data Structure
const courseData = [
    {
        id: 1,
        title: "Module 1: Mastering Gemini AI Prompts",
        icon: "fa-brain",
        color: "text-ai-purple",
        description: "Foundations of Gemini 1.5 Pro architecture, long-context windows, system instructions, and hyper-structured outputs.",
        lessons: [
            {
                id: "m1-l1",
                title: "1.1 The Anatomy of an Advanced Gemini Prompt",
                detail: "Understand how Gemini processes inputs using System Instructions, Context Grounding, Context Caching, and Output Constraints. Learn why explicit formatting instructions prevent hallucinations.",
                prompt: "System Instruction: You are an expert Lead Instructional Designer.\n\nTask: Draft an engaging introductory module for a course on AI Prompting.\n\nFormatting Guidelines:\n1. Use clear Markdown headers.\n2. Include 3 real-world examples.\n3. End with a 5-question comprehension check.",
                tip: "Use Gemini's system instructions field for persistent roles, and leave the user prompt strictly for context and target inputs."
            },
            {
                id: "m1-l2",
                title: "1.2 Temperature, Top-P & Parameter Tuning",
                detail: "How to tune Gemini parameters for varying workflows: Low temp (0.0-0.2) for code/fact extraction, medium (0.5) for manuals, and high (0.8-1.0) for creative fiction and brainstorming.",
                prompt: "Config: Temperature = 0.2, Top-P = 0.8\n\nExtract all entity relationships from the provided technical text into a strict JSON format with keys: 'entities', 'actions', 'dependencies'.",
                tip: "When building technical manuals, lock down temperature to 0.1 to avoid invented syntax or invalid steps."
            },
            {
                id: "m1-l3",
                title: "1.3 Multi-Turn Context Windows & Iterative Refinement",
                detail: "Leverage Gemini 1.5's 2M token context window by feeding full document trees, entire repositories, or long transcripts in a single conversation thread.",
                prompt: "I am uploading 15 context files from my project. First, analyze the full architecture. Do not generate code yet. Respond only with 'CONTEXT RECEIVED' and a 3-bullet summary of your understanding.",
                tip: "Always get Gemini to acknowledge context understanding BEFORE requesting complex output."
            },
            {
                id: "m1-l4",
                title: "1.4 Output Formatting: JSON, Markdown, & Custom Markup",
                detail: "Force Gemini to output clean, programmatically parseable text using schema enforcement and strict negative constraints.",
                prompt: "Generate a table of contents for a cybersecurity handbook. Output ONLY valid JSON array containing objects with keys: 'chapter_num', 'chapter_title', 'subtopics' (array). Do not include markdown code block formatting or intro text.",
                tip: "Explicitly stating 'Do not include introductory or concluding conversational text' saves post-processing cleanup."
            }
        ]
    },
    {
        id: 2,
        title: "Module 2: Writing & Publishing Books & Technical Manuals",
        icon: "fa-book-atlas",
        color: "text-ai-cyan",
        description: "Architecting 600+ page books, technical manuals, formatting for Amazon KDP, and handling massive context continuity.",
        lessons: [
            {
                id: "m2-l1",
                title: "2.1 Architecting Long-Form Master Outlines (600+ Pages)",
                detail: "Learn the 'Branching Outline Method' to build exhaustive 30-chapter book outlines without losing structural integrity or plot/logic cohesion.",
                prompt: "Act as a Senior Non-Fiction Book Editor. Create a 3-tier master blueprint for a 500-page book titled 'The AI Architect'. Break down into 4 Parts, 20 Chapters, and 5 sub-sections per chapter. For each sub-section, include target word counts and key takeaways.",
                tip: "Never ask Gemini to write a 600-page book in one prompt. Write it section by section using a persistent master outline context."
            },
            {
                id: "m2-l2",
                title: "2.2 Technical Manual Synthesis & Step-by-Step SOPs",
                detail: "Structuring complex hardware or software documentation with callouts, safety warnings, code blocks, and prerequisites.",
                prompt: "Write Section 3.2 of the Enterprise Kubernetes Operations Manual: 'Disaster Recovery Failover'. Include:\n- Prerequisites\n- Command Line Instructions (formatted in Bash codeblocks)\n- [CRITICAL WARNING] Callout boxes\n- Troubleshooting Matrix table.",
                tip: "Maintain a dedicated 'Style Guide' block in your prompts to ensure consistent terminology across manual chapters."
            },
            {
                id: "m2-l3",
                title: "2.3 KDP & ePub Formatting Automation",
                detail: "Formatting Markdown output specifically for Kindle Direct Publishing (KDP), avoiding front-matter mistakes, and formatting HTML/LaTeX headers.",
                prompt: "Format the following draft chapter for Amazon KDP Paperback (6x9 format guidelines). Ensure properly formatted Chapter Title drop caps style, standard page breaks markers, and clean blockquote formatting.",
                tip: "Use Markdown file conversion tools like Pandoc to convert Gemini's clean output directly into ePub or PDF."
            },
            {
                id: "m2-l4",
                title: "2.4 Character Bibles & Fiction World-Building",
                detail: "Maintaining narrative consistency across massive fiction series using custom character matrix sheets uploaded into Gemini's context.",
                prompt: "Using the attached Character Bible and Timeline Matrix, write Chapter 4 scene 2. Maintain Character A's distinct cynical dialogue cadence, and ensure event X from Chapter 2 is accurately referenced.",
                tip: "Feed previous chapter summaries into context before drafting the next chapter to maintain continuity."
            }
        ]
    },
    {
        id: 3,
        title: "Module 3: Generating Visual Arts & Image Prompts",
        icon: "fa-palette",
        color: "text-ai-pink",
        description: "Generating visual master prompts for Gemini Imagen 3, Midjourney, and Stable Diffusion with precision control over style, lighting, and camera optics.",
        lessons: [
            {
                id: "m3-l1",
                title: "3.1 Photorealistic Camera & Lighting Vocabulary",
                detail: "Mastering camera lenses, focal lengths, aperture, lighting styles, and render engines in prompts.",
                prompt: "Generate a detailed image prompt for Imagen 3: Cinematic close-up portrait of a cybernetic engineer, shot on 85mm f/1.4 lens, natural rembrandt lighting mixed with neon turquoise rim light, shallow depth of field, subtle film grain, 8k resolution, raw photo.",
                tip: "Avoid vague words like 'hyperrealistic'. Instead, specify lens types (e.g., 35mm), lighting (e.g., volumetric dusk light), and camera sensors."
            },
            {
                id: "m3-l2",
                title: "3.2 Vector Art, UI/UX, & Illustration Styles",
                detail: "Prompting clean isometric graphics, flat vectors, logos, and UI component designs for digital products.",
                prompt: "Isometric 3D vector illustration of an AI data center, clean pastel gradient palette, soft ambient occlusion shadows, minimal tech aesthetics, isolated on dark background --no hyperrealism photorealistic texture.",
                tip: "Use negative prompts or explicit exclusions to keep vector art clean and free of unwanted pseudo-3D noise."
            },
            {
                id: "m3-l3",
                title: "3.3 Character Consistency Across Multiple Scenes",
                detail: "Developing reusable multi-angle prompt seeds for consistent character visual design across book covers and comic panels.",
                prompt: "Create a visual reference sheet prompt describing a female sci-fi protagonist: 'Elena, 30s, sharp jawline, silver braided hair, wearing dark tech-wear jacket with glowing blue accents.' Provide 4 scene prompts keeping this exact descriptor string.",
                tip: "Keep a fixed 20-word 'Character Anchor String' and paste it unaltered into every new image prompt."
            },
            {
                id: "m3-l4",
                title: "3.4 Reverse Engineering Images into Prompts",
                detail: "Uploading reference art into Gemini Flash/Pro to extract deep visual descriptors and style tags.",
                prompt: "Analyze this uploaded art style image. Breakdown its art style into: 1. Color Palette, 2. Medium/Texture, 3. Lighting Style, 4. Composition. Then write an Imagen 3 prompt that replicates this exact artistic style for a new subject.",
                tip: "Gemini 1.5 Pro's multimodal vision capability is unbeatable at breaking down art styles into descriptive text."
            }
        ]
    },
    {
        id: 4,
        title: "Module 4: Composition & Music Creation",
        icon: "fa-music",
        color: "text-emerald-400",
        description: "Using Gemini for song structure, chord progression theory, lyricism with meter alignment, and prompt engineering for AI Audio tools.",
        lessons: [
            {
                id: "m4-l1",
                title: "4.1 Lyric Writing with Metric & Rhyme Scheme Constraints",
                detail: "Crafting hit-worthy song lyrics with accurate syllable counts, rhyming schemes (AABB, ABAB), and emotional pacing.",
                prompt: "Act as a Grammy-winning lyricist. Write the lyrics for an Synthwave Pop track. Verse 1: iambic pentameter rhythm, ABAB rhyme scheme. Chorus: High energy, catchy repetition, short punchy lines. Include structural markers like [Verse 1], [Pre-Chorus], [Chorus], [Drop].",
                tip: "Explicitly define meter (e.g., trochaic tetrameter) so lyrics naturally fit musical beats when inputted to audio models."
            },
            {
                id: "m4-l2",
                title: "4.2 Music Theory & Chord Progression Generation",
                detail: "Using Gemini as a music theory companion to generate complex jazz, pop, or orchestral chord sequences and MIDI specifications.",
                prompt: "Provide an emotional chord progression in the key of F# Minor for a cinematic film score climax. Include Roman numeral analysis, lead sheet notation, and suggested arpeggiated piano voicings for each measure.",
                tip: "Ask Gemini to output chords in standard tab or MIDI notation format for direct paste into your DAW."
            },
            {
                id: "m4-l3",
                title: "4.3 AI Music Engine Prompt Engineering (Suno / Udio / Producer AI)",
                detail: "Translating musical moodboard descriptions into optimized meta-tags and genre prompts for music generation models.",
                prompt: "Translate this emotional description: 'A nostalgic rainy late-night drive through Tokyo' into a concise 200-character style prompt for Suno/Udio. Include specific genres, bpm, instruments, vocal texture, and production style tags.",
                tip: "Use genre tags like '[80s Synthpop, Warm Analog Synthesizers, Gated Reverb Drums, 110 BPM, Female Melancholic Vocals]' for best audio generation results."
            },
            {
                id: "m4-l4",
                title: "4.4 Sound Design & Foley FX Specs",
                detail: "Generating sound effect descriptors for synth patching and sample library categorization.",
                prompt: "Write modular synth patch instructions (Oscillators, Envelopes, LFOs, FX) to create a 'Futuristic Sci-Fi Laser Cannon Impact' sound from scratch.",
                tip: "You can ask Gemini to guide you through specific VST synth knobs (like Serum or Vital) step-by-step."
            }
        ]
    },
    {
        id: 5,
        title: "Module 5: Video Scripting & Production Workflows",
        icon: "fa-clapperboard",
        color: "text-amber-400",
        description: "Generating cinematic storyboards, timed voiceover scripts, and scene-by-scene video generation prompts (Runway Gen-3, Luma, Sora, Pika).",
        lessons: [
            {
                id: "m5-l1",
                title: "5.1 Scene-by-Scene Video Storyboarding",
                detail: "Structuring short films, commercials, or documentaries into structured multi-column script tables.",
                prompt: "Create a 60-second commercial script for a futuristic electric vehicle. Output as a 4-column Markdown table: | Timecode | Visual Shot Description | Camera Movement | Audio / Voiceover |.",
                tip: "Breaking scripts into exact 3-5 second visual blocks makes video generation much more manageable."
            },
            {
                id: "m5-l2",
                title: "5.2 Prompts for AI Video Generators (Runway, Luma, Sora)",
                detail: "Crafting camera motion directives (pan, tilt, zoom, FPV tracking) tailored specifically for video AI engines.",
                prompt: "Convert the following scene into a Gen-3/Sora video prompt:\nScene: A drone flying through a dense cyberpunk city.\nOutput Syntax: [Camera Action] + [Subject] + [Environment] + [Lighting & Style]. Include speed and camera roll attributes.",
                tip: "Video AI tools respond best when camera movement is stated FIRST in the prompt."
            },
            {
                id: "m5-l3",
                title: "5.3 Voiceover (VO) Script Pacing & Emotion Tagging",
                detail: "Writing audio voiceover scripts with explicit pacing, pause markers, and emotional tone directives for ElevenLabs speech generation.",
                prompt: "Draft a 2-minute documentary voiceover about Deep Sea Exploration. Include ElevenLabs emotion tags like [whispering], [gasp], [pause: 2s], and [authoritative pitch shift].",
                tip: "Add explicit timestamp markers every 15 seconds to ensure easy audio-to-video editing alignment."
            },
            {
                id: "m5-l4",
                title: "5.4 Automated Video Content Pipeline Design",
                detail: "Building end-to-end automation workflows connecting Gemini text, image generation, and video synthesis.",
                prompt: "Design a complete architecture diagram & step-by-step automation workflow for a daily YouTube Shorts channel leveraging Gemini API, Midjourney, and ElevenLabs.",
                tip: "Use Gemini JSON outputs to automatically feed visual prompts directly into video generation APIs via Python scripts."
            }
        ]
    },
    {
        id: 6,
        title: "Module 6: NotebookLM Masterclass",
        icon: "fa-book-bookmark",
        color: "text-ai-cyan",
        description: "Deep dive into NotebookLM: source grounding, multi-document synthesis, Audio Overviews (podcasts), and complex project research.",
        lessons: [
            {
                id: "m6-l1",
                title: "6.1 Source Grounding & Curating Knowledge Bases",
                detail: "How to upload and structure up to 50 diverse sources (PDFs, Google Docs, YouTube URLs, Audio) to eliminate AI hallucinations completely.",
                prompt: "Guide for NotebookLM: How to clean and structure 30 technical PDFs before uploading into a single notebook. Ensure clear metadata titles and index files for optimal vector retrieval.",
                tip: "NotebookLM ONLY answers based on your uploaded sources, making it 100% accurate with zero external hallucination."
            },
            {
                id: "m6-l2",
                title: "6.2 Generating & Directing Audio Overviews (Podcasts)",
                detail: "Unlocking NotebookLM's viral Audio Overview feature to create hyper-realistic 2-host podcasts from complex document collections.",
                prompt: "In NotebookLM Audio Overview customization: Focus the hosts on contrasting Opinion A vs Opinion B in the uploaded documents. Direct them to keep a fast-paced banter tone with a focus on practical takeaways.",
                tip: "Use the 'Customize Audio Overview' text box to guide what aspects of your uploaded documents the hosts discuss!"
            },
            {
                id: "m6-l3",
                title: "6.3 Synthesizing Complex Multi-PDF Research Projects",
                detail: "Creating Study Guides, Briefing Docs, FAQs, and Timelines across hundreds of pages of research in seconds.",
                prompt: "NotebookLM Query: Based strictly on the uploaded financial reports (2020-2024), construct a comparative matrix table showing revenue growth, operational expenses, and risk factors across all 4 quarters.",
                tip: "Click on inline citation numbers in NotebookLM to immediately jump to the exact source page and paragraph!"
            },
            {
                id: "m6-l4",
                title: "6.4 Transforming NotebookLM Insights into Creative Works",
                detail: "Extracting grounded knowledge notes from NotebookLM and feeding them into Gemini 1.5 Pro for full book chapters, video scripts, and course creation.",
                prompt: "Take the generated Briefing Document from NotebookLM and pass it to Gemini Pro with the instruction: 'Transform these verified facts into an engaging 2,000-word narrative narrative chapter for a general audience.'",
                tip: "Combine NotebookLM's factual accuracy with Gemini 1.5 Pro's creative prose style for the ultimate production pipeline."
            }
        ]
    }
];

// --- IndexedDB Database Manager ---
const DB_NAME = 'GeminiCourseDB';
const DB_VERSION = 1;
let db = null;

// State Variables
let completedLessons = new Set();
let savedNotes = [];
let activeNoteId = null;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(e) {
            const dbInstance = e.target.result;
            if (!dbInstance.objectStoreNames.contains('progress')) {
                dbInstance.createObjectStore('progress', { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains('notes')) {
                dbInstance.createObjectStore('notes', { keyPath: 'id' });
            }
        };

        request.onsuccess = function(e) {
            db = e.target.result;
            resolve(db);
        };

        request.onerror = function(e) {
            console.error("IndexedDB initialization error:", e.target.error);
            reject(e.target.error);
        };
    });
}

// DB Operations for Progress
function loadProgressFromDB() {
    return new Promise((resolve) => {
        if (!db) return resolve();
        const tx = db.transaction('progress', 'readonly');
        const store = tx.objectStore('progress');
        const request = store.getAll();

        request.onsuccess = function() {
            const records = request.result || [];
            completedLessons = new Set(records.map(r => r.id));
            updateProgressUI();
            renderModules();
            resolve();
        };
    });
}

function saveProgressToDB(lessonId, isCompleted) {
    if (!db) return;
    const tx = db.transaction('progress', 'readwrite');
    const store = tx.objectStore('progress');

    if (isCompleted) {
        store.put({ id: lessonId, timestamp: new Date().toISOString() });
    } else {
        store.delete(lessonId);
    }
}

function clearAllProgressFromDB() {
    if (!db) return;
    const tx = db.transaction('progress', 'readwrite');
    const store = tx.objectStore('progress');
    store.clear();
}

// DB Operations for Notes
function loadNotesFromDB() {
    return new Promise((resolve) => {
        if (!db) return resolve();
        const tx = db.transaction('notes', 'readonly');
        const store = tx.objectStore('notes');
        const request = store.getAll();

        request.onsuccess = function() {
            savedNotes = request.result || [];
            savedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderNotesList();
            resolve();
        };
    });
}

function saveNoteToDB(noteObj) {
    if (!db) return;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    store.put(noteObj);
}

function deleteNoteFromDB(id) {
    if (!db) return;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    store.delete(id);
}

// Init App
window.onload = async function() {
    try {
        await initDB();
        await Promise.all([loadProgressFromDB(), loadNotesFromDB()]);
    } catch (err) {
        console.warn("Falling back gracefully if IndexedDB is blocked.", err);
        renderModules();
        updateProgressUI();
    }
    generateStudioPrompt();
};

// --- Mobile Drawer Controls ---
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    sidebar.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
});

window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) closeSidebar();
});

// Render All Course Modules
function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = '';

    courseData.forEach(module => {
        const moduleEl = document.createElement('div');
        moduleEl.className = 'glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-4 scroll-mt-24';
        moduleEl.id = `module-${module.id}`;

        let lessonsListHTML = '';
        module.lessons.forEach(lesson => {
            const isChecked = completedLessons.has(lesson.id);
            lessonsListHTML += `
                <div class="lesson-item bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden transition hover:border-slate-700" data-title="${lesson.title.toLowerCase()}" data-detail="${lesson.detail.toLowerCase()}">
                    <div class="p-3 sm:p-4 flex items-start justify-between gap-2 sm:gap-3 cursor-pointer select-none" onclick="toggleAccordion('${lesson.id}')">
                        <div class="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                            <input type="checkbox"
                                   id="chk-${lesson.id}"
                                   ${isChecked ? 'checked' : ''}
                                   onclick="event.stopPropagation(); toggleLessonDone('${lesson.id}')"
                                   class="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-slate-700 bg-slate-800 text-ai-purple focus:ring-ai-purple focus:ring-offset-slate-900 cursor-pointer">
                            <div class="min-w-0">
                                <h4 class="text-xs sm:text-sm font-bold text-slate-100 break-words">
                                    ${lesson.title}
                                </h4>
                                <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">${lesson.detail}</p>
                            </div>
                        </div>
                        <button class="flex-shrink-0 text-slate-500 hover:text-slate-300 transition text-xs pt-1">
                            <i class="fa-solid fa-chevron-down transition-transform duration-300" id="icon-${lesson.id}"></i>
                        </button>
                    </div>

                    <!-- Accordion Content -->
                    <div id="body-${lesson.id}" class="hidden px-3 sm:px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/50">
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Lesson Breakdown</span>
                            <p class="text-xs text-slate-300 leading-relaxed">${lesson.detail}</p>
                        </div>

                        <!-- Example Prompt Box -->
                        <div class="space-y-1.5">
                            <div class="flex flex-wrap justify-between items-center gap-2">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-ai-cyan flex items-center gap-1">
                                    <i class="fa-solid fa-terminal"></i> Production Prompt Template
                                </span>
                                <button onclick="copyToClipboard('prompt-${lesson.id}')" class="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 flex items-center gap-1">
                                    <i class="fa-regular fa-copy"></i> Copy
                                </button>
                            </div>
                            <pre id="prompt-${lesson.id}" class="bg-slate-900 text-slate-200 text-[11px] font-mono p-3 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">${escapeHtml(lesson.prompt)}</pre>
                        </div>

                        <!-- Pro Tip Box -->
                        <div class="p-3 bg-ai-purple/10 border border-ai-purple/20 rounded-xl flex items-start space-x-2 text-xs text-slate-300">
                            <i class="fa-solid fa-lightbulb text-amber-400 mt-0.5 text-sm flex-shrink-0"></i>
                            <div class="min-w-0">
                                <span class="font-bold text-ai-purple text-[11px] block">PRO TIP</span>
                                <span class="text-[11px] text-slate-300">${lesson.tip}</span>
                            </div>
                        </div>

                        <div class="pt-1 flex justify-end">
                            <button onclick="sendToSandbox('${escapeHtml(lesson.title)}', '${escapeHtml(lesson.prompt)}')" class="text-[11px] text-ai-cyan hover:underline flex items-center gap-1">
                                <i class="fa-solid fa-square-arrow-up-right"></i> Open in Sandbox & Edit
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        moduleEl.innerHTML = `
            <div class="flex items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
                <div class="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center">
                    <i class="fa-solid ${module.icon} ${module.color} text-lg"></i>
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold text-white break-words">${module.title}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">${module.description}</p>
                </div>
            </div>
            <div class="space-y-3 mt-4">
                ${lessonsListHTML}
            </div>
        `;

        container.appendChild(moduleEl);
    });
}

// Accordion Toggle
function toggleAccordion(lessonId) {
    const body = document.getElementById(`body-${lessonId}`);
    const icon = document.getElementById(`icon-${lessonId}`);
    if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        body.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

// Checkbox Toggle
function toggleLessonDone(lessonId) {
    let isCompleted = false;
    if (completedLessons.has(lessonId)) {
        completedLessons.delete(lessonId);
    } else {
        completedLessons.add(lessonId);
        isCompleted = true;
        showToast("Lesson marked as completed!", "success");
    }
    saveProgressToDB(lessonId, isCompleted);
    updateProgressUI();
}

// Update Progress UI Elements
function updateProgressUI() {
    const totalLessons = 24;
    const doneCount = completedLessons.size;
    const percentage = Math.round((doneCount / totalLessons) * 100);

    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-percent').innerText = `${percentage}%`;
    document.getElementById('header-progress-text').innerText = `${percentage}% Complete`;
    document.getElementById('completed-count').innerText = `${doneCount} of ${totalLessons} lessons completed`;
}

function resetProgress() {
    if(confirm("Are you sure you want to reset all course progress?")) {
        completedLessons.clear();
        clearAllProgressFromDB();
        renderModules();
        updateProgressUI();
        showToast("Course progress reset.", "info");
    }
}

// Tab Switching Logic
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Remove active states from nav
    document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.remove('bg-slate-800/90', 'text-white', 'border', 'border-slate-700/60');
        el.classList.add('text-slate-400');
    });

    // Show selected tab content
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');

    // Set active state on button
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if(activeBtn) {
        activeBtn.classList.add('bg-slate-800/90', 'text-white', 'border', 'border-slate-700/60');
        activeBtn.classList.remove('text-slate-400');
    }

    // Close mobile drawer after navigation
    closeSidebar();
}

// Search and Filter Functionality
function filterLessons() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const selectedModule = document.getElementById('module-filter').value;

    courseData.forEach(module => {
        const moduleEl = document.getElementById(`module-${module.id}`);
        let hasVisibleLesson = false;

        if (selectedModule !== 'all' && selectedModule != module.id) {
            moduleEl.classList.add('hidden');
            return;
        }

        const lessonItems = moduleEl.querySelectorAll('.lesson-item');
        lessonItems.forEach(item => {
            const title = item.getAttribute('data-title');
            const detail = item.getAttribute('data-detail');
            if (title.includes(query) || detail.includes(query)) {
                item.classList.remove('hidden');
                hasVisibleLesson = true;
            } else {
                item.classList.add('hidden');
            }
        });

        if (hasVisibleLesson) {
            moduleEl.classList.remove('hidden');
        } else {
            moduleEl.classList.add('hidden');
        }
    });
}

// Interactive Studio Prompt Builder Generator
function generateStudioPrompt() {
    const engine = document.getElementById('pb-engine').value;
    const type = document.getElementById('pb-type').value;
    const tone = document.getElementById('pb-tone').value || "Professional";
    const topic = document.getElementById('pb-topic').value || "General Subject";

    let result = "";

    if (engine === "notebooklm") {
        result = `[NOTEBOOKLM GROUNDED QUERY]\n\nRole: You are a Lead Research Synthesis Analyst.\nTask: Analyze all uploaded sources regarding "${topic}".\nTone/Style: ${tone}.\n\nOutput Requirements:\n1. Provide a executive summary grounded strictly in the source materials.\n2. Include inline citation numbers referencing exact source documents.\n3. Highlight 5 key takeaways and actionable conclusions.\n4. List any conflicting statements found across the provided files.`;
    } else if (engine === "imagen") {
        result = `[IMAGE GENERATION MASTER PROMPT - IMAGEN 3 / MIDJOURNEY]\n\nSubject: ${topic}\nStyle: ${tone}\nDetails: Highly detailed render, 8k resolution, cinematic lighting, dramatic depth of field, vibrant color harmony, crisp focal point, masterwork quality, clean composition --ar 16:9 --style raw`;
    } else {
        result = `[SYSTEM INSTRUCTION: GEMINI ADVANCED]\n\nYou are a world-class creator specializing in ${type}.\nYour goal is to produce a comprehensive artifact about "${topic}".\n\n[TONE & STYLE]\n- ${tone}\n- Clear structure, high density of useful information, zero filler words.\n\n[OUTPUT FORMAT]\n1. Title & Executive Overview\n2. Detailed Step-by-Step Breakdown / Narrative\n3. Key Implementation Steps & Code/Prompt Blocks where relevant\n4. Follow-up Action Items`;
    }

    document.getElementById('studio-output-text').value = result;
}

// Sandbox & Notes Storage
function renderNotesList() {
    const listEl = document.getElementById('notes-list');
    listEl.innerHTML = '';

    if (savedNotes.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-slate-500 italic p-2">No notes saved yet.</p>';
        document.getElementById('notes-badge').classList.add('hidden');
        return;
    }

    document.getElementById('notes-badge').innerText = savedNotes.length;
    document.getElementById('notes-badge').classList.remove('hidden');

    savedNotes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = `p-2.5 rounded-xl border text-xs cursor-pointer flex justify-between items-center gap-2 transition ${activeNoteId === note.id ? 'bg-slate-800 border-ai-cyan text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'}`;
        noteDiv.onclick = () => loadNote(note.id);
        noteDiv.innerHTML = `
            <div class="truncate pr-2 min-w-0">
                <div class="font-semibold truncate">${escapeHtml(note.title || 'Untitled Note')}</div>
                <div class="text-[10px] text-slate-500">${new Date(note.date).toLocaleDateString()}</div>
            </div>
            <button onclick="event.stopPropagation(); deleteNote('${note.id}')" class="text-slate-500 hover:text-rose-400 p-1 flex-shrink-0">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        listEl.appendChild(noteDiv);
    });
}

function saveCurrentNote() {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').value.trim();

    if (!title && !body) {
        showToast("Cannot save empty note!", "error");
        return;
    }

    let noteObj;
    if (activeNoteId) {
        const index = savedNotes.findIndex(n => n.id === activeNoteId);
        if (index !== -1) {
            savedNotes[index].title = title || 'Untitled Note';
            savedNotes[index].body = body;
            savedNotes[index].date = new Date().toISOString();
            noteObj = savedNotes[index];
        }
    } else {
        noteObj = {
            id: 'note_' + Date.now(),
            title: title || 'Untitled Note',
            body: body,
            date: new Date().toISOString()
        };
        savedNotes.unshift(noteObj);
        activeNoteId = noteObj.id;
    }

    saveNoteToDB(noteObj);
    renderNotesList();
    showToast("Note saved to IndexedDB!", "success");
}

function newNote() {
    activeNoteId = null;
    document.getElementById('note-title').value = '';
    document.getElementById('note-body').value = '';
    renderNotesList();
}

function loadNote(id) {
    const note = savedNotes.find(n => n.id === id);
    if (note) {
        activeNoteId = note.id;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-body').value = note.body;
        renderNotesList();
    }
}

function deleteNote(id) {
    if (confirm("Delete this note?")) {
        savedNotes = savedNotes.filter(n => n.id !== id);
        deleteNoteFromDB(id);
        if (activeNoteId === id) newNote();
        renderNotesList();
        showToast("Note deleted.", "info");
    }
}

function sendToSandbox(title, prompt) {
    switchTab('notes');
    newNote();
    document.getElementById('note-title').value = `Practice: ${title}`;
    document.getElementById('note-body').value = `// PROMPT TEMPLATE:\n${prompt}\n\n// MY REFINED PROMPT / NOTES:\n`;
    showToast("Prompt sent to Sandbox!", "success");
}

// Clipboard Copy Helper
function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    const text = el.innerText || el.value;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast("Copied to clipboard!", "success");
    } catch (err) {
        showToast("Failed to copy", "error");
    }
    document.body.removeChild(textarea);
}

// Toast Notification System
function showToast(message, type = "success") {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.innerText = message;

    if(type === "error") {
        toastIcon.className = "fa-solid fa-circle-xmark text-rose-400 text-base";
    } else if(type === "info") {
        toastIcon.className = "fa-solid fa-circle-info text-ai-cyan text-base";
    } else {
        toastIcon.className = "fa-solid fa-circle-check text-emerald-400 text-base";
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}

// Helper string escape
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
