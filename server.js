const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const signupRoute = require("./routes/auth/signup");
const loginRoute = require("./routes/auth/login");

const app = express();

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://demo-backend-pi-seven.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // set true if you use cookies / auth headers
  })
);

// ✅ Middleware
app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({ extended: true }));

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
