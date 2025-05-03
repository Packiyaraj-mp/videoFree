import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import getEnv from '../../../config/getEnv';
import jwt from 'jsonwebtoken';

// 1. Define the TypeScript interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    resetCode:string;
    resetCodeExpiry:Date | null;
    profileUrl:string | null;
    comparePassword(candidatePassword:string):Promise<boolean>;
    get_jwt_token():string
   
 };

const authShema=new Schema<IUser>({
name:String,
email:{
  type:String,
  unique:true
},
password:String,
resetCode:String || null,
resetCodeExpiry:Date || null,
profileUrl:{
  type:String || null,
  default:()=>null
}
},{timestamps:true});


// hash password
authShema.pre('save',async function(next){
if(!this.isModified('password')){
  next()
}
  const salt=await bcrypt.genSalt(10);
  const hashPassword= await bcrypt.hash(this.password,salt);
  this.password=hashPassword;
});

authShema.pre('save',function(next){
  this.email=this.email.toLowerCase();
  next()
});


authShema.methods.comparePassword=function(candidatePassword:string):Promise<boolean>{
return bcrypt.compare(candidatePassword,this.password)
};

authShema.methods.get_jwt_token=function():string{
return jwt.sign({id:this._id,email:this.email},getEnv('JWT_SECRET_KEY'),{expiresIn:'7d'})
};


const User=mongoose.model('Auth',authShema);
export default User;