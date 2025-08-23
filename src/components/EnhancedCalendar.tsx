"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Birthday {
  name: string
  date: string // Format: "MM-DD"
  color?: string
}

interface EnhancedCalendarProps {
  type: string
  visible: boolean
  date: { month: number; year: number }
  selectDate: (type: string, date: string) => void
  handleMonthChange: (type: string, event: React.ChangeEvent<HTMLSelectElement>) => void
  handleYearChange: (type: string, event: React.ChangeEvent<HTMLSelectElement>) => void
  birthdays?: Birthday[]
}

const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  type,
  visible,
  date,
  selectDate,
  handleMonthChange,
  handleYearChange,
  birthdays = [],
}) => {
  const { month, year } = date
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [currentDate] = useState(new Date())

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

  // Sample birthdays data - you can replace this with real data
  const sampleBirthdays: Birthday[] = [
    { name: "John Doe", date: "01-15", color: "#ff6b6b" },
    { name: "Jane Smith", date: "01-22", color: "#4ecdc4" },
    { name: "Mike Johnson", date: "02-08", color: "#45b7d1" },
    { name: "Sarah Wilson", date: "02-14", color: "#f9ca24" },
    { name: "David Brown", date: "03-10", color: "#6c5ce7" },
    { name: "Emily Davis", date: "03-25", color: "#fd79a8" },
    ...birthdays,
  ]

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

  const getBirthdaysForDay = (day: number) => {
    const dateStr = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return sampleBirthdays.filter((birthday) => birthday.date === dateStr)
  }

  const isToday = (day: number) => {
    return currentDate.getDate() === day && currentDate.getMonth() === month && currentDate.getFullYear() === year
  }

  const renderCalendarDays = () => {
    const days = []

    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <motion.div
          key={`prev-${daysInPrevMonth - i}`}
          className="calendar-day other-month"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {daysInPrevMonth - i}
        </motion.div>,
      )
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBirthdays = getBirthdaysForDay(day)
      const isCurrentDay = isToday(day)

      days.push(
        <motion.div
          key={day}
          className={`calendar-day ${selectedDay === day ? "selected" : ""} ${isCurrentDay ? "today" : ""}`}
          onClick={() => handleDateSelect(day)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
        >
          <div className="day-number">{day}</div>
          {isCurrentDay && <div className="today-indicator">Today</div>}
          {dayBirthdays.length > 0 && (
            <div className="birthday-indicators">
              {dayBirthdays.slice(0, 3).map((birthday, index) => (
                <div
                  key={index}
                  className="birthday-dot"
                  style={{ backgroundColor: birthday.color }}
                  title={`${birthday.name}'s Birthday`}
                />
              ))}
              {dayBirthdays.length > 3 && <div className="birthday-more">+{dayBirthdays.length - 3}</div>}
            </div>
          )}
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
        </motion.div>,
      )
    }

    return days
  }

  const getTodaysBirthdays = () => {
    const today = new Date()
    const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    return sampleBirthdays.filter((birthday) => birthday.date === todayStr)
  }

  const getUpcomingBirthdays = () => {
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()

    return sampleBirthdays
      .filter((birthday) => {
        const [birthMonth, birthDay] = birthday.date.split("-").map(Number)
        if (birthMonth === currentMonth) {
          return birthDay > currentDay
        }
        return birthMonth === currentMonth + 1 || (currentMonth === 12 && birthMonth === 1)
      })
      .slice(0, 3)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="enhanced-calendar"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Calendar Header */}
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
              <h3>
                {months[month]} {year}
              </h3>
              <div className="current-date">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
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

          {/* Today's Birthdays */}
          {getTodaysBirthdays().length > 0 && (
            <motion.div
              className="todays-birthdays"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4>🎉 Today's Birthdays</h4>
              <div className="birthday-list">
                {getTodaysBirthdays().map((birthday, index) => (
                  <div key={index} className="birthday-item">
                    <div className="birthday-dot" style={{ backgroundColor: birthday.color }}></div>
                    <span>{birthday.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {weekDays.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {/* Upcoming Birthdays */}
          {getUpcomingBirthdays().length > 0 && (
            <motion.div
              className="upcoming-birthdays"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4>🎂 Upcoming Birthdays</h4>
              <div className="birthday-list">
                {getUpcomingBirthdays().map((birthday, index) => (
                  <div key={index} className="birthday-item">
                    <div className="birthday-dot" style={{ backgroundColor: birthday.color }}></div>
                    <span>{birthday.name}</span>
                    <span className="birthday-date">{birthday.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EnhancedCalendar
