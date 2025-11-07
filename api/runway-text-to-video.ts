import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowOrigin = process.env.PUBLIC_APP_URL || '*';
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.RUNWAY_API_KEY;
  if (!key) return res.status(500).json({ error: 'RUNWAY_API_KEY missing' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const r = await fetch('https://api.runwayml.com/v1/text-to-video', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    res.status(r.status)
      .setHeader('Content-Type', r.headers.get('content-type') || 'application/json')
      .send(text);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Runway proxy failed' });
  }
}
