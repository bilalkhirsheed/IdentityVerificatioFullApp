import { useState, useEffect } from "react";

export const useFormLogic = () => {
  const [ownerType, setOwnerType] = useState<string>("");
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>(
    {}
  );
  const [calendarVisible, setCalendarVisible] = useState<{
    [key: string]: boolean;
  }>({
    today: false,
    birth: false,
  });
  const [calendarDate, setCalendarDate] = useState<{
    [key: string]: { month: number; year: number };
  }>({
    today: { month: new Date().getMonth(), year: new Date().getFullYear() },
    birth: { month: new Date().getMonth(), year: new Date().getFullYear() },
  });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const calendarElements = document.querySelectorAll(".calendar");
      let isClickInside = false;
      calendarElements.forEach((calendar) => {
        if (calendar.contains(event.target as Node)) {
          isClickInside = true;
        }
      });
      if (!isClickInside) {
        setCalendarVisible({ today: false, birth: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    };

    if (!isScriptLoaded) {
      loadGoogleMapsScript();
    }
  }, [isScriptLoaded]);

  const handleOwnerTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOwnerType(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = event.target;
    if (files && files.length > 0) {
      setFilePreviews((prev) => ({ ...prev, [id]: files[0].name }));
    }
  };

  const clearFileInput = (id: string) => {
    setFilePreviews((prev: { [key: string]: string }) => {
      const newPreviews = { ...prev };
      delete newPreviews[id];
      return newPreviews;
    });
    (document.getElementById(id) as HTMLInputElement).value = "";
  };

  const toggleCalendar = (type: string) => {
    setCalendarVisible((prev: { [key: string]: boolean }) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const selectDate = (type: string, date: string) => {
    (document.getElementById(`${type}Date`) as HTMLInputElement).value = date;
    toggleCalendar(type);
  };

  const handleMonthChange = (
    type: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const month = parseInt(event.target.value);
    setCalendarDate((prev) => ({ ...prev, [type]: { ...prev[type], month } }));
  };

  const handleYearChange = (
    type: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const year = parseInt(event.target.value);
    setCalendarDate(
      (prev: { [key: string]: { month: number; year: number } }) => ({
        ...prev,
        [type]: { ...prev[type], year },
      })
    );
  };

  const renderCalendar = (type: string) => {
    const { month, year } = calendarDate[type];
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
      <div
        className={`calendar ${calendarVisible[type] ? "" : "calendarHidden"}`}
      >
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

  const initializeAutocomplete = (inputId: string) => {
    if (isScriptLoaded) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            input.value = place.formatted_address;
          }
        });
      }
    }
  };

  return {
    ownerType,
    filePreviews,
    calendarVisible,
    calendarDate,
    handleOwnerTypeChange,
    handleFileUpload,
    clearFileInput,
    toggleCalendar,
    selectDate,
    handleMonthChange,
    handleYearChange,
    renderCalendar,
    initializeAutocomplete,
  };
};
