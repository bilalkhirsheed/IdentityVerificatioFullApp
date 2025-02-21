import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormLogic } from "../hooks/useFormLogic";
import Calendar from "../components/Calendar";
import BackButton from "../components/BackButton";

const FormPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("type");
  const navigate = useNavigate();

  const {
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
  } = useFormLogic();

  useEffect(() => {
    // Primeiro, esconde todos os campos
    const formGroups = document.querySelectorAll(".formGroup");
    formGroups.forEach((group) => {
      group.classList.add("hidden");
    });

    // Mostra os campos comuns
    document.querySelectorAll(".formGroup.common").forEach((group) => {
      group.classList.remove("hidden");
    });

    // Mostra os campos específicos baseado no tipo de formulário
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

    // Mostra os campos do proprietário se a opção "other" estiver selecionada
    if (ownerType === "other") {
      document.querySelectorAll("#ownerFields .formGroup").forEach((group) => {
        group.classList.remove("hidden");
      });
    }
  }, [formType, ownerType]); // Adicione ownerType como dependência

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dto = Object.fromEntries(formData.entries());
    dto.todayDate = new Date().toLocaleDateString();
    console.log(dto);

    // Prepare DTO for sending to the endpoint
    fetch("/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <form
      id="verificationForm"
      method="post"
      action="send_email.php"
      encType="multipart/form-data"
      className={formType ? "" : "hidden"}
      onSubmit={handleSubmit}
    >
      <div>
        <BackButton />
        <h2 id="formTitle">
          {formType && formType.charAt(0).toUpperCase() + formType.slice(1)}
        </h2>
        <div className="formGroup common">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="formGroup common">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div className="formGroup common">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" required />
          <label htmlFor="adressNumber">Adress Number</label>
          <input
            type="number"
            id="adressNumber"
            name="adressNumber"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div className="formGroup common">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="(000) 000-0000"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div className="formGroup common">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
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
          <Calendar
            type="birth"
            visible={calendarVisible["birth"]}
            date={calendarDate["birth"]}
            selectDate={selectDate}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
          />
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
            {/* <div className="formGroup">
              <label htmlFor="ownerAddress">Owner's Address</label>
              <input type="text" id="ownerAddress" name="ownerAddress" />
              <label htmlFor="owneradressNumber">Number</label>
              <input
                type="number"
                id="owneradressNumber"
                name="owneradressNumber"
              />
            </div> */}
            <div className="formGroup">
              <label htmlFor="ownerPhone">Owner's Phone</label>
              <input
                type="tel"
                id="ownerPhone"
                name="ownerPhone"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="(000) 000-0000"
              />
            </div>
            {/* <div className="formGroup">
              <label htmlFor="ownerEmail">Owner's Email</label>
              <input type="email" id="ownerEmail" name="ownerEmail" />
            </div> */}
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
              <input
                type="text"
                id="vin"
                name="vin"
                placeholder="(00000000000000000)"
              />
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
              <br />
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
            <label htmlFor="id">ID or DL (file upload)</label>
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
        <div className="bottomButtonContainer">
          <button type="button" id="backButtonBotton" onClick={goBack}>
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

export default FormPage;
