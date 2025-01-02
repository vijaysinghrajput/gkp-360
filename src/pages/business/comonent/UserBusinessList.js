import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LaunchIcon from "@mui/icons-material/Launch";
import { useAuth } from "../../../context/AuthContext";
import { ProjectSetting } from "../../../config/ProjectSetting";
import { useRouter } from "next/router";
import axios from "axios";

function UserBusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.post(
          `${ProjectSetting.APP_API_URL}/Job/getUserBusinesses`,
          { user_id: user.id }
        );
        if (response.data.status === "success") {
          setBusinesses(response.data.data || []);
        } else {
          setError(response.data.message || "Failed to fetch businesses.");
        }
      } catch (err) {
        setError("An error occurred while fetching businesses.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBusinesses();
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Ensure full-screen loader
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", marginTop: 4 }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          marginBottom: "16px", // Space below the title
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginTop: "8px", // Reduce the top margin
        }}
      >
        My Businesses
      </Typography>

      <Grid container spacing={2}>
        {businesses.map((business) => (
          <Grid item xs={12} sm={6} md={4} key={business.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", // Subtle shadow
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Business Logo */}
              <CardMedia
                component="img"
                height="140"
                image={business?.logo || "https://via.placeholder.com/150"}
                alt={business.title}
                sx={{
                  objectFit: "cover", // Ensure consistent image scaling
                }}
              />
              {/* Business Details */}
              <CardContent sx={{ padding: "16px" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  {business.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: "4px" }}
                >
                  <strong>Address:</strong> {business.full_address}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: "4px" }}
                >
                  <strong>Contact:</strong> {business.primary_number}
                </Typography>
              </CardContent>
              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px 16px",
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  startIcon={<LaunchIcon />}
                  onClick={() =>
                    window.open(
                      `/business/${business.id}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Visit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    router.push(
                      `/business/lists?listing_id=${business.listing_id}`
                    )
                  }
                >
                  Details
                </Button>
                <IconButton
                  size="small"
                  color="default"
                  onClick={() => alert(`Editing ${business.title}`)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default UserBusinessList;
