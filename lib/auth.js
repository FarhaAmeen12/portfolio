const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'farha-portfolio-super-secure-jwt-secret-key-2026';
const ADMIN_DEFAULT_EMAIL = process.env.ADMIN_EMAIL || 'admin@farha.dev';
// Precomputed bcrypt hash for 'AdminFarha2026!' with 10 salt rounds
const ADMIN_DEFAULT_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$wE9U9Z8XhE0RjMh8lQJmreZcWc/O0rT7oYn6.bB4u7zF4Z1zZz.We';

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  // If hash is our placeholder or bcrypt hash
  try {
    return bcrypt.compareSync(password, hash);
  } catch (e) {
    return false;
  }
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function getAuthTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  // Check cookies
  const cookies = parseCookies(req.headers['cookie']);
  if (cookies.farha_token) {
    return cookies.farha_token;
  }
  if (cookies.token) {
    return cookies.token;
  }
  return null;
}

function requireAuth(req) {
  const token = getAuthTokenFromRequest(req);
  if (!token) {
    return null;
  }
  const decoded = verifyToken(token);
  return decoded;
}

module.exports = {
  JWT_SECRET,
  ADMIN_DEFAULT_EMAIL,
  ADMIN_DEFAULT_PASSWORD_HASH,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  parseCookies,
  getAuthTokenFromRequest,
  requireAuth
};
