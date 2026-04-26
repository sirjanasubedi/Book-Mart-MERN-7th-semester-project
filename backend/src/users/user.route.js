const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../middleware/verifyAdminToken");

const {
  registerUser,
  loginUser,
  loginAdmin,
  getAllUsers,
} = require("./user.controller");

// USER ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ROUTES
router.post("/admin", loginAdmin);
router.post("/admin/register", registerUser);

// GET USERS (ADMIN)
router.get("/users", verifyAdminToken, getAllUsers);

module.exports = router;