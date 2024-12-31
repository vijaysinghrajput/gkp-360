import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { ProjectSetting } from "../config/ProjectSetting";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const { user, setUser } = useAuth(); // Use AuthContext
  const router = useRouter();

  // Redirect authenticated users to dashboard
  if (user) {
    router.push("/dashboard");
    return null;
  }
  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Enter a valid email address." });
      return;
    }

    try {
      const response = await fetch(
        ProjectSetting.API_URL + "/Website/sendOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("otpToken", data.token); // Store token locally
        setOtpSent(true);
        setMessage("OTP sent to your email!");
      } else {
        setErrors({ general: data.message || "Failed to send OTP." });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const token = localStorage.getItem("otpToken");
      const response = await fetch(
        ProjectSetting.API_URL + "/Website/verifyOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, otp }),
        }
      );

      const data = await response.json();

      if (data.status) {
        setOtpVerified(true);
        setMessage("Email verified successfully!");
      } else {
        setErrors({ otp: data.message || "Invalid OTP." });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const validatePassword = (password) => {
    const minLength = 5;
    const hasNumber = /\d/;
    const hasSpecialChar = /[@$!%*?&]/;

    if (password.length < minLength) {
      return "Password must be at least 5 characters long.";
    }
    if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (
      !name.trim() ||
      !password.trim() ||
      password.trim() !== confirmPassword.trim()
    ) {
      setErrors({
        name: !name.trim() ? "Name is required." : "",
        password:
          password.trim() !== confirmPassword.trim()
            ? "Passwords do not match."
            : "",
      });
      return;
    }

    try {
      const response = await fetch(ProjectSetting.API_URL + "/Website/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrors({ general: `Error: ${errorText}` });
        return;
      }

      const data = await response.json();

      if (data.status) {
        setUser(data.data); // Save user data in AuthContext
        localStorage.setItem("authUser", JSON.stringify(data.data));
        setMessage("Signup successful! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setErrors({ general: data.message || "Signup failed." });
      }
    } catch (err) {
      setErrors({ general: `Something went wrong. ${err.message}` });
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
          Sign Up
        </Typography>
        <form onSubmit={handleSignup}>
          {message && (
            <Alert severity="info" sx={{ marginBottom: 2 }}>
              {message}
            </Alert>
          )}
          {errors.general && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errors.general}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
                disabled={otpVerified}
              />
              {!otpSent ? (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              ) : !otpVerified ? (
                <>
                  <TextField
                    label="Enter OTP"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Email verified!
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!otpVerified}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
