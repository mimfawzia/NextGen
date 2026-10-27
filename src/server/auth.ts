import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

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

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function loadSessions(): Map<string, ActiveSession> {
  const map = new Map<string, ActiveSession>();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      const now = Date.now();
      for (const [token, session] of Object.entries(data)) {
        const s = session as ActiveSession;
        if (s && s.expiresAt > now) {
          map.set(token, s);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load persisted sessions:', err);
  }
  return map;
}

const activeSessions: Map<string, ActiveSession> = loadSessions();

function persistSessions(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj = Object.fromEntries(activeSessions.entries());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write sessions to disk:', err);
  }
}

export function createSession(email: string): ActiveSession {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: ActiveSession = {
    token,
    email: email.toLowerCase().trim(),
    role: 'admin',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  };
  activeSessions.set(token, session);
  persistSessions();
  return session;
}

export function verifySession(token: string | undefined): ActiveSession | null {
  if (!token) return null;
  const cleanToken = token.trim();
  const session = activeSessions.get(cleanToken);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(cleanToken);
    persistSessions();
    return null;
  }
  return session;
}

export function destroySession(token: string | undefined): boolean {
  if (!token) return false;
  const cleanToken = token.trim();
  const deleted = activeSessions.delete(cleanToken);
  if (deleted) {
    persistSessions();
  }
  return deleted;
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
