# Hostinger Deployment Guide

This guide covers deploying the Citation Lookup application on Hostinger.

---

## Deployment Options on Hostinger

| Hosting Type | Frontend | Backend | Recommended |
|--------------|----------|---------|-------------|
| Shared Hosting | ✅ Static files only | ❌ No Python support | For frontend only |
| VPS Hosting | ✅ Full support | ✅ Full support | **Best option** |
| Cloud Hosting | ✅ Full support | ✅ Full support | For scalability |

---

## Option 1: VPS Hosting (Recommended)

### Step 1: Purchase VPS

1. Go to [Hostinger VPS](https://www.hostinger.com/vps-hosting)
2. Choose a plan (KVM 1 or higher recommended)
3. Select Ubuntu 22.04 as the OS

### Step 2: Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### Step 3: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Python 3.11
apt install -y python3.11 python3.11-venv python3-pip

# Install MongoDB
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install Nginx
apt install -y nginx

# Install PM2 for process management
npm install -g pm2

# Install Yarn
npm install -g yarn
```

### Step 4: Upload Your Code

```bash
# Create app directory
mkdir -p /var/www/citation-lookup
cd /var/www/citation-lookup

# Option A: Clone from GitHub
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Option B: Upload via SFTP
# Use FileZilla or similar to upload files to /var/www/citation-lookup
```

### Step 5: Configure Backend

```bash
cd /var/www/citation-lookup/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=citation_lookup
EOF

# Test backend
uvicorn server:app --host 0.0.0.0 --port 8001
# Press Ctrl+C to stop after confirming it works
```

### Step 6: Configure Frontend

```bash
cd /var/www/citation-lookup/frontend

# Update environment for production
cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF

# Install dependencies and build
yarn install
yarn build
```

### Step 7: Setup PM2 for Backend

```bash
cd /var/www/citation-lookup

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'citation-backend',
      cwd: '/var/www/citation-lookup/backend',
      script: 'venv/bin/uvicorn',
      args: 'server:app --host 127.0.0.1 --port 8001',
      interpreter: 'none',
      env: {
        MONGO_URL: 'mongodb://localhost:27017',
        DB_NAME: 'citation_lookup'
      }
    }
  ]
};
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/citation-lookup << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - serve static files
    location / {
        root /var/www/citation-lookup/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/citation-lookup /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
```

### Step 9: Setup SSL (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

### Step 10: Configure Firewall

```bash
# Allow necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## Option 2: Shared Hosting (Frontend Only)

If you only need the frontend (static site), you can use Hostinger's shared hosting.

### Step 1: Build Frontend Locally

```bash
cd frontend

# Set backend URL (use external API or skip backend features)
echo "REACT_APP_BACKEND_URL=https://your-backend-api.com" > .env

yarn install
yarn build
```

### Step 2: Upload to Hostinger

1. Login to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Delete existing files
5. Upload contents of `frontend/build/` folder
6. Ensure `index.html` is in the root

### Step 3: Configure .htaccess

Create `.htaccess` in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Option 3: Using MongoDB Atlas (Cloud Database)

Instead of local MongoDB, use MongoDB Atlas for better reliability:

### Step 1: Create Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist your VPS IP (or 0.0.0.0/0 for all)
5. Get connection string

### Step 2: Update Backend Configuration

```bash
# Edit backend/.env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/citation_lookup?retryWrites=true&w=majority
DB_NAME=citation_lookup
```

---

## Quick Reference Commands

### Check Status
```bash
# Backend status
pm2 status

# Backend logs
pm2 logs citation-backend

# Nginx status
systemctl status nginx

# MongoDB status
systemctl status mongod
```

### Restart Services
```bash
# Restart backend
pm2 restart citation-backend

# Restart Nginx
systemctl restart nginx

# Restart MongoDB
systemctl restart mongod
```

### Update Application
```bash
cd /var/www/citation-lookup

# Pull latest code
git pull

# Rebuild frontend
cd frontend
yarn install
yarn build

# Restart backend
pm2 restart citation-backend
```

---

## Domain Configuration

### Point Domain to VPS

1. In Hostinger hPanel, go to **Domains**
2. Select your domain
3. Go to **DNS / Nameservers**
4. Add an **A Record**:
   - Type: A
   - Name: @ (or subdomain)
   - Points to: Your VPS IP
   - TTL: 14400

5. Add **www** subdomain:
   - Type: A
   - Name: www
   - Points to: Your VPS IP

---

## Security Recommendations

1. **Change SSH Port**
```bash
# Edit /etc/ssh/sshd_config
Port 2222  # Change from 22
systemctl restart sshd
```

2. **Disable Root Login**
```bash
# Create new user
adduser deployuser
usermod -aG sudo deployuser

# Edit /etc/ssh/sshd_config
PermitRootLogin no
```

3. **Setup Fail2Ban**
```bash
apt install fail2ban
systemctl enable fail2ban
```

4. **Regular Backups**
```bash
# Backup MongoDB
mongodump --out /backup/mongodb/$(date +%Y%m%d)

# Backup application
tar -czf /backup/app-$(date +%Y%m%d).tar.gz /var/www/citation-lookup
```

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs citation-backend --lines 50

# Check if port is in use
lsof -i :8001

# Manually test
cd /var/www/citation-lookup/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 502 Bad Gateway
```bash
# Check if backend is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### MongoDB connection issues
```bash
# Check MongoDB status
systemctl status mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh mongodb://localhost:27017
```

### SSL certificate issues
```bash
# Renew certificate
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal
```

---

## Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Hostinger VPS KVM 1 | ~$5-10 |
| Domain (optional) | ~$1/month |
| MongoDB Atlas Free | $0 |
| **Total** | **~$6-11/month** |

---

## Support

- Hostinger Support: https://www.hostinger.com/contact
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Nginx Docs: https://nginx.org/en/docs/
