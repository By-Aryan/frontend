import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg">
        {payload[0].name}: {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function Wallet({ planData = null }) {
  // Define states for dynamic data
  const [userPlan, setUserPlan] = useState({});
  const [planHistory, setPlanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedContactsCount, setUsedContactsCount] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isPlanActive, setIsPlanActive] = useState(true);
  
  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };
  
  useEffect(() => {
    // Process provided plan data based on the specific schema
    const processPlanData = async () => {
      setIsLoading(true);
      try {
        if (planData && planData.success) {
          const data = planData.data;
          
          // Calculate total and used contacts
          const buyContacts = data.buyContacts || 0;
          const rentContacts = data.rentContacts || 0;
          const totalContactsAvailable = buyContacts + rentContacts;
          
          setTotalContacts(totalContactsAvailable);
          setUsedContactsCount(0); // We don't track used contacts in this response
          
          setIsPlanActive(data.isActive !== false);
          
          // Process active plan data
          setUserPlan({
            name: data.currentPlan || "Free Plan",
            price: 0, // We don't have price in this response
            datePurchased: new Date().toISOString(),
            planStatus: data.subscriptionStatus || "active",
            totalContacts: totalContactsAvailable,
            planId: "current",
            category: "mixed"
          });
          
          // For now, we don't have subscription history in this response
          // This would need to be fetched separately from /subscription/get-my-plans
          setPlanHistory([]);
        } else {
          // Default data when no planData is provided
          setUserPlan({
            name: "Free plan",
            price: 0,
            datePurchased: new Date().toISOString(),
            planStatus: "Active",
            totalContacts: 1,
            planId: "No ID",
            category: "free"
          });
          
          setTotalContacts(1);
          setUsedContactsCount(0);
          setPlanHistory([]);
        }
      } catch (error) {
        console.error("Error processing plan data:", error);
        // Set defaults on error
        setTotalContacts(0);
        setUsedContactsCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    processPlanData();
  }, [planData]);

  // Calculate remaining contacts from state values
  const remainingContacts = Math.max(0, totalContacts - usedContactsCount);
  
  // Create the data for the pie chart based on state values
  const data = [
    { name: "Used", value: usedContactsCount, color: "#0f8363" }, 
    { name: "Remaining", value: remainingContacts, color: "#9adecb" },
  ];

  // Filter out data points with zero value for pie chart
  const pieData = data.filter(item => item.value > 0);
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil((planHistory?.length || 0) / itemsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };
  
  // Get current items for pagination
  const currentHistoryItems = planHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center">
        <div className="text-lg font-medium">Loading plan information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans space-y-10 relative">
      {/* Header with button positioned at upper right */}
      <div className="w-full flex justify-end px-6 pt-6">
        <button 
          onClick={() => window.location.href = '/pricing'} 
          className="bg-[#0f8363] hover:bg-[#0a6e52] text-white py-2 px-4 rounded-full shadow transition-colors"
        >
          Upgrade your plan
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-[#0f8362cd] text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-white">
            Current Plan details
          </h2>
          <p className="text-3xl font-semibold mt-2">{userPlan?.name || "No Plan"}</p>
          <p className="text-lg">${userPlan?.price || 0}</p>
          <p className="mt-4 text-sm">Purchased Date: {formatDate(userPlan?.datePurchased)}</p>
          <p className="text-sm mt-1">Expires: {formatDate(planData?.subscriptions?.[0]?.expiryDate)}</p>
          <div className="mt-2 flex items-center">
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              userPlan?.planStatus === "active" ? "bg-green-500" : "bg-yellow-500"
            }`}>
              {userPlan?.planStatus === "active" ? "Active" : "Inactive"}
            </span>
            {userPlan?.category && (
              <span className="ml-2 text-sm capitalize">{userPlan.category}</span>
            )}
          </div>
          <p className="font-mono text-xs mt-2 opacity-70">{userPlan?.planId || "No ID"}</p>
        </div>

        {/* Contact Credits Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Contact Credits</h2>
          </div>

          <div className="relative justify-self-center">
            {totalContacts > 0 ? (
              <PieChart width={180} height={180}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-44">
                <p className="text-gray-500">No contact credits available</p>
              </div>
            )}
            
            {/* Centered Total */}
            {totalContacts > 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="leading-0">
                  <p className="text-2xl font-bold flex flex-col">
                    {totalContacts} <span className="text-sm">TOTAL</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {totalContacts > 0 && (
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-[#0f8363] rounded-full mr-2"></span>
                <p className="text-sm text-gray-600 mt-3">Used: {usedContactsCount}</p>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-[#9adecb] rounded-full mr-2"></span>
                <p className="text-sm text-gray-600 mt-3">Remaining: {remainingContacts}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan History Table */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Subscription History</h2>
          {!planData?.subscriptions?.[0]?.autoRenew && planHistory.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-md text-sm text-yellow-700 flex items-center">
              <svg xmlns="https://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Auto-renewal is disabled
            </div>
          )}
        </div>
        
        {planHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table-style3 table at-savesearch w-full">
                <thead className="t-head bg-gray-50 border-b">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">Plan</th>
                    <th scope="col" className="px-4 py-3 text-left">Amount</th>
                    <th scope="col" className="px-4 py-3 text-left">Date Purchased</th>
                    <th scope="col" className="px-4 py-3 text-left">Status</th>
                    <th scope="col" className="px-4 py-3 text-left">Contacts</th>
                  </tr>
                </thead>
                <tbody className="t-body">
                  {currentHistoryItems.map((plan, index) => (
                    <tr 
                      key={plan._id || `plan-${index}`} 
                      className="duration-300 hover:bg-gray-50 border-b last:border-0"
                    >
                      <th scope="row" className="px-4 py-3 font-medium">
                        <div className="flex items-center">
                          <div className="p-0">
                            <span className="text-gray-800">{plan.plan || "Unknown"}</span>
                          </div>
                        </div>
                      </th>
                      <td className="px-4 py-3">{plan.price || "$0"}</td>
                      <td className="px-4 py-3">{plan.datePurchased || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`py-1 px-2 rounded-full text-xs font-medium ${
                            plan.planStatus?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.planStatus || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{plan.totalContacts || "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <div className="flex items-center justify-center mt-6">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mr-2 rounded-md ${
                      currentPage === 1 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label="Previous page"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 mr-2 rounded-md ${
                          currentPage === pageNum
                            ? "bg-[#0f8363] text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label="Next page"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="https://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">No subscription history available</p>
            <p className="text-sm mt-1">Your subscription history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}