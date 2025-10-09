# VPS Deployment Guide - Digital Ocean

## Prerequisites

- Digital Ocean droplet (or any VPS)
- SSH access to your server
- Git installed on your VPS
- Docker and Docker Compose installed on your VPS

## Step 1: Prepare Your VPS

SSH into your Digital Ocean droplet:

```bash
ssh root@your-server-ip
```

### Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version
```

### Configure Firewall

```bash
# Allow necessary ports
ufw allow 22/tcp    # SSH
ufw allow 8001/tcp  # Application
ufw enable

# Check status
ufw status
```

## Step 2: Clone Your Repository

```bash
# Navigate to desired directory
cd /opt

# Clone your repository
git clone https://github.com/your-username/scheduler.git
cd scheduler
```

**OR** if using manual transfer:

```bash
# On your local machine, create a tar archive
tar --exclude='node_modules' --exclude='build' --exclude='.git' -czf scheduler.tar.gz .

# Transfer to VPS
scp scheduler.tar.gz root@your-server-ip:/opt/

# On VPS, extract
ssh root@your-server-ip
cd /opt
tar -xzf scheduler.tar.gz
mkdir -p scheduler
tar -xzf scheduler.tar.gz -C scheduler/
cd scheduler
rm /opt/scheduler.tar.gz
```

## Step 3: Build and Run with Docker

```bash
# Build and start the application
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 4: Verify Deployment

Check if the application is running:

```bash
# Test API endpoint
curl http://localhost:8001/api/days

# Check container health
docker inspect scheduler-app --format='{{.State.Health.Status}}'
```

Access your application:
```
http://your-server-ip:8001
```

## Common Docker Commands

### View Logs
```bash
docker-compose logs -f           # All logs (follow)
docker-compose logs app          # App logs only
docker-compose logs --tail=100   # Last 100 lines
```

### Restart Services
```bash
docker-compose restart           # Restart all
docker-compose restart app       # Restart specific service
```

### Stop Services
```bash
docker-compose stop              # Stop all
docker-compose down              # Stop and remove containers
```

### Update Application
```bash
# Pull latest changes (if using Git)
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### View Container Status
```bash
docker-compose ps
docker stats
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker-compose logs app
```

Rebuild from scratch:
```bash
docker-compose down -v
docker-compose up -d --build
```

### Port Already in Use

Check what's using the port:
```bash
netstat -tulpn | grep 8001
```

Kill the process or change the port in `docker-compose.yml`

### Check Container Health

```bash
docker inspect scheduler-app --format='{{json .State.Health}}' | jq
```

### Access Container Shell

```bash
docker exec -it scheduler-app sh
```

## Production Enhancements (Optional)

### 1. Add Nginx Reverse Proxy

Install Nginx:
```bash
apt install nginx -y
```

Create Nginx config `/etc/nginx/sites-available/scheduler`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
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

### 2. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### 3. Auto-Start on Reboot

Docker containers with `restart: unless-stopped` will automatically start on reboot.

Verify Docker starts on boot:
```bash
systemctl enable docker
```

### 4. Set Up Log Rotation

Docker logs can grow large. Configure log rotation in `docker-compose.yml`:

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Monitoring

### Check Resource Usage

```bash
docker stats scheduler-app
```

### Monitor Logs in Real-Time

```bash
docker-compose logs -f --tail=50
```

### Set Up Health Checks

The application already has health checks configured. Monitor with:

```bash
docker inspect scheduler-app --format='{{.State.Health.Status}}'
```

## Backup Strategy

### Backup Configuration

```bash
# Backup docker-compose and configs
tar -czf scheduler-backup-$(date +%Y%m%d).tar.gz \
  docker-compose.yml \
  Dockerfile \
  .env \
  server.js
```

### Automated Backups

Add to crontab:
```bash
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * cd /opt/scheduler && tar -czf /opt/backups/scheduler-$(date +\%Y\%m\%d).tar.gz docker-compose.yml Dockerfile server.js
```

## Security Best Practices

1. **Use Non-Root User**: Already configured in Dockerfile
2. **Keep Docker Updated**: `apt update && apt upgrade -y`
3. **Limit Resource Usage**: Add resource limits to docker-compose.yml
4. **Enable Firewall**: Only open necessary ports
5. **Regular Updates**: Pull and rebuild regularly
6. **Monitor Logs**: Check for suspicious activity

## File Structure on VPS

```
/opt/scheduler/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
├── package-lock.json
├── server.js
├── public/
└── src/
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up -d --build` | Build and start |
| `docker-compose down` | Stop and remove |
| `docker-compose ps` | Check status |
| `docker-compose logs -f` | View logs |
| `docker-compose restart` | Restart all |
| `docker exec -it scheduler-app sh` | Access shell |

## Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify containers: `docker-compose ps`
3. Check health: `docker inspect scheduler-app`
4. Rebuild: `docker-compose up -d --build`

---

**Note**: This is a production setup that serves both the React static files and the API from a single container. The React app is built during Docker build and served alongside the API.
