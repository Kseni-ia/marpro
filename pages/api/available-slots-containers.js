// pages/api/available-slots-containers.js - Get available time slots for containers
import { getAvailableSlots } from '../../lib/calendar';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // Get available slots for containers
    const availableSlots = await getAvailableSlots(date, { start: 6, end: 20 }, 0.5, 'containers');

    res.status(200).json({
      success: true,
      date,
      serviceType: 'containers',
      availableSlots
    });

  } catch (error) {
    console.error('Error fetching container available slots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available slots',
      details: error.message 
    });
  }
}
