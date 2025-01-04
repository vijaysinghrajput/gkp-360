import React from "react";
import { Card, CardContent, CardActionArea, Typography } from "@mui/material";

const BusinessMainCategoryList = ({ category, onCategoryClick }) => {
  return (
    <>
      {category.map((cat) => (
        <Card
          key={cat.id}
          sx={{
            marginBottom: 2,
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
          onClick={() => onCategoryClick(cat)}
        >
          <CardActionArea>
            <CardContent>
              <Typography>{cat.category_name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
};

export default BusinessMainCategoryList;
