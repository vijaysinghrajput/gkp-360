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
  CircularProgress,
  Modal,
} from "@mui/material";
import {
  CheckCircleOutline as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ProjectSetting } from "../../config/ProjectSetting";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import LoginComponent from "../business/comonent/LoginComponent";

const ListYourBusiness = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${ProjectSetting.API_URL}/Website/getPlans`)
      .then((response) => {
        if (response.data.status == "success" && response.data.data.length) {
          setPlan(response.data.data[0]); // Only set the first plan
        } else {
          setError(response.data.message || "No plans available.");
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

  const handleSelectPlan = (planId) => {
    if (!user) {
      setSelectedPlanId(planId);
      setLoginModalOpen(true);
    } else {
      router.push(`/business/post-business?planId=${planId}`);
    }
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (selectedPlanId) {
      router.push(`/business/post-business?planId=${selectedPlanId}`);
    }
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
        <CircularProgress />
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
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #4CAF50, #81C784)",
          padding: "20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          Affordable Plan to List Your Business Online
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: "10px",
            fontSize: "1rem",
          }}
        >
          Choose a plan that suits your business and grow your online presence.
        </Typography>
      </Box>

      {/* Plan Section */}
      <Grid
        container
        spacing={3}
        sx={{ padding: "20px", justifyContent: "center" }}
      >
        {plan && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                border: "2px solid #4CAF50",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent sx={{ padding: "20px", textAlign: "center" }}>
                <Typography
                  variant="h6"
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
                    marginBottom: "20px",
                    fontSize: "1rem",
                  }}
                >
                  ₹{plan.price} for {plan.duration}
                </Typography>
                <Divider sx={{ marginBottom: "15px" }} />
                {/* <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                  {Object.entries(plan)
                    .filter(([key]) => key !== "plan_id")
                    .map(([key, value]) => (
                      <Box
                        key={key}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="10px"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          sx={{ flex: 1 }}
                        >
                          <InfoIcon fontSize="small" />
                          <Typography variant="body2">
                            {key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Typography>
                        </Box>
                        {value == 1 || value == 0 ? (
                          value == 1 ? (
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
                              maxWidth: "50%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        )}
                      </Box>
                    ))}
                </Box> */}
              </CardContent>
              <Box
                sx={{
                  backgroundColor: "#f1f1f1",
                  padding: "16px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: "50px" }}
                  onClick={() => handleSelectPlan(plan.plan_id)}
                >
                  Select Plan
                </Button>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Login Modal */}
      <Modal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <LoginComponent
          isModal
          onSuccess={handleLoginSuccess}
          onClose={() => setLoginModalOpen(false)}
        />
      </Modal>
    </Box>
  );
};

export default ListYourBusiness;
