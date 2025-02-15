import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cards from "./components/Cards";
import Form from "./components/Form";
import Footer from "./components/Footer";
import HamburgerMenu from "./components/HamburgerMenu";
import AboutUs from "./pages/AboutUs";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

const App: React.FC = () => {
  const [formType, setFormType] = useState<string | null>(null);

  const showForm = (type: string) => {
    setFormType(type);
  };

  return (
    <Router>
      <div>
        <HamburgerMenu setFormType={setFormType} />
        <Header />
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/"
            element={
              !formType ? (
                <Cards showForm={showForm} />
              ) : (
                <Form formType={formType} setFormType={setFormType} />
              )
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
