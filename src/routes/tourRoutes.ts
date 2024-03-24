import express from 'express';
const router = express.Router ();
import revieRouter from './reviewRoutes';
import tourController = require ('../controller/tourController');
import authController = require ('../controller/authController');

router.use ('/tourId/reviews', revieRouter);

router.route ('/').get (tourController.getAllTours).post (authController.protect, authController.restrictTo ('lead-guide', 'admin'), tourController.createTour);
router.route ('/:id').get (tourController.getTour).patch (authController.protect, authController.restrictTo ('lead-guide', 'admin'), tourController.updateTour).delete (authController.protect, authController.restrictTo ('lead-guide', 'admin'), tourController.deleteTour);


export default router;