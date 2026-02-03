// DOM Elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const categoryBtns = document.querySelectorAll('.category-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Stats Elements
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Initialize tasks array (load from localStorage)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentCategory = 'all';

// Initialize the app
function init() {
    renderTasks();
    updateStats();
    
    // Load tasks from localStorage
    if (tasks.length === 0) {
        // Add some sample tasks for first-time users
        tasks = [
            {
                id: Date.now(),
                text: "Complete Web Development Assignment",
                priority: "high",
                completed: false,
                timestamp: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                text: "Study for Calculus Exam",
                priority: "high",
                completed: false,
                timestamp: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                text: "Buy engineering drawing tools",
                priority: "medium",
                completed: true,
                timestamp: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                text: "Read Physics chapter 5",
                priority: "low",
                completed: false,
                timestamp: new Date().toISOString()
            }
        ];
        saveTasks();
    }
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        timestamp: new Date().toISOString()
    };
    
    tasks.unshift(newTask); // Add to beginning
    saveTasks();
    renderTasks();
    updateStats();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Toggle task completion
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Edit a task
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        
        // Ask for new priority
        const newPriority = prompt('Priority (low/medium/high):', task.priority);
        if (newPriority && ['low', 'medium', 'high'].includes(newPriority.toLowerCase())) {
            task.priority = newPriority.toLowerCase();
        }
        
        saveTasks();
        renderTasks();
    }
}

// Clear all completed tasks
function clearCompletedTasks() {
    if (!confirm('Are you sure you want to clear all completed tasks?')) return;
    
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

// Filter tasks by category
function filterTasks(category) {
    currentCategory = category;
    
    // Update active category button
    categoryBtns.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Render tasks to the DOM
function renderTasks() {
    // Filter tasks based on current category
    let filteredTasks = tasks;
    
    if (currentCategory === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentCategory === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No ${currentCategory === 'all' ? '' : currentCategory} tasks</h3>
                <p>${currentCategory === 'completed' ? 'Complete some tasks to see them here!' : 
                   currentCategory === 'pending' ? 'All tasks are completed!' : 
                   'Add your first task using the input above!'}</p>
            </div>
        `;
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   class="task-checkbox" 
                   ${task.completed ? 'checked' : ''}
                   onchange="toggleTaskCompletion(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="priority-badge priority-${task.priority}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTasks(btn.dataset.category);
    });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);
