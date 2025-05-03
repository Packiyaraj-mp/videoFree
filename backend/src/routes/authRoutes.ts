import express from 'express';
import {AuthenticateController, LoginController, RegisterController, ResetEmailCodeVerifyController, ResetPasswordController, ResetPasswordReqController } from '../controllers/authController';
import { loginValidation, registerValidation, resetEmailCodeVerifyValidation, resetPasswordReqValidation, resetPasswordValidation } from '../middileWare/ValidationHandler';
import validateRequest from '../middileWare/ValidateRequest';
import { authenticateMiddle } from '../middileWare/Authenticate';
const router=express.Router();

router.route('/register').post(registerValidation,validateRequest,RegisterController);
router.route('/login').post(loginValidation,validateRequest,LoginController);
router.route('/authenticate').get(authenticateMiddle,AuthenticateController);
router.route('/resetPasswordReq').post(resetPasswordReqValidation,validateRequest, ResetPasswordReqController);
router.route('/resetEmailCodeVerify').post(resetEmailCodeVerifyValidation,validateRequest,ResetEmailCodeVerifyController);
router.route('/resetPassword').post(resetPasswordValidation,validateRequest,ResetPasswordController);
export default router;
