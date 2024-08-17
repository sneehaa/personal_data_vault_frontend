import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      return "Email is required";
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      return "Invalid email address";
    }
    return "";
  };

  const validateOtp = (value) => {
    if (!value) {
      return "OTP is required";
    }
    if (value.length !== 6) {
      return "OTP must be 6 digits";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    const upperCase = /[A-Z]/.test(value);
    const lowerCase = /[a-z]/.test(value);
    const number = /\d/.test(value);
    const specialChar = /[!@#$%^&*]/.test(value);
    if (!upperCase || !lowerCase || !number || !specialChar) {
      return "Password must include uppercase, lowercase, number, and special character";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    const emailError = validateEmail(email);
    const otpError = validateOtp(otp);
    const passwordError = validatePassword(password);
    if (emailError || otpError || passwordError) {
      setErrors({ email: emailError, otp: otpError, password: passwordError });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5500/api/verify-otp-and-update-password",
        {
          email,
          otp,
          newPassword: password,
        }
      );
      setMessage(response.data.message);
      toast.success("Password has been updated successfully");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f0f8f4" }}
    >
      <ToastContainer /> {/* ToastContainer to display the toast messages */}
      <div className="col-lg-4 col-md-6 col-sm-8">
        <div
          className="card shadow-lg rounded"
          style={{ border: "1px solid #d0e2d8" }}
        >
          <div className="card-body">
            <h2 className="text-center mb-4" style={{ color: "#006400" }}>
              Reset Password
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-control ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your email"
                  required
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #006400",
                    padding: "10px",
                  }}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                  placeholder="Enter OTP"
                  required
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #006400",
                    padding: "10px",
                  }}
                />
                {errors.otp && (
                  <div className="invalid-feedback">{errors.otp}</div>
                )}
              </div>
              <div className="form-group mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter new password"
                  required
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #006400",
                    padding: "10px",
                  }}
                />
                <div
                  className="position-absolute"
                  style={{
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-success btn-block w-100"
                disabled={loading}
                style={{ borderRadius: "20px", padding: "10px" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
            {message && (
              <p
                className={`mt-3 text-center ${
                  message.includes("Error") ? "text-danger" : "text-success"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
