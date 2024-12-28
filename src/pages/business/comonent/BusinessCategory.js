import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import BusinessSearchBox from "../../../components/ui/BusinessSearchBox";

import { ProjectSetting } from "../../../config/ProjectSetting";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ city: "", state: "" });
  const [selectedCategory, setSelectedCatgeory] = useState({
    id: null,
    category_name_slug: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `${ProjectSetting.API_URL}/Website/getAllBusinessList`
      );
      const data = await response.json();
      if (data.status === "success") {
        setBusinesses(data.data);
        setFilteredBusinesses(data.data);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
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
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: "64px",
          zIndex: 10,
          backgroundColor: "#fff",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <BusinessSearchBox />
      </Box>

      <Typography
        variant="h6"
        align="center"
        color="primary.main"
        sx={{ marginY: 3 }}
      >
        {location.city && location.state
          ? `Showing results for ${location.city.replace(
              /-/g,
              " "
            )}, ${location.state.replace(/-/g, " ")}`
          : "Set your location to see results"}
      </Typography>

      <Typography
        variant="h6"
        align="center"
        color="primary.main"
        sx={{ marginY: 3 }}
      >
        {selectedCategory?.category_name_slug}
      </Typography>

      <Grid container spacing={3} sx={{ padding: "20px" }}>
        {filteredBusinesses.map((business, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link
              href={`/business/${location.city}/${location.state}/${business.listing_id}`}
              passHref
            >
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {business.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {business.full_address}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Phone: {business.primary_number}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
        {filteredBusinesses.length === 0 && (
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ width: "100%", marginTop: 3 }}
          >
            No businesses found.
          </Typography>
        )}
      </Grid>

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
  );
}
