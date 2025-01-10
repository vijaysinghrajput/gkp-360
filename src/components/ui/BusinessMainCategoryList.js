import React from "react";
import {
  Card,
  Box,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const BusinessMainCategoryList = ({ category }) => {
  const router = useRouter();

  const handleCategoryClick = (category_slug, id) => {
    router.push(`/${category_slug}/${id}/business-main-category`);
  };

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 150px)", // Dynamic height
        overflowY: "auto", // Scrollable
        padding: 1,
        border: "1px solid #ddd",
        borderRadius: 1,
        backgroundColor: "#f9f9f9",
      }}
    >
      {category.map((cat) => (
        <Card
          key={cat.id}
          sx={{
            marginBottom: 2,
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
          onClick={() => handleCategoryClick(cat.category_slug, cat.id)}
        >
          <CardActionArea>
            <CardContent>
              <Typography>{cat.category_name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default BusinessMainCategoryList;
