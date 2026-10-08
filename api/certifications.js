const { requireAuth } = require('../lib/auth');
const db = require('../lib/db');

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
      const certifications = await db.getCertifications();
      return res.status(200).json({ success: true, certifications });
    }

    if (method === 'POST') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      if (!body.name || !body.organization) {
        return res.status(400).json({ success: false, error: 'Certification name and organization are required' });
      }
      const created = await db.createCertification(body);
      return res.status(201).json({ success: true, certification: created });
    }

    if (method === 'PUT') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const id = body.id || query.id;
      if (!id) return res.status(400).json({ success: false, error: 'Certification ID required' });
      const updated = await db.updateCertification(id, body);
      if (!updated) return res.status(404).json({ success: false, error: 'Certification not found' });
      return res.status(200).json({ success: true, certification: updated });
    }

    if (method === 'DELETE') {
      if (!auth) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const id = query.id || body.id;
      if (!id) return res.status(400).json({ success: false, error: 'Certification ID required' });
      const deleted = await db.deleteCertification(id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Certification not found' });
      return res.status(200).json({ success: true, message: 'Certification deleted successfully' });
    }

    return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  } catch (error) {
    console.error('[Certifications API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};
