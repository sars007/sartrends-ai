import nodemailer from 'nodemailer';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];
  const admin = verifyToken(token);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  try {
    const { to, subject, html } = req.body;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    await prisma.emailLog.create({
      data: {
        to,
        subject,
        status: 'sent',
      }
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    await prisma.emailLog.create({
      data: {
        to: to,
        subject,
        status: 'failed',
        error: error.message,
      }
    });
    res.status(500).json({ error: 'Email failed' });
  }
}

