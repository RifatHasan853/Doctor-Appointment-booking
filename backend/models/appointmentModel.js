import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({
    userId: {
      type: String,
      ref: "user", // Reference to User model
      required: true,
    },
    doctorId: {
      type:String,
      ref: "doctor", // Reference to Doctor model
      required: true,
    },
    slotDate:{
      type:String,
      required:true
    },
    slotTime:{
      type:String,
      required:true
    },
    userData:{
      type:Object,
      required:true
    },
    doctorData:{
      type:Object,
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
    date:{
      type:Number,
      required:true
    },
    cancelled:{
      type:Boolean,
      default:false
    },
    payment:{
      type:Boolean,
      default:false
    },
    isCompleted:{
      type:Boolean,
      default:false
    },
  })
  const appointmentModel =mongoose.models.appointment ||  mongoose.model("appointment", appointmentSchema);
  export default appointmentModel;