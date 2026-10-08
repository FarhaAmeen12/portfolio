const { requireAuth } = require('../lib/auth');
const db = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const { method } = req;

  try {
    // 1. GET Settings (Public read)
    if (method === 'GET') {
      const settings = await db.getSettings();
      return res.status(200).json({ success: true, settings });
    }

    // 2. PUT Settings (Admin only)
    if (method === 'PUT' || method === 'POST') {
      const auth = requireAuth(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      const updated = await db.updateSettings(body);
      return res.status(200).json({ success: true, settings: updated });
    }

    return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  } catch (error) {
    console.error('[Settings API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};
