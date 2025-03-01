import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../context/AppContext";


function AllAppointment() {
  const { aToken, appointments, getAllAppointments,cancelAppointment} =
    useContext(AdminContext);
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);
  return (
    <div className="max-w-6xl w-full m-5">
      <p className="mb-3 font-medium text-lg">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((appointment, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
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
            <p className="max-sm:hidden">
              {calculateAge(appointment.userData.dob)}
            </p>
            <p>
              {slotDateFormat(appointment.slotDate)},{appointment.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-12 object-fill rounded-full h-12"
                src={appointment.doctorData.image}
                alt=""
              />
              <p>{appointment.doctorData.name}</p>
            </div>
            <p>
              {currency}
              {appointment.amount}
            </p>
            {appointment.cancelled ? (
              <p className="font-medium text-xs text-red-500">Cancelled</p>
            ) : appointment.isCompleted ? (
              <p className="font-medium text-xs text-green-500">Completed</p>
            ) :(
              <img
                onClick={() => cancelAppointment(appointment._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointment