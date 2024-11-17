import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import Home from "./Home.js";
import Auth from "./Auth.js";
import Dashboard from "./Dashboard.js";
import OtherPage from "./OtherPage.js";
import NFTPage from "./NFTPage.js";
import "./App.css";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchInput) {
      navigate(`/other/${searchInput}`);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <div className="main">
      {!isAuthenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <header className="header">
            <div className="logo">Etherscan</div>
            <nav className="menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/nfts" className="nav-link">NFTs</Link>
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

          {loading && <div className="loading-indicator">Loading...</div>}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={<Dashboard startLoading={startLoading} stopLoading={stopLoading} />}
            />
            <Route path="/other/:contractAddress" element={<OtherPage />} />
            <Route path="/nfts" element={<NFTPage />} />
          </Routes>

          <footer className="footer">
            <p>© 2024 Etherscan. All Rights Reserved.</p>
            <p>
              <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
            </p>
          </footer>
        </>
      )}
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
