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

function renderTaskList(taskList) {
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach((task, index) => {
    const row = createTaskRow(task, index);
    taskListElement.appendChild(row);
  });
}

async function taskCompleted(isChecked, index) {
  try {
    await fetch(`${localhostAddress}/${index}`, {
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
    taskCompleted(isChecked, index);
  });

  // checkbox.addEventListener("change", function(){
  //   if(checkbox.checked){
  //     task.completed= true;
  //   }
  //   else{
  //     task.completed= false;
  //   }
  //   taskCompleted(task, index);
  // })
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
  console.log(index)
  if (!document.getElementById("task").value) {
    window.alert("Please fill task name");
  } else {
    const task = {
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
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
// Function to save a task
async function savetask() {
  if (!document.getElementById("task").value) {
    window.alert("pls fill task name");
  } else {
    const task = {
      completed: false,
      name: document.getElementById("task").value,
      date: document.getElementById("taskdate").value,
      details: document.getElementById("taskDetails").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
    };
    try{
    await fetch(localhostAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const taskListElement = document.getElementById("taskList");
    taskrow = createTaskRow(task);
    taskListElement.appendChild(taskrow);
  }
catch (error) {
  console.error(error);
}}
  resetForm();
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

refreshTaskList();

