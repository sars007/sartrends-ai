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

  const { prompt, type } = req.body; // 'interview', 'policy', 'report', 'ppt'
  if (!prompt || !type) {
    return res.status(400).json({ message: 'Prompt and type required' });
  }

  try {
    const hsePrompt = `Generate HSE (Health Safety Environment) document for trucking industry.
Type: ${type}
Context: ${prompt}

Format:
- Professional document
- PDF-ready markdown
- Downloadable structure
- Global safety standards

${type === 'interview' ? 'Common interview questions + answers' : ''}
${type === 'ppt' ? 'Slide structure for presentation' : ''}
${type === 'report' ? 'Incident report template' : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: hsePrompt }],
    });

    const document = completion.choices[0].message.content;
    res.status(200).json({ hseDoc: document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'HSE generation failed' });
  }
}

