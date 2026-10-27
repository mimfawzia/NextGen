import express, { Request, Response, NextFunction } from 'express';
import { 
  hashPassword, 
  verifyPassword, 
  createSession, 
  verifySession, 
  destroySession, 
  checkRateLimit, 
  recordFailedLogin, 
  recordSuccessfulLogin,
  ActiveSession 
} from './auth';
import { serverDb } from './db';

// Extend Express Request to hold authenticated admin user
declare global {
  namespace Express {
    interface Request {
      adminUser?: ActiveSession;
    }
  }
}

export const app = express();

app.use(express.json());

// Helper to get client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Authentication Middleware for Protected Endpoints
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authentication required. No authorization token provided.' });
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = verifySession(token);

  if (!session || session.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized. Invalid or expired administrator session.' });
    return;
  }

  req.adminUser = session;
  next();
}

// ================= PUBLIC ENDPOINTS =================

app.get('/api/public/status', (_req: Request, res: Response) => {
  res.json({
    isConfigured: serverDb.isAdminConfigured()
  });
});

app.get('/api/public/tools', (_req: Request, res: Response) => {
  res.json(serverDb.getTools(false));
});

app.get('/api/public/tools/:slug', (req: Request, res: Response) => {
  const tool = serverDb.getToolBySlug(req.params.slug);
  if (!tool || !tool.isPublished) {
    res.status(404).json({ error: 'Tool not found' });
    return;
  }
  res.json(tool);
});

app.get('/api/public/categories', (_req: Request, res: Response) => {
  res.json(serverDb.getCategories());
});

app.get('/api/public/tutorials', (_req: Request, res: Response) => {
  res.json(serverDb.getTutorials(false));
});

app.get('/api/public/income-guides', (_req: Request, res: Response) => {
  res.json(serverDb.getIncomeGuides(false));
});

app.get('/api/public/articles', (_req: Request, res: Response) => {
  res.json(serverDb.getArticles(false));
});

app.get('/api/public/settings', (_req: Request, res: Response) => {
  res.json(serverDb.getSettings());
});

// ================= AUTHENTICATION ENDPOINTS =================

// Check auth state & initialization status
app.get('/api/auth/status', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  const session = verifySession(token);

  res.json({
    isConfigured: serverDb.isAdminConfigured(),
    isAuthenticated: !!session,
    user: session ? { email: session.email, role: session.role } : null
  });
});

// Initial Administrator Setup (Only works if NO admin account exists yet)
app.post('/api/auth/setup-first-admin', (req: Request, res: Response) => {
  // If an administrator already exists, permanently lock setup
  if (serverDb.isAdminConfigured()) {
    res.status(403).json({ 
      error: 'Administrator account is already established. Public registration is permanently disabled.' 
    });
    return;
  }

  const { email, password, confirmPassword } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  // Hash password with salt
  const { salt, hash } = hashPassword(password);
  serverDb.setAdmin(email, salt, hash);

  // Generate secure session
  const session = createSession(email.toLowerCase().trim());

  res.status(201).json({
    success: true,
    token: session.token,
    user: {
      email: session.email,
      role: session.role
    }
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    res.status(429).json({ 
      error: `Too many failed login attempts. Please try again in ${rateLimit.remainingSeconds || 900} seconds.` 
    });
    return;
  }

  if (!serverDb.isAdminConfigured()) {
    res.status(400).json({ 
      error: 'Initial administrator setup is required. Please set up the administrator account first.' 
    });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const admin = serverDb.getAdmin();
  if (!admin) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  const isEmailMatch = cleanEmail === admin.email;
  const isPasswordMatch = verifyPassword(password, admin.salt, admin.hash);

  if (!isEmailMatch || !isPasswordMatch) {
    recordFailedLogin(ip);
    // Generic error message: Never reveal whether the email exists
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  // Successful login
  recordSuccessfulLogin(ip);
  serverDb.updateLastLogin();
  const session = createSession(admin.email);

  res.json({
    success: true,
    token: session.token,
    user: {
      email: session.email,
      role: session.role
    }
  });
});

// Verify Current Session
app.get('/api/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  const session = verifySession(token);

  if (!session) {
    res.status(401).json({ authenticated: false, error: 'Session expired or invalid.' });
    return;
  }

  res.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role
    }
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  if (token) {
    destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ================= PROTECTED ADMIN ENDPOINTS =================

// Tools Management
app.get('/api/admin/tools', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getTools(true));
});

app.post('/api/admin/tools', requireAdminAuth, (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Tool name is required.' });
    return;
  }
  const saved = serverDb.saveTool(req.body);
  res.json(saved);
});

app.delete('/api/admin/tools/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = serverDb.deleteTool(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Tool not found.' });
    return;
  }
  res.json({ success: true });
});

// Categories Management
app.get('/api/admin/categories', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getCategories());
});

app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }
  const saved = serverDb.saveCategory(req.body);
  res.json(saved);
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = serverDb.deleteCategory(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  res.json({ success: true });
});

// Tutorials Management
app.get('/api/admin/tutorials', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getTutorials(true));
});

app.post('/api/admin/tutorials', requireAdminAuth, (req: Request, res: Response) => {
  if (!req.body.title) {
    res.status(400).json({ error: 'Tutorial title is required.' });
    return;
  }
  const saved = serverDb.saveTutorial(req.body);
  res.json(saved);
});

app.delete('/api/admin/tutorials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = serverDb.deleteTutorial(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Tutorial not found.' });
    return;
  }
  res.json({ success: true });
});

// Income Guides Management
app.get('/api/admin/income-guides', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getIncomeGuides(true));
});

app.post('/api/admin/income-guides', requireAdminAuth, (req: Request, res: Response) => {
  if (!req.body.title) {
    res.status(400).json({ error: 'Guide title is required.' });
    return;
  }
  const saved = serverDb.saveIncomeGuide(req.body);
  res.json(saved);
});

app.delete('/api/admin/income-guides/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = serverDb.deleteIncomeGuide(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Guide not found.' });
    return;
  }
  res.json({ success: true });
});

// Articles Management
app.get('/api/admin/articles', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getArticles(true));
});

app.post('/api/admin/articles', requireAdminAuth, (req: Request, res: Response) => {
  if (!req.body.title) {
    res.status(400).json({ error: 'Article title is required.' });
    return;
  }
  const saved = serverDb.saveArticle(req.body);
  res.json(saved);
});

app.delete('/api/admin/articles/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = serverDb.deleteArticle(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }
  res.json({ success: true });
});

// Settings Management
app.get('/api/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(serverDb.getSettings());
});

app.post('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const saved = serverDb.saveSettings(req.body);
  res.json(saved);
});
