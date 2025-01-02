import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CssBaseline,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import UserBusinessList from "../pages/business/comonent/UserBusinessList";

function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar initially open
  const [selectedMenu, setSelectedMenu] = useState("business");

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, id: "home" },
    { label: "Business", icon: <BusinessIcon />, id: "business" },
    { label: "Profile", icon: <AccountCircleIcon />, id: "profile" },
    { label: "Logout", icon: <LogoutIcon />, id: "logout" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (id) => {
    if (id === "logout") {
      logout();
      router.push("/login");
    } else if (id === "home") {
      router.push("/");
    } else {
      setSelectedMenu(id);
    }

    // Close the drawer after menu click
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "business":
        return <UserBusinessList sidebarOpen={sidebarOpen} />;
      case "profile":
        return (
          <Typography variant="h4" textAlign="center">
            User Profile Information
          </Typography>
        );
      default:
        return (
          <Typography variant="h4" textAlign="center">
            Select a menu item.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: "64px", // Ensure consistent height
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ cursor: "pointer" }}
            // onClick={() => router.push("/")}
          >
            Dashboard
          </Typography>
        </Box>
      </AppBar>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            transition: "width 0.3s",
          },
        }}
      >
        <Box sx={{ height: "64px" }} /> {/* Spacer for AppBar height */}
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 150, 136, 0.1)",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? "240px" : "0", // Adjust margin based on sidebar state
          transition: "margin 0.3s",
          overflowY: "auto",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default Dashboard;
