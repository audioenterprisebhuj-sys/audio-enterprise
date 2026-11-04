import { handleApiRequest } from '../server/api.js';

export default async function handler(req, res) {
  try {
    return await handleApiRequest(req, res);
  } catch (err) {
    console.error('[Vercel Serverless API Error]:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Internal Server Error',
          message: err instanceof Error ? err.message : String(err)
        })
      );
    }
  }
}
