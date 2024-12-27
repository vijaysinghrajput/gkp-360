import { useEffect, useState } from "react";
import Link from "next/link";

export default function BusinessCategory() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Website/getBusinessCategory`
        );
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.data);
          setFilteredCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f4f7fc",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          marginBottom: "20px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search categories..."
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "box-shadow 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #4CAF50")}
          onBlur={(e) =>
            (e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
          }
        />
      </div>

      {/* Categories Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
          overflow: "auto",
          flex: 1, // Allows the grid to stretch and take up the remaining space
          padding: "10px",
        }}
      >
        {filteredCategories.map((category, index) => (
          <Link
            href={`/categories/${category.category_name_slug}`}
            key={index}
            passHref
          >
            <div
              style={{
                width: "100%",
                height: "150px",
                maxWidth: "150px",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease, background-color 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.backgroundColor = "#4CAF50";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#000";
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  wordBreak: "break-word",
                  textAlign: "center",
                  maxWidth: "100%",
                }}
              >
                {category.category_name}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {category.hindi_name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Found */}
      {filteredCategories.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#999",
            fontSize: "18px",
          }}
        >
          No categories found.
        </div>
      )}
    </div>
  );
}
