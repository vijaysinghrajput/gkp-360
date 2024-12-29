import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Grid,
} from "@mui/material";
import { ProjectSetting } from "../config/ProjectSetting";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { user, setUser } = useAuth(); // Use AuthContext

  // Redirect authenticated users to dashboard
  if (user) {
    router.push("/dashboard");
    return null;
  }

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
        // setMessage("Signup successful! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 2000);
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
          Login
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
    </Box>
  );
}
