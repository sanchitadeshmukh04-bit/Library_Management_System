import { useEffect, useState } from "react";
import axios from "axios";

const BOOKS_API = "http://localhost:5000/api/books";
const MEMBERS_API = "http://localhost:5000/api/members";
const TRANSACTIONS_API = "http://localhost:5000/api/transactions";

function TransactionManager() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const fetchData = async () => {
    try {
      const [booksResponse, membersResponse, transactionsResponse] =
        await Promise.all([
          axios.get(BOOKS_API),
          axios.get(MEMBERS_API),
          axios.get(TRANSACTIONS_API),
        ]);

      setBooks(booksResponse.data);
      setMembers(membersResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
  const search = searchTerm.toLowerCase();

  return (
    transaction.book?.title?.toLowerCase().includes(search) ||
    transaction.member?.name?.toLowerCase().includes(search) ||
    transaction.member?.membershipId?.toLowerCase().includes(search) ||
    transaction.status?.toLowerCase().includes(search)
  );
});

  const handleIssue = async (e) => {
    e.preventDefault();

    if (!bookId || !memberId) {
      alert("Please select a book and a member");
      return;
    }

    try {
      await axios.post(`${TRANSACTIONS_API}/issue`, {
        bookId,
        memberId,
      });

      alert("Book issued successfully!");

      setBookId("");
      setMemberId("");

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to issue book"
      );
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      await axios.put(
        `${TRANSACTIONS_API}/return/${transactionId}`
      );

      alert("Book returned successfully!");

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to return book"
      );
    }
  };

  const issuedCount = transactions.filter(
    (transaction) => transaction.status === "Issued"
  ).length;

  const returnedCount = transactions.filter(
    (transaction) => transaction.status === "Returned"
  ).length;

  return (
    <div>
      <h1 className="page-title">📖 Issue & Return</h1>

      <p className="page-subtitle">
        Manage book circulation and transaction history
      </p>

      {/* Transaction Summary */}

      <div className="stats-grid">
        <div className="stat-card">
          <h3> Total Transactions</h3>
          <h2>{transactions.length}</h2>
        </div>

        <div className="stat-card">
          <h3> Currently Issued</h3>
          <h2>{issuedCount}</h2>
        </div>

        <div className="stat-card">
          <h3> Returned</h3>
          <h2>{returnedCount}</h2>
        </div>

        <div className="stat-card">
          <h3> Available Books</h3>
          <h2>
            {books.reduce(
              (total, book) => total + book.available,
              0
            )}
          </h2>
        </div>
      </div>

      {/* Issue Book */}

      <div className="section-card">
        <h2>Issue a Book</h2>

        <p className="page-subtitle">
          Select a book and member to create a new transaction.
        </p>

        <form onSubmit={handleIssue} className="form-grid">
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          >
            <option value="">Select Book</option>

            {books.map((book) => (
              <option
                key={book._id}
                value={book._id}
                disabled={book.available <= 0}
              >
                {book.title} — Available: {book.available}
              </option>
            ))}
          </select>

          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          >
            <option value="">Select Member</option>

            {members.map((member) => (
              <option
                key={member._id}
                value={member._id}
              >
                {member.name} — {member.membershipId}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
            >
              Issue Book
            </button>
          </div>
        </form>
      </div>

      {/* Transaction History */}

      <div className="section-card">
        <div className="section-header">
          <div>
            <h2>Transaction History</h2>

            <p className="page-subtitle">
              View issued and returned books
            </p>
          </div>

          <span className="count-badge">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search by book, member, membership ID or status..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

        {filteredTransactions.length === 0 ? (
  <p>No transactions match your search.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {transaction.book?.title || "Unknown"}
                    </td>

                    <td>
                      {transaction.member?.name || "Unknown"}
                    </td>

                    <td>
                      {new Date(
                        transaction.issueDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {transaction.returnDate
                        ? new Date(
                            transaction.returnDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={
                          transaction.status === "Issued"
                            ? "status-unavailable"
                            : "status-available"
                        }
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td>
                      {transaction.status === "Issued" ? (
                        <button
                          className="primary-button"
                          onClick={() =>
                            handleReturn(transaction._id)
                          }
                        >
                          Return Book
                        </button>
                      ) : (
                        <span className="status-available">
                          Completed
                        </span>
                      )}
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

export default TransactionManager;