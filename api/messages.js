const { requireAuth } = require('./lib/auth');
const db = require('./lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;
  const auth = requireAuth(req);

  // Messages are strictly private to the admin
  if (!auth) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  body = body || {};

  try {
    if (method === 'GET') {
      const messages = await db.getMessages();
      return res.status(200).json({ success: true, messages });
    }

    if (method === 'PUT') {
      const id = body.id || query.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Message ID is required' });
      }
      const updated = await db.updateMessageStatus(id, body.isRead !== false);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }
      return res.status(200).json({ success: true, message: updated });
    }

    if (method === 'DELETE') {
      const id = query.id || body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Message ID is required' });
      }
      const deleted = await db.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }
      return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    }

    return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  } catch (error) {
    console.error('[Messages API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};
