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
import { ProjectSetting } from "../../config/ProjectSetting";

const BusinessListsForBusinessPage = ({ businesses }) => {
  const router = useRouter();

  const handleCardClick = (listing_url, listing_id) => {
    router.push(`/${listing_url}/${listing_id}/business-profile`);
  };

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 150px)", // Dynamic height
        overflowY: "auto", // Scrollable
        padding: 1,
        border: "1px solid #ddd",
        borderRadius: 1,
        backgroundColor: "#f9f9f9",
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
          No businesses found in this category.
        </Typography>
      ) : (
        <Box>
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
                  onClick={() =>
                    handleCardClick(business.listing_url, business.listing_id)
                  }
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
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
                    image={business.logo || ProjectSetting.DEMO_IMG}
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
                        sx={{
                          fontSize: 20,
                          color: "#4CAF50",
                          marginRight: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {business?.primary_category_name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocationOnIcon
                        sx={{
                          fontSize: 20,
                          color: "#4CAF50",
                          marginRight: 1,
                        }}
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

export default BusinessListsForBusinessPage;
