import React, { useState } from "react";
import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
} from "../../../redux/features/books/booksApi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageBooks = () => {
  const { data, isLoading, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [searchTerm, setSearchTerm] = useState("");

  // safely get books array
  const books = Array.isArray(data?.books) ? data.books : [];

  // SAFE FILTER (no crashes)
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      (book?.title || "").toLowerCase().includes(search) ||
      (book?.category || "").toLowerCase().includes(search) ||
      (book?.author || "").toLowerCase().includes(search) ||
      (book?.isbn || "").toLowerCase().includes(search)
    );
  });

  // DELETE BOOK
  const handleDeleteBook = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This book will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteBook(id).unwrap();
        await refetch();

        Swal.fire("Deleted!", "Book has been deleted.", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to delete book.", "error");
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="text-center py-10">
        Loading books...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="bg-white rounded-lg shadow-md">

        {/* HEADER */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Manage Books</h2>
          <p className="text-gray-500 text-sm">
            Total Books: {books.length}
          </p>
        </div>

        {/* SEARCH */}
        <div className="p-6 border-b flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          <input
            type="text"
            placeholder="Search books..."
            className="border px-4 py-2 rounded w-full sm:max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            to="/dashboard/add-book"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Book
          </Link>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr key={book._id} className="border-b">

                    <td className="p-3">{index + 1}</td>

                    {/* IMAGE */}
                    <td className="p-3">
                      <img
                        src={
                          book.coverImage
                            ? `http://localhost:5000/${book.coverImage}`
                            : "/default-book.png"
                        }
                        alt={book.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>

                    <td className="p-3 font-medium">
                      {book.title}
                    </td>

                    <td className="p-3">
                      {book.category}
                    </td>

                    <td className="p-3">
                      Rs. {book.newPrice}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 space-x-3">

                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        className="text-blue-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No books found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
