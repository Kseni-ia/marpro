// pages/api/available-slots.js - API endpoint to get available time slots
import { getAvailableSlots } from '../../lib/calendar';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Accept date from either query params (GET) or body (POST)
    const date = req.method === 'GET' 
      ? req.query.date 
      : req.body.date;

    const serviceType = req.method === 'GET'
      ? req.query.serviceType || 'containers'
      : req.body.serviceType || 'containers';

    const workingHours = req.method === 'GET'
      ? { 
          start: parseInt(req.query.startHour) || 8, 
          end: parseInt(req.query.endHour) || 18 
        }
      : req.body.workingHours || { start: 8, end: 18 };

    const slotDuration = req.method === 'GET'
      ? parseInt(req.query.slotDuration) || 1
      : req.body.slotDuration || 1;

    // Validate date
    if (!date) {
      return res.status(400).json({ 
        error: 'Date is required' 
      });
    }

    // Parse and validate the date
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format' 
      });
    }

    // Don't allow checking dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(requestedDate);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) {
      return res.status(400).json({ 
        error: 'Cannot check availability for past dates' 
      });
    }

    // Get all slots with availability from calendar
    const allSlots = await getAvailableSlots(
      requestedDate, 
      workingHours, 
      slotDuration,
      serviceType
    );

    // If checking for today, mark past slots as unavailable
    const now = new Date();
    const processedSlots = allSlots.map(slot => {
      const slotTime = new Date(slot.start);
      // For today, mark past slots as unavailable
      if (checkDate.getTime() === today.getTime()) {
        // Add 1 hour buffer for booking
        if (slotTime <= new Date(now.getTime() + 60 * 60 * 1000)) {
          return { ...slot, available: false };
        }
      }
      return slot;
    });

    // Filter to get only available slots for backward compatibility
    const availableSlots = processedSlots.filter(slot => slot.available);

    res.status(200).json({
      success: true,
      date: requestedDate.toISOString().split('T')[0],
      allSlots: processedSlots,  // Include all slots with availability status
      availableSlots: availableSlots,  // Keep for backward compatibility
      totalSlots: availableSlots.length,
      workingHours,
      slotDuration
    });

  } catch (error) {
    console.error('Available slots error:', error);
    res.status(500).json({ 
      error: 'Failed to get available slots',
      details: error.message 
    });
  }
}
