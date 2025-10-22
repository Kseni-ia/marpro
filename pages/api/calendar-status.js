// pages/api/calendar-status.js - Check Google Calendar connection status
import { checkCalendarConnection } from '../../lib/calendar';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const status = await checkCalendarConnection();
    
    res.status(200).json({
      connected: status.connected,
      message: status.connected 
        ? 'Google Calendar is connected and ready' 
        : 'Google Calendar is not connected',
      error: status.error
    });
  } catch (error) {
    console.error('Calendar status check error:', error);
    res.status(500).json({ 
      connected: false,
      error: 'Failed to check calendar status',
      details: error.message 
    });
  }
}
