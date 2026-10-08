const { requireAuth } = require('./lib/auth');
const db = require('./lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;
  const auth = requireAuth(req);

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  body = body || {};

  try {
    if (method === 'GET') {
      const experience = await db.getExperience();
      return res.status(200).json({ success: true, experience });
    }

    if (method === 'POST') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      if (!body.company || !body.position) {
        return res.status(400).json({ success: false, error: 'Company and position are required' });
      }
      const created = await db.createExperience(body);
      return res.status(201).json({ success: true, experience: created });
    }

    if (method === 'PUT') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const id = body.id || query.id;
      if (!id) return res.status(400).json({ success: false, error: 'Experience ID required' });
      const updated = await db.updateExperience(id, body);
      if (!updated) return res.status(404).json({ success: false, error: 'Experience not found' });
      return res.status(200).json({ success: true, experience: updated });
    }

    if (method === 'DELETE') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const id = query.id || body.id;
      if (!id) return res.status(400).json({ success: false, error: 'Experience ID required' });
      const deleted = await db.deleteExperience(id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Experience not found' });
      return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
    }

    return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  } catch (error) {
    console.error('[Experience API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};
