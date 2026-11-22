
/* =========================================
   BIZNEXUS - ENTERPRISE MANAGEMENT SYSTEM
   Main JavaScript File
========================================= */


/* 1. DATA STORAGE */

const defaultData = {
    employees: [
        {id: 1, name: "Ayesha Khan", email: "ayesha@example.com", department: "Marketing", position: "Marketing Manager", status: "Active"},
        {id: 2, name: "Ali Ahmed", email: "ali@example.com", department: "IT", position: "Software Developer", status: "Active"},
        {id: 3, name: "Sara Malik", email: "sara@example.com", department: "Finance", position: "Accountant", status: "Active"},
        {id: 4, name: "Usman Tariq", email: "usman@example.com", department: "HR", position: "HR Officer", status: "Inactive"}
    ],

    customers: [
        {id: 1, name: "Horizon Solutions", email: "horizon@example.com", phone: "03001234567", status: "Active"},
        {id: 2, name: "Creative Studio", email: "creative@example.com", phone: "03111234567", status: "Active"},
        {id: 3, name: "Nova Enterprises", email: "nova@example.com", phone: "03221234567", status: "Pending"}
    ],

    projects: [
        {id: 1, name: "Website Redesign", description: "Corporate website redesign", startDate: "2026-11-01", deadline: "2026-12-15", progress: 75, status: "In Progress"},
        {id: 2, name: "Marketing Campaign", description: "Digital marketing strategy", startDate: "2026-11-05", deadline: "2026-12-20", progress: 55, status: "In Progress"},
        {id: 3, name: "Mobile Application", description: "Business mobile application", startDate: "2026-11-10", deadline: "2027-01-10", progress: 35, status: "Planning"}
    ],

    tasks: [
        {id: 1, title: "Prepare project proposal", assigned: "Ayesha Khan", dueDate: "2026-11-28", priority: "High", status: "Pending"},
        {id: 2, title: "Review website design", assigned: "Ali Ahmed", dueDate: "2026-11-26", priority: "Medium", status: "In Progress"},
        {id: 3, title: "Update customer records", assigned: "Sara Malik", dueDate: "2026-11-30", priority: "Low", status: "Completed"}
    ],

    inventory: [
        {id: 1, name: "Laptop", category: "Electronics", quantity: 15, minimum: 5, price: 150000},
        {id: 2, name: "Office Chair", category: "Furniture", quantity: 3, minimum: 5, price: 18000},
        {id: 3, name: "Wireless Mouse", category: "Accessories", quantity: 25, minimum: 10, price: 2500},
        {id: 4, name: "Keyboard", category: "Accessories", quantity: 8, minimum: 10, price: 4500}
    ],

    activities: [
        {icon: "♙", title: "Employee records initialized", detail: "System demonstration data"},
        {icon: "◫", title: "Project workspace created", detail: "Business operations started"},
        {icon: "▤", title: "Inventory records loaded", detail: "Stock monitoring activated"}
    ],

    notifications: [
        {id: 1, title: "Low Stock Alert", message: "Office Chair stock is below the minimum level.", time: "System alert", read: false},
        {id: 2, title: "Project Reminder", message: "Website Redesign project is currently in progress.", time: "Project update", read: false}
    ]
};


function loadData() {
    try {
        const saved = localStorage.getItem("bizNexusData");

        if (!saved) {
            return JSON.parse(JSON.stringify(defaultData));
        }

        const parsed = JSON.parse(saved);

        Object.keys(defaultData).forEach(key => {
            if (!Array.isArray(parsed[key])) {
                parsed[key] = JSON.parse(JSON.stringify(defaultData[key]));
            }
        });

        return parsed;
    } catch (error) {
        console.error("Storage loading error:", error);
        return JSON.parse(JSON.stringify(defaultData));
    }
}


let data = loadData();

function saveData() {
    try {
        localStorage.setItem("bizNexusData", JSON.stringify(data));
    } catch (error) {
        console.error("Storage saving error:", error);
        showToast("Unable to save data. Check browser storage.");
    }
}


/* 2. ELEMENT HELPERS */

const $ = selector => document.querySelector(selector);

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[char]));

function formatStatus(status) {
    const className = String(status).toLowerCase().replace(/\s+/g, "-");
    return `<span class="status ${escapeHTML(className)}">${escapeHTML(status)}</span>`;
}

function nextId(items) {
    return items.length ? Math.max(...items.map(item => Number(item.id) || 0)) + 1 : 1;
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}


/* 3. ACTIVITY TRACKING */

function addActivity(icon, title, detail) {
    data.activities.unshift({
        icon,
        title,
        detail
    });

    data.activities = data.activities.slice(0, 12);
    saveData();
}


/* 4. PAGE CONFIGURATION */

const configurations = {

    employees: {
        heading: "Employee Management",
        description: "Manage your workforce and employee information.",
        singular: "Employee",
        button: "Add Employee",
        columns: ["ID", "Employee", "Email", "Department", "Position", "Status"],
        fields: [
            {key: "name", label: "Full Name", type: "text", required: true},
            {key: "email", label: "Email Address", type: "email", required: true},
            {key: "department", label: "Department", type: "select", options: ["IT", "Marketing", "Finance", "HR", "Sales", "Operations"]},
            {key: "position", label: "Job Position", type: "text", required: true},
            {key: "status", label: "Status", type: "select", options: ["Active", "Inactive"]}
        ],
        row: item => [
            `<strong>${escapeHTML(item.name)}</strong>`,
            escapeHTML(item.email),
            escapeHTML(item.department),
            escapeHTML(item.position),
            formatStatus(item.status)
        ]
    },

    customers: {
        heading: "Customer Relationship Management",
        description: "Build relationships and manage your business clients.",
        singular: "Customer",
        button: "Add Customer",
        columns: ["ID", "Customer", "Email", "Phone", "Status"],
        fields: [
            {key: "name", label: "Customer Name", type: "text", required: true},
            {key: "email", label: "Email Address", type: "email", required: true},
            {key: "phone", label: "Phone Number", type: "tel", required: true},
            {key: "status", label: "Customer Status", type: "select", options: ["Active", "Pending", "Inactive"]}
        ],
        row: item => [
            `<strong>${escapeHTML(item.name)}</strong>`,
            escapeHTML(item.email),
            escapeHTML(item.phone),
            formatStatus(item.status)
        ]
    },

    projects: {
        heading: "Project Management",
        description: "Organize projects and monitor their completion.",
        singular: "Project",
        button: "Create Project",
        columns: ["ID", "Project", "Description", "Deadline", "Progress", "Status"],
        fields: [
            {key: "name", label: "Project Name", type: "text", required: true},
            {key: "description", label: "Description", type: "textarea", required: true},
            {key: "startDate", label: "Start Date", type: "date", required: true},
            {key: "deadline", label: "Deadline", type: "date", required: true},
            {key: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, required: true},
            {key: "status", label: "Status", type: "select", options: ["Planning", "In Progress", "Completed"]}
        ],
        row: item => [
            `<strong>${escapeHTML(item.name)}</strong>`,
            escapeHTML(item.description),
            escapeHTML(item.deadline),
            `${Math.max(0, Math.min(100, Number(item.progress) || 0))}%`,
            formatStatus(item.status)
        ]
    },

    tasks: {
        heading: "Task Management",
        description: "Assign work, manage deadlines and track progress.",
        singular: "Task",
        button: "Add Task",
        columns: ["ID", "Task", "Assigned To", "Due Date", "Priority", "Status"],
        fields: [
            {key: "title", label: "Task Title", type: "text", required: true},
            {key: "assigned", label: "Assigned Employee", type: "text", required: true},
            {key: "dueDate", label: "Due Date", type: "date", required: true},
            {key: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"]},
            {key: "status", label: "Task Status", type: "select", options: ["Pending", "In Progress", "Completed"]}
        ],
        row: item => [
            `<strong>${escapeHTML(item.title)}</strong>`,
            escapeHTML(item.assigned),
            escapeHTML(item.dueDate),
            formatStatus(item.priority),
            formatStatus(item.status)
        ]
    },

    inventory: {
        heading: "Inventory Management",
        description: "Monitor products, quantities and stock levels.",
        singular: "Inventory Item",
        button: "Add Product",
        columns: ["ID", "Product", "Category", "Quantity", "Unit Price", "Stock Status"],
        fields: [
            {key: "name", label: "Product Name", type: "text", required: true},
            {key: "category", label: "Category", type: "select", options: ["Electronics", "Furniture", "Accessories", "Stationery", "Other"]},
            {key: "quantity", label: "Available Quantity", type: "number", min: 0, required: true},
            {key: "minimum", label: "Minimum Stock Level", type: "number", min: 0, required: true},
            {key: "price", label: "Unit Price (PKR)", type: "number", min: 0, required: true}
        ],
        row: item => [
            `<strong>${escapeHTML(item.name)}</strong>`,
            escapeHTML(item.category),
            escapeHTML(item.quantity),
            "PKR " + Number(item.price).toLocaleString("en-PK"),
            formatStatus(Number(item.quantity) <= Number(item.minimum) ? "Low Stock" : "In Stock")
        ]
    }
};


/* 5. SIDEBAR NAVIGATION */

const pageNames = {
    dashboard: "Business Overview",
    employees: "Employee Management",
    customers: "Customer Management",
    projects: "Project Management",
    tasks: "Task Management",
    inventory: "Inventory Management",
    analytics: "Business Analytics",
    notifications: "Notifications",
    settings: "Settings"
};


function navigateTo(page) {
    if (!pageNames[page]) return;

    document.querySelectorAll(".page").forEach(section => {
        section.classList.toggle("active", section.id === page);
    });

    document.querySelectorAll(".nav-link[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    $("#pageHeading").textContent = pageNames[page];
    $("#breadcrumb").textContent = pageNames[page];

    $("#sidebar").classList.remove("open");

    if (configurations[page]) {
        renderManagementPage(page);
    }

    if (page === "analytics") renderAnalytics();
    if (page === "notifications") renderNotifications();
    if (page === "settings") renderSettings();

    if (page === "dashboard") renderDashboard();

    window.scrollTo({top: 0, behavior: "smooth"});
}


document.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");

    if (button) {
        navigateTo(button.dataset.page);
    }
});


/* 6. MANAGEMENT PAGES */

let currentPage = "";
let editingId = null;


function renderManagementPage(page, searchTerm = "") {
    const config = configurations[page];
    if (!config) return;

    currentPage = page;

    const records = data[page].filter(item => {
        const text = Object.values(item).join(" ").toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const pageElement = $("#" + page);

    const tableRows = records.length
        ? records.map(item => {
            const cells = config.row(item);

            return `
                <tr>
                    <td>#${escapeHTML(item.id)}</td>
                    ${cells.map(cell => `<td>${cell}</td>`).join("")}
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn" data-action="edit" data-id="${item.id}">Edit</button>
                            <button class="action-btn delete" data-action="delete" data-id="${item.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("")
        : `<tr><td colspan="${config.columns.length + 2}" class="table-empty">No matching records found.</td></tr>`;

    const extraMetrics = page === "inventory"
        ? `<div class="page-metrics">
            <div class="metric-card"><small>Total Products</small><h2>${data.inventory.length}</h2></div>
            <div class="metric-card"><small>Total Units</small><h2>${data.inventory.reduce((sum, item) => sum + Number(item.quantity), 0)}</h2></div>
            <div class="metric-card"><small>Low Stock Items</small><h2>${data.inventory.filter(item => Number(item.quantity) <= Number(item.minimum)).length}</h2></div>
           </div>`
        : page === "projects"
        ? `<div class="page-metrics">
            <div class="metric-card"><small>Total Projects</small><h2>${data.projects.length}</h2></div>
            <div class="metric-card"><small>In Progress</small><h2>${data.projects.filter(item => item.status === "In Progress").length}</h2></div>
            <div class="metric-card"><small>Completed</small><h2>${data.projects.filter(item => item.status === "Completed").length}</h2></div>
           </div>`
        : "";

    pageElement.innerHTML = `
        <div class="page-intro">
            <div>
                <div class="eyebrow">BIZNEXUS / WORKSPACE</div>
                <h1>${config.heading}</h1>
                <p>${config.description}</p>
            </div>
            <button class="primary-btn" id="addRecordBtn">+ ${config.button}</button>
        </div>

        ${extraMetrics}

        <div class="table-panel">
            <div class="table-toolbar">
                <div>
                    <h3 style="font-size:13px;">All ${config.singular} Records</h3>
                    <p style="color:var(--muted);font-size:10px;margin-top:5px;">
                        Showing ${records.length} of ${data[page].length} records
                    </p>
                </div>

                <label class="search-box">
                    <span>⌕</span>
                    <input id="tableSearch" type="search" placeholder="Search records..." value="${escapeHTML(searchTerm)}">
                </label>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            ${["ID", ...config.columns.slice(1), "Actions"].map(col => `<th>${col}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>
    `;

    $("#addRecordBtn").addEventListener("click", () => openModal(page));

    $("#tableSearch").addEventListener("input", event => {
        const position = event.target.selectionStart;
        const value = event.target.value;
        renderManagementPage(page, value);
        const newSearch = $("#tableSearch");
        newSearch.focus();
        newSearch.setSelectionRange(position, position);
    });

    pageElement.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            if (button.dataset.action === "edit") {
                openModal(page, id);
            } else {
                deleteRecord(page, id);
            }
        });
    });
}


/* 7. ADD / EDIT MODAL */

function openModal(page, id = null) {
    currentPage = page;
    editingId = id;

    const config = configurations[page];
    const record = id === null
        ? {}
        : data[page].find(item => item.id === id);

    if (id !== null && !record) return;

    $("#modalTitle").textContent = id === null
        ? "Add " + config.singular
        : "Edit " + config.singular;

    $("#formFields").innerHTML = config.fields.map(field => {
        const value = record[field.key] ?? "";
        const full = field.type === "textarea" ? "full" : "";

        let input = "";

        if (field.type === "select") {
            input = `
                <select name="${field.key}" ${field.required ? "required" : ""}>
                    ${field.options.map(option => `
                        <option value="${escapeHTML(option)}" ${value === option ? "selected" : ""}>
                            ${escapeHTML(option)}
                        </option>
                    `).join("")}
                </select>
            `;
        } else if (field.type === "textarea") {
            input = `<textarea name="${field.key}" ${field.required ? "required" : ""}>${escapeHTML(value)}</textarea>`;
        } else {
            input = `
                <input
                    type="${field.type}"
                    name="${field.key}"
                    value="${escapeHTML(value)}"
                    ${field.min !== undefined ? `min="${field.min}"` : ""}
                    ${field.max !== undefined ? `max="${field.max}"` : ""}
                    ${field.required ? "required" : ""}
                >
            `;
        }

        return `
            <div class="form-group ${full}">
                <label>${field.label}</label>
                ${input}
            </div>
        `;
    }).join("");

    $("#modalOverlay").classList.add("show");
}


function closeModal() {
    $("#modalOverlay").classList.remove("show");
    $("#recordForm").reset();
    editingId = null;
}


$("#modalClose").addEventListener("click", closeModal);
$("#cancelBtn").addEventListener("click", closeModal);

$("#modalOverlay").addEventListener("click", event => {
    if (event.target.id === "modalOverlay") closeModal();
});


$("#recordForm").addEventListener("submit", event => {
    event.preventDefault();

    const config = configurations[currentPage];
    const formData = new FormData(event.target);
    const record = {};

    config.fields.forEach(field => {
        const rawValue = formData.get(field.key);
        record[field.key] = field.type === "number"
            ? Number(rawValue)
            : String(rawValue ?? "").trim();
    });

    if (currentPage === "projects") {
        if (record.startDate && record.deadline && record.deadline < record.startDate) {
            showToast("Deadline cannot be before the start date.");
            return;
        }

        if (record.progress === 100) {
            record.status = "Completed";
        }
    }

    if (editingId !== null) {
        const index = data[currentPage].findIndex(item => item.id === editingId);

        if (index !== -1) {
            data[currentPage][index] = {
                ...data[currentPage][index],
                ...record
            };
        }

        addActivity("✎", config.singular + " updated", record.name || record.title || "Record updated");
        showToast(config.singular + " updated successfully!");
    } else {
        record.id = nextId(data[currentPage]);
        data[currentPage].push(record);

        addActivity("+", config.singular + " added", record.name || record.title || "New record");
        showToast(config.singular + " added successfully!");
    }

    saveData();
    closeModal();
    renderManagementPage(currentPage);
    renderDashboard();
});


/* 8. DELETE RECORD */

function deleteRecord(page, id) {
    const record = data[page].find(item => item.id === id);
    if (!record) return;

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    data[page] = data[page].filter(item => item.id !== id);

    const config = configurations[page];

    addActivity("−", config.singular + " deleted", record.name || record.title || "Record removed");

    saveData();
    renderManagementPage(page);
    renderDashboard();

    showToast("Record deleted successfully!");
}


/* 9. DASHBOARD */

function renderDashboard() {

    $("#employeeStat").textContent = data.employees.length;
    $("#customerStat").textContent = data.customers.length;

    $("#projectStat").textContent = data.projects.filter(
        item => item.status === "In Progress"
    ).length;

    $("#inventoryStat").textContent = data.inventory.length;

    // Project progress

    const projects = data.projects.slice(0, 4);

    $("#projectProgress").innerHTML = projects.length
        ? projects.map(project => `
            <div class="progress-item">
                <div>
                    <strong>${escapeHTML(project.name)}</strong>
                    <span>${Number(project.progress)}%</span>
                </div>
                <div class="progress-track">
                    <div style="width:${Math.max(0, Math.min(100, Number(project.progress) || 0))}%"></div>
                </div>
            </div>
        `).join("")
        : `<div class="empty-message">No projects available yet.</div>`;

    // Activities

    $("#recentActivities").innerHTML = data.activities.length
        ? data.activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${escapeHTML(activity.icon)}</div>
                <div>
                    <strong>${escapeHTML(activity.title)}</strong>
                    <small>${escapeHTML(activity.detail)}</small>
                </div>
            </div>
        `).join("")
        : `<div class="empty-message">No recent activities.</div>`;

    // Attention center

    const lowStock = data.inventory.filter(
        item => Number(item.quantity) <= Number(item.minimum)
    );

    const pendingTasks = data.tasks.filter(
        item => item.status !== "Completed"
    );

    const overdueTasks = pendingTasks.filter(
        item => item.dueDate && item.dueDate < getToday()
    );

    const alerts = [
        ...lowStock.map(item => ({
            title: "Low Stock: " + item.name,
            message: item.quantity + " units remaining. Minimum: " + item.minimum
        })),
        ...overdueTasks.map(item => ({
            title: "Overdue Task: " + item.title,
            message: "Due date: " + item.dueDate
        }))
    ];

    $("#attentionCenter").innerHTML = alerts.length
        ? alerts.slice(0, 5).map(alert => `
            <div class="attention-item">
                <div class="activity-icon">!</div>
                <div>
                    <strong>${escapeHTML(alert.title)}</strong>
                    <small>${escapeHTML(alert.message)}</small>
                </div>
            </div>
        `).join("")
        : `<div class="empty-message">All business operations look good.</div>`;

    updateNotificationCount();
}


/* 10. ANALYTICS */

function renderAnalytics() {

    const totalEmployees = data.employees.length;
    const activeEmployees = data.employees.filter(item => item.status === "Active").length;

    const totalProjects = data.projects.length;
    const completedProjects = data.projects.filter(item => item.status === "Completed").length;

    const totalCustomers = data.customers.length;
    const totalInventory = data.inventory.reduce((sum, item) => sum + Number(item.quantity), 0);

    const averageProgress = totalProjects
        ? Math.round(data.projects.reduce((sum, item) => sum + Number(item.progress), 0) / totalProjects)
        : 0;

    $("#analytics").innerHTML = `
        <div class="page-intro">
            <div>
                <div class="eyebrow">BIZNEXUS / PERFORMANCE CENTER</div>
                <h1>Business Analytics</h1>
                <p>Understand your business through meaningful data.</p>
            </div>
        </div>

        <div class="analytics-grid">

            <div class="analytics-box">
                <h3>Workforce Overview</h3>
                <div class="analytics-number">${activeEmployees}/${totalEmployees}</div>
                <p>Active employees out of total registered employees.</p>
                <div class="mini-track">
                    <div style="width:${totalEmployees ? activeEmployees / totalEmployees * 100 : 0}%"></div>
                </div>
            </div>

            <div class="analytics-box">
                <h3>Customer Network</h3>
                <div class="analytics-number">${totalCustomers}</div>
                <p>Total customer records maintained in your workspace.</p>
                <div class="mini-track"><div style="width:${Math.min(100,totalCustomers * 10)}%"></div></div>
            </div>

            <div class="analytics-box">
                <h3>Project Completion</h3>
                <div class="analytics-number">${averageProgress}%</div>
                <p>Average completion across all registered projects.</p>
                <div class="mini-track"><div style="width:${averageProgress}%"></div></div>
            </div>

            <div class="analytics-box">
                <h3>Inventory Capacity</h3>
                <div class="analytics-number">${totalInventory}</div>
                <p>Total units currently recorded in the inventory.</p>
                <div class="mini-track"><div style="width:${Math.min(100,totalInventory)}%"></div></div>
            </div>

            <div class="analytics-box">
                <h3>Project Portfolio</h3>
                <div class="analytics-number">${totalProjects}</div>
                <p>${completedProjects} completed projects and ${totalProjects - completedProjects} remaining projects.</p>
            </div>

            <div class="analytics-box">
                <h3>Stock Health</h3>
                <div class="analytics-number">${data.inventory.filter(item => Number(item.quantity) <= Number(item.minimum)).length}</div>
                <p>Inventory items that require stock replenishment.</p>
            </div>

        </div>
    `;
}


/* 11. NOTIFICATIONS */

function generateAlerts() {

    const lowStock = data.inventory.filter(
        item => Number(item.quantity) <= Number(item.minimum)
    );

    const overdue = data.tasks.filter(
        item => item.status !== "Completed" &&
                item.dueDate &&
                item.dueDate < getToday()
    );

    const generated = [
        ...lowStock.map(item => ({
            id: "stock-" + item.id,
            title: "Low Stock Alert",
            message: item.name + " has only " + item.quantity + " units remaining.",
            time: "Inventory monitoring"
        })),
        ...overdue.map(item => ({
            id: "task-" + item.id,
            title: "Overdue Task",
            message: item.title + " was due on " + item.dueDate + ".",
            time: "Task monitoring"
        }))
    ];

    const existingIds = new Set(data.notifications.map(item => String(item.id)));

    generated.forEach(alert => {
        if (!existingIds.has(String(alert.id))) {
            data.notifications.unshift({
                ...alert,
                read: false
            });
        }
    });

    saveData();
}


function updateNotificationCount() {
    const count = data.notifications.filter(item => !item.read).length;
    $("#notificationCount").textContent = count;
    $("#notificationCount").style.display = count ? "inline-block" : "none";
}


function renderNotifications() {

    generateAlerts();

    const unread = data.notifications.filter(item => !item.read).length;

    $("#notifications").innerHTML = `
        <div class="page-intro">
            <div>
                <div class="eyebrow">BIZNEXUS / ALERT CENTER</div>
                <h1>Notifications</h1>
                <p>You have ${unread} unread notifications.</p>
            </div>
            <button class="primary-btn" id="readAllBtn">Mark All as Read</button>
        </div>

        <div class="table-panel">
            ${data.notifications.length
                ? data.notifications.map(item => `
                    <div class="notification-card">
                        <div class="activity-icon">${item.read ? "✓" : "!"}</div>
                        <div>
                            <strong>${escapeHTML(item.title)}</strong>
                            <p>${escapeHTML(item.message)}</p>
                            <small>${escapeHTML(item.time)}</small>
                        </div>
                        ${item.read ? "" : `<button class="text-btn" data-read="${escapeHTML(item.id)}">Mark Read</button>`}
                    </div>
                `).join("")
                : `<div class="empty-message">No notifications available.</div>`
            }
        </div>
    `;

    $("#readAllBtn").addEventListener("click", () => {
        data.notifications.forEach(item => item.read = true);
        saveData();
        renderNotifications();
        showToast("All notifications marked as read.");
    });

    $("#notifications").querySelectorAll("[data-read]").forEach(button => {
        button.addEventListener("click", () => {
            const item = data.notifications.find(
                notification => String(notification.id) === button.dataset.read
            );

            if (item) item.read = true;

            saveData();
            renderNotifications();
            updateNotificationCount();
        });
    });
}


/* 12. SETTINGS */

function renderSettings() {

    $("#settings").innerHTML = `
        <div class="page-intro">
            <div>
                <div class="eyebrow">BIZNEXUS / PREFERENCES</div>
                <h1>Settings</h1>
                <p>Manage your workspace preferences.</p>
            </div>
        </div>

        <div class="settings-card">
            <h3>Appearance</h3>
            <p>Customize how your business workspace looks.</p>

            <div class="setting-row">
                <div>
                    <strong>Dark Mode</strong>
                    <small>Switch between light and dark appearance.</small>
                </div>
                <input type="checkbox" id="darkSetting" ${document.body.classList.contains("dark") ? "checked" : ""}>
            </div>
        </div>

        <div class="settings-card">
            <h3>Profile Information</h3>
            <p>Administrator workspace details.</p>

            <div class="setting-row">
                <div>
                    <strong>Name</strong>
                    <small>Malaika Ramzan</small>
                </div>
            </div>

            <div class="setting-row">
                <div>
                    <strong>Role</strong>
                    <small>Administrator</small>
                </div>
            </div>

            <div class="setting-row">
                <div>
                    <strong>Organization</strong>
                    <small>Acme Corporation (Demo)</small>
                </div>
            </div>
        </div>

        <div class="settings-card">
            <h3>Data Management</h3>
            <p>Reset the demonstration records to their original sample values.</p>
            <button class="secondary-btn" id="resetDataBtn">Reset Demo Data</button>
        </div>
    `;

    $("#darkSetting").addEventListener("change", event => {
        setTheme(event.target.checked);
    });

    $("#resetDataBtn").addEventListener("click", () => {
        if (!confirm("Reset all records to original demonstration data?")) return;

        data = JSON.parse(JSON.stringify(defaultData));
        saveData();

        renderDashboard();
        renderSettings();

        showToast("Demo data restored successfully.");
    });
}


/* 13. THEME SWITCHER */

function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    try {
        localStorage.setItem("bizNexusTheme", isDark ? "dark" : "light");
    } catch (error) {
        console.error("Theme saving error:", error);
    }

    $("#themeToggle").textContent = isDark ? "☀" : "☾";

    const setting = $("#darkSetting");
    if (setting) setting.checked = isDark;
}


function loadTheme() {
    let theme = "light";

    try {
        theme = localStorage.getItem("bizNexusTheme") || "light";
    } catch (error) {
        console.error("Theme loading error:", error);
    }

    setTheme(theme === "dark");
}


$("#themeToggle").addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark"));
});


/* 14. QUICK ADD */

$("#quickAddBtn").addEventListener("click", () => {

    const options = [
        "Employee",
        "Customer",
        "Project",
        "Task",
        "Inventory"
    ];

    const choice = prompt(
        "What would you like to add?\n\n" +
        options.map((item, index) => `${index + 1}. ${item}`).join("\n") +
        "\n\nEnter a number from 1 to 5:"
    );

    if (choice === null) return;

    const selected = Number(choice);

    if (!Number.isInteger(selected) || selected < 1 || selected > 5) {
        showToast("Please select a valid option.");
        return;
    }

    const page = ["employees", "customers", "projects", "tasks", "inventory"][selected - 1];

    navigateTo(page);
    openModal(page);
});


/* 15. MOBILE SIDEBAR */

$("#menuToggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
});

document.addEventListener("click", event => {
    const sidebar = $("#sidebar");

    if (
        window.innerWidth <= 850 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !event.target.closest("#menuToggle")
    ) {
        sidebar.classList.remove("open");
    }
});


/* 16. DATE */

function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function displayDate() {
    $("#currentDate").textContent = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date());
}


/* 17. INITIALIZATION */

function initializeApp() {

    displayDate();
    loadTheme();

    generateAlerts();

    renderDashboard();
    updateNotificationCount();

    navigateTo("dashboard");

    console.log("BizNexus initialized successfully.");
}

initializeApp();


/* =========================================
   END OF BIZNEXUS JAVASCRIPT
========================================= */
