// pages/api/available-slots-excavators.ts - Get available time slots for excavators
import { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableSlots } from '../../lib/calendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // Get available slots for excavators
    const availableSlots = await getAvailableSlots(date, { start: 6, end: 20 }, 0.5, 'excavators');

    res.status(200).json({
      success: true,
      date,
      serviceType: 'excavators',
      availableSlots
    });

  } catch (error: any) {
    console.error('Error fetching excavator available slots:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch available slots',
      details: error.message,
      hint: error.message.includes('Missing required environment variables') 
        ? 'Environment variables are not configured in Netlify. Please add them in Site configuration > Environment variables.'
        : 'Check server logs for more details.'
    });
  }
}
