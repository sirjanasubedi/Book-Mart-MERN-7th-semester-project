const linearSearchBook = (books, query) => {
  const q = query.toLowerCase();

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    if (
      book?.title?.toLowerCase().includes(q) ||
      book?.author?.toLowerCase().includes(q) ||
      book?.category?.toLowerCase().includes(q)
    ) {
      return book; 
    }
  }

  return null; 
};
