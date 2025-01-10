import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Divider,
} from "@mui/material";
import Link from "next/link";
import Head from "next/head";
import { ProjectSetting } from "../../../config/ProjectSetting";

const BusinessMaincategoryLists = ({ mainCategoryName, categories }) => {
  const domain = ProjectSetting.COMPANY_WEBSITE;

  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const [showAll, setShowAll] = useState(false);

  const handleToggleShowMore = () => {
    setShowAll((prev) => !prev);
  };

  // Determine the categories to display (10 initially or all)
  const displayedCategories = showAll ? categories : categories?.slice(0, 10);

  // SEO Title
  const seoTitle = `Explore Other Popular  ${
    categories?.length || 0
  } Categories`;

  // Schema for categories
  const categoriesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Popular ${mainCategoryName}`,
    itemListElement: categories?.map((subcategory, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: subcategory.category_name,
      url: `${domain}/${subcategory?.category_name_slug}/${subcategory?.id}/business`,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(categoriesSchema)}
        </script>
      </Head>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          textAlign: "left",
        }}
      >
        {/* SEO-Friendly Title */}
        <Typography
          component="h1"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#333",
          }}
        >
          {seoTitle}
        </Typography>

        {/* List of Categories */}
        <List sx={{ padding: 0 }}>
          {displayedCategories?.map((subcategory, index) => (
            <React.Fragment key={subcategory.id}>
              <Link
                href={`/${subcategory?.category_name_slug}/${subcategory?.id}/business`}
                passHref
                style={{ textDecoration: "none" }}
                title={`${subcategory.category_name}`}
              >
                <ListItem
                  component="a"
                  sx={{
                    textDecoration: "none",
                    color: "#4CAF50",
                    "&:hover": {
                      color: "#FFC107",
                    },
                    padding: "8px 0",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {subcategory.category_name}
                  </Typography>
                </ListItem>
              </Link>
              {index !== displayedCategories?.length - 1 && (
                <Divider sx={{ borderColor: "#e0e0e0" }} />
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Show More / Show Less Button */}
        {categories?.length > 10 && (
          <Button
            onClick={handleToggleShowMore}
            sx={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#007bff",
              textTransform: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {showAll ? "Show Less" : "Show More"}
          </Button>
        )}
      </Box>
    </>
  );
};

export default BusinessMaincategoryLists;
