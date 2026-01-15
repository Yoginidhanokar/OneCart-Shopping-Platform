import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: "./.env"});
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import cors from "cors"
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Debug: Check if env variables are loaded
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Loaded' : 'Not loaded');

let port = process.env.PORT || 8000;
let app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://onecart-shopping-platform.vercel.app"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// Connect DB first
connectDb().then(() => {
    app.listen(port, () => {  // Use the port variable
        console.log(`✅ Server running on port ${port}`);
    });
}).catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1); // Exit process if DB fails
});

console.log("SERVER FILE RUNNING");
