// /server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from './routes/authRoutes.js';
import employeeProfileRoutes from './routes/employeeProfileRoutes.js';
import cookieParser from 'cookie-parser';






const app = express();
dotenv.config();


const port = process.env.PORT || 5000;

// --- Middlewares ---
// Allows your Next.js app to make requests to this server
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// Allows the server to accept JSON data in the request body
app.use(express.json()); 
app.use(cookieParser());




// public auth
app.use('/api/auth', authRoutes);

// employee profile
app.use('/api/employee-profiles', employeeProfileRoutes);
app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/employees", employeeRoutes);  
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);


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
