require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./src/books/book.model");

async function seedBooks() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");

    // Clear existing books
    await Book.deleteMany({});
    console.log("Cleared existing books");

    // Sample books data
    const books = [
      {
        title: "The Great Gatsby",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        category: "Fiction",
        trending: true,
        coverImage: "book-1.png",
        oldPrice: 29.99,
        newPrice: 19.99
      },
      {
        title: "To Kill a Mockingbird",
        description: "Harper Lee's Pulitzer Prize-winning novel about racial injustice and childhood innocence in the American South.",
        category: "Fiction",
        trending: true,
        coverImage: "book-2.png",
        oldPrice: 24.99,
        newPrice: 14.99
      },
      {
        title: "1984",
        description: "George Orwell's dystopian masterpiece about totalitarianism, surveillance, and the power of language.",
        category: "Fiction",
        trending: true,
        coverImage: "book-3.png",
        oldPrice: 19.99,
        newPrice: 12.99
      },
      {
        title: "Pride and Prejudice",
        description: "Jane Austen's beloved romance novel about Elizabeth Bennet and Mr. Darcy in Regency England.",
        category: "Romance",
        trending: false,
        coverImage: "book-4.png",
        oldPrice: 22.99,
        newPrice: 16.99
      },
      {
        title: "The Catcher in the Rye",
        description: "J.D. Salinger's coming-of-age story following Holden Caulfield's journey through New York City.",
        category: "Fiction",
        trending: true,
        coverImage: "book-5.png",
        oldPrice: 18.99,
        newPrice: 11.99
      },
      {
        title: "Harry Potter and the Sorcerer's Stone",
        description: "J.K. Rowling's magical tale of a young wizard's adventures at Hogwarts School of Witchcraft and Wizardry.",
        category: "Fantasy",
        trending: true,
        coverImage: "book-6.png",
        oldPrice: 25.99,
        newPrice: 17.99
      },
      {
        title: "The Lord of the Rings",
        description: "J.R.R. Tolkien's epic fantasy trilogy about the quest to destroy the One Ring.",
        category: "Fantasy",
        trending: false,
        coverImage: "book-7.png",
        oldPrice: 39.99,
        newPrice: 29.99
      },
      {
        title: "Dune",
        description: "Frank Herbert's science fiction masterpiece set on the desert planet Arrakis.",
        category: "Science Fiction",
        trending: true,
        coverImage: "book-8.png",
        oldPrice: 27.99,
        newPrice: 19.99
      },
      {
        title: "Priya Sufi",
        description: "Priya Sufi is a novel by Subin Bhattarai that explores themes of life, relationships, and the importance of self-love, particularly in the context of rising suicide rates.",
        category: "Novel",
        trending: true,
        coverImage: "book-20.png",
        oldPrice: 120,
        newPrice: 100
      },
    ];

    // Insert books
    const insertedBooks = await Book.insertMany(books);
    console.log(`Successfully seeded ${insertedBooks.length} books`);

    mongoose.disconnect();
    console.log("Database connection closed");

  } catch (error) {
    console.error("Error seeding books:", error);
    mongoose.disconnect();
  }
}

seedBooks();