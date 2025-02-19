import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import HamburgerMenu from "./components/HamburgerMenu";
import AboutUs from "./pages/AboutUsPage";
import Join from "./pages/JoinPage";
import Login from "./pages/LoginPage";
import Contact from "./pages/helpContactPage";
import FormPage from "./pages/FormPage";
import { ThemeProvider } from "./context/ThemeContext";

const App: React.FC = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(userPrefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <Router>
        <div>
          <HamburgerMenu />
          <Header />
          <Routes>
            <Route path="/about" element={<AboutUs />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<Cards />} />
            <Route path="/form" element={<FormPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
