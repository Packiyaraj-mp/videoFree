import {Request,Response,NextFunction} from 'express';
import { AsyncHandler } from '../middileWare/AsyncHandler';
import User from '../models/ModelShema/authShema';
import GlobalErrorClass from '../utils/GlobalError';
import jwt from 'jsonwebtoken';
import getEnv from '../../config/getEnv';
import mailer from 'nodemailer';
import AWS from 'aws-sdk';

const s3=new AWS.S3({
    accessKeyId:getEnv('AWS_ACCESS_KEY'),
    secretAccessKey:getEnv('AWS_SECRET_KEY'),
    region:'us-east-1'
});

export const RegisterController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const {name,email,password}=req.body;
const isUser=await User.findOne({email:email});
if(isUser){
    return next(new GlobalErrorClass('User already exist',500))
}
const newUser=await User.create({
    name,
    email,
    password
});

res.status(200).json({
    msg:'successfully user created',
    status:true
});

});

export const LoginController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const {email,password}=req.body;
const isUser=await User.findOne({email:String(email).toLowerCase()});
if(!isUser){
return next(new GlobalErrorClass('User does not exist',500))
}
const isMatch=await isUser.comparePassword(password);

if(!isMatch){
   return next(new GlobalErrorClass('Invalid password',500))
}
// generate token
const token= isUser.get_jwt_token();
let profileUrl=null
if(isUser.profileUrl!==null){
const signedUrl=s3.getSignedUrl('getObject',{
    Bucket:process.env.AWS_S3_BUCKET_NAME!,
    Key:isUser.profileUrl,
    Expires:300
});
if(signedUrl){
    profileUrl=signedUrl
}
}

//  send success response
if(token){
res.status(200).json({
    token,
    user:{
    name:isUser.name,
    email:isUser.email,
    userId:isUser._id,
    profileUrl
    }
})
};

});
export const AuthenticateController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,id}=(req as any).user;
    const isUser=await User.findById(id);
    if(!isUser){
     return next(new GlobalErrorClass('user does not exist with this token',400))
    }
    let profileUrl=null
    if(isUser.profileUrl!==null){
    const signedUrl=s3.getSignedUrl('getObject',{
        Bucket:process.env.AWS_S3_BUCKET_NAME!,
        Key:isUser.profileUrl,
        Expires:300
    });
    if(signedUrl){
        profileUrl=signedUrl
    }
    }
    res.status(200).json({
        name:isUser?.name,
        email:isUser?.email,
        userId:isUser?._id,
        profileUrl
    });
    
});

export const ResetPasswordReqController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email}=req.body;
    
    const isUser=await User.findOne({email});
    if(!isUser){
     return next(new GlobalErrorClass('user does not exist',400))
    }
    // token generating
    const code=Math.floor(100000+Math.random()*900000).toString();
    const expiryTime=new Date(Date.now()+2*60*1000);
    isUser.resetCode=code;
    isUser.resetCodeExpiry=expiryTime;
    await isUser.save();
    
    // send code to email
    const transporter=mailer.createTransport({
        service:'gmail',
        auth:{
            user:'janshi1520@gmail.com',
            pass:'dqsppgqrikjkgmgz'
        }
    });

    await transporter.sendMail({
    to:email,
    subject:'Your Reset Code',
    text:`Your reset code is ${code}`
    })

    // response request
    res.status(200).json({
     status:true,
     email:isUser.email
    });
});

export const ResetEmailCodeVerifyController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const {email,code}=req.body;
const isUser=await User.findOne({email});

if(!email || !code){
    return next(new GlobalErrorClass('Required valid data',500))
};

// here nexted if conditions applied
if(isUser){
if(isUser.resetCode && isUser.resetCodeExpiry){
if(isUser.resetCode==code && isUser.resetCodeExpiry>new Date(Date.now())){
    const token=isUser.get_jwt_token();
    isUser.resetCodeExpiry=null;
    isUser.resetCode=token;
    await isUser.save();
    res.status(200).json({token,email:isUser.email,status:true});

}else{
    return next(new GlobalErrorClass('not valid or expired code',500))
}
}else{
    return next(new GlobalErrorClass('User did not give proper reset permission',500))
}
}else{
    return next(new GlobalErrorClass('User does not exist',400))
}
});

export const ResetPasswordController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const {password,confirmPassword,email,token}=req.body;

// check that there is all required inputs
if(!password&&!confirmPassword&&!email&&!token){
 return next(new GlobalErrorClass('Invalid request data',400))
}

// check it is valid token
const isValidToken=jwt.verify(token,getEnv('JWT_SECRET_KEY'));
const userId=JSON.parse(JSON.stringify(isValidToken));

if(userId.id){
 const isUser=await User.findById(userId.id);
 if(isUser){
    // send success response to clinets
    isUser.password=password;
    await isUser?.save();
    res.status(200).json({
        status:true,
        msg:'Password successfully updated you can login'
    });
 }else{
   return next(new GlobalErrorClass('User does not exist',500))
 }
}else{
  return next(new GlobalErrorClass('Invalid authentication',500))
}

});



