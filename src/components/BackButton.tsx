import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate("/");
  };

  // Only show the back button if not on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="topButtonContainer">
      <button type="button" id="backButtonTop" onClick={goBack}>
        <i className="fa fa-arrow-left"></i>
      </button>
    </div>
  );
};

export default BackButton;
