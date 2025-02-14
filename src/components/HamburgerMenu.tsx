import React, { useState } from "react";

const HamburgerMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
            <a href="#about" onClick={closeMenu}>
              About Us
            </a>
          </li>
          <li>
            <a href="#join" onClick={closeMenu}>
              Join
            </a>
          </li>
          <li>
            <a href="#login" onClick={closeMenu}>
              Login
            </a>
          </li>
          <li>
            <a href="#contact" onClick={closeMenu}>
              Help &amp; Contact
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;
