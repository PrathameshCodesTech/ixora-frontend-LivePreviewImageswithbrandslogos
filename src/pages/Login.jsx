import React, { useState } from "react";
import bgImage from "../assets/login.png";
import loginVideo from '../assets/login.mp4';
import toast from "react-hot-toast";
import flower from '../assets/ixoraflower.png'
import logo from '../assets/ixoralogo.png'
import { employeelogin ,UpdateLoginFormData } from "../api";
import { useNavigate } from "react-router-dom";
import { setItemInLocalStorage , getItemInLocalStorage } from "../utils/loacalStorage";

import { FaEye, FaEyeSlash } from "react-icons/fa6";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRBM , setSelectedRBM] = useState("")

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const [errors , setErrors] = useState({
        // email:'',
        employeeId:''
    }) 
    const [formData , setFormData] = useState({
        // email:'',
        employeeId:''
    })

    const handleInputChange = (e) =>{
        const {name , value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
        if(errors[name]){
            setErrors({
                ...errors,
                [name]:''
            })
        }
    }

     const validateForm = () =>{
        let valid= true;
        const newError = {
            // email:'',
            employeeId:''
        }

        // if(!formData.email.trim()){
        //     newError.email = "Email is required";
        //     valid= false
        // }
        if(!formData.employeeId.trim()){
            newError.employeeId= "Employee Id is required";
            valid= false
        }

        setErrors(newError)
        return valid
     }
      const handleRBMSelction = (e) => {
        setSelectedRBM(e.target.value);
    };
     const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        try {
            const response = await employeelogin({
                employee_id: formData.employeeId,
                // email: formData.email
            });
    
            console.log("Login success:", response);
            
            const userId= response.employee.employee_id
            const userName = response.employee.name
            const userDepartment = response.employee.department
            const userType = response.employee.user_type
            const id = response.employee.id
            const access_token = response.tokens.access
            const access_token_exp = response.tokens.access_token_exp
            const refresh = response.tokens.refresh
            console.log("token details",{
                "Accsses toke":access_token,
                "access_token_exp":access_token_exp,
                "refresh" :refresh
            })
            

            setItemInLocalStorage("Id",id)
            setItemInLocalStorage("UserId",userId)
            setItemInLocalStorage("UserName" , userName)
            setItemInLocalStorage("UserDepartment",userDepartment)
            setItemInLocalStorage("UserType",userType)
            setItemInLocalStorage("Access_Token",access_token)
            setItemInLocalStorage("Access token exp", access_token_exp)
            setItemInLocalStorage("Refresh",refresh)
            // setItemInLocalStorage("Auth Token",token)

            // defining role 
            // const isAdmin = response.employee.user_type("Admin")

            // console.log("admin things",isAdmin)
            if(selectedRBM){
                try {
                       const updateResponse = await UpdateLoginFormData(id, { 
                        rbm: selectedRBM
                    });
                    console.log("RBM update success:", updateResponse);
                    toast.success("RBM updated successfully");
                    
                } catch (error) {
                    //  console.error("RBM update error:", updateError);// prathamesh
                        console.error("RBM update error:", error); 
                    toast.error("Failed to update RBM");
                }
            }

            const userData = {
                ...response.employee,
                role:userType
            }

            console.log("userData",userData)

            // Add success message // Prathamesh
            toast.success(`Welcome back, ${userName}!`);
            
          if(userType === "Admin"){
            navigate('/create')
          }
          else{
            navigate('/create')
          }
            
            
            
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            toast.error("Login failed",error.response?.data);
            
        }
    };


    return (
        <div className="min-h-screen w-full flex justify-center items-center relative">
            <div className="absolute top-4 right-10 z-20">
                <img src={logo} alt="Company logo" className="h-20 w-auto"/>
            </div>
            {/* Half Blue Background */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-[#0c0b6b]"></div>
            {/* Half White Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white">
            {/* <img src={flower} alt="" />  */}
            </div>

            {/* Login Card */}
            <div className="relative z-10 flex w-full max-w-5xl bg-white rounded-lg overflow-hidden shadow-xl/20 border-0 border-blue-50">
                {/* Left Video - Now matching form height */}
                <div className="w-1/2 hidden md:block relative h-[600px]">
                    {/* <video
                        src={loginVideo}
                        className="min-h-full min-w-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={bgImage}
                    > */}
                        {/* <source src={loginVideo} type="video/mp4" /> */}
                        {/* Fallback image if video doesn't load */}
                        {/* <img 
                            src={bgImage} 
                            alt="Login Background" 
                            className="min-h-80 min-w-70 object-cover" 
                        /> */}
                    {/* </video> */}
                    <img src={flower} alt="background"  className="w-auto h-full"/>
                    
                </div>

                {/* Right Login Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 uppercase">
                        Welcome to Ixora
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Create or access your account to start making & sharing videos.
                    </p>

                    {/* Tabs */}
                    <div className="flex mt-4 space-x-4 border-b border-gray-200">
                        <button className="pb-2 border-b-2 border-black text-black font-bold">
                            Login
                        </button>
                        {/* <button className="pb-2 text-gray-500 font-bold">Sign Up</button> */}
                    </div>

                    {/* Form */}
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
    onChange={handleInputChange}
                                    placeholder="Enter your work email"
                                    className={`w-full border ${errors.email ? 'border-red-500 ' :'border-gray-300'} rounded px-3 py-2 pl-10 focus:outline-none bg-white focus:ring focus:border-blue-300`}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-mail">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
                                        <path d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z" />
                                    </svg>
                                </span>
                            </div>
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Employee ID
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="employeeId"
                                    value={formData.employeeId}
    onChange={handleInputChange}
                                    placeholder="Enter your employee id"
                                    className={`w-full border ${errors.employeeId ? 'border-red-500': 'border-gray-300'} border-gray-300 rounded px-3 py-2 pl-10 pr-10 focus:outline-none focus:ring focus:border-blue-300`}
                                />
                                <span className="absolute left-3 top-2.5 text-gray-400">🆔</span>
                                <span 
                                    className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                   RBM
                            </label>
                            <div className="relative mt-1 ">
                              <select name="rbm" id="" value={selectedRBM} onChange={handleRBMSelction} className="w-full border border-gray-300 rounded px-3 py-2  pr-10 focus:ring focus:border-blue-300 text-gray-800 font-medium bg-blue-50" required>
                                <option value="">Select RBM</option>
                                <option value="1">Bidyut Nag</option>
                                <option value="14">Subhankar Dutta</option>
                                <option value="22">Vinamra Priya</option>
                                <option value="26">Chiranjeevi Janugani</option>
                                <option value="36">Muli Vikram</option>
                                <option value="140">Rudraswamy Y D </option>
                                <option value="150">Harun Rasheed S</option>
                                <option value="155">Vacant- Madurai</option>
                                <option value="232">M R Nikhil</option>
                                <option value="219">Ajith Mohan</option>
                                <option value="72">Lalit Kumar</option>
                                <option value="80">Surinder Singh</option>
                                <option value="89">Balram Bagaria</option>
                                <option value="183">Derg Pal Singh</option>
                                <option value="187">Shobhit Kumar Kesarwani</option>
                                <option value="108">Amol Kurkute</option>
                                <option value="193">Ritesh Dilip Wagh</option>
                                <option value="202">Omprakash Satish Kene</option>
                                <option value="211">Rohit Ramani Rameshbhai</option>
                                <option value="120">Vacant- MP</option>
                              </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            // onClick={() => navigate("/create")}
                            className="w-full bg-[#0c0b6b] text-white py-2 rounded hover:bg-[#1c1b7b] transition"
                        >
                            Login
                        </button>
                    </form>

                    {/* Or Divider */}
                    {/* <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-sm text-gray-400">Or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div> */}

                    {/* Social Login */}
                    {/* <div className="flex justify-between space-x-4">
                        <button className="w-full flex items-center justify-center border bg-gray-400 opacity-20 p-2 rounded">
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5 mr-2"
                                aria-disabled
                            />
                            <span className="text-sm">Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center border p-2 rounded">
                            <img
                                src="https://www.svgrepo.com/show/303145/apple-logo.svg"
                                alt="Apple"
                                className="w-5 h-5 mr-2"
                            />
                            <span className="text-sm">Apple</span>
                        </button>
                        <button className="w-full flex items-center justify-center border p-2 rounded">
                            <img
                                src="https://www.svgrepo.com/show/475689/twitter-color.svg"
                                alt="Twitter"
                                className="w-5 h-5 mr-2"
                            />
                            <span className="text-sm">Twitter</span>
                        </button>
                    </div> */}

                    {/* Footer */}
                    {/* <p className="text-sm text-center text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <a href="#" className="text-green-700 font-medium">
                            Sign up
                        </a>
                    </p> */}
                </div>
            </div>
        </div>
    );
}

export default Login;