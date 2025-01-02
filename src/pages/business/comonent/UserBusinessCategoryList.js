import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Grid, Paper } from "@mui/material";
import { ProjectSetting } from "../../../config/ProjectSetting";

function UserBusinessCategoryList({ listing_id }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing_id: listing_id }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setCategories(result.data || []);
        setError(null);
      } else {
        setCategories([]);
        setError(result.message || "Failed to fetch categories.");
      }
    } catch (err) {
      setError("An error occurred while fetching categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("listing_id", listing_id);
    if (!listing_id) {
      setError("Missing required parameter: listing_id");
      setLoading(false);
      return;
    }
    fetchCategory();
  }, [listing_id]);

  if (loading) {
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

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        // background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
        borderRadius: 4,
        // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 3 }}
      >
        Business Categories
      </Typography>

      {error ? (
        <Typography variant="h6" color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <Box>
          {categories.map((categoryGroup) => (
            <Paper
              key={categoryGroup.parent.category_id}
              elevation={3}
              sx={{
                marginBottom: 3,
                padding: { xs: 2, sm: 3 },
                borderRadius: 4,
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", marginBottom: 2, color: "#1976d2" }}
              >
                {categoryGroup.parent.category_name}
              </Typography>
              <Grid container spacing={3}>
                {categoryGroup.children.map((child) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={child.category_id}
                  >
                    <Box
                      sx={{
                        padding: 2,
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                        textAlign: "center",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#424242" }}
                      >
                        {child.category_name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default UserBusinessCategoryList;
