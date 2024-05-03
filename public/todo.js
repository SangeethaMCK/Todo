const localhostAddress = "http://localhost:3000/task";

// Function to refresh the task list
async function refreshTaskList() {
  try {
    const response = await fetch(localhostAddress);
    if (!response.ok) {
      throw new Error("Error fetching tasks:", response.statusText);
    }
    const taskList = await response.json();

    taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";

    taskList.forEach(function (task, index) {
      const row = createTaskRow(task, index);
      taskListElement.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

// Function to create a row for a task
function createTaskRow(task, index) {
  const row = document.createElement("tr");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `isDone${index}`;
  // checkbox.addEventListener("change", function () {
  //   if (this.checked) {
  //     taskCompleted(task, index);
  //   }
  // });

  row.appendChild(checkbox);

  const properties = ["name", "date", "details", "priority"];
  properties.forEach(function (property) {
    let td = document.createElement("td");
    let taskNode = document.createTextNode(task[property]);
    td.appendChild(taskNode);
    row.appendChild(td);
  });

  // Adding edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "EDIT";
  editBtn.className = "edit-btn";
  editBtn.onclick = function () {
    editTask(task, index);
  };
  row.appendChild(editBtn);

  // Adding delete button
  const delBtn = document.createElement("button");
  delBtn.innerHTML = "DEL";
  delBtn.className = "del-btn";
  delBtn.onclick = function () {
    delTask(index);
  };
  row.appendChild(delBtn);

  return row;
}

// Function to delete a task
async function delTask(index) {
  try {
    const response = await fetch(`${localhostAddress}/${index}`, {
      method: "DELETE",
    });
    const taskList = await response.json();

    taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";

    taskList.forEach(function (task, index) {
      const row = createTaskRow(task, index);
      taskListElement.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

// Function to edit a task
async function editTask(task, index) {
  try {
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
      updateTask(index);
    };
  } catch (error) {
    console.error(error);
  }
}

async function updateTask(index) {
  if (!document.getElementById("task").value) {
    window.alert("Please fill task name");
  } else {
    const task = {
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
    };

    const response = await fetch(`${localhostAddress}/${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const changedTask = await response.json();
    renderTaskList(changedTask);
  }
  resetForm();
}

// Function to save a task
async function savetask() {
  if (!document.getElementById("task").value) {
    window.alert("pls fill task name");
  } else {
    const task = {
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
    };

    const response = await fetch(localhostAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const taskList = await response.json();

    taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";

    taskList.forEach(function (task, index) {
      const row = createTaskRow(task, index);
      taskListElement.appendChild(row);
    });
    resetForm();
  }
}

// Function to reset the form
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
  addButton.innerHTML = "Save"
  addButton.onclick = function () {
    savetask();
  };
}

// async function taskCompleted(task, index) {
//   alert(`${task.name} task done`);

//     const response = await fetch(`${localhostAddress}/${index}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(task),
//     });

// }

// Function to sort tasks by date
function sortdate() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTaskList(taskList);
}

// Function to sort tasks by priority
function sortpriority() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.sort((a, b) => b.priority - a.priority);
  renderTaskList(taskList);
}
function renderTaskList(taskList) {
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach((task, index) => {
    const row = createTaskRow(task, index);
    taskListElement.appendChild(row);
  });
}
refreshTaskList();
