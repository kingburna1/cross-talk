// /server/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    // Set httpOnly cookie for token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    // Set role cookie so Next.js middleware can read it (not httpOnly)
    res.cookie("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000
    });

    // Response (no token in body required since cookie has it)
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Clear role cookie
    res.clearCookie("role", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
