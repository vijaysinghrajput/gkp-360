import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import default styles
import styles from "../../styles/Banner.module.css"; // Import custom CSS

export default function Banner() {
  return (
    <>
      {/* Carousel Section */}
      <div className={styles.carouselContainer}>
        <Carousel
          showThumbs={false}
          autoPlay={true}
          infiniteLoop={true}
          interval={5000}
          showStatus={false}
        >
          <div className={styles.bannerItem}>
            <img
              src="https://gkp360.com/admin-panel/assets/banners/1733821266_Untitled%20design%20-%202024-12-10T140550.238.png"
              alt="Businesses"
              className={styles.bannerImage}
            />
            <p className="legend">
              <Link href="/business">
                <span style={{ color: "#fff", textDecoration: "underline" }}>
                  Explore Businesses
                </span>
              </Link>
            </p>
          </div>
          <div className={styles.bannerItem}>
            <img
              src="https://gkp360.com/admin-panel/assets/banners/1733821266_Untitled%20design%20-%202024-12-10T140550.238.png"
              alt="Jobs"
              className={styles.bannerImage}
            />
            <p className="legend">
              <Link href="/jobs">
                <span style={{ color: "#fff", textDecoration: "underline" }}>
                  Explore Jobs
                </span>
              </Link>
            </p>
          </div>
          <div className={styles.bannerItem}>
            <img
              src="https://gkp360.com/admin-panel/assets/banners/1733821266_Untitled%20design%20-%202024-12-10T140550.238.png"
              alt="Properties"
              className={styles.bannerImage}
            />
            <p className="legend">
              <Link href="/properties">
                <span style={{ color: "#fff", textDecoration: "underline" }}>
                  Explore Properties
                </span>
              </Link>
            </p>
          </div>
        </Carousel>
      </div>
    </>
  );
}
