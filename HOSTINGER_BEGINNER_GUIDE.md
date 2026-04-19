# Beginner's Guide: Deploy to Hostinger VPS

A complete step-by-step guide for beginners with no prior server experience.

---

## Table of Contents

1. [What You Need Before Starting](#what-you-need-before-starting)
2. [Part 1: Buy Hostinger VPS](#part-1-buy-hostinger-vps)
3. [Part 2: Connect to Your Server](#part-2-connect-to-your-server)
4. [Part 3: Install Required Software](#part-3-install-required-software)
5. [Part 4: Upload Your Website Files](#part-4-upload-your-website-files)
6. [Part 5: Setup the Backend](#part-5-setup-the-backend)
7. [Part 6: Setup the Frontend](#part-6-setup-the-frontend)
8. [Part 7: Make it Live](#part-7-make-it-live)
9. [Part 8: Add HTTPS Security](#part-8-add-https-security)
10. [Part 9: Connect Your Domain](#part-9-connect-your-domain)
11. [Common Problems & Solutions](#common-problems--solutions)
12. [Glossary](#glossary)

---

## What You Need Before Starting

### Required Items:
- [ ] Credit/debit card for Hostinger purchase (~$5-10/month)
- [ ] A domain name (optional, can use IP address)
- [ ] This code (download from GitHub)
- [ ] About 1-2 hours of time

### Software to Install on Your Computer:
- **Windows**: Download [PuTTY](https://putty.org/) (for connecting to server)
- **Mac/Linux**: Terminal is built-in (no download needed)
- **All Systems**: Download [FileZilla](https://filezilla-project.org/) (for uploading files)

---

## Part 1: Buy Hostinger VPS

### Step 1.1: Go to Hostinger
1. Open your web browser
2. Go to: **https://www.hostinger.com/vps-hosting**

### Step 1.2: Choose a Plan
1. Look for **"KVM 1"** or **"KVM 2"** plan
2. Click **"Add to cart"**
3. The cheapest plan (~$5/month) is enough for this website

### Step 1.3: Complete Purchase
1. Create a Hostinger account (or login)
2. Enter payment information
3. Complete the purchase

### Step 1.4: Setup Your VPS
After purchase, you'll see a setup screen:

1. **Operating System**: Select **Ubuntu 22.04**
2. **Server Location**: Choose closest to your users
3. **Root Password**: Create a STRONG password
   - Example: `MyStr0ng!Pass#2024`
   - **WRITE THIS DOWN** - you'll need it!
4. Click **"Create"**

⏳ Wait 2-5 minutes for your server to be ready.

### Step 1.5: Find Your Server IP Address
1. Go to Hostinger **hPanel**
2. Click on your VPS
3. Look for **"IP Address"** - it looks like: `123.456.78.90`
4. **WRITE THIS DOWN** - you'll need it!

---

## Part 2: Connect to Your Server

### For Windows Users (using PuTTY):

#### Step 2.1: Open PuTTY
1. Open the PuTTY program you downloaded
2. You'll see a window with "Host Name" field

#### Step 2.2: Enter Server Details
1. **Host Name**: Enter your IP address (e.g., `123.456.78.90`)
2. **Port**: Leave as `22`
3. **Connection type**: Make sure "SSH" is selected
4. Click **"Open"**

#### Step 2.3: Login
1. A black window appears asking "login as:"
2. Type: `root` and press Enter
3. Type your password (it won't show as you type - this is normal!)
4. Press Enter

✅ If you see a command prompt (ends with `#`), you're connected!

---

### For Mac Users (using Terminal):

#### Step 2.1: Open Terminal
1. Press `Command + Space`
2. Type "Terminal"
3. Press Enter

#### Step 2.2: Connect
1. Type this command (replace with YOUR IP):
```bash
ssh root@123.456.78.90
```
2. Press Enter
3. If asked "Are you sure you want to continue connecting?", type `yes`
4. Enter your password (it won't show as you type)

✅ If you see a command prompt (ends with `#`), you're connected!

---

## Part 3: Install Required Software

Now we'll install everything your website needs. Copy and paste each command.

### Step 3.1: Update the Server
```bash
apt update && apt upgrade -y
```
**What this does**: Downloads the latest security updates. Takes 1-2 minutes.

### Step 3.2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```
**What this does**: Installs Node.js, which runs JavaScript code.

**Verify it worked**:
```bash
node --version
```
You should see something like: `v18.x.x`

### Step 3.3: Install Python
```bash
apt install -y python3.11 python3.11-venv python3-pip
```
**What this does**: Installs Python, which runs the backend server.

### Step 3.4: Install MongoDB (Database)
```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
```
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```
```bash
apt update
apt install -y mongodb-org
```
**What this does**: Installs MongoDB, which stores user data.

**Start MongoDB**:
```bash
systemctl start mongod
systemctl enable mongod
```

**Verify it worked**:
```bash
systemctl status mongod
```
You should see "active (running)" in green.

### Step 3.5: Install Nginx (Web Server)
```bash
apt install -y nginx
```
**What this does**: Installs Nginx, which serves your website to visitors.

### Step 3.6: Install Helper Tools
```bash
npm install -g pm2 yarn
```
**What this does**: 
- PM2: Keeps your backend running 24/7
- Yarn: Installs frontend packages

### Step 3.7: Create Website Folder
```bash
mkdir -p /var/www/citation-lookup
```
**What this does**: Creates a folder to store your website files.

---

## Part 4: Upload Your Website Files

### Using FileZilla (Easiest Method):

#### Step 4.1: Open FileZilla
1. Open the FileZilla program
2. At the top, you'll see: Host, Username, Password, Port fields

#### Step 4.2: Connect to Server
1. **Host**: `sftp://YOUR_IP_ADDRESS` (e.g., `sftp://123.456.78.90`)
2. **Username**: `root`
3. **Password**: Your server password
4. **Port**: `22`
5. Click **"Quickconnect"**

#### Step 4.3: Navigate to Website Folder
1. On the RIGHT side (server), double-click folders to navigate:
   - Click `var`
   - Click `www`
   - Click `citation-lookup`
2. You should now be in `/var/www/citation-lookup`

#### Step 4.4: Upload Files
1. On the LEFT side (your computer), find your downloaded website files
2. Select ALL files and folders:
   - `backend` folder
   - `frontend` folder
   - `ecosystem.config.js`
   - etc.
3. Drag them to the RIGHT side
4. Wait for upload to complete (watch progress at bottom)

---

## Part 5: Setup the Backend

Go back to your terminal/PuTTY window.

### Step 5.1: Navigate to Backend Folder
```bash
cd /var/www/citation-lookup/backend
```
**What this does**: Changes to the backend folder.

### Step 5.2: Create Python Environment
```bash
python3.11 -m venv venv
```
**What this does**: Creates an isolated Python environment.

### Step 5.3: Activate the Environment
```bash
source venv/bin/activate
```
**What this does**: Turns on the Python environment. Your prompt will change to show `(venv)`.

### Step 5.4: Install Backend Requirements
```bash
pip install -r requirements.txt
```
**What this does**: Installs all Python packages needed. Takes 1-2 minutes.

### Step 5.5: Create Configuration File
```bash
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=citation_lookup
EOF
```
**What this does**: Creates a settings file for the backend.

### Step 5.6: Test the Backend
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```
**What this does**: Starts the backend server for testing.

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

**Press `Ctrl + C` to stop the test.**

### Step 5.7: Setup PM2 (Keeps Backend Running)
```bash
cd /var/www/citation-lookup
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
**What this does**: Makes the backend run forever, even after server restarts.

**Verify it's running**:
```bash
pm2 status
```
You should see "citation-backend" with status "online".

---

## Part 6: Setup the Frontend

### Step 6.1: Navigate to Frontend Folder
```bash
cd /var/www/citation-lookup/frontend
```

### Step 6.2: Create Configuration File
**Replace `yourdomain.com` with your actual domain or IP address:**
```bash
cat > .env << EOF
REACT_APP_BACKEND_URL=http://YOUR_IP_ADDRESS
EOF
```

**Example with IP address:**
```bash
cat > .env << EOF
REACT_APP_BACKEND_URL=http://123.456.78.90
EOF
```

**Example with domain:**
```bash
cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF
```

### Step 6.3: Install Frontend Packages
```bash
yarn install
```
**What this does**: Downloads all required packages. Takes 2-3 minutes.

### Step 6.4: Build the Frontend
```bash
yarn build
```
**What this does**: Creates the final website files. Takes 1-2 minutes.

You should see "Compiled successfully" when done.

---

## Part 7: Make it Live

### Step 7.1: Create Nginx Configuration

**Replace `yourdomain.com` with your domain, or remove those lines if using IP only:**

```bash
cat > /etc/nginx/sites-available/citation-lookup << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve frontend files
    location / {
        root /var/www/citation-lookup/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Connect to backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
```

**If using IP address only (no domain):**
```bash
cat > /etc/nginx/sites-available/citation-lookup << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/citation-lookup/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
```

### Step 7.2: Enable the Website
```bash
ln -sf /etc/nginx/sites-available/citation-lookup /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
```

### Step 7.3: Test Configuration
```bash
nginx -t
```
You should see: "syntax is ok" and "test is successful"

### Step 7.4: Restart Nginx
```bash
systemctl restart nginx
```

### Step 7.5: Open Firewall
```bash
ufw allow 80
ufw allow 443
ufw allow 22
ufw --force enable
```

---

## 🎉 Your Website is Now Live!

Open your web browser and go to:
- `http://YOUR_IP_ADDRESS` (e.g., `http://123.456.78.90`)
- Or `http://yourdomain.com` if you have a domain

You should see the login page!

### Test Credentials:
- **Admin Login**: `admin` / `Money2026$`
- **Test Citation**: `87911938c`

---

## Part 8: Add HTTPS Security

HTTPS adds a padlock icon and encrypts data. **Only do this if you have a domain name.**

### Step 8.1: Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Step 8.2: Get SSL Certificate
**Replace with YOUR domain:**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
1. Enter your email address
2. Agree to terms (type `Y`)
3. Choose whether to share email (your choice)
4. Select option `2` to redirect HTTP to HTTPS

### Step 8.3: Update Frontend Configuration
```bash
cd /var/www/citation-lookup/frontend
cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF
yarn build
```

✅ Your site now has HTTPS!

---

## Part 9: Connect Your Domain

### If you bought domain from Hostinger:

1. Login to Hostinger **hPanel**
2. Go to **Domains** → Select your domain
3. Click **DNS / Nameservers**
4. Click **Manage DNS**
5. Add these records:

| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | YOUR_VPS_IP | 14400 |
| A | www | YOUR_VPS_IP | 14400 |

6. Wait 5-30 minutes for changes to take effect

### If you bought domain elsewhere:

1. Login to your domain registrar
2. Find DNS settings
3. Add the same A records as above

---

## Common Problems & Solutions

### Problem: "Connection refused"
**Solution**: 
```bash
pm2 status  # Check if backend is running
pm2 restart citation-backend  # Restart it
```

### Problem: "502 Bad Gateway"
**Solution**:
```bash
# Check if backend is running
pm2 logs citation-backend

# Restart everything
pm2 restart all
systemctl restart nginx
```

### Problem: Website shows "Cannot GET /"
**Solution**:
```bash
# Make sure frontend is built
cd /var/www/citation-lookup/frontend
yarn build
systemctl restart nginx
```

### Problem: "ENOSPC: no space left on device"
**Solution**:
```bash
# Clear npm cache
npm cache clean --force
yarn cache clean
```

### Problem: Can't connect via SSH
**Solution**:
1. Check your IP address is correct
2. Make sure password is correct
3. Try from Hostinger's built-in terminal in hPanel

### Problem: Domain not working
**Solution**:
1. Wait 30 minutes (DNS takes time)
2. Check DNS settings are correct
3. Try: `ping yourdomain.com`

---

## Useful Commands Reference

### Check Status
```bash
pm2 status              # Backend status
systemctl status nginx  # Web server status
systemctl status mongod # Database status
```

### View Logs (to see errors)
```bash
pm2 logs citation-backend    # Backend logs
tail -f /var/log/nginx/error.log  # Nginx errors
```

### Restart Services
```bash
pm2 restart citation-backend  # Restart backend
systemctl restart nginx       # Restart web server
systemctl restart mongod      # Restart database
```

### Update Website (after making changes)
```bash
cd /var/www/citation-lookup/frontend
yarn build
pm2 restart citation-backend
```

---

## Glossary

| Term | Meaning |
|------|---------|
| **VPS** | Virtual Private Server - your own computer in the cloud |
| **SSH** | Secure Shell - way to connect to your server remotely |
| **Root** | Administrator account with full access |
| **Nginx** | Web server that shows your site to visitors |
| **PM2** | Tool that keeps your backend running 24/7 |
| **MongoDB** | Database that stores user information |
| **DNS** | System that connects domain names to IP addresses |
| **SSL/HTTPS** | Security that encrypts data between visitors and your site |

---

## Need More Help?

1. **Hostinger Support**: Available 24/7 via live chat
2. **Community Forums**: Search for error messages on Google
3. **Check Logs**: Most problems can be found in the logs

---

## Quick Checklist

- [ ] Bought Hostinger VPS
- [ ] Wrote down IP address and password
- [ ] Connected via SSH/PuTTY
- [ ] Installed all software (Node, Python, MongoDB, Nginx)
- [ ] Uploaded website files
- [ ] Setup backend with PM2
- [ ] Built frontend
- [ ] Configured Nginx
- [ ] Website loads in browser
- [ ] (Optional) Added domain
- [ ] (Optional) Added HTTPS

**Congratulations! Your website is live! 🎉**
