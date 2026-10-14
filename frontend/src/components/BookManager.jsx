import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/books";

function BookManager() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    available: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


const filteredBooks = books.filter((book) => {
  const search = searchTerm.toLowerCase();

  return (
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.category.toLowerCase().includes(search) ||
    book.isbn.toLowerCase().includes(search)
  );
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      category: "",
      isbn: "",
      quantity: "",
      available: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookData = {
        ...form,
        quantity: Number(form.quantity),
        available: Number(form.available),
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, bookData);
        alert("Book updated successfully!");
      } else {
        await axios.post(API_URL, bookData);
        alert("Book added successfully!");
      }

      resetForm();
      fetchBooks();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
      available: book.available,
    });

    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      alert("Failed to delete book");
    }
  };

  return (
    <div>
      <h1 className="page-title"> Books</h1>

      <p className="page-subtitle">
        Manage books in the library
      </p>

      {/* Add / Update Form */}
      <div className="section-card">

        <h2>
          {editingId ? "Update Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">

          <input
            name="title"
            placeholder="Book Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            required
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            required
          />

          <input
            name="available"
            type="number"
            placeholder="Available"
            value={form.available}
            onChange={handleChange}
            min="0"
            required
          />

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Books Table */}
      <div className="section-card">

        <div className="section-header">
          <h2>Book List</h2>

          <span className="count-badge">
            {books.length} Books
          </span>
        </div>

        <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search by title, author, category or ISBN..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

        {filteredBooks.length === 0 ? (
          <p>No books match your search.</p>
        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => (
                  <tr key={book._id}>

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.category}</td>

                    <td>{book.isbn}</td>

                    <td>{book.quantity}</td>

                    <td>
                      <span
  className={
    book.available > 0
      ? "status-available"
      : "status-unavailable"
  }
>
  {book.available === 0 ? "Out of Stock" : book.available}
</span>
                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(book._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default BookManager;