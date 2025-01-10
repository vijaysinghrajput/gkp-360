import Link from "next/link";
import Banner from "../../components/ui/Banner";
import BusinessCategory from "./comonent/BusinessCategory";
import BusinessStateCityList from "./comonent/BusinessStateCityList";

export default function Home() {
  return (
    <>
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
