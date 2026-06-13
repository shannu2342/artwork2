module.exports = {
  apps: [
    {
      name: 'artwork2-backend',
      cwd: '/var/www/apps/artwork2/backend',
      script: 'index.js',
      interpreter: 'node',
      env_file: '/var/www/apps/artwork2/backend/.env',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
      out_file: '/var/www/apps/artwork2/logs/backend-out.log',
      error_file: '/var/www/apps/artwork2/logs/backend-error.log',
      time: true
    }
  ]
};
