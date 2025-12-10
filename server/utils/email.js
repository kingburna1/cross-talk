import nodemailer from "nodemailer";

let transporter = null;

// Create transporter lazily to ensure env vars are loaded
function getTransporter() {
  if (!transporter) {
    // Log SMTP configuration for debugging
    console.log("📧 SMTP Configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS
    });

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // optional for some providers; ok for dev
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  return transporter;
}

export async function verifyTransporter() {
  try {
    await getTransporter().verify();
    console.log("✅ SMTP transporter verified");
    return true;
  } catch (err) {
    console.error("❌ Transporter verify failed:", err);
    throw err;
  }
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    console.log(`📧 Sending email to: ${to}, from: ${fromEmail}`);
    
    const info = await getTransporter().sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
    
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
}

export default { getTransporter, verifyTransporter, sendEmail };
