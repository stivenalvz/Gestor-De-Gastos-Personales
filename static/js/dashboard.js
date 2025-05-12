/**
 * Global variables for charts
 */
let incomeExpenseChart = null;
let categoriesChart = null;
let incomeEvolutionChart = null;
let incomeCategoriesChart = null;
let expenseEvolutionChart = null;
let expenseCategoriesChart = null;

// Color palette by category name
const CATEGORY_COLORS = {
    "Food": "#0d6efd",
    "Transportation": "#ffc107",
    "Housing": "#20c997",
    "Health": "#6610f2",
    "Education": "#fd7e14",
    "Entertainment": "#6c757d",
    "Utilities": "#0dcaf0",
    "Debts": "#d63384",
    "Savings": "#6f42c1",
    "Pets": "#e83e8c",
    "Insurance": "#198754",
    "Other": "#343a40"
    // Add all your categories here
};
function getCategoryColor(name) {
    return CATEGORY_COLORS[name] || "#adb5bd"; // gray if not defined
}

// Define the global color palette
const COLOR_PALETTE = {
    // Main colors
    income: '#198754',  // Green
    expense: '#dc3545', // Red
    
    // Palette for categories
    categories: [
        '#0d6efd',  // Blue
        '#ffc107',  // Yellow
        '#20c997',  // Aqua green
        '#6610f2',  // Purple
        '#fd7e14',  // Orange
        '#6c757d',  // Gray
        '#0dcaf0',  // Cyan
        '#d63384',  // Pink
        '#6f42c1',  // Indigo
        '#e83e8c',  // Dark pink
        '#198754',  // Green
        '#0dcaf0'   // Cyan
    ]
};

/**
 * INITIALIZATION AND CONFIGURATION FUNCTIONS
 */

/**
 * Initializes the income vs expense and categories charts
 */
function initCharts() {
    const ctxIncomeExpense = document.getElementById('income-expense-chart').getContext('2d');
    const ctxCategories = document.getElementById('categories-chart').getContext('2d');

    // Income vs Expense Chart
    incomeExpenseChart = new Chart(ctxIncomeExpense, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [],
                backgroundColor: [COLOR_PALETTE.income, COLOR_PALETTE.expense]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    // Categories Chart
    categoriesChart = new Chart(ctxCategories, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: COLOR_PALETTE.categories
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initHistoricalCharts() {
    // Gráfica de evolución de ingresos
    const incomeHistoryCtx = document.getElementById('income-history-chart');
    if (incomeHistoryCtx) {
        incomeEvolutionChart = new Chart(incomeHistoryCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: COLOR_PALETTE.income,
                    backgroundColor: COLOR_PALETTE.income + '20',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfica de evolución de gastos
    const expenseHistoryCtx = document.getElementById('expense-history-chart');
    if (expenseHistoryCtx) {
        expenseEvolutionChart = new Chart(expenseHistoryCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Expenses',
                    data: [],
                    borderColor: COLOR_PALETTE.expense,
                    backgroundColor: COLOR_PALETTE.expense + '20',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfica de categorías de ingresos
    const incomeCategoriesCtx = document.getElementById('income-categories-chart');
    if (incomeCategoriesCtx) {
        incomeCategoriesChart = new Chart(incomeCategoriesCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: COLOR_PALETTE.categories
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfica de categorías de gastos
    const expenseCategoriesCtx = document.getElementById('expense-categories-chart');
    if (expenseCategoriesCtx) {
        expenseCategoriesChart = new Chart(expenseCategoriesCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: COLOR_PALETTE.categories
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * NAVIGATION AND UI FUNCTIONS
 */

/**
 * Handles switching between dashboard sections
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initCharts();
    initHistoricalCharts();
    initIncomeCharts();
    initExpenseCharts();
    
    // Load initial data
    loadDashboard();
    
    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(s => s.classList.add('d-none'));
            
            // Show selected section
            document.getElementById(`${section}-section`).classList.remove('d-none');
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Load section data
            if (section === 'income') {
                loadIncome(1);
                loadIncomeCharts();
            } else if (section === 'expenses') {
                loadExpenses(1);
                loadExpenseCharts();
            } else if (section === 'dashboard') {
                loadDashboard();
            }
        });
    });
    
    // Handle logout
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Establecer fecha por defecto al abrir el modal
    const newTransactionModal = document.getElementById('newTransactionModal');
    if (newTransactionModal) {
        newTransactionModal.addEventListener('show.bs.modal', async function() {
            // Establecer la fecha actual en el campo de fecha
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transactionDate').value = today;
            
            // Cargar las categorías
            await loadCategories();
        });
    }

    // Configurar los botones de nueva transacción
    const newIncomeBtn = document.querySelector('[data-bs-target="#newTransactionModal"][data-type="income"]');
    const newExpenseBtn = document.querySelector('[data-bs-target="#newTransactionModal"][data-type="expense"]');
    const newTransactionBtn = document.querySelector('[data-bs-target="#newTransactionModal"]:not([data-type])');

    if (newIncomeBtn) {
        newIncomeBtn.addEventListener('click', () => {
            document.getElementById('transactionType').value = 'income';
        });
    }

    if (newExpenseBtn) {
        newExpenseBtn.addEventListener('click', () => {
            document.getElementById('transactionType').value = 'expense';
        });
    }

    // Manejo del formulario de nueva transacción
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
            
            try {
                const formData = {
                    type: document.getElementById('transactionType').value,
                    amount: parseFloat(document.getElementById('transactionAmount').value),
                    category_id: document.getElementById('categoryTransaction').value,
                    description: document.getElementById('transactionDescription').value,
                    date: document.getElementById('transactionDate').value
                };

                console.log('Enviando datos:', formData); // Para depuración

                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Error saving transaction');
                }

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newTransactionModal'));
                modal.hide();

                // Limpiar el formulario
                transactionForm.reset();

                // Determinar la sección activa y actualizar la vista
                const activeSection = document.querySelector('.content-section:not(.d-none)');
                if (activeSection) {
                    if (activeSection.id === 'income-section') {
                        await loadIncome(1);
                        await loadIncomeCharts();
                        await loadDashboard(); // Actualizar también el dashboard
                    } else if (activeSection.id === 'expenses-section') {
                        await loadExpenses(1);
                        await loadExpenseCharts();
                        await loadDashboard(); // Actualizar también el dashboard
                    } else {
                        await loadDashboard();
                    }
                } else {
                    await loadDashboard();
                }

                // Mostrar mensaje de éxito
                showMessage('Transaction saved successfully', 'success');

            } catch (error) {
                console.error('Error:', error);
                showError('Error saving transaction: ' + error.message);
            }
        });
    }

    // Agregar evento al botón de confirmación de eliminación
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            const id = this.getAttribute('data-transaction-id');
            if (id) {
                await deleteTransactionConfirmed(id);
            }
        });
    }

    // Agregar evento submit al formulario de edición
    const editTransactionForm = document.getElementById('editTransactionForm');
    if (editTransactionForm) {
        editTransactionForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await saveTransactionEdit(event);
        });
    }

    // Agregar evento al botón de cerrar sesión
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Mostrar el modal de confirmación
            const modal = new bootstrap.Modal(document.getElementById('confirmLogoutModal'));
            modal.show();
        });
    }

    // Agregar evento al botón de confirmación de cierre de sesión
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Cerrar el modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmLogoutModal'));
                    modal.hide();
                    // Redirigir al login
                    window.location.href = '/';
                } else {
                    throw new Error('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                showError('Error al cerrar sesión');
            }
        });
    }

    // Actualizar los gráficos históricos
    updateIncomeHistoryChart();
    updateExpensesHistoryChart();
});

/**
 * DATA HANDLING AND CHART UPDATE FUNCTIONS
 */

/**
 * Updates the income vs expense chart with new data
 * @param {Array} data - Array with income and expense per month
 */
function updateIncomeExpenseChart(data) {
    if (!incomeExpenseChart) {
        console.error('The income vs expense chart is not initialized');
        return;
    }

    // Obtener los totales del resumen
    const totalIncome = parseFloat(document.getElementById('monthly-income').textContent) || 0;
    const totalExpense = parseFloat(document.getElementById('monthly-expenses').textContent) || 0;

    // Actualizar los datos del gráfico
    incomeExpenseChart.data.datasets[0].data = [totalIncome, totalExpense];
    incomeExpenseChart.update();
}

/**
 * Updates the categories chart with new data
 * @param {Array} data - Array of data with totals per category
 */
function updateCategoriesChart(data) {
    if (!categoriesChart) return;
    if (!data || data.length === 0) {
        categoriesChart.data.labels = [];
        categoriesChart.data.datasets[0].data = [];
        categoriesChart.update();
        return;
    }
    const filteredData = data.filter(d => parseFloat(d.total) > 0);
    const labels = filteredData.map(d => d.name);
    const values = filteredData.map(d => parseFloat(d.total));
    const colors = labels.map(name => getCategoryColor(name));
    categoriesChart.data.labels = labels;
    categoriesChart.data.datasets[0].data = values;
    categoriesChart.data.datasets[0].backgroundColor = colors;
    categoriesChart.update();
}

/**
 * Updates the categories chart with fresh data from the API
 */
async function updateCategoriesChartFromAPI() {
    try {
        const response = await fetch('/api/summary');
        const data = await handleResponse(response, 'Error loading categories chart data');
        if (!data) return;

        // Update the categories chart with the new data
        updateCategoriesChart(data.category_expenses || []);
    } catch (error) {
        console.error('Error updating categories chart:', error);
    }
}

/**
 * Updates the income history chart with new data
 */
async function updateIncomeHistoryChart() {
    try {
        const response = await fetch('/api/income/history');
        const data = await handleResponse(response, 'Error loading income history');
        if (!data) return;

        updateIncomeEvolutionChart(data);
    } catch (error) {
        console.error('Error updating income history chart:', error);
    }
}

/**
 * Updates the expenses history chart with new data
 */
async function updateExpensesHistoryChart() {
    try {
        const response = await fetch('/api/expenses/history');
        const data = await handleResponse(response, 'Error loading expenses history');
        if (!data) return;

        updateExpenseEvolutionChart(data);
    } catch (error) {
        console.error('Error updating expenses history chart:', error);
    }
}

/**
 * Updates the income evolution chart with new data
 * @param {Array} data - Array with income data per month
 */
function updateIncomeEvolutionChart(data) {
    if (!incomeEvolutionChart) return;
    
    if (!data || data.length === 0) {
        incomeEvolutionChart.data.labels = [];
        incomeEvolutionChart.data.datasets[0].data = [];
        incomeEvolutionChart.update();
        return;
    }

    const labels = data.map(d => d.month);
    const values = data.map(d => parseFloat(d.total));

    incomeEvolutionChart.data.labels = labels;
    incomeEvolutionChart.data.datasets[0].data = values;
    incomeEvolutionChart.update();
}

/**
 * Updates the expense evolution chart with new data
 * @param {Array} data - Array with expense data per month
 */
function updateExpenseEvolutionChart(data) {
    if (!expenseEvolutionChart) return;
    
    if (!data || data.length === 0) {
        expenseEvolutionChart.data.labels = [];
        expenseEvolutionChart.data.datasets[0].data = [];
        expenseEvolutionChart.update();
        return;
    }

    const labels = data.map(d => d.month);
    const values = data.map(d => parseFloat(d.total));

    expenseEvolutionChart.data.labels = labels;
    expenseEvolutionChart.data.datasets[0].data = values;
    expenseEvolutionChart.update();
}

/**
 * FUNCIONES DE CARGA DE DATOS
 */

/**
 * Loads the dashboard data from the server
 */
async function loadDashboard() {
    try {
        const response = await fetch('/api/summary');
        const data = await handleResponse(response, 'Error loading dashboard');
        if (!data) return;
        
        // Update summary cards
        document.getElementById('total-balance').textContent = data.total_balance.toFixed(2);
        document.getElementById('monthly-income').textContent = data.incomes_month.toFixed(2);
        document.getElementById('monthly-expenses').textContent = data.expenses_month.toFixed(2);
        document.getElementById('monthly-savings').textContent = data.savings_month.toFixed(2);
        
        // Update charts
        if (data.graph_data && data.graph_data.length > 0) {
            updateIncomeExpenseChart(data.graph_data);
        }
        
        // Filtrar categorías de gastos con valor mayor a 0
        const filteredExpenses = (data.category_expenses || []).filter(expense => parseFloat(expense.total) > 0);
        if (filteredExpenses.length > 0) {
            updateCategoriesChart(filteredExpenses);
        }
        
        // Actualizar top 3 gastos en el dashboard
        const topExpensesDiv = document.getElementById('dashboard-top-expenses');
        if (topExpensesDiv) {
            if (filteredExpenses.length > 0) {
                const top3 = filteredExpenses.slice(0, 3);
                let html = '<h6 class="mb-2">Top 3 Expenses:</h6>';
                top3.forEach((dato, index) => {
                    const color = getCategoryColor(dato.name);
                    html += `<p class="mb-1">
                        <span class="badge me-2" style="background-color: ${color}">
                            ${index + 1}°
                        </span>
                        ${dato.name}: $${dato.total.toFixed(2)}
                    </p>`;
                });
                topExpensesDiv.innerHTML = html;
            } else {
                topExpensesDiv.innerHTML = '';
            }
        }
        
        // Load the first page of transactions
        await loadTransactions(1);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Error loading dashboard data');
    }
}

/**
 * Loads categories from the server and adds them to the selectors
 */
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
            throw new Error('No data received from server');
        }

        const categorySelect = document.getElementById('categoryTransaction');
        const editCategorySelect = document.getElementById('editCategoryTransaction');
        
        if (!categorySelect || !editCategorySelect) {
            console.error('Category select elements not found');
            return;
        }
        
        // Limpiar opciones existentes
        categorySelect.innerHTML = '';
        editCategorySelect.innerHTML = '';
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a category';
        categorySelect.appendChild(defaultOption);
        editCategorySelect.appendChild(defaultOption.cloneNode(true));
        
        // Agregar categorías
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            option.setAttribute('data-type', category.type);
            
            const optionEdit = option.cloneNode(true);
            categorySelect.appendChild(option);
            editCategorySelect.appendChild(optionEdit);
        });

        // Agregar evento para filtrar categorías según el tipo de transacción
        const transactionType = document.getElementById('transactionType');
        const editTransactionType = document.getElementById('editTransactionType');

        function filterCategories(type, select) {
            if (!select) return;
            
            Array.from(select.options).forEach(option => {
                if (option.value === '') return; // Mantener la opción por defecto
                const categoryType = option.getAttribute('data-type');
                option.style.display = categoryType === type ? '' : 'none';
            });
            
            // Seleccionar la primera categoría visible
            const visibleOptions = Array.from(select.options).filter(option => 
                option.style.display !== 'none' && option.value !== ''
            );
            if (visibleOptions.length > 0) {
                select.value = visibleOptions[0].value;
            } else {
                select.value = '';
            }
        }

        if (transactionType) {
            transactionType.addEventListener('change', () => {
                filterCategories(transactionType.value, categorySelect);
            });
            // Filtrar categorías inicialmente
            filterCategories(transactionType.value, categorySelect);
        }

        if (editTransactionType) {
            editTransactionType.addEventListener('change', () => {
                filterCategories(editTransactionType.value, editCategorySelect);
            });
            // Filtrar categorías inicialmente
            filterCategories(editTransactionType.value, editCategorySelect);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('Error loading categories: ' + error.message);
    }
}

/**
 * Loads transactions from the server
 * @param {number} page - Page number to load
 */
async function loadTransactions(page = 1) {
    try {
        const response = await fetch(`/api/transactions?page=${page}`);
        const data = await handleResponse(response, 'Error loading transactions');
        if (!data) return;

        const transactionsContainer = document.getElementById('transactions-container');
        transactionsContainer.innerHTML = '';

        if (data.transactions.length === 0) {
            transactionsContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No transactions recorded
                    </td>
                </tr>
            `;
            return;
        }

        // Create rows for each transaction
        data.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>${transaction.category}</td>
                <td>$${parseFloat(transaction.amount).toFixed(2)}</td>
                <td>
                    <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
                        ${transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTransaction(${transaction.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            transactionsContainer.appendChild(row);
        });

        // Update pagination
        updatePagination(page, data.pages);
    } catch (error) {
        console.error('Error loading transactions:', error);
        showError('Error loading transactions');
    }
}

/**
 * TRANSACTION HANDLING FUNCTIONS
 */

/**
 * Opens the edit modal with transaction data
 * @param {number} id - ID of the transaction to edit
 */
async function editTransaction(id) {
    try {
        console.log('Editing transaction:', id); // Debug log

        // Get transaction data
        const response = await fetch(`/api/transactions/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Transaction data:', data); // Debug log
        
        if (!data) {
            throw new Error('No data received from server');
        }

        // Fill form with data
        document.getElementById('editTransactionId').value = id;
        document.getElementById('editTransactionType').value = data.type;
        document.getElementById('editTransactionAmount').value = data.amount;
        document.getElementById('editCategoryTransaction').value = data.category_id;
        document.getElementById('editTransactionDescription').value = data.description || '';
        document.getElementById('editTransactionDate').value = data.date;

        // Filter categories based on transaction type
        const categorySelect = document.getElementById('editCategoryTransaction');
        Array.from(categorySelect.options).forEach(option => {
            if (option.value === '') return; // Keep default option
            const categoryType = option.getAttribute('data-type');
            option.style.display = categoryType === data.type ? '' : 'none';
        });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading transaction data:', error);
        showError('Error loading transaction data: ' + error.message);
    }
}

/**
 * Saves changes to an edited transaction
 * @param {Event} event - Form event
 */
async function saveTransactionEdit(event) {
    event.preventDefault();

    const id = document.getElementById('editTransactionId').value;
    if (!id) {
        showError('Error: Transaction ID not found');
        return;
    }

    try {
        const formData = {
            type: document.getElementById('editTransactionType').value,
            amount: parseFloat(document.getElementById('editTransactionAmount').value),
            category_id: parseInt(document.getElementById('editCategoryTransaction').value),
            description: document.getElementById('editTransactionDescription').value,
            date: document.getElementById('editTransactionDate').value
        };

        console.log('Saving transaction edit:', formData); // Debug log

        const response = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
        modal.hide();
        
        // Determine current section and update view
        const activeSection = document.querySelector('.content-section:not(.d-none)');
        if (activeSection) {
            if (activeSection.id === 'income-section') {
                await loadIncome(1);
                await loadIncomeCharts();
            } else if (activeSection.id === 'expenses-section') {
                await loadExpenses(1);
                await loadExpenseCharts();
            } else {
                await loadDashboard();
            }
        }
        
        showMessage('Transaction updated successfully', 'success');
    } catch (error) {
        console.error('Error updating transaction:', error);
        showError('Error updating transaction: ' + error.message);
    }
}

/**
 * FUNCIONES DE UTILIDAD
 */

/**
 * Verifies and handles the server response
 * @param {Response} response - Server response
 * @param {string} errorMessage - Default error message
 * @returns {Promise} - Response data or null if there's an error
 */
async function handleResponse(response, errorMessage) {
    if (response.redirected) {
        window.location.href = response.url;
        return null;
    }
    
    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = '/login';
            return null;
        }
        throw new Error(`${errorMessage}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
    }

    return await response.json();
}

/**
 * Muestra un mensaje de error en el dashboard
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    const errorHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const dashboardSection = document.getElementById('dashboard-section');
    dashboardSection.insertAdjacentHTML('afterbegin', errorHtml);
}

/**
 * Muestra un mensaje de éxito en la sección actual
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, warning, etc)
 */
function showMessage(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Encontrar la sección activa
    const activeSection = document.querySelector('.content-section:not(.d-none)');
    if (activeSection) {
        activeSection.insertAdjacentHTML('afterbegin', alertHtml);
        
        if (type === 'success') {
            setTimeout(() => {
                const alert = activeSection.querySelector('.alert-success');
                if (alert) {
                    alert.remove();
                }
            }, 5000);
        }
    }
}

/**
 * Updates the pagination of transactions
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @param {HTMLElement} paginationContainer - Container element for pagination
 * @param {Function} loadFunction - Function to call when page changes
 */
function updatePagination(currentPage, totalPages, paginationContainer = document.getElementById('transactions-pagination'), loadFunction = loadTransactions) {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="javascript:void(0)" aria-label="Previous" onclick="event.preventDefault(); ${loadFunction.name}(${currentPage - 1})">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    paginationContainer.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="javascript:void(0)" onclick="event.preventDefault(); ${loadFunction.name}(${i})">${i}</a>
        `;
        paginationContainer.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="javascript:void(0)" aria-label="Next" onclick="event.preventDefault(); ${loadFunction.name}(${currentPage + 1})">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    paginationContainer.appendChild(nextLi);
}

/**
 * Shows a message when there are no records
 */
function showNoRecordsMessage() {
    const messageHtml = `
        <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            No transactions recorded. Start recording your income and expenses!
        </div>
    `;
    
    const dashboardSection = document.getElementById('dashboard-section');
    dashboardSection.insertAdjacentHTML('afterbegin', messageHtml);
}

/**
 * Abre el modal de confirmación de eliminación
 * @param {number} id - ID de la transacción a eliminar
 */
function deleteTransaction(id) {
    // Guardar el ID en el botón de confirmación
    document.getElementById('confirmDelete').setAttribute('data-transaction-id', id);
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

/**
 * Deletes a transaction after confirmation
 * @param {number} id - ID of the transaction to delete
 */
async function deleteTransactionConfirmed(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
        });

        const data = await handleResponse(response, 'Error deleting transaction');
        
        if (data) {
            // Close confirmation modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
            modal.hide();
            
            // Determine current section and update view
            const activeSection = document.querySelector('.content-section:not(.d-none)');
            if (activeSection) {
                if (activeSection.id === 'income-section') {
                    await loadIncome(1);
                    await loadDashboard();
                } else if (activeSection.id === 'expenses-section') {
                    await loadExpenses(1);
                    await loadDashboard();
                } else {
                    await loadDashboard();
                }
            }
            
            showMessage('Transaction deleted successfully', 'success');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showError('Error deleting transaction: ' + error.message);
    }
}

// Función para cargar las gráficas de ingresos
async function loadIncomeCharts() {
    try {
        // Cargar datos de ingresos
        const response = await fetch('/api/income/history');
        const data = await handleResponse(response, 'Error loading income history');
        if (!data) return;

        // Gráfica de evolución
        if (incomeEvolutionChart) {
            const labels = data.map(d => d.month);
            const values = data.map(d => parseFloat(d.total));
            
            incomeEvolutionChart.data.labels = labels;
            incomeEvolutionChart.data.datasets[0].data = values;
            incomeEvolutionChart.update();
        }

        // Cargar datos de resumen para categorías
        const summaryResponse = await fetch('/api/summary');
        const summaryData = await handleResponse(summaryResponse, 'Error loading summary data');
        if (!summaryData) return;

        // Gráfica de categorías
        if (incomeCategoriesChart) {
            const incomeCategories = summaryData.category_incomes || [];
            const filteredCategories = incomeCategories.filter(c => parseFloat(c.total) > 0);

            if (filteredCategories.length > 0) {
                const catLabels = filteredCategories.map(c => c.name);
                const catValues = filteredCategories.map(c => parseFloat(c.total));
                const catColors = catLabels.map(name => getCategoryColor(name));
                
                incomeCategoriesChart.data.labels = catLabels;
                incomeCategoriesChart.data.datasets[0].data = catValues;
                incomeCategoriesChart.data.datasets[0].backgroundColor = catColors;
                incomeCategoriesChart.update();
            } else {
                incomeCategoriesChart.data.labels = [];
                incomeCategoriesChart.data.datasets[0].data = [];
                incomeCategoriesChart.update();
            }
        }

        // Top 3 ingresos
        const topDiv = document.getElementById('top-income');
        if (topDiv) {
            if (summaryData.category_incomes && summaryData.category_incomes.length > 0) {
                const top3 = summaryData.category_incomes
                    .filter(income => parseFloat(income.total) > 0)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3);

                if (top3.length > 0) {
                    let html = '<h6 class="mb-2">Top 3 Incomes:</h6>';
                    top3.forEach((dato, index) => {
                        const color = getCategoryColor(dato.name);
                        html += `<p class="mb-1">
                            <span class="badge me-2" style="background-color: ${color}">
                                ${index + 1}°
                            </span>
                            ${dato.name}: $${dato.total.toFixed(2)}
                        </p>`;
                    });
                    topDiv.innerHTML = html;
                } else {
                    topDiv.innerHTML = '';
                }
            } else {
                topDiv.innerHTML = '';
            }
        }
    } catch (error) {
        console.error('Error loading income charts:', error);
        showError('Error loading income charts');
    }
}

// Función para cargar las gráficas de gastos
async function loadExpenseCharts() {
    try {
        // Cargar datos de gastos
        const response = await fetch('/api/expenses/history');
        const data = await handleResponse(response, 'Error loading expenses history');
        if (!data) return;

        // Gráfica de evolución
        if (expenseEvolutionChart) {
            const labels = data.map(d => d.month);
            const values = data.map(d => parseFloat(d.total));
            
            expenseEvolutionChart.data.labels = labels;
            expenseEvolutionChart.data.datasets[0].data = values;
            expenseEvolutionChart.update();
        }

        // Cargar datos de resumen para categorías
        const summaryResponse = await fetch('/api/summary');
        const summaryData = await handleResponse(summaryResponse, 'Error loading summary data');
        if (!summaryData) return;

        // Gráfica de categorías
        if (expenseCategoriesChart) {
            const expenseCategories = summaryData.category_expenses || [];
            const filteredCategories = expenseCategories.filter(c => parseFloat(c.total) > 0);

            if (filteredCategories.length > 0) {
                const catLabels = filteredCategories.map(c => c.name);
                const catValues = filteredCategories.map(c => parseFloat(c.total));
                const catColors = catLabels.map(name => getCategoryColor(name));
                
                expenseCategoriesChart.data.labels = catLabels;
                expenseCategoriesChart.data.datasets[0].data = catValues;
                expenseCategoriesChart.data.datasets[0].backgroundColor = catColors;
                expenseCategoriesChart.update();
            } else {
                expenseCategoriesChart.data.labels = [];
                expenseCategoriesChart.data.datasets[0].data = [];
                expenseCategoriesChart.update();
            }
        }

        // Top 3 gastos
        const topDiv = document.getElementById('expenses-top-expenses');
        if (topDiv) {
            if (summaryData.category_expenses && summaryData.category_expenses.length > 0) {
                const top3 = summaryData.category_expenses
                    .filter(expense => parseFloat(expense.total) > 0)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3);

                if (top3.length > 0) {
                    let html = '<h6 class="mb-2">Top 3 Expenses:</h6>';
                    top3.forEach((dato, index) => {
                        const color = getCategoryColor(dato.name);
                        html += `<p class="mb-1">
                            <span class="badge me-2" style="background-color: ${color}">
                                ${index + 1}°
                            </span>
                            ${dato.name}: $${dato.total.toFixed(2)}
                        </p>`;
                    });
                    topDiv.innerHTML = html;
                } else {
                    topDiv.innerHTML = '';
                }
            } else {
                topDiv.innerHTML = '';
            }
        }
    } catch (error) {
        console.error('Error loading expense charts:', error);
        showError('Error loading expense charts');
    }
}

/**
 * Loads income transactions from the server
 * @param {number} page - Page number to load
 */
async function loadIncome(page = 1) {
    try {
        console.log('Loading income transactions, page:', page); // Debug log
        const response = await fetch(`/api/transactions?page=${page}&type=income`);
        const data = await handleResponse(response, 'Error loading income transactions');
        if (!data) return;

        const transactionsContainer = document.getElementById('income-transactions-container');
        if (!transactionsContainer) {
            console.error('Income transactions container not found');
            return;
        }

        transactionsContainer.innerHTML = '';

        if (data.transactions.length === 0) {
            transactionsContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No income transactions recorded
                    </td>
                </tr>
            `;
            return;
        }

        // Create rows for each transaction
        data.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>${transaction.category}</td>
                <td>$${parseFloat(transaction.amount).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTransaction(${transaction.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            transactionsContainer.appendChild(row);
        });

        // Update pagination
        const paginationContainer = document.getElementById('income-transactions-pagination');
        if (paginationContainer) {
            updatePagination(page, data.pages, paginationContainer, loadIncome);
        }
    } catch (error) {
        console.error('Error loading income transactions:', error);
        showError('Error loading income transactions');
    }
}

/**
 * Loads expense transactions from the server
 * @param {number} page - Page number to load
 */
async function loadExpenses(page = 1) {
    try {
        console.log('Loading expense transactions, page:', page); // Debug log
        const response = await fetch(`/api/transactions?page=${page}&type=expense`);
        const data = await handleResponse(response, 'Error loading expense transactions');
        if (!data) return;

        const transactionsContainer = document.getElementById('expenses-transactions-container');
        if (!transactionsContainer) {
            console.error('Expense transactions container not found');
            return;
        }

        transactionsContainer.innerHTML = '';

        if (data.transactions.length === 0) {
            transactionsContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No expense transactions recorded
                    </td>
                </tr>
            `;
            return;
        }

        // Create rows for each transaction
        data.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>${transaction.category}</td>
                <td>$${parseFloat(transaction.amount).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTransaction(${transaction.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            transactionsContainer.appendChild(row);
        });

        // Update pagination
        const paginationContainer = document.getElementById('expenses-transactions-pagination');
        if (paginationContainer) {
            updatePagination(page, data.pages, paginationContainer, loadExpenses);
        }
    } catch (error) {
        console.error('Error loading expense transactions:', error);
        showError('Error loading expense transactions');
    }
}

// Función para inicializar las gráficas de ingresos
function initIncomeCharts() {
    // Gráfica de evolución de ingresos (mantener como bar)
    const incomeHistoryCtx = document.getElementById('income-history-chart');
    if (incomeHistoryCtx) {
        if (incomeEvolutionChart) {
            incomeEvolutionChart.destroy();
        }
        
        incomeEvolutionChart = new Chart(incomeHistoryCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    backgroundColor: COLOR_PALETTE.income
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfica de categorías de ingresos (cambiar a doughnut)
    const incomeCategoriesCtx = document.getElementById('income-categories-chart');
    if (incomeCategoriesCtx) {
        if (incomeCategoriesChart) {
            incomeCategoriesChart.destroy();
        }
        
        incomeCategoriesChart = new Chart(incomeCategoriesCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: COLOR_PALETTE.categories
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Función para inicializar las gráficas de gastos
function initExpenseCharts() {
    // Gráfica de evolución de gastos (mantener como bar)
    const expenseHistoryCtx = document.getElementById('expense-history-chart');
    if (expenseHistoryCtx) {
        if (expenseEvolutionChart) {
            expenseEvolutionChart.destroy();
        }
        
        expenseEvolutionChart = new Chart(expenseHistoryCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Expenses',
                    data: [],
                    backgroundColor: COLOR_PALETTE.expense
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfica de categorías de gastos (cambiar a doughnut)
    const expenseCategoriesCtx = document.getElementById('expense-categories-chart');
    if (expenseCategoriesCtx) {
        if (expenseCategoriesChart) {
            expenseCategoriesChart.destroy();
        }
        
        expenseCategoriesChart = new Chart(expenseCategoriesCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: COLOR_PALETTE.categories
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

