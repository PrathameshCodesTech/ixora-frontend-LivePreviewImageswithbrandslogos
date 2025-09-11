import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UserIcon, VideoIcon } from "lucide-react";
import { FaImage } from "react-icons/fa";
import FEATURE_FLAGS from "../config/features";
import { motion } from "framer-motion";
import { useCountUp } from "react-countup";
import logo from "../assets/ixoralogo.png";
import {
  getAllEmployees,
  getAllDoctors,
  TotalEmployeeActive,
  getEmployeeExcel,
  getDoctorExcel,
  getTemplateCount,
} from "../api";
import toast from "react-hot-toast";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  format,
  parseISO,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import { getImageTemplateUsage } from "../api";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <span>{this.props.fallbackValue}</span>;
    }
    return this.props.children;
  }
}

// Robust Animated Counter with Error Boundary
const AnimatedCounter = ({ end }) => {
  const numericValue = Number(end) || 0;
  
  // Simple counter without the problematic react-countup library
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const increment = numericValue / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  return <span>{count}</span>;
};

const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [videoCreatedCount, setVideoCreatedCount] = useState(0);
  const [activeEmployeesCount, setActiveEmployeesCount] = useState(0);
  const [totalActive, setTotalActive] = useState([]);

  const [imageTemplateUsage, setImageTemplateUsage] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedTemplateDoctors, setSelectedTemplateDoctors] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)), // Default: last 7 days
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [loginTrendsData, setLoginTrendsData] = useState([]);

  const data = [
    { date: "Jun01", logins: 6 },
    { date: "Jun02", logins: 8 },
    { date: "Jun03", logins: 11 },
    { date: "Jun04", logins: 9 },
    { date: "Jun05", logins: 13 },
    { date: "Jun06", logins: 10 },
    { date: "Jun07", logins: 7 },
    { date: "Jun08", logins: 8 },
    { date: "Jun09", logins: 11 },
    { date: "Jun10", logins: 12 },
    { date: "Jun11", logins: 14 },
    { date: "Jun12", logins: 9 },
  ];

  // const employees = [
  //   { name: "Alex Morgan", doctors: 12, region: "North", videos: 8 },
  //   { name: "Priya Singh", doctors: 9, region: "South", videos: 5 },
  //   { name: "John Lee", doctors: 7, region: "East", videos: 3 },
  // ];

  const [employees, setEmployee] = useState([]);

const showCountofemployee = async () => {
  try {
    const response = await getAllEmployees();
    const employeeCount = response.length;
    setCount(employeeCount);

    const doctorresponse = await getAllDoctors();
    console.log("Doctor response:", doctorresponse);
    
    // Handle paginated response structure
    const doctorCount = doctorresponse.count || doctorresponse.length || 0;
    const doctorList = doctorresponse.results || doctorresponse || [];
    
    console.log("Doctor count:", doctorCount);
    setDoctorCount(doctorCount);
    
    // Count both videos and images based on feature flags
// Count both videos and images based on feature flags
if (FEATURE_FLAGS.ENABLE_VIDEO_FEATURES) {
  const createdVideos = doctorList.filter(
    (doc) => doc.output_video !== null
  );
  setVideoCreatedCount(createdVideos.length);
}
// Note: For images, we'll count from template usage data instead
// This will be handled in a separate useEffect after imageTemplateUsage is loaded
  } catch (error) {
    console.log("Error in getting employee details", error);
  }
};


const fetchTemplateCount = async () => {
  try {
    if (FEATURE_FLAGS.ENABLE_VIDEO_FEATURES) {
      const res = await getTemplateCount('video');
      setEmployee(res);
    } else {
      // ADD DEBUGGING HERE:
      console.log("🔍 Fetching image template usage...");
      const res = await getImageTemplateUsage();
      console.log("🔍 Image template usage response:", res);
      console.log("🔍 Response length:", res?.length);
      setImageTemplateUsage(res);
    }
  } catch (error) {
    console.log("❌ Error in fetchTemplateCount:", error);
  }
};

  useEffect(() => {
    showCountofemployee();
    fetchTemplateCount();
  }, []);




{/* Template Wise Count Table */}
<motion.div className="space-y-4 mt-10" variants={itemVariants}>
  <div className="flex justify-between items-center my-5">
    <h4 className="text-xl font-bold">
      {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? "Template Wise Count" : "Image Template Usage"}
    </h4>
  </div>
  
  <motion.table
    className="w-full text-sm text-left border rounded-md overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <thead className="bg-gray-100">
      <tr className="text-gray-500">
        <th className="p-2">Template Name</th>
        <th className="p-2">
          {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? "No. of Videos" : "No. of Images"}
        </th>
        {!FEATURE_FLAGS.ENABLE_VIDEO_FEATURES && (
          <>
            <th className="p-2">Doctors</th>
            <th className="p-2">Actions</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? (
        employees.map((emp, idx) => (
          <motion.tr
            key={idx}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={tableRowVariants}
            className="border-t-2 border-gray-200 text-lg font-semibold"
            whileHover={{ backgroundColor: "#f8fafc" }}
          >
            <td className="p-2">{emp.template_name}</td>
            <td className="p-2">{emp.video_count}</td>
          </motion.tr>
        ))
      ) : (
        imageTemplateUsage.map((template, idx) => (
          <motion.tr
            key={idx}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={tableRowVariants}
            className="border-t-2 border-gray-200 text-lg font-semibold"
            whileHover={{ backgroundColor: "#f8fafc" }}
          >
            <td className="p-2">{template.template_name}</td>
            <td className="p-2">{template.usage_count}</td>
            <td className="p-2">
              <button
                onClick={() => {
                  setSelectedTemplateDoctors(template.doctor_names);
                  setSelectedTemplateName(template.template_name);
                  setShowDoctorModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Doctors ({template.doctor_names.length})
              </button>
            </td>
            <td className="p-2">
              <button
                onClick={() => downloadDoctorList(template.doctor_names, template.template_name)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download
              </button>
            </td>
          </motion.tr>
        ))
      )}
    </tbody>
  </motion.table>
</motion.div>

{/* Doctor Names Modal */}
{showDoctorModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          Doctors using "{selectedTemplateName}"
        </h3>
        <button
          onClick={() => setShowDoctorModal(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {selectedTemplateDoctors.map((doctorName, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded">
            {doctorName}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            downloadDoctorList(selectedTemplateDoctors, selectedTemplateName);
            setShowDoctorModal(false);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download List
        </button>
      </div>
    </div>
  </div>
)}

  useEffect(() => {
    showCountofemployee();
    fetchTemplateCount();
  }, []);


  const ActiveLogin = async () => {
    try {
      const response = await TotalEmployeeActive();
      const activeEmployees = response.filter(
        (emp) => emp.has_logged_in === true || emp.has_logged_in === "true"
      );
      setActiveEmployeesCount(activeEmployees.length);
      setTotalActive(activeEmployees);
    } catch (error) {
      console.log("Error Getting Active Employee", error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    ActiveLogin();
  }, []);

  useEffect(() => {
  if (!FEATURE_FLAGS.ENABLE_VIDEO_FEATURES && imageTemplateUsage.length > 0) {
    const totalImagesFromTemplates = imageTemplateUsage.reduce((total, template) => {
      return total + template.usage_count;
    }, 0);
    setVideoCreatedCount(totalImagesFromTemplates);
  }
}, [imageTemplateUsage]);


  const downloadEmployeeDetailse = async () => {
    try {
      toast.loading("Preparing download...", { id: "excel-download" });
      const response = await getEmployeeExcel();
      if (!response) {
        throw new Error("No data received ");
      }
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employee_data.xlsx");
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        toast.success("Excel file downloaded successfully!", {
          id: "excel-download",
        });
      } else if (response.url) {
        window.open(response.url, "_blank");
        toast.success("Opening download...", { id: "excel-download" });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download Excel file", {
        id: "excel-download",
      });
    }
  };
  const fetchDownloadDoctorData = async () => {
    try {
      toast.loading("Preparing download...", { id: "excel-download" });
      const response = await getDoctorExcel();

      if (!response) {
        throw new Error("No data received from server");
      }

      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "doctors_data.xlsx");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        toast.success("Excel file downloaded successfully!", {
          id: "excel-download",
        });
      } else if (response.url) {
        window.open(response.url, "_blank");
        toast.success("Opening download...", { id: "excel-download" });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download Excel file", {
        id: "excel-download",
      });
    }
  };

  const downloadDoctorList = (doctorNames, templateName) => {
  const csvContent = "Doctor Name\n" + doctorNames.join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${templateName}_doctors.csv`;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
  toast.success("Doctor list downloaded!");
};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center my-5 mx-5"
      >
        <h1 className="text-3xl tracking-wide font-bold">Dashboard</h1>
        <motion.img
          src={logo}
          alt="User"
          className="w-auto h-20 object-cover"
          whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          {
            icon: <UserIcon className="text-[#0A0A64] font-extrabold" />,
            label: "Total Employees",
            value: count,
            onclick: downloadEmployeeDetailse,
          },
          {
            icon: <UserIcon className="text-[#0A0A64] font-extrabold" />,
            label: "Active Today",
            value: activeEmployeesCount,
          },
          {
            icon: <FaImage className="text-[#0A0A64] font-extrabold" />,
            label: FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? "Videos Created" : "Images Created",
            value: videoCreatedCount,
            onclick: fetchDownloadDoctorData,
          },
          {
  icon: <UserIcon className="text-[#0A0A64] font-extrabold" />,
  label: "Doctors Empaneled",
  value: doctorCount,
  onclick: fetchDownloadDoctorData,
},
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-lg p-4 space-y-2 border border-gray-200 shadow"
          >
            {item.icon}
            <p className="text-lg font-bold mt-4 text-gray-500">{item.label}</p>
            <motion.h3
              className="text-lg font-semibold mt-2 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <ErrorBoundary fallbackValue={item.value}>
                <AnimatedCounter end={item.value} />
              </ErrorBoundary>
            </motion.h3>
            <motion.button
              className="px-4 py-2 bg-[#0A0A64] text-white text-md w-full font-bold rounded-md transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.onclick || (() => { })}
            >
              Download
            </motion.button>
          </motion.div>
        ))}
      </motion.div>


      {/* Representative Wise Count */}
<motion.div className="space-y-4 mt-10" variants={itemVariants}>
  <div className="flex justify-between items-center my-5">
    <h4 className="text-xl font-bold">
      {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? "Template Wise Count" : "Image Template Usage"}
    </h4>
  </div>
  
  <motion.table
    className="w-full text-sm text-left border rounded-md overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <thead className="bg-gray-100">
      <tr className="text-gray-500">
        <th className="p-2">Template Name</th>
        <th className="p-2">
          {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? "No. of Videos" : "No. of Images"}
        </th>
        {!FEATURE_FLAGS.ENABLE_VIDEO_FEATURES && (
          <>
            <th className="p-2">Doctors</th>
            <th className="p-2">Actions</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? (
        employees.map((emp, idx) => (
          <motion.tr
            key={idx}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={tableRowVariants}
            className="border-t-2 border-gray-200 text-lg font-semibold"
            whileHover={{ backgroundColor: "#f8fafc" }}
          >
            <td className="p-2">{emp.template_name}</td>
            <td className="p-2">{emp.video_count}</td>
          </motion.tr>
        ))
      ) : (
        imageTemplateUsage.map((template, idx) => (
          <motion.tr
            key={idx}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={tableRowVariants}
            className="border-t-2 border-gray-200 text-lg font-semibold"
            whileHover={{ backgroundColor: "#f8fafc" }}
          >
            <td className="p-2">{template.template_name}</td>
            <td className="p-2">{template.usage_count}</td>
            <td className="p-2">
              <button
                onClick={() => {
                  setSelectedTemplateDoctors(template.doctor_names);
                  setSelectedTemplateName(template.template_name);
                  setShowDoctorModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Doctors ({template.doctor_names.length})
              </button>
            </td>
            <td className="p-2">
              <button
                onClick={() => downloadDoctorList(template.doctor_names, template.template_name)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download
              </button>
            </td>
          </motion.tr>
        ))
      )}
    </tbody>
  </motion.table>
</motion.div>

{/* Doctor Names Modal */}
{showDoctorModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          Doctors using "{selectedTemplateName}"
        </h3>
        <button
          onClick={() => setShowDoctorModal(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {selectedTemplateDoctors.map((doctorName, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded">
            {doctorName}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            downloadDoctorList(selectedTemplateDoctors, selectedTemplateName);
            setShowDoctorModal(false);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download List
        </button>
      </div>
    </div>
  </div>
)}


    </motion.div>
  );
};

export default Dashboard;