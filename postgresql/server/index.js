const { Client } = require('pg');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const client = new Client({
  user: 'postgres',
  password: 'Sangee@2001',
  host: 'localhost', // or your database host
  port: 5432,
  database: 'postgres'
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

app.use(express.json());

const staticPath = path.join(__dirname, '../client');
app.use(express.static(staticPath));

function formatDate(dateString) {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

app.get('/todos', async (req, res) => {
  try {
    const todos = await client.query('SELECT * FROM todos');

    todos.rows.forEach(todo => {
      todo.date = formatDate(todo.date);
    });

    res.json(todos.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { id, name, date, details, priority, completed } = req.body;

    await client.query('INSERT INTO todos (id, name, date, details, priority, completed) VALUES($1, $2, $3, $4, $5, $6)', [id, name, date, details, priority, completed]);

    res.status(201).json({ message: 'Todo created successfully' });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/todos/:index", async (req, res) => {
  try {
    const index = req.params.index;

    const todos = await client.query('SELECT * FROM todos')

    await client.query(`delete from todos where id= $1`, [index]);

    res.json({ message: "Todo deleted successfully" });
  }
  catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/todos/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const { id, name, date, details, priority, completed } = req.body

    const todos = await client.query('SELECT * FROM todos')

    await client.query('update todos set name=$1, date=$2, details=$3, priority=$4, completed=$5 where id=$6', [name, date, details, priority, completed, id])

    res.json({ message: "Todo updated successfully" });
  }
  catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const taskid = req.params.id;
    const { completed } = req.body;

    await client.query('update todos set completed=$1 where id=$2', [completed, taskid])

    res.json({ message: "Todo updated successfully" });
  }
  catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/todos/sortdate", async (req, res) => {
  try {
    const sortedTodos = await client.query('SELECT * FROM todos ORDER BY date');

    sortedTodos.rows.forEach(todo => {
      todo.date = formatDate(todo.date);
    });
    res.json({ message: "Todos sorted by date", todos: sortedTodos.rows });
  }
  catch (error) {
    console.error("Error sorting todos by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/todos/sortpriority", async (req, res) => {
  try {
    const sortedTodos = await client.query('SELECT * FROM todos ORDER BY priority');

    sortedTodos.rows.forEach(todo => {
      todo.date = formatDate(todo.date);
    });
    res.json({ message: "Todos sorted by priority", todos: sortedTodos.rows });
  }
  catch (error) {
    console.error("Error sorting todos by priority:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
