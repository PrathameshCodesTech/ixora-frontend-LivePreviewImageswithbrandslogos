import React from 'react'
import { Navigate } from 'react-router-dom'
import { getItemInLocalStorage } from '../utils/loacalStorage'
import toast from 'react-hot-toast'

const ProtectedAdminRoutes = ({children}) => {
   const token = getItemInLocalStorage("Access_Token")
   const user = getItemInLocalStorage("UserType")
   
   if (!token) {
     toast.error("Please login to access the page")
     return <Navigate to='/' replace/>
   }
   
   if (user !== "Admin") {
     toast.error("Not Authorized")
     return <Navigate to="/" replace/>
   }
   
   return <>{children}</>
}

export default ProtectedAdminRoutes