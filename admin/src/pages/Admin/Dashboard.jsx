import { useContext, useEffect } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashboardData, dashData, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashboardData();
    }
  }, [aToken, getDashboardData]);

  if (!dashData) return null; // Ensures the component doesn't render if data isn't available

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="Doctor icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.doctors}
            </p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>
        <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all">
          <img
            className="w-14"
            src={assets.appointments_icon}
            alt="Appointments icon"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>
        <div className="flex items-center min-w-52 bg-white gap-2 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="Patients icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 p-4 rounded-t border">
          <img src={assets.list_icon} alt="List icon" />
          <p className="font-semibold">Latest Booking</p>
        </div>
        <div className="border border-t-0 pt-4">
          {dashData?.latestAppointments?.map((item) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              key={item._id}
            >
              <img
                className="w-10 rounded-full"
                src={item.doctorData?.image}
                alt="Doctor profile"
              />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.doctorData?.name}</p>
                <p className="text-gray-600">
                  {slotDateFormat(item.slotDate)}
                </p>
              </div>
              {item.cancelled ? (
                <p className="font-medium text-xs text-red-500">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="font-medium text-xs text-green-500">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel appointment icon"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
