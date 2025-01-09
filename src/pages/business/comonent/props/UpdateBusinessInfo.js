import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Modal,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios"; // Ensure axios is imported
import { useAuth } from "../../../../context/AuthContext"; // Import AuthContext
import { ProjectSetting } from "../../../../config/ProjectSetting";

function UpdateBusinessInfo({ initialData, onSave, onCancel }) {
  const [data, setData] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || "");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Use AuthContext
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        setLogoPreview(objectUrl);
        setData((prev) => ({ ...prev, logo: file }));
      };
    }
  };

  const generateListingUrl = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .trim();
  };

  const handleSave = async () => {
    if (!data.title.trim()) {
      setModalTitle("Error");
      setModalMessage("Business name is required.");
      setModalOpen(true);
      return;
    }

    setIsLoading(true);

    const listingUrl = generateListingUrl(data.title + " " + data.full_address);

    const formData = new FormData();
    formData.append("listing_id", data?.listing_id);
    formData.append("title", data?.title);
    formData.append("about", data?.about);
    formData.append("listing_url", listingUrl);

    if (typeof data?.logo === "object") {
      formData.append("logo", data?.logo);
    }

    try {
      const response = await axios.post(
        `${ProjectSetting.API_URL}/Website/updateBusinessBasicInfo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setIsLoading(false);
        onSave();
        setModalTitle("Success");
        setModalMessage("Business information updated successfully!");
        setModalOpen(true);
      } else {
        throw new Error(response.data.message || "Update failed.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating business info:", error);
      setModalTitle("Error");
      setModalMessage("Failed to update business information.");
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <TextField
        fullWidth
        label="Business Name"
        value={data?.title}
        onChange={(e) => handleChange("title", e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={data.about}
        onChange={(e) => handleChange("about", e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Current Logo:
      </Typography>
      {logoPreview ? (
        <Avatar
          src={logoPreview}
          alt="Business Logo"
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
      ) : (
        <Typography>No logo available</Typography>
      )}

      <Button
        variant="outlined"
        component="label"
        startIcon={<PhotoCamera />}
        sx={{ marginBottom: 2 }}
      >
        Upload New Logo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleLogoChange}
        />
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <Button
            onClick={() => setModalOpen(false)}
            color="primary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateBusinessInfo;
