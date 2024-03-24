import express from 'express';
const router = express.Router ();
import revieRouter from './reviewRoutes';
import tourController = require ('../controller/tourController');

router.use ('/tourId/reviews', revieRouter);

router.route ('/').get (tourController.getAllTours).post (tourController.createTour);
router.route ('/:id').get (tourController.getTour).patch (tourController.updateTour).delete (tourController.deleteTour);


export default router;