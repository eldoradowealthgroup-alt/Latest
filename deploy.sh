#!/bin/bash

# ===========================================
# Hostinger VPS Deployment Script
# Citation Lookup Application
# ===========================================

set -e

echo "=========================================="
echo "Citation Lookup - Deployment Script"
echo "=========================================="

# Configuration
APP_DIR="/var/www/citation-lookup"
DOMAIN="yourdomain.com"  # Change this to your domain

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

echo ""
echo "Step 1: Updating system..."
apt update && apt upgrade -y
print_status "System updated"

echo ""
echo "Step 2: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
print_status "Node.js $(node -v) installed"

echo ""
echo "Step 3: Installing Python..."
apt install -y python3.11 python3.11-venv python3-pip
print_status "Python installed"

echo ""
echo "Step 4: Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt update
    apt install -y mongodb-org
fi
systemctl start mongod
systemctl enable mongod
print_status "MongoDB installed and running"

echo ""
echo "Step 5: Installing Nginx..."
apt install -y nginx
print_status "Nginx installed"

echo ""
echo "Step 6: Installing PM2 and Yarn..."
npm install -g pm2 yarn
print_status "PM2 and Yarn installed"

echo ""
echo "Step 7: Setting up application directory..."
mkdir -p $APP_DIR
print_status "Directory created: $APP_DIR"

echo ""
print_warning "Please upload your application files to: $APP_DIR"
print_warning "Then run: ./deploy.sh --setup-app"

echo ""
echo "=========================================="
echo "Base installation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Upload your code to $APP_DIR"
echo "2. Run: ./deploy.sh --setup-app"
echo "3. Update DOMAIN variable in this script"
echo "4. Configure SSL with: certbot --nginx -d $DOMAIN"
