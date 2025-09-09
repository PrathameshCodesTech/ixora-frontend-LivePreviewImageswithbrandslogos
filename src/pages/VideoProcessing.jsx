import React from 'react'
import { FaVideo } from "react-icons/fa";
const VideoProcessing = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-800 font-sans  ml-5">
    {/* Breadcrumb */}
    <div className="text-lg text-gray-500 mb-6 font-bold mt-5 gap-4 ">
      Dashboard &gt; <span className="text-gray-700">My Videos</span> &gt;{" "}
      <span className="text-black font-medium">Processing</span>
    </div>

    {/* Header */}
    <div className='mt-12'>
    <h1 className="text-3xl font-bold mb-3">Processing Your Video</h1>
    <p className="text-gray-500 font-bold  mb-8">
      Hang tight! We’re analyzing your video and preparing your slides.
    </p>
    </div>

    {/* Card */}
    <div className="border border-gray-200 shadow-sm rounded-md px-6 py-10  mx-auto mt-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-100 p-4 rounded-full">
          <FaVideo className="text-indigo-600 text-2xl" />
        </div>
      </div>
      <h2 className="text-2xl  font-bold my-7 ">Video Upload Complete</h2>
      <p className="text-gray-500 font-semibold max-w-md mx-auto mb-6">
        Your file has been uploaded. SlideGenie is now processing your video.
        This may take a few minutes depending on file size.
      </p>
      <button className="bg-[#0c0b6b] text-white px-12 py-3 rounded hover:bg-[#1c1b7b]">
        Cancel
      </button>
    </div>

    {/* Footer Note */}
    <p className="text-gray-400 text-sm text-left mt-8">
      You’ll be notified when your slides are ready.
    </p>
  </div>
  )
}

export default VideoProcessing
