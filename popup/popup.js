const addTaskBtn = document.getElementById("add-task-btn");
const startTimerBtn = document.getElementById("start-timer-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");
const taskContainer = document.getElementById("task-container");
const timerText = document.getElementById("timer-text");

let tasks = [];

addTaskBtn.addEventListener("click", onAddTaskClick);

//#region Storage Actions

chrome.storage.sync.get(["tasks"], (response) => {
  tasks = response.tasks ? response.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (response) => {
    chrome.storage.local.set({ isRunning: !response.isRunning }, () => {
      startTimerBtn.textContent = !response.isRunning
        ? "Pause Timer"
        : "Start Timer";
    });
  });
});

resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 0, isRunning: false }, () => {
    startTimerBtn.textContent = "Start Timer";
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoro-timer") {
    updateTime();
  }
});

function updateTime() {
  chrome.storage.local.get(["timer", "timerOption"], (response) => {
    const minutes = `${
      response.timerOption - Math.ceil(response.timer / 60)
    }`.padStart(2, "0");
    let seconds = "00";
    if (response.timer % 60 != 0) {
      seconds = `${60 - (response.timer % 60)}`.padStart(2, "0");
    }
    timerText.textContent = `${minutes}:${seconds}`;
  });
}

//#endregion

//#region Functions

function onAddTaskClick() {
  const currentTask = tasks.length;
  tasks.push("");

  addTaskRender(currentTask);
}

function addTaskRender(currentTask) {
  const taskRow = document.createElement("div");
  taskRow.id = "task-div";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a task...";
  textInput.value = tasks[currentTask];
  textInput.id = "task-input";

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.id = "task-delete-btn";

  textInput.addEventListener("change", () => {
    tasks[currentTask] = textInput.value;
    saveTasks();
  });

  deleteBtn.addEventListener("click", () => {
    deleteTask(currentTask);
  });

  taskRow.appendChild(textInput);
  taskRow.appendChild(deleteBtn);

  taskContainer.appendChild(taskRow);
}

function deleteTask(currentTask) {
  tasks.splice(currentTask, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskContainer.textContent = "";
  tasks.forEach((text, index) => {
    addTaskRender(index);
  });
}

//#endregion
