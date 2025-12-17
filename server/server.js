import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from './routes/authRoutes.js';
import employeeProfileRoutes from './routes/employeeProfileRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import cookieParser from 'cookie-parser';
import testEmailRoutes from "./routes/testEmail.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { configureCloudinary } from "./utils/cloudinary.js";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: join(__dirname, '.env') });

// Verify Cloudinary credentials are loaded
console.log("🔐 Environment check:");
console.log("  CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Loaded" : "❌ Missing");
console.log("  CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("  CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing");

// Configure Cloudinary after env vars are loaded
configureCloudinary();

const app = express();


const port = process.env.PORT || 5000;

// --- Middlewares ---
// Allows your Next.js app to make requests to this server
app.use(cors());
// Allows the server to accept JSON data in the request body
app.use(express.json()); 
app.use(cookieParser());




// public auth
app.use('/api/auth', authRoutes);

// employee profile
app.use('/api/employee-profiles', employeeProfileRoutes);
app.use("/api/test-email", testEmailRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/employees", employeeRoutes);  
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);


// --- Database Connection ---
// --- Database Connection ---
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB successfully connected!");

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
