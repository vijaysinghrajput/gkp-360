import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Head from "next/head";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { ProjectSetting } from "../../../config/ProjectSetting";

const BusinessBreadcrumbList = ({ currentCategory, city, state }) => {
  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const domain = ProjectSetting.COMPANY_WEBSITE;

  const CategorySchema = {
    "@context": "https://schema.org",
    "@type": "CategoryCode",
    name: currentCategory?.subcategory_name,
    url: `${domain}/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.subcategory_id}/business`,
  };

  // Construct the breadcrumb schema.org data

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${domain}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Business",
        item: `${domain}/business`,
      },
      ...(currentCategory?.main_category_name
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: currentCategory?.main_category_name,
              item: `${domain}/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.main_category_id}/business`,
            },
          ]
        : []),
      ...(currentCategory?.subcategory_name
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: `${currentCategory?.subcategory_name} in ${toTitleCase(
                city
              )}, ${toTitleCase(state)}`,
              item: `${domain}/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.subcategory_id}/business`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* JSON-LD for breadcrumbs */}
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbList)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(CategorySchema)}
        </script>
      </Head>

      {/* Visual Breadcrumb */}
      <Breadcrumbs
        separator="›"
        sx={{
          marginBottom: "16px",
          justifyContent: "center",
          display: "flex",
          fontSize: "14px",
          "& .MuiBreadcrumbs-separator": { color: "#888" },
        }}
        aria-label="breadcrumb"
      >
        <Link href={`/`} passHref style={{ textDecoration: "none" }}>
          <Typography
            component="a"
            color="primary"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Home
          </Typography>
        </Link>
        <Link href={`/business`} passHref style={{ textDecoration: "none" }}>
          <Typography
            component="a"
            color="primary"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Business
          </Typography>
        </Link>
        {currentCategory?.main_category_name && (
          <Link
            href={`/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.main_category_id}/business`}
            passHref
            style={{ textDecoration: "none" }}
          >
            <Typography
              component="a"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {currentCategory?.main_category_name}
            </Typography>
          </Link>
        )}
        {currentCategory?.subcategory_name && (
          <Typography
            color="text.primary"
            sx={{
              fontWeight: 500,
            }}
          >
            {currentCategory?.subcategory_name} in {toTitleCase(city)},
            {toTitleCase(state)}
          </Typography>
        )}
      </Breadcrumbs>
    </>
  );
};

BusinessBreadcrumbList.propTypes = {
  currentCategory: PropTypes.shape({
    category_slug: PropTypes.string,
    main_category_id: PropTypes.number,
    subcategory_id: PropTypes.number,
    main_category_name: PropTypes.string,
    subcategory_name: PropTypes.string,
  }).isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default BusinessBreadcrumbList;
