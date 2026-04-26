require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/users/user.model");

async function main() { 
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to MongoDB");

  const existingAdmin = await User.findOne({ email: "admin@admin.com" });
  if (existingAdmin) {
    console.log("Admin already exists.");
    return mongoose.disconnect();
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const newAdmin = new User({
    email: "admin@admin.com",
    password: hashedPassword,
    role: "admin"
  });

  await newAdmin.save();
  console.log("Admin user created successfully");

  mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error creating admin:", err);
  mongoose.disconnect();
});
