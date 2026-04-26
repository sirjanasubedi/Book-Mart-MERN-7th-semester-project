require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =====================
// ENV DEBUG (keep for dev only)
// =====================
console.log("DB_URL =", process.env.DB_URL);
console.log("PORT =", process.env.PORT);
console.log("JWT_SECRET_KEY =", process.env.JWT_SECRET_KEY);

// =====================
// DB CONNECTION
// =====================
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log("MongoDB error:", err));

// =====================
// MIDDLEWARE
// =====================

// clean CORS (FIXED)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// request logger
app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`
  );
  next();
});

// =====================
// ROUTES
// =====================

// payment
const {
  EsewaInitiatePayment,
  paymentStatus,
} = require("./src/controller/esewa.controller.js");

app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

// test
app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

// =====================
// FEATURE ROUTES
// =====================

// BOOKS (CRUD MAIN)
const bookRoutes = require("./src/books/book.route.js");
app.use("/api/books", bookRoutes);

// ORDERS
const orderRoutes = require("./src/orders/order.route.js");
app.use("/api/orders", orderRoutes);

// USERS / AUTH
const userRoutes = require("./src/users/user.route.js");
app.use("/api/auth", userRoutes);

// ADMIN STATS
const adminStatsRoutes = require("./src/stats/admin.stats.route.js");
app.use("/api/admin", adminStatsRoutes);

// =====================
// 404 HANDLER (IMPORTANT)
// =====================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// =====================
// START SERVER
// =====================
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
