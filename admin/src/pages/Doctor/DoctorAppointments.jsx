import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";


function DoctorAppointments() {
  const {
    dToken, getAppointments,completeAppointment,cancelAppointment,appointments
    
  } = useContext(DoctorContext);
  const { currency, calculateAge, slotDateFormat } = useContext(AppContext);
  // console.log(appointments);
  
  useEffect(() => {
    if (dToken) {
        getAppointments();
    }
  }, [dToken]);
  return (
    <div className="max-w-5xl w-full m-5">
      <p>All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.reverse().map((appointment, index) => (
          <div
            className="flex flex-wrap justify-between text-gray-500  border-b py-3 px-6 max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 items-center  hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-12 object-fill rounded-full h-12"
                src={appointment.userData.image}
                alt=""
              />
              <p>{appointment.userData.name}</p>
            </div>
            <div>
              <p className="inline border border-primary text-xs rounded-full px-2">
                {appointment.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">
              {calculateAge(appointment.userData.dob)}
            </p>
            <p>
              {slotDateFormat(appointment.slotDate)},{appointment.slotTime}
            </p>
            <p>
              {currency}
              {appointment.amount}
            </p>
            {appointment.cancelled ? (
              <p className="text-red-400 text-sm font-medium">Cancelled</p>
            ) : appointment.isCompleted ? (
              <p className="text-green-500 text-sm font-medium">Completed</p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => cancelAppointment(appointment._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                />
                <img
                  onClick={() => completeAppointment(appointment._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointments;
