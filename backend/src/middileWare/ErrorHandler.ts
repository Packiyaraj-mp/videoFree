import {Request,Response,NextFunction} from 'express';
import GlobalErrorClass from '../utils/GlobalError';
import mongoose from 'mongoose';

const ErrorHandler=(err:GlobalErrorClass,req:Request,res:Response,next:NextFunction)=>{
let message=err.message?err.message:'internal server error';
let statusCode=err.statusCode?err.statusCode:500;
console.log(err.message)
if(err.name==='ValidationError' && err instanceof mongoose.Error.ValidationError){
message=Object.values(err.errors)[0].message;
statusCode=500
};

if(err.name==='CastError'&& err instanceof mongoose.Error.CastError){
    statusCode=400,
    message=`Invalid ${err.path}:${err.value}`
};

if(err.name==='BcryptError' || err.message.includes('bcrypt')){
    statusCode=500,
    message='Password encryption error'
};

if(err.name==='JsonWebTokenError'){
    statusCode=500,
    message='Invalid Token'
};

if(err.name==='TokenExpiredError'){
    statusCode=500,
    message='Token Expired'
};

if((err as any).code===11000){
    statusCode=500,
    message='Dublicate key error'
};
if(err.message.includes('Salt')){
    message='Internal encryption errors',
    statusCode=500
}

res.status(statusCode).json({
    msg:message,
    success:false
})

};

export default ErrorHandler;