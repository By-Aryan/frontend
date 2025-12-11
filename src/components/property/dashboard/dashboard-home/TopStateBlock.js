"use client"
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect, useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useRouter } from "next/navigation"; // ✅ Correct for App Router

const StatisticSkeleton = () => {

  return (
    <div className="col-sm-6 col-xxl-3">
      <div
        className="d-flex justify-content-between statistics_funfact"
        style={{ height: "180px" }}
      >
        <div className="details">
          <div className="text fz25">
            <div
              className="skeleton-loader"
              style={{ width: "120px", height: "20px" }}
            ></div>
          </div>
          <div className="title">
            <div
              className="skeleton-loader"
              style={{ width: "60px", height: "30px" }}
            ></div>
          </div>
        </div>
        <div className="icon text-center">
          <div
            className="skeleton-loader"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const TopStateBlock = ({ role }) => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get userId from localStorage when component mounts
    const storedUserId = localStorage.getItem("id") || null;
    setUserId(storedUserId);
  }, []);

  const { data, isLoading, isError } = useAxiosFetch(
    `/property/dashboardData?role=${role}&userId=${userId}`
  );

  const dashboardData = data?.data || {};
  console.log("Dashboard Data:", dashboardData);

  // Define the statistics based on the role and API data
  const getStatisticsItems = () => {
    if (role === "seller") {
      return [
        {
          text: "All Properties",
          title: dashboardData.totalProperties || 0,
          icon: "flaticon-home",
        },
        {
          text: "Approved Properties",
          title: dashboardData.totalApprovedProperties || 0,
          icon: "flaticon-like",
        },
        {
          text: "Pending Properties",
          title: dashboardData.totalPendingProperties || 0,
          icon: "flaticon-clock",
        },
        {
          text: "Rejected Properties",
          title: dashboardData.totalRejectedProperties || 0,
          icon: "flaticon-review",
        },
        {
          text: "Requested",
          title: dashboardData.totalRequestedProperties || 0,
          icon: "flaticon-review",
        },
        {
          text: "Accepted",
          title: dashboardData.totalAcceptedProperties || 0,
          icon: "flaticon-like",
        },
      ];
    } else if (role === "buyer") {
      return [
        {
          text: "Properties Requested",
          title: dashboardData.totalRequestedPropertiesByUser || 0,
          icon: "flaticon-search-chart",
        },
        {
          text: "Pending Requests",
          title: dashboardData.totalRequestedProperties || 0,
          icon: "flaticon-clock",
        },
        {
          text: "Accepted Requests",
          title: dashboardData.totalAcceptedProperties || 0,
          icon: "flaticon-like",
        },
        {
          text: "Total Favorites",
          title: dashboardData.totalFavorites || 0,
          icon: "flaticon-like",
        },
      ];
    } else if (role === "agent") {
      return [
        {
          text: "Properties Managed",
          title: dashboardData.totalProperties || 0,
          icon: "flaticon-home",
        },
        // {
        //   text: "Listed Properties",
        //   title: dashboardData.totalListedProperties || 0,
        //   icon: "flaticon-search-chart",
        // },
        {
          text: "Pending Requests",
          title: dashboardData.totalPendingProperties || 0,
          icon: "flaticon-clock",
        },
        {
          text: "Accepted Requests",
          title: dashboardData.totalAcceptedProperties || 0,
          icon: "flaticon-like",
        },
      ];
    } else if (role === "admin") {
      return [
        {
          text: "Total Properties",
          title: dashboardData.totalProperties || 0,
          icon: "flaticon-home",
          href: "/dashboard/total-properties",
        },
        {
          text: "Approved Properties",
          title: dashboardData.totalApprovedProperties || 0,
          icon: "flaticon-like",
          href: "/dashboard/approved-properties",
        },
        {
          text: "Pending Requests",
          title: dashboardData.totalPendingProperties || 0,
          icon: "flaticon-clock",
          href: "/dashboard/pending-request",
        },
        {
          text: "Total Requests",
          title: dashboardData.totalRequestedProperties || 0,
          icon: "flaticon-review",
          href: "/dashboard/total-request",
        },
        {
          text: "Requests Accepted",
          title: dashboardData.totalAcceptedProperties || 0,
          icon: "flaticon-like",
          href: "/dashboard/request-accepted",
        },
      ];
    }

    return [];
  };

  const statisticsItems = getStatisticsItems();

  // Get the number of skeleton items to show based on role
  const getSkeletonCount = () => {
    if (role === "seller") return 6;
    if (role === "buyer") return 4;
    if (role === "agent") return 4;
    if (role === "admin") return 6;
    return 4; // Default
  };

  if (isLoading) {
    return (
      <>
        {Array(getSkeletonCount())
          .fill()
          .map((_, index) => (
            <StatisticSkeleton key={index} />
          ))}
      </>
    );
  }

  if (isError) {
    return (
      <div className="col-12">
        <div className="alert alert-danger">
          Error loading statistics. Please try again.
        </div>
      </div>
    );
  }

  // Calculate the number of items per row based on the screen size
  const getColClasses = () => {
    // For admin and seller with 6 items, we want 3 items per row on larger screens
    if ((role === "admin" || role === "seller") && statisticsItems.length > 4) {
      return "col-sm-6 col-md-4 col-xxl-4 mb-4";
    }
    // For buyer and agent with 4 items, we want 2 items per row on larger screens
    return "col-sm-6 col-xxl-3 mb-4";
  };

  return (
    <>
      {statisticsItems.map((item, index) => (
        <div
          key={index}
          className={getColClasses()}
          style={{ cursor: item.href ? "pointer" : "default" }}
          onClick={() => {
            if (item.href) {
              console.log("🚀 ~ item.href:", item.href)

              router.push(item.href);
            }
          }}
        >
          <div
            className="d-flex justify-content-between statistics_funfact"
            style={{ height: "180px" }}
          >
            <div className="details">
              <div className="text fz25">{item.text}</div>
              <div className="title">{item.title}</div>
            </div>
            <div className="icon text-center">
              <i className={item.icon} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopStateBlock;
