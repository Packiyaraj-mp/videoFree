import express from 'express';
import multer from 'multer';
import {  FriendsSearchController,FriendReqController, FriendReqGetController, FriendReqAcceptController, FriendsGetController} from '../controllers/friendsController';
import { authenticateMiddle } from '../middileWare/Authenticate';

const router=express.Router();

const storage=multer.memoryStorage();
const upload=multer({storage});

router.route('/search').get(authenticateMiddle,FriendsSearchController);
router.route('/frdRequest').get(authenticateMiddle,FriendReqController);
router.route('/getFrdRequest').get(authenticateMiddle,FriendReqGetController);
router.route('/acceptFrdReq').post(authenticateMiddle,FriendReqAcceptController);
router.route('/getFriends').get(authenticateMiddle,FriendsGetController);

export default router;