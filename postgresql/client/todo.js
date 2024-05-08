const localhostAddress = "http://localhost:3000/todos";

// Function to refresh the task list
async function refreshTaskList() {
  try {
    const response = await fetch(localhostAddress);
    const taskList = await response.json();
    renderTaskList(taskList);
  } catch (error) {
    console.error(error);
  }
}

//reloads the task list
function renderTaskList(taskList) {
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach((task, index) => {
    const row = createTaskRow(task, index);
    taskListElement.append(row);
  });
}

async function taskCompleted(isChecked, id) {
  try {
    await fetch(`${localhostAddress}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: isChecked }),
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
  checkbox.id = `isDone`;

  if (task.completed === true) checkbox.checked = true;

  checkbox.addEventListener("change", function () {
    const isChecked = checkbox.checked;
    taskCompleted(isChecked, task.id);
  });
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
    delTask(task.id);
    row.remove(task);
  };
  row.appendChild(delBtn);

  return row;
}

// Function to delete a task
async function delTask(index) {
  try {
    await fetch(`${localhostAddress}/${index}`, {
      method: "DELETE",
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
      if (radios[i].value == task.priority) {
        radios[i].checked = true;
        break;
      }
    }
    const addButton = document.getElementById("add-btn");
    addButton.innerHTML = "Save Changes";

    addButton.onclick = function () {
      updateTask(task.id, index);
    };
  } catch (error) {
    console.error(error);
  }
}

async function updateTask(taskid, index) {
  if (!document.getElementById("task").value) {
    window.alert("Please fill task name");
  } else {
    const task = {
      id: taskid,
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
      completed: false
    };

    try {
      await fetch(`${localhostAddress}/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const updatedTask = { ...task, completed: false };
      const taskListElement = document.getElementById("taskList");
      const taskRows = taskListElement.getElementsByTagName("tr");

      const taskRow = taskRows[index];
      const updatedRow = createTaskRow(updatedTask, index);
      taskListElement.replaceChild(updatedRow, taskRow);
    }
    catch (error) {
      console.error(error);
    }
  }
  resetForm();
}
const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36);
}
// Function to save a task
async function savetask() {
  if (!document.getElementById("task").value) {
    window.alert("pls fill task name ");
  } else {
    const task = {
      id: uid(),
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value || minDate(),
      details: document.getElementById("taskDetails").value || "",
      priority: document.querySelector('input[name="priority"]:checked').value,
      completed: false,
    };
    try {
      await fetch(localhostAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    }
    catch (error) {
      console.error(error);
    }
    const taskListElement = document.getElementById("taskList");
    taskrow = createTaskRow(task);
    taskListElement.appendChild(taskrow);
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
  addButton.innerHTML = "Save";
  addButton.onclick = function () {
    savetask();
  };
}

async function sortdate() {
  try {
    const response = await fetch(`${localhostAddress}/sortdate`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      
    });
    const responseData = await response.json();
    const taskList = responseData.todos; 
    renderTaskList(taskList);
  }
  catch (error) {
    console.error(error);
  }
}

async function sortpriority() {
  try {
    const response = await fetch(`${localhostAddress}/sortpriority`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const taskList = responseData.todos; 
    renderTaskList(taskList);
  }
  catch (error) {
    console.error(error);
  }
}


refreshTaskList();