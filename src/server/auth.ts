import crypto from 'node:crypto';

// Password Hashing using scrypt + salt
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const actualHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const actualBuf = Buffer.from(actualHash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (actualBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(actualBuf, expectedBuf);
  } catch {
    return false;
  }
}

// Session Management
export interface ActiveSession {
  token: string;
  email: string;
  role: 'admin';
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, ActiveSession>();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export function createSession(email: string): ActiveSession {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: ActiveSession = {
    token,
    email,
    role: 'admin',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  };
  activeSessions.set(token, session);
  return session;
}

export function verifySession(token: string | undefined): ActiveSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

export function destroySession(token: string | undefined): boolean {
  if (!token) return false;
  return activeSessions.delete(token);
}

// Rate Limiting (Brute-force protection)
interface RateLimitRecord {
  failedAttempts: number;
  lastAttempt: number;
  blockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes block
const WINDOW_DURATION_MS = 15 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) return { allowed: true };

  if (record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // Window expired, reset
  if (now - record.lastAttempt > WINDOW_DURATION_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { failedAttempts: 0, lastAttempt: now, blockedUntil: 0 };
  record.failedAttempts += 1;
  record.lastAttempt = now;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }
  rateLimitMap.set(ip, record);
}

export function recordSuccessfulLogin(ip: string): void {
  rateLimitMap.delete(ip);
}
