"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useNewProjectFilter = (intialData) => {
  const [propData, setPropData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);
  const path = usePathname();

  // console.log("intialData : ", intialData)

  let isListingStatus;
  let selectedLocation;
  const selectedFilter = path.split("/")[1];
  
  // Handle different URL patterns
  let isPropertyType = "All"; // Default for projects
  let filterBedrooms;
  
  // Check if this is a projects-by-country URL pattern
  if (path.includes("/projects-by-country/")) {
    // For projects URL: /projects-by-country/uae
    const urlLocation = decodeURIComponent(path.split("/")[2] || "uae");
    selectedLocation = urlLocation.toLowerCase(); // Keep it lowercase for consistency
    // For projects, we don't have property types, use "All"
    isPropertyType = "All";
  } else {
    // Original property URL handling
    if (selectedFilter == "for-sale") {
      isListingStatus = "Buy";
    } else if (selectedFilter == "for-rent") {
      isListingStatus = "Rent";
    } else if (selectedFilter == "properties") {
      isListingStatus = "All";
    }
    
    isPropertyType = path.split("/")[2]?.split("-").pop() || "All";
    const pathBedrooms = path.split("/")[2]?.split("-")[0];
    const numberedBedrooms = Number(pathBedrooms);
    if (!isNaN(numberedBedrooms)) {
      filterBedrooms = path.split("/")[2].split("-")[0];
    }
    
    const urlLocation = decodeURIComponent(path.split("/")[3] || "");
    selectedLocation = urlLocation
      .split(/[-\s]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  useEffect(() => {
    if (intialData?.length > 0 && Array.isArray(intialData)) {
      console.log("useNewProjectFilter - Setting propData:", intialData.length, "items");
      setPropData(intialData);
    } else {
      console.log("useNewProjectFilter - No valid data:", intialData);
      setPropData([]);
    }
  }, [intialData]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * 4, pageNumber * 4)
    );
    setPageContentTrac([
      (pageNumber - 1) * 4 + 1,
      pageNumber * 4,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  const [listingStatus, setListingStatus] = useState(isListingStatus || "All");
  const [propertyTypes, setPropertyTypes] = useState(isPropertyType || "All");
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [bedrooms, setBedrooms] = useState(filterBedrooms || 0);
  const [bathrooms, setBathrooms] = useState(0);
  const [location, setLocation] = useState(selectedLocation || "uae");
  const [squirefeet, setSquirefeet] = useState([]);
  const [yearBuild, setyearBuild] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);

      const extractedFilters = {
        bathrooms: searchParams.get("bathrooms") || "",
        min_price: searchParams.get("min_price") || "",
        max_price: searchParams.get("max_price") || "",
        priceRange: searchParams.get("priceRange") || "",
      };

      setFilters(extractedFilters);
      setBathrooms(extractedFilters.bathrooms);
      // setPriceRange([extractedFilters.min_price, extractedFilters.max_price]);
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const lower = location.toLowerCase();
    const Location = lower.includes(" ") ? lower.replace(/\s+/g, "-") : lower;

    const existingParams = new URLSearchParams(window.location.search);
    const newFilters = { ...filters, [key]: value };

    const params = new URLSearchParams();
    const allowedParams = [
      "bathrooms",
      "priceRange",
      "min_price",
      "max_price",
      "min_feet",
      "max_feet",
    ];

    allowedParams.forEach((paramKey) => {
      const filterValue = newFilters[paramKey];
      const urlValue = existingParams.get(paramKey);

      if (filterValue) {
        params.set(paramKey, filterValue);
      } else if (urlValue) {
        params.set(paramKey, urlValue);
      }
    });

    setFilters(newFilters);

    const currentPath = window.location.pathname;
    const urlPath = params.toString();
    const hasParams = Array.from(params.keys()).length > 0;

    if (key === "propertyType") {
      if (filterBedrooms) {
        if (hasParams) {
          router.replace(
            `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}?${urlPath}`
          );
          return;
        }
        router.replace(
          `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}`
        );
        return;
      }
      if (hasParams) {
        if (filterBedrooms) {
          router.replace(
            `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}?${urlPath}`
          );
          return;
        }
        router.replace(`/${selectedFilter}/${value}/${Location}?${urlPath}`);
        return;
      }
      // if (filterBedrooms) {
      //   router.replace(`/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/uae`);
      //   return;
      // }
      console.log("inside propetyType");
      router.replace(`/${selectedFilter}/${value}/${Location}`);
    }

    if (key === "listingStatus") {

      if (filterBedrooms) {
        if (hasParams) {
          router.replace(
            `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
          );
          return;
        }
        router.replace(
          `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}`
        );
        return;
      }
      if (hasParams) {
        if (filterBedrooms) {
          router.replace(
            `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
          );
          return;
        }
        router.replace(`/${value}/${propertyTypes}/${Location}?${urlPath}`);
        return;
      }

      router.replace(`/${value}/${propertyTypes}/${Location}`);
    }
    if (key === "bedrooms") {
      if (value == 0) {
        router.replace(`/${selectedFilter}/${propertyTypes}/${Location}`);
      } else {
        if (hasParams) {
          console.log("inside");
          router.replace(
            `/${selectedFilter}/${value}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
          );
          return;
        }
        console.log("outside");
        router.replace(
          `/${selectedFilter}/${value}-bedrooms-${propertyTypes}/${Location}`
        );
      }
    }
    if (key === "location") {
      if (filterBedrooms) {
        if (hasParams) {
          router.replace(
            `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}?${urlPath}`
          );
          return;
        }
        router.replace(
          `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}`
        );
        return;
      }
      if (hasParams) {
        if (filterBedrooms) {
          router.replace(
            `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}?${urlPath}`
          );
          return;
        }
        router.replace(
          `/${selectedFilter}/${propertyTypes}/${value}?${urlPath}`
        );
        return;
      }
      // if (filterBedrooms) {
      //   router.replace(`/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/uae`);
      //   return;
      // }
      console.log("inside propetyType");
      router.replace(`/${selectedFilter}/${propertyTypes}/${value}`);
    }
    if (
      key === "bathrooms" ||
      key === "priceRange" ||
      key === "min_price" ||
      key === "max_price" ||
      key == "min_feet" ||
      key == "max_feet"
    ) {
      router.push(`${currentPath}?${urlPath}`);
    }
  };

  const resetFilter = () => {
    setListingStatus("");
    setPropertyTypes("");
    setPriceRange([0, 100000]);
    setBedrooms(0);
    setBathrooms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");
    // document.querySelectorAll(".filterInput").forEach(function (element) {
    //   element.value = null;
    // });

    // document.querySelectorAll(".filterSelect").forEach(function (element) {
    //   element.value = "All Cities";
    // });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [keyword, setKeyword] = useState("");

  const handlelistingStatus = (elm) => {
    setListingStatus((pre) => (pre == elm ? "All" : elm));
    handleFilterChange("purpose", elm);
  };
  const handlepropertyTypes = (elm) => {
    setPropertyTypes((pre) => (pre == elm ? "All" : elm));
    handleFilterChange("type", elm);
  };

  // const handlepropertyTypes = (elm) => {
  //   if (elm == "All") {
  //     setPropertyTypes([]);
  //   } else {
  //     setPropertyTypes((pre) =>
  //       pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
  //     );
  //   }
  // };
  
  const handlepriceRange = (elm) => {
    setPriceRange(elm);
  };
  const handlebedrooms = (elm) => {
    setBedrooms(elm);
  };
  const handlebathrooms = (elm) => {
    setBathrooms(elm);
  };
  
  // Setter functions for direct state updates
  const setBedroomsFilter = (value) => {
    setBedrooms(value);
  };
  
  const setBathroomsFilter = (value) => {
    setBathrooms(value);
  };
  
  const setLocationFilter = (value) => {
    setLocation(value);
  };
  const handlelocation = (elm) => {
    console.log(elm);
    setLocation(elm);
  };
  const handlesquirefeet = (elm) => {
    setSquirefeet(elm);
  };
  const handleyearBuild = (elm) => {
    setyearBuild(elm);
  };
  const handlecategories = (elm) => {
    if (elm == "All") {
      setCategories([]);
    } else {
      setCategories((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
      );
    }
  };

  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathrooms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    priceRange,
    listingStatus,
    propertyTypes,
    resetFilter,
    bedrooms,
    bathrooms,
    location,
    squirefeet,
    yearBuild,
    categories,
    setPropertyTypes,
    setSearchQuery,
    setKeyword,
    setPriceRange,
    setBedrooms: setBedroomsFilter,
    setBathrooms: setBathroomsFilter,
    setLocation: setLocationFilter,
  };

  // useEffect(() => {
  //   if (propData.length > 0) {
  //     const refItems = propData.filter((elm) => {
  //       if (listingStatus === "All") return true;
  //       return listingStatus === "Buy"
  //         ? elm.details.purpose === "Sell"
  //         : elm.details.purpose === "Rent";
  //     });

  //     let filteredArrays = [];

  //     if (propertyTypes.length > 0) {
  //       filteredArrays.push(
  //         refItems.filter((elm) =>
  //           propertyTypes.includes(elm.details.property_type)
  //         )
  //       );
  //     }

  //     filteredArrays.push(refItems.filter((el) => el.details.bedrooms >= bedrooms));
  //     filteredArrays.push(refItems.filter((el) => el.details.bathrooms >= bathrooms));

  //     filteredArrays.push(
  //       refItems.filter(
  //         (el) =>
  //           el.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           el.location.emirate.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           el.name.toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //     );

  //     filteredArrays.push(
  //       !categories.length
  //         ? [...refItems]
  //         : refItems.filter((elm) =>
  //             categories.every((elem) => elm.features_amenities.includes(elem))
  //           )
  //     );

  //     if (location !== "All Cities") {
  //       filteredArrays.push(refItems.filter((el) => el.location.city === location));
  //     }

  //     if (priceRange.length > 0) {
  //       filteredArrays.push(
  //         refItems.filter(
  //           (elm) =>
  //             Number(elm.price) >= priceRange[0] && Number(elm.price) <= priceRange[1]
  //         )
  //       );
  //     }

  //     const commonItems = refItems.filter((item) =>
  //       filteredArrays.every((array) => array.includes(item))
  //     );

  //     console.log("Filtered items:", commonItems.length);
  //     setFilteredData(commonItems);
  //   }
  // }, [propData, listingStatus, propertyTypes, priceRange, bedrooms, bathrooms, location, categories, searchQuery]);

  // useEffect(() => {
  //   setPageNumber(1);
  //   if (currentSortingOption == "Newest") {
  //     const sorted = [...filteredData].sort(
  //       (a, b) =>
  //         b.building_information.year_of_completion -
  //         a.building_information.year_of_completion
  //     );
  //     setSortedFilteredData(sorted);
  //   } else if (currentSortingOption.trim() == "Price Low") {
  //     const sorted = [...filteredData].sort((a, b) => a.price - b.price);
  //     setSortedFilteredData(sorted);
  //   } else if (currentSortingOption.trim() == "Price High") {
  //     const sorted = [...filteredData].sort((a, b) => b.price - a.price);
  //     setSortedFilteredData(sorted);
  //   } else {
  //     setSortedFilteredData(filteredData);
  //   }
  // }, [filteredData, currentSortingOption]);

  useEffect(() => {
    if (propData.length > 0) {
      // For projects, we don't filter by listingStatus (Buy/Rent/All)
      // Projects are different from properties - they are development projects
      let filtered = [...propData];
      console.log("Initial projects:", filtered.length);
      
      // Filter by property types - use category field for projects
      if (propertyTypes && propertyTypes !== "All" && propertyTypes !== "properties") {
        filtered = filtered.filter((el) => {
          if (!el || typeof el !== 'object') return false; // Defensive check
          const processedType = propertyTypes.endsWith("s")
            ? propertyTypes.slice(0, -1)
            : propertyTypes;
          // For projects, match against category (residential, commercial, etc.)
          return el.category?.toLowerCase()?.includes(processedType.toLowerCase());
        });
      }
      console.log("After category filter", filtered.length);

      // For projects, bedroom filtering might not be applicable
      // as projects are developments, not individual units
      // Skip bedroom filtering for now or filter by totalUnits if needed
      
      // Location filtering for projects
      console.log("Location filter check:", { location, shouldSkip: location === "uae" || location === "all cities" });
      if (location && location !== "uae" && location !== "all cities") {
        console.log("Applying location filter for:", location);
        filtered = filtered.filter((el) => {
          if (!el || !el.location) return false; // Defensive check
          const { address, city, emirate, country } = el.location;
          const searchLocation = location.toLowerCase();
          const matches = (
            address?.toLowerCase()?.includes(searchLocation) ||
            city?.toLowerCase()?.includes(searchLocation) ||
            emirate?.toLowerCase()?.includes(searchLocation) ||
            country?.toLowerCase()?.includes(searchLocation)
          );
          console.log("Project location check:", { address, city, emirate, country, searchLocation, matches });
          return matches;
        });
      } else {
        console.log("Skipping location filter for:", location);
      }
      console.log("After location filter", filtered.length);

      // Price Range for projects - use pricing.priceRange
      if (priceRange.length === 2 && priceRange[0] > 0) {
        filtered = filtered.filter((el) => {
          if (!el || !el.pricing?.priceRange) return false; // Defensive check
          const minPrice = el.pricing.priceRange.min || 0;
          const maxPrice = el.pricing.priceRange.max || 0;
          // Check if project price range overlaps with filter range
          return (minPrice <= priceRange[1] && maxPrice >= priceRange[0]);
        });
      }
      console.log("After price filter", filtered.length);
      
      console.log("Final filtered projects:", filtered);
      console.log("Setting filteredData to:", filtered.length, "projects");
      setFilteredData(filtered);
    } else {
      console.log("No propData available");
      setFilteredData([]);
    }
  }, [
    propData,
    propertyTypes,
    priceRange,
    location
  ]);

  // useEffect(() => {
  //   setPageNumber(1);
  //   let sorted = [...filteredData];

  //   switch (currentSortingOption.trim()) {
  //     case "Newest":
  //       sorted.sort((a, b) =>
  //         (b.building_information?.year_of_completion || 0) -
  //         (a.building_information?.year_of_completion || 0)
  //       );
  //       break;
  //     case "Price Low":
  //       sorted.sort((a, b) => a.price - b.price);
  //       break;
  //     case "Price High":
  //       sorted.sort((a, b) => b.price - a.price);
  //       break;
  //   }

  //   setSortedFilteredData(sorted);
  // }, [filteredData, currentSortingOption]);

  useEffect(() => {
    setPageNumber(1); // Reset to first page on filter change
    if (currentSortingOption === "Newest") {
      const sorted = [...filteredData].sort(
        (a, b) => {
          // Defensive checks
          if (!a || !b) return 0;
          // For projects, sort by creation date or expected completion date
          const dateA = new Date(a.createdAt || a.projectDetails?.expectedCompletionDate || 0);
          const dateB = new Date(b.createdAt || b.projectDetails?.expectedCompletionDate || 0);
          return dateB - dateA;
        }
      );
      setSortedFilteredData(sorted);
    } else if (currentSortingOption === "Price Low") {
      const sorted = [...filteredData].sort((a, b) => {
        if (!a || !b) return 0; // Defensive checks
        const priceA = a.pricing?.priceRange?.min || 0;
        const priceB = b.pricing?.priceRange?.min || 0;
        return priceA - priceB;
      });
      setSortedFilteredData(sorted);
    } else if (currentSortingOption === "Price High") {
      const sorted = [...filteredData].sort((a, b) => {
        if (!a || !b) return 0; // Defensive checks
        const priceA = a.pricing?.priceRange?.max || 0;
        const priceB = b.pricing?.priceRange?.max || 0;
        return priceB - priceA;
      });
      setSortedFilteredData(sorted);
    } else {
      setSortedFilteredData(filteredData);
    }
  }, [filteredData, currentSortingOption]);

  // Missing functions that the component expects
  const getAdvanceSearchData = () => {
    // Placeholder function for advanced search
    return filteredData;
  };

  const getUniqueProperty = (property) => {
    // Get unique values for a property from the data
    if (!propData.length) return [];
    return [...new Set(propData.map(item => {
      if (!item || typeof item !== 'object') return null; // Defensive check
      if (property === 'location') return item.location?.city || item.location?.emirate;
      if (property === 'category') return item.category;
      return item[property];
    }).filter(Boolean))];
  };

  const clearFilter = () => {
    resetFilter();
  };

  return {
    propData,
    selectedFilter,
    listingStatus,
    propertyTypes,
    bedrooms,
    bathrooms,
    filteredData,
    sortedFilteredData,
    pageItems,
    pageContentTrac,
    pageNumber,
    setPageNumber,
    currentSortingOption,
    setCurrentSortingOption,
    colstyle,
    setColstyle,
    filters,
    handleFilterChange,
    filterFunctions,
    // Additional properties that components expect
    getAdvanceSearchData,
    location,
    setLocation: setLocationFilter,
    getUniqueProperty,
    clearFilter,
    priceRange,
    setPriceRange: (value) => setPriceRange(value),
    keyword,
    setKeyword,
    setPropertyTypes,
    setBedrooms: setBedroomsFilter,
    setBathrooms: setBathroomsFilter,
  };
};

export default useNewProjectFilter;
