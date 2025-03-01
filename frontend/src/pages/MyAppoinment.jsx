import { useContext, useEffect, useState } from "react";
import { AppContext } from '../context/AppContext';
import { toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from "react-router-dom";

// Add stripePromise outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function MyAppoinment() {
  const months = [
    "",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "Invalid Date";
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) return "Invalid Date Format";
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const [appointments, setAppointments] = useState([]);
  
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments([...data.appointments].reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
     // console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, cancelled: true }
            : appointment
        )
      );

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      //console.log(error);
      toast.error(error.message);
    }
  };
// Stripe payment handler
const appointmentStripe = async (appointmentId) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      toast.error("Stripe failed to initialize");
      return;
    }

    const { data } = await axios.post(
      backendUrl + "/api/user/payment-stripe",
      { appointmentId },
      { headers: { token } }
    );

    if (data.success) {
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (!error) {
        // Ensure appointments update after payment
        await getUserAppointments();
      } else {
        toast.error("Payment failed");
        console.error(error);
      }
    }
  } catch (error) {
    //console.log(error);
    toast.error(error.response?.data?.message || "Payment error");
  }
};

useEffect(() => {
  const query = new URLSearchParams(window.location.search);

  const verifyPayment = async (sessionId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/verify-payment",
        { sessionId },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success("Payment verified!");
        getUserAppointments();
      }
    } catch (error) {
      toast.error("Payment verification failed");
    }
  };

  if (query.get("success")) {
    const sessionId = query.get("session_id");
    if (sessionId) {
      verifyPayment(sessionId);
    }
    navigate("/my-appointments", { replace: true });
  }

  if (query.get("canceled")) {
    toast.error("Payment canceled");
    navigate("/my-appointments", { replace: true });
  }
}, [navigate]); 

// Initial load
useEffect(() => {
  if (token) {
    getUserAppointments();
  }
}, [token,backendUrl]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointment</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.doctorData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-300">
              <p className="text-neutral-800 font-semibold">{item.doctorData.name}</p>
              <p>{item.doctorData.speciality}</p>
              <p className="text-zinc-800 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.doctorData.address.line1}</p>
              <p className="text-xs">{item.doctorData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time</span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && <button className="sm:min-w-48 py-2 border bg-indigo-50 rounded text-gray-500">Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button onClick={()=>appointmentStripe(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Online
                </button>
              )}
              {!item.cancelled  && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted &&(
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment Cancelled
                </button>
              )}
               {item.isCompleted &&(
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppoinment;
