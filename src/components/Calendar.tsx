import React from "react";

interface CalendarProps {
  type: string;
  visible: boolean;
  date: { month: number; year: number };
  selectDate: (type: string, date: string) => void;
  handleMonthChange: (
    type: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  handleYearChange: (
    type: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  type,
  visible,
  date,
  selectDate,
  handleMonthChange,
  handleYearChange,
}) => {
  const { month, year } = date;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      <div
        key={i}
        className="calendarDay"
        onClick={() => selectDate(type, `${month + 1}/${i}/${year}`)}
      >
        {i}
      </div>
    );
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [];
  for (
    let i = new Date().getFullYear();
    i >= new Date().getFullYear() - 100;
    i--
  ) {
    years.push(i);
  }

  return (
    <div className={`calendar ${visible ? "" : "calendarHidden"}`}>
      <div className="calendarHeader">
        <select value={month} onChange={(e) => handleMonthChange(type, e)}>
          {months.map((m, index) => (
            <option key={index} value={index}>
              {m}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => handleYearChange(type, e)}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="calendarGrid">{days}</div>
    </div>
  );
};

export default Calendar;
