import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { ProjectSetting } from "../../config/ProjectSetting";
import SelectBusinessCategoryAndSubCategory from "../business/comonent/SelectBusinessCategoryAndSubCategory";
import BusinessAddressMap from "../business/comonent/BusinessAddressMap";
import axios from "axios";

const PostBusiness = () => {
  const router = useRouter();
  const { planId } = router.query;
  const [planDetails, setPlanDetails] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!planId) {
      setErrors((prev) => ({ ...prev, planId: "Plan ID is required." }));
      setLoading(false);
      return;
    }

    const fetchPlanDetails = async () => {
      try {
        const response = await fetch(
          `${ProjectSetting.API_URL}/Website/getPlanDetails?plan_id=${planId}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setPlanDetails(data.data);
        } else {
          setErrors((prev) => ({ ...prev, general: data.message }));
        }
      } catch (err) {
        console.error("Error fetching plan details:", err);
        setErrors((prev) => ({ ...prev, general: "Something went wrong." }));
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handleSelectionChange = (categories, subCategories) => {
    setSelectedCategories(categories);
    setSelectedSubCategories(subCategories);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }
    if (selectedCategories.length === 0) {
      newErrors.categories = "At least one business category is required.";
    }
    if (selectedSubCategories.length === 0) {
      newErrors.subCategories =
        "At least one business subcategory is required.";
    }
    if (!street.trim()) {
      newErrors.street = "Street is required.";
    }
    if (!city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!pincode.trim() || pincode.length < 6) {
      newErrors.pincode = "Valid pincode is required.";
    }
    if (!mobile.trim() || mobile.length < 10) {
      newErrors.mobile = "Valid mobile number is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        planId,
        businessName,
        categories: selectedCategories.map((cat) => cat.value),
        subCategories: selectedSubCategories.map((subCat) => subCat.value),
        address: `${street}, ${city}, ${state}, ${pincode}`,
        mobile,
      };

      const response = await axios.post(
        `${ProjectSetting.API_URL}/Website/postBusiness`,
        payload
      );

      if (response.data.status === "success") {
        setSuccessMessage("Business added successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setErrors((prev) => ({ ...prev, general: response.data.message }));
      }
    } catch (err) {
      console.error("Error submitting business:", err);
      setErrors((prev) => ({ ...prev, general: "Something went wrong." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSelected = async (selectedAddress) => {
    const { latitude, longitude, street, zipCode, area } = selectedAddress;

    // Set initial values from the selected address
    setStreet(street || "");
    setPincode(zipCode || "");
    setArea(area || "");
    setLongitude(latitude || "");
    setLongitude(longitude || "");

    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (response.data) {
        const { city, principalSubdivision } = response.data;
        setCity(city || "Unknown City");
        setState(principalSubdivision || "Unknown State");
      } else {
        setCity("Unknown City");
        setState("Unknown State");
      }
    } catch (error) {
      console.error("Error fetching city and state from API:", error);
      setCity("Unknown City");
      setState("Unknown State");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: isSmallScreen ? 1 : 2,
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: isSmallScreen ? 2 : 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
          zIndex: 5,
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Add Business
        </Typography>
        {errors.general && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errors.general}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Business Name"
          variant="outlined"
          margin="normal"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          error={!!errors.businessName}
          helperText={errors.businessName}
        />
        <SelectBusinessCategoryAndSubCategory
          onSelectionChange={handleSelectionChange}
          planDetails={planDetails}
        />
        <Box mt={4}>
          <BusinessAddressMap onAddressSelected={handleAddressSelected} />
        </Box>

        <TextField
          fullWidth
          label="Street"
          variant="outlined"
          margin="normal"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          error={!!errors.street}
          helperText={errors.street}
        />
        <TextField
          fullWidth
          label="City"
          variant="outlined"
          margin="normal"
          value={city}
          disabled
          error={!!errors.city}
          helperText={errors.city}
        />
        <TextField
          fullWidth
          label="State"
          variant="outlined"
          disabled
          margin="normal"
          value={state}
          error={!!errors.state}
          helperText={errors.state}
        />
        <TextField
          fullWidth
          label="Pincode"
          variant="outlined"
          margin="normal"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          error={!!errors.pincode}
          helperText={errors.pincode}
        />
        <TextField
          fullWidth
          label="Mobile"
          variant="outlined"
          margin="normal"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          type="tel"
          error={!!errors.mobile}
          helperText={errors.mobile}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Add Business"}
        </Button>
      </Box>
    </Box>
  );
};

export default PostBusiness;
