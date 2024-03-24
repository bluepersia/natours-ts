import express from 'express';
const router = express.Router ();
import bookingController = require('../controller/bookingController');
import authController = require ('../controller/authController')

router.use (authController.protect);

router.get ('/bookings', bookingController.getMyBookings);

router.get ('/stripe-checkout', bookingController.getStripeCheckoutSession);

router.use (authController.restrictTo ('lead-guide', 'admin'));

router.route ('/').get (bookingController.getAllBookings).post (bookingController.createBooking);
router.route ('/:id').get (bookingController.getBooking).patch (bookingController.updateBooking).delete (bookingController.deleteBooking);

export default router;