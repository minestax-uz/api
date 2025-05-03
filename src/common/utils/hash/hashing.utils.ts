import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// Format: SHA256$<salt>$<hash>
export function hash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(createHash('sha256').update(password).digest('hex') + salt)
    .digest('hex');
  return `SHA256$${salt}$${hash}`;
}

export function compare(password: string, stored: string): boolean {
  const [algo, salt, storedHash] = stored.split('$');

  if (algo !== 'SHA256' || !salt || !storedHash) return false;

  const hash = createHash('sha256')
    .update(createHash('sha256').update(password).digest('hex') + salt)
    .digest('hex');

  // Prevent timing attacks
  return timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}
