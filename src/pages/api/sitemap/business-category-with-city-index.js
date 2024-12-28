import { ProjectSetting } from "../../../config/ProjectSetting";

export default async function handler(req, res) {
  const domain = ProjectSetting.API_URL;

  const response = await fetch(
    `${domain}/Sitemap/business_category_with_city_index`
  );
  const sitemapIndex = await response.text();

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemapIndex);
  res.end();
}
