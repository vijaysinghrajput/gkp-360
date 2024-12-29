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

const BusinessSubcategoryLists = ({
  mainCategoryName,
  subcategories,
  city,
  state,
}) => {
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

  // Determine the subcategories to display (10 initially or all)
  const displayedSubcategories = showAll
    ? subcategories
    : subcategories?.slice(0, 10);

  const seoTitle = `Explore ${toTitleCase(
    city
  )}'s Popular ${mainCategoryName} | ${
    subcategories?.length
  } Categories in ${toTitleCase(city)}, ${toTitleCase(state)}`;

  // Schema for subcategories
  const subcategoriesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Popular ${mainCategoryName} in ${toTitleCase(city)}, ${toTitleCase(
      state
    )}`,
    itemListElement: subcategories?.map((subcategory, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: subcategory.category_name,
      url: `${domain}/${subcategory?.category_name_slug}/${city}/${state}/${subcategory?.id}/business`,
    })),
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(subcategoriesSchema)}
      </script>
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

        {/* List of Subcategories */}
        <List sx={{ padding: 0 }}>
          {displayedSubcategories?.map((subcategory, index) => (
            <React.Fragment key={subcategory.id}>
              <Link
                href={`/${subcategory?.category_name_slug}/${city}/${state}/${subcategory?.id}/business`}
                passHref
                style={{ textDecoration: "none" }}
                title={`${subcategory.category_name} in ${toTitleCase(
                  city
                )}, ${toTitleCase(state)}`}
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
                    {`${subcategory.category_name} in ${toTitleCase(
                      city
                    )}, ${toTitleCase(state)}`}
                  </Typography>
                </ListItem>
              </Link>
              {index !== displayedSubcategories?.length - 1 && (
                <Divider sx={{ borderColor: "#e0e0e0" }} />
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Show More / Show Less Button */}
        {subcategories?.length > 10 && (
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

export default BusinessSubcategoryLists;
