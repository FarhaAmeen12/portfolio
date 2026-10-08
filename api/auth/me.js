const { requireAuth } = require('../lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const auth = requireAuth(req);
  if (!auth) {
    return res.status(401).json({ success: false, authenticated: false, error: 'Not authenticated' });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: auth.sub,
      email: auth.email,
      name: auth.name || 'Farha',
      role: auth.role || 'admin'
    }
  });
};
