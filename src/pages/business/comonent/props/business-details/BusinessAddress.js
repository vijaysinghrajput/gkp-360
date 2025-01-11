import { Box, Typography, Link, Grid, IconButton } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

export default function BusinessAddress({ business }) {
  const {
    street = "Not specified",
    area = "Not specified",
    city = "Not specified",
    state = "Not specified",
    zip = "Not specified",
    country = "Not specified",
    lat = null,
    lan = null,
  } = business || {}; // Default to empty object to prevent destructuring errors

  const getGoogleMapsLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  return (
    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "1.2rem", mb: 1 }}>
        Address
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>
            <strong>Street:</strong> {street}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <strong>Area:</strong> {area}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>City:</strong> {city}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>State:</strong> {state}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>Zip Code:</strong> {zip}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>Country:</strong> {country}
          </Typography>
        </Grid>
        {lat && lan && (
          <>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Link
                href={getGoogleMapsLink(lat, lan)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "0.9rem",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "#f0f0f0",
                    "&:hover": { bgcolor: "#e0e0e0" },
                    p: 0.5,
                    fontSize: "1rem",
                  }}
                >
                  <MapIcon />
                </IconButton>
                <Typography sx={{ ml: 1 }}>Get Directions</Typography>
              </Link>
            </Grid>
            {/* Embedded Map */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box
                component="iframe"
                sx={{
                  border: 0,
                  width: "100%",
                  height: "200px",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCetgdiWmPHMxtMMAwbnQpQ-ogsMj27EQw&q=${lat},${lan}&zoom=15&maptype=roadmap`}
                allowFullScreen
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
