import { createContext } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

import { useState } from "react";
import { useEffect } from "react";

export const AppContext=createContext()

const AppContextProvider=(props)=>{
    const currencySymbol='$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

    const [userData, setUserData] = useState(false);

  
    
    const getDoctorsData = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/doctor/list");
        if (data.success) {
          setDoctors(data.doctors);
          // console.log(data.doctors)
        } else {
          toast.error(error.message);
        }
      } catch (error) {
        toast.error(error.message);
       // console.log(error);
      }
    }
    const loadUserProfileData = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
          headers: { token },
        });
        if (data.success) {
          setUserData(data.userData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
       // console.log(error);
      }
    };

    useEffect(() => {
      if (token) {
        loadUserProfileData();
      } else {
        setUserData(false);
      }
    }, [token]);
  
    const value={
      doctors,getDoctorsData,
      currencySymbol,token,setToken,backendUrl,userData,setUserData,loadUserProfileData
  }

    
    useEffect(() => {
      getDoctorsData();
    }, []);


    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider