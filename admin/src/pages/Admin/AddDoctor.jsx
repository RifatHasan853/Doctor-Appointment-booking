import { useContext, useState } from "react"
import { assets } from "../../assets/assets_admin/assets"
import { AdminContext } from "../../context/AdminContext"
import {toast} from 'react-toastify'
import axios  from 'axios'


function AddDoctor() {

  const [docImg,setDocImg]=useState(false)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [experience,setExperience]=useState('1 year')
  const [fees,setFees]=useState('')
  const [about,setAbout]=useState('')
  const [speciality,setSpeciality]=useState('General physician')
  const [degree,setDegree]=useState('')
  const [address1,setAddress1]=useState('') 
  const [address2,setAddress2]=useState('')
  const [loading, setLoading] = useState(false);

  const {backendUrl,aToken}=useContext(AdminContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }
      setLoading(true); // Start loader
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fees", Number(fees));
      formData.append("experience", experience);
      formData.append("speciality", speciality);
      formData.append("about", about);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // console log form data
      // formData.forEach((value, key) => {
      //   console.log(`${key}:${value}`);
      // });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setAbout("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setEmail("");
        setDegree("");
        setFees("");
        setPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
     // console.log(error.message);
    } finally {
      setLoading(false); // Stop loader
    }
  }
  return (
    <form onSubmit={submitHandler} className="m-5 w-full">
      <p className="text-lg font-medium">Add Doctor</p>
      <div className="p-8 bg-white w-full rounded max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex gap-4 text-gray-500 items-center mb-8">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          )}
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              setDocImg(e.target.files[0]);
            }}
            type="file"
            name=""
            id="doc-img"
            hidden
          />
          <p>
            Upload Doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full flex flex-col gap-4 lg:flex-1">
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Doctor Name</p>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Doctor Email</p>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="email"
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Doctor Password</p>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                required
                placeholder="password"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Experience</p>
              <select
                onChange={(e) => {
                  setExperience(e.target.value);
                }}
                value={experience}
                className="border rounded px-3 py-2"
                name="experience"
                id="experience"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Doctor Fees</p>
              <input
                onChange={(e) => {
                  setFees(e.target.value);
                }}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                required
                placeholder="Fees"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 lg:flex-1">
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Speciality</p>
              <select
                onChange={(e) => {
                  setSpeciality(e.target.value);
                }}
                value={speciality}
                className="border rounded px-3 py-2"
                name="speciality"
                id="speciality"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="mt-4 mb-2">Degree</p>
              <input
                onChange={(e) => {
                  setDegree(e.target.value);
                }}
                value={degree}
                className="border rounded px-3 py-2"
                type="text "
                required
                placeholder="Degree"
              />
            </div>
            <div>
              <p className="mt-4 mb-2">Address</p>
              <input
                onChange={(e) => {
                  setAddress1(e.target.value);
                }}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 1"
                required
              />
              <input
                onChange={(e) => {
                  setAddress2(e.target.value);
                }}
                value={address2}
                className="border rounded px-3 py-2 mt-2"
                type="text"
                placeholder="address 2"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            value={about}
            className="border rounded px-4 pt-2 w-full"
            rows={5}
            placeholder="Write about doctor"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="rounded-full text-white bg-primary px-10 py-2 mt-4"
        >
          Add Doctor
        </button>
      </div>
    </form>
  )
}

export default AddDoctor  