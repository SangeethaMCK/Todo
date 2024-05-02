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

// Endpoint to get all tasks
app.get("/task", (req, res) => {
  // console.log("GET request received");
  const tasks = readTasksFromFile();
  res.json(tasks);
});

// Endpoint to add a new task
app.post("/task", (req, res) => {
  const newtask = req.body;
  // console.log("POST request received:", newtask);

  const taskList = readTasksFromFile();
  taskList.push(newtask);
  writeTasksToFile(taskList);
  const newtaskList = readTasksFromFile();
  res.json(newtaskList);
});

app.delete("/task/:index", (req, res) => {
  tasks = readTasksFromFile();
  const index = req.params.index;
  tasks.splice(index, 1);
  writeTasksToFile(tasks);
  const newtaskList = readTasksFromFile();
  res.json(newtaskList);
});

// app.patch("/task/:index", (req, res) => {
//   const index = req.params.index;
//   const updatedTask = req.body;

//   let tasks = readTasksFromFile();

//   tasks[index] = updatedTask;

//   writeTasksToFile(tasks);

//   res.json(tasks[index]);
// });

app.put("/task/:index", (req, res) => {
  const index = req.params.index;
  const updatedTask = req.body;

  let tasks = readTasksFromFile();

  tasks[index] = updatedTask;

  writeTasksToFile(tasks);
  res.json(tasks[index]);
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
