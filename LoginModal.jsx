// src/LoginModal.jsx
import React, { useState, useEffect } from "react";
import "./LoginModal.css";

const LoginModal = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState("details"); // "details" | "otp" | "done"
  const [profileName, setProfileName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // reset when closed
  useEffect(() => {
    if (!open) {
      setStep("details");
      setProfileName("");
      setPhone("");
      setOtp("");
      setSentOtp("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !phone.trim()) return;
    setLoading(true);
    // Fake OTP: generate 4-digit code
    const code = "1234"; // you can change this
    setTimeout(() => {
      setSentOtp(code);
      setLoading(false);
      setStep("otp");
      alert(`Demo OTP for testing: ${code}`);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    setTimeout(() => {
      if (otp === sentOtp) {
        // success
        setLoading(false);
        setStep("done");
        // persist to localStorage
        localStorage.setItem("username", profileName);
        localStorage.setItem("user_phone", phone);
        if (onSuccess) {
          onSuccess({ name: profileName, phone });
        }
      } else {
        setLoading(false);
        alert("Invalid OTP. Try again.");
      }
    }, 500);
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="login-close-btn" onClick={onClose}>
          ✕
        </button>

        {step === "details" && (
          <>
            <h2 className="login-title">Login to Dolsy</h2>
            <p className="login-subtitle">
              Enter your details to continue
            </p>
            <form onSubmit={handleSendOtp} className="login-form">
              <label className="login-label">
                Profile name
                <input
                  type="text"
                  className="login-input"
                  placeholder="Your name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </label>
              <label className="login-label">
                Phone number
                <input
                  type="tel"
                  className="login-input"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="login-primary-btn"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="login-title">Verify OTP</h2>
            <p className="login-subtitle">
              Enter the 4‑digit code sent to your phone
            </p>
            <form onSubmit={handleVerifyOtp} className="login-form">
              <label className="login-label">
                OTP
                <input
                  type="text"
                  className="login-input"
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="login-primary-btn"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                className="login-secondary-btn"
                onClick={() => setStep("details")}
              >
                Edit details
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="login-done">
            <h2 className="login-title">Welcome, {profileName}!</h2>
            <p className="login-subtitle">
              You are now logged in to Dolsy Music.
            </p>
            <button
              className="login-primary-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
