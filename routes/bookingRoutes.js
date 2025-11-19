const express = require('express');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

const {
  //createBooking,
  cancelBooking,
  getBookings,
  getAnalytics
} = require('../controllers/bookingController');


router.post('/', createBooking);

router.post('/:id/cancel', cancelBooking); // <- new
router.get('/', getBookings); // optional, to see all bookings
router.get('/analytics', getAnalytics);

module.exports = router;
