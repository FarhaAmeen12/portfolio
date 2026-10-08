const { signToken, verifyPassword, ADMIN_DEFAULT_EMAIL, hashPassword, requireAuth } = require('../lib/auth');
const db = require('../lib/db');

// In-memory admin password hash (default 'AdminFarha2026!')
if (!global.__FARHA_ADMIN_HASH) {
  global.__FARHA_ADMIN_HASH = hashPassword('AdminFarha2026!');
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // Determine action from query or url path
  const url = req.url || '';
  let action = (req.query && req.query.action) ? req.query.action.toLowerCase() : null;
  if (!action) {
    if (url.includes('/login') || url.endsWith('login')) action = 'login';
    else if (url.includes('/logout') || url.endsWith('logout')) action = 'logout';
    else if (url.includes('/me') || url.endsWith('me')) action = 'me';
  }

  // Handle Login
  if (action === 'login' || (req.method === 'POST' && !action && req.body && req.body.email)) {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      const { email, password } = body || {};

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      // Validate email
      const trimmedEmail = email.trim().toLowerCase();
      const isValidAdmin = trimmedEmail === ADMIN_DEFAULT_EMAIL.toLowerCase() || trimmedEmail === 'farhaameen02@gmail.com';

      if (!isValidAdmin) {
        return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
      }

      // Verify password against hash
      const isPasswordCorrect = verifyPassword(password, global.__FARHA_ADMIN_HASH);

      if (!isPasswordCorrect) {
        return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
      }

      // Generate token
      const token = signToken({
        sub: 'admin-1',
        email: trimmedEmail,
        role: 'admin',
        name: 'Farha'
      });

      // Set secure cookie
      const isProduction = process.env.NODE_ENV === 'production';
      res.setHeader('Set-Cookie', [
        `farha_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}${isProduction ? '; Secure' : ''}`,
        `farha_authenticated=true; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
      ]);

      return res.status(200).json({
        success: true,
        token,
        user: {
          email: trimmedEmail,
          name: 'Farha',
          role: 'admin'
        }
      });
    } catch (error) {
      console.error('[Auth Login Error]:', error);
      return res.status(500).json({ success: false, error: 'Internal server error during authentication', details: error.message });
    }
  }

  // Handle Logout
  if (action === 'logout') {
    res.setHeader('Set-Cookie', [
      'farha_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'farha_authenticated=; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ]);
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  // Handle Current User / Auth Check (/me or default GET)
  if (action === 'me' || req.method === 'GET') {
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
  }

  return res.status(400).json({ success: false, error: 'Invalid auth action' });
};
