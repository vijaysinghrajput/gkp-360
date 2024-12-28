import React, { useState, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  Autocomplete,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { debounce } from "lodash";

export default function SearchBusinessCategory({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch default categories on mount
    const fetchDefaultCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Website/getDefaultCategories`
        );
        const data = await response.json();
        if (data.status === "success") {
          setDefaultCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching default categories:", error);
      }
    };

    fetchDefaultCategories();
  }, []);

  const fetchCategorySuggestions = async (input) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Website/searchCategories?query=${input}`
      );
      const data = await response.json();
      if (data.status === "success") {
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching category suggestions:", error);
    }
    return [];
  };

  const handleCategorySearch = debounce(async (input) => {
    setLoading(true);
    const suggestions = await fetchCategorySuggestions(input);
    setCategories(suggestions);
    setLoading(false);
  }, 300);

  const handleInputChange = (e, value) => {
    setInputValue(value);
    if (value.trim()) {
      handleCategorySearch(value);
    } else {
      setCategories([]); // Reset categories if input is cleared
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (typeof onCategorySelect === "function") {
      onCategorySelect(category);
    } else {
      console.error("onCategorySelect is not a function");
    }
  };

  return (
    <Box>
      <Autocomplete
        options={categories.length > 0 ? categories : defaultCategories}
        loading={loading}
        getOptionLabel={(option) => option.category_name || ""}
        noOptionsText={
          loading
            ? "Loading..."
            : categories.length === 0
            ? "No results found"
            : ""
        }
        value={selectedCategory}
        onInputChange={handleInputChange}
        onChange={(e, value) => handleCategorySelect(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search category"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{ width: "300px" }}
      />

      {/* Default Categories (Optional Display Below Search) */}
    </Box>
  );
}
