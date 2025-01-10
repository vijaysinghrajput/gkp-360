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
import Head from "next/head";

// import BusinessByCategorySchemaList from "../seo/business/BusinessByCategorySchemaList";
import { useRouter } from "next/router";
import BusinessAllSubacategoryLists from "../../pages/business/comonent/BusinessAllSubacategoryLists";
import BusinessListCardRactangular from "../../pages/business/comonent/BusinessListCardRactangular";
import { ProjectSetting } from "../../config/ProjectSetting";
import BusinessBreadcrumbListForAllCategory from "@/pages/business/comonent/props/breadcrumblist/BusinessBreadcrumbListForAllCategory";

export default function BusinessByAllCategoryPage({
  categoryslug,
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

  const title = `${toTitleCase(categoryslug)}`;

  const dynamicDescription = businesses.length
    ? `Explore the best ${title} with ${businesses.length} businesses listed on ${ProjectSetting.COMPANY_NAME}. Find top-rated services, reviews, and detailed information to help you make informed decisions.`
    : `Discover top ${title} businesses on ${ProjectSetting.COMPANY_NAME}. Find services, reviews, and essential information tailored to your needs.`;

  useEffect(() => {
    if (categoryid && categoryslug) {
      fetchBusinesses();
    }
  }, [categoryid, categoryslug]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessesByAllCategory?categoryid=${categoryid}`
      );

      const data = await response.json();

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

  const WebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} - ${ProjectSetting.COMPANY_NAME}`,
    description: dynamicDescription,
    url: `${
      ProjectSetting.COMPANY_WEBSITE + "/" + categoryslug + "/" + categoryid
    }/business-category`,
    author: {
      "@type": "Organization",
      name: ProjectSetting.COMPANY_NAME,
      url: `${ProjectSetting.COMPANY_WEBSITE}`,
    },
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
      <Head>
        {/* WebPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WebPageSchema),
          }}
        />
      </Head>

      <HeadSeo
        title={`${title} - ${ProjectSetting.COMPANY_NAME}`}
        description={dynamicDescription}
        canonical={`${
          ProjectSetting.COMPANY_WEBSITE + "/" + categoryslug + "/" + categoryid
        }/business-category`}
        keywords={subcategories.subcategories
          .map((category) => category.category_name)
          .join(", ")}
        author={ProjectSetting.COMPANY_NAME}
        robots="index, follow"
        favicon={ProjectSetting.favicon}
        ogImage={ProjectSetting.LOGO_URL}
        twitterImage={ProjectSetting.LOGO_URL}
        language="en"
      />

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

      <BusinessBreadcrumbListForAllCategory currentCategory={currentCategory} />

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

          {/* Subcategories Column (4 Grid) */}
          <Grid item xs={12} md={4}>
            <BusinessAllSubacategoryLists
              mainCategoryName={currentCategory.main_category_name}
              subcategories={subcategories.subcategories}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
