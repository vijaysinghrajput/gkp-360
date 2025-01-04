import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { ProjectSetting } from "../../../../config/ProjectSetting";

const GOOGLE_MAPS_API_KEY = "AIzaSyCetgdiWmPHMxtMMAwbnQpQ-ogsMj27EQw";

function UpdateBusinessAddress({ initialData, onSave, onCancel }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState({
    lat: parseInt(initialData.lat) || 26.7606,
    lng: parseInt(initialData.lan) || 83.3732,
  });
  const [marker, setMarker] = useState({
    lat: parseInt(initialData.lat) || 26.7606,
    lng: parseInt(initialData.lan) || 83.3732,
  });
  const [predictions, setPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [modalMessage, setModalMessage] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const searchInputRef = useRef(null);
  const autocompleteServiceRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setRegion({
        lat: parseInt(initialData.lat) || 26.7606,
        lng: parseInt(initialData.lan) || 83.3732,
      });
      setMarker({
        lat: parseInt(initialData.lat) || 26.7606,
        lng: parseInt(initialData.lan) || 83.3732,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isLoaded) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleSearchInputChange = () => {
    const input = searchInputRef.current?.value;
    if (input && autocompleteServiceRef.current) {
      setIsSearching(true);
      autocompleteServiceRef.current.getPlacePredictions(
        { input, componentRestrictions: { country: "in" } },
        (results) => {
          setPredictions(results || []);
          setIsSearching(false);
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionClick = (description) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === "OK" && results[0]?.geometry) {
        const location = results[0].geometry.location;
        const newRegion = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setRegion(newRegion);
        setMarker(newRegion);
        fetchAddressDetails(location.lat(), location.lng());
        setPredictions([]);
      }
    });
  };

  const fetchAddressDetails = async (latitude, longitude) => {
    try {
      const googleResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const googleData = await googleResponse.json();

      let updatedAddress = {
        street: "",
        area: "",
        city: "",
        state: "",
        zip: "",
        lat: "",
        lan: "",
      };

      if (googleData.results && googleData.results.length > 0) {
        const addressComponents = googleData.results[0].address_components;

        const getComponent = (types) => {
          const component = addressComponents.find((comp) =>
            types.some((type) => comp.types.includes(type))
          );
          return component ? component.long_name : "";
        };

        updatedAddress = {
          ...updatedAddress,
          street: getComponent(["route"]),
          area: getComponent(["sublocality", "neighborhood"]),
          zip: getComponent(["postal_code"]),
          lat: latitude,
          lan: longitude,
        };
      }

      const bigDataResponse = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (bigDataResponse.data) {
        updatedAddress.city = bigDataResponse.data.city || "Unknown City";
        updatedAddress.state =
          bigDataResponse.data.principalSubdivision || "Unknown State";
      } else {
        updatedAddress.city = "Unknown City";
        updatedAddress.state = "Unknown State";
      }

      setData((prev) => ({
        ...prev,
        ...updatedAddress,
      }));
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleMarkerDragEnd = (e) => {
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();
    setMarker({ lat: latitude, lng: longitude });
    fetchAddressDetails(latitude, longitude);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setModalMessage("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({ lat: latitude, lng: longitude });
        setMarker({ lat: latitude, lng: longitude });
        fetchAddressDetails(latitude, longitude);
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsFetchingLocation(false);
        setModalMessage("Unable to fetch current location. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSave = async () => {
    const errors = {};

    if (!data?.street?.trim()) errors.street = "Street is required.";
    if (!data?.area?.trim()) errors.area = "Area is required.";
    if (!data?.city?.trim()) errors.city = "City is required.";
    if (!data?.state?.trim()) errors.state = "State is required.";
    if (!data?.zip?.trim()) errors.zip = "Zip Code is required.";

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setIsLoading(true);

    const generateListingUrl = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    };

    const listingUrl = generateListingUrl(
      `${data.title || ""} ${data.street}, ${data.area}, ${data.city}, ${
        data.zip
      }, ${data.state}`
    );

    const payload = {
      listing_id: data.listing_id || "",
      listingUrl,
      street: data.street,
      area: data.area,
      city: data.city,
      zip: data.zip,
      state: data.state,
      full_address: `${data.street}, ${data.area}, ${data.city}, ${data.zip}, ${data.state}`,
      lat: data.lat,
      lan: data.lan,
    };

    try {
      const response = await axios.post(
        `${ProjectSetting.API_URL}/Website/updateBusinessLocation`,
        payload
      );

      if (response.data.status === "success") {
        onSave();
        setModalMessage("Business address updated successfully!");
      } else {
        throw new Error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setModalMessage("Failed to update business address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <TextField
        fullWidth
        label="Street"
        value={data?.street || ""}
        error={!!errorMessages.street}
        helperText={errorMessages.street || ""}
        onChange={(e) => {
          setData({ ...data, street: e.target.value });
          setErrorMessages((prev) => ({ ...prev, street: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Area"
        value={data?.area || ""}
        error={!!errorMessages.area}
        helperText={errorMessages.area || ""}
        onChange={(e) => {
          setData({ ...data, area: e.target.value });
          setErrorMessages((prev) => ({ ...prev, area: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="City"
        value={data?.city || ""}
        disabled
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="State"
        value={data?.state || ""}
        disabled
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Zip Code"
        value={data?.zip || ""}
        error={!!errorMessages.zip}
        helperText={errorMessages.zip || ""}
        onChange={(e) => {
          setData({ ...data, zip: e.target.value });
          setErrorMessages((prev) => ({ ...prev, zip: "" }));
        }}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Address..."
          onChange={handleSearchInputChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {isSearching ? (
          <CircularProgress />
        ) : (
          predictions.map((prediction) => (
            <Box
              key={prediction.place_id}
              onClick={() => handlePredictionClick(prediction.description)}
              sx={{
                padding: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {prediction.description}
            </Box>
          ))
        )}
      </Box>
      {isLoaded && (
        <GoogleMap
          center={region}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "300px" }}
        >
          <Marker position={marker} draggable onDragEnd={handleMarkerDragEnd} />
        </GoogleMap>
      )}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleUseCurrentLocation}
          disabled={isFetchingLocation}
          sx={{ marginRight: 2 }}
        >
          {isFetchingLocation ? "Fetching..." : "Use Current Location"}
        </Button>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
      <Dialog
        open={!!modalMessage}
        onClose={() => setModalMessage("")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalMessage("")} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UpdateBusinessAddress;
