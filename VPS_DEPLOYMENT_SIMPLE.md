# VPS Deployment Guide - Simple Two-Container Setup

## Overview

This deployment uses two separate containers:
- **API Container**: Express.js API on port 8001
- **App Container**: React production build on port 80

Both containers are managed by `docker-compose.prod.yml`

## Prerequisites

- Digital Ocean droplet (Ubuntu 20.04+ recommended)
- SSH access to your server
- Git (optional, for cloning)

## Step 1: Install Docker on Your VPS

SSH into your server:
```bash
ssh root@your-server-ip
```

Install Docker and Docker Compose:
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version
```

## Step 2: Transfer Your Application

### Option A: Using Git (Recommended)
```bash
cd /opt
git clone https://github.com/your-username/scheduler.git
cd scheduler
```

### Option B: Manual Transfer
On your local machine:
```bash
# Create archive (excluding node_modules and build)
tar --exclude='node_modules' --exclude='build' --exclude='.git' -czf scheduler.tar.gz .

# Transfer to VPS
scp scheduler.tar.gz root@your-server-ip:/tmp/
```

On your VPS:
```bash
# Extract
mkdir -p /opt/scheduler
cd /opt/scheduler
tar -xzf /tmp/scheduler.tar.gz
rm /tmp/scheduler.tar.gz
```

## Step 3: Configure Firewall

```bash
# Allow necessary ports
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # Web app
ufw allow 8001/tcp   # API (optional, for direct access)
ufw enable

# Check status
ufw status
```

## Step 4: Deploy the Application

```bash
cd /opt/scheduler

# Build and start both containers
docker-compose -f docker-compose.prod.yml up -d --build
```

This will:
1. Build both containers
2. Build the React production bundle
3. Start the API server on port 8001
4. Start the React app on port 80

## Step 5: Verify Deployment

Check container status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

You should see:
- `scheduler-api` - Running on port 8001
- `scheduler-app` - Running on port 80

View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Test the endpoints:
```bash
# Test API
curl http://localhost:8001/api/days

# Test frontend (should return HTML)
curl http://localhost:80 | head -20
```

## Step 6: Access Your Application

Open your browser and go to:
```
http://your-server-ip
```

The React app will be served on port 80, and it will communicate with the API on port 8001.

## Common Commands

### View Logs
```bash
cd /opt/scheduler

# All logs
docker-compose -f docker-compose.prod.yml logs -f

# API logs only
docker-compose -f docker-compose.prod.yml logs -f api

# App logs only
docker-compose -f docker-compose.prod.yml logs -f app
```

### Restart Services
```bash
cd /opt/scheduler

# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api
docker-compose -f docker-compose.prod.yml restart app
```

### Stop Services
```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml stop
```

### Start Services
```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml start
```

### Update Application
```bash
cd /opt/scheduler

# If using Git
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Check Container Status
```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml ps
docker stats
```

## Troubleshooting

### Containers Won't Start

Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs
```

### Port Already in Use

Check what's using the port:
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :8001
```

### Rebuild from Scratch

```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### Access Container Shell

```bash
# API container
docker exec -it scheduler-api sh

# App container
docker exec -it scheduler-app sh
```

## Optional Enhancements

### 1. Use Port 80 Only (Hide API Port)

Update firewall to block external access to port 8001:
```bash
ufw delete allow 8001/tcp
```

The containers can still communicate internally via the Docker network.

### 2. Add Nginx Reverse Proxy

For SSL and better routing, add Nginx in front:

```bash
apt install nginx -y
```

Create `/etc/nginx/sites-available/scheduler`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/scheduler /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3. Enable SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com
```

### 4. Auto-Start on Reboot

The `restart: unless-stopped` policy ensures containers start automatically on reboot.

Verify Docker starts on boot:
```bash
systemctl enable docker
```

## Monitoring

### Resource Usage
```bash
docker stats
```

### Health Checks
```bash
docker inspect scheduler-api --format='{{.State.Health.Status}}'
```

### Disk Usage
```bash
docker system df
df -h
```

## Backup

Create a backup script `/opt/backup-scheduler.sh`:
```bash
#!/bin/bash
cd /opt/scheduler
tar -czf /opt/backups/scheduler-$(date +%Y%m%d).tar.gz \
  docker-compose.prod.yml \
  Dockerfile.dev \
  .dockerignore \
  package.json \
  server.js \
  src/ \
  public/
```

Make it executable and add to cron:
```bash
chmod +x /opt/backup-scheduler.sh
crontab -e

# Add: Daily backup at 2 AM
0 2 * * * /opt/backup-scheduler.sh
```

## Architecture

```
Internet (Port 80)
       ↓
┌──────────────────┐
│  scheduler-app   │  React App (Port 80)
│  (Container 1)   │
└────────┬─────────┘
         │
         │ API Calls
         ↓
┌──────────────────┐
│  scheduler-api   │  Express API (Port 8001)
│  (Container 2)   │
└──────────────────┘

Both connected via scheduler-network (Docker bridge)
```

## Quick Reference

| Action | Command |
|--------|---------|
| Deploy | `docker-compose -f docker-compose.prod.yml up -d --build` |
| Stop | `docker-compose -f docker-compose.prod.yml down` |
| Logs | `docker-compose -f docker-compose.prod.yml logs -f` |
| Status | `docker-compose -f docker-compose.prod.yml ps` |
| Restart | `docker-compose -f docker-compose.prod.yml restart` |

## Important Notes

- The app uses in-memory data storage (no database)
- Data is lost when API container restarts
- Both containers restart automatically on failure
- Frontend is accessible on port 80
- API is accessible on port 8001
- Containers communicate via Docker network

## Support

For issues:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify containers: `docker-compose -f docker-compose.prod.yml ps`
3. Rebuild: `docker-compose -f docker-compose.prod.yml up -d --build`

---

**Ready to deploy!** Just follow the steps above to get your app running on Digital Ocean.
