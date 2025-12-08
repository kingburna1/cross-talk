// /server/routes/employeeProfileRoutes.js
import express from 'express';
import EmployeeProfile from '../models/EmployeeProfile.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin creates profile for a user (POST /api/employee-profiles)
router.post('/', authenticate, isAdmin, async (req, res) => {
  const { userId, image, age, phone, dateEmployed, post, salary, paymentMeans } = req.body;
  try {
    const existing = await EmployeeProfile.findOne({ user: userId });
    if (existing) return res.status(400).json({ message: 'Profile already exists for this user' });
    const profile = await EmployeeProfile.create({
      user: userId, image, age, phone, dateEmployed, post, salary, paymentMeans
    });
    res.status(201).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin or the employee can fetch their profile
router.get('/:userId', authenticate, async (req, res) => {
  const requester = req.user;
  if (requester.role !== 'admin' && requester.id !== req.params.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const profile = await EmployeeProfile.findOne({ user: req.params.userId }).populate('user', 'name email role');
  res.json(profile);
});

// Admin updates profile
router.put('/:userId', authenticate, isAdmin, async (req, res) => {
  const updated = await EmployeeProfile.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, upsert: false });
  res.json(updated);
});

export default router;
