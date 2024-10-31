// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import OtherPage from "./OtherPage";
import "./App.css";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchInput) {
      navigate(`/other/${searchInput}`);
    }
  };

  return (
    <div className="main">
      {/* Header Section */}
      <header className="header">
        <div className="logo">Etherscan</div>
        <nav className="menu">
          <Link to="/">Home</Link>
          <Link to="/other">Other Page</Link>
          <Link to="/blockchain">Blockchain</Link>
          <Link to="/tokens">Tokens</Link>
          <Link to="/nfts">NFTs</Link>
          <Link to="/resources">Resources</Link>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Address / Txn Hash / Block"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other/:contractAddress" element={<OtherPage />} />
      </Routes>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 Etherscan. All Rights Reserved.</p>
        <p>
          <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
