import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import Carousel from "react-material-ui-carousel";

export default function BusinessGallery({ businessPhotos }) {
  if (!businessPhotos || businessPhotos.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No photos available.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "1.2rem", mb: 1 }}>
        Gallery
      </Typography>
      <Carousel
        animation="slide"
        indicators
        navButtonsAlwaysVisible
        sx={{
          "& .MuiButtonBase-root": {
            backgroundColor: "#f0f0f0",
            color: "#000",
            "&:hover": {
              backgroundColor: "#d0d0d0",
            },
          },
        }}
      >
        {businessPhotos.map((photo) => (
          <Card
            key={photo.id}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Responsive Photo */}
            <Box
              component="img"
              src={photo.photo_url}
              alt={photo.description || "Business photo"}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { xs: "300px", sm: "400px", md: "500px" },
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            {/* Photo Details */}
            <CardContent sx={{ width: "100%" }}>
              {photo.photo_category && (
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Category: {photo.photo_category}
                </Typography>
              )}
              {photo.description && (
                <Typography
                  variant="body2"
                  color="textPrimary"
                  sx={{
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {photo.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Carousel>
    </Box>
  );
}
