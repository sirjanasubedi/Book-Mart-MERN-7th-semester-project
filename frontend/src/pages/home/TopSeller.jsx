import React from "react";
import { Link } from "react-router-dom";
import BookCard from "../books/BookCard";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const TopSellers = ({ hideHeader = false }) => {
  const { data, isLoading, isError } = useFetchAllBooksQuery();

  const books = Array.isArray(data?.books) ? data.books : [];
  const filteredBooks = books;

  if (isLoading) {
    return (
      <div className="top-sellers-wrapper">
        <div className="ts-loading">
          <div className="ts-loading-spinner" />
          <p>Loading books…</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="top-sellers-wrapper">
        <div className="ts-error">
          <p>Unable to load books. Please try again.</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <section className="top-sellers-wrapper relative">
      <style>{styles}</style>

      {!hideHeader && (
        <div className="flex justify-end -mt-2 mb-4 px-2 sm:px-0">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition"
          >
            Show All
          </Link>
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div className="ts-empty">
          <span className="ts-empty-icon">📚</span>
          <p className="ts-empty-text">No books found</p>
        </div>
      ) : (
        <div className="ts-books-grid">
          {filteredBooks.slice(0, 4).map((book) => (
            <div key={book._id} className="ts-book-item">
              <BookCard book={book} showActions={false} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* ─── STYLES ────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --ts-ink:      #111827;
    --ts-sub:      #6b7280;
    --ts-accent:   #2563eb;
    --ts-accent-h: #1d4ed8;
    --ts-border:   #e5e7eb;
    --ts-pill-bg:  #f3f4f6;
  }

  /* ── wrapper ── */
  .top-sellers-wrapper {
    background: transparent;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── filter pills row ── */
  .ts-filter-track {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 28px;
  }

  .ts-pill {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--ts-sub);
    background: var(--ts-pill-bg);
    border: 1px solid var(--ts-border);
    border-radius: 100px;
    padding: 6px 16px;
    cursor: pointer;
    transition: background .15s, color .15s, border-color .15s, box-shadow .15s;
    white-space: nowrap;
  }

  .ts-pill:hover {
    color: var(--ts-ink);
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .ts-pill--active {
    color: #fff;
    background: var(--ts-accent);
    border-color: var(--ts-accent);
    box-shadow: 0 2px 8px rgba(37,99,235,.22);
  }

  .ts-pill--active:hover {
    background: var(--ts-accent-h);
    border-color: var(--ts-accent-h);
  }

  /* ── responsive grid ── */
  .ts-books-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 16px;
  }

  @media (min-width: 640px) {
    .ts-books-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
  }

  @media (min-width: 1024px) {
    .ts-books-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
  }

  .ts-book-item { }

  /* ── empty state ── */
  .ts-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 60px 20px;
    text-align: center;
    grid-column: 1 / -1;
  }

  .ts-empty-icon { font-size: 36px; }

  .ts-empty-text {
    font-size: 14px;
    color: var(--ts-sub);
    margin: 0;
  }

  .ts-empty-text strong { color: var(--ts-ink); }

  /* ── loading ── */
  .ts-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 60px 20px;
    color: var(--ts-sub);
    font-size: 14px;
  }

  .ts-loading-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--ts-border);
    border-top-color: var(--ts-accent);
    border-radius: 50%;
    animation: ts-spin .7s linear infinite;
  }

  @keyframes ts-spin { to { transform: rotate(360deg); } }

  /* ── error ── */
  .ts-error {
    text-align: center;
    padding: 40px 20px;
    color: #dc2626;
    font-size: 14px;
  }

  

  /* ── responsive ── */
  @media (max-width: 900px) {
    .ts-books-grid {
      flex-wrap: nowrap;
      gap: 18px;
    }
  }

  @media (max-width: 480px) {
    .top-sellers-wrapper { padding: 28px 0 36px; }
    .ts-books-grid {
      flex-wrap: nowrap;
      gap: 14px;
    }
    .ts-book-item { min-width: 220px; }
  }
`;

export default TopSellers;