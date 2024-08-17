import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Api from "../apis/api";

const Navbar = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleItemClick = (itemName) => {
    setActivePage(itemName);
  };

  const handleLogout = async () => {
    try {
      const response = await Api.post('/api/user/logout');

      if (response.data.success) {
        // Clear user data and redirect
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, handle errors (e.g., show a toast notification)
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" style={{ height: "70px" }} />
      </div>
      <div className="navbar-items">
        <Link
          to="/"
          className={activePage === "home" ? "active" : ""}
          onClick={() => handleItemClick("home")}
        >
          Home
        </Link>
        {/* Add more navigation items if needed */}
      </div>
      <div className="d-flex gap-2" role="search">
        {user ? (
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Welcome, {user.firstName}!
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/forgot-password">
                  Change password
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <button onClick={handleLogin} className="btn btn-outline-danger" type="button">
              Login
            </button>
            <button onClick={handleRegister} className="btn btn-outline-success" type="button">
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;