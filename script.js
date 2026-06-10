const taskInput = document.getElementById('input_field');
const addTaskBtn = document.getElementById('add_button');
const activeTasksList = document.getElementById('active_tasks');
const completedTasksList = document.getElementById('completed_tasks');

let tasks = [];
let archivedTasks = [];

function renderTasks() {
    // Clear both lists to prevent re-adding old items
    activeTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id;

        // Display task text and creation date
        const textNode = document.createTextNode(`${task.text} `);
        listItem.appendChild(textNode);

        const createdAtSpan = document.createElement('small');
        createdAtSpan.textContent = `(Created: ${task.createdAt})`;
        listItem.appendChild(createdAtSpan);

        if (task.completed) {
            listItem.classList.add('task-completed');
            const metaDiv = document.createElement('div');
            metaDiv.className = 'task-meta';
            let metaText = `Completed: ${task.completedAt}`;
            if (task.note) {
                metaText += ` | Note: ${task.note}`;
            }
            metaDiv.textContent = metaText;
            listItem.appendChild(metaDiv);
        } else {
            // Add "Done" button for active tasks
            const doneButton = document.createElement('button');
            doneButton.textContent = 'Done';
            doneButton.addEventListener('click', () => completeTask(task.id));
            listItem.appendChild(doneButton);
        }
        // All tasks are rendered in the active list as per spec
        activeTasksList.appendChild(listItem);
    });

    // Render archived tasks into the completed list
    archivedTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id;
        listItem.classList.add('task-completed');

        const textNode = document.createTextNode(`${task.text} `);
        listItem.appendChild(textNode);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'task-meta';
        let metaText = `Completed: ${task.completedAt}`;
        if (task.note) { metaText += ` | Note: ${task.note}`; }
        metaDiv.textContent = metaText;
        listItem.appendChild(metaDiv);
        completedTasksList.appendChild(listItem);
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

function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const note = prompt("How did it go? (optional)");

    task.completed = true;
    task.completedAt = new Date().toLocaleString();
    task.note = note;

    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function checkWeeklyReset() {
    const currentWeek = getWeekNumber(new Date());
    const lastKnownWeek = localStorage.getItem('lastKnownWeek');

    if (!lastKnownWeek) {
        localStorage.setItem('lastKnownWeek', currentWeek);
        return;
    }

    if (parseInt(lastKnownWeek) !== currentWeek) {
        const completedThisWeek = tasks.filter(task => task.completed);
        tasks = tasks.filter(task => !task.completed);

        archivedTasks.push(...completedThisWeek);
        localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));

        saveTasks(); // Saves the newly filtered active tasks
        localStorage.setItem('lastKnownWeek', currentWeek);
    }
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedArchived = localStorage.getItem('archivedTasks');

    if (savedTasks) { tasks = JSON.parse(savedTasks); }
    if (savedArchived) { archivedTasks = JSON.parse(savedArchived); }
    
    checkWeeklyReset();
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