// pages/api/book-container.ts - API endpoint for container bookings
import { createBookingHandler } from '../../lib/bookingHandler';

export default createBookingHandler({
  serviceType: 'containers',
  label: 'container',
  detailField: 'containerSize',
});
