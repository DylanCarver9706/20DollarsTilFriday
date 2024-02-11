require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
console.log(process.env.DB_HOST)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/events', (req, res) => {
  connection.query('SELECT * FROM events', (error, results) => {
    if (error) {
      console.error('Error fetching events: ', error);
      res.status(500).json({ error: 'Error fetching events' });
      return;
    }
    res.json(results);
  });
});

// Add routes for CRUD operations

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
