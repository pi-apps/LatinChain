// State Variables
let currentScreen = 'categories';
let selectedCategoryId = null;
let selectedLevel = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnimating = false;

const DB_NAME = 'OdooQuestDB';
const DB_VERSION = 2;
let db;

// Data Structure for Categories
const categories = [
    {
        id: 'python',
        name: 'Python',
        desc: 'Models, Controllers, Reports, ORM',
        icon: '🐍',
        bg: 'bg-green-100',
        border: 'border-green-200'
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        desc: 'Dynamic views, OWL framework',
        icon: '⚡',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200'
    },
    {
        id: 'xml',
        name: 'XML',
        desc: 'Views, Actions, Menus, Data',
        icon: '📄',
        bg: 'bg-blue-100',
        border: 'border-blue-200'
    },
    {
        id: 'qweb',
        name: 'QWeb',
        desc: 'Web templating engine, Reports',
        icon: '🌐',
        bg: 'bg-teal-100',
        border: 'border-teal-200'
    },
    {
        id: 'csv',
        name: 'CSV Data',
        desc: 'Access Rights, Security, Imports',
        icon: '📊',
        bg: 'bg-emerald-100',
        border: 'border-emerald-200'
    },
    {
        id: 'html',
        name: 'HTML',
        desc: 'Website snippets, Views structure',
        icon: '🖥️',
        bg: 'bg-orange-100',
        border: 'border-orange-200'
    },
    {
        id: 'translations',
        name: 'Translations',
        desc: '.po files, Multi-language',
        icon: '🌍',
        bg: 'bg-indigo-100',
        border: 'border-indigo-200'
    },
    {
        id: 'erppeek',
        name: 'ERPPeek',
        desc: 'External API client',
        icon: '🛠️',
        bg: 'bg-gray-200',
        border: 'border-gray-300'
    }
];

const initialQuestionDB = {
    'python': {
        'Beginner': [
            { q: 'Which base class must a standard Odoo model inherit from?', a: 'models.Model', wrong: ['models.TransientModel', 'models.AbstractModel', 'models.Base'] },
            { q: 'Which ORM method is used to retrieve a list of records matching a domain?', a: 'search()', wrong: ['browse()', 'find()', 'read()'] },
            { q: 'What decorator is used for methods triggered by a button in a view?', a: 'No decorator needed (typically)', wrong: ['@api.onchange', '@api.depends', '@api.button'] },
            { q: 'Which field type is used to link a record to a single record in another model?', a: 'Many2one', wrong: ['One2many', 'Many2many', 'Reference'] }
        ],
        'Intermediate': [
            { q: 'Which decorator is REQUIRED to define a computed field?', a: '@api.depends', wrong: ['@api.onchange', '@api.constrains', '@api.compute'] },
            { q: 'How do you override the creation of a record in a model?', a: '@api.model def create(self, vals_list)', wrong: ['def create(self, cr, uid, vals)', '@api.multi def create(self, vals)', 'def write(self, vals)'] },
            { q: 'What happens when a TransientModel is created?', a: 'It is stored in the DB but periodically garbage-collected', wrong: ['It exists only in RAM', 'It is permanently saved in the DB', 'It only creates views, no tables'] },
            { q: 'Which method efficiently retrieves multiple field values for a recordset as a list of dicts?', a: 'read()', wrong: ['mapped()', 'search()', 'browse()'] }
        ],
        'Advanced': [
            { q: 'What is the primary difference between with_user() and sudo()?', a: 'with_user sets a specific user; sudo bypasses security completely', wrong: ['They do the exact same thing', 'sudo is deprecated in Odoo 16+', 'with_user only affects the website frontend'] },
            { q: 'What does the flush() method do in the ORM?', a: 'Forces pending computed fields and updates to write to the DB', wrong: ['Clears the cache memory', 'Deletes all records in the recordset', 'Sends an email immediately'] },
            { q: 'How do you handle exceptions in a way that shows a user-friendly popup in Odoo?', a: 'raise UserError(_("Message"))', wrong: ['raise ValidationError("Message")', 'print("Message")', 'return {"error": "Message"}'] },
            { q: 'In Odoo 15+, how is a Many2many relationship table named by default if not explicitly defined?', a: 'model1_model2_rel', wrong: ['model1_rel_model2', 'rel_model1_model2', 'Automatically hashed string'] }
        ]
    },
    'javascript': {
        'Beginner': [
            { q: 'What modern JavaScript framework does Odoo use for its Web Client (v14+)?', a: 'OWL (Odoo Web Library)', wrong: ['React', 'Vue.js', 'Backbone.js'] },
            { q: 'In OWL, how do you define a new component?', a: 'class MyComponent extends Component', wrong: ['function MyComponent()', 'odoo.define("MyComponent", ...)', 'createWidget("MyComponent")'] },
            { q: 'Which hook is used to perform actions when an OWL component is mounted?', a: 'onMounted', wrong: ['useEffect', 'mounted', 'willStart'] },
            { q: 'How do you define a JS module in the classic Odoo architecture?', a: 'odoo.define("module_name", function(require) { ... })', wrong: ['import Odoo from "odoo"', 'module.exports = {}', 'odoo.createModule()'] }
        ],
        'Intermediate': [
            { q: 'How do you manage local reactive state in an OWL component?', a: 'this.state = useState({ ... })', wrong: ['this.setState({ ... })', 'this.data = reactive({ ... })', 'this.state = { ... }'] },
            { q: 'Where are actions, views, and services typically registered in modern Odoo JS?', a: 'Registries (e.g., registry.category("actions").add(...))', wrong: ['In the Python manifest', 'In the core.js file', 'Via the global window.odoo object'] },
            { q: 'What service is used to make server calls (RPC) in modern Odoo JS?', a: 'orm service', wrong: ['ajax service', 'http module', 'fetch API directly'] },
            { q: 'In OWL, how do you reference a DOM element inside a template?', a: 'useRef("referenceName")', wrong: ['document.getElementById()', 'this.$el', 'this.refs.referenceName'] }
        ],
        'Advanced': [
            { q: 'What is the purpose of the `setup()` method in an OWL component?', a: 'To initialize state, hooks, and services before rendering', wrong: ['To define the XML template', 'To handle click events', 'To destroy the component'] },
            { q: 'How do you trigger a global event on the EventBus in Odoo?', a: 'this.env.bus.trigger("event_name", payload)', wrong: ['window.dispatchEvent()', 'this.trigger()', 'bus.emit()'] },
            { q: 'In the classic JS framework, what method was primarily used to render a widget?', a: 'start()', wrong: ['render()', 'mount()', 'init()'] },
            { q: 'Which hook is used in OWL to fetch data asynchronously BEFORE the initial render?', a: 'willStart', wrong: ['onWillRender', 'onBeforeMount', 'useAsync'] }
        ]
    },
    'xml': {
        'Beginner': [
            { q: 'Which XML tag is used to define a new View, Action, or Menu in Odoo?', a: '<record>', wrong: ['<view>', '<data>', '<model>'] },
            { q: 'What is the standard root element for an Odoo XML data file?', a: '<odoo>', wrong: ['<openerp>', '<data>', '<manifest>'] },
            { q: 'Which attribute binds an action to a specific model?', a: 'res_model', wrong: ['model_id', 'target_model', 'binding_model'] },
            { q: 'In a tree view, what tag is used to display a column?', a: '<field>', wrong: ['<column>', '<td>', '<data>'] }
        ],
        'Intermediate': [
            { q: 'How do you modify an existing view?', a: 'By setting <field name="inherit_id" ref="base.view_id"/>', wrong: ['By using <replace_view>', 'By copying the original code', 'By setting inherit="True"'] },
            { q: 'Which xpath position adds the new element INSIDE the target, at the very end?', a: 'position="inside"', wrong: ['position="after"', 'position="append"', 'position="bottom"'] },
            { q: 'What is the purpose of noupdate="1" in a <data> tag?', a: 'Prevents the records from being overwritten when the module is upgraded', wrong: ['Makes the records read-only for users', 'Prevents the records from being deleted', 'Delays the creation of the records'] },
            { q: 'How do you reference a record created in a different module?', a: 'module_name.record_id', wrong: ['module_name/record_id', 'record_id@module_name', 'Depends on Python code'] }
        ],
        'Advanced': [
            { q: 'What xpath position replaces the targeted element completely?', a: 'position="replace"', wrong: ['position="override"', 'position="delete"', 'position="substitute"'] },
            { q: 'How do you evaluate Python code inside an XML data file to dynamically assign a value?', a: 'Using the eval="..." attribute', wrong: ['Using the python="..." attribute', 'Wrapping it in <script>', 'It is not possible'] },
            { q: 'What is the difference between a Window Action and a Server Action?', a: 'Window opens views; Server runs python code or automated tasks', wrong: ['Window is for frontend; Server is for backend', 'Window is for Linux; Server is for Windows', 'There is no difference'] },
            { q: 'How do you specify a domain constraint on a field in an XML view?', a: 'domain="[(\'field_name\', \'=\', value)]"', wrong: ['filter="field_name=value"', 'where="field_name==value"', 'constraint="field_name=value"'] }
        ]
    },
    'qweb': {
        'Beginner': [
            { q: 'What is QWeb?', a: 'Odoo\'s primary templating engine', wrong: ['Odoo\'s database ORM', 'A Python web server', 'A JavaScript framework'] },
            { q: 'Which tag is used to safely output the value of a variable?', a: '<t t-esc="value"/>', wrong: ['<t t-print="value"/>', '<t t-out="value"/>', '{{ value }}'] },
            { q: 'How do you write a simple IF condition in QWeb?', a: '<t t-if="condition">', wrong: ['<t t-condition="if">', '<if test="condition">', '<t-if condition="True">'] },
            { q: 'How do you iterate over a list in QWeb?', a: '<t t-foreach="list" t-as="item">', wrong: ['<t t-loop="list">', '<for item in list>', '<t t-iter="item">'] }
        ],
        'Intermediate': [
            { q: 'Which directive replaces t-raw in newer Odoo versions for rendering HTML?', a: 't-out', wrong: ['t-html', 't-safe', 't-render'] },
            { q: 'How do you define a reusable variable inside a QWeb template?', a: '<t t-set="var_name" t-value="expr"/>', wrong: ['<t t-var="var_name" value="expr"/>', '<t t-let="var_name" = "expr"/>', '<set var="var_name">expr</set>'] },
            { q: 'How do you call another QWeb template from within a template?', a: '<t t-call="module.template_name"/>', wrong: ['<t t-include="template_name"/>', '<t t-render="template_name"/>', '<t t-insert="template_name"/>'] },
            { q: 'What does the t-att-class directive do?', a: 'Dynamically computes and applies CSS classes', wrong: ['Attaches a CSS file to the template', 'Defines a new CSS class', 'Checks if a class exists'] }
        ],
        'Advanced': [
            { q: 'How can you inherit and modify a QWeb template in Odoo?', a: 'Using <template id="..." inherit_id="..."> and <xpath>', wrong: ['You can only override it completely', 'Using JavaScript', 'Using Python inheritance'] },
            { q: 'In QWeb reports, what object gives you access to the records being printed?', a: 'docs', wrong: ['records', 'objects', 'data'] },
            { q: 'How do you pass a variable context when calling a sub-template?', a: 'Variables are inherited automatically, or via t-set before calling', wrong: ['t-pass="var_name"', 'args="var_name"', 't-context="var_name"'] },
            { q: 'What does t-attf- do?', a: 'Allows string formatting (mixing static text and variables) for attributes', wrong: ['Forces an attribute to be boolean', 'Attaches a file to the template', 'Formats a date string'] }
        ]
    },
    'csv': {
        'Beginner': [
            { q: 'What is the standard filename for defining model access rights?', a: 'ir.model.access.csv', wrong: ['security.csv', 'access_rights.csv', 'models.csv'] },
            { q: 'What character is used as the delimiter in Odoo CSV data files?', a: 'Comma (,)', wrong: ['Semicolon (;)', 'Tab (\\t)', 'Pipe (|)'] },
            { q: 'Can you load demo records into Odoo using CSV files?', a: 'Yes', wrong: ['No, only XML', 'No, only Python', 'Yes, but only for the res.users model'] },
            { q: 'What does the perm_read column specify in access rights?', a: 'Read permission (1 for True, 0 for False)', wrong: ['Permanent read access', 'Permitted users list', 'Permission to read attachments'] }
        ],
        'Intermediate': [
            { q: 'What is the first required column in an ir.model.access.csv file?', a: 'id (External ID of the access rule)', wrong: ['name', 'model_id', 'group_id'] },
            { q: 'How do you reference a security group in a CSV file?', a: 'group_id:id', wrong: ['group_name', 'group_id/id', 'group_id'] },
            { q: 'How do you link a record to a model in the access rights CSV?', a: 'model_id:id', wrong: ['model_name', 'model_id/name', 'model'] },
            { q: 'If the group_id:id column is left empty, what does it mean?', a: 'The access rule applies globally to all users', wrong: ['The row is ignored', 'It throws an error during installation', 'It applies only to the Admin user'] }
        ],
        'Advanced': [
            { q: 'How do you handle Many2many relational data import in a CSV?', a: 'Separate External IDs with commas inside quotes (e.g. "id1,id2")', wrong: ['Use multiple rows for the same record', 'It is not possible via CSV', 'Use a sub-CSV file'] },
            { q: 'What prefix is automatically added to the external ID of the model in model_id:id if not specified?', a: 'model_', wrong: ['ir_', 'base_', 'None, it fails'] },
            { q: 'In what section of the __manifest__.py should security CSV files be placed?', a: 'data', wrong: ['security', 'init', 'demo'] },
            { q: 'If a user belongs to two groups with conflicting access rights on the same model, what happens?', a: 'Access is granted if AT LEAST ONE group grants it (Union of rights)', wrong: ['Access is denied', 'The system crashes', 'The most restrictive right wins'] }
        ]
    },
    'html': {
        'Beginner': [
            { q: 'What underlying CSS framework does the Odoo Website Builder use?', a: 'Bootstrap', wrong: ['Tailwind', 'Foundation', 'Bulma'] },
            { q: 'What is a "snippet" in the context of the Odoo Website?', a: 'A drag-and-drop HTML block for building pages', wrong: ['A piece of Python code', 'An inline CSS style', 'A JavaScript alert'] },
            { q: 'Which tag is used to create a hyperlink?', a: '<a>', wrong: ['<link>', '<href>', '<url>'] },
            { q: 'Which class is used in Bootstrap to create a flexible row container?', a: 'row', wrong: ['flex-container', 'grid-row', 'line'] }
        ],
        'Intermediate': [
            { q: 'How many columns does the standard Bootstrap grid system use in Odoo?', a: '12', wrong: ['10', '16', '8'] },
            { q: 'Which QWeb directive makes a field inline-editable in the website frontend?', a: 't-field', wrong: ['t-edit', 't-model', 't-esc'] },
            { q: 'How do you add an image in HTML?', a: '<img src="...">', wrong: ['<image href="...">', '<pic source="...">', '<img link="...">'] },
            { q: 'What class hides an element on mobile devices in Bootstrap 4/5 (used by Odoo)?', a: 'd-none d-md-block', wrong: ['hide-mobile', 'hidden-xs', 'invisible-sm'] }
        ],
        'Advanced': [
            { q: 'How do you define a custom Snippet option in Odoo?', a: 'Using XML <template id="snippet_options" inherit_id="website.snippet_options">', wrong: ['Writing Python controllers', 'Modifying the core JS', 'Creating a custom database table'] },
            { q: 'What is the purpose of the "s_" prefix on classes in Odoo HTML?', a: 'Identifies standard Snippet elements for the editor', wrong: ['Stands for "Secure"', 'Indicates a SCSS variable', 'It is a Bootstrap standard'] },
            { q: 'How do you ensure an image is responsive (scales with parent) in Odoo?', a: 'Use the img-fluid class', wrong: ['Use width="100%"', 'Use class="responsive-img"', 'Use CSS flexbox'] },
            { q: 'What attribute allows you to use a specific formatting widget for a t-field?', a: 't-options', wrong: ['t-widget', 't-format', 't-style'] }
        ]
    },
    'translations': {
        'Beginner': [
            { q: 'What is the standard file extension for translated strings in Odoo?', a: '.po', wrong: ['.trans', '.lang', '.json'] },
            { q: 'In which folder of a module should translation files be placed?', a: 'i18n/', wrong: ['lang/', 'translations/', 'locale/'] },
            { q: 'What does a .pot file represent?', a: 'A template containing all extractable strings (not translated)', wrong: ['A Portuguese translation file', 'A compiled binary language file', 'A Python Object Template'] },
            { q: 'How can you manually export translations for a module in Odoo?', a: 'Developer Mode -> Settings -> Translations -> Export Translation', wrong: ['Via the terminal only', 'By right-clicking a view', 'It happens automatically on install'] }
        ],
        'Intermediate': [
            { q: 'How do you mark a literal string for translation inside Python code?', a: 'Wrap it in _()', wrong: ['Wrap it in translate()', 'Prefix it with t_', 'It is automatic'] },
            { q: 'What must be imported in Python to use the translation function?', a: 'from odoo import _', wrong: ['from odoo.tools import translate', 'import i18n', 'from odoo import trans'] },
            { q: 'How do you reload translation files without updating the whole module?', a: 'Settings -> Translations -> Load a Translation', wrong: ['Restart the Odoo server', 'Clear browser cache', 'Run a cron job'] },
            { q: 'What happens if a translation for a string is missing in the .po file?', a: 'Odoo displays the original (English) string', wrong: ['It throws an error', 'It shows a blank space', 'It translates it using Google Translate API'] }
        ],
        'Advanced': [
            { q: 'If a field has the attribute translate="True", how is its data stored?', a: 'The translations are stored in the ir.translation table, linked to the record', wrong: ['Multiple columns are created in the model table', 'It is stored in a JSON file', 'It creates a new table for every language'] },
            { q: 'How do you provide context to a translation string in python?', a: 'Odoo doesn\'t natively support standard gettext context; you must ensure string uniqueness or use specific workarounds', wrong: ['_("string", context="x")', 'pgettext("context", "string")', 'It reads the Python function name'] },
            { q: 'When updating a module, how do you prevent it from overwriting custom translations made in the UI?', a: 'Uncheck "Overwrite Existing Terms" when loading, or rely on noupdate for data', wrong: ['You cannot prevent it', 'Lock the .po file', 'Change the user language'] },
            { q: 'What tool does Odoo use under the hood to manage .po files?', a: 'GNU gettext', wrong: ['Babel', 'i18next', 'Sphinx'] }
        ]
    },
    'erppeek': {
        'Beginner': [
            { q: 'What is ERPPeek?', a: 'A Python library and CLI tool to interact with Odoo via XML-RPC', wrong: ['An official Odoo module for HR', 'A database monitoring tool', 'A frontend JavaScript framework'] },
            { q: 'How do you typically launch the interactive shell for ERPPeek?', a: 'Run the command `erppeek` in the terminal', wrong: ['Run `python odoo-bin shell`', 'Click a button in Odoo settings', 'It runs automatically in the browser'] },
            { q: 'Is ERPPeek officially maintained by Odoo S.A.?', a: 'No, it is a community project', wrong: ['Yes, it is part of the enterprise edition', 'Yes, it is built-in', 'No, it is maintained by Microsoft'] },
            { q: 'What underlying protocol does ERPPeek primarily use?', a: 'XML-RPC', wrong: ['RESTful JSON API', 'GraphQL', 'Direct SQL connection'] }
        ],
        'Intermediate': [
            { q: 'How do you initialize a connection in an ERPPeek python script?', a: 'client = erppeek.Client("url", "db", "user", "pass")', wrong: ['client = odoo.connect()', 'client = ERP()', 'db = connect("url")'] },
            { q: 'How do you search for record IDs using ERPPeek?', a: 'client.search("model_name", [domain])', wrong: ['client.find("model_name")', 'client.query("model_name")', 'client.get_ids("model_name")'] },
            { q: 'How do you read specific fields from records using ERPPeek?', a: 'client.read("model_name", [ids], ["fields"])', wrong: ['client.get_data("model_name")', 'client.fetch()', 'client.select()'] },
            { q: 'How do you create a new record via ERPPeek?', a: 'client.create("model_name", {values})', wrong: ['client.insert()', 'client.new()', 'client.add_record()'] }
        ],
        'Advanced': [
            { q: 'How do you call a custom model method using ERPPeek?', a: 'client.execute("model_name", "method_name", [ids], args)', wrong: ['client.call_method()', 'client.run()', 'It is not possible to call custom methods'] },
            { q: 'What object represents a record when using ERPPeek in object-oriented mode?', a: 'Record object (e.g., model.get(id))', wrong: ['Dictionary', 'Tuple', 'JSON String'] },
            { q: 'How do you update an existing record?', a: 'client.write("model_name", [ids], {values})', wrong: ['client.update()', 'client.edit()', 'client.modify()'] },
            { q: 'Where does ERPPeek look for its configuration file by default?', a: '~/.erppeek.ini', wrong: ['/etc/odoo/odoo.conf', 'In the current directory as .env', 'It does not use a config file'] }
        ]
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        initCategoryList();
        updateHeader();
    } catch (error) {
        console.error("Failed to initialize database", error);
    }
});

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // If the store already exists (from version 1), delete it so we can start fresh
            if (database.objectStoreNames.contains('questions')) {
                database.deleteObjectStore('questions');
            }
            
            // Create the new store
            const store = database.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
            store.createIndex('cat_level', ['category', 'level'], { unique: false });
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            // Since we deleted the store on upgrade, it will be empty, 
            // and checkAndSeedDB will naturally re-seed the new questions.
            checkAndSeedDB().then(resolve).catch(reject);
        };

        request.onerror = (event) => reject(event.target.error);
    });
}

async function checkAndSeedDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const countRequest = store.count();

        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                seedDB().then(resolve).catch(reject);
            } else {
                resolve();
            }
        };
        countRequest.onerror = (e) => reject(e.target.error);
    });
}

async function seedDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');

        for (const category in initialQuestionDB) {
            for (const level in initialQuestionDB[category]) {
                initialQuestionDB[category][level].forEach(q => {
                    store.add({ ...q, category, level });
                });
            }
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = (e) => reject(e.target.error);
    });
}

async function getQuestionsFromDB(category, level) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const index = store.index('cat_level');
        const request = index.getAll([category, level]);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function initCategoryList() {
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `w-full flex items-center p-4 rounded-2xl bg-white border-2 border-gray-100 hover:${cat.border} shadow-sm transition group text-left relative`;
        btn.onclick = () => selectCategory(cat.id);
        
        btn.innerHTML = `
            <div class="w-14 h-14 ${cat.bg} rounded-xl flex items-center justify-center text-3xl mr-4 z-10 shrink-0">
                ${cat.icon}
            </div>
            <div class="z-10 flex-1">
                <h3 class="font-bold text-gray-800 text-lg">${cat.name}</h3>
                <p class="text-gray-400 text-xs font-medium">${cat.desc}</p>
            </div>
            <div class="absolute right-4 text-gray-300 group-hover:text-purple-600 transition z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        `;
        list.appendChild(btn);
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');
    currentScreen = screenId;
    updateHeader();
}

function updateHeader() {
    const backBtn = document.getElementById('btn-back');
    if (currentScreen === 'categories') {
        backBtn.classList.add('invisible');
    } else if (currentScreen === 'levels' || currentScreen === 'game') {
        backBtn.classList.remove('invisible');
    } else if (currentScreen === 'results') {
        backBtn.classList.add('invisible');
    }
}

function navigateBack() {
    if (currentScreen === 'levels') {
        switchScreen('categories');
    } else if (currentScreen === 'game') {
        switchScreen('levels');
    }
}

function navigateHome() {
    switchScreen('categories');
}

function selectCategory(catId) {
    selectedCategoryId = catId;
    const cat = categories.find(c => c.id === catId);
    document.getElementById('level-icon').textContent = cat.icon;
    document.getElementById('level-title').textContent = `${cat.name} Mastery`;
    switchScreen('levels');
}

async function selectLevel(level) {
    selectedLevel = level;
    
    try {
        const dbQuestions = await getQuestionsFromDB(selectedCategoryId, level);
        if (!dbQuestions || dbQuestions.length === 0) {
            console.error("No data for this combination.");
            return;
        }
        
        // Deep copy and shuffle questions
        currentQuestions = [...dbQuestions].sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        
        updateScoreUI();
        switchScreen('game');
        renderQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function renderQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    isAnimating = false;
    const qData = currentQuestions[currentQuestionIndex];
    
    // Update Progress
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('game-progress-text').textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    
    // Update Prompt
    document.getElementById('question-text').textContent = qData.q;

    // Prepare Options (1 correct, 3 wrong)
    const options = [qData.a, ...qData.wrong];
    // Shuffle Options
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm hover:border-purple-300 hover:bg-purple-50 font-medium text-gray-700 text-[15px] transition-all duration-200 outline-none tap-highlight-transparent`;
        // Use textContent to safely inject code/HTML characters without breaking DOM
        btn.textContent = opt; 
        
        // Keep reference for checking
        btn.onclick = () => checkAnswer(btn, opt, qData.a);
        container.appendChild(btn);
    });
}

function checkAnswer(clickedBtn, selectedAnswer, correctAnswer) {
    if (isAnimating) return;
    isAnimating = true;

    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        clickedBtn.classList.add('anim-correct');
        score++;
        updateScoreUI();
    } else {
        clickedBtn.classList.add('anim-wrong');
        // Highlight the correct one
        const buttons = document.getElementById('options-container').querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('anim-reveal-correct');
            }
        });
    }

    // Wait for animation, then next question
    setTimeout(() => {
        currentQuestionIndex++;
        renderQuestion();
    }, 1200); // Slightly longer wait to read the correct answer if wrong
}

function updateScoreUI() {
    document.getElementById('game-score-text').textContent = `Score: ${score}`;
}

function endGame() {
    // Set final progress bar to 100%
    document.getElementById('progress-bar').style.width = `100%`;
    
    setTimeout(() => {
        const total = currentQuestions.length;
        document.getElementById('final-score').textContent = `${score} / ${total}`;
        
        const emojiEl = document.getElementById('result-emoji');
        const titleEl = document.getElementById('result-title');
        const msgEl = document.getElementById('result-message');
        
        const percentage = score / total;
        
        if (percentage === 1) {
            emojiEl.textContent = '🏆';
            titleEl.textContent = 'Expert!';
            msgEl.textContent = 'Flawless knowledge of this Odoo topic.';
        } else if (percentage >= 0.6) {
            emojiEl.textContent = '👏';
            titleEl.textContent = 'Solid Work!';
            msgEl.textContent = 'You have a good grasp of these concepts.';
        } else {
            emojiEl.textContent = '📚';
            titleEl.textContent = 'Keep Learning!';
            msgEl.textContent = 'Review the documentation and try again.';
        }

        switchScreen('results');
    }, 300);
}
