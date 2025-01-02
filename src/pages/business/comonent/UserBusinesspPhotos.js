import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import PhotoGallery from "./props/PhotoGallery";
import AddPhotoModal from "./props/AddPhotoModal";
import { ProjectSetting } from "../../../config/ProjectSetting";

function UserBusinessPhotos({ listing_id, plan_id }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessPhotos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing_id }),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (result.status === "success") {
        setPhotos(result.data || []);
        setError(null);
      } else {
        setPhotos([]); // Clear photos if there is an error
        setError(result.message || "Failed to fetch photos.");
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("An error occurred while fetching photos.");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!listing_id) {
      console.error("Missing listing_id in UserBusinessPhotos.");
      setError("Missing required parameter: listing_id");
      setLoading(false);
      return;
    }

    fetchPhotos();
  }, [listing_id]);

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

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "#4CAF50",
        }}
      >
        Business Photos
      </Typography>

      <Box
        sx={{
          textAlign: "center",
          marginTop: 4,
          color: "text.secondary",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Add New Photo
        </Button>
      </Box>

      {error && photos.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 4,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
            sx={{
              padding: "10px 20px",
              fontSize: "16px",
              textTransform: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            Add New Photo
          </Button>
        </Box>
      )}

      {photos.length > 0 && (
        <PhotoGallery photos={photos} onDelete={() => fetchPhotos()} />
      )}

      <AddPhotoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={() => fetchPhotos()}
        listing_id={listing_id}
        plan_id={plan_id}
      />
    </Box>
  );
}

export default UserBusinessPhotos;
