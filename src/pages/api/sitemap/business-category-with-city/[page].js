import { ProjectSetting } from "../../../../config/ProjectSetting";

export default async function handler(req, res) {
  const { page } = req.query;
  const domain = ProjectSetting.API_URL;

  const response = await fetch(
    `${domain}/Sitemap/business_category_with_city/${page}`
  );
  const sitemap = await response.text();

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();
}
