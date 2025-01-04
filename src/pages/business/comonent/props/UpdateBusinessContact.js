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

function UpdateBusinessContact({ initialData, onSave, onCancel }) {
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

    if (!data?.primary_number?.trim())
      errors.primary_number = "Primary number is required.";

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setIsLoading(true);

    const payload = {
      listing_id: data.listing_id || "",
      primary_number: data.primary_number,
      other_number: data.other_number,
      whatsapp_number: data.whatsapp_number,
      email: data.email,
    };

    try {
      const response = await axios.post(
        `${ProjectSetting.APP_API_URL}/Billing/updateContactInfo`,
        payload
      );

      if (response.data.status === "success") {
        onSave();
        setModalMessage("Contact information updated successfully!");
      } else {
        throw new Error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      setModalMessage("Failed to update contact information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <TextField
        fullWidth
        label="Primary Number"
        value={data?.primary_number || ""}
        error={!!errorMessages.primary_number}
        helperText={errorMessages.primary_number || ""}
        onChange={(e) => {
          setData({ ...data, primary_number: e.target.value });
          setErrorMessages((prev) => ({ ...prev, primary_number: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Other Number"
        value={data?.other_number || ""}
        error={!!errorMessages.other_number}
        helperText={errorMessages.other_number || ""}
        onChange={(e) => {
          setData({ ...data, other_number: e.target.value });
          setErrorMessages((prev) => ({ ...prev, other_number: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="WhatsApp Number"
        value={data?.whatsapp_number || ""}
        error={!!errorMessages.whatsapp_number}
        helperText={errorMessages.whatsapp_number || ""}
        onChange={(e) => {
          setData({ ...data, whatsapp_number: e.target.value });
          setErrorMessages((prev) => ({ ...prev, whatsapp_number: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        value={data?.email || ""}
        error={!!errorMessages.email}
        helperText={errorMessages.email || ""}
        onChange={(e) => {
          setData({ ...data, email: e.target.value });
          setErrorMessages((prev) => ({ ...prev, email: "" }));
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

export default UpdateBusinessContact;
