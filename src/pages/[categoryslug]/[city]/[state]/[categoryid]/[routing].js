import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";

import BusinessByCategory from "../../../../../components/routepage/BusinessByCategory";
// import JobByCategory from "../../../../../components/routepage/JobByCategory";

export default function DynamicCategoryPage() {
  const router = useRouter();
  const { categoryslug, city, state, categoryid, routing } = router.query;

  // Show a loading spinner while the route parameters are loading
  if (router.isFallback || !routing) {
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

  // Render the appropriate component based on the `routing` parameter
  switch (routing) {
    case "business":
      return (
        <BusinessByCategory
          categoryslug={categoryslug}
          city={city}
          state={state}
          categoryid={categoryid}
        />
      );

    // case "job":
    //   return (
    //     <JobByCategory
    //       categoryslug={categoryslug}
    //       city={city}
    //       state={state}
    //       categoryid={categoryid}
    //     />
    //   );

    // Add more cases as needed for additional routes
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
}
