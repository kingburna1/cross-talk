// server/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();
const upload = multer(); // in-memory

// POST /api/upload (multipart/form-data) with file field name "file"
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("📸 Upload request received");
    console.log("File info:", req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    } : "No file");

    if (!req.file) {
      console.log("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("☁️ Uploading to Cloudinary...");
    // Upload buffer to Cloudinary via upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cross-talk-supermarket", // Store images in organized folder
          resource_type: "image",
          transformation: [ { width: 1000, crop: "limit" } ], // Limit max width to 1000px
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            return reject(error);
          }
          console.log("✅ Cloudinary upload successful:", result.secure_url);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // result contains secure_url and public_id — save to DB if needed
    return res.json({
      message: "Upload successful",
      public_id: result.public_id,
      secure_url: result.secure_url,
      raw: result,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
