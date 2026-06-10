const taskInput = document.getElementById('input_field');
const addTaskBtn = document.getElementById('add_tasks');
const activeTasksList = document.getElementById('active_tasks');
const completedTasksList = document.getElementById('completed_tasks');

let tasks = [];

function renderTasks() {
    // Clear both lists to prevent re-adding old items
    activeTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.text;
        // Add the task's unique ID to the element for future reference
        listItem.dataset.id = task.id;

        if (task.completed) {
            completedTasksList.appendChild(listItem);
        } else {
            activeTasksList.appendChild(listItem);
        }
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        createdAt: new Date().toLocaleString(),
        completed: false,
        completedAt: null,
        note: null,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks from localStorage and display them when the page first loads
loadTasks();