import React from "react";
import JoinForm from "../components/JoinForm";
import { useFormLogic } from "../hooks/useFormLogic";

const Join: React.FC = () => {
  const { toggleCalendar, renderCalendar } = useFormLogic();

  return (
    <div className="page">
      <JoinForm
        toggleCalendar={toggleCalendar}
        renderCalendar={renderCalendar}
      />
    </div>
  );
};

export default Join;
