import express from 'express';
import multer from 'multer';
import { uploadProfileController } from '../controllers/fileController';
import { authenticateMiddle } from '../middileWare/Authenticate';

const router=express.Router();

const storage=multer.memoryStorage();
const upload=multer({storage});

router.route('/profileUpload').post(authenticateMiddle,upload.single('profile'),uploadProfileController);

export default router;
