// pages/api/book-construction.ts - API endpoint for construction bookings
import { createBookingHandler } from '../../lib/bookingHandler';

export default createBookingHandler({
  serviceType: 'constructions',
  label: 'construction',
  detailField: 'constructionType',
});
