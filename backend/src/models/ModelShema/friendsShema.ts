import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
    user:string,
    friendsList:mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const FriendsSchema: Schema = new Schema(
  {
   user:{type:String,required:true},
   friendsList:[{type:mongoose.Schema.ObjectId,ref:'Auth'}]
  },
  { timestamps: true }
);


const FriendsModel= mongoose.model<IFriendRequest>('Friend',FriendsSchema);
export default FriendsModel;


