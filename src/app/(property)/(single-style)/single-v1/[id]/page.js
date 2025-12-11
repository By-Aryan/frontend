import PropertyDetail from "../property-details/page";
import { generatePropertyMetaTitle, generatePropertyMetaDescription, generatePropertyKeywords, generateOpenGraphData, generateCanonicalUrl } from "@/utils/seoUtils";
import { notFound } from 'next/navigation';
import api from "@/axios/axios.interceptor";

// Function to fetch property data for SEO metadata
async function getPropertyData(id) {
  try {
    const response = await api.get(`/property/propertyById/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching property data:", error);
    return null;
  }
}

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const property = await getPropertyData(params.id);
  
  if (!property) {
    return {
      title: "Property Not Found | ZeroBroker",
      description: "The property you are looking for could not be found."
    };
  }

  const title = generatePropertyMetaTitle(property);
  const description = generatePropertyMetaDescription(property);
  const keywords = generatePropertyKeywords(property);
  const canonicalUrl = generateCanonicalUrl(property);
  
  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "ZeroBroker"
    }
  };
}

const SingleV1 = ({params}) => {
  return (
    <>
      <PropertyDetail params={params}/>
    </>
  );
};

export default SingleV1;