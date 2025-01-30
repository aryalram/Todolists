const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Use CORS middleware with explicit allowed origin
app.use(cors({
  origin: 'https://task-manager-frontend-0d20f4b6eb5d.herokuapp.com', // Change this to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // ✅ Allow cookies if needed
}));

app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'z37udk8g6jiaqcbx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'l3fkx4cvrwa380n9',
  password: process.env.DB_PASSWORD || 'u0rhu9z86kdyw36w',
  database: process.env.DB_NAME || 'vqsxratnr25ldeep',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to MySQL database.');
    connection.release();
  }
});

// ✅ Manually Set CORS Headers for All Responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://task-manager-frontend-0d20f4b6eb5d.herokuapp.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Routes
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM TASKS', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching tasks' });
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { text, date } = req.body;
  if (!text || !date) return res.status(400).json({ error: 'Text and date required' });
  db.query('INSERT INTO TASKS (text, date) VALUES (?, ?)', [text, date], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error inserting task' });
    res.status(201).json({ message: 'Task added successfully', id: results.insertId });
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
