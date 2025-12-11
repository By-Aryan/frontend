module.exports = {
  apps: [{
    name: 'frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/developer/frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      TRUST_PROXY: 'true',
      NEXTAUTH_URL: 'https://147.93.98.24',
      NEXTAUTH_SECRET: 'your_production_nextauth_secret_here'
    },
    // Logging
    log_file: '/root/.pm2/logs/frontend-combined.log',
    out_file: '/root/.pm2/logs/frontend-out.log',
    error_file: '/root/.pm2/logs/frontend-error.log',
    
    // Process management
    watch: false,
    max_memory_restart: '1G',
    
    // Restart policy
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};