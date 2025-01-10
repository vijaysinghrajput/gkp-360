import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import HeadSeo from "@/components/seo/HeadSeo";
import BusinessSearchBox from "../../../components/ui/BusinessSearchBox";
import BusinessMainCategoryList from "../../../components/ui/BusinessMainCategoryList";
import BusinessListsForBusinessPage from "../../../components/ui/BusinessListsForBusinessPage";
import BusinessAllCategoryList from "../../../components/ui/BusinessAllCategoryList";
import Head from "next/head";

import { ProjectSetting } from "../../../config/ProjectSetting";

export default function BusinessCategory() {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getAllBusinessList`
      );
      const data = await response.json();
      if (data.status === "success") {
        setBusinesses(data.data);
        setCategory(data.category);
        setMainCategory(data.main_category);
        setFilteredBusinesses(data.data);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setError("Failed to fetch businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    const query = searchTerm.toLowerCase();
    const filtered = businesses.filter((business) =>
      business.title.toLowerCase().includes(query)
    );
    setFilteredBusinesses(filtered);
  };

  const WebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Explore Business Categories & Listings - ${ProjectSetting.COMPANY_NAME}`,
    description: `Discover a comprehensive list of business categories and explore top businesses on ${ProjectSetting.COMPANY_NAME}. Find services, products, and local businesses tailored to your needs.`,
    url: `${ProjectSetting.COMPANY_WEBSITE}/business`,
    author: {
      "@type": "Organization",
      name: ProjectSetting.COMPANY_NAME,
      url: `${ProjectSetting.COMPANY_WEBSITE}`,
    },
  };

  const BreadCrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: ProjectSetting.COMPANY_WEBSITE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Business",
        item: `${ProjectSetting.COMPANY_WEBSITE}/business`,
      },
    ],
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
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
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(BreadCrumbSchema),
          }}
        />
      </Head>

      <HeadSeo
        title={`Explore Business Categories & Listings - ${ProjectSetting.COMPANY_NAME}`}
        description={`Discover a comprehensive list of business categories and explore top businesses on ${ProjectSetting.COMPANY_NAME}. Find services, products, and local businesses tailored to your needs.`}
        canonical={`${ProjectSetting.COMPANY_WEBSITE}/business`}
        keywords={mainCategory
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
          // backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        {/* Breadcrumb */}
        <Box
          sx={{
            padding: "10px 20px",
            // backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            >
              Home
            </Link>
            <Typography color="text.primary">Business</Typography>
          </Breadcrumbs>
        </Box>

        {/* Search Box */}
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <BusinessSearchBox title="Find the Best Businesses in Your City - Search by Category and Location" />
        </Box>

        {/* Full Width Grid Layout */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold" }}
              >
                Primary Categories
              </Typography>
              <BusinessMainCategoryList category={mainCategory} />
            </Box>
          </Grid>

          {/* Business List */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 2,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold" }}
              >
                Businesses
              </Typography>
              <BusinessListsForBusinessPage businesses={businesses} />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} md={12}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 2,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold" }}
              >
                Businesses Categories
              </Typography>
              <BusinessAllCategoryList category={category} />
            </Box>
          </Grid>
        </Grid>

        {/* Error Snackbar */}
        {error && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setError("")}
          >
            <Alert onClose={() => setError("")} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </>
  );
}
