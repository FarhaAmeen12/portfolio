const { requireAuth } = require('../lib/auth');
const db = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const auth = requireAuth(req);
  if (!auth) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
  }

  try {
    const stats = await db.getDashboardStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[Dashboard API Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to load dashboard statistics' });
  }
};
