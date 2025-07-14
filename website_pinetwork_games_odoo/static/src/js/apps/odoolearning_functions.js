// Array of Odoo learning lessons, categorized by level
const lessonsData = [
    // Beginner Level
    {
        id: 'b1',
        title: 'Introduction to Odoo & ERP Concepts',
        description: 'Understand what Odoo is, its core philosophy, and basic ERP concepts.',
        level: 'Beginner',
        content: `
            <p>Odoo is a suite of open source business apps that cover all your company needs: CRM, eCommerce, accounting, manufacturing, warehouse, project management, and more.</p>
            <p>ERP stands for Enterprise Resource Planning. It's a system that integrates all facets of an operation, including product planning, development, manufacturing, sales, and marketing. Odoo provides a comprehensive ERP solution.</p>
            <h3>Key Takeaways:</h3>
            <ul>
                <li>Odoo is an all-in-one business software.</li>
                <li>It's open source and highly customizable.</li>
                <li>ERP systems streamline business processes.</li>
            </ul>
        `
    },
    {
        id: 'b2',
        title: 'Setting Up Your Odoo Development Environment',
        description: 'Learn how to install Odoo, Python, and necessary tools for development.',
        level: 'Beginner',
        content: `
            <p>To start Odoo development, you'll need to set up your environment. This typically involves:</p>
            <ul>
                <li><strong>Python:</strong> Odoo is built with Python, so ensure you have a compatible version installed (e.g., Python 3.8+).</li>
                <li><strong>PostgreSQL:</strong> Odoo uses PostgreSQL as its database. You'll need to install and configure it.</li>
                <li><strong>Odoo Source Code:</strong> Clone the Odoo repository from GitHub.</li>
                <li><strong>Python Dependencies:</strong> Install all required Python libraries using <code>pip install -r requirements.txt</code>.</li>
                <li><strong>Editor/IDE:</strong> A good IDE like VS Code or PyCharm can greatly enhance your development experience.</li>
            </ul>
            <p>Consider using virtual environments to manage your Python dependencies.</p>
        `
    },
    {
        id: 'b3',
        title: 'Odoo\'s Architecture Overview',
        description: 'Explore the high-level architecture of Odoo, including its server, database, and client.',
        level: 'Beginner',
        content: `
            <p>Odoo's architecture is primarily composed of three layers:</p>
            <ul>
                <li><strong>Database (PostgreSQL):</strong> Stores all Odoo data, including module configurations, user data, and business records.</li>
                <li><strong>Odoo Server (Python):</strong> The core application logic, written in Python. It handles ORM (Object-Relational Mapping), security, workflows, and serves the client.</li>
                <li><strong>Web Client (JavaScript/HTML/CSS):</strong> The user interface that runs in the browser. It communicates with the Odoo server via RPC (Remote Procedure Call) to fetch and display data.</li>
            </ul>
            <p>Understanding these layers is crucial for effective development and troubleshooting.</p>
        `
    },
    {
        id: 'b4',
        title: 'Basic Odoo Modules Structure',
        description: 'Understand the basic directory structure of an Odoo module and its key files.',
        level: 'Beginner',
        content: `
            <p>An Odoo module is a directory containing a <code>__manifest__.py</code> file and other subdirectories/files. Key elements include:</p>
            <ul>
                <li><code>__manifest__.py</code>: Defines module metadata (name, version, dependencies, etc.).</li>
                <li><code>models/</code>: Contains Python files defining Odoo models (database tables and business logic).</li>
                <li><code>views/</code>: Contains XML files defining views (forms, trees, kanban, etc.).</li>
                <li><code>security/</code>: Contains XML files for access rights and record rules.</li>
                <li><code>data/</code>: Contains XML or CSV files for initial data loading.</li>
                <li><code>static/</code>: For static assets like CSS, JavaScript, and images.</li>
                <li><code>__init__.py</code>: Python package initialization file, importing sub-modules.</li>
            </ul>
            <p>This structured approach helps organize code and data for maintainability.</p>
        `
    },
    {
        id: 'b5',
        title: 'Creating Your First Odoo Module (Hello World)',
        description: 'Step-by-step guide to creating a simple "Hello World" Odoo module.',
        level: 'Beginner',
        content: `
            <p>To create a "Hello World" module:</p>
            <ol>
                <li>Create a new directory for your module (e.g., <code>my_first_module</code>) inside your Odoo addons path.</li>
                <li>Inside, create <code>__manifest__.py</code> with basic info.</li>
                <li>Create <code>__init__.py</code>.</li>
                <li>Create <code>models/models.py</code> and <code>models/__init__.py</code>. Define a simple model with a text field.</li>
                <li>Create <code>views/views.xml</code>. Define a form view and a tree view for your model.</li>
                <li>Add a menu item in <code>views/views.xml</code> to access your model.</li>
                <li>Restart Odoo and update your module from the Apps menu.</li>
            </ol>
            <p>This hands-on exercise is fundamental to understanding Odoo development.</p>
        `
    },
    {
        id: 'b6',
        title: 'Understanding Odoo Models and Fields',
        description: 'Learn about Odoo ORM, defining models, and various field types.',
        level: 'Beginner',
        content: `
            <p>Odoo uses an Object-Relational Mapping (ORM) to interact with the PostgreSQL database. Models are Python classes that inherit from <code>models.Model</code>.</p>
            <h3>Key Concepts:</h3>
            <ul>
                <li><strong><code>_name</code>:</strong> Unique identifier for the model.</li>
                <li><strong>Fields:</strong> Attributes of a model that correspond to database columns (e.g., <code>fields.Char</code>, <code>fields.Integer</code>, <code>fields.Many2one</code>).</li>
                <li><strong><code>_inherit</code>, <code>_name</code>, <code>_description</code>:</strong> Important model attributes.</li>
                <li><strong>Recordset:</strong> A collection of records of a given model.</li>
            </ul>
            <p>Understanding models and fields is the cornerstone of Odoo backend development.</p>
        `
    },
    {
        id: 'b7',
        title: 'Basic Views: Form, Tree, and Search',
        description: 'Introduction to creating and customizing Odoo views for data representation.',
        level: 'Beginner',
        content: `
            <p>Views define how Odoo records are presented to the user. The most common types are:</p>
            <ul>
                <li><strong>Form View:</strong> Used for displaying and editing a single record. Defined in XML using <code>&lt;form&gt;</code> tags.</li>
                <li><strong>Tree (List) View:</strong> Displays a list of records in a table format. Defined using <code>&lt;tree&gt;</code> tags.</li>
                <li><strong>Search View:</strong> Defines the search filters and grouping options available for a model. Defined using <code>&lt;search&gt;</code> tags.</li>
            </ul>
            <p>Views are crucial for user interaction and data visualization in Odoo.</p>
        `
    },
    {
        id: 'b8',
        title: 'Menu Items and Actions',
        description: 'How to make your module accessible through Odoo menu items and define actions.',
        level: 'Beginner',
        content: `
            <p>To make your custom models and views accessible in the Odoo user interface, you need to define menu items and actions.</p>
            <ul>
                <li><strong>Menu Item (<code>ir.ui.menu</code>):</strong> Represents an entry in Odoo's navigation menu. It links to an action.</li>
                <li><strong>Window Action (<code>ir.actions.act_window</code>):</strong> Defines what happens when a menu item is clicked. It specifies which model to display and which views to use.</li>
                <li><strong>Other Actions:</strong> Odoo also supports other action types like server actions, URL actions, and report actions.</li>
            </ul>
            <p>These elements are defined in XML files within your module's <code>views/</code> directory.</p>
        `
    },

    // Intermediate Level
    {
        id: 'i1',
        title: 'Advanced Model Concepts (Inheritance, Computed Fields)',
        description: 'Deep dive into model inheritance, computed fields, and related fields.',
        level: 'Intermediate',
        content: `
            <p>Beyond basic models, Odoo offers powerful features:</p>
            <ul>
                <li><strong>Inheritance:</strong>
                    <ul>
                        <li><strong>Classical Inheritance (<code>_inherit</code> and <code>_name</code>):</strong> Create a new model that inherits from an existing one, adding or overriding fields/methods.</li>
                        <li><strong>Delegation Inheritance (<code>_inherits</code>):</strong> Delegate fields to a related record, making them accessible directly on the current model.</li>
                    </ul>
                </li>
                <li><strong>Computed Fields:</strong> Fields whose values are calculated dynamically by a Python method, rather than stored directly in the database. Defined with <code>compute='_compute_method'</code>.</li>
                <li><strong>Related Fields:</strong> Fields that automatically fetch values from a related record. Defined with <code>related='path.to.field'</code>.</li>
            </ul>
            <p>These concepts are essential for building complex and maintainable Odoo applications.</p>
        `
    },
    {
        id: 'i2',
        title: 'Security in Odoo: Access Rights and Record Rules',
        description: 'Implement robust security using groups, access rights, and record rules.',
        level: 'Intermediate',
        content: `
            <p>Odoo's security model is powerful and granular:</p>
            <ul>
                <li><strong>Users:</strong> Individual accounts.</li>
                <li><strong>Groups:</strong> Collections of access rights. Users are assigned to groups.</li>
                <li><strong>Access Rights (<code>ir.model.access</code>):</strong> Define CRUD (Create, Read, Update, Delete) permissions for models based on groups.</li>
                <li><strong>Record Rules (<code>ir.rule</code>):</strong> Filter records based on specific conditions, providing row-level security. For example, a user might only see their own records.</li>
            </ul>
            <p>Properly configuring security is critical for data integrity and privacy.</p>
        `
    },
    {
        id: 'i3',
        title: 'Workflows and Automated Actions',
        description: 'Automate business processes using Odoo workflows and server actions.',
        level: 'Intermediate',
        content: `
            <p>Odoo provides mechanisms to automate sequences of operations:</p>
            <ul>
                <li><strong>Automated Actions:</strong> Triggered by record creation, update, or deletion. They can execute Python code, send emails, create records, etc.</li>
                <li><strong>Workflows (Older concept, often replaced by Automated Actions/Server Actions):</strong> Define states and transitions for a business process. While less common in newer Odoo versions, understanding the concept is still useful.</li>
                <li><strong>Server Actions:</strong> Reusable actions that can be triggered manually or by automated actions. They can execute Python code, update records, or call methods.</li>
            </ul>
            <p>Automation significantly improves efficiency and reduces manual errors.</p>
        `
    },
    {
        id: 'i4',
        title: 'QWeb Templates for Reports and Websites',
        description: 'Learn to create dynamic reports and website pages using QWeb templating engine.',
        level: 'Intermediate',
        content: `
            <p>QWeb is Odoo's primary templating engine, used for:</p>
            <ul>
                <li><strong>Reports:</strong> Generating PDF reports (e.g., invoices, sales orders) with dynamic data.</li>
                <li><strong>Website Pages:</strong> Building dynamic web pages for Odoo's website module.</li>
                <li><strong>Backend Views:</strong> Used in some backend views for complex rendering.</li>
            </ul>
            <p>QWeb syntax is XML-based and allows for loops, conditionals, and data rendering. It's powerful for creating visually rich and dynamic output.</p>
        `
    },
    {
        id: 'i5',
        title: 'External API Integration (XML-RPC, JSON-RPC)',
        description: 'Connect Odoo with external systems using its API interfaces.',
        level: 'Intermediate',
        content: `
            <p>Odoo exposes APIs for external systems to interact with its data and logic:</p>
            <ul>
                <li><strong>XML-RPC:</strong> A widely supported protocol for remote procedure calls. Odoo provides a robust XML-RPC API for CRUD operations and method calls.</li>
                <li><strong>JSON-RPC:</strong> A more modern and lightweight alternative to XML-RPC, also supported by Odoo.</li>
                <li><strong>REST API (Community Modules):</strong> While Odoo doesn't have a native REST API, several community modules provide this functionality.</li>
            </ul>
            <p>These APIs enable integration with e-commerce platforms, mobile apps, and other business systems.</p>
        `
    },
    {
        id: 'i6',
        title: 'Internationalization (i18n) and Localization (l10n)',
        description: 'Make your Odoo module translatable and adaptable to different regions.',
        level: 'Intermediate',
        content: `
            <p>To support multiple languages and regional settings:</p>
            <ul>
                <li><strong>Internationalization (i18n):</strong> The process of designing your application so that it can be adapted to various languages and regions without engineering changes. In Odoo, this involves using the <code>_()</code> function for translatable strings.</li>
                <li><strong>Localization (l10n):</strong> The process of adapting an internationalized application for a specific region or language by adding locale-specific components and translating text. Odoo uses PO files for translations.</li>
                <li><strong>Currency, Date, Time Formats:</strong> Odoo handles these automatically based on the user's language settings.</li>
            </ul>
            <p>Proper i18n and l10n are crucial for global Odoo deployments.</p>
        `
    },
    {
        id: 'i7',
        title: 'Debugging Odoo Modules',
        description: 'Techniques and tools for effective debugging of Odoo Python and JavaScript code.',
        level: 'Intermediate',
        content: `
            <p>Effective debugging is a key skill for any Odoo developer:</p>
            <ul>
                <li><strong>Python Debugging:</strong>
                    <ul>
                        <li><strong><code>pdb</code>/<code>ipdb</code>:</strong> Python's built-in debugger.</li>
                        <li><strong>IDE Debuggers:</strong> PyCharm offers excellent debugging capabilities.</li>
                        <li><strong>Logging:</strong> Using Odoo's logging system for outputting messages.</li>
                    </ul>
                </li>
                <li><strong>JavaScript Debugging:</strong>
                    <ul>
                        <li><strong>Browser Developer Tools:</strong> Essential for debugging client-side code.</li>
                        <li><strong><code>console.log()</code>:</strong> For quick output.</li>
                    </ul>
                </li>
                <li><strong>Odoo Debug Mode:</strong> Activate debug mode in Odoo (<code>?debug=1</code> in URL) to reveal more technical information.</li>
            </ul>
            <p>Mastering debugging reduces development time significantly.</p>
        `
    },
    {
        id: 'i8',
        title: 'Testing Odoo Modules (Unit and Integration Tests)',
        description: 'Write automated tests to ensure the quality and reliability of your Odoo modules.',
        level: 'Intermediate',
        content: `
            <p>Automated testing is crucial for robust Odoo development:</p>
            <ul>
                <li><strong>Unit Tests:</strong> Test individual components or functions in isolation. In Odoo, these are Python classes inheriting from <code>odoo.tests.common.TransactionCase</code> or <code>odoo.tests.common.HttpCase</code>.</li>
                <li><strong>Integration Tests:</strong> Test the interaction between multiple components.</li>
                <li><strong>Post-Migration Tests:</strong> Ensure functionality after an Odoo version upgrade.</li>
                <li><strong>Test Driven Development (TDD):</strong> A development approach where tests are written before the code.</li>
            </ul>
            <p>Running tests regularly helps catch bugs early and ensures code quality.</p>
        `
    },

    // Expert Level
    {
        id: 'e1',
        title: 'Performance Optimization in Odoo',
        description: 'Strategies for optimizing Odoo database queries, ORM operations, and server performance.',
        level: 'Expert',
        content: `
            <p>Optimizing Odoo performance involves several areas:</p>
            <ul>
                <li><strong>Database Optimization:</strong> Proper indexing, efficient SQL queries (avoiding N+1 queries), and database tuning.</li>
                <li><strong>ORM Optimization:</strong> Using <code>sudo()</code> judiciously, batching operations, and understanding recordset caching.</li>
                <li><strong>Server Configuration:</strong> Tuning Odoo server parameters (e.g., workers, cron jobs), using a reverse proxy (Nginx), and Gunicorn.</li>
                <li><strong>Client-Side Optimization:</strong> Minimizing JavaScript and CSS, optimizing images, and efficient DOM manipulation.</li>
                <li><strong>Module Design:</strong> Writing efficient Python code, avoiding unnecessary loops, and using appropriate data structures.</li>
            </ul>
            <p>Performance tuning is an ongoing process crucial for large-scale Odoo deployments.</p>
        `
    },
    {
        id: 'e2',
        title: 'Advanced JavaScript in Odoo (Widgets, Client Actions)',
        description: 'Develop complex client-side functionalities using Odoo\'s JavaScript framework and custom widgets.',
        level: 'Expert',
        content: `
            <p>Odoo's web client is built on a custom JavaScript framework. Advanced topics include:</p>
            <ul>
                <li><strong>Custom Widgets:</strong> Extending existing Odoo widgets or creating new ones to enhance UI functionality.</li>
                <li><strong>Client Actions:</strong> Defining custom actions that execute JavaScript code on the client side.</li>
                <li><strong>QWeb in JavaScript:</strong> Using QWeb templates directly in JavaScript for dynamic UI rendering.</li>
                <li><strong>RPC Calls:</strong> Making asynchronous calls to the Odoo server from JavaScript.</li>
                <li><strong>Event Bus:</strong> Understanding Odoo's event system for inter-component communication.</li>
            </ul>
            <p>Mastering Odoo JavaScript allows for highly interactive and tailored user experiences.</p>
        `
    },
    {
        id: 'e3',
        title: 'Odoo Multi-Company and Multi-Website Setup',
        description: 'Configure and manage Odoo in multi-company and multi-website environments.',
        level: 'Expert',
        content: `
            <p>Odoo supports complex organizational structures:</p>
            <ul>
                <li><strong>Multi-Company:</strong> Allows managing multiple legal entities within a single Odoo instance. Data can be shared or segregated between companies.</li>
                <li><strong>Multi-Website:</strong> Enables running multiple distinct websites (e.g., different brands, languages) from a single Odoo instance, sharing backend data but with separate front-ends.</li>
            </ul>
            <p>These features are critical for businesses with diverse operations or global presence.</p>
        `
    },
    {
        id: 'e4',
        title: 'Migration Strategies and Best Practices',
        description: 'Learn about migrating Odoo databases and modules between different versions.',
        level: 'Expert',
        content: `
            <p>Migrating Odoo to a newer version can be complex:</p>
            <ul>
                <li><strong>Database Migration:</strong> Using Odoo's migration scripts or community tools (e.g., OpenUpgrade) to update the database schema and data.</li>
                <li><strong>Module Migration:</strong> Adapting custom modules to be compatible with the new Odoo version, including API changes and framework updates.</li>
                <li><strong>Data Migration:</strong> Importing data from older systems or external sources into Odoo.</li>
                <li><strong>Best Practices:</strong> Thorough testing, backup strategies, and planning for downtime.</li>
            </ul>
            <p>A well-planned migration strategy minimizes risks and ensures a smooth transition.</p>
        `
    },
    {
        id: 'e5',
        title: 'Odoo Deployment and Production Environment',
        description: 'Best practices for deploying Odoo to a production server, including security and scalability.',
        level: 'Expert',
        content: `
            <p>Deploying Odoo for production requires careful consideration:</p>
            <ul>
                <li><strong>Server Setup:</strong> Using a dedicated server or cloud instance.</li>
                <li><strong>Web Server (Nginx/Apache):</strong> As a reverse proxy for Odoo, handling SSL and static file serving.</li>
                <li><strong>Process Manager (Gunicorn/Supervisor):</strong> To manage Odoo server processes reliably.</li>
                <li><strong>Database Configuration:</strong> Optimizing PostgreSQL for performance and backups.</li>
                <li><strong>Security:</strong> Firewall rules, strong passwords, regular updates, and securing sensitive files.</li>
                <li><strong>Monitoring:</strong> Tools to monitor server health and Odoo performance.</li>
            </ul>
            <p>A robust production setup ensures stability and high availability.</p>
        `
    },
    {
        id: 'e6',
        title: 'Customizing Odoo Core Modules',
        description: 'Techniques for extending and modifying Odoo\'s core functionalities without breaking upgrades.',
        level: 'Expert',
        content: `
            <p>Extending Odoo core is a common requirement:</p>
            <ul>
                <li><strong>Inheriting Models:</strong> Extending existing models to add new fields or override methods.</li>
                <li><strong>Inheriting Views:</strong> Modifying existing views (form, tree, etc.) using XPath expressions to add, remove, or reposition elements.</li>
                <li><strong>Inheriting Reports:</strong> Customizing standard Odoo reports.</li>
                <li><strong>Best Practices:</strong> Always use inheritance, avoid direct modification of core files, and test thoroughly after Odoo upgrades.</li>
            </ul>
            <p>Careful customization ensures maintainability and future compatibility.</p>
        `
    },
    {
        id: 'e7',
        title: 'Odoo.sh and Cloud Deployment',
        description: 'Understand Odoo.sh for cloud-based development and deployment.',
        level: 'Expert',
        content: `
            <p>Odoo.sh is Odoo's cloud platform for development, staging, and production environments:</p>
            <ul>
                <li><strong>Integrated CI/CD:</strong> Automatic testing and deployment based on Git branches.</li>
                <li><strong>Scalability:</strong> Easily scale resources as needed.</li>
                <li><strong>Automated Backups:</strong> Regular backups and easy restore options.</li>
                <li><strong>Development Tools:</strong> Online editor, shell access, and logging.</li>
                <li><strong>Branch Management:</strong> Create development, staging, and production branches with ease.</li>
            </ul>
            <p>Odoo.sh simplifies the entire Odoo application lifecycle management.</p>
        `
    },
    {
        id: 'e8',
        title: 'Contributing to Odoo Community',
        description: 'Guidelines and best practices for contributing your code to the official Odoo project.',
        level: 'Expert',
        content: `
            <p>Contributing to the Odoo community strengthens the ecosystem:</p>
            <ul>
                <li><strong>OCA (Odoo Community Association):</strong> A non-profit organization that promotes the use and development of Odoo. Many community modules are managed here.</li>
                <li><strong>GitHub Pull Requests:</strong> Submit your code improvements, bug fixes, or new features to the official Odoo repository.</li>
                <li><strong>Code Standards:</strong> Adhere to Odoo's coding guidelines (PEP8, specific Odoo conventions).</li>
                <li><strong>Testing:</strong> Ensure your contributions are well-tested.</li>
                <li><strong>Documentation:</strong> Provide clear and concise documentation for your code.</li>
            </ul>
            <p>Contributing is a great way to give back and enhance your skills.</p>
        `
    }
];

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

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
            const storedProgress = localStorage.getItem('odooLearningProgress');
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
            localStorage.setItem('odooLearningProgress', JSON.stringify(progress));
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
            localStorage.removeItem('odooLearningProgress');
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

    loadProgress(); // Load saved progress
    renderLessons(); // Render lessons based on loaded progress
    updateProgressDisplay(); // Update the progress display
});
