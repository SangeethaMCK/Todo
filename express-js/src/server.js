// server.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

const todosFilePath = path.join(__dirname, "todos.txt");

async function readTodosFromFile() {
  try {
    const data = await fs.readFile(todosFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos from file:", error);
    return [];
  }
}

async function writeTodosToFile(todos) {
  try {
    await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Error writing todos to file:", error);
  }
}

app.get("/todos", async (req, res) => {
  try {
    const todos = await readTodosFromFile();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = req.body;
    const todos = await readTodosFromFile();
    todos.push(newTodo);
    await writeTodosToFile(todos);
    res.status(201).json({ message: "Todo created successfully" });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/todos/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const todos = await readTodosFromFile();
    todos.splice(index, 1);
    await writeTodosToFile(todos);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/todos/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const updatedTodo = req.body;
    const todos = await readTodosFromFile();
    todos[index] = updatedTodo;
    await writeTodosToFile(todos);
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/todos/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const updatedFields = req.body; 
    const todos = await readTodosFromFile();

    const updatedTodo = { ...todos[index], ...updatedFields };
    todos[index] = updatedTodo;

    await writeTodosToFile(todos);

    res.json({ message: "Todo updated successfully"});
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
