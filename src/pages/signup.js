import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { auth, setupRecaptcha } from "../firebase"; // Firebase configuration
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ProjectSetting } from "../config/ProjectSetting";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");

    const trimmedMobile = mobile.trim();

    if (!trimmedMobile || !/^[0-9]{10}$/.test(trimmedMobile)) {
      setErrors({ mobile: "Enter a valid 10-digit mobile number." });
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${trimmedMobile}`, // Add country code
        appVerifier
      );

      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      setMessage("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !verificationId) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth.signInWithCredential(credential); // Simulate verification
      setOtpVerified(true);
      setMessage("Mobile number verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName || !trimmedMobile || !trimmedPassword) {
      setErrors({ general: "All fields are required." });
      return;
    }

    const newErrors = {};
    if (!trimmedName) newErrors.name = "Name is required.";
    if (!trimmedPassword) newErrors.password = "Password is required.";
    else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(ProjectSetting.API_URL + "/Website/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          mobile: trimmedMobile,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess(true);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/profile");
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ general: data.message });
      }
    } catch (err) {
      console.error("API Error:", err);
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
          Sign Up
        </Typography>
        <form onSubmit={handleSignup}>
          {success && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Signup successful! You can now log in.
            </Alert>
          )}
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
                variant="outlined"
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
                label="Mobile"
                variant="outlined"
                type="tel"
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                error={!!errors.mobile}
                helperText={errors.mobile}
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
                    variant="outlined"
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
                  Mobile verified!
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                required
                disabled={!otpVerified}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                disabled={!otpVerified}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              marginTop: 3,
              padding: 1.5,
              backgroundColor: otpVerified ? "#4caf50" : "gray",
              "&:hover": { backgroundColor: otpVerified ? "#43a047" : "gray" },
            }}
            disabled={!otpVerified}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
          Already have an account?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            marginTop: 1,
            padding: 1.5,
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": { backgroundColor: "#e8f5e9" },
          }}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </Box>
      <div id="recaptcha-container"></div>
    </Box>
  );
}
