import { Box, Typography, Grid, IconButton, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";

export default function BusinessContact({ business }) {
  const contactDetails = [
    {
      label: "Primary Number",
      value: business?.primary_number,
      icon: <PhoneIcon />,
      action: `tel:${business?.primary_number}`,
    },
    {
      label: "Other Number",
      value: business?.other_number || "Not specified",
      icon: <PhoneIcon />,
      action: business?.other_number ? `tel:${business?.other_number}` : null,
    },
    {
      label: "WhatsApp",
      value: business?.whatsapp_number || "Not specified",
      icon: <WhatsAppIcon />,
      action: business?.whatsapp_number
        ? `https://wa.me/${business?.whatsapp_number}`
        : null,
    },
    {
      label: "Email",
      value: business?.email,
      icon: <EmailIcon />,
      action: `mailto:${business?.email}`,
    },
    {
      label: "Website",
      value: business?.website,
      icon: <LanguageIcon />,
      action: business?.website,
    },
  ];

  return (
    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "1.2rem", mb: 1 }}>
        Contact Information
      </Typography>
      <Grid container spacing={1}>
        {contactDetails.map((detail, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {detail.value !== "Not specified" ? (
              <Link
                href={detail.action}
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
                  {detail.icon}
                </IconButton>
                <Typography sx={{ ml: 1 }}>{detail.value}</Typography>
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
                  {detail.icon}
                </IconButton>
                <Typography sx={{ ml: 1 }}>{detail.value}</Typography>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
