# ⚡ Quick Deploy Guide

Deploy CryptoAML em produção em 5 passos simples.

## 🚀 Deploy Rápido (15 minutos)

### 1. Executar Setup
```bash
# Windows
setup-production.bat

# Linux/Mac
chmod +x setup-production.sh
./setup-production.sh
```

### 2. Configurar Secrets
```bash
# Abrir secrets.txt e copiar os valores gerados
# Colar em .env.production

# Ou editar manualmente:
nano .env.production  # Linux/Mac
notepad .env.production  # Windows
```

### 3. SSL Certificates

**Opção A: Let's Encrypt (Produção)**
```bash
sudo certbot certonly --standalone -d seu-dominio.com
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ssl/
```

**Opção B: Self-Signed (Teste)**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem
```

### 4. Atualizar Domínio
```bash
# Editar nginx-ssl.conf
# Substituir 'your-domain.com' pelo seu domínio real
```

### 5. Deploy!
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ✅ Validar Deploy

```bash
# Health check
curl https://seu-dominio.com/health

# Validar configuração
cd backend
npm run validate:production

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔧 Comandos Úteis

```bash
# Ver status
docker-compose -f docker-compose.prod.yml ps

# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Reiniciar serviço
docker-compose -f docker-compose.prod.yml restart backend

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Backup manual
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U cryptoaml_prod cryptoaml > backup.sql
```

## 🆘 Problemas?

### Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :80  # Windows
lsof -i :80  # Linux/Mac

# Parar o serviço conflitante ou mudar a porta
```

### Erro de permissão SSL
```bash
# Linux/Mac
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem
```

### Database não conecta
```bash
# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.prod.yml ps postgres

# Ver logs do banco
docker-compose -f docker-compose.prod.yml logs postgres

# Reiniciar banco
docker-compose -f docker-compose.prod.yml restart postgres
```

## 📚 Documentação Completa

Para instruções detalhadas, veja:
- `DEPLOYMENT_GUIDE.md` - Guia completo de deploy
- `PRODUCTION_READY.md` - Lista de correções implementadas
- `SECURITY.md` - Políticas de segurança

## 💡 Dicas

1. **Sempre faça backup antes de atualizar**
2. **Use secrets fortes gerados pelo script**
3. **Configure monitoramento (Sentry, etc)**
4. **Teste o restore de backup regularmente**
5. **Mantenha logs por pelo menos 30 dias**

## 🎯 Checklist Mínimo

- [ ] Secrets gerados e configurados
- [ ] SSL certificates instalados
- [ ] Domínio configurado no nginx
- [ ] DNS apontando para servidor
- [ ] Deploy executado com sucesso
- [ ] Health check retorna OK
- [ ] Backup funcionando

Pronto! Seu sistema está em produção! 🎉
