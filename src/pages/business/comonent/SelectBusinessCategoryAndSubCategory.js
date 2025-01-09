import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ProjectSetting } from "../../../config/ProjectSetting";

const SelectBusinessCategoryAndSubCategory = ({
  onSelectionChange,
  planDetails,
  newError,
}) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (newError) {
      setErrors(newError);
    }
  }, [newError]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${ProjectSetting.APP_API_URL}/Billing/getCategories`
        );
        if (response.data.status === "success") {
          const categoryOptions = response.data.data.map((cat) => ({
            value: cat.id,
            label: cat.category_name,
          }));

          const maincategoryOptions = response.data.main_category.map(
            (cat) => ({
              value: cat.id,
              label: cat.category_name,
            })
          );
          setCategories(categoryOptions);
          setMainCategories(maincategoryOptions);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleMainCategoryChange = (selected) => {
    setSelectedMainCategory(selected);
    // Notify parent about changes, including the main category
    onSelectionChange(selected, selectedCategories, selectedSubCategories);
  };

  const handleCategoryChange = (selected) => {
    let validationError = "";

    // Validation based on plan ID
    if (planDetails.plan_id == 1 && selected.length > 1) {
      validationError = `You can select up to 1 categories only in Plan ${planDetails.plan_name}`;
    } else if (planDetails.plan_id == 3 && selected.length > 3) {
      validationError = `You can select up to 3 categories only in Plan ${planDetails.plan_name}`;
    } else if (planDetails.plan_id == 3 && selected.length > 5) {
      validationError = `You can select up to 5 categories only in Plan ${planDetails.plan_name}`;
    }

    // If there's a validation error, set the error state and return
    if (validationError) {
      setErrors((prev) => ({ ...prev, categories: validationError }));
      return;
    }

    // Update selected categories and clear any existing category errors
    setSelectedCategories(selected);
    setErrors((prev) => ({ ...prev, categories: null }));

    // Clear subcategories as categories have changed
    setSubCategories([]);
    setSelectedSubCategories([]);

    // Notify parent about the changes
    onSelectionChange(selectedMainCategory, selected, []);

    // Fetch subcategories if any categories are selected
    if (selected.length > 0) {
      const categoryIds = selected.map((item) => item.value);

      axios
        .post(`${ProjectSetting.APP_API_URL}/Billing/getSubCategories`, {
          category_ids: categoryIds,
        })
        .then((response) => {
          if (response.data.status === "success") {
            const subCategoryOptions = response.data.data.map((subCat) => ({
              value: subCat.id,
              label: subCat.category_name,
            }));
            setSubCategories(subCategoryOptions);
          } else {
            setSubCategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
          setSubCategories([]);
        });
    }
  };

  const handleSubCategoryChange = (selected) => {
    setSelectedSubCategories(selected);

    // Notify parent about changes
    onSelectionChange(selectedMainCategory, selectedCategories, selected);
  };
  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Main Business Category
      </Typography>
      <Select
        options={mainCategories}
        onChange={handleMainCategoryChange}
        value={selectedMainCategory}
        placeholder="Select main category"
        isClearable
        maxMenuHeight={250}
        styles={{
          menu: (base) => ({ ...base, zIndex: 10 }),
        }}
      />
      {errors.mainCategory && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          {errors.mainCategory}
        </Typography>
      )}

      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Business Category
      </Typography>
      <Select
        options={categories}
        isMulti
        onChange={handleCategoryChange}
        value={selectedCategories}
        placeholder="Select categories"
        closeMenuOnSelect={false}
        maxMenuHeight={250}
        styles={{
          menu: (base) => ({ ...base, zIndex: 10 }),
        }}
      />
      {errors.categories && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          {errors.categories}
        </Typography>
      )}

      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
        Business Subcategory
      </Typography>
      <Select
        options={subCategories}
        isMulti
        onChange={handleSubCategoryChange}
        value={selectedSubCategories}
        placeholder="Select subcategories"
        closeMenuOnSelect={false}
        maxMenuHeight={250}
        styles={{
          menu: (base) => ({ ...base, zIndex: 10 }),
        }}
      />
      {errors.subCategories && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          {errors.subCategories}
        </Typography>
      )}
    </div>
  );
};

export default SelectBusinessCategoryAndSubCategory;
