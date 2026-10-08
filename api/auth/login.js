const { signToken, verifyPassword, ADMIN_DEFAULT_EMAIL, hashPassword } = require('../lib/auth');
const db = require('../lib/db');

// In-memory admin password hash (default 'AdminFarha2026!')
let adminPasswordHash = global.__FARHA_ADMIN_HASH || hashPassword('AdminFarha2026!');
global.__FARHA_ADMIN_HASH = adminPasswordHash;

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

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
    return res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
};
