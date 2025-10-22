// pages/api/test-calendar.js - Test calendar access and list calendars
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    
    const calendar = google.calendar({ version: 'v3', auth });

    // List all calendars the service account has access to
    const calendarList = await calendar.calendarList.list();
    
    const calendars = calendarList.data.items.map(cal => ({
      id: cal.id,
      summary: cal.summary,
      description: cal.description,
      accessRole: cal.accessRole,
      primary: cal.primary || false
    }));

    // Show environment variables (without sensitive data)
    const envInfo = {
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || 'Not set',
      GOOGLE_CALENDAR_ID_CONTAINERS: process.env.GOOGLE_CALENDAR_ID_CONTAINERS || 'Not set',
      GOOGLE_CALENDAR_ID_EXCAVATORS: process.env.GOOGLE_CALENDAR_ID_EXCAVATORS || 'Not set',
      GOOGLE_CALENDAR_ID_CONSTRUCTIONS: process.env.GOOGLE_CALENDAR_ID_CONSTRUCTIONS || 'Not set',
      SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'Not set'
    };

    res.status(200).json({
      success: true,
      message: 'Calendar access test successful',
      availableCalendars: calendars,
      environmentVariables: envInfo,
      totalCalendars: calendars.length
    });

  } catch (error) {
    console.error('Calendar test error:', error);
    res.status(500).json({ 
      error: 'Calendar test failed',
      details: error.message 
    });
  }
}
