import React, { useState } from "react";
import bgImage from "../assets/login.png";
import loginVideo from '../assets/login.mp4';
import toast from "react-hot-toast";
import flower from '../assets/ixoraflower.png'
import logo from '../assets/ixoralogo.png'
import { employeelogin, getRbmRegions, validateDesignation } from "../api";
import { useNavigate } from "react-router-dom";
import { setItemInLocalStorage , getItemInLocalStorage } from "../utils/loacalStorage";

import { FaEye, FaEyeSlash } from "react-icons/fa6";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRBM, setSelectedRBM] = useState("");
const [rbmOptions, setRbmOptions] = useState([]);
const [isValidating, setIsValidating] = useState(false);
const [validationMessage, setValidationMessage] = useState("");

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


      // Fetch RBM regions on component mount
    React.useEffect(() => {
        const fetchRbmRegions = async () => {
            try {
                const response = await getRbmRegions();
                setRbmOptions(response.rbm_regions || []);
            } catch (error) {
                console.error("Error fetching RBM regions:", error);
                toast.error("Failed to load RBM regions");
            }
        };
        fetchRbmRegions();
    }, []);
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

     const validateForm = () => {
        let valid = true;
        const newError = {
            employeeId: ''
        };

        if (!formData.employeeId.trim()) {
            newError.employeeId = "Employee ID is required";
            valid = false;
        }
        
        if (!selectedRBM) {
            toast.error("Please select an RBM region");
            valid = false;
        }

        setErrors(newError);
        return valid;
    };
const handleRBMSelection = async (e) => {
        const rbmValue = e.target.value;
        setSelectedRBM(rbmValue);
        setValidationMessage("");
        
        // Validate combination if both fields are filled
        if (formData.employeeId.trim() && rbmValue) {
            setIsValidating(true);
            try {
                const response = await validateDesignation({
                    employee_id: formData.employeeId,
                    rbm_region: rbmValue
                });
                
                if (response.valid) {
                    setValidationMessage("✅ Valid combination");
                } else {
                    setValidationMessage("❌ " + response.message);
                    setSelectedRBM(""); // Clear invalid selection
                }
            } catch (error) {
                setValidationMessage("❌ Validation failed");
                setSelectedRBM("");
            } finally {
                setIsValidating(false);
            }
        }
    };
     const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        try {
            const response = await employeelogin({
                employee_id: formData.employeeId,
                rbm_region: selectedRBM
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
            // Store new designation fields
            const designation = response.employee.designation
            const rbmRegion = response.employee.rbm_region
            
            setItemInLocalStorage("Designation", designation)
            setItemInLocalStorage("RbmRegion", rbmRegion)

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
                              <select 
                                    name="rbm" 
                                    value={selectedRBM} 
                                    onChange={handleRBMSelection} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:ring focus:border-blue-300 text-gray-800 font-medium bg-blue-50" 
                                    required
                                >
                                    <option value="">Select RBM Region</option>
                                    {rbmOptions.map((rbm) => (
                                        <option key={rbm} value={rbm}>
                                            {rbm}
                                        </option>
                                    ))}
                                </select>
                                
                                {/* Validation message */}
                                {isValidating && (
                                    <div className="mt-1 text-sm text-blue-600">
                                        🔄 Validating...
                                    </div>
                                )}
                                {validationMessage && (
                                    <div className={`mt-1 text-sm ${validationMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                        {validationMessage}
                                    </div>
                                )}
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
                </div>
            </div>
        </div>
    );
}

export default Login;