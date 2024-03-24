import express from 'express';
const router = express.Router ();
import authController = require ('../controller/authController');
import multer from 'multer';
const upload = multer ();

router.post ('/sign-up', upload.none(), authController.signup);
router.post ('/login', upload.none(), authController.login);

router.post ('/forgot-password', upload.none(), authController.forgotPassword);
router.patch ('/reset-password', upload.none (), authController.resetPassword);

router.patch ('/update-password', upload.none(), authController.updatePassword);

export default router;