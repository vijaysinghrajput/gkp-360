import { Box, Typography, Grid, CardMedia } from "@mui/material";

export default function BusinessAboutDetails({ business }) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      {business?.logo && (
        <CardMedia
          component="img"
          image={business?.logo}
          alt={`${business?.title} Logo`}
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            mb: 2,
            boxShadow: 2,
          }}
        />
      )}

      {/* Business Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: "1.5rem" }}
      >
        {business?.title}
      </Typography>

      {/* Category */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 2, fontSize: "1rem" }}
      >
        <strong>Category:</strong> {business?.primary_category_name}
      </Typography>

      {/* About Section */}
      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          lineHeight: 1.5,
          maxWidth: "80%",
          fontSize: "0.95rem",
        }}
      >
        {business?.about || "No description available."}
      </Typography>
    </Box>
  );
}
