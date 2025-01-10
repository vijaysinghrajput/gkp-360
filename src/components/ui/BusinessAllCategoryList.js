import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";

const BusinessAllCategoryList = ({ category }) => {
  const router = useRouter();

  // Use media queries to dynamically set column layout
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1200px)");

  const handleCategoryClick = (category_slug, id) => {
    router.push(`/${category_slug}/${id}/business-category`);
  };

  // Determine columns based on screen size
  const getGridTemplateColumns = () => {
    if (isMobile) return "repeat(1, 1fr)";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(3, 1fr)";
  };

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 150px)", // Dynamic height
        overflowY: "auto", // Scrollable vertically
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Category List as Rectangular Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: getGridTemplateColumns(), // Dynamic columns
          gap: 2, // Spacing between cards
          justifyContent: "center", // Center align on all devices
        }}
      >
        {category.map((cat) => (
          <Card
            onClick={() => handleCategoryClick(cat.category_name_slug, cat.id)}
            sx={{
              cursor: "pointer",
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardActionArea>
              <CardContent
                sx={{
                  textAlign: "center",
                  padding: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap", // Prevent wrapping
                    overflow: "hidden", // Hide overflowing text
                    textOverflow: "ellipsis", // Add ellipsis for long text
                    color: "#333",
                  }}
                >
                  {cat.category_name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BusinessAllCategoryList;
