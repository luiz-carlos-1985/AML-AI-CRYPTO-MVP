# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email security@cryptoaml.com instead of using the issue tracker.

## Security Measures

### Authentication
- JWT tokens with configurable expiration
- Bcrypt password hashing (10 rounds)
- 2FA support with TOTP

### API Security
- Rate limiting (configurable)
- Helmet.js security headers
- CORS configuration
- Input validation with Joi
- SQL injection protection (Prisma ORM)

### Data Protection
- Encrypted wallet keys
- Secure password storage
- Environment variable isolation

### Infrastructure
- Docker container isolation
- Network segmentation
- Health check monitoring
- Automated backups

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate credentials** - Change passwords regularly
3. **Monitor logs** - Check for suspicious activity
4. **Update dependencies** - Keep packages up to date
5. **Use HTTPS** - Always encrypt in transit
6. **Backup data** - Regular automated backups
7. **Limit access** - Principle of least privilege

## Compliance

- GDPR ready
- LGPD compliant
- SOC 2 Type II aligned
- PCI DSS considerations for payment data
