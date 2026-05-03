export const getImgUrl = (name) => {
  if (!name) return "/placeholder.png";

  // ✅ Uploaded image from backend (e.g. /uploads/1234567-image.jpg)
  if (name.startsWith("/uploads")) {
    return `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}${name}`;
  }

  // Old local static asset (book-1.png, book-2.png etc.)
  return new URL(`../assets/books/${name}`, import.meta.url).href;
};