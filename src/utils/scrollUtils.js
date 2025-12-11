// Utility functions for managing scroll behavior across the application

export const addScrollToElement = (elementId, maxHeight = '80vh') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.overflowY = 'auto';
    element.style.maxHeight = maxHeight;
    element.classList.add('scrollable-content');
  }
};

export const addScrollToClass = (className, maxHeight = '80vh') => {
  const elements = document.getElementsByClassName(className);
  Array.from(elements).forEach(element => {
    element.style.overflowY = 'auto';
    element.style.maxHeight = maxHeight;
    element.classList.add('scrollable-content');
  });
};

export const makePageScrollable = () => {
  // Auto-detect and make common containers scrollable
  
  // Dashboard content areas
  addScrollToClass('dashboard__content', 'calc(100vh - 80px)');
  
  // Table containers
  addScrollToClass('table-responsive', '70vh');
  
  // Property listing containers
  addScrollToClass('property-grid', '80vh');
  addScrollToClass('property-list', '80vh');
  
  // Form containers
  addScrollToClass('form-container', 'calc(100vh - 150px)');
  
  // Modal content
  addScrollToClass('modal-content', '90vh');
};

export const initializeScrollBehavior = () => {
  // Set up smooth scrolling for the entire page
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Apply scroll behavior when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makePageScrollable);
  } else {
    makePageScrollable();
  }
  
  // Debounce function to limit how often makePageScrollable is called
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Reapply scrolling when route changes (for SPA) with debounced callback
  const debouncedMakePageScrollable = debounce(makePageScrollable, 200);
  const observer = new MutationObserver(() => {
    debouncedMakePageScrollable();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => observer.disconnect();
};
