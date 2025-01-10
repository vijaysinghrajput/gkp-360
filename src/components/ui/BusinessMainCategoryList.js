import React, { useEffect } from "react";
import {
  Card,
  Box,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";

const BusinessMainCategoryList = ({ category }) => {
  const router = useRouter();

  const handleCategoryClick = (category_slug, id) => {
    router.push(`/${category_slug}/${id}/business-main-category`);
  };

  const generateItemListSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: category.map((cat, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cat.category_name,
        url: `${router.basePath}/${cat.category_slug}/${cat.id}/business-main-category`,
      })),
    };
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateItemListSchema()),
          }}
        />
      </Head>
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
    </>
  );
};

export default BusinessMainCategoryList;
