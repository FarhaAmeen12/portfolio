module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // Clear authentication cookies
  res.setHeader('Set-Cookie', [
    'farha_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'farha_authenticated=; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ]);

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
