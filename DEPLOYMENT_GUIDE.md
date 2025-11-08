# 🚀 Production Deployment Guide

Complete guide to deploy CryptoAML to production.

## Pre-Deployment Checklist

### 1. Generate Secrets
```bash
node generate-secrets.js
```
Copy the output to your `.env.production` file.

### 2. Configure Environment
```bash
cp .env.production.example .env.production
# Edit with your production values
```

Required variables:
- `DB_USER` and `DB_PASSWORD` - Strong database credentials
- `REDIS_PASSWORD` - Strong Redis password
- `JWT_SECRET` - 64+ character secret
- `WALLET_ENCRYPTION_KEY` - 64 hex character key
- `DOMAIN` - Your production domain
- `ETHERSCAN_API_KEY` - Real API key

### 3. SSL Certificates

#### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy to project
mkdir ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
```

#### Option B: Self-Signed (Development Only)
```bash
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem
```

### 4. Update nginx-ssl.conf
```bash
# Edit nginx-ssl.conf
# Replace 'your-domain.com' with your actual domain
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Option 2: Manual Deployment

#### Backend
```bash
cd backend

# Install dependencies
npm ci --production

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2
npm install -g pm2
pm2 start dist/server.js --name cryptoaml-backend
pm2 save
pm2 startup
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm ci

# Build
npm run build

# Serve with nginx
sudo cp -r dist/* /var/www/html/
```

#### Database
```bash
# Install PostgreSQL
sudo apt-get install postgresql-15

# Create database
sudo -u postgres psql
CREATE DATABASE cryptoaml;
CREATE USER cryptoaml_prod WITH PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE cryptoaml TO cryptoaml_prod;
```

#### Redis
```bash
# Install Redis
sudo apt-get install redis-server

# Configure password
sudo nano /etc/redis/redis.conf
# Add: requirepass your-redis-password

# Restart
sudo systemctl restart redis
```

## Post-Deployment

### 1. Validate Installation
```bash
cd backend
npm run validate:production
```

### 2. Health Check
```bash
npm run health:check
```

### 3. Create Admin User
```bash
npm run admin:set
# Follow prompts to set admin email
```

### 4. Test API
```bash
curl https://your-domain.com/health
curl https://your-domain.com/api/health
```

## Monitoring Setup

### Prometheus + Grafana
```bash
# Add to docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d prometheus grafana

# Access Grafana
# http://your-domain.com:3000
# Default: admin/admin
```

### Log Monitoring
```bash
# View application logs
tail -f backend/logs/*.log

# View Docker logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Backup Strategy

### Automated Backups (Included)
The production Docker Compose includes automatic daily backups:
- Location: `./backups/`
- Retention: 7 days
- Format: PostgreSQL dump

### Manual Backup
```bash
# Database
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U cryptoaml_prod cryptoaml > backup_$(date +%Y%m%d).sql

# Files
tar -czf reports_backup_$(date +%Y%m%d).tar.gz backend/reports/
```

### Restore from Backup
```bash
# Database
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U cryptoaml_prod cryptoaml < backup_20240101.sql

# Files
tar -xzf reports_backup_20240101.tar.gz
```

## Scaling

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Load Balancer
Add nginx load balancer configuration:
```nginx
upstream backend {
    least_conn;
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}
```

## Security Hardening

### 1. Firewall
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Fail2Ban
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
```

### 3. Regular Updates
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check environment
docker-compose -f docker-compose.prod.yml exec backend env

# Restart service
docker-compose -f docker-compose.prod.yml restart backend
```

### Database Connection Issues
```bash
# Test connection
docker-compose -f docker-compose.prod.yml exec backend \
  npx prisma db pull

# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### High Memory Usage
```bash
# Check resource usage
docker stats

# Adjust limits in docker-compose.prod.yml
```

## Rollback Procedure

```bash
# Stop current version
docker-compose -f docker-compose.prod.yml down

# Restore database backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U cryptoaml_prod cryptoaml < backups/backup_previous.dump

# Checkout previous version
git checkout previous-tag

# Rebuild and start
docker-compose -f docker-compose.prod.yml up -d --build
```

## Maintenance

### Zero-Downtime Updates
```bash
# Build new images
docker-compose -f docker-compose.prod.yml build

# Rolling update
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale backend=2 backend
docker-compose -f docker-compose.prod.yml up -d --no-deps --scale backend=1 backend
```

### Database Migrations
```bash
# Backup first!
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U cryptoaml_prod cryptoaml > pre_migration_backup.sql

# Run migration
docker-compose -f docker-compose.prod.yml exec backend \
  npx prisma migrate deploy
```

## Support

For issues or questions:
- Check logs: `backend/logs/`
- Health check: `npm run health:check`
- Validate config: `npm run validate:production`

## Cost Optimization

### AWS Recommendations
- Use RDS for PostgreSQL (automated backups)
- Use ElastiCache for Redis (managed)
- Use ECS Fargate (auto-scaling)
- Use CloudFront CDN (static assets)
- Use S3 for report storage

### Estimated Monthly Costs
- Small: $80-100 (single instance)
- Medium: $260-300 (HA setup)
- Large: $500+ (multi-region)
