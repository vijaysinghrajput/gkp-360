import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";
import { ProjectSetting } from "../config/ProjectSetting";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Enter a valid email address." });
      return;
    }

    try {
      const response = await fetch(
        ProjectSetting.API_URL + "/Website/sendForgotPasswordOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (data.status) {
        setMessage("OTP sent to your email!");
        setStep(2);
      } else {
        setErrors({ general: data.message || "Failed to send OTP." });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const handleVerifyOtpAndReset = async () => {
    setErrors({});
    setMessage("");

    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrors({ general: "All fields are required." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ password: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch(
        ProjectSetting.API_URL + "/Website/resetPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            newPassword: newPassword.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setErrors({ general: data.message || "Failed to reset password." });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          padding: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Forgot Password
        </Typography>
        {message && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}
        {errors.general && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errors.general}
          </Alert>
        )}
        {step === 1 && (
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 3 }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 3 }}
              onClick={handleVerifyOtpAndReset}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
}
