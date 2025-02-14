import React, { useState } from "react";
import Header from "./components/Header";
import Cards from "./components/Cards";
import Form from "./components/Form";
import Footer from "./components/Footer";
import HamburgerMenu from "./components/HamburgerMenu";

const App: React.FC = () => {
  const [formType, setFormType] = useState<string | null>(null);

  const showForm = (type: string) => {
    setFormType(type);
  };

  return (
    <div>
      <HamburgerMenu />
      <Header />
      {!formType && <Cards showForm={showForm} />}
      {formType && <Form formType={formType} setFormType={setFormType} />}
      <Footer />
    </div>
  );
};

export default App;
