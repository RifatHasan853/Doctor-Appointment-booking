import { assets } from "../assets/assets_frontend/assets"


function Footer() {
  return (
    <div className="md:mx-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
            {/*---left secton---- */}
            <div>
                <img className="mb-5 w-40" src={assets.logo} alt="" />
                <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>

            </div>
            {/*---center secton---- */}
            <div>
                <p  className="text-xl font-medium mb-5">Company </p>
                <ul className="flex flex-col gap-2 text-gray-600">
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>

            </div>
            {/*---Right secton---- */}
            <div>
                <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                <ul className="flex flex-col gap-2 text-gray-600">
                    <li>+1-222-345-4556</li>
                    <li>rifatdeveloper853@gmail.com</li>
                </ul>


            </div>



        </div>
        <div>
            <hr />
            <p className="py-5 text-sm text-center">Copyright © 2024 rifatDeveloper - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer