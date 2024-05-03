const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// app.use((req,res,next)=>{
//   console.log(req.method)
//   console.log(req.path)
//   next()
// })

const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

// Define the path to the todos file
const todosFilePath = path.join(__dirname, "todos.txt");

// Function to read tasks from the file
function readTasksFromFile() {
  try {
    const data = fs.readFileSync(todosFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks from file:", error);
    return [];
  }
}

// Function to write tasks to the file
function writeTasksToFile(tasks) {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error writing tasks to file:", error);
  }
}


app.get("/task", (req, res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
});

// Endpoint to add a new task
app.post("/task", (req, res) => {
  const newtask = req.body;
  const taskList = readTasksFromFile();

  taskList.push(newtask);

  writeTasksToFile(taskList);

  const newtaskList = readTasksFromFile();

  res.json(newtaskList);
});

app.delete("/task/:index", (req, res) => {
  const index = req.params.index;

  tasks = readTasksFromFile();
  tasks.splice(index, 1);

  writeTasksToFile(tasks);

  const newtaskList = readTasksFromFile();

  res.json(newtaskList);
});

app.put("/task/:index", (req, res) => {
  const index = req.params.index;
  const updatedTask = req.body;

  let tasks = readTasksFromFile();

  tasks[index] = updatedTask;

  writeTasksToFile(tasks);

  res.json(tasks);
});

app.patch("/task/:index", (req, res) => {
  const index = req.params.index;
  const updatedFields = req.body;

  let tasks = readTasksFromFile();
  let taskToUpdate = tasks[index];

  for (let field in updatedFields) {
    if (taskToUpdate.hasOwnProperty(completed)) {
      taskToUpdate[completed] = updatedFields[completed];
    }
  }

  tasks[index] = taskToUpdate;
  writeTasksToFile(tasks);

  res.json(taskToUpdate);
});


app.listen(port, () => {
  console.log("Server is running on port", port);
});
