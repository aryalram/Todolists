const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

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

// Routes for API (fetch, insert, update, delete tasks)
app.get('/api/tasks', (req, res) => {
  const query = 'SELECT * FROM TASKS';
  mysqlConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

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

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  // Any route not handled by the API, return the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
