"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";

const SubscriptionInfo = ({ className = "" }) => {
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription, remainingContacts, isLoading } = useSubscription();
  const router = useRouter();

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const handleUpgradeClick = () => {
    router.push("/my-plan");
  };

  if (!hasActiveSubscription) {
    return (
      <div className={`subscription-info bg-warning text-dark p-2 rounded ${className}`}>
        <small>
          <i className="fas fa-exclamation-triangle me-1"></i>
          No active subscription
          <button 
            onClick={handleUpgradeClick}
            className="btn btn-sm btn-outline-dark ms-2"
          >
            Upgrade
          </button>
        </small>
      </div>
    );
  }

  const isLowCredits = remainingContacts.total <= 5;

  return (
    <div className={`subscription-info ${isLowCredits ? 'bg-warning' : 'bg-success'} text-white p-2 rounded ${className}`}>
      <small>
        <i className="fas fa-phone me-1"></i>
        {remainingContacts.total} contacts remaining
        {isLowCredits && (
          <button 
            onClick={handleUpgradeClick}
            className="btn btn-sm btn-outline-light ms-2"
            style={{ fontSize: "10px" }}
          >
            Buy More
          </button>
        )}
      </small>
    </div>
  );
};

export default SubscriptionInfo;
