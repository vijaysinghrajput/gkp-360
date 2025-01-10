import Head from "next/head";

export default function HeadSeo({
  title,
  description,
  canonical,
  keywords,
  author,
  robots,
  favicon,
  ogImage,
  twitterImage,
  language = "en",
}) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Optional Meta Tags */}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {robots && <meta name="robots" content={robots} />}{" "}
      {/* Example: "index, follow" */}
      <meta httpEquiv="content-language" content={language} />
      {/* Open Graph (OG) Tags for Social Media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={language} />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      {/* Favicon */}
      {favicon && <link rel="icon" href={favicon} />}
      {favicon && <link rel="apple-touch-icon" href={favicon} />}
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ffffff" /> {/* Browser theme color */}
      <meta name="format-detection" content="telephone=no" />{" "}
      {/* Prevents auto-phone links */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={title} />
      <meta name="apple-mobile-web-app-title" content={title} />
      {/* Preloading and Performance */}
      {canonical && <link rel="preload" as="fetch" href={canonical} />}
      <link rel="dns-prefetch" href={canonical} />
    </Head>
  );
}
