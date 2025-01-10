import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SearchCity from "./SearchCity";
import SearchBusinessCategory from "./SearchBusinessCategory";

export default function BusinessSearchBox({ title }) {
  const [location, setLocation] = useState({ city: "", state: "" });
  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    category_name_slug: "",
  });

  const router = useRouter();

  const handleSearch = () => {
    if (
      !location.city ||
      !location.state ||
      !selectedCategory?.category_name_slug ||
      !selectedCategory?.id
    ) {
      alert("Please select a city and category before searching.");
      return;
    }
    // Redirect to the next page
    router.push(
      `/${selectedCategory?.category_name_slug}/${location.city}/${location.state}/${selectedCategory?.id}/business`
    );
  };

  const handleListYourBusiness = () => {
    // Redirect to the list your business page
    router.push("/business/list-your-business");
  };

  const isSearchDisabled =
    !location.city ||
    !location.state ||
    !selectedCategory?.category_name_slug ||
    !selectedCategory?.id;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* SEO-Friendly Title */}
      <h1
        style={{
          fontSize: "24px", // Small screens
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        {title}
      </h1>
      <Grid container spacing={2}>
        {/* List Your Business Section */}
        <Grid item xs={12} md={3}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleListYourBusiness}
            sx={{ height: "56px", width: "100%" }}
          >
            List Your Business
          </Button>
        </Grid>

        {/* Search Business Section */}
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SearchCity
              onCitySelect={(loc) => setLocation(loc)}
              sx={{ flex: 1, minWidth: "200px" }}
            />
            <SearchBusinessCategory
              onCategorySelect={(category) => setSelectedCategory(category)}
              sx={{ flex: 1, minWidth: "200px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={isSearchDisabled}
              sx={{ height: "56px", minWidth: "200px" }}
            >
              Search Business
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
