import OpenAI from 'openai';
import { verifyToken, getActiveSubscription } from '../../../lib/auth.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const subscription = await getActiveSubscription(decoded.userId, decoded.role);
  if (!subscription) {
    return res.status(402).json({ message: 'No active subscription' });
  }

  const { description, type } = req.body; // e.g. 'ecommerce store for shoes', 'business site'
  if (!description || !type) {
    return res.status(400).json({ message: 'Description and type required' });
  }

  try {
    const prompt = `Generate a complete, deploy-ready website for: "${description}" type: ${type}.
    
Return ONLY full HTML file with embedded CSS/JS. Responsive, modern design using TailwindCSS CDN.
Include:
- Header/nav
- Hero section
- Features/content
- Footer
- Mobile responsive
- Professional

No explanations, pure HTML code.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
    });

    const websiteCode = completion.choices[0].message.content;
    res.status(200).json({ website: websiteCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Website generation failed' });
  }
}

