import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'
import { getItemInLocalStorage } from '../utils/loacalStorage'
import toast from 'react-hot-toast'
const ProtectedStaffRoutes = ({children}) => {
    const token = getItemInLocalStorage("Access_Token")
    const userType = getItemInLocalStorage("UserType")
    
  if (!token) {
    toast.error("Please login to access the page");
    return <Navigate to="/" replace />;
  }

  if (userType !== "Admin" && userType !== "Employee") {
    toast.error("Access restricted to Admins and Employees only");
    return <Navigate to="/" replace />;
  }
  return (
    <>{children}</>
  )
}

export default ProtectedStaffRoutes
