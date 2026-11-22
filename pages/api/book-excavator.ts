// pages/api/book-excavator.ts - API endpoint for excavator bookings
import { createBookingHandler } from '../../lib/bookingHandler';

export default createBookingHandler({
  serviceType: 'excavators',
  label: 'excavator',
  detailField: 'excavatorType',
});
