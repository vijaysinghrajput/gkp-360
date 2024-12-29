import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Collapse,
} from "@mui/material";
import {
  CheckCircleOutline as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ProjectSetting } from "../../config/ProjectSetting";

const ListYourBusiness = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState({}); // Track which plans are expanded

  useEffect(() => {
    // Fetch plans from the API
    axios
      .get(`${ProjectSetting.API_URL}/Website/getPlans`)
      .then((response) => {
        if (response.data.status === "success") {
          setPlans(response.data.data); // Set plans from the API response
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Unable to fetch plans. Please try again later.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleExpand = (planId) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

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
        <Typography variant="h6">Loading Plans...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "20px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Plans & Pricing
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          marginBottom: "30px",
        }}
      >
        Select a Plan to Start Growing your Business Online
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.plan_id}>
            <Card
              sx={{
                border: "2px solid #ddd",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                textAlign: "center",
                padding: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {plan.plan_name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    marginBottom: "20px",
                    fontSize: "1.1rem",
                  }}
                >
                  ₹{plan.price} for {plan.duration}
                </Typography>

                <Divider sx={{ marginBottom: "20px" }} />

                {Object.entries(plan)
                  .slice(0, 5)
                  .map(([key, value]) => (
                    <Box
                      key={key}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      marginBottom="10px"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <InfoIcon fontSize="small" />
                        <Typography variant="body2">
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Typography>
                      </Box>
                      {typeof value === "boolean" ||
                      value === 1 ||
                      value === 0 ? (
                        value ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )
                      ) : (
                        <Chip
                          label={value}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </Box>
                  ))}

                <Collapse
                  in={expandedPlans[plan.plan_id]}
                  timeout="auto"
                  unmountOnExit
                >
                  {Object.entries(plan)
                    .slice(5)
                    .map(([key, value]) => (
                      <Box
                        key={key}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="10px"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <InfoIcon fontSize="small" />
                          <Typography variant="body2">
                            {key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Typography>
                        </Box>
                        {typeof value === "boolean" ||
                        value === 1 ||
                        value === 0 ? (
                          value ? (
                            <CheckIcon color="success" />
                          ) : (
                            <CancelIcon color="error" />
                          )
                        ) : (
                          <Chip
                            label={value}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                            }}
                          />
                        )}
                      </Box>
                    ))}
                </Collapse>

                <Button
                  onClick={() => toggleExpand(plan.plan_id)}
                  variant="outlined"
                  fullWidth
                  endIcon={
                    expandedPlans[plan.plan_id] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )
                  }
                  sx={{
                    marginTop: "10px",
                    padding: "8px",
                    borderRadius: "50px",
                  }}
                >
                  {expandedPlans[plan.plan_id]
                    ? "View Less Features"
                    : "View More Features"}
                </Button>
              </CardContent>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: "10px",
                  padding: "12px",
                  fontSize: "1rem",
                  borderRadius: "50px",
                }}
              >
                Select
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListYourBusiness;
