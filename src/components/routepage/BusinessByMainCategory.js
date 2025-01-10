import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import HeadSeo from "../seo/HeadSeo";
import Head from "next/head";
import { useRouter } from "next/router";
import BusinessMaincategoryLists from "../../pages/business/comonent/BusinessMaincategoryLists";
import BusinessListCardRactangular from "../../pages/business/comonent/BusinessListCardRactangular";
import BusinessBreadcrumbListForMainCategory from "../../pages/business/comonent/props/breadcrumblist/BusinessBreadcrumbListForMainCategory";
import { ProjectSetting } from "../../config/ProjectSetting";
import BusinessSearchBox from "../ui/BusinessSearchBox";

export default function BusinessByMainCategory({ categoryslug, categoryid }) {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
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
        `${ProjectSetting.API_URL}/Website/getBusinessesbyMainCategory?categoryid=${categoryid}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setBusinesses(data.data);
        setCategories(data.category);
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
    }/business-main-category`,
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
        }/business-main-category`}
        keywords={categories
          .map((category) => category.category_name)
          .join(", ")}
        author={ProjectSetting.COMPANY_NAME}
        robots="index, follow"
        favicon={ProjectSetting.favicon}
        ogImage={ProjectSetting.LOGO_URL}
        twitterImage={ProjectSetting.LOGO_URL}
        language="en"
      />

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
          {!error && (
            <Grid item xs={12} md={8}>
              <BusinessListCardRactangular
                categoryName={toTitleCase(categoryslug)}
                businesses={businesses}
              />
            </Grid>
          )}

          {/* Categories Column (4 Grid) */}
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
