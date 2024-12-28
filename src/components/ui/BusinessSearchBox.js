import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import SearchCity from "./SearchCity";
import SearchBusinessCategory from "./SearchBusinessCategory";

export default function BusinessSearchBox() {
  const [location, setLocation] = useState({ city: "", state: "" });
  const [selectedCategory, setSelectedCatgeory] = useState({
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

  const isSearchDisabled =
    !location.city ||
    !location.state ||
    !selectedCategory?.category_name_slug ||
    !selectedCategory?.id;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <SearchCity onCitySelect={(loc) => setLocation(loc)} />
      <SearchBusinessCategory
        onCategorySelect={(category) => setSelectedCatgeory(category)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={isSearchDisabled}
        sx={{ height: "56px" }}
      >
        Search Business1
      </Button>
    </Box>
  );
}
