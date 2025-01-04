import React from "react";
import { Box, Typography, Grid, Paper, Chip, Divider } from "@mui/material";
import {
  MonetizationOn as MonetizationOnIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

function UserPlanInfo({ listing_id, plan }) {
  const planFields = [
    {
      label: "Plan Name",
      value: plan?.plan_name,
      icon: <MonetizationOnIcon />,
    },
    { label: "Price", value: `₹${plan?.price}`, icon: <MonetizationOnIcon /> },
    {
      label: "Duration",
      value: `${plan?.duration} months`,
      icon: <EventIcon />,
    },
    {
      label: "Listing Position",
      value: plan?.listing_position,
      icon: <InfoIcon />,
    },
    { label: "Banner Ad", value: plan?.banner_ad, icon: <CheckCircleIcon /> },
    {
      label: "Banner Ad Duration",
      value: `${plan?.banner_ad_duration} days`,
      icon: <EventIcon />,
    },
    {
      label: "Business Categories",
      value: plan?.business_categories,
      icon: <InfoIcon />,
    },
    {
      label: "Premium Business Seal",
      value: plan?.premium_business_seal,
      icon: <CheckCircleIcon />,
    },
    {
      label: "Visibility Level",
      value: plan?.visibility_level,
      icon: <InfoIcon />,
    },
    {
      label: "Customer Reach",
      value: plan?.customer_reach,
      icon: <InfoIcon />,
    },
    {
      label: "Customer Enquiries",
      value: plan?.customer_enquiries,
      icon: <InfoIcon />,
    },
    {
      label: "Priority Customer Enquiries",
      value: plan?.priority_customer_enquiries == 0 ? "NO" : "YES",
      icon: <CheckCircleIcon />,
    },
    {
      label: "WhatsApp Enquiries",
      value: plan?.whatsapp_enquiries,
      icon: <InfoIcon />,
    },
    {
      label: "SMS/Call Enquiries",
      value: plan?.sms_call_enquiries,
      icon: <InfoIcon />,
    },
    {
      label: "Add Products/Services",
      value: plan?.add_products_services,
      icon: <InfoIcon />,
    },
    { label: "Add Photos", value: plan?.add_photos, icon: <InfoIcon /> },
    {
      label: "Enquiry Delivery System",
      value: plan?.enquiry_delivery_system == 0 ? "NO" : "YES",
      icon: <InfoIcon />,
    },
    {
      label: "Analytics",
      value: plan?.analytics == 0 ? "NO" : "YES",
      icon: <InfoIcon />,
    },
    {
      label: "Lead Management",
      value: plan?.lead_management == 0 ? "NO" : "YES",
      icon: <InfoIcon />,
    },
    {
      label: "Premium Support",
      value: plan?.premium_support == 0 ? "NO" : "YES",
      icon: <CheckCircleIcon />,
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },

        borderRadius: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#1976d2",
          marginBottom: 3,
        }}
      >
        Plan Information
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={3}>
          {planFields.map((field, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                  padding: 2,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                }}
              >
                {field.icon}
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: 2,
                    fontWeight: "bold",
                    color: "#424242",
                    flex: 1,
                  }}
                >
                  {field.label}:
                </Typography>
              </Box>
              {typeof field.value === "boolean" ? (
                field.value ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "1rem",
                    color: "#616161",
                  }}
                >
                  {field.value || (
                    <Chip
                      label="N/A"
                      size="small"
                      sx={{ backgroundColor: "#ffcdd2" }}
                    />
                  )}
                </Typography>
              )}
              <Divider sx={{ marginY: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default UserPlanInfo;
