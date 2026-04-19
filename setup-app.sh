#!/bin/bash

# ===========================================
# Application Setup Script
# Run after uploading files to server
# ===========================================

set -e

APP_DIR="/var/www/citation-lookup"
DOMAIN="${1:-yourdomain.com}"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

cd $APP_DIR

echo "Setting up Backend..."
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f .env ]; then
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=citation_lookup
EOF
fi
print_status "Backend configured"

echo "Setting up Frontend..."
cd ../frontend

# Create .env for production
cat > .env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN
EOF

yarn install
yarn build
print_status "Frontend built"

echo "Starting Backend with PM2..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
print_status "Backend started"

echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/citation-lookup << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        root $APP_DIR/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

ln -sf /etc/nginx/sites-available/citation-lookup /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
print_status "Nginx configured"

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your site is now available at: http://$DOMAIN"
echo ""
echo "To enable HTTPS, run:"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "Admin Login:"
echo "  Username: admin"
echo "  Password: Money2026\$"
