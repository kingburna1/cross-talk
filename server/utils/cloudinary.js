// server/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Function to configure Cloudinary (called after env vars are loaded)
export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  console.log("☁️ Cloudinary configured with cloud:", process.env.CLOUDINARY_CLOUD_NAME);
}

export default cloudinary;
