import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderName: String,
  subject: String,
  message: String,
  timestamp: String,   // stored as ISO string
  isResolved: Boolean,
  adminRemark: { type: String, default: null },
}, { timestamps: true });
const messages = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default messages;
