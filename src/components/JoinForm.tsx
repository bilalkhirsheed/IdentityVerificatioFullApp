import React, { useState } from "react";
import BackButton from "./BackButton";

interface JoinFormProps {
  toggleCalendar: (type: string) => void;
  renderCalendar: (type: string) => React.ReactNode;
}

const JoinForm: React.FC<JoinFormProps> = ({
  toggleCalendar,
  renderCalendar,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dto = Object.fromEntries(formData.entries());
    console.log(dto);

    // Prepare DTO for sending to the endpoint
    fetch("/api/join", {
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

  return (
    <div className="form">
      <BackButton />

      <form onSubmit={handleSubmit}>
        <h1 id="formTitle">Join</h1>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Date of Birth</label>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            placeholder="mm/dd/yyyy"
            onClick={() => toggleCalendar("birth")}
            required
          />
          {renderCalendar("birth")}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </span>
          </div>
        </div>
        <button type="submit" className="submitButton">
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
