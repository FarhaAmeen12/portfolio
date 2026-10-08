const { requireAuth } = require('../lib/auth');
const db = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;
  const auth = requireAuth(req);

  // Helper to parse JSON body safely
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }
  body = body || {};

  try {
    // 1. GET PROJECTS
    if (method === 'GET') {
      const slug = query.slug || query.id;
      if (slug) {
        const project = await db.getProjectBySlug(slug);
        if (!project) {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }
        return res.status(200).json({ success: true, project });
      }

      // If admin, show all; otherwise show only published
      const publishedOnly = !auth;
      const projects = await db.getProjects({ publishedOnly });
      return res.status(200).json({ success: true, projects });
    }

    // 2. CREATE PROJECT (Admin Only)
    if (method === 'POST') {
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Admin login required.' });
      }

      if (!body.title) {
        return res.status(400).json({ success: false, error: 'Project title is required' });
      }

      const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const created = await db.createProject({ ...body, slug });
      return res.status(201).json({ success: true, project: created });
    }

    // 3. UPDATE PROJECT (Admin Only)
    if (method === 'PUT') {
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Admin login required.' });
      }

      const id = body.id || query.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required for update' });
      }

      const updated = await db.updateProject(id, body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      return res.status(200).json({ success: true, project: updated });
    }

    // 4. DELETE PROJECT (Admin Only)
    if (method === 'DELETE') {
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Admin login required.' });
      }

      const id = query.id || body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required for deletion' });
      }

      const deleted = await db.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Project not found or already deleted' });
      }
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }

    return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  } catch (error) {
    console.error('[Projects API Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error processing projects' });
  }
};
