require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to the database");
});

// ###############################################################################################
//                                           USERS
// ###############################################################################################

// Create a user
app.post("/users", (req, res) => {
  const { username, password } = req.body;
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error("Error creating user: ", error);
      res.status(500).json({ error: "Error creating user" });
      return;
    }
    res
      .status(201)
      .json({ message: "User created successfully", userId: results.insertId });
  });
});

// Read all users
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error fetching users: ", error);
      res.status(500).json({ error: "Error fetching users" });
      return;
    }
    res.json(results);
  });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;
  const query = "UPDATE users SET username = ?, password = ? WHERE id = ?";
  connection.query(query, [username, password, userId], (error) => {
    if (error) {
      console.error("Error updating user: ", error);
      res.status(500).json({ error: "Error updating user" });
      return;
    }
    res.json({ message: "User updated successfully" });
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [userId], (error) => {
    if (error) {
      console.error("Error deleting user: ", error);
      res.status(500).json({ error: "Error deleting user" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

// ###############################################################################################
//                                          EVENTS
// ###############################################################################################

// Create an event
app.post('/events', (req, res) => {
    const { title, type, user_id, amount, recurring_type, frequency, payment_method } = req.body;
    const query = 'INSERT INTO events (title, type, user_id, amount, recurring_type, frequency, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [title, type, user_id, amount, recurring_type, frequency, payment_method], (error, results) => {
      if (error) {
        console.error('Error creating event: ', error);
        res.status(500).json({ error: 'Error creating event' });
        return;
      }
      res.status(201).json({ message: 'Event created successfully', eventId: results.insertId });
    });
  });

// Read all events
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

// Update an event
// app.put('/events/:id', (req, res) => {
//   const eventId = req.params.id;
//   const { title, date, type, user_id } = req.body;
//   const query = 'UPDATE events SET title = ?, date = ?, type = ?, user_id = ? WHERE id = ?';
//   connection.query(query, [title, date, type, user_id, eventId], (error) => {
//     if (error) {
//       console.error('Error updating event: ', error);
//       res.status(500).json({ error: 'Error updating event' });
//       return;
//     }
//     res.json({ message: 'Event updated successfully' });
//   });
// });

// Delete an event
app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;
  const query = 'DELETE FROM events WHERE id = ?';
  connection.query(query, [eventId], (error) => {
    if (error) {
      console.error('Error deleting event: ', error);
      res.status(500).json({ error: 'Error deleting event' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});
