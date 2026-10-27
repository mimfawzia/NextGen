import { app } from '../src/server/app';

export default function handler(req: any, res: any) {
  // Normalize request URL if Vercel serverless rewrites strip the /api prefix
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/_')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
