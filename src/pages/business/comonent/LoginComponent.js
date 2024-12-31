import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import { ProjectSetting } from "../../../config/ProjectSetting";
import { useAuth } from "../../../context/AuthContext"; // Import AuthContext
import { useRouter } from "next/router";

const LoginComponent = ({ onSuccess, isModal = false, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { setUser } = useAuth(); // Use AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrors({ general: "Email and Password are required." });
      return;
    }

    try {
      const response = await fetch(ProjectSetting.API_URL + "/Website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess(true);
        setUser(data.data); // Save user data in AuthContext
        localStorage.setItem("authUser", JSON.stringify(data.data));

        if (onSuccess) onSuccess(data.data); // Callback for successful login
        if (isModal && onClose) onClose(); // Close modal if in modal mode
      } else {
        setErrors({ general: data.message || "Login failed." });
      }
    } catch (err) {
      console.error("API Error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <Box
      sx={{
        position: isModal ? "absolute" : "relative",
        top: isModal ? "50%" : "auto",
        left: isModal ? "50%" : "auto",
        transform: isModal ? "translate(-50%, -50%)" : "none",
        width: isModal ? 400 : "100%",
        maxWidth: isModal ? "none" : 480,
        padding: 3,
        boxShadow: isModal ? 24 : "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Login to Continue
      </Typography>
      <form onSubmit={handleLogin}>
        {success && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            Login successful! Redirecting...
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
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
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
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#43a047" },
          }}
        >
          Login
        </Button>
      </form>

      <Typography
        variant="body2"
        sx={{
          marginTop: 2,
          textAlign: "right",
          cursor: "pointer",
          color: "#4caf50",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() => router.push("/forgot-password")}
      >
        Forgot Password?
      </Typography>
      <Divider sx={{ marginY: 2 }}>Don't have an account?</Divider>
      <Button
        variant="outlined"
        fullWidth
        sx={{
          padding: 1.5,
          borderColor: "#4caf50",
          color: "#4caf50",
          "&:hover": {
            backgroundColor: "#e8f5e9",
            borderColor: "#4caf50",
          },
        }}
        onClick={() => router.push("/signup")}
      >
        Signup
      </Button>
    </Box>
  );
};

export default LoginComponent;
