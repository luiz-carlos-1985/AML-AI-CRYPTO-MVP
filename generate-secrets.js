const crypto = require('crypto');

console.log('🔐 Generating Production Secrets\n');
console.log('Copy these to your .env.production file:\n');
console.log('─'.repeat(80));

const jwtSecret = crypto.randomBytes(64).toString('base64');
console.log(`JWT_SECRET=${jwtSecret}`);

const walletKey = crypto.randomBytes(32).toString('hex');
console.log(`WALLET_ENCRYPTION_KEY=${walletKey}`);

const dbPassword = crypto.randomBytes(24).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
console.log(`DATABASE_PASSWORD=${dbPassword}`);

const redisPassword = crypto.randomBytes(24).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
console.log(`REDIS_PASSWORD=${redisPassword}`);

console.log('─'.repeat(80));
console.log('\n⚠️  IMPORTANT: Store these secrets securely!');
console.log('Never commit these to version control.\n');
