// to save data to local storage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// creating a row and adding all data to td
function createTaskRow(task, index) {
  const row = document.createElement("tr");

  const properties = ["name", "date", "details", "priority"];
  properties.forEach(function (property) {
    let td = document.createElement("td");
    let taskNode = document.createTextNode(task[property]);
    td.appendChild(taskNode);
    row.appendChild(td);
  });

  // adding edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "EDIT";
  editBtn.className = "edit-btn";
  editBtn.onclick = function () {
    editTask(task, index);
  };
  row.appendChild(editBtn);

  // adding delete button
  const delBtn = document.createElement("button");
  delBtn.innerHTML = "DEL";
  delBtn.className = "del-btn";
  delBtn.onclick = function () {
    delTask(index);
  };
  row.appendChild(delBtn);

  return row;
}

//delete function
function delTask(index) {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.splice(index, 1);
  saveTasksToLocalStorage(taskList);
  refreshTaskList();
}

function refreshTaskList() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach(function (task, index) {
    const row = createTaskRow(task, index);
    taskListElement.appendChild(row);
  });
}

//edit function
function editTask(task, index) {
  document.getElementById("task").value = task.name;
  document.getElementById("taskdate").value = task.date;
  document.getElementById("taskDetails").value = task.details;
  let radios = document.getElementsByName("priority");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].value === task.priority) {
      radios[i].checked = true;
      break;
    }
  }
  const addButton = document.getElementById("add-btn");
  addButton.innerHTML = "Save Changes";

  addButton.onclick = function () {
    savetask(index);
  };
}

//save function
function savetask(index) {
  if (
    !document.getElementById("task").value ||
    !document.getElementById("taskdate").value
  ) {
    window.alert("Please enter task name and date");
  } else {
    const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = {
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
    };
    if (index || Number(index) === 0) taskList[index] = task;
    else taskList.push(task);
    saveTasksToLocalStorage(taskList);
    refreshTaskList();
    resetForm();
  }
}

// Reset form
function resetForm() {
  document.getElementById("task").value = "";
  document.getElementById("taskdate").value = "";
  document.getElementById("taskDetails").value = "";
  let radios = document.getElementsByName("priority");
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }
  radios[2].checked = true;
  let addButton = document.getElementById("add-btn");
  addButton.innerHTML = "Save";
  addButton.onclick = function () {
    savetask();
  };
}

//sorting

function sortdate() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  taskList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach(function (task, index) {
    const row = createTaskRow(task, index);
    taskListElement.appendChild(row);
  });
}

function sortpriority() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  taskList.sort((a, b) => {
    return b.priority - a.priority;
  });
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach(function (task, index) {
    const row = createTaskRow(task, index);
    taskListElement.appendChild(row);
  });
}
