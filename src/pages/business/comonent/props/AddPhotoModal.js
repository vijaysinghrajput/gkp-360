import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ProjectSetting } from "../../../../config/ProjectSetting";

function AddPhotoModal({ open, onClose, onAdd, listing_id, plan_id }) {
  const [photos, setPhotos] = useState([
    { file: null, photoCategory: "", preview: null },
  ]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [loading, setLoading] = useState(false); // Loading state

  const photoCategories = [
    { id: 1, name: "Exterior" },
    { id: 2, name: "Interior" },
    { id: 3, name: "Products" },
    { id: 4, name: "Services" },
    { id: 5, name: "Team" },
    { id: 6, name: "Work in Progress" },
    { id: 7, name: "Events" },
    { id: 8, name: "Promotions" },
    { id: 9, name: "Certifications" },
    { id: 10, name: "Portfolio" },
    { id: 11, name: "Client Testimonials" },
    { id: 12, name: "Food Menu" },
    { id: 13, name: "Before & After" },
  ];

  const handleAddPhotoField = () => {
    setPhotos((prev) => [
      ...prev,
      { file: null, photoCategory: "", preview: null },
    ]);
  };

  const handleRemovePhotoField = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    setPhotos((prev) =>
      prev.map((photo, i) =>
        i === index ? { ...photo, [field]: value } : photo
      )
    );
  };

  const handleFileChange = (index, file) => {
    const preview = URL.createObjectURL(file);
    setPhotos((prev) =>
      prev.map((photo, i) =>
        i === index ? { ...photo, file, preview } : photo
      )
    );
  };

  const handleSubmit = async () => {
    if (photos.some((photo) => !photo.file || !photo.photoCategory)) {
      setError("All fields are required for each photo.");
      setSuccessMessage(""); // Clear success message
      return;
    }

    setLoading(true); // Set loading to true
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("plan_id", plan_id);
    formData.append("listing_id", listing_id);

    photos.forEach((photo, index) => {
      formData.append(`photos[]`, photo.file); // File input
      formData.append(`photo_category[${index}]`, photo.photoCategory); // Category input
    });

    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/addBusinessPhoto`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status) {
        setPhotos([{ file: null, photoCategory: "", preview: null }]); // Reset form
        setError(""); // Clear errors
        setSuccessMessage("Photos uploaded successfully!"); // Show success message
        setLoading(false); // Stop loading
        onAdd();
        onClose();
      } else {
        setError(
          result.message || "Failed to upload photos. Please try again."
        );
        setSuccessMessage(""); // Clear success message
        setLoading(false); // Stop loading
      }
    } catch (error) {
      setError("An error occurred while uploading photos. Please try again.");
      setSuccessMessage(""); // Clear success message
      console.error("Photo upload error:", error);
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Add New Photos
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" mb={2}>
            {successMessage}
          </Typography>
        )}
        {loading && (
          <Box display="flex" justifyContent="center" mb={2}>
            <CircularProgress />
          </Box>
        )}
        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            marginBottom: 2,
            paddingRight: 1,
          }}
        >
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {/* Numbering */}
                  <Typography variant="subtitle1" sx={{ minWidth: "80px" }}>
                    {`Photo ${index + 1}`}
                  </Typography>

                  {/* Image Preview */}
                  {photo.preview ? (
                    <img
                      src={photo.preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "80px",
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <UploadFileIcon
                        sx={{ fontSize: 40, color: "grey.500" }}
                      />
                    </Box>
                  )}

                  {/* File Input */}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                  >
                    Upload File
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                    />
                  </Button>

                  {/* Category Selection */}
                  <FormControl fullWidth>
                    <InputLabel>Photo Category</InputLabel>
                    <Select
                      value={photo.photoCategory}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "photoCategory",
                          e.target.value
                        )
                      }
                    >
                      {photoCategories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Remove Button */}
                  {photos.length > 1 && (
                    <IconButton
                      onClick={() => handleRemovePhotoField(index)}
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPhotoField}
          sx={{ marginTop: 2 }}
          disabled={loading} // Disable during upload
        >
          Add Another Photo
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={loading} // Disable during upload
        >
          Submit Photos
        </Button>
      </Box>
    </Modal>
  );
}

export default AddPhotoModal;
