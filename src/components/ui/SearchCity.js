import { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import { debounce } from "lodash";

export default function SearchCity({ onCitySelect }) {
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(true); // Spinner starts until default is handled
  const [selectedCity, setSelectedCity] = useState(null); // Current selected city and state
  const [locationDeniedCount, setLocationDeniedCount] = useState(0);
  const [hasDefaultSelected, setHasDefaultSelected] = useState(false); // Track default selection
  const MAX_RETRIES = 2;

  useEffect(() => {
    setCityLoading(false);
    if (locationDeniedCount >= MAX_RETRIES || hasDefaultSelected) return;

    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await res.json();
              const city =
                data.locality?.toLowerCase()?.replace(/\s+/g, "-") || "";
              const state =
                data.principalSubdivision
                  ?.toLowerCase()
                  ?.replace(/\s+/g, "-") || "";

              const defaultSelection = {
                city_name: data.locality || "",
                state_name: data.principalSubdivision || "",
              };

              setSelectedCity(defaultSelection);
              onCitySelect({ city, state });
              setCityLoading(false); // Stop spinner after default location selection
              setHasDefaultSelected(true); // Mark default as selected
            } catch (error) {
              console.error("Error fetching geolocation data:", error);
              setCityLoading(false); // Ensure spinner stops on error
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationDeniedCount((prev) => prev + 1);
            setCityLoading(false); // Ensure spinner stops if geolocation fails
          }
        );
      } else {
        console.error("Geolocation not supported by this device.");
        setCityLoading(false); // Stop spinner if geolocation is unsupported
      }
    };

    fetchLocation();
    setCityLoading(false);
  }, [locationDeniedCount, hasDefaultSelected, onCitySelect]);

  const fetchCitySuggestions = async (input) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Website/searchCities?query=${input}`
      );
      const data = await response.json();
      if (data.status === "success") {
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
    return [];
  };

  const handleCitySearch = debounce(async (input, setOptions) => {
    const suggestions = await fetchCitySuggestions(input);
    setOptions(suggestions);
  }, 300);

  return (
    <Autocomplete
      options={Array.isArray(cities) ? cities : []}
      loading={cityLoading}
      getOptionLabel={(option) =>
        option.city_name && option.state_name
          ? `${option.city_name}, ${option.state_name}`
          : ""
      }
      value={selectedCity} // Use the selectedCity state
      onInputChange={(e, value) => {
        if (value) {
          setCityLoading(true);
          handleCitySearch(value, setCities);
        } else {
          setCities([]);
          setCityLoading(false);
        }
      }}
      onChange={(e, value) => {
        if (value) {
          const city =
            value.city_name?.toLowerCase()?.replace(/\s+/g, "-") || "";
          const state =
            value.state_name?.toLowerCase()?.replace(/\s+/g, "-") || "";
          setSelectedCity(value); // Update selected city
          onCitySelect({ city, state });
          setCityLoading(false);
        } else {
          // If cleared, reset to default location
          setSelectedCity(null);
          if (!hasDefaultSelected) {
            setCityLoading(true); // Re-enable spinner while re-applying default
          }
        }
        setCityLoading(false); // Ensure spinner stops after any selection
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search city"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {cityLoading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ width: "300px" }}
    />
  );
}
