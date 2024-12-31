import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ProjectSetting } from "../../../config/ProjectSetting";

const SelectBusinessCategoryAndSubCategory = ({
  onSelectionChange,
  planDetails,
}) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [errors, setErrors] = useState({});

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
          setCategories(categoryOptions);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (selected) => {
    if (planDetails.plan_id == 1) {
      if (selected.length > 1) {
        setErrors({
          categories:
            "You can select up to 1 categories only in Plan " +
            planDetails.plan_name,
        });
        return;
      }
    }
    if (planDetails.plan_id == 3) {
      if (selected.length > 3) {
        setErrors({
          categories:
            "You can select up to 3 categories only in Plan " +
            planDetails.plan_name,
        });
        return;
      }
    }
    if (planDetails.plan_id == 5) {
      if (selected.length > 5) {
        setErrors({
          categories:
            "You can select up to 5 categories only in Plan " +
            planDetails.plan_name,
        });
        return;
      }
    }
    setSelectedCategories(selected);
    setErrors((prev) => ({ ...prev, categories: null }));

    const categoryIds = selected.map((item) => item.value);

    if (categoryIds.length > 0) {
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
    } else {
      setSubCategories([]);
    }

    // Notify parent about changes
    onSelectionChange(selected, selectedSubCategories);
  };

  const handleSubCategoryChange = (selected) => {
    setSelectedSubCategories(selected);

    // Notify parent about changes
    onSelectionChange(selectedCategories, selected);
  };

  return (
    <div>
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
    </div>
  );
};

export default SelectBusinessCategoryAndSubCategory;
