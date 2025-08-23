"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CalendarProps {
  type: string
  visible: boolean
  date: { month: number; year: number }
  selectDate: (type: string, date: string) => void
  handleMonthChange: (type: string, event: React.ChangeEvent<HTMLSelectElement>) => void
  handleYearChange: (type: string, event: React.ChangeEvent<HTMLSelectElement>) => void
}

const Calendar: React.FC<CalendarProps> = ({
  type,
  visible,
  date,
  selectDate,
  handleMonthChange,
  handleYearChange,
}) => {
  const { month, year } = date
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

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
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDateSelect = (day: number) => {
    setSelectedDay(day)
    selectDate(type, `${month + 1}/${day}/${year}`)
  }

  const navigateMonth = (direction: number) => {
    const newMonth = month + direction
    if (newMonth < 0) {
      handleYearChange(type, { target: { value: (year - 1).toString() } } as any)
      handleMonthChange(type, { target: { value: "11" } } as any)
    } else if (newMonth > 11) {
      handleYearChange(type, { target: { value: (year + 1).toString() } } as any)
      handleMonthChange(type, { target: { value: "0" } } as any)
    } else {
      handleMonthChange(type, { target: { value: newMonth.toString() } } as any)
    }
  }

  const renderCalendarDays = () => {
    const days = []

    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <motion.div
          key={`prev-${daysInPrevMonth - i}`}
          className="calendar-day other-month"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {daysInPrevMonth - i}
        </motion.div>,
      )
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <motion.div
          key={day}
          className={`calendar-day ${selectedDay === day ? "selected" : ""}`}
          onClick={() => handleDateSelect(day)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
        >
          {day}
        </motion.div>,
      )
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth)
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <motion.div
          key={`next-${day}`}
          className="calendar-day other-month"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {day}
        </motion.div>,
      )
    }

    return days
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="modern-calendar"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="calendar-header">
            <motion.button
              className="calendar-nav"
              onClick={() => navigateMonth(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-chevron-left"></i>
            </motion.button>

            <div className="calendar-title">
              {months[month]} {year}
            </div>

            <motion.button
              className="calendar-nav"
              onClick={() => navigateMonth(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>

          <div className="calendar-grid">
            {weekDays.map((day) => (
              <div key={day} className="calendar-day" style={{ fontWeight: "bold", cursor: "default" }}>
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Calendar
