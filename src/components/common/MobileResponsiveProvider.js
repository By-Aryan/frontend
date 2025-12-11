"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const MobileResponsiveContext = createContext();

export const useMobileResponsive = () => {
  const context = useContext(MobileResponsiveContext);
  if (!context) {
    throw new Error('useMobileResponsive must be used within MobileResponsiveProvider');
  }
  return context;
};

export const MobileResponsiveProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [bootstrapReady, setBootstrapReady] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width <= 767);
      setIsTablet(width > 767 && width <= 991);
    };

    const checkBootstrap = () => {
      setBootstrapReady(typeof window.bootstrap !== 'undefined');
    };

    // Initial check
    updateScreenSize();
    checkBootstrap();

    // Set up listeners
    window.addEventListener('resize', updateScreenSize);
    
    // Check Bootstrap periodically until it's loaded
    const bootstrapInterval = setInterval(() => {
      if (typeof window.bootstrap !== 'undefined') {
        setBootstrapReady(true);
        clearInterval(bootstrapInterval);
      }
    }, 100);

    // Cleanup after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(bootstrapInterval);
    }, 10000);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      clearInterval(bootstrapInterval);
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenWidth,
    bootstrapReady
  };

  return (
    <MobileResponsiveContext.Provider value={value}>
      {children}
    </MobileResponsiveContext.Provider>
  );
};