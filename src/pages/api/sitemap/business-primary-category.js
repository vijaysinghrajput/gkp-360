import { ProjectSetting } from "../../../config/ProjectSetting";

const buildSitemapXML = (urls) => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const footer = `</urlset>`;

  const body = urls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  return `${header}${body}${footer}`;
};

const handler = async (req, res) => {
  try {
    const response = await fetch(
      `${ProjectSetting.API_URL}/Website/getAllBusinessPrimaryCategory`
    );
    const data = await response.json();

    if (!data.success) {
      return res.status(500).send("Failed to fetch main categories.");
    }

    const urls = data.main_category.map(
      (category) =>
        `${ProjectSetting.COMPANY_WEBSITE}/${category.slug}/${category.id}/business-main-category`
    );

    for (const category of data.main_category) {
      const subCategoryResponse = await fetch(
        `${ProjectSetting.API_URL}/Website/getBusinessListByCategory/${category.id}`
      );
      const subCategoryData = await subCategoryResponse.json();

      if (subCategoryData.success) {
        subCategoryData.data.forEach((subCategory) => {
          urls.push(
            `${ProjectSetting.COMPANY_WEBSITE}/${category.slug}/${subCategory.slug}`
          );
        });
      }
    }

    const sitemap = buildSitemapXML(urls);
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap.");
  }
};

export default handler;
