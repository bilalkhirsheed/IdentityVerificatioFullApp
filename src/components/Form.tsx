import React, { useState, useEffect } from "react";

interface FormProps {
  formType: string | null;
  setFormType: (type: string | null) => void;
}

const Form: React.FC<FormProps> = ({ formType, setFormType }) => {
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

  useEffect(() => {
    // Logic to show/hide form fields based on formType
    const formGroups = document.querySelectorAll(".formGroup");
    formGroups.forEach((group) => {
      group.classList.add("hidden");
    });

    if (formType === "residential" || formType === "commercial") {
      document
        .querySelectorAll("#resCommFields .formGroup")
        .forEach((group) => {
          group.classList.remove("hidden");
        });
    } else if (formType === "auto") {
      document.querySelectorAll("#autoFields .formGroup").forEach((group) => {
        group.classList.remove("hidden");
      });
    }

    document.querySelectorAll(".formGroup.common").forEach((group) => {
      group.classList.remove("hidden");
    });
  }, [formType]);

  const goBack = () => {
    setFormType(null);
  };

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
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[id];
      return newPreviews;
    });
    (document.getElementById(id) as HTMLInputElement).value = "";
  };

  const toggleCalendar = (type: string) => {
    setCalendarVisible((prev) => ({ ...prev, [type]: !prev[type] }));
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
    setCalendarDate((prev) => ({ ...prev, [type]: { ...prev[type], year } }));
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

  return (
    <form
      id="verificationForm"
      method="post"
      action="send_email.php"
      encType="multipart/form-data"
      className={formType ? "" : "hidden"}
    >
      <div>
        <div className="buttonContainer">
          <button type="button" className="backButton" onClick={goBack}>
            Back
          </button>
        </div>
        <h2 id="formTitle">
          {formType && formType.charAt(0).toUpperCase() + formType.slice(1)}
        </h2>
        <div className="formGroup common">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required />
        </div>
        <div className="formGroup common">
          <label htmlFor="serviceAddress">Service Address</label>
          <input
            type="text"
            id="serviceAddress"
            name="serviceAddress"
            required
          />
        </div>
        <div className="formGroup common">
          <label htmlFor="homeAddress">Home Address</label>
          <input type="text" id="homeAddress" name="homeAddress" required />
        </div>
        <div className="formGroup common">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            inputMode="numeric"
          />
        </div>
        <div className="formGroup common">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="formGroup common">
          <label htmlFor="todayDate">Today's Date</label>
          <input
            type="text"
            id="todayDate"
            name="todayDate"
            placeholder="mm/dd/yyyy"
            readOnly
            onClick={() => toggleCalendar("today")}
          />
          {renderCalendar("today")}
        </div>
        <div className="formGroup common">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            placeholder="mm/dd/yyyy"
            readOnly
            onClick={() => toggleCalendar("birth")}
          />
          {renderCalendar("birth")}
        </div>
        <div className="formGroup common">
          <label htmlFor="ownerType">Ownership</label>
          <select
            id="ownerType"
            name="ownerType"
            onChange={handleOwnerTypeChange}
          >
            <option value="">Select...</option>
            <option value="myself">Myself</option>
            <option value="other">Other</option>
          </select>
        </div>
        {ownerType === "other" && (
          <div id="ownerFields">
            <div className="formGroup">
              <label htmlFor="ownerFullName">Owner's Name</label>
              <input type="text" id="ownerFullName" name="ownerFullName" />
            </div>
            <div className="formGroup">
              <label htmlFor="ownerAddress">Owner's Address</label>
              <input type="text" id="ownerAddress" name="ownerAddress" />
            </div>
            <div className="formGroup">
              <label htmlFor="ownerPhone">Owner's Phone</label>
              <input type="tel" id="ownerPhone" name="ownerPhone" />
            </div>
            <div className="formGroup">
              <label htmlFor="ownerEmail">Owner's Email</label>
              <input type="email" id="ownerEmail" name="ownerEmail" />
            </div>
          </div>
        )}
        {formType === "auto" && (
          <div id="autoFields">
            <div className="formGroup">
              <label htmlFor="aaaId">
                AAA <br />
                <small>
                  (If you do not have an AAA membership please leave this field
                  blank)
                </small>
              </label>
              <input type="text" id="aaaId" name="aaaId" />
            </div>
            <div className="formGroup">
              <label htmlFor="insurancePolicy">Insurance Policy Number</label>
              <input type="text" id="insurancePolicy" name="insurancePolicy" />
            </div>
            <div className="formGroup">
              <label htmlFor="vin">VIN</label>
              <input type="text" id="vin" name="vin" />
            </div>
            <div className="fileUploadContainer">
              <label htmlFor="registration" className="centered-label">
                Registration (file upload)
              </label>
              <input
                type="file"
                id="registration"
                name="registration"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["registration"] && (
                <div className="filePreview">
                  <span className="fileName">
                    {filePreviews["registration"]}
                  </span>
                  <button
                    type="button"
                    className="deleteFile"
                    onClick={() => clearFileInput("registration")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div className="fileUploadContainer">
              <label htmlFor="licensePlate" className="centered-label">
                License Plate Photo (file upload)
              </label>
              <input
                type="file"
                id="licensePlate"
                name="licensePlate"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["licensePlate"] && (
                <div className="filePreview">
                  <span className="fileName">
                    {filePreviews["licensePlate"]}
                  </span>
                  <button
                    type="button"
                    className="deleteFile"
                    onClick={() => clearFileInput("licensePlate")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {(formType === "residential" || formType === "commercial") && (
          <div id="resCommFields">
            <div className="formGroup">
              <label htmlFor="propertyType">Property Type</label>
              <select id="propertyType" name="propertyType">
                <option value="">Select...</option>
                <option value="singleFamily">Single-family</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div className="fileUploadContainer">
              <label htmlFor="proofOfResidency" className="centered-label">
                Proof of Residency
              </label>
              <small>(e.g., mail or bill matching info)</small>
              <input
                type="file"
                id="proofOfResidency"
                name="proofOfResidency"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["proofOfResidency"] && (
                <div className="filePreview">
                  <span className="fileName">
                    {filePreviews["proofOfResidency"]}
                  </span>
                  <button
                    type="button"
                    className="deleteFile"
                    onClick={() => clearFileInput("proofOfResidency")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="formGroup common">
          <div className="fileUploadContainer">
            <label htmlFor="id">DL or ID (file upload)</label>
            <input
              type="file"
              id="id"
              name="id"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
            {filePreviews["id"] && (
              <div className="filePreview">
                <span className="fileName">{filePreviews["id"]}</span>
                <button
                  type="button"
                  className="deleteFile"
                  onClick={() => clearFileInput("id")}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="formGroup common">
          <label htmlFor="techId">
            Reference code <br />
            <small>(consult for details if not provided)</small>
          </label>
          <input type="text" id="techId" name="techId" required />
        </div>
        <div className="buttonContainer">
          <button type="button" className="backButton" onClick={goBack}>
            Back
          </button>
          <button type="submit" className="submitButton">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
