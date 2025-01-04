import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { ProjectSetting } from "../../../../config/ProjectSetting";

function UpdateBusinessSocialMedia({ initialData, onSave, onCancel }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    const errors = {};

    setIsLoading(true);

    const payload = {
      listing_id: data.listing_id || "",
      website: data.website,
      facebook: data.facebook,
      instagram: data.instagram,
      gmb: data.gmb,
      twitter: data.twitter,
      youtube: data.youtube,
    };

    try {
      const response = await axios.post(
        `${ProjectSetting.APP_API_URL}/Billing/updateSocialMedia`,
        payload
      );

      if (response.data.status === "success") {
        onSave();
        setModalMessage("Social media information updated successfully!");
      } else {
        throw new Error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating social media information:", error);
      setModalMessage("Failed to update social media information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <TextField
        fullWidth
        label="Website"
        value={data?.website || ""}
        error={!!errorMessages.website}
        helperText={errorMessages.website || ""}
        onChange={(e) => {
          setData({ ...data, website: e.target.value });
          setErrorMessages((prev) => ({ ...prev, website: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Facebook"
        value={data?.facebook || ""}
        error={!!errorMessages.facebook}
        helperText={errorMessages.facebook || ""}
        onChange={(e) => {
          setData({ ...data, facebook: e.target.value });
          setErrorMessages((prev) => ({ ...prev, facebook: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Instagram"
        value={data?.instagram || ""}
        error={!!errorMessages.instagram}
        helperText={errorMessages.instagram || ""}
        onChange={(e) => {
          setData({ ...data, instagram: e.target.value });
          setErrorMessages((prev) => ({ ...prev, instagram: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Google My Business"
        value={data?.gmb || ""}
        error={!!errorMessages.gmb}
        helperText={errorMessages.gmb || ""}
        onChange={(e) => {
          setData({ ...data, gmb: e.target.value });
          setErrorMessages((prev) => ({ ...prev, gmb: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Twitter"
        value={data?.twitter || ""}
        error={!!errorMessages.twitter}
        helperText={errorMessages.twitter || ""}
        onChange={(e) => {
          setData({ ...data, twitter: e.target.value });
          setErrorMessages((prev) => ({ ...prev, twitter: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="YouTube"
        value={data?.youtube || ""}
        error={!!errorMessages.youtube}
        helperText={errorMessages.youtube || ""}
        onChange={(e) => {
          setData({ ...data, youtube: e.target.value });
          setErrorMessages((prev) => ({ ...prev, youtube: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onCancel} color="secondary" sx={{ marginRight: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
      <Dialog
        open={!!modalMessage}
        onClose={() => setModalMessage("")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalMessage("")} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UpdateBusinessSocialMedia;
