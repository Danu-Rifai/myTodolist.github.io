document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
        updateTasksList();
        updateStats();
    }
});

let tasks = [];
let editIndex = null;
let inputEventListener = null;

const saveTask = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        if (editIndex === null) {
            tasks.push({ text: text, completed: false, pinned: false });
        } else {
            tasks[editIndex].text = text;
            editIndex = null;
        }
        updateTasksList();
        taskInput.value = "";
        updateStats();
        saveTask();
    } else if (editIndex !== null) {
        deleteTask(editIndex);
        editIndex = null;
        taskInput.value = ""; // Menghapus teks di input
    }
};

const toggleTaskComplete = (index) => {
    if (tasks[index]) {
        tasks[index].completed = !tasks[index].completed;
        updateTasksList();
        updateStats();
        saveTask();
    }
};

const pinTask = (index) => {
    if (tasks[index]) {
        const task = tasks.splice(index, 1)[0];
        task.pinned = !task.pinned; // Toggle the pinned state

        if (task.pinned) {
            tasks.unshift(task); // Move task to the top
        } else {
            tasks.push(task); // Move task to the bottom
        }

        updateTasksList();
        updateStats();
        saveTask();
    }
};

const deleteTask = (index) => {
    if (index !== null && tasks[index]) {
        tasks.splice(index, 1);
        updateTasksList();
        updateStats();
        saveTask();
        const taskInput = document.getElementById('taskInput');
        if (editIndex !== null && editIndex === index) {
            taskInput.value = ""; // Menghapus teks di input jika item yang sedang diedit dihapus
        }
        editIndex = null;
    }
};

const editTask = (index) => {
    if (tasks[index]) {
        const taskInput = document.getElementById('taskInput');
        taskInput.value = tasks[index].text;

        document.querySelectorAll('.taskItem').forEach(item => item.classList.remove('editing'));
        const taskItems = document.querySelectorAll('.taskItem');
        if (taskItems[index]) {
            taskItems[index].classList.add('editing');
        }

        editIndex = index;
        addTaskInputEventListener();
    }
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completeTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blaskConfetti();
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    // Sort tasks so pinned tasks stay on top
    const sortedTasks = tasks.slice().sort((a, b) => b.pinned - a.pinned);

    sortedTasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("taskItem");

        if (task.pinned) {
            listItem.classList.add("pinned");
        }

        listItem.innerHTML = `
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <div class="pinIcon">
                    <img class="light" src="stylesh/img/pinLightmode.png" alt=""pin onClick="pinTask(${index})"/>
                    <img class="dark" src="stylesh/img/pin.png" alt="Pin" onClick="pinTask(${index})"/>
                </div>
                <div class="editIcon">
                    <img class="light" src="stylesh/img/editLightmode.png" alt="delete" onClick="editTask(${index})"/>
                    <img class="dark" src="stylesh/img/edit.png" alt="Edit" onClick="editTask(${index})"/>
                </div>
                <img src="stylesh/img/bin.png" alt="Delete" onClick="deleteTask(${index})"/>
            </div>
        `;

        const checkbox = listItem.querySelector(".checkbox");
        checkbox.addEventListener('change', () => toggleTaskComplete(index));

        taskList.append(listItem);
    });
};

const addTaskInputEventListener = () => {
    if (inputEventListener) {
        document.getElementById('taskInput').removeEventListener('input', inputEventListener);
    }

    inputEventListener = () => {
        if (editIndex !== null) {
            tasks[editIndex].text = document.getElementById('taskInput').value.trim();
            updateTasksList();
            updateStats();
            saveTask();
        }
    };

    document.getElementById('taskInput').addEventListener('input', inputEventListener);
};

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

document.getElementById('newTask').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});

const resetTasks = () => {
    tasks = [];
    updateTasksList();
    updateStats();
    saveTask();
};

document.getElementById('resetTasks').addEventListener('click', (e) => {
    e.preventDefault();
    resetTasks();
});


const blaskConfetti = () => {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 30,
            scalar: 1.2,
            shapes: ["circle", "square"],
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
        });

        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 2,
            shapes: ["emoji"],
            shapeOptions: {
                emoji: {
                    value: ["🦄", "🌈", "💙", "✨"],
                },
            },
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

function updateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    const formattedTime = `${dayName}, ${date} ${monthName} ${year}`;

    document.getElementById('clock').textContent = formattedTime;
}

updateTime();
setInterval(updateTime, 1000);
