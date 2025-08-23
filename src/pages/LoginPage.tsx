"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import BackButton from "../components/BackButton"

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const dto = { identifier, password, rememberMe }
    console.log("Logging in with", dto)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })
      const data = await response.json()
      console.log("Success:", data)
      // Handle successful login here
    } catch (error) {
      console.error("Error:", error)
      // Handle error here
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="page-container">
      <BackButton />

      <motion.div className="login-container" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="login-header" variants={itemVariants}>
          <div className="login-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </motion.div>

        <motion.form className="login-form" onSubmit={handleLogin} variants={itemVariants}>
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="identifier">Email or Phone Number</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="text"
                id="identifier"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </motion.div>

          <motion.div className="form-options" variants={itemVariants}>
            <label className="checkbox-wrapper">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="loading"></div>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right"></i>
                Sign In
              </>
            )}
          </motion.button>

          <motion.div className="login-divider" variants={itemVariants}>
            <span>or</span>
          </motion.div>

          <motion.div className="social-login" variants={itemVariants}>
            <button type="button" className="social-button google">
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
            <button type="button" className="social-button microsoft">
              <i className="fab fa-microsoft"></i>
              Continue with Microsoft
            </button>
          </motion.div>

          <motion.div className="signup-link" variants={itemVariants}>
            <p>
              Don't have an account?{" "}
              <Link to="/join" className="link">
                Sign up here
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default LoginPage
