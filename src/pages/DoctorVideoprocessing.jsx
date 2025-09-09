import React from 'react'
import Icon from '../assets/icon.png'
import { useNavigate } from 'react-router-dom'
const DoctorVideoprocessing = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white p-6 mx-10">
    {/* Breadcrumb */}
    <div className="text-sm text-gray-500 font-bold my-10 ">
      Dashboard <span className="mx-2">{">"}</span> My Videos <span className="mx-2">{">"}</span>{" "}
      <span className="text-black">Processing</span>
    </div>

    {/* Title and Subtitle */}
    <h1 className="text-2xl font-bold mb-2">Processing Your Video</h1>
    <p className="text-gray-400 mb-6">Hang tight! We’re analyzing your video and preparing your Video.</p>

    {/* Illustration */}
    <div className="flex justify-center mb-10">
      <div className="border-1 border-gray-200 p-4 rounded-md">
        <img
          src={Icon}
          alt="Processing Illustration"
          className="w-40 h-40 object-contain"
        />
      </div>
    </div>

    {/* Notification Text */}
    <p className="text-center text-sm text-gray-500 mb-6">
      You’ll be notified wwhen your slides are ready.
    </p>

    {/* Status Box */}
    <div className="w-full mx-auto border-1 border-gray-300 rounded-lg p-6 bg-white shadow-sm text-center">
      {/* Video Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-[#e4edff] p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#000050"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
        </div>
      </div>

      {/* Upload Status */}
      <h2 className="text-2xl font-bold mb-3">Video Upload Complete</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your file has been uploaded. This may take a few
        minutes.
      </p>

      {/* Buttons */}
      <div className="flex justify-center space-x-4">
        <button onClick={()=>navigate('/create')} className="px-6 py-2 border-2 border-[#000050] text-[#000050] rounded font-bold">
          Done
        </button>
        <button onClick={()=>navigate('/create')} className="px-6 py-2 bg-[#000050] text-white rounded font-bold">
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}

export default DoctorVideoprocessing
