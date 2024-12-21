import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutesBackend.js'; // Ensure .js extension for ES modules
import adminRouter from './routes/adminRoutesBackend.js'; // Ensure .js extension for ES modules
import movieRouter from './routes/movieRoutesBackend.js'; // Ensure .js extension for ES modules
import bookingsRouter from './routes/bookingRoutesBackend.js'; // Ensure .js extension for ES modules
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Definitions
app.use("/user", userRouter); // User routes
app.use("/admin", adminRouter); // Admin routes
app.use("/movie", movieRouter); // Movie routes
app.use("/booking", bookingsRouter); // Booking routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
