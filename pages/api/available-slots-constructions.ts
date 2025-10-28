// pages/api/available-slots-constructions.ts - Get available time slots for constructions
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

    // Get available slots for constructions
    const availableSlots = await getAvailableSlots(date, { start: 6, end: 20 }, 0.5, 'constructions');

    res.status(200).json({
      success: true,
      date,
      serviceType: 'constructions',
      availableSlots
    });

  } catch (error: any) {
    console.error('Error fetching construction available slots:', error);
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
