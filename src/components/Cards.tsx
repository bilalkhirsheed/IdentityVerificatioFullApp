import React from "react";
import Card from "./Card";

const Cards: React.FC = () => {
  return (
    <div className="cards">
      <Card type="Residential" icon="home" formType="residential" />
      <Card type="Auto" icon="car" formType="auto" />
      <Card type="Commercial" icon="building" formType="commercial" />
    </div>
  );
};

export default Cards;
