import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login'
import Create from './pages/Create'
import VideoProcessing from './pages/VideoProcessing'
import Gallery from './pages/Gallery'
import Profile from './pages/Profile'
import Doctors from './pages/Doctors'
import Bulkvideo from './pages/Bulkvideo'
import DoctorVideoprocessing from './pages/DoctorVideoprocessing'
import GenerateBulkVideos from './pages/GenerateBulkVideos'
import VideoComplete from './pages/VideoComplete'
import Terminate from './pages/Terminate'
import Analytics from './pages/Analytics';
import EmployeeCreate from './pages/EmployeeCreate';
import EmployeeBulkGeneration from './pages/EmployeeBulkGeneration';
import Dashboard from './pages/Dashboard';
import ProtectedAdminRoutes from './routes/ProtectedAdminRoutes';
import ProtectedStaffRoutes from './routes/ProtectedStaffRoutes';
import UserDetails from './pages/UserDetails';
import './App.css'
import { HashRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom'

function App() {

  return (
    <>
    <Toaster position="top-center" />
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route pa>

      </Route>
      <Route 
       path='/create' 
       element={
       <ProtectedStaffRoutes><Create/></ProtectedStaffRoutes>
       }
      />
       {/* <Route path="/create?" element={<Navigate to="/create" replace />} /> */}
      <Route 
       path='/video-processing' 
       element={<ProtectedStaffRoutes><VideoProcessing/></ProtectedStaffRoutes>}
      />
<Route 
       path='/gallery' 
       element={<ProtectedStaffRoutes><Gallery/></ProtectedStaffRoutes>}
      />
      <Route 
       path='/create/profile' 
       element={<ProtectedStaffRoutes><Profile/></ProtectedStaffRoutes>}
      />
      <Route 
       path='/doctors' 
       element={<ProtectedStaffRoutes><Doctors/></ProtectedStaffRoutes>}
      />
      <Route
       path='/bulk-videos'
       element={<ProtectedStaffRoutes><Bulkvideo/></ProtectedStaffRoutes>}
      />
      <Route
      path='/doctor-video'
      element={<ProtectedStaffRoutes><DoctorVideoprocessing/></ProtectedStaffRoutes>}
      />
     <Route
      path='/generate-bulk-videos'
      element={<ProtectedStaffRoutes><GenerateBulkVideos/></ProtectedStaffRoutes>}
      />
      <Route
      path='/video-complete'
      element={<ProtectedStaffRoutes><VideoComplete/></ProtectedStaffRoutes>}
      />
      <Route
      path='/terminate'
      element={<ProtectedStaffRoutes><Terminate/></ProtectedStaffRoutes>}
      />
      <Route
      path='/analytics'
      element={<ProtectedStaffRoutes><Analytics/></ProtectedStaffRoutes>}
      />
      <Route
      path='/employee-create'
      element={<ProtectedAdminRoutes>
        <EmployeeCreate/>
        </ProtectedAdminRoutes>}
      />
      <Route
      path='/employee-bulk-generation'
      element={<ProtectedAdminRoutes><EmployeeBulkGeneration/></ProtectedAdminRoutes>}
      />
      <Route
      path='/dashboard'
      element={<ProtectedAdminRoutes><Dashboard/></ProtectedAdminRoutes>}
      />

      <Route
      path='/employee-details'
      element={<ProtectedAdminRoutes><UserDetails/></ProtectedAdminRoutes>}
      />
      </Routes>
       
    </Router>
    </>
  )
}

export default App
