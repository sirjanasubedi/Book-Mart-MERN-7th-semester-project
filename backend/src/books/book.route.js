const express = require("express");
const router = express.Router();

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
// PUBLIC ROUTES
// =====================
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.get("/:id/recommendations", getRecommendedBooks);
router.post("/:id/like", likeBook);

// =====================
// ADMIN ROUTES (PROTECTED)
// =====================
router.post("/create-book", verifyAdminToken, postABook);

router.put("/edit/:id", verifyAdminToken, updatedBook);

router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
