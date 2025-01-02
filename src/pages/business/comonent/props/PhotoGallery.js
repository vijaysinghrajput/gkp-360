import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProjectSetting } from "../../../../config/ProjectSetting";

function PhotoGallery({ photos, onDelete }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (photos.length === 0) {
    return (
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginTop: 4,
          color: "text.secondary",
        }}
      >
        No photos available. Add new photos to display them here.
      </Typography>
    );
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/deleteBusinessPhoto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photo_id: selectedPhoto.id,
            photo_url: selectedPhoto.photo_url,
          }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        onDelete(); // Trigger re-fetching of photos
        setConfirmOpen(false);
        setSelectedPhoto(null);
      } else {
        console.error("Error deleting photo:", result.message);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleOpenConfirm = (photo) => {
    setSelectedPhoto(photo);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={photo.photo_url}
                alt={photo.photo_category}
                sx={{
                  height: 200,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <CardContent sx={{ backgroundColor: "#f8f9fa" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  {photo.photo_category}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  padding: 1,
                }}
              >
                <IconButton
                  color="error"
                  onClick={() => handleOpenConfirm(photo)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to delete this photo? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PhotoGallery;
