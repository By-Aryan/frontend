"use client";

import { useState, useEffect } from 'react';

/**
 * Enhanced custom hook for responsive design utilities
 * Provides comprehensive screen size detection and breakpoint management
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    breakpoint: 'lg',
    orientation: 'portrait',
    deviceType: 'desktop'
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Enhanced device type detection
      let deviceType = 'desktop';
      if (width < 480) {
        deviceType = 'mobile-small';
      } else if (width < 768) {
        deviceType = 'mobile';
      } else if (width < 1024) {
        deviceType = 'tablet';
      } else if (width < 1280) {
        deviceType = 'desktop';
      } else {
        deviceType = 'desktop-large';
      }
      
      setScreenSize({
        width,
        height,
        orientation,
        deviceType,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isMobileSmall: width < 480,
        isDesktopLarge: width >= 1280,
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
        isTouchDevice: 'ontouchstart' in window,
        breakpoint: width < 320 ? 'xs' :
                   width < 480 ? 'sm' : 
                   width < 768 ? 'md' : 
                   width < 1024 ? 'lg' : 
                   width < 1280 ? 'xl' : '2xl',
        
        // Utility functions
        getResponsiveValue: (mobileValue, tabletValue, desktopValue) => {
          if (width < 768) return mobileValue;
          if (width < 1024) return tabletValue || mobileValue;
          return desktopValue || tabletValue || mobileValue;
        },
        
        getResponsiveClasses: (mobileClass = '', tabletClass = '', desktopClass = '') => {
          if (width < 768) return mobileClass;
          if (width < 1024) return tabletClass;
          return desktopClass;
        }
      });
    };

    // Set initial values
    updateScreenSize();

    // Add event listener with debounce for performance
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return screenSize;
};

/**
 * Hook for detecting specific breakpoints
 */
export const useBreakpoint = (breakpoint) => {
  const { breakpoint: currentBreakpoint } = useResponsive();
  
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return {
    isExact: currentBreakpoint === breakpoint,
    isAbove: currentIndex > targetIndex,
    isBelow: currentIndex < targetIndex,
    isAtLeast: currentIndex >= targetIndex,
    isAtMost: currentIndex <= targetIndex
  };
};

/**
 * Hook for mobile-specific detection
 */
export const useMobile = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

/**
 * Hook for tablet-specific detection
 */
export const useTablet = () => {
  const { isTablet } = useResponsive();
  return isTablet;
};

/**
 * Hook for desktop-specific detection
 */
export const useDesktop = () => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};