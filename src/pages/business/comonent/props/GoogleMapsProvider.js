import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Box, CircularProgress, Typography } from "@mui/material";

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError) {
    return <Typography>Error loading Google Maps</Typography>;
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsProvider;
