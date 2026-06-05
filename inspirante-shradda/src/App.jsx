import React, { useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import "./index.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogin = (authToken, userData) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Inspirante Portal</h1>
        {user && (
          <div className="user-controls">
            <span>
              Welcome, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : user.role === "admin" ? (
          <AdminDashboard token={token} />
        ) : (
          <StudentDashboard token={token} />
        )}
      </main>
      <footer className="app-footer">
        <p>Inspirante College Portal &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;
