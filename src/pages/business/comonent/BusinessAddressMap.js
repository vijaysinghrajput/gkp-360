import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyCetgdiWmPHMxtMMAwbnQpQ-ogsMj27EQw";

const BusinessAddressMap = ({ onAddressSelected }) => {
  const DEFAULT_LOCATION = { lat: 26.7606, lng: 83.3732 }; // Gorakhpur

  const [modalOpen, setModalOpen] = useState(false);
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [marker, setMarker] = useState(DEFAULT_LOCATION);
  const [addressDetails, setAddressDetails] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const searchInputRef = useRef(null);
  const autocompleteServiceRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
      requestLocationPermission();
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

  const fetchAddressDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        const getComponent = (types) => {
          const component = addressComponents.find((comp) =>
            types.some((type) => comp.types.includes(type))
          );
          return component ? component.long_name : "";
        };

        const updatedAddress = {
          area:
            getComponent(["sublocality", "neighborhood"]) ||
            getComponent(["administrative_area_level_2"]),
          city:
            getComponent(["locality"]) ||
            getComponent(["administrative_area_level_2"]),
          state: getComponent(["administrative_area_level_1"]),
          zipCode: getComponent(["postal_code"]),
          street: getComponent(["route"]),
          latitude,
          longitude,
        };

        setAddressDetails(updatedAddress);
        onAddressSelected(updatedAddress);
      } else {
        alert("Unable to fetch address details.");
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      alert("An error occurred while fetching the address.");
    }
  };

  const handleMarkerDragEnd = (e) => {
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();
    setMarker({ lat: latitude, lng: longitude });
    setRegion({ lat: latitude, lng: longitude });
    fetchAddressDetails(latitude, longitude);
  };

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userRegion = {
          lat: latitude,
          lng: longitude,
        };
        setRegion(userRegion);
        setMarker(userRegion);
        fetchAddressDetails(latitude, longitude);
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsFetchingLocation(false);
        alert("Unable to fetch current location. Using default location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePredictionClick = (description) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === "OK" && results[0].geometry) {
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

  return (
    <Box>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Click to Set Business Location
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="map-modal-title"
        aria-describedby="map-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" id="map-modal-title" sx={{ mb: 2 }}>
            Select Business Location
          </Typography>

          {isLoaded ? (
            <>
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
              </Box>
              <Box>
                {isSearching ? (
                  <CircularProgress />
                ) : (
                  predictions.map((prediction) => (
                    <Box
                      key={prediction.place_id}
                      sx={{
                        padding: 1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                      onClick={() =>
                        handlePredictionClick(prediction.description)
                      }
                    >
                      <Typography>{prediction.description}</Typography>
                    </Box>
                  ))
                )}
              </Box>
              <Box sx={{ flex: 1, mb: 2 }}>
                <GoogleMap
                  center={region}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    zoomControl: false,
                    styles: [
                      {
                        featureType: "all",
                        elementType: "labels",
                        stylers: [{ visibility: "on" }],
                      },
                      {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [{ visibility: "on" }],
                      },
                      {
                        featureType: "transit",
                        elementType: "all",
                        stylers: [{ visibility: "on" }],
                      },
                    ],
                  }}
                >
                  <Marker
                    position={marker}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                  />
                </GoogleMap>
              </Box>
              <Button
                variant="contained"
                onClick={requestLocationPermission}
                disabled={isFetchingLocation}
                sx={{ mb: 2 }}
              >
                {isFetchingLocation
                  ? "Fetching Location..."
                  : "Use Current Location"}
              </Button>
              <Typography variant="body2" mb={2}>
                {`${addressDetails.street || ""}, ${
                  addressDetails.area || ""
                }, ${addressDetails.city || ""}, ${
                  addressDetails.state || ""
                }, ${addressDetails.zipCode || ""}`}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setModalOpen(false)}
                fullWidth
              >
                Confirm Location
              </Button>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Modal>
      {addressDetails && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Selected Address:</Typography>
          <Typography variant="body2">
            {`${addressDetails.street || ""}, ${addressDetails.area || ""}, ${
              addressDetails.city || ""
            }, ${addressDetails.state || ""}, ${addressDetails.zipCode || ""}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BusinessAddressMap;
