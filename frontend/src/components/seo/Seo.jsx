import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, keywords, image, url, type = 'website' }) => {
  const siteName = 'JobKitty - Find Your Dream Job';
  const defaultDescription = 'JobKitty is a leading job portal connecting job seekers with top employers. Find your dream job today!';
  const defaultKeywords = 'jobs, employment, career, hiring, job search, job portal, job board, find job, job openings';
  const defaultImage = '/images/og-image.jpg'; 
  const siteUrl = 'https://yourjobportal.com'; 

  const seo = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || defaultDescription,
    keywords: keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords,
    image: image || defaultImage,
    url: url || siteUrl,
    type: type
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <link rel="canonical" href={seo.url} />
      
   
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Helmet>
  );
};

export default Seo;
