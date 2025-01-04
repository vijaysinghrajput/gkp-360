import React, { useState, useEffect } from "react";
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
  CircularProgress,
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
import UpdateBusinessAddress from "./props/UpdateBusinessAddress";
import UpdateBusinessContact from "./props/UpdateBusinessContact";
import UpdateBusinessSocialMedia from "./props/UpdateBusinessSocialMedia";
import GoogleMapsProvider from "./props/GoogleMapsProvider";

function UserBusinessInfo({ business, plan_id, onSave }) {
  const [isEditing, setIsEditing] = useState(null);
  const [editableBusiness, setEditableBusiness] = useState(null);

  useEffect(() => {
    if (business) {
      setEditableBusiness({ ...business });
    }
  }, [business]);

  const handleEdit = (section) => setIsEditing(section);

  const handleCancel = () => {
    setIsEditing(null);
    setEditableBusiness({ ...business });
  };

  const handleSave = () => {
    setIsEditing(null);
    onSave();
  };

  const handleChange = (field, value) => {
    setEditableBusiness((prev) => ({ ...prev, [field]: value }));
  };

  if (!editableBusiness) {
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
            <BusinessIcon sx={{ marginRight: 1 }} /> Basic Information
          </Typography>
          <IconButton onClick={() => handleEdit("basic")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Title</Typography>
            <Typography>{editableBusiness.title || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Logo</Typography>
            <Avatar
              src={editableBusiness.logo || ""}
              alt="Business Logo"
              sx={{ width: 80, height: 80, marginBottom: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Description</Typography>
            <Typography>{editableBusiness.about || "N/A"}</Typography>
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
            <RoomIcon sx={{ marginRight: 1 }} /> Address
          </Typography>
          <IconButton onClick={() => handleEdit("address")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Full Address</Typography>
            <Typography>{editableBusiness.full_address || "N/A"}</Typography>
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
            <PhoneIcon sx={{ marginRight: 1 }} /> Contact Details
          </Typography>
          <IconButton onClick={() => handleEdit("contact")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Primary Number</Typography>
            <Typography>{editableBusiness.primary_number || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Other Number</Typography>
            <Typography>{editableBusiness.other_number || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Whatsapp Number</Typography>
            <Typography>{editableBusiness.whatsapp_number || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Email</Typography>
            <Typography>{editableBusiness.email || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            <LanguageIcon sx={{ marginRight: 1 }} /> Social Media
          </Typography>
          <IconButton onClick={() => handleEdit("social")}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Website</Typography>
            <Typography>{editableBusiness.website || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Instagram</Typography>
            <Typography>{editableBusiness.instagram || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Facebook</Typography>
            <Typography>{editableBusiness.facebook || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Twitter</Typography>
            <Typography>{editableBusiness.twitter || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Youtube</Typography>
            <Typography>{editableBusiness.youtube || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Google My Business</Typography>
            <Typography>{editableBusiness.gmb || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={!!isEditing} onClose={handleCancel}>
        <DialogTitle>Edit {isEditing} Information</DialogTitle>
        <DialogContent>
          {isEditing === "basic" && (
            <UpdateBusinessInfo
              initialData={editableBusiness}
              onSave={() => handleSave()}
              onCancel={handleCancel}
            />
          )}

          {isEditing === "address" && (
            <GoogleMapsProvider>
              <UpdateBusinessAddress
                initialData={editableBusiness}
                onSave={() => handleSave()}
                onCancel={handleCancel}
              />
            </GoogleMapsProvider>
          )}
          {isEditing === "contact" && (
            <UpdateBusinessContact
              initialData={editableBusiness}
              onSave={() => handleSave()}
              onCancel={handleCancel}
            />
          )}
          {isEditing === "social" && (
            <UpdateBusinessSocialMedia
              initialData={editableBusiness}
              onSave={() => handleSave()}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default UserBusinessInfo;
