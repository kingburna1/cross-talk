import express from "express";
import Message from "../models/messages.js";

const router = express.Router();

// GET all messages
router.get("/", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

// POST new message
router.post("/", async (req, res) => {
  const saved = await Message.create(req.body);
  res.json(saved);
});

// UPDATE message (resolve or add admin remark)
router.put("/:id", async (req, res) => {
  const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;
