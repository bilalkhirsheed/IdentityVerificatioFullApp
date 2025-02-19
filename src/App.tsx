import React from "react";
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

const App: React.FC = () => {
  return (
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
  );
};

export default App;
