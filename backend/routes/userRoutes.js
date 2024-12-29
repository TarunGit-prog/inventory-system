const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Ensure you have your MySQL database connection here

// Register a new user
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserSql, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Insert the new user into the database (no password hashing or JWT)
    const insertUserSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertUserSql, [email, password], (err, results) => {
      if (err) throw err;
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login an existing user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare password with the one in the database (no hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  });
});

module.exports = router;
