import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Doctors from "./pages/Doctors"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./pages/MyProfile"
import MyAppoinment from "./pages/MyAppoinment"
import Appoinment from "./pages/Appoinment"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="mx-4 sm:mx[10%]">
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/doctors" element={<Doctors></Doctors>}></Route>
        <Route path="/doctors/:speciality" element={<Doctors></Doctors>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/about" element={<About></About>}></Route>
        <Route path="/contact" element={<Contact></Contact>}></Route>
        <Route path="/my-profile" element={<MyProfile></MyProfile>}></Route>
      
        <Route path="/my-appointments" element={<MyAppoinment></MyAppoinment>}></Route>
        
        <Route path="/appointment/:docId" element={<Appoinment></Appoinment>}></Route>


      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App
