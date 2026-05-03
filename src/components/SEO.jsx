import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical }) => {
  const siteName = "Regenesys Corporate Education";
  const fullTitle = `${title} | ${siteName}`;
  const defaultDescription = "Regenesys Corporate Education offers world-class upskilling, leadership training, and corporate transformation programmes designed for the modern industrial age.";
  const defaultKeywords = "corporate education, upskilling, leadership training, digital transformation, Regenesys India, professional development";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      
      {/* Additional SEO Best Practices */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charset="UTF-8" />
    </Helmet>
  );
};

export default SEO;
