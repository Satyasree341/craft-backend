const { calculatePrice } = require('../services/pricingService');
const { isConflict } = require('../services/bookingService');

// Temporary in-memory storage for bookings
let bookings = [];

// ===================== CREATE BOOKING =====================
exports.createBooking = (req, res) => {
  const { roomId, userName, startTime, endTime } = req.body;

  // Validate basic fields
  if (!roomId || !userName || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({ error: 'Invalid time range' });
  }

  // Check conflict
  if (isConflict(roomId, start, end, bookings)) {
    return res.status(400).json({ error: 'Room already booked for selected time' });
  }

  // Calculate price
  const totalPrice = calculatePrice(start, end, roomId);

  const newBooking = {
    id: Date.now().toString(),
    roomId,
    userName,
    startTime: start,
    endTime: end,
    totalPrice,
    status: "CONFIRMED"
  };

  bookings.push(newBooking);

  res.json(newBooking);
};

// ===================== GET ALL BOOKINGS =====================
exports.getBookings = (req, res) => {
  res.json(bookings);
};

// ===================== CANCEL BOOKING =====================
exports.cancelBooking = (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const now = new Date();
  const startTime = new Date(booking.startTime);

  // Only allow cancellation > 2 hours before start
  if ((startTime - now) / (1000 * 60 * 60) < 2) {
    return res.status(400).json({ error: 'Cannot cancel within 2 hours of start time' });
  }

  booking.status = 'CANCELLED';
  res.json({ message: 'Booking cancelled successfully', booking });
};

// ===================== ANALYTICS =====================
exports.getAnalytics = (req, res) => {
  const { from, to } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);
   toDate.setHours(23, 59, 59, 999);

  const confirmedBookings = bookings.filter(b => 
    b.status === 'CONFIRMED' &&
    new Date(b.startTime) >= fromDate &&
    new Date(b.endTime) <= toDate
  );

  const analytics = {};

  confirmedBookings.forEach(b => {
    if (!analytics[b.roomId]) {
      analytics[b.roomId] = { roomId: b.roomId, totalHours: 0, totalRevenue: 0 };
    }

    const hours = (new Date(b.endTime) - new Date(b.startTime)) / (1000 * 60 * 60);
    analytics[b.roomId].totalHours += hours;
    analytics[b.roomId].totalRevenue += b.totalPrice;
  });

  res.json(Object.values(analytics));
};
