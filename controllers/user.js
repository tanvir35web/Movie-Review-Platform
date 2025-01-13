const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key';


async function handleRegisterUser(req, res) {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ error: 'User creation failed' });
        res.status(201).json({ message: 'User registered successfully' });
    });
}

async function handleLoginUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        const user_details = {
            user_id: user.user_id,
            username: username,
            user_role: user.role,
        }

        res.status(200).json({ message: 'Login successful', user_details, token });
    });
}

async function handleGetUserById(req, res) {
    const { user_id } = req.params;
  
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    const query = "SELECT * FROM users WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database query error", err });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(results[0]);
    });
  }
  

async function handleProtectedRoute(req, res) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        res.status(200).json({ message: 'Access granted', role: decoded.role });
    });
}

module.exports = {
    handleRegisterUser,
    handleLoginUser,
    handleProtectedRoute,
    handleGetUserById,
};