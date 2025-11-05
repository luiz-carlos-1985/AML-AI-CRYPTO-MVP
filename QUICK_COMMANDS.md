# 🚀 Comandos Rápidos - CryptoAML

## Iniciar Sistema

```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar com rebuild
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
```

## Parar Sistema

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## Database

```bash
# Executar migrations
docker-compose exec backend npx prisma migrate deploy

# Gerar Prisma Client
docker-compose exec backend npx prisma generate

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio

# Backup
docker-compose exec postgres pg_dump -U cryptoaml cryptoaml > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U cryptoaml cryptoaml < backup.sql
```

## Admin

```bash
# Configurar usuário admin
cd backend
npm run admin:set

# Ou via Docker
docker-compose exec backend npm run admin:set
```

## Validação e Testes

```bash
# Validar configuração de produção
cd backend
npm run validate:production

# Health check
npm run health:check

# Testes de integração
npm run test:integration

# Verificação completa (Linux/Mac)
./verify-production.sh

# Verificação completa (Windows)
verify-production.bat
```

## Desenvolvimento

```bash
# Backend dev mode
cd backend
npm run dev

# Frontend dev mode
cd frontend
npm run dev

# ML Service dev mode
cd ml-service
python main.py
```

## Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Logs e Debug

```bash
# Ver todos os logs
docker-compose logs -f

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do ML service
docker-compose logs -f ml-service

# Ver logs do banco
docker-compose logs -f postgres

# Ver últimas 100 linhas
docker-compose logs --tail=100 backend
```

## Status e Health

```bash
# Ver status dos containers
docker-compose ps

# Health check da API
curl http://localhost:3001/health

# Health check do ML Service
curl http://localhost:8000/health

# Health check do Frontend
curl http://localhost:3000
```

## Limpeza

```bash
# Remover containers parados
docker-compose rm

# Limpar volumes não utilizados
docker volume prune

# Limpar imagens não utilizadas
docker image prune

# Limpeza completa (cuidado!)
docker system prune -a
```

## Acesso aos Containers

```bash
# Backend shell
docker-compose exec backend sh

# Database shell
docker-compose exec postgres psql -U cryptoaml -d cryptoaml

# Redis CLI
docker-compose exec redis redis-cli

# ML Service shell
docker-compose exec ml-service sh
```

## Monitoramento

```bash
# Ver uso de recursos
docker stats

# Ver processos em um container
docker-compose top backend

# Inspecionar container
docker-compose exec backend ps aux
```

## Variáveis de Ambiente

```bash
# Linux/Mac
export JWT_SECRET="your-secret-key"
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Windows CMD
set JWT_SECRET=your-secret-key
set DATABASE_URL=postgresql://user:pass@host:5432/db

# Windows PowerShell
$env:JWT_SECRET="your-secret-key"
$env:DATABASE_URL="postgresql://user:pass@host:5432/db"
```

## URLs de Acesso

```bash
Frontend:    http://localhost:3000
Backend API: http://localhost:3001
ML Service:  http://localhost:8000
PostgreSQL:  localhost:5432
Redis:       localhost:6379
```

## Troubleshooting

```bash
# Reiniciar um serviço específico
docker-compose restart backend

# Rebuild um serviço
docker-compose up -d --build backend

# Ver configuração do docker-compose
docker-compose config

# Verificar portas em uso
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :8000

# Limpar cache do Docker
docker builder prune
```

## Backup Rápido

```bash
# Backup completo
mkdir -p backups
docker-compose exec postgres pg_dump -U cryptoaml cryptoaml > backups/db_$(date +%Y%m%d_%H%M%S).sql
docker run --rm -v cryptoaml_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/volume_$(date +%Y%m%d_%H%M%S).tar.gz /data

# Restore rápido
docker-compose exec -T postgres psql -U cryptoaml cryptoaml < backups/db_latest.sql
```

## Performance

```bash
# Ver uso de memória
docker stats --no-stream

# Ver logs de performance
docker-compose logs backend | grep "ms"

# Limpar cache do Redis
docker-compose exec redis redis-cli FLUSHALL
```

## Segurança

```bash
# Verificar vulnerabilidades nas imagens
docker scan cryptoaml-backend
docker scan cryptoaml-frontend

# Atualizar dependências
cd backend && npm audit fix
cd frontend && npm audit fix
```

## Deploy em Produção

```bash
# 1. Configurar variáveis
export JWT_SECRET="strong-secret-key-min-32-chars"
export NODE_ENV="production"

# 2. Build e start
docker-compose -f docker-compose.yml up -d --build

# 3. Migrations
docker-compose exec backend npx prisma migrate deploy

# 4. Criar admin
docker-compose exec backend npm run admin:set

# 5. Verificar
./verify-production.sh

# 6. Monitorar
docker-compose logs -f
```

## Comandos Úteis do Prisma

```bash
# Ver schema
docker-compose exec backend npx prisma db pull

# Resetar database (cuidado!)
docker-compose exec backend npx prisma migrate reset

# Seed database
docker-compose exec backend npx prisma db seed

# Format schema
docker-compose exec backend npx prisma format
```

## Git

```bash
# Commit rápido
git add .
git commit -m "Production ready"
git push

# Tag de versão
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```
