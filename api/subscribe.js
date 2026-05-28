export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, team_size } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: { name, team_size },
      groups: [process.env.MAILERLITE_GROUP_ID],
    }),
  });

  if (mlRes.status !== 200 && mlRes.status !== 201) {
    return res.status(500).json({ error: 'Subscription failed' });
  }

  return res.status(200).json({ success: true });
}
