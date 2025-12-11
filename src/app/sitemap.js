import api from "@/axios/axios.interceptor";

// Function to fetch all properties for sitemap
async function fetchAllProperties() {
  try {
    const response = await api.get('/property/approved');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}

export default async function sitemap() {
  // Get current date for lastModified
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/buy/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/rent/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/commercial/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/contactus`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Fetch dynamic property pages
  const properties = await fetchAllProperties();
  
  const propertyPages = properties.map(property => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zerobroker.ae'}/single-v1/${property._id}`,
    lastModified: property.updatedAt ? new Date(property.updatedAt).toISOString() : currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Combine static and dynamic pages
  return [...staticPages, ...propertyPages];
}