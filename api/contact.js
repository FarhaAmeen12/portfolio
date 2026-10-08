const db = require('./lib/db');

// Simple in-memory rate limiting map for contact submissions (IP or email)
const submissionRateLimit = new Map();

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
    body = body || {};

    const { name, email, subject, message } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide a valid name (at least 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please enter a message (at least 5 characters).' });
    }

    // 2. Simple Rate Limiting (max 5 messages per 10 minutes per IP/email)
    const clientIp = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown';
    const rateKey = `${clientIp}_${email.trim().toLowerCase()}`;
    const now = Date.now();
    const rateInfo = submissionRateLimit.get(rateKey) || { count: 0, resetAt: now + 10 * 60 * 1000 };

    if (now > rateInfo.resetAt) {
      rateInfo.count = 0;
      rateInfo.resetAt = now + 10 * 60 * 1000;
    }

    if (rateInfo.count >= 5) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages sent recently. Please wait a few minutes before trying again.'
      });
    }

    rateInfo.count += 1;
    submissionRateLimit.set(rateKey, rateInfo);

    // 3. Save to database
    const savedMessage = await db.createMessage({
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      subject: (subject || 'Portfolio Contact Inquiry').trim().slice(0, 200),
      message: message.trim().slice(0, 3000)
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. Farha will get back to you shortly.',
      id: savedMessage.id
    });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit contact message. Please try again.' });
  }
};
