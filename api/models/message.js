import mongoose from "mongoose";

const messageScheam = new mongoose.Schema({
  sender:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
  },
  receiver : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  content : {
    type : String,
    required : true
  }
},
{timestamps: true})

const Message = mongoose.model('Message', messageScheam)

export default Message