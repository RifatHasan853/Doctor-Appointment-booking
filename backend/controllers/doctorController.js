import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // Check if the doctor exists
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Toggle availability
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true } // Ensures we get the updated document
    );

    res.status(200).json({ success: true, message: "Availability changed", data: updatedDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password -email"]);
    // console.log(doctors)
    res.json({ success: true, doctors });
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      res.json({ success: false, message: "Invalid Credentials" });
    } else {
      const token = jwt.sign({ id:doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const appointmentsDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentModel.find({ doctorId });
    // console.log(appointments)
    res.json({ success: true, message: appointments });
  } catch (error) {
    //console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    //console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const doctorDashboard = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentModel.find({ doctorId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    return res.json({ success: true, dashData });
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const profileData = await doctorModel
      .findById(doctorId)
      .select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(doctorId, { fees, address, available });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { changeAvailability,doctorList,loginDoctor,updateDoctorProfile,doctorProfile,doctorDashboard ,appointmentsDoctor,appointmentCancel,appointmentComplete};

