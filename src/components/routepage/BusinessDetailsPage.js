import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import HeadSeo from "../seo/HeadSeo";
import Head from "next/head";
import { useRouter } from "next/router";
import BusinessSubacategoryLists from "../../pages/business/comonent/BusinessSubacategoryLists";
import BusinessDetailsPageCompoenets from "../../pages/business/comonent/props/business-details/BusinessDetailsPageCompoenets";
import BusinessDetailsBreadcrumbList from "../../pages/business/comonent/BusinessDetailsBreadcrumbList";
import { ProjectSetting } from "../../config/ProjectSetting";

export default function BusinessDetailsPage({ titles, listing_id }) {
  const [businesses, setBusinesses] = useState([]);
  const [businessesPhoto, setBusinessPhoto] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (listing_id) {
      fetchBusinesses();
    }
  }, [listing_id]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessesDetails?listing_id=${listing_id}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setBusinesses(data.data);
        setBusinessPhoto(data.photo);
        setCity(data.data[0].city.replace(/\s+/g, "-"));
        setState(data.data[0].state.replace(/\s+/g, "-"));
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

  const toTitleCase = (str) =>
    str
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

  const title = `${toTitleCase(titles)}`;
  const dynamicDescription = businesses.length
    ? businesses[0].about // Check if "about" column is present for the first business
      ? `${
          businesses[0].about
        } Explore top-rated services offered by ${toTitleCase(
          titles
        )} in ${city}, ${state}. Find trusted businesses on ${
          ProjectSetting.COMPANY_NAME
        }.`
      : `Explore top-rated ${toTitleCase(
          titles
        )} businesses in ${city}, ${state} with ${
          businesses.length
        } listings on ${
          ProjectSetting.COMPANY_NAME
        }. Find reviews, services, and trusted businesses tailored to your needs.`
    : `Discover top ${toTitleCase(titles)} businesses in ${city}, ${state} on ${
        ProjectSetting.COMPANY_NAME
      }. Explore services, reviews, and more.`;

  const dynamicKeywords = subcategories?.subcategories
    ?.map((category) => `${category.category_name} in ${city}, ${state}`)
    .join(", ");

  const WebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} - ${ProjectSetting.COMPANY_NAME}`,
    description: dynamicDescription,
    url: `${
      ProjectSetting.COMPANY_WEBSITE +
      "/" +
      businesses[0]?.listing_url +
      "/" +
      listing_id
    }/business-profile`,
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
        {/* Schema for WebPage */}
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
          ProjectSetting.COMPANY_WEBSITE +
          "/" +
          businesses[0]?.listing_url +
          "/" +
          listing_id
        }/business-profile`}
        keywords={dynamicKeywords}
        author={ProjectSetting.COMPANY_NAME}
        robots="index, follow"
        favicon={ProjectSetting.favicon}
        ogImage={ProjectSetting.LOGO_URL}
        twitterImage={ProjectSetting.LOGO_URL}
        language="en"
      />

      <h1
        style={{
          fontSize: "24px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        {title}
      </h1>

      {/* Breadcrumb Navigation */}
      <BusinessDetailsBreadcrumbList
        currentCategory={currentCategory}
        title={title}
        listing_id={listing_id}
        listing_slug={titles}
        city={city}
        state={state}
      />

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f9f9f9",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Businesses Section */}
          <Grid item xs={12} md={8}>
            <BusinessDetailsPageCompoenets
              businesses={businesses}
              businessesPhoto={businessesPhoto}
            />
          </Grid>

          {/* Subcategories Section */}
          <Grid item xs={12} md={4}>
            <BusinessSubacategoryLists
              mainCategoryName={currentCategory?.main_category_name}
              subcategories={subcategories?.subcategories}
              city={city}
              state={state}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
