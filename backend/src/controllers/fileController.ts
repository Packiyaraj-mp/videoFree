import {Request,Response,NextFunction} from 'express';
import { AsyncHandler } from '../middileWare/AsyncHandler';
import AWS from 'aws-sdk';
import getEnv from '../../config/getEnv';
import GlobalErrorClass from '../utils/GlobalError';
import User from '../models/ModelShema/authShema';

const s3=new AWS.S3({
    accessKeyId:getEnv('AWS_ACCESS_KEY'),
    secretAccessKey:getEnv('AWS_SECRET_KEY'),
    region:'us-east-1'
});

export const uploadProfileController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
const file=req.file;
const {email,id}=(req as any).user;

if(!file){
 return next(new GlobalErrorClass('file is empty',400))
}

const fileKey=`profile-pics/${Date.now()}_${file?.originalname}`;
const uploadParams:AWS.S3.PutObjectRequest={
    Bucket:process.env.AWS_S3_BUCKET_NAME!,
    Key:fileKey,
    Body:file?.buffer,
    ContentType:file?.mimetype,
    ACL:'private'
};

await s3.upload(uploadParams).promise()

const signedUrl=s3.getSignedUrl('getObject',{
    Bucket:process.env.AWS_S3_BUCKET_NAME!,
    Key:fileKey,
    Expires:300
});

await User.findOneAndUpdate({email},{$set:{profileUrl:fileKey}});

res.status(200).json({
    profileUrl:signedUrl,
    status:true
})

});