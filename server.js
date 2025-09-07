const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const signupRoute = require("./routes/auth/signup");
const loginRoute = require("./routes/auth/login");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000", 
  ],
  credentials: true
}));

// ✅ MongoDB connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/auth/signup", signupRoute);
app.use("/auth/login", loginRoute);

// ✅ Root route (for testing deployment)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
