const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { JOB_API_END_POINT, CATEGORY_API_END_POINT } = require('../../utils/constant');


const staticPages = [
  '', 
  'about',
  'contact',
  'login',
  'signup',
  'jobs',
  'internships',
  'blog',
  'privacy-policy',
  'terms-of-service'
];


const KERALA_DISTRICTS = [
  'thiruvananthapuram', 'kollam', 'pathanamthitta', 'alappuzha', 
  'kottayam', 'idukki', 'ernakulam', 'thrissur', 'palakkad', 
  'malappuram', 'kozhikode', 'wayanad', 'kannur', 'kasaragod', 'remote'
];

// Job types for filtering
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'temporary'];

// Function to generate sitemap XML
const generateSitemap = (urls) => {
  const baseUrl = 'https://yourdomain.com';
  const date = new Date().toISOString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  urls.forEach(url => {
    const lastmod = url.lastmod || date;
    const changefreq = url.changefreq || 'weekly';
    const priority = url.priority || '0.8';
    
    xml += `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  xml += '</urlset>';
  return xml;
};

// Function to fetch categories from API
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${CATEGORY_API_END_POINT}/get`);
    if (response.data.success) {
      return response.data.categories.map(cat => ({
        id: cat._id,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-')
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Function to generate dynamic URLs
const generateDynamicUrls = async () => {
  const urls = [];
  const categories = await fetchCategories();
  const date = new Date().toISOString();

  // Generate category pages
  categories.forEach(category => {
    // Main category page
    urls.push({
      loc: `/jobs/${category.slug}`,
      lastmod: date,
      changefreq: 'daily',
      priority: '0.9'
    });

    // Category + location pages
    KERALA_DISTRICTS.forEach(district => {
      urls.push({
        loc: `/jobs/${category.slug}/${district}`,
        lastmod: date,
        changefreq: 'daily',
        priority: '0.8'
      });
    });
  });

  // Generate location-only pages
  KERALA_DISTRICTS.forEach(district => {
    urls.push({
      loc: `/jobs-in-${district}`,
      lastmod: date,
      changefreq: 'daily',
      priority: '0.7'
    });
  });

  // Generate job type pages
  JOB_TYPES.forEach(jobType => {
    urls.push({
      loc: `/jobs?jobType=${jobType}`,
      lastmod: date,
      changefreq: 'daily',
      priority: '0.7'
    });
  });

  return urls;
};

// Main function to generate sitemap
const main = async () => {
  try {
    // Generate static URLs
    const staticUrls = staticPages.map(page => ({
      loc: `/${page}`,
      changefreq: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? '1.0' : '0.8'
    }));

    // Generate dynamic URLs
    const dynamicUrls = await generateDynamicUrls();
    
    // Combine all URLs
    const allUrls = [...staticUrls, ...dynamicUrls];
    
    // Generate sitemap XML
    const sitemap = generateSitemap(allUrls);
    
    // Write to file
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
    console.log(`Total URLs: ${allUrls.length}`);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the script
main();
