/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
    // Disable build traces to prevent ENOENT warnings
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '147.93.98.24',
        '147.93.98.24:3000',
        'www.zerobrokerage.ae',
        'zerobrokerage.ae',
        'api.zerobrokerage.ae',
        '51.79.81.34',
        '51.79.81.34:3000'
      ]
    }
  },
  swcMinify: false, // Disabled to prevent warnings
  // Suppress build trace warnings
  outputFileTracing: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
        poll: 1000,
      };
    }
    
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (plugin) => !plugin.constructor.name.includes('Css') && !plugin.constructor.name.includes('cssnano')
      );
    }
    
    return config;
  },
  
  // API rewrites to backend domain
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.zerobrokerage.ae/api/:path*',
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  
  images: {
    remotePatterns: [
      // Local Development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5001',
        pathname: '/**',
      },
      
      // Server IP configuration (HTTPS)
      {
        protocol: 'https',
        hostname: '147.93.98.24',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '147.93.98.24',
        port: '3000',
        pathname: '/**',
      },
      
      // Production domains
      {
        protocol: 'https',
        hostname: 'www.zerobrokerage.ae',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zerobrokerage.ae',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.zerobrokerage.ae',
        pathname: '/**',
      },
      
      // Legacy servers
      {
        protocol: 'https',
        hostname: '51.79.81.34',
        port: '3500',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zero-brokerage-backend.onrender.com',
        pathname: '/**',
      },
      
      // Cloud storage
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      }
    ]
  },
};

module.exports = nextConfig;