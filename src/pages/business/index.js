import Link from "next/link";
import HeadSeo from "../../components/seo/HeadSeo";
import Banner from "../../components/ui/Banner";
import BusinessCategory from "./comonent/BusinessCategory";

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
        <BusinessCategory />

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
