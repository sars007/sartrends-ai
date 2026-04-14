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

  const { details, jobTitle, company } = req.body;
  if (!details || !jobTitle || !company) {
    return res.status(400).json({ message: 'Details, jobTitle, company required' });
  }

  try {
    const prompt = `Write a compelling cover letter for ${jobTitle} at ${company}.
User experience: ${details}. 
Structure: Introduction, Body (highlight skills), Conclusion. Professional tone.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = completion.choices[0].message.content;
    res.status(200).json({ coverLetter: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Cover letter generation failed. Check OpenAI key.' });
  }
}

