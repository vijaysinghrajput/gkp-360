import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Link,
} from "@mui/material";
import HeadSeo from "../seo/HeadSeo";
import { useRouter } from "next/router";
import BusinessSubacategoryLists from "../../pages/business/comonent/BusinessSubacategoryLists";
import BusinessListCardRactangular from "../../pages/business/comonent/BusinessListCardRactangular";
import BusinessBreadcrumbList from "../../pages/business/comonent/BusinessBreadcrumbList";

export default function BusinessByCategory({
  categoryslug,
  city,
  state,
  categoryid,
}) {
  const [businesses, setBusinesses] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const title = `${toTitleCase(categoryslug)} in ${toTitleCase(
    city
  )}, ${toTitleCase(state)}`;

  useEffect(() => {
    if (categoryid && city && state && categoryslug) {
      fetchBusinesses();
    }
  }, [categoryid, city, state, categoryslug]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Website/getBusinesses?categoryid=${categoryid}&city=${city}&state=${state}`
      );

      const data = await response.json();

      console.log("data.subcategories.current_category", data.subcategories);

      if (data.status === "success") {
        setBusinesses(data.data);
        setSubcategories(data.subcategories);
        setCurrentCategory(data.subcategories?.current_category);
      } else {
        setBusinesses([]);
        setError(
          data.message || "No businesses found for the specified criteria."
        );
      }
    } catch (err) {
      setError(
        "An error occurred while fetching businesses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f9f9f9"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        bgcolor="#f9f9f9"
        p={3}
      >
        <Typography variant="h6" color="error" align="center" marginBottom={2}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchBusinesses}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <HeadSeo
        title={title}
        description="Your gateway to discovering businesses, jobs, properties, and more."
        canonical="https://gkp360.com/"
      />
      {/* Ad Banner */}

      {/* SEO Main Title */}
      <Typography
        variant="h4"
        align="center"
        marginBottom={2}
        fontWeight="bold"
      >
        {title}
      </Typography>

      {/* SEO Friendly Links */}

      <BusinessBreadcrumbList
        subcategories={subcategories}
        currentCategory={currentCategory}
        city={city}
        state={state}
      />

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f9f9f9",
          minHeight: "100vh", // Ensure it covers the full viewport height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Businesses Column (8 Grid) */}
          <Grid item xs={12} md={8}>
            <BusinessListCardRactangular
              categoryName={toTitleCase(categoryslug)}
              businesses={businesses}
              city={city}
              state={state}
            />
          </Grid>

          {/* Subcategories Column (4 Grid) */}
          <Grid item xs={12} md={4}>
            <BusinessSubacategoryLists
              mainCategoryName={currentCategory.main_category_name}
              subcategories={subcategories.subcategories}
              city={city}
              state={state}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
