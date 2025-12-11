import Head from 'next/head';
import Script from 'next/script';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl, 
  canonicalUrl,
  structuredData,
  children 
}) => {
  // Default values
  const defaultTitle = "ZeroBroker - Real Estate Properties in Dubai";
  const defaultDescription = "Find the best real estate properties in Dubai. Buy, sell, or rent apartments, villas, and commercial spaces with ZeroBroker. Verified listings and competitive pricing.";
  const defaultKeywords = "Dubai real estate, property Dubai, buy property Dubai, rent property Dubai, apartments for sale, villas for rent, commercial properties";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zerobroker.ae";
  
  // Use provided values or defaults
  const pageTitle = title ? `${title} | ZeroBroker` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageOgTitle = ogTitle || pageTitle;
  const pageOgDescription = ogDescription || pageDescription;
  const pageOgImage = ogImage || `${baseUrl}/images/og-image.jpg`;
  const pageOgUrl = ogUrl || baseUrl;
  const pageCanonicalUrl = canonicalUrl || baseUrl;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f8363" />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageOgTitle} />
        <meta property="og:description" content={pageOgDescription} />
        <meta property="og:image" content={pageOgImage} />
        <meta property="og:url" content={pageOgUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ZeroBroker" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageOgTitle} />
        <meta name="twitter:description" content={pageOgDescription} />
        <meta name="twitter:image" content={pageOgImage} />
        <meta name="twitter:site" content="@ZeroBroker" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageCanonicalUrl} />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      
      {/* Structured Data */}
      {structuredData && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      {children}
    </>
  );
};

export default SEO;