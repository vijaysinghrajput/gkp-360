import { Box, Divider, Typography } from "@mui/material";
import BusinessAboutDetails from "./BusinessAboutDetails";
import BusinessAddress from "./BusinessAddress";
import BusinessContact from "./BusinessContact";
import BusinessSocialMedia from "./BusinessSocialMedia";
import BusinessGallary from "./BusinessGallary";

export default function BusinessDetailsPageComponents({
  businesses,
  businessesPhoto,
}) {
  if (!businesses || businesses.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No business data available.
      </Typography>
    );
  }

  const business = businesses[0]; // Assuming the first business in the array is the focus

  return (
    <Box sx={{ width: "100%", bgcolor: "#f9f9f9", minHeight: "100vh", p: 3 }}>
      {/* About Section */}
      <BusinessAboutDetails business={business} />
      <Divider sx={{ my: 4 }} />
      {/* Address Section */}
      <BusinessAddress business={business} />
      <Divider sx={{ my: 4 }} />
      {/* Contact Section */}
      <BusinessContact business={business} />
      <Divider sx={{ my: 4 }} />
      {/* Social Media Links */}
      <BusinessSocialMedia business={business} />
      <Divider sx={{ my: 4 }} />
      {/* Gallery Section */}
      <BusinessGallary businessPhotos={businessesPhoto} />
      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
