import express from "express";
import { verifyTransporter, sendEmail } from "../utils/email.js";
const router = express.Router();

router.get("/verify", async (req, res) => {
  try {
    await verifyTransporter();
    res.json({ ok: true, message: "Transporter OK" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/send-test", async (req, res) => {
  const { to } = req.body || {};
  const dest = to || process.env.ADMIN_EMAIL;
  try {
    const info = await sendEmail({
      to: dest,
      subject: "Test email from YourApp",
      text: "Test email plain text",
      html: `<p>This is a <b>test email</b> from YourApp at ${new Date().toISOString()}</p>`
    });
    res.json({ ok: true, info });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
