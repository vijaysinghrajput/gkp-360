import Link from "next/link";
import HeadSeo from "../../components/seo/HeadSeo";
import Banner from "../../components/ui/Banner";
import BusinessCategory from "./comonent/BusinessCategory";
import BusinessStateCityList from "./comonent/BusinessStateCityList";

export default function Home() {
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
        {/* <BusinessStateCityList /> */}
      </div>
    </>
  );
}
