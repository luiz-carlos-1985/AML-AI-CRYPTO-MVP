# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env` file in the root directory:
```bash
JWT_SECRET=your-super-secret-key-min-32-characters-long
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_HOST=redis-host
ML_SERVICE_URL=http://ml-service:8000
NODE_ENV=production
```

### 2. Database Setup
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 3. Build and Test
```bash
# Backend
cd backend
npm install
npm run build
npm test

# Frontend
cd frontend
npm install
npm run build
```

### 4. Validate Production Configuration
```bash
cd backend
npx tsx scripts/validateProduction.ts
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. Set environment variables:
```bash
export JWT_SECRET="your-super-secret-key-here"
```

2. Build and start services:
```bash
docker-compose up -d --build
```

3. Check health:
```bash
docker-compose ps
docker-compose logs -f
```

4. Run migrations:
```bash
docker-compose exec backend npx prisma migrate deploy
```

### Option 2: Manual Deployment

#### Backend
```bash
cd backend
npm install --production
npm run prisma:generate
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm install --production
npm run build
# Serve dist folder with nginx or similar
```

#### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

## Post-Deployment

### 1. Health Check
```bash
curl http://your-domain/health
curl http://your-domain/api/health
```

### 2. Create Admin User
```bash
cd backend
npx tsx scripts/setAdmin.ts
```

### 3. Monitor Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ml-service
```

### 4. Setup Monitoring
- Configure application monitoring (Prometheus/Grafana)
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up log aggregation

## Security Hardening

### 1. SSL/TLS
- Install SSL certificates
- Configure HTTPS
- Enable HSTS headers
- Set up automatic certificate renewal

### 2. Firewall
```bash
# Allow only necessary ports
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 3. Database Security
- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

### 4. Application Security
- Change default JWT_SECRET
- Enable rate limiting
- Configure CORS properly
- Use environment variables for secrets

## Backup Strategy

### Database Backup
```bash
# Daily backup
docker-compose exec postgres pg_dump -U cryptoaml cryptoaml > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U cryptoaml cryptoaml < backup.sql
```

### Volume Backup
```bash
docker run --rm -v cryptoaml_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Multiple backend instances
- Shared Redis cache
- Database read replicas

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Enable caching
- CDN for static assets

## Monitoring Endpoints

- Health: `GET /health`
- Metrics: `GET /api/metrics` (if implemented)
- Status: `GET /api/status` (if implemented)

## Troubleshooting

### Backend not starting
```bash
docker-compose logs backend
# Check database connection
# Verify environment variables
```

### Database connection issues
```bash
docker-compose exec postgres psql -U cryptoaml -d cryptoaml
# Test connection
# Check credentials
```

### High memory usage
```bash
docker stats
# Adjust container limits in docker-compose.yml
```

## Rollback Procedure

1. Stop current deployment:
```bash
docker-compose down
```

2. Restore previous version:
```bash
git checkout previous-tag
docker-compose up -d --build
```

3. Restore database if needed:
```bash
docker-compose exec -T postgres psql -U cryptoaml cryptoaml < backup.sql
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Run health check: `npx tsx scripts/healthCheck.ts`
- Review documentation: `/docs`
