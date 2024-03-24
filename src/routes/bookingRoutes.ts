import express from 'express';
const router = express.Router ();
import bookingController = require('../controller/bookingController');
import authController = require ('../controller/authController')

router.use (authController.protect);

router.get ('/stripe-checkout', bookingController.getStripeCheckoutSession);

export default router;