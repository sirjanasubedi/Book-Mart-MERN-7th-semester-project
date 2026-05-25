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

  const books = Array.isArray(data?.books) ? data.books : [];

  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();
    return (
      (book?.title || "").toLowerCase().includes(search) ||
      (book?.category || "").toLowerCase().includes(search) ||
      (book?.author || "").toLowerCase().includes(search) ||
      (book?.isbn || "").toLowerCase().includes(search)
    );
  });

  const handleDeleteBook = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This book will be permanently deleted!",
        icon: "warning",
        background: "#211f2e",
        color: "#f0eeff",
        showCancelButton: true,
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteBook(id).unwrap();
        await refetch();
        Swal.fire({ title: "Deleted!", text: "Book has been deleted.", icon: "success", background: "#211f2e", color: "#f0eeff" });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({ title: "Error", text: "Failed to delete book.", icon: "error", background: "#211f2e", color: "#f0eeff" });
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#c8bfe0", fontSize: "15px" }}>
        Loading books...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
            Manage Books
          </h2>
          <p style={{ fontSize: "13px", color: "#a89fc0", marginTop: "4px" }}>
            Total Books: <span style={{ color: "#c4b5fd", fontWeight: "600" }}>{books.length}</span>
          </p>
        </div>
        <Link
          to="/dashboard/add-book"
          style={{
            background: "#7c3aed",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          + Add Book
        </Link>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title, category, author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #35314a",
            background: "#211f2e",
            color: "#ffffff",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* TABLE */}
      <div style={{ background: "#211f2e", borderRadius: "12px", border: "1px solid #35314a", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#2a2840", borderBottom: "1px solid #35314a" }}>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>#</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Image</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Title</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Category</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Price</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "#a89fc0", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <tr
                  key={book._id}
                  style={{ borderBottom: "1px solid #2a2840", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#252336"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", color: "#7a7090" }}>{index + 1}</td>

                  <td style={{ padding: "14px 16px" }}>
                    <img
                      src={book.coverImage ? `http://localhost:5000${book.coverImage}` : "/default-book.png"}
                      alt={book.title}
                      style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "8px", border: "1px solid #35314a" }}
                    />
                  </td>

                  <td style={{ padding: "14px 16px", color: "#ffffff", fontWeight: "500" }}>
                    {book.title}
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: "#7c3aed22", color: "#c4b5fd", border: "1px solid #7c3aed44", borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: "500" }}>
                      {book.category}
                    </span>
                  </td>

                  <td style={{ padding: "14px 16px", color: "#34d399", fontWeight: "600" }}>
                    Rs. {book.newPrice}
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        style={{
                          background: "#1e3a5f",
                          color: "#60a5fa",
                          border: "1px solid #2563eb44",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        style={{
                          background: "#3a1a1a",
                          color: "#f87171",
                          border: "1px solid #ef444444",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#7a7090" }}>
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;