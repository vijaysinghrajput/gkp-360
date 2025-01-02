import React, { useState, useEffect } from "react";
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

import { MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import InventoryIcon from "@mui/icons-material/Inventory";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";
import { ProjectSetting } from "../../config/ProjectSetting";

import UserBusinesspPhotos from "../business/comonent/UserBusinesspPhotos";
import UserBusinessInfo from "../business/comonent/UserBusinessInfo";
import UserPlanInfo from "../business/comonent/UserPlanInfo";
import UserBusinessCategoryList from "../business/comonent/UserBusinessCategoryList";

function Lists() {
  const router = useRouter();
  const { listing_id } = router.query;

  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar initially open
  const [selectedMenu, setSelectedMenu] = useState("business_info");
  const [business, setBusiness] = useState([]);
  const [plan, setPlan] = useState([]);
  const [businessTitle, setBusinessTitle] = useState("Loading...");
  const [businessPlanID, setBusinessPlanID] = useState(0);

  const fetchBusinessDetails = async (listing_id) => {
    try {
      console.log("listing_id being sent:", listing_id); // Debug log
      const response = await axios.post(
        `${ProjectSetting.API_URL}/Website/getBusinessDetailsById?listing_id=${listing_id}`
      );
      console.log("response.data:", response.data); // Debug log
      if (
        response.data.status === "success" &&
        response.data.data?.[0]?.title
      ) {
        setBusiness(response.data.data[0]);
        setPlan(response.data.plan);
        setBusinessTitle(response.data.data[0].title); // Set the business title
        setBusinessPlanID(response.data.data[0].plan_id); // Set the business title
      } else {
        setBusiness([]);
        setPlan([]);
        setBusinessTitle("Business Not Found");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching business details:",
        error
      );
      setBusinessTitle("Error Loading Business");
    }
  };

  useEffect(() => {
    if (listing_id) {
      console.log("Fetching business details for listing_id:", listing_id); // Debugging
      fetchBusinessDetails(listing_id);
    } else {
      console.error("listing_id is missing in router.query.");
      setBusinessTitle("Error: listing_id missing");
    }
  }, [listing_id]);

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, id: "home" },
    { label: "Dashboard", icon: <DashboardIcon />, id: "dashboard" },
    { label: "Business Info", icon: <InfoIcon />, id: "business_info" },
    { label: "Business Category", icon: <InfoIcon />, id: "business_category" },
    { label: "Plan Info", icon: <MonetizationOnIcon />, id: "plan_info" },
    { label: "Leads", icon: <TrendingUpIcon />, id: "leads" },
    { label: "Analytics", icon: <TrendingUpIcon />, id: "analytics" },
    { label: "Enquiry", icon: <ContactSupportIcon />, id: "enquiry" },
    { label: "Photos", icon: <PhotoLibraryIcon />, id: "photos" },
    {
      label: "Products / Services",
      icon: <InventoryIcon />,
      id: "products_services",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (id) => {
    if (id === "home") {
      router.push("/");
    } else if (id === "dashboard") {
      router.push("/dashboard");
    } else {
      setSelectedMenu(id);
    }

    // Close the drawer after menu click
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "business_info":
        return (
          <UserBusinessInfo business={business} plan_id={businessPlanID} />
        );
      case "business_category":
        return <UserBusinessCategoryList listing_id={listing_id} />;
      case "plan_info":
        return <UserPlanInfo listing_id={listing_id} plan={plan} />;
      case "leads":
        return (
          <Typography variant="h4" textAlign="center">
            Leads Section
          </Typography>
        );
      case "analytics":
        return (
          <Typography variant="h4" textAlign="center">
            Analytics Section
          </Typography>
        );
      case "enquiry":
        return (
          <Typography variant="h4" textAlign="center">
            Enquiry Section
          </Typography>
        );
      case "photos":
        return (
          <UserBusinesspPhotos
            listing_id={listing_id}
            plan_id={businessPlanID}
          />
        );
      case "products_services":
        return (
          <Typography variant="h4" textAlign="center">
            Products / Services Section
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
            onClick={() => router.push("/")}
          >
            {businessTitle} {/* Display dynamic business title */}
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

export default Lists;
