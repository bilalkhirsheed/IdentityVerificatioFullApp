import React from "react";
import Card from "./Card";

interface CardsProps {
  showForm: (type: string) => void;
}

const Cards: React.FC<CardsProps> = ({ showForm }) => {
  return (
    <div className="cards">
      <Card
        type="Residential"
        icon="home"
        onClick={() => showForm("residential")}
      />
      <Card type="Auto" icon="car" onClick={() => showForm("auto")} />
      <Card
        type="Commercial"
        icon="building"
        onClick={() => showForm("commercial")}
      />
    </div>
  );
};

export default Cards;
