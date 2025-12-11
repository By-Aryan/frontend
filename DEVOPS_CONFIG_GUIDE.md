# DevOps Configuration Guide - Zero Brokerage Frontend

## Frontend Server Actions Error Fix

This document provides the necessary configuration changes to fix the Server Actions error that was occurring in production.

### Problem Identified
```
`x-forwarded-host` header with value `localhost:3000` does not match 
`origin` header with value `147.93.98.24` from a forwarded Server Actions request.
```

### Code Changes Made

#### 1. Next.js Configuration (`next.config.js`)
- ✅ Added `serverActions.allowedOrigins` configuration
- ✅ Enabled SWC minifier (`swcMinify: true`)
- ✅ Added security headers configuration

#### 2. Environment Configuration
- ✅ Updated `.env.production` with proxy settings
- ✅ Updated `.env.local` for development
- ✅ Added `TRUST_PROXY`, `HOST`, `PORT` variables

#### 3. PM2 Configuration (`ecosystem.frontend.config.js`)
- ✅ Added proxy environment variables
- ✅ Set proper `HOST` and `TRUST_PROXY` settings

## Required DevOps Configuration

### Nginx Configuration (Required)
Create or update your nginx configuration file:

\`\`\`nginx
server {
    listen 80;
    server_name 147.93.98.24;

    location / {
        proxy_pass https://localhost:3000;
        
        # CRITICAL: These headers must be set correctly
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Origin $scheme://$host;
        
        # WebSocket support
        proxy_https_version 1.1;
        proxy_set_header Upgrade $https_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $https_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
\`\`\`

### Apache Configuration (Alternative)
If using Apache instead of nginx:

\`\`\`apache
<VirtualHost *:80>
    ServerName 147.93.98.24
    
    ProxyPreserveHost On
    ProxyRequests Off
    
    ProxyPass / https://localhost:3000/
    ProxyPassReverse / https://localhost:3000/
    
    # Set correct headers
    ProxyPassReverse / https://147.93.98.24/
    Header always set X-Forwarded-Host "147.93.98.24"
    Header always set X-Forwarded-Proto "https"
</VirtualHost>
\`\`\`

## Deployment Steps

### 1. Apply Code Changes
The code changes have been made to:
- `next.config.js`
- `.env.production`
- `.env.local`
- `ecosystem.frontend.config.js`

### 2. Restart Services
\`\`\`bash
# Restart nginx (if using nginx)
sudo systemctl restart nginx

# Restart PM2 frontend process
pm2 restart frontend

# Or restart all PM2 processes
pm2 restart all
\`\`\`

### 3. Verify Configuration
\`\`\`bash
# Check nginx configuration
sudo nginx -t

# Check PM2 processes
pm2 status

# Test headers
curl -H "Origin: https://147.93.98.24" https://147.93.98.24 -v
\`\`\`

### 4. Monitor Logs
\`\`\`bash
# Watch PM2 logs
pm2 logs frontend --lines 50

# Watch nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
\`\`\`

## Environment Variables Summary

### Production Environment (`.env.production`)
- `HOST=0.0.0.0`
- `PORT=3000`
- `TRUST_PROXY=true`
- `NEXTAUTH_URL=https://147.93.98.24`

### Development Environment (`.env.local`)
- `HOST=localhost`
- `PORT=3000`
- `TRUST_PROXY=false`
- `NEXTAUTH_URL=https://localhost:3000`

## Security Considerations

1. **Trusted Origins**: Only specified origins are allowed for Server Actions
2. **Security Headers**: Added X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
3. **Proxy Trust**: Configured to trust proxy headers securely

## Testing

After deployment, test the following:
1. Server Actions functionality (forms, buttons that trigger server actions)
2. Image loading from all configured domains
3. API calls to backend
4. Authentication flows (if using NextAuth)

## Troubleshooting

If issues persist:
1. Check nginx/apache configuration syntax
2. Verify PM2 environment variables are loaded
3. Check that all origins are included in `allowedOrigins`
4. Ensure proxy headers are being forwarded correctly

\`\`\`bash
# Debug headers being received
pm2 logs frontend | grep -i "forwarded\|origin\|host"
\`\`\`