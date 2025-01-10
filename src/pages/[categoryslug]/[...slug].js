import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
import BusinessByCategory from "../../components/routepage/BusinessByCategory";
import BusinessByMainCategory from "../../components/routepage/BusinessByMainCategory";
import BusinessDetailsPage from "../../components/routepage/BusinessDetailsPage";

const DynamicPage = () => {
  const router = useRouter();
  const { categoryslug, slug } = router.query;

  if (!slug || !Array.isArray(slug)) {
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

  // Parse Parameters
  const id = slug[0]; // Main ID
  const routingParam = slug[slug.length - 1]; // Last element as routing parameter
  const otherParams = slug.slice(1, -1); // All intermediate parameters

  console.log("id", id);
  console.log("routingParam", routingParam);
  console.log("otherParams", otherParams);
  console.log("routingParam", routingParam);

  switch (routingParam) {
    case "business":
      return (
        <BusinessByCategory
          categorySlug={categoryslug}
          id={id}
          additionalParams={otherParams}
        />
      );
    case "business-main-category":
      return (
        <BusinessByMainCategory categoryslug={categoryslug} categoryid={id} />
      );

    case "business-profile":
      return <BusinessDetailsPage titles={categoryslug} listing_id={id} />;

    default:
      return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography variant="h4" color="error">
            Invalid route specified.
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Please check the URL or contact support if the issue persists.
          </Typography>
        </Box>
      );
  }
};

export default DynamicPage;
