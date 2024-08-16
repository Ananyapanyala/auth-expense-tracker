// backend/server.js or auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Adjust the path as necessary

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret'; // Ensure this is the same as used in your auth.js

// Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Missing required fields');
    }

    // Create and save the user
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered successfully!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Other routes...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
