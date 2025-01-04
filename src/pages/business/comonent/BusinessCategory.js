import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import BusinessSearchBox from "../../../components/ui/BusinessSearchBox";
import BusinessMainCategoryList from "../../../components/ui/BusinessMainCategoryList";
import BusinessLists from "../../../components/ui/BusinessLists";

import { ProjectSetting } from "../../../config/ProjectSetting";

export default function BusinessCategory() {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setCategory(data.category);
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

  const handleCategoryClick = (category) => {};

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
      {/* Search Box */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <BusinessSearchBox
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
        />
      </Box>

      {/* Full Width Grid Layout */}
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {/* Category List */}
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              Categories
            </Typography>
            <BusinessMainCategoryList
              category={category}
              onCategoryClick={handleCategoryClick}
            />
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
            <BusinessLists businesses={businesses} />
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
  );
}
