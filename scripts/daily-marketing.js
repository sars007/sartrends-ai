const cron = require('node-cron');
const fetch = require('node-fetch');

console.log('Daily Marketing Cron Started');

// Daily blog post at 9AM
cron.schedule('0 9 * * *', async () => {
  console.log('Generating daily blog...');
  try {
    const res = await fetch('http://localhost:3000/api/marketing/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ADMIN_TOKEN_HERE' // Replace with admin token
      },
      body: JSON.stringify({
        title: 'Daily Trucking Update',
        topic: 'Latest freight rates and dispatch tips'
      })
    });

    if (res.ok) console.log('Daily blog generated');
  } catch (e) {
    console.error('Blog cron failed', e);
  }
});

// Weekly newsletter at Monday 10AM
cron.schedule('0 10 * * 1', async () => {
  console.log('Sending weekly newsletter...');
  // Get recent blogs
  // Send to all users
  // Use /api/marketing/email
});

console.log('Crons scheduled');

