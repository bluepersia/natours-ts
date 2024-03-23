import express from 'express';
const router = express.Router ();
import tourController = require ('../controller/tourController');

router.route ('/').get (tourController.getAllTours).post (tourController.createTour);
router.route ('/:id').get (tourController.getTour).patch (tourController.updateTour).delete (tourController.deleteTour);


export default router;