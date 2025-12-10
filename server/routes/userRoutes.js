// /server/routes/userRoutes.js
import express from 'express';
import User from '../models/user.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin creates employee account (POST /api/users/create-employee)
router.post('/create-employee', authenticate, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body; // role optional, defaults to employee
  try {
    const user = new User({ name, email, password, role: role || 'employee' });
    const saved = await user.save();
    const { password: _, ...payload } = saved._doc;
    res.status(201).json({ message: 'Employee account created', user: payload });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

// Admin: list users
router.get('/', authenticate, isAdmin, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update current user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, address, timezone, imageSrc } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update allowed fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (timezone) user.timezone = timezone;
    if (imageSrc !== undefined) user.imageSrc = imageSrc;

    await user.save();
    const updated = await User.findById(req.user.id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
