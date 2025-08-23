"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/help", label: "Help & Contact" },
    { path: "/join", label: "Join" },
    { path: "/login", label: "Login" },
  ]

  return (
    <>
      <motion.div
        className="hamburger-menu"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.i
          className={isOpen ? "fas fa-times" : "fas fa-bars"}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          >
            <motion.ul
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link to={item.path} onClick={toggleMenu}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HamburgerMenu
