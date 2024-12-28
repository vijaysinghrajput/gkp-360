import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const BusinessBreadcrumbList = ({
  subcategories,
  currentCategory,
  city,
  state,
}) => {
  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  return (
    <Typography variant="body1" align="center" marginBottom={4}>
      {subcategories.is_parent === "NO" ? (
        <>
          <Link
            href={`/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.main_category_id}/business`}
            underline="hover"
            color="primary"
          >
            {currentCategory.main_category_name}
          </Link>{" "}
          /{" "}
        </>
      ) : null}
      <Link
        href={`/${currentCategory?.category_slug}/${city}/${state}/${currentCategory?.subcategory_id}/business`}
        underline="hover"
        color="primary"
      >
        {currentCategory.subcategory_name}
      </Link>{" "}
      /{" "}
      <Link href={`/city/${city}`} underline="hover" color="primary">
        {toTitleCase(city)}
      </Link>{" "}
      /{" "}
      <Link href={`/state/${state}`} underline="hover" color="primary">
        {toTitleCase(state)}
      </Link>
    </Typography>
  );
};

BusinessBreadcrumbList.propTypes = {
  subcategories: PropTypes.shape({
    is_parent: PropTypes.string.isRequired,
  }).isRequired,
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
