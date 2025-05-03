import jwt from 'jsonwebtoken';
import getEnv from '../../config/getEnv';
import { AsyncHandler } from './AsyncHandler';
import {Request,Response,NextFunction} from 'express';
import GlobalErrorClass from '../utils/GlobalError';

export const authenticateMiddle=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const token=req.headers.authorization;

if(token){
const isValidToken=jwt.verify(token,getEnv('JWT_SECRET_KEY'));
if(isValidToken){
    (req as any).user=isValidToken;
     next()
}
}else{
   return next(new GlobalErrorClass('Token is required',500))
}

});