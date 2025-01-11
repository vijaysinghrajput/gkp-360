import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function BusinessSocialMedia({ business }) {
  const socialLinks = [
    { name: "Facebook", icon: <FacebookIcon />, url: business?.facebook },
    { name: "Instagram", icon: <InstagramIcon />, url: business?.instagram },
    {
      name: "Google My Business",
      icon: <LocationOnIcon />,
      url: business?.gmb,
    },
    { name: "Twitter", icon: <TwitterIcon />, url: business?.twitter },
    { name: "YouTube", icon: <YouTubeIcon />, url: business?.youtube },
  ];

  return (
    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "1.2rem", mb: 1 }}>
        Social Media Links
      </Typography>
      <Grid container spacing={1}>
        {socialLinks.map((link, index) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 1,
            }}
          >
            {link.url ? (
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "0.9rem",
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "#f0f0f0",
                    "&:hover": { bgcolor: "#e0e0e0" },
                    p: 0.5,
                    fontSize: "1rem",
                  }}
                >
                  {link.icon}
                </IconButton>
                {link.name}
              </Link>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  fontSize: "0.9rem",
                }}
              >
                <IconButton
                  disabled
                  sx={{
                    bgcolor: "#f0f0f0",
                    p: 0.5,
                    fontSize: "1rem",
                  }}
                >
                  {link.icon}
                </IconButton>
                Not specified
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
