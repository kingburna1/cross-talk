// /server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import userRoutes from '../server/routes/userRoutes.js'


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
// Allows your Next.js app to make requests to this server
app.use(cors()); 
// Allows the server to accept JSON data in the request body
app.use(express.json()); 

app.use('/api/users', userRoutes);

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB successfully connected!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Basic Route (Test) ---
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});