// pages/api/redirect.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { childId } = req.body;

  if (!childId) {
    return res.status(400).json({ message: 'childId is required' });
  }

  // Redirige vers /books/page avec l'ID en query param
  res.redirect(307, `/books/page?childId=${childId}`);
}
