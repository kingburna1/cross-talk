import express from "express";
import Notification from "../models/notifications.js";

const router = express.Router();

// GET all notifications
router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

// POST new notification
router.post("/", async (req, res) => {
  const saved = await Notification.create(req.body);
  res.json(saved);
});

// Mark as read
router.put("/:id/mark-read", async (req, res) => {
  const updated = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  res.json(updated);
});

export default router;
