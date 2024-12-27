import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#2e7d32",
        color: "white",
        textAlign: "center",
        py: 2,
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} GKP 360. All rights reserved.
      </Typography>
    </Box>
  );
}
