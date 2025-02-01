const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend Vite server
}));
app.use(express.json());

// MySQL connection string
const connectionString = process.env.MYSQL_CONNECTION_STRING || 'mysql://wgqsalk87orb294u:ngzcw52ntfvam6vc@sp6xl8zoyvbumaa2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wb2waxj39e4tgewo';

// Create MySQL connection
const db = mysql.createConnection(connectionString);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM TASKS', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    } else {
      res.json(results);
    }
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { text, date } = req.body;
  if (!text || !date) {
    return res.status(400).json({ error: 'Text and date are required' });
  }
  const query = `INSERT INTO tasks (text, date) VALUES (?, ?)`;
  db.query(query, [text, date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add task' });
    } else {
      res.json({ message: 'Task added successfully' });
    }
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
