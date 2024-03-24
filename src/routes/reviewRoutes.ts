import express from 'express';
const router = express.Router ();
import authController = require ('../controller/authController');
import reviewController = require ('../controller/reviewController');
import { setMine } from '../controller/factory';

router.use (authController.protect);

router.route ('/').get (reviewController.getAllReviews).post (setMine, reviewController.createReview);
router.route ('/:id').get (reviewController.getReview).patch (reviewController.isMine, reviewController.updateReview).delete (reviewController.isMine, reviewController.deleteReview);


export default router;