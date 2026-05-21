require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log("MongoDB error:", err));

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [clientUrl, "http://localhost:5174"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

const { EsewaInitiatePayment, paymentStatus } = require("./src/controller/esewa.controller.js");
app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

app.get("/api/test", (req, res) => res.json({ message: "API working ✅" }));

const bookRoutes = require("./src/books/book.route.js");
app.use("/api/books", bookRoutes);

const orderRoutes = require("./src/orders/order.route.js");
app.use("/api/orders", orderRoutes);

const userRoutes = require("./src/users/user.route.js");
app.use("/api/auth", userRoutes);

const adminStatsRoutes = require("./src/stats/admin.stats.route.js");
app.use("/api/admin", adminStatsRoutes);

// ✅ NEW — Category routes
const categoryRoutes = require("./src/categories/category.route.js");
app.use("/api/categories", categoryRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));