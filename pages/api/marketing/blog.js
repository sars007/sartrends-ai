import OpenAI from 'openai';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];
  const admin = verifyToken(token);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  try {
    const { title, topic } = req.body;

    const prompt = `Write a 800-1200 word blog post about trucking/dispatch industry topic: "${topic}".
    
Structure:
- Engaging title: "${title || 'Trucking Tips'}"
- Introduction with hook
- 4-6 subheadings
- Practical advice
- SEO keywords: trucking, dispatch, freight, loads
- Call to action: Visit sartrends.ai for AI tools
- Professional tone

Return ONLY markdown content, no JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0].message.content;

    const slug = title?.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') || 'blog-' + Date.now();

    const blog = await prisma.blogPost.create({
      data: {
        title: title || 'AI Trucking Blog',
        content,
        slug,
        published: true,
      }
    });

    res.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Blog generation failed' });
  }
}

