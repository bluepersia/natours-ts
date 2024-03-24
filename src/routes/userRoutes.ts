import express from 'express';
const router = express.Router ();
import reviewRouter from './reviewRoutes';
import authController = require ('../controller/authController');
import userController = require ('../controller/userController');
import multer from 'multer';
const upload = multer ();

router.use ('/userId/reviews', reviewRouter);

router.post ('/sign-up', upload.none(), authController.signup);
router.post ('/login', upload.none(), authController.login);

router.post ('/forgot-password', upload.none(), authController.forgotPassword);
router.patch ('/reset-password', upload.none (), authController.resetPassword);

router.use (authController.protect);

router.patch ('/update-password', upload.none(), authController.updatePassword);
router.patch ('/update-me', upload.none(), userController.updateMe);
router.get ('/me', upload.none(), userController.me);

router.use (authController.restrictTo ('admin'));

router.route ('/').get (userController.getAllUsers).post (userController.createUser);
router.route ('/:id').get (userController.getUser).patch (userController.uploadPhoto, userController.processPhoto, userController.updateUser).delete (userController.deleteUser);

export default router;