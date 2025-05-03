import {Request,Response,NextFunction} from 'express';
import { AsyncHandler } from '../middileWare/AsyncHandler';
import User from '../models/ModelShema/authShema';

import AWS from 'aws-sdk';
import getEnv from '../../config/getEnv';
import FrdReqModel from '../models/ModelShema/friendsRequestSchema';
import GlobalErrorClass from '../utils/GlobalError';
import FriendsModel from '../models/ModelShema/friendsShema';


const s3=new AWS.S3({
    accessKeyId:getEnv('AWS_ACCESS_KEY'),
    secretAccessKey:getEnv('AWS_SECRET_KEY'),
    region:'us-east-1'
});
const getAWSsignedUrl=async(fileKey:string)=>{

  const signedUrl=s3.getSignedUrl('getObject',{
      Bucket:process.env.AWS_S3_BUCKET_NAME!,
      Key:fileKey,
      Expires:300
  });
  if(signedUrl){
      return signedUrl
  }
};

export const FriendsSearchController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{

const {page,text}=req.query;
console.log(page)
const {email,id}=(req as any).user;
const limit=8;

let skip=(Number(page)-1)*limit;
const users=await User.find({name:{$regex:text,$options:'i'},_id:{$ne:id}}).skip(skip).limit(limit).select('name _id email profileUrl').lean();
const userId=users.map(doc=>String(doc._id));

const isReq=await FrdReqModel.find({$or:[{sender:id,receiver:{$in:userId}},{receiver:id,sender:userId}]}).lean();

const resData = await Promise.all(
 users.map(async (data) =>
   ({
    name: data.name,
    email: data.email,
    userId: data._id,
    profileUrl: data.profileUrl
      ? await getAWSsignedUrl(data.profileUrl)
      : null,
    status:isReq.map(user=>{
      if(String(user.sender)==String(data._id)||String(user.receiver)==String(data._id)){
        return user.status
      }
    }).join("") || 'not'
    
  })
)

);

res.status(200).json({
  friends:resData
})
});

export const FriendReqController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const {data}=req.query;
  const {id,email}=(req as any).user;

 if(id==email){
 return next(new GlobalErrorClass('you cannot send request yourself',400));
 }
 const isReq=await FrdReqModel.findOne({$or:[{sender:id,receiver:data},{receiver:id,sender:data}]});
 if(isReq){
  return next(new GlobalErrorClass('already exist request',400));
 }
 
 const newUser=new FrdReqModel({
 sender:id,
 receiver:data
 });
 
await newUser.save();

res.status(200).json({
  senderId:data
});

});

export const FriendReqGetController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
 
   const {id,email}=(req as any).user;
   const {page}=req.query;
   const frdReqList=await FrdReqModel.find({receiver:id,status:{$ne:'accepted'}}).populate({path:'sender',select:'-password'});

   const requestList= await Promise.all(
    frdReqList.map(async(user:any)=>{
     return{
      name:user.sender.name,
      docId:user._id,
      senderId:user.sender._id,
      profileUrl:user.sender.profileUrl?await getAWSsignedUrl(user.sender.profileUrl):null
     }
      
    }));
    
    res.status(200).json({
      requestList
    })
   

});

export const FriendReqAcceptController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
 
const {sender,docId}=req.body;
const {id,email}=(req as any).user;
const isFriends=await FriendsModel.findOne({user:id});
const isSenderFrds=await FriendsModel.findOne({user:sender});

if(isFriends==null){
 const friendsList=await FriendsModel.create({
    user:id,
    friendsList:[sender]
  });
await FrdReqModel.updateOne({$or:[{sender:id,receiver:sender},{receiver:id,sender:sender}]},{$set:{status:'accepted'}});

}else{
  const updateSuccess=await FriendsModel.updateOne({user:id,friendsList:{$nin:sender}},{$push:{friendsList:sender}});
  
  if(!updateSuccess){
   return next(new GlobalErrorClass('not proper data',400))
  }
  await FrdReqModel.updateOne({$or:[{sender:id,receiver:sender},{receiver:id,sender:sender}]},{$set:{status:'accepted'}});
};

if(isSenderFrds==null){
  await FriendsModel.create({
     user:sender,
     friendsList:[id]
   });
 
 }else{
   const updateSuccess=await FriendsModel.updateOne({user:sender,friendsList:{$nin:id}},{$push:{friendsList:id}});
   
   if(!updateSuccess){
    return next(new GlobalErrorClass('not proper data',400))
   }
   await FrdReqModel.updateOne({$or:[{sender:id,receiver:sender},{receiver:id,sender:sender}]},{$set:{status:'accepted'}});
 };

res.status(200).json({
  docId
})

});

export const FriendsGetController=AsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
 
  const {id,email}=(req as any).user;
 
   const frds=await FriendsModel.findOne({user:id}).populate({
    path:'friendsList',
    options:{limit:10}
   }).lean();

   if(!frds){
   return next(new GlobalErrorClass('no friends',400))
   }
   
   const data = await Promise.all(
    (frds?.friendsList || []).map(async (item: any) => {
     
      const url = item?.profileUrl ? await getAWSsignedUrl(item.profileUrl) : null;
      return { profileUrl: url,name:item.name,userId:item._id };
    
    })
  );

  res.status(200).json({
    data
  })
  
   
});

