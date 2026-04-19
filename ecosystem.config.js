module.exports = {
  apps: [
    {
      name: 'citation-backend',
      cwd: './backend',
      script: 'venv/bin/uvicorn',
      args: 'server:app --host 127.0.0.1 --port 8001',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        MONGO_URL: 'mongodb://localhost:27017',
        DB_NAME: 'citation_lookup'
      },
      env_production: {
        NODE_ENV: 'production',
        MONGO_URL: 'mongodb://localhost:27017',
        DB_NAME: 'citation_lookup'
      }
    }
  ]
};
