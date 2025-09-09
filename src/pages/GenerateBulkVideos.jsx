import React from "react";
import { Plus, Download, Mail } from "lucide-react";
import Avatar from '../assets/image.png'
import { useNavigate } from "react-router-dom";

const GenerateBulkVideos = () => {
    const data = [
        { id: "P1", name: "Anish Mehta", specialization: "Cardiologist", hospital: "K.J. Somaya", city: "Mumbai", mobile: "8446524897", whatsapp: "9321368748", designation: "Consultant" },
        { id: "P2", name: "Karan Roy", specialization: "Dermatologist", hospital: "Satyam", city: "Mumbai", mobile: "9456389739", whatsapp: "7445788935", designation: "Physician" },
        ...Array(7).fill({ id: "P3", name: "Sunil Jagtap", specialization: "Oncologist", hospital: "J.J> Hospital", city: "Mumbai", mobile: "7468659735", whatsapp: "9834527869", designation: "Physician" })
      ];
      const navigate = useNavigate()
    
      return (
        <div className="min-h-screen bg-white p-6">
          <div className="flex justify-between items-center mb-6 mx-5">
                <h1 className="text-xl  tracking-wide font-bold">VIBECOPILOT</h1>
                <img
                  src={Avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
          <div className="text-md text-gray-500 font-bold mb-4">Module &gt; <span className="text-black">Page</span></div>
    
          <div className="flex items-center space-x-3 mb-6">
            <button className="bg-[#000050] text-white p-2 rounded"><Plus size={20} /></button>
            <button className="bg-[#cce0fb] text-[#000050] p-2 rounded"><Download size={20} /></button>
            <span className="text-gray-400 text-lg">Choose Template</span>
            <div className="flex ml-auto items-center space-x-3">
              {/* <button className="bg-[#000050] text-white px-4 py-2 rounded font-semibold">Generate Bulk Video</button> */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for articles"
                  className="border px-4 py-2 rounded-md text-sm"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>
    
          <div className="overflow-x-auto rounded ">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3"><input type="checkbox" /></th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Hospital / Clinic</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Mobile Number</th>
                  <th className="px-4 py-3">WhatsApp Number</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" /></td>
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.specialization}</td>
                    <td className="px-4 py-3">{row.hospital}</td>
                    <td className="px-4 py-3">{row.city}</td>
                    <td className="px-4 py-3">{row.mobile}</td>
                    <td className="px-4 py-3">{row.whatsapp}</td>
                    <td className="px-4 py-3">{row.designation}</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          <div className="flex justify-center space-x-4 mt-6">
            <button onClick={()=>navigate("/bulk-videos")} className="border-2 border-blue-900 px-6 py-2 rounded font-bold">Cancel</button>
            <button onClick={()=>navigate("/doctor-video")} className="bg-[#000050] text-white px-4 py-2 rounded font-bold">Generate Bulk Video</button>
          </div>
    
          <div className="fixed bottom-6 right-6 bg-[#e0ecff] p-3 rounded-full shadow">
            <Mail className="text-[#000050]" />
          </div>
        </div>
      )
}

export default GenerateBulkVideos
