import {NextFunction, Request,Response} from 'express';
import {validationResult} from 'express-validator';
import GlobalErrorClass from '../utils/GlobalError';
import { AsyncHandler } from './AsyncHandler';

const validateRequest=AsyncHandler((req:Request,res:Response,next:NextFunction)=>{
 const errors=validationResult(req);

 if(!errors.isEmpty()){
   return next(new GlobalErrorClass(errors.array({onlyFirstError:true})[0].msg,500))
 }
 next();

});

export default validateRequest;