import { useState } from "react";

import Dashboard from "./components/Dashboard";
import BookManager from "./components/BookManager";
import MemberManager from "./components/MemberManager";
import TransactionManager from "./components/TransactionManager";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
           Library System
        </div>

        <button
          className={`nav-button ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActivePage("dashboard")}
        >
           Dashboard
        </button>

        <button
          className={`nav-button ${
            activePage === "books" ? "active" : ""
          }`}
          onClick={() => setActivePage("books")}
        >
           Books
        </button>

        <button
          className={`nav-button ${
            activePage === "members" ? "active" : ""
          }`}
          onClick={() => setActivePage("members")}
        >
           Members
        </button>

        <button
          className={`nav-button ${
            activePage === "transactions" ? "active" : ""
          }`}
          onClick={() => setActivePage("transactions")}
        >
           Issue / Return
        </button>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {activePage === "dashboard" && (
  <Dashboard setActivePage={setActivePage} />
)}

        {activePage === "books" && <BookManager />}

        {activePage === "members" && <MemberManager />}

        {activePage === "transactions" && <TransactionManager />}

      </main>

    </div>
  );
}

export default App;