import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";



function DoctorDashboard() {
  const {
    getDashData,
    dToken,
    dashData,
    setDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 p-4  mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Booking</p>
          </div>
          <div className="border border-t-0 pt-4">
            {dashData.latestAppointments.map((latest, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="w-10 rounded-full"
                  src={latest.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {latest.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(latest.slotDate)}
                  </p>
                </div>
                {latest.cancelled ? (
                  <p className="text-red-400 text-sm font-medium">Cancelled</p>
                ) : latest.isCompleted ? (
                  <p className="text-green-500 text-sm font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(latest._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                    />
                    <img
                      onClick={() => completeAppointment(latest._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default DoctorDashboard;
