// lib/calendar.js - Google Calendar integration
import { google } from 'googleapis';

// Initialize Google Calendar with authentication
const getCalendar = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  
  return google.calendar({ version: 'v3', auth });
};

// Get calendar ID - simplified version for event creation
const getCalendarId = () => {
  return process.env.GOOGLE_CALENDAR_ID || 'primary';
};

// Get the correct calendar ID based on service type for availability checking
const getCalendarIdForService = (serviceType) => {
  let calendarId;
  switch (serviceType) {
    case 'containers':
      calendarId = process.env.GOOGLE_CALENDAR_ID_CONTAINERS || process.env.GOOGLE_CALENDAR_ID || 'primary';
      break;
    case 'excavators':
      calendarId = process.env.GOOGLE_CALENDAR_ID_EXCAVATORS || process.env.GOOGLE_CALENDAR_ID || 'primary';
      break;
    case 'constructions':
      calendarId = process.env.GOOGLE_CALENDAR_ID_CONSTRUCTIONS || process.env.GOOGLE_CALENDAR_ID || 'primary';
      break;
    default:
      calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  }
  console.log(`Calendar ID for ${serviceType}:`, calendarId);
  return calendarId;
};

// Get timezone
const getTimeZone = () => {
  return process.env.GOOGLE_TIME_ZONE || 'Europe/Prague';
};

// Check if a specific time slot is available
export async function checkAvailability(dateTime, durationHours = 1, serviceType = 'containers') {
  try {
    const calendar = getCalendar();
    const startTime = new Date(dateTime);
    const endTime = new Date(dateTime);
    endTime.setHours(endTime.getHours() + durationHours);
    
    // Buffer times in minutes
    const BUFFER_BEFORE_MINUTES = 60; // 1 hour buffer before
    const BUFFER_AFTER_MINUTES = 30; // 30 minute buffer after
    
    // Extend the search range to include buffer times
    const searchStart = new Date(startTime);
    searchStart.setMinutes(searchStart.getMinutes() - BUFFER_AFTER_MINUTES);
    
    const searchEnd = new Date(endTime);
    searchEnd.setMinutes(searchEnd.getMinutes() + BUFFER_BEFORE_MINUTES);

    const response = await calendar.events.list({
      calendarId: getCalendarIdForService(serviceType),
      timeMin: searchStart.toISOString(),
      timeMax: searchEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    // Check if any events conflict with the requested time slot (including buffers)
    const hasConflict = response.data.items?.some(event => {
      const eventStart = new Date(event.start.dateTime || event.start.date);
      const eventEnd = new Date(event.end.dateTime || event.end.date);
      
      // Check if the new booking would be too close to an existing event
      // New booking end should be at least 30 minutes before existing event start
      // New booking start should be at least 1 hour after existing event end
      
      const minGapBeforeEvent = new Date(eventStart);
      minGapBeforeEvent.setMinutes(minGapBeforeEvent.getMinutes() - BUFFER_AFTER_MINUTES);
      
      const minGapAfterEvent = new Date(eventEnd);
      minGapAfterEvent.setMinutes(minGapAfterEvent.getMinutes() + BUFFER_BEFORE_MINUTES);
      
      // Check if there's a conflict
      return endTime > minGapBeforeEvent && startTime < minGapAfterEvent;
    });
    
    return !hasConflict;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw new Error(`Failed to check availability: ${error.message}`);
  }
}

// Get available time slots for a specific date
export async function getAvailableSlots(date, workingHours = { start: 8, end: 18 }, slotDuration = 0.5, serviceType = 'containers') {
  try {
    const calendar = getCalendar();
    
    // Buffer times in minutes
    const BUFFER_BEFORE_MINUTES = 60; // 1 hour buffer before
    const BUFFER_AFTER_MINUTES = 30; // 30 minute buffer after
    
    // Set up the date range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(workingHours.start, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(workingHours.end, 0, 0, 0);

    // Get all events for the day
    const response = await calendar.events.list({
      calendarId: getCalendarIdForService(serviceType),
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const busySlots = response.data.items || [];
    const allSlots = [];

    // Generate all possible time slots (30-minute intervals)
    const totalMinutes = (workingHours.end - workingHours.start) * 60;
    const slotMinutes = slotDuration * 60;
    
    for (let minutes = 0; minutes < totalMinutes; minutes += slotMinutes) {
      const slotStart = new Date(date);
      const totalStartMinutes = workingHours.start * 60 + minutes;
      const startHour = Math.floor(totalStartMinutes / 60);
      const startMin = totalStartMinutes % 60;
      slotStart.setHours(startHour, startMin, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotMinutes);

      // Check if this slot conflicts with any busy periods (including buffer times)
      const isAvailable = !busySlots.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        // Add buffer times to the event
        const eventStartWithBuffer = new Date(eventStart);
        eventStartWithBuffer.setMinutes(eventStartWithBuffer.getMinutes() - BUFFER_BEFORE_MINUTES);
        
        const eventEndWithBuffer = new Date(eventEnd);
        eventEndWithBuffer.setMinutes(eventEndWithBuffer.getMinutes() + BUFFER_AFTER_MINUTES);
        
        // Check for overlap with buffered times
        return (slotStart < eventEndWithBuffer && slotEnd > eventStartWithBuffer);
      });

      const displayHour = startHour.toString().padStart(2, '0');
      const displayMin = startMin.toString().padStart(2, '0');
      allSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        displayTime: `${displayHour}:${displayMin}`,
        available: isAvailable
      });
    }

    return allSlots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw new Error(`Failed to get available slots: ${error.message}`);
  }
}

// Create a booking in the calendar
export async function createBooking(customerData, dateTime, durationHours = 1, serviceDetails = {}) {
  try {
    const calendar = getCalendar();
    const startTime = new Date(dateTime);
    const endTime = new Date(dateTime);
    endTime.setHours(endTime.getHours() + durationHours);

    // Build the event summary based on service type
    let summary = `${customerData.serviceType?.toUpperCase()} - ${customerData.firstName} ${customerData.lastName}`;
    
    // Build detailed description
    let description = `
=== CUSTOMER DETAILS ===
Name: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Phone: ${customerData.phone || 'N/A'}

=== SERVICE DETAILS ===
Service Type: ${customerData.serviceType}`;

    // Add service-specific details
    if (customerData.containerType) {
      description += `\nContainer Type: ${customerData.containerType}`;
      summary = `Container ${customerData.containerType} - ${customerData.firstName} ${customerData.lastName}`;
    }
    if (customerData.excavatorType) {
      description += `\nExcavator Type: ${customerData.excavatorType}`;
      summary = `Excavator ${customerData.excavatorType} - ${customerData.firstName} ${customerData.lastName}`;
    }
    if (customerData.constructionType) {
      description += `\nConstruction Type: ${customerData.constructionType}`;
      summary = `Construction ${customerData.constructionType} - ${customerData.firstName} ${customerData.lastName}`;
    }

    description += `

=== DELIVERY ADDRESS ===
${customerData.address}
${customerData.street ? customerData.street + '\n' : ''}${customerData.city}, ${customerData.zip}
${customerData.country}`;

    if (customerData.message) {
      description += `

=== ADDITIONAL NOTES ===
${customerData.message}`;
    }

    description = description.trim();

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: getTimeZone(),
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: getTimeZone(),
      },
      // Note: Service accounts cannot invite attendees without Domain-Wide Delegation
      // Customer email is included in the description instead
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    // Add location if available
    if (customerData.address) {
      event.location = `${customerData.address}, ${customerData.city}, ${customerData.zip}, ${customerData.country}`;
    }

    // Create event in the correct service-specific calendar with fallback
    const serviceCalendarId = getCalendarIdForService(customerData.serviceType);
    const fallbackCalendarId = getCalendarId(); // Main calendar as fallback
    
    console.log(`Creating event for ${customerData.serviceType} in calendar: ${serviceCalendarId}`);
    
    let response;
    try {
      response = await calendar.events.insert({
        calendarId: serviceCalendarId,
        resource: event,
      });
      console.log(`Successfully created ${customerData.serviceType} event: ${response.data.id}`);
    } catch (serviceError) {
      console.error(`Failed to create in ${customerData.serviceType} calendar: ${serviceError.message}`);
      console.log(`Attempting fallback to main calendar: ${fallbackCalendarId}`);
      
      response = await calendar.events.insert({
        calendarId: fallbackCalendarId,
        resource: event,
      });
      console.log(`Successfully created ${customerData.serviceType} event in fallback calendar: ${response.data.id}`);
    }

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

// Delete a booking from the calendar
export async function deleteBooking(eventId, serviceType = 'containers') {
  try {
    const calendar = getCalendar();
    
    await calendar.events.delete({
      calendarId: getCalendarIdForService(serviceType),
      eventId: eventId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
}

// Update an existing booking
export async function updateBooking(eventId, updates, serviceType = 'containers') {
  try {
    const calendar = getCalendar();
    
    // Get the existing event first
    const existingEvent = await calendar.events.get({
      calendarId: getCalendarIdForService(serviceType),
      eventId: eventId,
    });

    // Merge updates with existing event data
    const updatedEvent = {
      ...existingEvent.data,
      ...updates,
    };

    const response = await calendar.events.update({
      calendarId: getCalendarIdForService(serviceType),
      eventId: eventId,
      resource: updatedEvent,
    });

    return {
      success: true,
      event: response.data,
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw new Error(`Failed to update booking: ${error.message}`);
  }
}

// Check calendar connection status
export async function checkCalendarConnection(serviceType = 'containers') {
  try {
    const calendar = getCalendar();
    
    // Try to list a single event to verify connection
    await calendar.events.list({
      calendarId: getCalendarIdForService(serviceType),
      maxResults: 1,
    });

    return { connected: true };
  } catch (error) {
    console.error('Calendar connection error:', error);
    return { connected: false, error: error.message };
  }
}
