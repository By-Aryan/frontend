// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const usePropertyFilter = (intialData) => {
//   const [propData, setPropData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
//   const [sortedFilteredData, setSortedFilteredData] = useState([]);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [colstyle, setColstyle] = useState(true);
//   const [pageItems, setPageItems] = useState([]);
//   const [pageContentTrac, setPageContentTrac] = useState([]);
//   const path = usePathname();

//   // console.log("intialData : ", intialData)

//   let isListingStatus;
//   let selectedLocation;
//   const selectedFilter = path.split("/")[1];
//   if (selectedFilter == "for-sale") {
//     isListingStatus = "Buy";
//   } else if (selectedFilter == "for-rent") {
//     isListingStatus = "Rent";
//   } else if (selectedFilter == "properties") {
//     isListingStatus = "All";
//   }
//   const isPropertyType = path.split("/")[2].split("-").pop();
//   let filterBedrooms;
//   const pathBedrooms = path.split("/")[2].split("-")[0];
//   const numberedBedrooms = Number(pathBedrooms);
//   if (!isNaN(numberedBedrooms)) {
//     filterBedrooms = path.split("/")[2].split("-")[0];
//   }
//   const urlLocation = decodeURIComponent(path.split("/")[3]);
//   selectedLocation = urlLocation
//     .split(/[-\s]/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");

//   useEffect(() => {
//     if (intialData?.length > 0) {
//       setPropData(intialData);
//     }
//   }, [intialData]);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [filters, setFilters] = useState({});

//   useEffect(() => {
//     // When using API pagination, we'll let the API handle the slicing
//     // But we still need to set pageItems for rendering
//     setPageItems(sortedFilteredData);
//     setPageContentTrac([
//       (pageNumber - 1) * 4 + 1,
//       pageNumber * 4,
//       sortedFilteredData.length,
//     ]);
//   }, [pageNumber, sortedFilteredData]);

//   const [listingStatus, setListingStatus] = useState(isListingStatus || "All");
//   const [propertyTypes, setPropertyTypes] = useState(isPropertyType || "All");
//   const [priceRange, setPriceRange] = useState([0, 1000000000]);
//   const [bedrooms, setBedrooms] = useState(filterBedrooms || 0);
//   const [bathrooms, setBathrooms] = useState(0);
//   const [location, setLocation] = useState(selectedLocation || "uae");
//   const [squirefeet, setSquirefeet] = useState([]);
//   const [yearBuild, setyearBuild] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const searchParams = new URLSearchParams(window.location.search);

//       const extractedFilters = {
//         bathrooms: searchParams.get("bathrooms") || "",
//         min_price: searchParams.get("min_price") || "",
//         max_price: searchParams.get("max_price") || "",
//         priceRange: searchParams.get("priceRange") || "",
//       };

//       setFilters(extractedFilters);
//       setBathrooms(extractedFilters.bathrooms);
//       // setPriceRange([extractedFilters.min_price, extractedFilters.max_price]);
//     }
//   }, [router.query]);

//   const handleFilterChange = (key, value) => {
//     const lower = location.toLowerCase();
//     const Location = lower.includes(" ") ? lower.replace(/\s+/g, "-") : lower;

//     const existingParams = new URLSearchParams(window.location.search);
//     const newFilters = { ...filters, [key]: value };

//     const params = new URLSearchParams();
//     const allowedParams = [
//       "bathrooms",
//       "priceRange",
//       "min_price",
//       "max_price",
//       "min_feet",
//       "max_feet",
//     ];

//     allowedParams.forEach((paramKey) => {
//       const filterValue = newFilters[paramKey];
//       const urlValue = existingParams.get(paramKey);

//       if (filterValue) {
//         params.set(paramKey, filterValue);
//       } else if (urlValue) {
//         params.set(paramKey, urlValue);
//       }
//     });

//     setFilters(newFilters);

//     const currentPath = window.location.pathname;
//     const urlPath = params.toString();
//     const hasParams = Array.from(params.keys()).length > 0;

//     if (key === "propertyType") {
//       if (filterBedrooms) {
//         if (hasParams) {
//           router.replace(
//             `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(
//           `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}`
//         );
//         return;
//       }
//       if (hasParams) {
//         if (filterBedrooms) {
//           router.replace(
//             `/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/${Location}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(`/${selectedFilter}/${value}/${Location}?${urlPath}`);
//         return;
//       }
//       // if (filterBedrooms) {
//       //   router.replace(`/${selectedFilter}/${filterBedrooms}-bedrooms-${value}/uae`);
//       //   return;
//       // }
//       console.log("inside propetyType");
//       router.replace(`/${selectedFilter}/${value}/${Location}`);
//     }

//     if (key === "listingStatus") {
//       if (filterBedrooms) {
//         if (hasParams) {
//           router.replace(
//             `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(
//           `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}`
//         );
//         return;
//       }
//       if (hasParams) {
//         if (filterBedrooms) {
//           router.replace(
//             `/${value}/${filterBedrooms}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(`/${value}/${propertyTypes}/${Location}?${urlPath}`);
//         return;
//       }

//       router.replace(`/${value}/${propertyTypes}/${Location}`);
//     }
//     if (key === "bedrooms") {
//       if (value == 0) {
//         router.replace(`/${selectedFilter}/${propertyTypes}/${Location}`);
//       } else {
//         if (hasParams) {
//           console.log("inside");
//           router.replace(
//             `/${selectedFilter}/${value}-bedrooms-${propertyTypes}/${Location}?${urlPath}`
//           );
//           return;
//         }
//         console.log("outside");
//         router.replace(
//           `/${selectedFilter}/${value}-bedrooms-${propertyTypes}/${Location}`
//         );
//       }
//     }
//     if (key === "location") {
//       if (filterBedrooms) {
//         if (hasParams) {
//           router.replace(
//             `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(
//           `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}`
//         );
//         return;
//       }
//       if (hasParams) {
//         if (filterBedrooms) {
//           router.replace(
//             `/${selectedFilter}/${filterBedrooms}-bedrooms-${propertyTypes}/${value}?${urlPath}`
//           );
//           return;
//         }
//         router.replace(
//           `/${selectedFilter}/${propertyTypes}/${value}?${urlPath}`
//         );
//         return;
//       }
//       console.log("inside propetyType");
//       router.replace(`/${selectedFilter}/${propertyTypes}/${value}`);
//     }
//     if (
//       key === "bathrooms" ||
//       key === "priceRange" ||
//       key === "min_price" ||
//       key === "max_price" ||
//       key == "min_feet" ||
//       key == "max_feet"
//     ) {
//       router.push(`${currentPath}?${urlPath}`);
//     }
//   };

//   const resetFilter = () => {
//     setListingStatus("");
//     setPropertyTypes("");
//     setPriceRange([0, 100000]);
//     setBedrooms(0);
//     setBathrooms(0);
//     setLocation("uae");
//     setSquirefeet([]);
//     setyearBuild([0, 2050]);
//     setCategories([]);
//     setCurrentSortingOption("Newest");

//     // Reset URL to base category with default filters
//     const baseCategory = selectedFilter || "for-sale";
//     router.replace(`/${baseCategory}/properties/uae`);
//   };
//   const [searchQuery, setSearchQuery] = useState("");

//   const handlelistingStatus = (elm) => {
//     setListingStatus((pre) => (pre == elm ? "All" : elm));
//     handleFilterChange("purpose", elm);
//   };
//   const handlepropertyTypes = (elm) => {
//     setPropertyTypes((pre) => (pre == elm ? "All" : elm));
//     handleFilterChange("type", elm);
//   };

//   const handlepriceRange = (elm) => {
//     setPriceRange(elm);
//     handleFilterChange("priceRange", elm.join("-"));
//   };
//   const handlebedrooms = (elm) => {
//     setBedrooms(elm);
//     handleFilterChange("bedrooms", elm);
//   };
//   const handlebathrooms = (elm) => {
//     setBathrooms(elm);
//     handleFilterChange("bathrooms", elm);
//   };
//   const handlelocation = (elm) => {
//     console.log(elm);
//     setLocation(elm);
//     handleFilterChange("location", elm);
//   };
//   const handlesquirefeet = (elm) => {
//     setSquirefeet(elm);
//     handleFilterChange("min_feet", elm[0]);
//     handleFilterChange("max_feet", elm[1]);
//   };
//   const handleyearBuild = (elm) => {
//     setyearBuild(elm);
//     handleFilterChange("yearBuild", elm.join("-"));
//   };
//   const handlecategories = (elm) => {
//     if (elm == "All") {
//       setCategories([]);
//     } else {
//       setCategories((pre) =>
//         pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
//       );
//     }
//   };

//   const filterFunctions = {
//     handlelistingStatus,
//     handlepropertyTypes,
//     handlepriceRange,
//     handlebedrooms,
//     handlebathrooms,
//     handlelocation,
//     handlesquirefeet,
//     handleyearBuild,
//     handlecategories,
//     priceRange,
//     listingStatus,
//     propertyTypes,
//     resetFilter,
//     bedrooms,
//     bathrooms,
//     location,
//     squirefeet,
//     yearBuild,
//     categories,
//     setPropertyTypes,
//     setSearchQuery,
//   };

//   useEffect(() => {
//     if (propData.length > 0) {
//       const refItems = propData.filter((elm) => {
//         if (listingStatus === "All") return true;
//         return listingStatus === "Buy"
//           ? elm.details.purpose === "Sell"
//           : elm.details.purpose === "Rent";
//       });

//       let filtered = [...refItems];
//       console.log("refItems length:", refItems.length);

//       if (propertyTypes.length > 0) {
//         filtered = filtered.filter((el) => {
//           if (propertyTypes == "properties" || propertyTypes === "All")
//             return el;
//           const processedType = propertyTypes.endsWith("s")
//             ? propertyTypes.slice(0, -1)
//             : propertyTypes;

//           return el.details.property_type === processedType;
//         });
//       }
//       console.log("After propertyTypes filter", filtered.length);

//       // Bedrooms
//       if (bedrooms > 0) {
//         filtered = filtered.filter((el) => {
//           return el.details.bedrooms ==
//             bedrooms;
//         });
//       }
//       console.log("After bedrooms filter", filtered.length);

//       // Bathrooms
//       if (bathrooms > 0) {
//         filtered = filtered.filter((el) => {
//           return Number(el.details.bedrooms) == Number(bedrooms);
//         });
//       }
//       console.log("After bathrooms filter", filtered.length);

//       console.log("After location filter", filtered.length);

//       // Price Range
//       if (priceRange.length === 2) {
//         filtered = filtered.filter((el) => {
//           return el.price >= priceRange[0] && el.price <= priceRange[1];
//         });
//       }
//       console.log("After price filter", filtered.length);

//       // Search Query
//       if (searchQuery.trim() !== "") {
//         filtered = filtered.fill((el) => {
//           return el.detais.size.value >= squirefeet[0] && el.details.size.value <= squirefeet[1]
//         })
//       }
//       console.log("After search filter", filtered.length);
//       console.log("Filtered items:", filtered);
//       setFilteredData(filtered);
//     }
//   }, [
//     propData,
//     listingStatus,
//     propertyTypes,
//     priceRange,
//     bedrooms,
//     bathrooms,
//     location,
//     categories,
//     searchQuery,
//   ]);


//   useEffect(() => {
//     setPageNumber(1); // Reset to first page on filter change
//     if (currentSortingOption === "Newest") {
//       const sorted = [...filteredData].sort(
//         (a, b) =>
//           b.building_information?.year_of_completion -
//           a.building_information?.year_of_completion
//       );
//       setSortedFilteredData(sorted);
//     } else if (currentSortingOption === "Price Low") {
//       const sorted = [...filteredData].sort((a, b) => a.price - b.price);
//       setSortedFilteredData(sorted);
//     } else if (currentSortingOption === "Price High") {
//       const sorted = [...filteredData].sort((a, b) => b.price - a.price);
//       setSortedFilteredData(sorted);
//     } else {
//       setSortedFilteredData(filteredData);
//     }
//   }, [filteredData, currentSortingOption]);

//   return {
//     propData,
//     selectedFilter,
//     listingStatus,
//     propertyTypes,
//     bedrooms,
//     bathrooms,
//     filteredData,
//     sortedFilteredData,
//     pageItems,
//     pageContentTrac,
//     pageNumber,
//     setPageNumber,
//     currentSortingOption,
//     setCurrentSortingOption,
//     colstyle,
//     setColstyle,
//     filters,
//     handleFilterChange,
//     filterFunctions,
//   };
// };

// export default usePropertyFilter;
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const usePropertyFilter = (intialData) => {
  const [propData, setPropData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);
  const path = usePathname();

  let isListingStatus;
  let selectedLocation;
  const selectedFilter = path.split("/")[1];
  if (selectedFilter == "for-sale") {
    isListingStatus = "Buy";
  } else if (selectedFilter == "for-rent") {
    isListingStatus = "Rent";
  } else if (selectedFilter == "properties") {
    isListingStatus = "All";
  }
  
  // 🔧 FIXED: Handle case when path doesn't have enough segments
  const pathSegments = path.split("/");
  const isPropertyType = pathSegments[2] ? pathSegments[2].split("-").pop() : "All";
  
  let filterBedrooms;
  const pathBedrooms = pathSegments[2] ? pathSegments[2].split("-")[0] : null;
  const numberedBedrooms = Number(pathBedrooms);
  if (!isNaN(numberedBedrooms)) {
    filterBedrooms = pathBedrooms;
  }
  
  // 🔧 FIXED: Handle case when location segment doesn't exist
  const urlLocation = pathSegments[3] ? decodeURIComponent(pathSegments[3]) : "uae";
  selectedLocation = urlLocation
    .split(/[-\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  useEffect(() => {
    console.log("🔄 Setting propData:", intialData?.length || 0);
    if (intialData?.length > 0) {
      setPropData(intialData);
    } else {
      // 🔧 FIXED: Also set empty array when no data to trigger filtering
      setPropData([]);
    }
  }, [intialData]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // When using API pagination, we'll let the API handle the slicing
    // But we still need to set pageItems for rendering
    setPageItems(sortedFilteredData);
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
  }, [router.query]);

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
    setListingStatus("All");
    setPropertyTypes("All");
    setPriceRange([0, 1000000000]);
    setBedrooms(0);
    setBathrooms(0);
    setLocation("uae");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");

    // Reset URL to base category with default filters
    const baseCategory = selectedFilter || "for-sale";
    router.replace(`/${baseCategory}/properties/uae`);
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handlelistingStatus = (elm) => {
    setListingStatus((pre) => (pre == elm ? "All" : elm));
    handleFilterChange("purpose", elm);
  };
  const handlepropertyTypes = (elm) => {
    setPropertyTypes((pre) => (pre == elm ? "All" : elm));
    handleFilterChange("type", elm);
  };

  const handlepriceRange = (elm) => {
    setPriceRange(elm);
    handleFilterChange("priceRange", elm.join("-"));
  };
  const handlebedrooms = (elm) => {
    setBedrooms(elm);
    handleFilterChange("bedrooms", elm);
  };
  const handlebathrooms = (elm) => {
    setBathrooms(elm);
    handleFilterChange("bathrooms", elm);
  };
  const handlelocation = (elm) => {
    console.log(elm);
    setLocation(elm);
    handleFilterChange("location", elm);
  };
  const handlesquirefeet = (elm) => {
    setSquirefeet(elm);
    handleFilterChange("min_feet", elm[0]);
    handleFilterChange("max_feet", elm[1]);
  };
  const handleyearBuild = (elm) => {
    setyearBuild(elm);
    handleFilterChange("yearBuild", elm.join("-"));
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
  };

  // ✅ COMPLETELY FIXED FILTERING LOGIC
  useEffect(() => {
    console.log("🔄 Starting filter process with propData:", propData.length);
    console.log("🎯 Current filter values:", {
      listingStatus,
      propertyTypes,
      bedrooms,
      bathrooms,
      location,
      priceRange,
      searchQuery
    });

    if (propData.length > 0) {
      let filtered = [...propData];
      console.log("📊 Initial data:", filtered.length);

      // 🔧 FIXED: Listing Status Filter - Handle "Buy" vs "Sell" mapping
      if (listingStatus && listingStatus !== "All") {
        filtered = filtered.filter((elm) => {
          const purpose = elm.details?.purpose;
          if (listingStatus === "Buy") {
            return purpose === "Sell"; // API uses "Sell" for buying properties
          } else if (listingStatus === "Rent") {
            return purpose === "Rent";
          }
          return true;
        });
        console.log("After listingStatus filter:", filtered.length);
      }

      // 🔧 FIXED: Property Types Filter - Handle multiple variations
      if (propertyTypes && propertyTypes !== "All" && propertyTypes !== "properties") {
        filtered = filtered.filter((el) => {
          const apiPropertyType = el.details?.property_type;
          
          // Handle plural/singular matching
          const normalizedFilter = propertyTypes.toLowerCase();
          const normalizedApiType = apiPropertyType?.toLowerCase();
          
          // Direct match
          if (normalizedApiType === normalizedFilter) return true;
          
          // Plural to singular matching (e.g., "apartments" -> "apartment")
          if (normalizedFilter.endsWith('s') && normalizedApiType === normalizedFilter.slice(0, -1)) return true;
          
          // Singular to plural matching (e.g., "apartment" -> "apartments") 
          if (normalizedApiType?.endsWith('s') && normalizedFilter === normalizedApiType?.slice(0, -1)) return true;
          
          return false;
        });
        console.log("After propertyTypes filter:", filtered.length);
      }

      // 🔧 FIXED: Bedrooms Filter - Use >= instead of === for better UX
      if (bedrooms > 0) {
        filtered = filtered.filter((el) => {
          const propertyBedrooms = Number(el.details?.bedrooms) || 0;
          return propertyBedrooms >= Number(bedrooms); // Changed to >= for "X or more bedrooms"
        });
        console.log("After bedrooms filter:", filtered.length);
      }

      // 🔧 FIXED: Bathrooms Filter - Use >= instead of === 
      if (bathrooms > 0) {
        filtered = filtered.filter((el) => {
          const propertyBathrooms = Number(el.details?.bathrooms) || 0;
          return propertyBathrooms >= Number(bathrooms); // Changed to >= for "X or more bathrooms"
        });
        console.log("After bathrooms filter:", filtered.length);
      }

      // 🔧 FIXED: Location Filter - More flexible matching
      if (location && location !== "uae" && location !== "all" && location.toLowerCase() !== "uae") {
        filtered = filtered.filter((el) => {
          const locationData = el.location || {};
          const searchTerm = location.toLowerCase();
          
          // Check multiple location fields
          const fieldsToCheck = [
            locationData.city,
            locationData.emirate, 
            locationData.neighborhood,
            locationData.address,
            locationData.landmark
          ];
          
          return fieldsToCheck.some(field => 
            field && field.toLowerCase().includes(searchTerm)
          );
        });
        console.log("After location filter:", filtered.length);
      }

      // 🔧 FIXED: Price Range Filter
      if (priceRange && priceRange.length === 2 && (priceRange[0] > 0 || priceRange[1] < 1000000000)) {
        filtered = filtered.filter((el) => {
          const price = Number(el.price) || 0;
          return price >= priceRange[0] && price <= priceRange[1];
        });
        console.log("After price filter:", filtered.length);
      }

      // 🔧 FIXED: Square Feet Filter
      if (squirefeet && squirefeet.length === 2 && (squirefeet[0] > 0 || squirefeet[1] < Number.MAX_SAFE_INTEGER)) {
        filtered = filtered.filter((el) => {
          const sizeValue = Number(el.details?.size?.value) || 0;
          return sizeValue >= squirefeet[0] && sizeValue <= squirefeet[1];
        });
        console.log("After square feet filter:", filtered.length);
      }

      // 🔧 FIXED: Search Query Filter
      if (searchQuery && searchQuery.trim() !== "") {
        filtered = filtered.filter((el) => {
          const searchLower = searchQuery.toLowerCase();
          const title = (el.title || "").toLowerCase();
          const address = (el.location?.address || "").toLowerCase();
          const neighborhood = (el.location?.neighborhood || "").toLowerCase();
          const city = (el.location?.city || "").toLowerCase();
          
          return title.includes(searchLower) || 
                 address.includes(searchLower) || 
                 neighborhood.includes(searchLower) || 
                 city.includes(searchLower);
        });
        console.log("After search filter:", filtered.length);
      }
      
      console.log("✅ Final filtered items:", filtered.length);
      setFilteredData(filtered);
    } else {
      console.log("❌ No propData available");
      setFilteredData([]);
    }
  }, [
    propData,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathrooms,
    location,
    categories,
    searchQuery,
    squirefeet,
  ]);

  // 🔧 IMPROVED: Sorting logic with better date handling
  useEffect(() => {
    setPageNumber(1); // Reset to first page on filter change
    
    if (currentSortingOption === "Newest") {
      const sorted = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA; // Newest first
      });
      setSortedFilteredData(sorted);
    } else if (currentSortingOption === "Price Low") {
      const sorted = [...filteredData].sort((a, b) => (a.price || 0) - (b.price || 0));
      setSortedFilteredData(sorted);
    } else if (currentSortingOption === "Price High") {
      const sorted = [...filteredData].sort((a, b) => (b.price || 0) - (a.price || 0));
      setSortedFilteredData(sorted);
    } else {
      setSortedFilteredData(filteredData);
    }
  }, [filteredData, currentSortingOption]);

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
  };
};

export default usePropertyFilter;