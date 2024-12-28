import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Grid,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { ProjectSetting } from "../config/ProjectSetting";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Email or mobile
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      setErrors({ general: "Email/Mobile and Password are required." });
      return;
    }

    try {
      const response = await fetch(ProjectSetting.API_URL + "/Website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: trimmedIdentifier,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess(true);

        // Save user data for authentication
        localStorage.setItem("user", JSON.stringify(data.data));
        console.log("Logged-in User:", data.data);

        // Redirect to the dashboard
        router.push("/dashboard");
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
                label="Email or Mobile"
                variant="outlined"
                fullWidth
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={!!errors.identifier}
                helperText={errors.identifier}
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
          sx={{ marginTop: 2, textAlign: "right", cursor: "pointer" }}
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </Typography>
        <Divider sx={{ marginY: 2 }}>OR</Divider>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: "#DB4437",
            color: "#fff",
            "&:hover": { backgroundColor: "#C33C28" },
          }}
          onClick={() => signIn("google")}
        >
          Login with Google
        </Button>
        <Button
          variant="contained"
          startIcon={<FacebookIcon />}
          fullWidth
          sx={{
            backgroundColor: "#4267B2",
            color: "#fff",
            "&:hover": { backgroundColor: "#365899" },
          }}
          onClick={() => signIn("facebook")}
        >
          Login with Facebook
        </Button>
      </Box>
    </Box>
  );
}
