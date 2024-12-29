import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import { useRouter } from "next/router";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout from AuthContext
  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, link: "/" },
    { label: "About", icon: <InfoIcon />, link: "/about" },
    { label: "Business", icon: <BusinessIcon />, link: "/business" },
    { label: "Jobs", icon: <WorkIcon />, link: "/jobs" },
    { label: "Properties", icon: <LocationCityIcon />, link: "/properties" },
    { label: "Contact", icon: <ContactMailIcon />, link: "/contact" },
  ];

  const drawerMenu = (
    <Box
      sx={{
        width: 300,
        background: "linear-gradient(135deg, #4CAF50, #81C784)",
        height: "100%",
        color: "#fff",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          GKP 360
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component="a"
            href={item.link}
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={
            user ? handleLogout : () => (window.location.href = "/login")
          }
          sx={{
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            {user ? <LogoutIcon /> : <AccountCircleIcon />}
          </ListItemIcon>
          <ListItemText primary={user ? "Logout" : "Login"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{ background: "linear-gradient(90deg, #4CAF50, #81C784)" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            cursor: "pointer",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
          }}
          onClick={() => (window.location.href = "/")}
        >
          GKP 360
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              href={item.link}
              color="inherit"
              sx={{
                marginX: 1,
                fontWeight: "bold",
                "&:hover": {
                  color: "#4CAF50",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            color="inherit"
            onClick={user ? handleLogout : () => router.push("/login")}
            sx={{
              marginX: 1,
              fontWeight: "bold",
              "&:hover": {
                color: "#4CAF50",
              },
            }}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>
    </AppBar>
  );
}
