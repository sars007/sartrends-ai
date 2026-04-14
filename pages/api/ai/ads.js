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

  const { prompt, type = '2d' } = req.body; // '2d', '3d'
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt required' });
  }

  try {
    const model = type === '3d' ? 'gpt-4o-mini' : 'gpt-4o-mini';
    const adPrompt = `Generate a ${type} ad creative for trucking/dispatch business. 
Prompt: ${prompt}

Return:
1. Detailed image description (for DALL-E)
2. Ad copy/headline
3. Call to action
4. Color scheme
5. Dimensions suggestions

Format as JSON.`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: adPrompt }],
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ ad: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ad generation failed' });
  }
}

