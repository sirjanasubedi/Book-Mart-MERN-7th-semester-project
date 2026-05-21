const Book = require("./book.model");

// =====================
// CREATE BOOK (ADMIN)
// =====================
const postABook = async (req, res) => {
  try {
    // ✅ If image uploaded, use its path. Otherwise fallback to text value
    const coverImage = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.coverImage;

    const newBook = new Book({ ...req.body, coverImage });
    await newBook.save();

    res.status(201).send({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create book" });
  }
};

// =====================
// GET ALL BOOKS
// =====================
// =====================
// GET ALL BOOKS
// =====================
const getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).send({ books });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

// =====================
// GET SINGLE BOOK
// =====================
const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send({ message: "Book not found" });
    res.status(200).send({ book });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

// =====================
// UPDATE BOOK (ADMIN)
// =====================
const updatedBook = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ Only update coverImage if a new file was uploaded
    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).send({ message: "Book not found" });

    res.status(200).send({ message: "Book updated successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update book" });
  }
};

// =====================
// DELETE BOOK (ADMIN)
// =====================
const deleteABook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send({ message: "Book not found" });
    res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete book" });
  }
};

// =====================
// LIKE BOOK
// =====================
const likeBook = async (req, res) => {
  try {
    const { userId } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send({ message: "Book not found" });

    const alreadyLiked = book.likes.find((l) => l.userId === userId);
    if (alreadyLiked) {
      book.likes = book.likes.filter((l) => l.userId !== userId);
    } else {
      book.likes.push({ userId });
    }

    await book.save();
    res.status(200).send({ book });
  } catch (error) {
    res.status(500).send({ message: "Failed to like book" });
  }
};

// =====================
// RECOMMENDATIONS
// =====================
const getRecommendedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).send({ message: "Book not found" });

    const recommendations = await Book.find({
      category: book.category,
      _id: { $ne: id },
    }).limit(5);

    res.status(200).send({ recommendations });
  } catch (error) {
    res.status(500).send({ message: "Failed to get recommendations" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  updatedBook,
  deleteABook,
  likeBook,
  getRecommendedBooks,
};