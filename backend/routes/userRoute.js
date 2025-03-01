
import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile,bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyPayment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'




const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
// Stripe payment routes

// Add these routes
userRouter.post("/payment-stripe", authUser, paymentStripe);
// Add new route
userRouter.post('/verify-payment', authUser, verifyPayment);
export default userRouter  