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
import { useAuth } from "../../context/AuthContext"; // Import AuthContext

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
  const { user } = useAuth(); // Use AuthContext

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

        if (data.status == "success") {
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

    // Validate business name
    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }

    // Validate selected categories
    if (selectedCategories.length === 0) {
      newErrors.categories = "At least one business category is required.";
    }

    // Validate selected subcategories
    if (selectedSubCategories.length === 0) {
      newErrors.subCategories =
        "At least one business subcategory is required.";
    }

    // Validate other fields
    if (!street.trim()) {
      newErrors.street = "Street is required.";
    }
    if (!area.trim()) {
      newErrors.area = "Area is required.";
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
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number validation
    if (!mobile.trim() || !mobileRegex.test(mobile)) {
      newErrors.mobile = "Valid mobile number is required.";
    }

    // Stop if validation errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Generate unique listing ID
    const generateUniqueID = () => {
      const timestamp = new Date().getTime();
      return `${user.id}-${timestamp}-${Math.floor(Math.random() * 100)}`;
    };

    const listingID = generateUniqueID();

    // Generate SEO-friendly URL
    const listingUrl = `${businessName} ${area} ${city} ${state} ${listingID}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    try {
      const payload = {
        planId: planId,
        listing_id: listingID,
        user_id: user.id,
        listing_type: "Business",
        service_type: "Products and Services",
        listing_url: listingUrl,
        title: businessName,
        category: selectedCategories.map((cat) => ({ value: cat.value })),
        subCategory: selectedSubCategories.map((subCat) => ({
          value: subCat.value,
        })),
        street,
        area,
        city,
        zip: pincode,
        state,
        full_address: `${street}, ${area}, ${city}, ${state}, ${pincode}`,
        lat: latitude,
        lan: longitude,
        primary_number: mobile,
      };

      const response = await fetch(
        `${ProjectSetting.APP_API_URL}/Billing/addNewBusinessWeb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setSuccessMessage("Business added successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setErrors((prev) => ({ ...prev, general: data.message }));
      }
    } catch (error) {
      console.error("Error submitting business:", error);
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
    setLatitude(latitude || "");
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
          newError={errors}
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
          label="Area"
          variant="outlined"
          margin="normal"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          error={!!errors.area}
          helperText={errors.area}
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
