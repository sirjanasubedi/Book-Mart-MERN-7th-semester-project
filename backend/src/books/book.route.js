const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  postABook,
  getAllBooks,
  getSingleBook,
  updatedBook,
  deleteABook,
  likeBook,
  getRecommendedBooks,
} = require("./book.controller");

const verifyAdminToken = require("../middleware/verifyAdminToken");

// =====================
// MULTER SETUP
// =====================
// This creates backend/uploads/ folder automatically if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =====================
// PUBLIC ROUTES
// =====================
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.get("/:id/recommendations", getRecommendedBooks);
router.post("/:id/like", likeBook);

// =====================
// ADMIN ROUTES (PROTECTED)
// =====================
// ✅ upload.single("coverImage") handles the image file
router.post("/create-book", verifyAdminToken, upload.single("coverImage"), postABook);
router.put("/edit/:id", verifyAdminToken, upload.single("coverImage"), updatedBook);
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;