import React, { useState } from "react";
import { Link } from "react-router-dom";

const HamburgerMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    closeMenu();
  };

  return (
    <>
      <div
        className={`hamburger-menu ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
      </div>
      <nav className={`menu ${menuOpen ? "" : "hidden"}`} onClick={closeMenu}>
        <ul onClick={(e) => e.stopPropagation()}>
          <li>
            <Link to="/" onClick={handleHomeClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/join" onClick={closeMenu}>
              Join
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>
              Help &amp; Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;
