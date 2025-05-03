import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const FriendRequestSchema: Schema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Optional: Ensure sender-receiver pair is unique
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FrdReqModel = mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);

export default FrdReqModel;
