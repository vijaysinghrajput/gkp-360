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
// import BusinessByCategorySchemaList from "../seo/business/BusinessByCategorySchemaList";
import { useRouter } from "next/router";
import BusinessMaincategoryLists from "../../pages/business/comonent/BusinessMaincategoryLists";
import BusinessListCardRactangular from "../../pages/business/comonent/BusinessListCardRactangular";
import BusinessBreadcrumbListForMainCategory from "../../pages/business/comonent/props/breadcrumblist/BusinessBreadcrumbListForMainCategory";
import { ProjectSetting } from "../../config/ProjectSetting";
import BusinessSearchBox from "../ui/BusinessSearchBox";

export default function BusinessByMainCategory({ categoryslug, categoryid }) {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const title = `${toTitleCase(categoryslug)}`;

  useEffect(() => {
    if (categoryid && categoryslug) {
      fetchBusinesses();
    }
  }, [categoryid, categoryslug]);

  const fetchBusinesses = async () => {
    console.log("categoryid", categoryid);
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessesbyMainCategory?categoryid=${categoryid}`
      );

      const data = await response.json();

      //   console.log("data.categories.current_category", data.categories);

      if (data.status === "success") {
        setBusinesses(data.data);
        setCategories(data.category);
        // setCurrentCategory(data.categories?.current_category);
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

      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <BusinessSearchBox title={title} />
      </Box>

      {/* SEO Friendly Links */}

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f9f9f9",
        }}
      >
        <BusinessBreadcrumbListForMainCategory
          title={title}
          slug={categoryslug}
          id={categoryid}
        />
      </Box>

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
            />
          </Grid>

          {/* categories Column (4 Grid) */}
          <Grid item xs={12} md={4}>
            <BusinessMaincategoryLists
              mainCategoryName={title}
              categories={categories}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
