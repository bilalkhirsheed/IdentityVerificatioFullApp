import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  type: string;
  icon: string;
  formType: string;
}

const Card: React.FC<CardProps> = ({ type, icon, formType }) => {
  return (
    <Link
      to={`/form?type=${formType}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <div className="imagePlaceholder">
          <i className={`fas fa-${icon}`}></i>
        </div>
        <h3>{type}</h3>
      </div>
    </Link>
  );
};

export default Card;
