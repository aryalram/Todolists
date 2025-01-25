const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Database connection
const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ram2024',
  database: process.env.DB_NAME || 'employeedb',
});


// Connect to database
mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Enable CORS
app.use(cors()); // Allow frontend requests from different port (Vite on 5074)
app.use(express.json());

// Routes
// Fetch all tasks
app.get('/api/tasks', (req, res) => {
  const query = 'SELECT * FROM TASKS';
  mysqlConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// Insert a new task
app.post('/api/tasks', (req, res) => {
  const { text, date } = req.body;
  const query = 'INSERT INTO TASKS (text, date) VALUES (?, ?)';
  mysqlConnection.query(query, [text, date], (err, results) => {
    if (err) {
      return res.status(500).send('Error inserting data');
    }
    res.status(201).json({ message: 'Task added successfully', id: results.insertId });
  });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, date } = req.body;
  const query = 'UPDATE TASKS SET text = ?, date = ? WHERE id = ?';
  mysqlConnection.query(query, [text, date, id], (err, result) => {
    if (err) {
      return res.status(500).send('Error updating task');
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM TASKS WHERE id = ?';
  mysqlConnection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting task');
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
