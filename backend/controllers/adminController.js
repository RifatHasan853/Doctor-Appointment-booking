import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import jwt from 'jsonwebtoken'
import validator from "validator"
//import doctorModel from "../models/doctorModel.js"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from '../models/appointmentModel.js'
import userModel from "../models/userModel.js"


//api for adding doctors
const addDoctor= async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imageFile=req.file
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false ,message:"Missing details"}) 
        }
           
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }
        //hasing doctor password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        //upload image 
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl= imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
        const newDoctor=new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor Added"})

    
    }
    
   
    
    catch(error){
    //    console.log(error)
        res.json({success:false,message:error.message})

    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
      //  console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to get all doctor list for admin panel
const allDoctors = async (req, res) => {
    try {
      const doctors = await doctorModel.find({}).select("-password");
      res.json({ success: true, doctors });
    } catch (error) {
      //console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  //api to get all appointments list
  const appointmentsAdmin = async(req,res) =>{
    try {
      const appointments = await appointmentModel.find({}).populate("userId")
      .populate("doctorId");
      res.json({success:true,appointments})
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

// API to cancel an appointment
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Check if appointment exists
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing the booked slot for the doctor
        const { doctorId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(doctorId);

        if (doctorData) {
            let slotsBooked = doctorData.slots_booked || {};
            if (slotsBooked[slotDate]) {
                slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e !== slotTime);
            }

            await doctorModel.findByIdAndUpdate(doctorId, { slots_booked: slotsBooked });
        }

        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
const adminDashboard = async (req, res) => {
    try {
      const doctors = await doctorModel.find({});
      const users = await userModel.find({});
      const appointments = await appointmentModel.find({});
  
      const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments.reverse().slice(0, 5),
      };
      res.json({ success: true, dashData });
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
export { addDoctor, allDoctors, loginAdmin,appointmentsAdmin,appointmentCancel,adminDashboard }
