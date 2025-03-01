import validator from 'validator'
import bcrypt from "bcryptjs";
//import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.json({ success: false, message: "Missing Credentials" });
      }
      if (!validator.isEmail(email)) {
        res.json({ success: false, message: "Enter a valid email" });
      }
      if (password.length < 6) {
        return res.json({
          success: false,
          message: "Please enter a strong password with at least 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const userData = {
        name,
        email,
        password: hashedPassword,
      };
      const newUser = new userModel(userData);
      const user = await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "uesr does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.json({ success: false, message: "Invalid Credentials" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
      }
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
const getProfile = async (req, res) => {
    try {
      const { userId } = req.body;
      const userData = await userModel.findById(userId).select("-password");
      res.json({ success: true, userData });
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  const updateProfile = async (req, res) => {
    try {
      const userId = req.user?.id || req.body.userId;
      if (!userId) {
        return res.json({ success: false, message: "Unauthorized" });
      }
  
      const { name, phone, address, dob, gender } = req.body;
      const imageFile = req.file;
  
      if (!name || !dob || !phone || !gender) {
        return res.json({ success: false, message: "Missing Information" });
      }
  
      let parsedAddress;
      try {
        parsedAddress = address ? JSON.parse(address) : {};
      } catch (error) {
        return res.json({ success: false, message: "Invalid address format" });
      }
  
      await userModel.findByIdAndUpdate(userId, {
        name,
        phone,
        address: parsedAddress,
        gender,
        dob,
      });
  
      if (imageFile) {
        try {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
          });
          const imageUrl=imageUpload.secure_url
  
          await userModel.findByIdAndUpdate(userId, {
            image: imageUpload.secure_url,
          });
        } catch (error) {
          return res.json({ success: false, message: "Image upload failed" });
        }
      }
  
      return res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
      //console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };

  const bookAppointment = async (req, res) => {
    try {
      const { userId, docId, slotTime, slotDate } = req.body;
      const doctorData = await doctorModel.findById(docId).select("-password");
      if (!doctorData) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      if (!doctorData.available) {
        return res.json({ success: false, message: "Doctor not available" });
      }
      let slots_booked = doctorData.slots_booked || {};
      if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
          return res.json({ success: false, message: "Slot not available" });
        } else {
          slots_booked[slotDate].push(slotTime);
        }
      } else {
        slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);
      }
      const userData = await userModel.findById(userId).select("-password");
      delete doctorData.slots_booked;
      const appointmentData = {
        userId,
        doctorId: docId,
        userData,
        doctorData,
        amount: doctorData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
      };
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots_booked });
      res.json({ success: true, message: "Appointment booked" });
    } catch (error) {
    //  console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  const listAppointment = async (req, res) => {
    try {
      const { userId } = req.body;
      const appointments = await appointmentModel.find({ userId });
      res.json({ success: true, appointments });
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  const cancelAppointment = async (req, res) => {
    try {
      const { userId, appointmentId } = req.body;
      const appointmentData = await appointmentModel.findById(appointmentId);
      
      if (!appointmentData) {
        return res.json({ success: false, message: "Appointment not found" });
      }
  
      if (appointmentData.userId.toString() !== userId) {
        return res.json({ success: false, message: "Unauthorized Access" });
      }
  
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
  
      const { doctorId, slotDate, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(doctorId);
  
      if (!doctorData) {
        return res.json({ success: false, message: "Doctor not found" });
      }
  
      let slots_booked = doctorData.slots_booked;
      if (slots_booked && slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
        await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
      }
  
      return res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
     // console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  const paymentStripe = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const appointment = await appointmentModel.findById(appointmentId);
  
      if (!appointment || appointment.cancelled) {
        return res.json({
          success: false,
          message: "Appointment cancelled or Not found",
        });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment Fee",
            },
            unit_amount: appointment.amount * 100,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/my-appointments?success=true&session_id={CHECKOUT_SESSION_ID}`,        cancel_url: `${process.env.FRONTEND_URL}/my-appointments?canceled=true`,
        metadata: { appointmentId: appointmentId.toString() },
      });
  
      res.json({ success: true, sessionId: session.id });
    } catch (error) {
      //console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const verifyPayment = async (req, res) => {
    try {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid') {
        await appointmentModel.findByIdAndUpdate(
          session.metadata.appointmentId,
          { payment: true }
        );
        return res.json({ success: true });
      }
      
      return res.json({ success: false, message: "Payment not completed" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };
  

  
   
  export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentStripe,verifyPayment}