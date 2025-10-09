# Scheduler App - Docker Deployment Ready

## ✅ What's Been Set Up

Your application is now fully configured for Docker deployment with both development and production environments tested and working.

## Files Created

### Docker Configuration
- **`Dockerfile.dev`** - Development container configuration
- **`docker-compose.dev.yml`** - Development environment (hot reload)
- **`docker-compose.prod.yml`** - Production environment (2 containers) ✅ **USE THIS FOR VPS**
- **`.dockerignore`** - Optimizes Docker builds

### Deployment Guides
- **`VPS_DEPLOYMENT_SIMPLE.md`** - Complete VPS deployment guide ✅ **START HERE**
- **`server.js`** - Updated to serve static files in production

## Production Setup (Tested & Working)

The production setup uses **2 separate containers**:

1. **scheduler-api** (Port 8001)
   - Express.js API server
   - Handles all `/api/*` requests
   - Auto-restart enabled
   - Health checks configured

2. **scheduler-app** (Port 80)
   - Serves React production build
   - Main entry point for users
   - Built using `serve` package
   - Auto-restart enabled

### Ports
- **Port 80**: React Frontend (main app)
- **Port 8001**: Express API

## Quick Start for VPS

### 1. On Your VPS
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose -y
```

### 2. Transfer Your Code
```bash
# Option A: Git
cd /opt
git clone your-repo-url scheduler

# Option B: Manual
# Create tar on local: tar --exclude='node_modules' -czf scheduler.tar.gz .
# Upload and extract on VPS
```

### 3. Deploy
```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Access
```
http://your-server-ip
```

## Local Testing

### Development Mode
```bash
docker-compose -f docker-compose.dev.yml up
# Frontend: http://localhost:8000
# API: http://localhost:8001
```

### Production Mode (Local Test)
```bash
docker-compose -f docker-compose.prod.yml up --build
# Frontend: http://localhost:80
# API: http://localhost:8001
```

## Architecture

```
┌─────────────────────────────────────┐
│         Internet / Users            │
└──────────────┬──────────────────────┘
               │
               ▼
        Port 80 (Frontend)
               │
    ┌──────────▼──────────┐
    │   scheduler-app     │
    │   React Prod Build  │
    └──────────┬──────────┘
               │
               │ Calls API
               ▼
        Port 8001 (API)
               │
    ┌──────────▼──────────┐
    │   scheduler-api     │
    │   Express Server    │
    └─────────────────────┘
```

Both containers connected via Docker network `scheduler-network`

## Common Commands

### Deploy/Update
```bash
cd /opt/scheduler
docker-compose -f docker-compose.prod.yml up -d --build
```

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Check Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Restart
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop
```bash
docker-compose -f docker-compose.prod.yml down
```

## What's Included

✅ Multi-container production setup
✅ Development environment with hot reload
✅ Health checks for reliability
✅ Auto-restart on failure
✅ Optimized Docker builds
✅ Production-ready React build
✅ Separate API and frontend containers
✅ Complete deployment documentation

## Next Steps

1. **Review** `VPS_DEPLOYMENT_SIMPLE.md` for detailed deployment steps
2. **Transfer** your code to VPS (Git or manual)
3. **Deploy** using `docker-compose.prod.yml`
4. **Configure** firewall (ports 22, 80, 8001)
5. **Optional**: Set up SSL with Let's Encrypt

## Environment Variables

The setup handles all necessary environment variables automatically:
- `NODE_ENV=production` (for production mode)
- `NODE_OPTIONS=--openssl-legacy-provider` (for webpack compatibility)
- `PORT=8000` (React app port)
- `PORT=8001` (API port)

## Troubleshooting

### Can't access the app
```bash
# Check if containers are running
docker ps

# Check logs
docker-compose -f docker-compose.prod.yml logs
```

### Port conflicts
```bash
# Check what's using the ports
netstat -tulpn | grep :80
netstat -tulpn | grep :8001
```

### Rebuild everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

## File Overview

```
scheduler/
├── Dockerfile.dev              # Dev container config
├── docker-compose.dev.yml      # Dev environment
├── docker-compose.prod.yml     # Production (USE THIS) ✅
├── .dockerignore               # Build optimization
├── package.json                # Dependencies
├── server.js                   # Express server
├── src/                        # React source
├── public/                     # Static assets
└── VPS_DEPLOYMENT_SIMPLE.md    # Deployment guide ✅
```

## Important Notes

- ⚠️ App uses in-memory data storage (no database)
- ⚠️ Data is lost when API container restarts
- ✅ Containers auto-restart on failure
- ✅ Health checks ensure reliability
- ✅ Both dev and prod modes tested and working

## Support

If you encounter issues:
1. Check container logs
2. Verify both containers are running
3. Test API endpoint: `curl http://localhost:8001/api/days`
4. Rebuild if needed

---

**You're ready to deploy!** 🚀

Follow `VPS_DEPLOYMENT_SIMPLE.md` for step-by-step instructions.
