import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Business as BusinessIcon,
  Room as RoomIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

function UserBusinessInfo({ business, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableBusiness, setEditableBusiness] = useState({ ...business });

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditableBusiness({ ...business });
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editableBusiness); // Call the save function with updated data
  };

  const handleChange = (field, value) => {
    setEditableBusiness((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 3 }}
      >
        Business Information
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Basic Information
          </Typography>
          {!isEditing ? (
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <BusinessIcon sx={{ marginRight: 1 }} /> Title
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            ) : (
              <Typography>{business.title || "N/A"}</Typography>
            )}
          </Grid>

          {/* Logo */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Logo</Typography>
            <Avatar
              src={editableBusiness.logo || ""}
              alt="Business Logo"
              sx={{ width: 80, height: 80, marginBottom: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Address Block */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Address
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              <RoomIcon sx={{ marginRight: 1 }} /> Full Address
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.full_address}
                onChange={(e) => handleChange("full_address", e.target.value)}
              />
            ) : (
              <Typography>{business.full_address || "N/A"}</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Details */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Contact Details
        </Typography>
        <Grid container spacing={3}>
          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <PhoneIcon sx={{ marginRight: 1 }} /> Primary Number
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.primary_number}
                onChange={(e) => handleChange("primary_number", e.target.value)}
              />
            ) : (
              <Typography>{business.primary_number || "N/A"}</Typography>
            )}
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <EmailIcon sx={{ marginRight: 1 }} /> Email
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <Typography>{business.email || "N/A"}</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Social Media */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Social Media
        </Typography>
        <Grid container spacing={3}>
          {/* Facebook */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <FacebookIcon sx={{ marginRight: 1 }} /> Facebook
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
              />
            ) : (
              <Typography>{business.facebook || "N/A"}</Typography>
            )}
          </Grid>

          {/* Twitter */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <TwitterIcon sx={{ marginRight: 1 }} /> Twitter
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editableBusiness.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
              />
            ) : (
              <Typography>{business.twitter || "N/A"}</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default UserBusinessInfo;
