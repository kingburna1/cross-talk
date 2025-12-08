import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: String,   // success, warning, error, info
  title: String,
  message: String,
  timestamp: String,
  isRead: Boolean,
}, { timestamps: true });

const notifications = mongoose.models.Message || mongoose.model('notification', notificationSchema);

export default notifications;
