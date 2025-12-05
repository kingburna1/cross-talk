// /server/routes/userRoutes.js
import express from 'express';
import User from '../models/Users.js';


const router = express.Router();

// POST /api/users - Create a new user
router.post('/register', async (req, res) => { // <-- CHANGED from '/' to '/register'
  // Note: The hashing happens automatically in the User model's pre-save hook!
  const newUser = new User(req.body); 
  
  try {
    const savedUser = await newUser.save();
    
    // Respond with a success message (excluding the password for security)
    const { password, ...userData } = savedUser._doc; 
    res.status(201).json({ 
        message: "User registered successfully!",
        user: userData 
    });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error (e.g., email already exists)
      return res.status(400).json({ message: "That email address is already in use." });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;