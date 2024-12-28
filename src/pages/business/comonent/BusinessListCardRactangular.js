import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import { useRouter } from "next/router";

const BusinessListCardRectangular = ({
  categoryName,
  businesses,
  city,
  state,
}) => {
  const router = useRouter();

  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const handleCardClick = (businessId) => {
    router.push(`/business/${businessId}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        textAlign: "left",
      }}
    >
      {businesses.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            color: "#666",
            textAlign: "center",
            padding: "16px",
            fontStyle: "italic",
          }}
        >
          No business listings available in this category.
        </Typography>
      ) : (
        <Box>
          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              marginBottom: "16px",
              textAlign: "left",
              color: "#333",
            }}
          >
            Top {categoryName} in {toTitleCase(city)}, {toTitleCase(state)}
          </Typography>

          {/* Business Cards */}
          <Grid container spacing={3}>
            {businesses.map((business) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={business.id}
                sx={{
                  display: "flex",
                }}
              >
                <Card
                  onClick={() => handleCardClick(business.id)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 5,
                    },
                    width: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                    }}
                    image={
                      business.logo ||
                      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                    }
                    alt={business.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ marginBottom: "8px" }}
                    >
                      {business.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <BusinessIcon
                        sx={{ fontSize: 20, color: "#4CAF50", marginRight: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {categoryName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: 20, color: "#4CAF50", marginRight: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {business.full_address}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default BusinessListCardRectangular;