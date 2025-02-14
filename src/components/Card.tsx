import React from "react";

interface CardProps {
  type: string;
  icon: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ type, icon, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="imagePlaceholder">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3>{type}</h3>
    </div>
  );
};

export default Card;
