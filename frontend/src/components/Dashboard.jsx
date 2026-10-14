import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BOOKS_API = "http://localhost:5000/api/books";
const MEMBERS_API = "http://localhost:5000/api/members";
const TRANSACTIONS_API = "http://localhost:5000/api/transactions";

function Dashboard({ setActivePage }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksRes, membersRes, transactionsRes] =
          await Promise.all([
            axios.get(BOOKS_API),
            axios.get(MEMBERS_API),
            axios.get(TRANSACTIONS_API),
          ]);

        setBooks(booksRes.data);
        setMembers(membersRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Dashboard data error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalBooks = books.reduce(
    (total, book) => total + book.quantity,
    0
  );

  const availableBooks = books.reduce(
    (total, book) => total + book.available,
    0
  );

  const issuedBooks = transactions.filter(
    (transaction) => transaction.status === "Issued"
  ).length;

  const returnedBooks = transactions.filter(
    (transaction) => transaction.status === "Returned"
  ).length;

  /* =====================================================
     CATEGORY DATA
     ===================================================== */

  const categoryData = Object.values(
    books.reduce((acc, book) => {
      if (!acc[book.category]) {
        acc[book.category] = {
          category: book.category,
          books: 0,
        };
      }

      acc[book.category].books += book.quantity;

      return acc;
    }, {})
  );

  /* =====================================================
     AVAILABILITY DATA
     ===================================================== */

  const availabilityData = [
    {
      name: "Available",
      value: availableBooks,
    },
    {
      name: "Issued",
      value: totalBooks - availableBooks,
    },
  ];

  /* =====================================================
     TRANSACTION DATA
     ===================================================== */

  const transactionData = [
    {
      status: "Issued",
      count: issuedBooks,
    },
    {
      status: "Returned",
      count: returnedBooks,
    },
  ];

  /* =====================================================
     CUSTOM TOOLTIP
     ===================================================== */

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div
        style={{
          background: "rgba(17, 24, 39, 0.96)",
          padding: "12px 15px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.22)",
          color: "white",
        }}
      >
        <p
          style={{
            margin: "0 0 5px",
            fontSize: "12px",
            color: "#c7d2fe",
            fontWeight: 600,
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 800,
          }}
        >
          {payload[0].value}
        </p>
      </div>
    );
  };

  /* =====================================================
     CHART COLORS
     ===================================================== */

  const categoryColors = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
  ];

  const availabilityColors = [
    "#10b981",
    "#f97316",
  ];

  const transactionColors = [
    "#6366f1",
    "#10b981",
  ];

  return (
    <div>

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            Library Management Dashboard
          </h1>

          <p className="page-subtitle">
            Monitor books, members and library circulation
            from one place.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </div>

      {/* =================================================
          STAT CARDS
          ================================================= */}

      <div className="stats-grid">

        <div className="stat-card premium-stat-card">
          <div className="stat-top">
           
              

            <span className="stat-label">
              Library
            </span>
          </div>

          <h3>Total Books</h3>

          <h2>{totalBooks}</h2>

          <p className="stat-description">
            Books in inventory
          </p>
        </div>


        <div className="stat-card premium-stat-card">
          <div className="stat-top">
            

            <span className="stat-label">
              Users
            </span>
          </div>

          <h3>Members</h3>

          <h2>{members.length}</h2>

          <p className="stat-description">
            Registered members
          </p>
        </div>


        <div className="stat-card premium-stat-card">
          <div className="stat-top">
            

            <span className="stat-label">
              Circulation
            </span>
          </div>

          <h3>Issued Books</h3>

          <h2>{issuedBooks}</h2>

          <p className="stat-description">
            Currently borrowed
          </p>
        </div>


        <div className="stat-card premium-stat-card">
          <div className="stat-top">
            

            <span className="stat-label">
              Inventory
            </span>
          </div>

          <h3>Available Books</h3>

          <h2>{availableBooks}</h2>

          <p className="stat-description">
            Ready to issue
          </p>
        </div>

      </div>


      {/* =================================================
          QUICK ACTIONS
          ================================================= */}

      <div className="section-card premium-section">

        <div className="section-header">

          <div>
            <h2>Quick Actions</h2>

            <p className="section-description">
              Access common library operations quickly.
            </p>
          </div>

        </div>


        <div className="quick-actions">

          <div
            className="quick-action-card premium-action"
            onClick={() => setActivePage("books")}
          >
           

            <div>
              <h3>Manage Books</h3>

              <p>
                Add, update, search or remove books.
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </div>


          <div
            className="quick-action-card premium-action"
            onClick={() => setActivePage("members")}
          >
           

            <div>
              <h3>Manage Members</h3>

              <p>
                Manage registered library members.
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </div>


          <div
            className="quick-action-card premium-action"
            onClick={() => setActivePage("transactions")}
          >
            

            <div>
              <h3>Issue & Return</h3>

              <p>
                Manage book circulation.
              </p>
            </div>

            <span className="action-arrow">
              →
            </span>
          </div>

        </div>
      </div>


      {/* =================================================
          CHARTS
          ================================================= */}

      <div className="charts-grid">


        {/* BOOKS BY CATEGORY */}

        <div className="section-card premium-chart-card">

          <div className="chart-header">

            <div>
              <h2> Books by Category</h2>

              <p>
                Distribution of books across categories
              </p>
            </div>

            <div className="chart-badge">
              Categories
            </div>

          </div>


          <div
            style={{
              width: "100%",
              height: 320,
              marginTop: 15,
            }}
          >

            <ResponsiveContainer>
              <BarChart
                data={categoryData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >

                <defs>
                  <linearGradient
                    id="categoryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#818cf8"
                    />

                    <stop
                      offset="100%"
                      stopColor="#4f46e5"
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#eef2f7"
                  vertical={false}
                />

                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(99,102,241,0.06)",
                  }}
                />

                <Bar
                  dataKey="books"
                  name="Books"
                  fill="url(#categoryGradient)"
                  radius={[9, 9, 2, 2]}
                  barSize={42}
                >

                  {categoryData.map(
                    (entry, index) => (
                      <Cell
                        key={`category-${index}`}
                        fill={
                          categoryColors[
                            index %
                              categoryColors.length
                          ]
                        }
                      />
                    )
                  )}

                </Bar>

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* AVAILABILITY */}

        <div className="section-card premium-chart-card">

          <div className="chart-header">

            <div>
              <h2> Book Availability</h2>

              <p>
                Current inventory availability
              </p>
            </div>

            <div className="chart-badge green-badge">
              Live
            </div>

          </div>


          <div
            style={{
              width: "100%",
              height: 320,
              marginTop: 15,
            }}
          >

            <ResponsiveContainer>

              <BarChart
                data={availabilityData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >

                <defs>

                  <linearGradient
                    id="availabilityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#34d399"
                    />

                    <stop
                      offset="100%"
                      stopColor="#059669"
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#eef2f7"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(16,185,129,0.06)",
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Books"
                  radius={[10, 10, 2, 2]}
                  barSize={55}
                >

                  {availabilityData.map(
                    (entry, index) => (
                      <Cell
                        key={`availability-${index}`}
                        fill={
                          availabilityColors[
                            index
                          ]
                        }
                      />
                    )
                  )}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* TRANSACTIONS */}

        <div className="section-card premium-chart-card">

          <div className="chart-header">

            <div>
              <h2> Transaction Status</h2>

              <p>
                Overview of book circulation activity
              </p>
            </div>

            <div className="chart-badge purple-badge">
              Activity
            </div>

          </div>


          <div
            style={{
              width: "100%",
              height: 320,
              marginTop: 15,
            }}
          >

            <ResponsiveContainer>

              <BarChart
                data={transactionData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#eef2f7"
                  vertical={false}
                />

                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(139,92,246,0.06)",
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Transactions"
                  radius={[10, 10, 2, 2]}
                  barSize={55}
                >

                  {transactionData.map(
                    (entry, index) => (
                      <Cell
                        key={`transaction-${index}`}
                        fill={
                          transactionColors[
                            index
                          ]
                        }
                      />
                    )
                  )}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =================================================
          RECENT TRANSACTIONS
          ================================================= */}

      <div className="section-card premium-section">

        <div className="section-header">

          <div>
            <h2>Recent Transactions</h2>

            <p className="section-description">
              Latest book circulation activity
            </p>
          </div>

          <span className="count-badge">
            {transactions.length} Total
          </span>

        </div>


        {transactions.length === 0 ? (

          <div className="empty-state">
           

            <h3>No transactions yet</h3>

            <p>
              Book issue and return activity will
              appear here.
            </p>
          </div>

        ) : (

          <div className="table-container">

            <table className="data-table">

              <thead>

                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {transactions
                  .slice(0, 5)
                  .map((transaction) => (

                    <tr key={transaction._id}>

                      <td>
                        <strong>
                          {transaction.book?.title ||
                            "Unknown"}
                        </strong>
                      </td>

                      <td>
                        {transaction.member?.name ||
                          "Unknown"}
                      </td>

                      <td>
                        {new Date(
                          transaction.issueDate
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <span
                          className={
                            transaction.status ===
                            "Issued"
                              ? "transaction-status issued-status"
                              : "transaction-status returned-status"
                          }
                        >
                          {transaction.status}
                        </span>

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

export default Dashboard;