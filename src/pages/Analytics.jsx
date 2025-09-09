import React, { useState } from 'react';
import logo from "../assets/ixoralogo.png";
import { FaForward } from 'react-icons/fa6';

const Analytics = () => {
  const [activeTable, setActiveTable] = useState(null);

  // Different data sets for each button
  const employeeData = [
    {
        
            DoctorId: "P1",
            DoctorName: "Anish Mehta",
            specialization: "Cardiologist",
            hospitalClinic: "K.J. Somaya",
            city: "Mumbai",
            mobileNumber: "8446524897",
            whatsappNumber: "9321368748",
            designation: "Consultant",
            description: "—",
            status: "success"
          
    },
    {
        DoctorId: "P1",
        DoctorName: "Sakshi Shah",
        specialization: "Cardiologist",
        hospitalClinic: "K.J. Somaya",
        city: "Mumbai",
        mobileNumber: "8446524897",
        whatsappNumber: "9321368748",
        designation: "Consultant",
        description: "—",
        status: "success"
      },
      {
        DoctorId: "P1",
        DoctorName: "Kiridhar Shah",
        specialization: "Cardiologist",
        hospitalClinic: "K.J. Somaya",
        city: "Mumbai",
        mobileNumber: "8446524897",
        whatsappNumber: "9321368748",
        designation: "Consultant",
        description: "—",
        status: "success"
      },
  ];

  const employeeDetailsData = [
    {
      id: "E001",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      address: "123 Main St, City",
      emergencyContact: "Mary Doe (9876543210)"
    },
    {
      id: "E002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      address: "456 Oak Ave, Town",
      emergencyContact: "John Smith (1234567890)"
    }
  ];

  const employeeViewData = [
    {
      id: "E001",
      name: "John Doe",
      lastLogin: "2023-07-20 09:15",
      activeProjects: 3,
      tasksCompleted: 42,
      performance: "Excellent"
    },
    {
      id: "E002",
      name: "Jane Smith",
      lastLogin: "2023-07-20 08:30",
      activeProjects: 2,
      tasksCompleted: 38,
      performance: "Good"
    }
  ];

  const showTable = (tableType) => {
    setActiveTable(tableType);
  };

  const renderTable = () => {
    switch(activeTable) {
      case 'employee':
        return (
          <div className="mt-20 overflow-x-auto ">
            <h2 className="text-2xl font-bold mb-4">Employee Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">hospital & Clinic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">city</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Whatsapp Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeData.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.DoctorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.DoctorName}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.hospitalClinic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.mobileNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.whatsappNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'details':
        return (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeDetailsData.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.emergencyContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'view':
        return (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Employee View</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeViewData.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.activeProjects}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.performance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='mx-10 my-10'>
      <div className='flex justify-center md:justify-end md:mb-8 md:mr-15'>
        <img src={logo} alt="Logo" className='w-auto h-15' />
      </div>
      <div>
        <div className='my-15 md:my-5 border-b-2 border-gray-300'>
          <h1 className='font-bold text-3xl text-center md:text-start pb-5'>Analytics</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <div className='border py-8 flex flex-col justify-center items-center rounded-2xl border-gray-300 shadow-2xl'>
            <h1 className='font-bold text-3xl font-sans mt-4 mb-7 capitalize'>Employee</h1>
            <button 
              onClick={() => showTable('employee')}
              className='flex justify-center items-center gap-3 font-bold bg-[#0A0A64] text-white py-2 px-4 rounded-xl cursor-pointer'
            >
              Click To open<FaForward size={20}/>
            </button>
          </div>
          <div className='border py-8 flex flex-col justify-center items-center rounded-2xl border-gray-300 shadow-2xl'>
            <h1 className='font-bold text-3xl font-sans my-4 capitalize'>Employee details</h1>
            <button 
              onClick={() => showTable('details')}
              className='flex justify-center items-center gap-3 font-bold bg-[#0A0A64] text-white py-2 px-4 rounded-xl cursor-pointer'
            >
              Click To open<FaForward size={20}/>
            </button>
          </div>
          <div className='border py-8 flex flex-col justify-center items-center rounded-2xl border-gray-300 shadow-2xl'>
            <h1 className='font-bold text-3xl font-sans my-4 capitalize'>Employee View</h1>
            <button 
              onClick={() => showTable('view')}
              className='flex justify-center items-center gap-3 font-bold bg-[#0A0A64] text-white py-2 px-4 rounded-xl cursor-pointer'
            >
              Click To open<FaForward size={20}/>
            </button>
          </div>
        </div>
        {renderTable()}
      </div>
    </div>
  );
};

export default Analytics;