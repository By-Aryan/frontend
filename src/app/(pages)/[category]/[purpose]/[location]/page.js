"use client";
import AdvanceFilterModal from "@/components/common/advance-filter-two";
import PropertyFiltering from "@/components/listing/grid-view/grid-full-1-col-v1/PropertyFiltering";
import TopFilterBar2 from "@/components/listing/map-style/map-v1/TopFilterBar2";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

const Commercial = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // UI State
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showClearSearch, setShowClearSearch] = useState(false);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [showViewedContactsOnly, setShowViewedContactsOnly] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);


  // Fetch city counts from the same API as the header menu
  const cityCountsQuery = useAxiosFetch("/property/header-menu-city-counts");
  const locations = useMemo(() => {
    if (cityCountsQuery.data?.data?.headerCities) {
      return cityCountsQuery.data.data.headerCities;
    }
    // Fallback to default array while loading
    return [
      { name: "Dubai", count: 0 },
      { name: "Abu Dhabi", count: 0 },
      { name: "Sharjah", count: 0 },
      { name: "Ras Al Khaimah", count: 0 },
      { name: "Umm Al Quwain", count: 0 },
      { name: "Ajman", count: 0 },
    ];
  }, [cityCountsQuery.data]);

  // Calculate visible locations for display
  const visibleLocations = useMemo(() => {
    // Standard logic: showAll true = show all, false = show limited (3)
    const result = showAll ? locations : locations.slice(0, 3);
    console.log("🏙️ Locations calculation:", {
      showAll,
      totalLocations: locations.length,
      visibleLocations: result.length,
      locationNames: result.map(l => l.name),
      logic: showAll ? "showing all" : "showing limited (3)"
    });
    return result;
  }, [showAll, locations]);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter state - now managed for server-side filtering
  // Updated filter state - add this to your Commercial component
  const [filters, setFilters] = useState({
    location: (() => {
      const urlLocation = searchParams.get("location");
      const routeLocation = params.location;
      const routeCategory = params.category;
      
      // Handle the case where URL structure is /for-rent/properties/location
      // In this case we want the actual location from the route
      if (routeCategory === "for-rent" || routeCategory === "for-sale") {
        return routeLocation || urlLocation || "";
      }
      
      return urlLocation || routeLocation || "";
    })(),
    property_type: searchParams.get("property_type") || "",
    category: (() => {
      const urlCategory = searchParams.get("category");
      const routeCategory = params.category;
      const routePurpose = params.purpose;
      
      // Handle the case where URL structure is /for-rent/properties/location
      // In this case: category="for-rent", purpose="properties", location="marina-gate"
      // We want category to be "properties" 
      if (routeCategory === "for-rent" || routeCategory === "for-sale") {
        return routePurpose || "properties"; // purpose becomes the category
      }
      
      return urlCategory || routeCategory || "";
    })(), // New category filter from URL
    purpose: (() => {
      // Get purpose from URL params or route params
      const urlPurpose = searchParams.get("purpose");
      const routePurpose = params.purpose;
      const routeCategory = params.category;
      
      console.log("🔍 URL Purpose:", urlPurpose, "Route Purpose:", routePurpose, "Route Category:", routeCategory);
      
      // Handle the case where URL structure is /for-rent/properties/location
      // In this case: category="for-rent", purpose="properties", location="marina-gate"
      if (routeCategory === "for-rent") {
        return "Rent";
      }
      if (routeCategory === "for-sale") {
        return "Sell";
      }
      
      // Map to backend values - check for "for-rent" pattern in purpose
      if (urlPurpose === "rent" || routePurpose === "rent" || routePurpose === "for-rent") return "Rent";
      if (urlPurpose === "buy" || routePurpose === "buy" || routePurpose === "for-sale") return "Sell";
      if (urlPurpose === "sell" || routePurpose === "sell") return "Sell";
      
      // Return as-is if already capitalized correctly
      return urlPurpose || routePurpose || "Sell";
    })(),
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    min_size: searchParams.get("min_size") || "",
    max_size: searchParams.get("max_size") || "",
    min_year: searchParams.get("min_year") || "", // Add year built filters
    max_year: searchParams.get("max_year") || "",
    search_text: searchParams.get("search_text") || "",
    categories: searchParams.get("categories") || "", // Add categories filter
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // Initialize filters from URL parameters and verify interconnection
  useEffect(() => {
    // Check if filters are coming from home page
    const hasHomePageFilters = Object.entries(filters).some(([key, value]) => {
      if (key === "location" || key === "category" || key === "purpose") return false; // These are always present
      return value && value !== "" && value !== "0";
    });
    
    if (hasHomePageFilters) {
      console.log("✅ Filters successfully received from home page:", filters);
    }
  }, []);

  // Build query string for API call
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    // Pagination params
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());
    params.append("sort_field", sortField);
    params.append("sort_order", sortOrder);

    console.log("🔍 Building query string with currentPage:", currentPage, "limit:", limit);

    // Filter params - only add if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== "uae") {
        // Map location parameter to appropriate database field
        if (key === "location") {
          // Try as emirate/city first, then neighborhood
          if (value.includes("-")) {
            // Convert "abu-dhabi" to "Abu Dhabi" for city search
            const formattedLocation = value.split("-").map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(" ");
            params.append("city", formattedLocation);
          } else {
            params.append("city", value);
          }
        } else {
          params.append(key, value);
        }
      }
    });

    const queryString = params.toString();
    return queryString;
  }, [currentPage, limit, sortField, sortOrder, filters]);

  // Build query string for API call
  const queryString = useMemo(() => {
    const query = buildQueryString();
    console.log('🔍 buildQueryString called, currentPage:', currentPage, 'query:', query);
    return query;
  }, [buildQueryString]);

  // Determine which endpoint to use based on viewed contacts filter
  const apiEndpoint = useMemo(() => {
    if (showViewedContactsOnly) {
      // Use the viewed-contact-properties endpoint when filter is active
      return `/property/viewed-contact-properties?${queryString}`;
    }
    // Use regular filter endpoint otherwise
    return `/filter?${queryString}`;
  }, [showViewedContactsOnly, queryString]);

  // Fetch data with server-side filtering
  const { data, isLoading, error, refetch } = useAxiosFetch(apiEndpoint);
  const locationsFetchDataQuery = useAxiosFetch(
    "/property/property-location-count"
  );

  const getFeaturedProperty = useAxiosFetch(`/property/featured`);

  // Fetch list of property IDs where user has viewed contacts
  const viewedContactIdsQuery = useAxiosFetch("/property/viewed-contact-ids");
  const viewedPropertyIds = viewedContactIdsQuery.data?.data || [];

  // Update URL when filters change (optional - for bookmarkable URLs)
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== "uae") {
        params.append(key, value);
      }
    });

    const newURL = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.replaceState({}, "", newURL);
  }, [filters]);

  // Combined data processing (now minimal since filtering is server-side)
  const combinedData = useMemo(() => {
    if (isLoading || getFeaturedProperty.isLoading) {
      return { data: [], total_records: 0 };
    }

    // Handle different response structures based on endpoint
    let regularPropertiesRaw = [];
    let totalRecords = 0;

    if (showViewedContactsOnly) {
      // Data from viewed-contact-properties endpoint
      regularPropertiesRaw = data?.data || [];
      totalRecords = data?.pagination?.totalProperties || 0;
    } else {
      // Data from regular filter endpoint
      regularPropertiesRaw = data?.data || [];
      totalRecords = data?.total_records || 0;
    }

    let featuredPropertiesRaw = [];
    if (Array.isArray(getFeaturedProperty.data)) {
      featuredPropertiesRaw = getFeaturedProperty.data;
    } else if (getFeaturedProperty.data?.data) {
      featuredPropertiesRaw = getFeaturedProperty.data.data;
    }

    // Transform properties for display
    const transformProperty = (prop) => ({
      ...prop,
      name: prop.title || prop.name || "Untitled Property",
    });

    // Filter featured properties to match the current filters
    const matchesFilters = (property) => {
      // Debug property structure to understand data format
      if (process.env.NODE_ENV === 'development') {
        console.log("🔍 Property structure debug:", {
          id: property._id,
          city: property.city,
          cityType: typeof property.city,
          location: property.location,
          locationType: typeof property.location,
          price: property.price,
          priceType: typeof property.price,
          bedrooms: property.bedrooms,
          bedroomsType: typeof property.bedrooms
        });
      }

      // Check if property matches current filter criteria
      const categoryMatch = !filters.category || 
                            property.category === filters.category ||
                            property.details?.category === filters.category;
      
      const purposeMatch = !filters.purpose || 
                           property.purpose === filters.purpose || 
                           property.details?.purpose === filters.purpose;

      // Location match (city/emirate) - with safe string checking
      const locationMatch = !filters.location || 
                            filters.location === "uae" ||
                            (typeof property.city === 'string' && property.city.toLowerCase().includes(filters.location.toLowerCase())) ||
                            (typeof property.details?.city === 'string' && property.details.city.toLowerCase().includes(filters.location.toLowerCase())) ||
                            (typeof property.location === 'string' && property.location.toLowerCase().includes(filters.location.toLowerCase()));

      // Property type match
      const propertyTypeMatch = !filters.property_type || 
                               property.property_type === filters.property_type ||
                               property.details?.property_type === filters.property_type;

      // Bedrooms match - with safe number checking
      const bedroomsMatch = !filters.bedrooms || 
                           (property.bedrooms && parseInt(property.bedrooms) === parseInt(filters.bedrooms)) ||
                           (property.details?.bedrooms && parseInt(property.details.bedrooms) === parseInt(filters.bedrooms));

      // Price range match - with safe number checking
      const propertyPrice = property.price || property.details?.price || 0;
      const priceMatch = (!filters.min_price || propertyPrice >= parseInt(filters.min_price)) &&
                        (!filters.max_price || propertyPrice <= parseInt(filters.max_price));
      
      return categoryMatch && purposeMatch && locationMatch && propertyTypeMatch && bedroomsMatch && priceMatch;
    };
    
    // Only include featured properties that match current filters
    // Filter matching featured properties first
    const matchedFeaturedProperties = featuredPropertiesRaw
      .filter(matchesFilters);
      
    // Select only 4 random featured properties if there are more than 4
    const limitedFeaturedProperties = matchedFeaturedProperties.length > 4 
      ? matchedFeaturedProperties
          .sort(() => 0.5 - Math.random()) // Shuffle the array randomly
          .slice(0, 4) // Take only first 4 elements
      : matchedFeaturedProperties;
      
    // Map the limited featured properties to add isFeatured flag
    const featuredProperties = limitedFeaturedProperties
      .map((prop) => ({
        ...transformProperty(prop),
        isFeatured: true,
      }));

    console.log("🚀 Boosted Properties Info:", {
      totalFeaturedAvailable: featuredPropertiesRaw.length,
      matchingCurrentFilters: matchedFeaturedProperties.length,
      limitedToShow: featuredProperties.length,
      maxAllowed: 4,
      currentFilters: {
        category: filters.category,
        purpose: filters.purpose,
        location: filters.location
      }
    });

    const regularProperties = regularPropertiesRaw.map((prop) => ({
      ...transformProperty(prop),
      isFeatured: false,
    }));

    // Remove featured properties from regular list to avoid duplicates
    const featuredIds = new Set(featuredProperties.map((prop) => prop._id));
    const uniqueRegularProperties = regularProperties.filter(
      (prop) => !featuredIds.has(prop._id)
    );

    const allProperties = [...featuredProperties, ...uniqueRegularProperties];

    // Calculate correct total records including both featured and regular properties
    // Use the totalRecords variable we calculated earlier based on endpoint
    const featuredCount = featuredProperties.length;
    const duplicatesRemoved = regularProperties.length - uniqueRegularProperties.length;
    const totalRecordsCount = showViewedContactsOnly
      ? totalRecords // For viewed contacts, use the count from pagination
      : totalRecords + featuredCount - duplicatesRemoved; // For regular, add featured

    return {
      data: allProperties,
      total_records: totalRecordsCount,
    };
  }, [
    data,
    getFeaturedProperty.data,
    isLoading,
    getFeaturedProperty.isLoading,
    showViewedContactsOnly,
  ]);

  // Filter functions for the UI components
  // Updated filterFunctions object in your Commercial component
  const filterFunctions = {
    // Location
    location: filters.location,
    handlelocation: (value) => {
      setFilters((prev) => ({ ...prev, location: value }));
      setCurrentPage(0);
    },

    // Property Type
    propertyTypes: filters.property_type,
    setPropertyTypes: (value) => {
      setFilters((prev) => ({ ...prev, property_type: value }));
      setCurrentPage(0);
    },
    handlePropertyType: (value) => {
      setFilters((prev) => ({ ...prev, property_type: value }));
      setCurrentPage(0);
    },
    // Add this missing function for PropertyType component
    handlepropertyTypes: (value) => {
      setFilters((prev) => ({ ...prev, property_type: value }));
      setCurrentPage(0);
    },

    // Purpose (Buy/Rent/All) - with proper display mapping
    listingStatus: (() => {
      console.log("🎯 Current filters.purpose:", filters.purpose);
      // Map backend values to display values for the dropdown
      if (filters.purpose === "Rent") return "Rent";
      if (filters.purpose === "Sell") return "Buy";
      if (filters.purpose === "" || filters.purpose === "all" || filters.purpose === "properties") return "All";
      return filters.purpose || "All";
    })(),
    handleListingStatus: (value) => {
      // Map display values to backend values
      let backendValue;
      if (value === "Buy") {
        backendValue = "Sell";
      } else if (value === "Rent") {
        backendValue = "Rent";
      } else if (value === "All") {
        backendValue = ""; // Empty string means no purpose filter (show all)
      } else if (value === "Commercial") {
        backendValue = "Sell"; // Commercial properties are typically for sale
      } else {
        backendValue = value;
      }
      setFilters((prev) => ({ ...prev, purpose: backendValue }));
      setCurrentPage(0);
    },
    // Add missing function for ListingStatus component
    handlelistingStatus: (value) => {
      // Map display values to backend values
      let backendValue;
      if (value === "Buy") {
        backendValue = "Sell";
      } else if (value === "Rent") {
        backendValue = "Rent";
      } else if (value === "All") {
        backendValue = ""; // Empty string means no purpose filter (show all)
      } else if (value === "Commercial") {
        backendValue = "Sell"; // Commercial properties are typically for sale
      } else {
        backendValue = value;
      }
      setFilters((prev) => ({ ...prev, purpose: backendValue }));
      setCurrentPage(0);
    },

    // Price Range
    priceRange: [
      parseInt(filters.min_price) || 0,
      parseInt(filters.max_price) || 1000000000,
    ],
    handlepriceRange: (range) => {
      if (Array.isArray(range)) {
        setFilters((prev) => ({
          ...prev,
          min_price: range[0] > 0 ? range[0].toString() : "",
          max_price: range[1] < 1000000000 ? range[1].toString() : "",
        }));
      } else {
        // Handle single value input
        setFilters((prev) => ({
          ...prev,
          min_price: range > 0 ? range.toString() : "",
        }));
      }
      setCurrentPage(0);
    },

    // Bedrooms
    bedrooms: parseInt(filters.bedrooms) || 0,
    handlebedrooms: (value) => {
      setFilters((prev) => ({
        ...prev,
        bedrooms: value > 0 ? value.toString() : "",
      }));
      setCurrentPage(0);
    },

    // Bathrooms
    bathrooms: parseInt(filters.bathrooms) || 0,
    handlebathrooms: (value) => {
      setFilters((prev) => ({
        ...prev,
        bathrooms: value > 0 ? value.toString() : "",
      }));
      setCurrentPage(0);
    },

    // Square Feet
    squirefeet: [
      parseInt(filters.min_size) || 0,
      parseInt(filters.max_size) || 0,
    ],
    handlesquirefeet: (range) => {
      if (Array.isArray(range)) {
        setFilters((prev) => ({
          ...prev,
          min_size: range[0] > 0 ? range[0].toString() : "",
          max_size: range[1] > 0 ? range[1].toString() : "",
        }));
      }
      setCurrentPage(0);
    },

    // Year Built (add this new filter)
    yearBuild: [
      parseInt(filters.min_year) || 1800,
      parseInt(filters.max_year) || 2050,
    ],
    handleyearBuild: (range) => {
      if (Array.isArray(range)) {
        setFilters((prev) => ({
          ...prev,
          min_year: range[0] > 1800 ? range[0].toString() : "",
          max_year: range[1] < 2050 ? range[1].toString() : "",
        }));
      }
      setCurrentPage(0);
    },

    // Search Query
    searchQuery: filters.search_text,
    setSearchQuery: (value) => {
      setFilters((prev) => ({ ...prev, search_text: value }));
      setCurrentPage(0);
    },

    // Categories/Features
    categories: filters.categories ? filters.categories.split(",") : [],
    handlecategories: (value) => {
      setFilters((prev) => {
        const currentCategories = prev.categories
          ? prev.categories.split(",")
          : [];
        const updatedCategories = currentCategories.includes(value)
          ? currentCategories.filter((cat) => cat !== value)
          : [...currentCategories, value];

        return {
          ...prev,
          categories: updatedCategories.join(","),
        };
      });
      setCurrentPage(0);
    },

    // New Category Filter (Residential/Commercial)
    propertyCategory: filters.category,
    handlePropertyCategory: (value) => {
      setFilters((prev) => ({ ...prev, category: value }));
      setCurrentPage(0);
    },

    // Reset all filters
    resetFilter: () => {
      setFilters({
        location: "",
        property_type: "",
        category: "", // Include category in reset
        purpose: "buy",
        min_price: "",
        max_price: "",
        bedrooms: "",
        bathrooms: "",
        min_size: "",
        max_size: "",
        min_year: "",
        max_year: "",
        search_text: "",
        categories: "",
      });
      setCurrentPage(0);
    },
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "location":
        filterFunctions.handlelocation(value);
        break;
      case "propertyType":
        filterFunctions.setPropertyTypes(value);
        break;
      case "propertyCategory":
        filterFunctions.handlePropertyCategory(value);
        break;
      case "listingStatus":
        filterFunctions.handleListingStatus(value);
        break;
      case "priceRange":
        filterFunctions.handlepriceRange(value);
        break;
      case "bedrooms":
        filterFunctions.handlebedrooms(value);
        break;
      case "bathrooms":
        filterFunctions.handlebathrooms(value);
        break;
      default:
        break;
    }
  };

  // Check if filters are applied for showing clear search button
  useEffect(() => {
    const hasFilters = Object.entries(filters).some(([key, value]) => {
      if (key === "purpose") return value !== "buy"; // Default is buy
      return value && value !== "" && value !== "all" && value !== "uae";
    });
    setShowClearSearch(hasFilters);
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Refetch data when filters change
  useEffect(() => {
    console.log("🔄 Refetch triggered by buildQueryString change");
    refetch();
  }, [buildQueryString, refetch]);

  const handleSaveSearchClick = () => {
    setShowModal(true);
  };

  const handleClearSearch = () => {
    filterFunctions.resetFilter();
  };

  // Handle sorting change
  const handleSortingChange = (sortOption) => {
    setCurrentSortingOption(sortOption);

    switch (sortOption) {
      case "Newest":
        setSortField("created_at");
        setSortOrder("desc");
        break;
      case "Price Low":
        setSortField("price");
        setSortOrder("asc");
        break;
      case "Price High":
        setSortField("price");
        setSortOrder("desc");
        break;
      case "Best Match":
        setSortField("_id");
        setSortOrder("desc");
        break;
      default:
        setSortField("created_at");
        setSortOrder("desc");
    }
    setCurrentPage(0);
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    console.log('🔄 Page change requested:', page, '(0-based)');
    setCurrentPage(page);
  };
  

  if (isLoading || getFeaturedProperty.isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading properties...</span>
        </div>
        <p className="mt-3">Loading properties...</p>
      </div>
    );
  }

  if (error || getFeaturedProperty.error) {
    return (
      <div className="alert alert-danger text-center">
        <h4>Error Loading Properties</h4>
        <p>Approved Properties Error: {error?.message || "None"}</p>
        <p>
          Featured Properties Error:{" "}
          {getFeaturedProperty.error?.message || "None"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter Section */}
      <div className="filter-section py-1">
        <div className="container">
          <div className="advance-feature-modal">
            <div
              className="modal fade"
              id="advanceSeachModal"
              tabIndex={-1}
              aria-labelledby="advanceSeachModalLabel"
              aria-hidden="true"
            >
              <AdvanceFilterModal filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="advance-search-list">
            <div className="dropdown-lists">
              <ul className="p-0 mb-0 d-flex flex-wrap w-100 flex-lg-nowrap">
                <TopFilterBar2
                  filterFunctions={filterFunctions}
                  handleFilterChange={handleFilterChange}
                  showClearSearch={showClearSearch}
                  handleSaveSearchClick={handleSaveSearchClick}
                  handleClearSearch={handleClearSearch}
                />
              </ul>
              {/* Removed the button section from here */}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <section className="breadcrumb-section pt-1 pb-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="breadcrumb-style1 d-flex align-items-center flex-wrap gap-3"
                style={{ rowGap: "0.25rem" }} // Optional: tighter vertical spacing
              >
                <h1
                  className="title mb-0"
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#333",
                    marginBottom: "0", // ensure vertical spacing is clean
                  }}
                >
                  {filters.location
                    ? `${
                        filters.location.charAt(0).toUpperCase() +
                        filters.location.slice(1).replace(/-/g, " ")
                      } Homes for ${
                        filters.purpose === "Rent" ? "Rent" : "Sale"
                      } :`
                    : `Dubai Homes for ${
                        filters.purpose === "Rent" ? "Rent" : "Sale"
                      }`}
                </h1>

                <nav className="d-flex align-items-center flex-wrap text-xs gap-1">
                  <a
                    href="/"
                    className="text-[#1E6753] hover:text-[#0f8363] transition-colors font-medium"
                  >
                    Home
                  </a>
                  <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push(
                        `/for-sale/properties/uae?purpose=${filters.purpose}`
                      )
                    }
                    className="text-[#0f8363] hover:text-[#1E6753] transition-colors font-medium"
                  >
                    {filters.purpose === "Rent" ? "Rent" : "Buy"}
                  </span>
                  {filters.location && (
                    <>
                      <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                      <span className="text-gray-600 capitalize">
                        {filters.location.replace(/-/g, " ")}
                      </span>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Viewed Contacts Filter Banner */}
      {showViewedContactsOnly && (
        <section className="pt-2 pb-2" style={{ backgroundColor: '#ecfdf5', borderBottom: '2px solid #10b981' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa fa-phone-circle" style={{ color: '#059669', fontSize: '18px' }}></i>
                    <span className="fw-semibold" style={{ color: '#059669' }}>
                      Showing only properties where you viewed contact numbers
                    </span>
                    <span className="badge" style={{ backgroundColor: '#10b981', color: 'white' }}>
                      {combinedData.total_records} {combinedData.total_records === 1 ? 'Property' : 'Properties'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowViewedContactsOnly(false)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #10b981',
                      color: '#059669',
                      fontSize: '12px',
                      padding: '4px 12px'
                    }}
                  >
                    <i className="fa fa-times me-1"></i>
                    Show All Properties
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Filters Summary */}
      {(() => {
        const activeFilters = [];
        if (filters.property_type) activeFilters.push(`Property Type: ${filters.property_type}`);
        if (filters.bedrooms) activeFilters.push(`${filters.bedrooms} Bedrooms`);
        if (filters.bathrooms) activeFilters.push(`${filters.bathrooms} Bathrooms`);
        if (filters.min_price || filters.max_price) {
          const priceRange = `Price: ${filters.min_price ? `AED ${parseInt(filters.min_price).toLocaleString()}` : 'Any'} - ${filters.max_price ? `AED ${parseInt(filters.max_price).toLocaleString()}` : 'Any'}`;
          activeFilters.push(priceRange);
        }
        if (filters.category) activeFilters.push(`Category: ${filters.category}`);
        if (filters.purpose) {
          // Map backend purpose to display purpose
          const displayPurpose = filters.purpose === "Sell" ? "Buy" : filters.purpose === "Rent" ? "Rent" : filters.purpose;
          activeFilters.push(`Purpose: ${displayPurpose}`);
        }

        return activeFilters.length > 0 ? (
          <section className="pt-2 pb-2" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                    <span className="fw-semibold text-sm" style={{ color: '#0f8363' }}>
                      🔗 Active Filters from Search:
                    </span>
                    {activeFilters.map((filter, index) => (
                      <span
                        key={index}
                        className="badge"
                        style={{
                          backgroundColor: '#e8f5f0',
                          color: '#0f8363',
                          fontSize: '12px',
                          padding: '4px 8px'
                        }}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null;
      })()}

      {/* Property Filtering */}
      <section className="pt-1 pb-90">
        <PropertyFiltering
          showModal={showModal}
          sortedFilteredData={combinedData.data}
          filteredData={combinedData.data}
          setShowModal={setShowModal}
          filterFunctions={filterFunctions}
          handleFilterChange={handleFilterChange}
          pageItems={combinedData.data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalRecords={combinedData.total_records}
          limit={limit}
          currentSortingOption={currentSortingOption}
          setCurrentSortingOption={handleSortingChange}
          visibleLocations={visibleLocations}
          showAll={showAll}
          setShowAll={setShowAll}
          locations={locations}
          handleSaveSearchClick={handleSaveSearchClick}
          showViewedContactsOnly={showViewedContactsOnly}
          setShowViewedContactsOnly={setShowViewedContactsOnly}
          viewedPropertyIds={viewedPropertyIds}
        />
      </section>
    </>
  );
};

export default Commercial;
