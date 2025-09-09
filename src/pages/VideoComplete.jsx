import React from 'react'
import { FaVideo } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const VideoComplete = () => {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-white px-6 py-8 text-gray-800 font-sans  ml-5'>
       <div className="text-lg  text-gray-500 mb-6 font-bold mt-5 gap-4 ">
      Dashboard &gt; <span className="text-gray-700">My Videos</span> &gt;{" "}
      <span className="text-black font-medium">Processing</span>
    </div>
     <div className='my-15 mx-5'>
        <h1 className='text-3xl font-bold mb-6 ' >Processing Your Video</h1>
        <span className='text-lg text-gray-400'>Hang tight! We’re analyzing your video and preparing your slides.</span>
     </div>
     <div className='flex flex-col justify-center items-center border-1 border-gray-200 rounded py-15'>
        <div className='border-2 border-blue-800 pt-4 pb-4 pl-4 pr-4 rounded-full'><FaVideo size={30} /></div>
        <h1 className='text-xl font-bold pt-5 mb-3'> Video Upload Complete</h1>
        <p className='font-semibold text-gray-500 mb-5'>Your file has been uploaded. SlideGenie is now processing your video. This may take a few minutes  depending on file size.</p>

        <button
        onClick={()=>navigate('/create')}
        className='bg-[#0A0A64] text-white px-11 py-3 rounded mt-5 font-bold'  
        >
            Cancel
        </button>
     </div>
     <p className='font-semibold text-gray-500 my-5'>You’ll be notified wwhen your slides are ready.</p>
    </div>
  )
}

export default VideoComplete
