import Link from "next/link";
import HeadSeo from "../../components/seo/HeadSeo";
import Banner from "../../components/ui/Banner";

export default function Home() {
  const categories = [
    {
      title: "Businesses",
      icon: "https://img.icons8.com/fluency/48/briefcase.png",
      link: "/business",
    },
    {
      title: "Jobs",
      icon: "https://img.icons8.com/fluency/48/job.png",
      link: "/jobs",
    },
    {
      title: "Properties",
      icon: "https://img.icons8.com/fluency/48/home.png",
      link: "/properties",
    },
    {
      title: "Services",
      icon: "https://img.icons8.com/fluency/48/technical-support.png",
      link: "/services",
    },
  ];

  return (
    <>
      <HeadSeo
        title="Business | GKP 360 - Explore Listings"
        description="Your gateway to discovering businesses, jobs, properties, and more."
        canonical="https://gkp360.com/"
      />
      <div style={{ padding: "10px" }}>
        {/* Carousel Section */}
        <Banner />

        {/* Category Section */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>Explore Categories</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {categories.map((category, index) => (
              <Link href={category.link} key={index} passHref>
                <div
                  style={{
                    width: "120px",
                    textAlign: "center",
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={category.icon}
                    alt={category.title}
                    style={{
                      width: "48px",
                      height: "48px",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {category.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* App Download Section */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>Download Our App</h2>
          <p>Experience the GKP 360 app for seamless browsing.</p>
          <Link href="/download">
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Download Now
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
