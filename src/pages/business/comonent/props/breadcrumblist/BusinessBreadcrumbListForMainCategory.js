import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Head from "next/head";
import { ProjectSetting } from "../../../../../config/ProjectSetting";
const BusinessBreadcrumbListForMainCategory = ({ title, slug, id }) => {
  const domain = ProjectSetting.COMPANY_WEBSITE; // Replace with your domain

  // Breadcrumb schema definition
  const breadcrumbSchema = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${domain}/${slug}/${id}/business-main-category`,
      },
    ],
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
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
        <Link href="/" passHref style={{ textDecoration: "none" }}>
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
        <Link href="/business" passHref style={{ textDecoration: "none" }}>
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
        <Typography
          color="text.primary"
          sx={{
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </Breadcrumbs>
    </>
  );
};

BusinessBreadcrumbListForMainCategory.propTypes = {
  title: PropTypes.string.isRequired, // Title for the last breadcrumb
  slug: PropTypes.string.isRequired, // Slug for the category
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID for the category
};

export default BusinessBreadcrumbListForMainCategory;
