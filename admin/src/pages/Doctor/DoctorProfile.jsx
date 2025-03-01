

import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

function DoctorProfile() {
  const { setProfileData, profileData, getProfile, dToken,backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (dToken) {
      getProfile();
    }
  }, [dToken]);
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setEdit(false)
        getProfile()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      //console.log(error);
    }
  };
  return (
    profileData && (
      <div className="flex flex-col gap-4 m-5">
        <div>
          <div>
            <img
              className="bg-primary/80 w-full rounded-lg sm:max-w-64"
              src={profileData.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg px-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 text-sm border  rounded-full">
                {profileData.experience}
              </button>
            </div>
            {/* about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-700 mt-3">
                About:{" "}
              </p>
              <p className="text-sm text-gray-700 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fees : &nbsp;
              <span className="text-gray-800">
                {currency} &nbsp;
                {edit ? (
                  <input
                    className="px-2"
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
          </div>
          <div className="flex gap-2 py-2 px-8">
            <p>Address:</p>
            <div className="flex flex-col gap-y-4 ml-2">
              <p className="text-sm ">
                {edit ? (
                  <input
                    className="px-2 py-1"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
              </p>
              <p className="text-sm ">
                {edit ? (
                  <input
                    className="px-2 py-1"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-1 pt-2 px-8">
            <input
              onChange={() =>
                edit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              checked={profileData.available}
              type="checkbox"
            />
            <label htmlFor="">Avaliable</label>
          </div>
          {edit ? (
            <button
              onClick={updateProfile}
              className="px-8 py-2 border border-primary text-sm rounded-full mt-6 hover:bg-primary hover:text-white transition-all"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-8 py-2 border border-primary text-sm rounded-full mt-6 hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
}

export default DoctorProfile;
