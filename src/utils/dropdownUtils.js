// Dropdown positioning utility
export const fixDropdownPosition = () => {
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  
  dropdowns.forEach(dropdown => {
    const rect = dropdown.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Reset positioning
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.bottom = 'auto';
    dropdown.style.transform = 'none';
    
    // Check if dropdown goes outside viewport
    if (rect.bottom > viewportHeight) {
      // Position above if there's space
      const parentRect = dropdown.parentElement.getBoundingClientRect();
      if (parentRect.top > rect.height + 20) {
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '100%';
      } else {
        // Keep below but adjust height
        dropdown.style.maxHeight = `${viewportHeight - rect.top - 20}px`;
        dropdown.style.overflowY = 'auto';
      }
    }
    
    // Check if dropdown goes outside right edge
    if (rect.right > viewportWidth) {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
    }
    
    // Ensure minimum z-index
    dropdown.style.zIndex = '999999';
    dropdown.style.overflow = 'visible';
  });
};

// Auto-fix dropdown positions when they're shown
export const initDropdownFixes = () => {
  // Observer to watch for dropdown show/hide
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('dropdown-menu') && target.classList.contains('show')) {
          setTimeout(() => fixDropdownPosition(), 10);
        }
      }
    });
  });

  // Observe all dropdown menus
  document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
    observer.observe(dropdown, { attributes: true, attributeFilter: ['class'] });
  });

  // Also fix on window resize
  window.addEventListener('resize', fixDropdownPosition);
  window.addEventListener('scroll', fixDropdownPosition);

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', fixDropdownPosition);
    window.removeEventListener('scroll', fixDropdownPosition);
  };
};
