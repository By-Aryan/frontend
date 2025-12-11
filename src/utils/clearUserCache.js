// Utility to clear all user-related cached data
export const clearUserCache = () => {
  console.log('🧹 Clearing all user cached data...');
  
  // Clear localStorage items
  const itemsToClear = [
    'isPlanActive',
    'remainingContacts',
    'accessToken',
    'refreshToken',
    'loginSuccessfull',
    'name',
    'id',
    'userPlan',
    'paymentHistory',
    'subscriptionData'
  ];

  itemsToClear.forEach(item => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item);
      console.log(`Cleared localStorage: ${item}`);
    }
  });

  // Clear sessionStorage
  const sessionItemsToClear = [
    'planData',
    'contactCredits',
    'paymentSummary'
  ];

  sessionItemsToClear.forEach(item => {
    if (sessionStorage.getItem(item)) {
      sessionStorage.removeItem(item);
      console.log(`Cleared sessionStorage: ${item}`);
    }
  });

  console.log('✅ User cache cleared');
};

// Function to force refresh user data
export const forceRefreshUserData = () => {
  clearUserCache();
  
  // Dispatch custom event to notify components to refresh
  window.dispatchEvent(new CustomEvent('userDataRefresh'));
  
  // Optionally reload the page
  if (window.confirm('Cache cleared. Reload page to see fresh data?')) {
    window.location.reload();
  }
};