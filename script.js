document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    enableDragAndDrop();
});

// Function to enable drag-and-drop
function enableDragAndDrop() {
    const columns = document.querySelectorAll('.task-list');

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            if (draggingTask) {
                column.appendChild(draggingTask);
            }
        });

        column.addEventListener('drop', () => {
            saveTasksToLocalStorage();
        });
    });
}

// Function to create a new task element
function createTaskElement(taskText) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;

    // Task Content
    const taskTextElement = document.createElement('span');
    taskTextElement.textContent = taskText;

    // Buttons Container
    const taskButtons = document.createElement('div');
    taskButtons.className = 'task-buttons';

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✖';
    deleteBtn.onclick = () => {
        task.remove();
        saveTasksToLocalStorage();
    };

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
        const newText = prompt("Edit task:", taskTextElement.textContent);
        if (newText) {
            taskTextElement.textContent = newText;
            saveTasksToLocalStorage();
        }
    };

    // Append elements
    taskButtons.appendChild(editBtn);
    taskButtons.appendChild(deleteBtn);
    task.appendChild(taskTextElement);
    task.appendChild(taskButtons);

    // Drag Events
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        saveTasksToLocalStorage();
    });

    return task;
}

// Function to add a new task
function addTask(columnId) {
    const taskText = prompt("Enter task:");
    if (!taskText) return;

    const task = createTaskElement(taskText);
    document.getElementById(columnId).appendChild(task);

    enableDragAndDrop();
    saveTasksToLocalStorage();
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    const tasksData = {};
    document.querySelectorAll('.task-list').forEach(list => {
        const columnId = list.id;
        const tasks = [...list.children].map(task => task.querySelector('span').textContent);
        tasksData[columnId] = tasks;
    });

    localStorage.setItem('kanbanTasks', JSON.stringify(tasksData));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
    const tasksData = JSON.parse(localStorage.getItem('kanbanTasks')) || {};

    Object.keys(tasksData).forEach(columnId => {
        tasksData[columnId].forEach(taskText => {
            const task = createTaskElement(taskText);
            document.getElementById(columnId).appendChild(task);
        });
    });

    enableDragAndDrop();
}
