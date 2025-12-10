import express from "express";
import Notification from "../models/notifications.js";

const router = express.Router();

// GET all notifications (sorted by newest first)
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new notification
router.post("/", async (req, res) => {
  try {
    const saved = await Notification.create(req.body);
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark all notifications as read (MUST come before /:id routes)
router.put("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update notification (mark as read or update fields)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Legacy route for marking as read (kept for backward compatibility)
router.put("/:id/mark-read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE notification
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully", notification: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
