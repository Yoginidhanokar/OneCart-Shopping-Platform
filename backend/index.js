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

// Quick dev debug middleware: force CORS header for localhost origin and log incoming origin
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log("[CORS DEBUG] request to", req.path, "method", req.method, "origin header=", origin);
    if (origin === 'http://localhost:5173') {
        console.log("[CORS DEBUG] setting allow-origin for localhost");
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://onecart-shopping-frontend.onrender.com",
            "https://onecart-admin-cwj0.onrender.com"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Fallback CORS headers middleware: ensures every response includes
// Access-Control-Allow-* headers (helps if proxy or older deployments
// accidentally omit them). Also handles preflight OPTIONS requests.
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "https://onecart-shopping-frontend.onrender.com",
        "https://onecart-admin-cwj0.onrender.com"
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // non-browser requests (curl, server-to-server)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
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
