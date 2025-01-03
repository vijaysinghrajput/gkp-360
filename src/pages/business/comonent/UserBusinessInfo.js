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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/icons-material";

import UpdateBusinessInfo from "./props/UpdateBusinessInfo";

function UserBusinessInfo({ business, onSave }) {
  const [isEditing, setIsEditing] = useState(null);
  const [editableBusiness, setEditableBusiness] = useState({ ...business });

  const handleEdit = (section) => setIsEditing(section);

  const handleCancel = () => {
    setIsEditing(null);
    setEditableBusiness({ ...business });
  };

  const handleSave = () => {
    setIsEditing(null);
    onSave(editableBusiness);
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
          <IconButton onClick={() => handleEdit("basic")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <BusinessIcon sx={{ marginRight: 1 }} /> Title
            </Typography>
            <Typography>{business.title || "N/A"}</Typography>
          </Grid>
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
            Address
          </Typography>
          <IconButton onClick={() => handleEdit("address")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              <RoomIcon sx={{ marginRight: 1 }} /> Full Address
            </Typography>
            <Typography>{business.full_address || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

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
            Contact Details
          </Typography>
          <IconButton onClick={() => handleEdit("contact")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <PhoneIcon sx={{ marginRight: 1 }} /> Primary Number
            </Typography>
            <Typography>{business.primary_number || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <EmailIcon sx={{ marginRight: 1 }} /> Email
            </Typography>
            <Typography>{business.email || "N/A"}</Typography>
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Social Media
          </Typography>
          <IconButton onClick={() => handleEdit("social")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <FacebookIcon sx={{ marginRight: 1 }} /> Facebook
            </Typography>
            <Typography>{business.facebook || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <TwitterIcon sx={{ marginRight: 1 }} /> Twitter
            </Typography>
            <Typography>{business.twitter || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Modal */}
      <Dialog open={!!isEditing} onClose={handleCancel}>
        <DialogTitle>Edit {isEditing} Information</DialogTitle>
        <DialogContent>
          {isEditing === "basic" && (
            <UpdateBusinessInfo
              initialData={editableBusiness}
              onSave={(updatedData) => {}}
              onCancel={handleCancel}
            />
          )}

          {isEditing === "address" && (
            <TextField
              fullWidth
              label="Full Address"
              value={editableBusiness.full_address}
              onChange={(e) => handleChange("full_address", e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          )}
          {isEditing === "contact" && (
            <>
              <TextField
                fullWidth
                label="Primary Number"
                value={editableBusiness.primary_number}
                onChange={(e) => handleChange("primary_number", e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editableBusiness.email}
                onChange={(e) => handleChange("email", e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </>
          )}
          {isEditing === "social" && (
            <>
              <TextField
                fullWidth
                label="Facebook"
                value={editableBusiness.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Twitter"
                value={editableBusiness.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default UserBusinessInfo;
