/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // Mobile-first responsive breakpoints
        screens: {
          'xs': '320px',   // Small phones
          'sm': '480px',   // Large phones
          'md': '768px',   // Tablets
          'lg': '1024px',  // Small laptops
          'xl': '1280px',  // Desktop
          '2xl': '1536px', // Large desktop
        },
        // Touch-friendly spacing and sizing
        spacing: {
          'touch': '44px',        // Minimum touch target size (iOS/Android guidelines)
          'touch-sm': '36px',     // Small touch target
          'touch-lg': '56px',     // Large touch target
          'mobile-padding': '16px',
          'tablet-padding': '24px',
          'desktop-padding': '32px',
          'mobile-margin': '12px',
          'tablet-margin': '16px',
          'desktop-margin': '24px',
        },
        // Mobile-optimized font sizes
        fontSize: {
          'mobile-xs': ['12px', { lineHeight: '16px' }],
          'mobile-sm': ['14px', { lineHeight: '20px' }],
          'mobile-base': ['16px', { lineHeight: '24px' }],
          'mobile-lg': ['18px', { lineHeight: '28px' }],
          'mobile-xl': ['20px', { lineHeight: '32px' }],
          'mobile-2xl': ['24px', { lineHeight: '36px' }],
        },
        // Responsive container max widths
        maxWidth: {
          'mobile': '100%',
          'tablet': '768px',
          'desktop': '1024px',
          'wide': '1280px',
        },
        colors: {
          primary: {
            DEFAULT: '#0f8363',
            50: '#e8f5f1',
            100: '#d1ebe3',
            200: '#a3d7c7',
            300: '#75c3ab',
            400: '#47af8f',
            500: '#0f8363',
            600: '#0d6b4f',
            700: '#0a5a42',
            800: '#084834',
            900: '#053627',
          },
          secondary: '#068662',
          success: '#16a34a',
          info: '#06b6d4',
          warning: '#f59e0b',
          danger: '#ef4444',
          muted: '#6b7280',
          text: '#2b2f36',
          headings: '#181a20',
          border: '#e5e7eb',
          bg: {
            DEFAULT: '#ffffff',
            alt: '#f7f7f7',
          },
        },
      },
    },
    plugins: [],
  };
  