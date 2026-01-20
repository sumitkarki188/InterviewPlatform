import express from "express";
import dotenv from "dotenv";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());

// CORS - credentials true means the server allows cookies for browsing
app.use(cors({ 
    origin: ENV.CLIENT_URL, 
    credentials: true 
}));

// Inngest endpoint - MUST come before other routes
app.use("/api/inngest", serve({ 
    client: inngest, 
    functions,
    signingKey: ENV.INNGEST_SIGNING_KEY
}));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ msg: "API is up and running" });
});

// Example endpoint
app.get("/books", (req, res) => {
    res.status(200).json({ msg: "This is the books endpoint" });
});

// Add your other API routes here
// app.use("/api/users", userRoutes);
// app.use("/api/interviews", interviewRoutes);

// Make ready for deployment - serve frontend in production
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log("Server is running on port:", ENV.PORT);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

startServer();
