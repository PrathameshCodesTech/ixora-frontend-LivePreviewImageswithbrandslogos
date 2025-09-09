import React, { useState } from 'react';
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import logo from '../assets/ixoralogo.png';
import Avatar from '../assets/blank.jpg';
import { BulkDoctorVideoGeneration } from '../api';

const Doctors = () => {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('bulk');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [importData, setImportData] = useState([]);
  const navigate = useNavigate();

  // Calculate import statistics
 const totalRecords = importData.length;
  const successRecords = importData.filter(item => item.status === "success").length;
  const errorRecords = importData.filter(item => item.status === "error").length;

    const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      toast.error('No file selected');
      return;
    }

    // Validate file extension
    const validExtensions = ['.xls', '.xlsx', '.csv'];
    const fileExtension = uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid Excel file (.xls, .xlsx, .csv)');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    setFileName(uploadedFile.name);
    console.log("File name that is uploaded",uploadedFile.name)
    setFile(uploadedFile);

    try {
      // Read the Excel file
      const data = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        throw new Error('No data found in the Excel file');
      }

      // Format and validate data
      const formattedData = jsonData.map((row, index) => {
        const errors = [];
        if (!row['name']) errors.push("Name is required");
        if (!row['designation']) errors.push("Designation is required");
        if (!row['clinic']) errors.push("Clinic is required");
        if (!row['mobile_number']) errors.push("Mobile number is required");
        if (!row['specialization']) errors.push("Specialization is required");

        return {
          id: index + 1,
          emp_id: row['emp_id']?.toString() || `EMP${index + 1}`,
          name: row['name']?.toString() || '',
          designation: row['designation']?.toString() || '',
          clinic: row['clinic']?.toString() || '',
          city: row['city']?.toString() || '',
          state: row['state']?.toString() || '',
          specialization: row['specialization']?.toString() || '',
          mobile_number: row['mobile_number']?.toString() || '',
          whatsapp_number: row['whatsapp_number']?.toString() || row['mobile_number']?.toString() || '',
          description: row['description']?.toString() || '',
          image_url: row['image_url']?.toString() || '',
          employee_email: row['employee_email']?.toString() || '',
          errorDetails: errors.length > 0 ? errors.join(', ') : '—',
          status: errors.length > 0 ? "error" : "success"
        };
      });

      setImportData(formattedData);
      setExcelData(formattedData);
      toast.success(`Successfully loaded ${formattedData.length} doctors`);
      setActiveStep(2); // Move to check records step

    } catch (error) {
      console.error('File processing error:', error);
      toast.error(`Error: ${error.message}`);
      setFileName('');
      setFile(null);
      setImportData([]);
      setExcelData([]);
    }
  };


  const handleStepClick = (stepNumber) => {
    if (stepNumber === 2 && !file) {
      toast.error('Please upload a file first');
      return;
    }
    setActiveStep(stepNumber);
  };

  const handleDownloadSample = () => {
    try {
      const link = document.createElement("a");
      link.href = "/sample/doctor_video_bulk_upload_dummy_template.xls";
      link.download = "doctor_video_bulk_upload_dummy_template.xls";
      document.body.appendChild(link);    
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Error downloading sample file');
      console.error('Download error:', error);
    }
  };

 const handleStartImport = async () => {
  setIsLoading(true);
  const toastId = toast.loading('Starting bulk video generation...');
  
  try {
    if (!file) {
      toast.error('No file available for upload', { id: toastId });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await BulkDoctorVideoGeneration(formData);
    
    // Check for successful response based on actual API structure
    if (response.created >= 0) {  // or response.errors.length === 0
      toast.success(`Success! Created ${response.created} videos, skipped ${response.skipped}`, { 
        id: toastId 
      });
      setActiveStep(4);
    } else {
      toast.error(`Processed with ${response.errors.length} errors`, { 
        id: toastId 
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    toast.error(
      error.response?.data?.message || 
      error.message || 
      'An error occurred during bulk generation', 
      { id: toastId }
    );
  } finally {
    setIsLoading(false);
  }
};


  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const toggleAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRows(importData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

   const filteredData = importData.filter(doctor => {
    const searchString = `${doctor.name} ${doctor.specialization} ${doctor.clinic} ${doctor.city}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <img src={logo} alt="Company Logo" className="h-12" />
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={Avatar}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-md text-gray-500 mb-4">
        <span className="font-bold">Doctor Management</span> &gt; <span className="font-bold text-black">Bulk Import</span>
      </div>

      <div className="flex justify-center items-center mb-8">
        <div className="flex space-x-8 mr-4">
          {["Add File", "Check Records", "Errors", "Completed"].map((step, index) => (
            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => handleStepClick(index + 1)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                activeStep > index ? "bg-blue-400" : activeStep === index + 1 ? "bg-blue-600" : "bg-gray-200 text-black"
              }`}>
                {index + 1}
              </div>
              <span className={`mt-1 text-xs ${activeStep === index + 1 ? "text-blue-600 font-bold" : "text-gray-600"}`}>{step}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="relative">
            <input 
              type="text"
              className="border border-gray-300 rounded px-3 py-2 pl-8"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {activeStep === 1 && (
        <div className='flex gap-3 mt-5'>
          <div className='border border-[#CCE4FF] px-10 bg-[#CCE4FF] rounded-xl shadow-xl'></div>
          <div className="mx-auto border w-[100%] border-gray-200 p-8 rounded-md shadow-xl px-20">
            <p className="text-center font-bold my-5">
              To bulk import doctors, submit an Excel file using our template
            </p>

            <div className="flex items-center space-x-4 my-8 border-b-2 border-gray-200 py-3">
              <label className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800 transition">
                <Plus size={16} className="inline mr-2" />
                Choose file
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".xls,.xlsx,.csv"
                  className="hidden"
                />
              </label>
              <span className="text-gray-600 font-bold pl-10">
                {fileName ? fileName : "No file chosen"}
              </span>
            </div>

            <button 
              onClick={handleDownloadSample} 
              className="border-2 border-blue-900 text-blue-900 px-6 py-2 rounded font-bold hover:bg-blue-50 flex items-center mx-auto"
            >
              <Download size={16} className="mr-2" />
              Download Sample Excel
            </button>

            <div className="flex justify-center mt-10 space-x-4">
              <button 
                className="border-2 border-blue-900 text-blue-900 px-6 py-2 rounded font-bold hover:bg-blue-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                className={`bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setActiveStep(2)}
                disabled={!file}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className='flex gap-3 mt-5'>
          <div className='border border-[#CCE4FF] px-10 bg-[#CCE4FF] rounded-xl shadow-xl'></div>
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Review Import Data</h2>
              <div className="text-gray-600">
                <span className="font-bold">{filteredData.length}</span> records found
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                        onChange={toggleAllRows}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.id} className={row.status === "error" ? "bg-red-50" : "hover:bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="rounded text-blue-600 focus:ring-blue-500"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRowSelection(row.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.emp_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.clinic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.specialization}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.mobile_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            row.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching doctors found' : 'No data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="flex justify-between mt-4">
              <div className="text-sm text-gray-500">
                {selectedRows.length > 0 && `${selectedRows.length} selected`}
              </div>
              <div className="flex space-x-4">
                <button 
                  className="border-2 border-blue-900 text-blue-900 px-6 py-2 rounded font-bold hover:bg-blue-50"
                  onClick={() => setActiveStep(1)}
                >
                  Back
                </button>
                <button 
                  className={`bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 ${
                    filteredData.some(item => item.status === "error") ? 'bg-yellow-600 hover:bg-yellow-700' : ''
                  }`}
                  onClick={() => setActiveStep(3)}
                >
                  {filteredData.some(item => item.status === "error") ? 'Review Errors' : 'Start Importing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className='flex gap-3 mt-5'> 
          <div className='border border-[#CCE4FF] px-10 bg-[#CCE4FF] rounded-xl shadow-xl'></div>
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Status</h2>
              <div className="text-gray-600">
                <span className="font-bold">{successRecords}/{totalRecords}</span> records successfully imported
                {errorRecords > 0 && (
                  <>
                    <span className="mx-4">|</span>
                    <span className="text-red-600">{errorRecords} errors</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row) => (
                    <tr key={row.id} className={row.status === "error" ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.emp_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.clinic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        row.status === "error" ? "text-red-600 font-medium" : "text-gray-500"
                      }`}>
                        {row.errorDetails}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              <button 
                className="border-2 border-blue-900 text-blue-900 px-6 py-2 rounded font-bold hover:bg-blue-50"
                onClick={() => setActiveStep(2)}
              >
                Back
              </button>
              <button 
                className="bg-blue-900 text-white px-6 py-2 rounded font-bold hover:bg-blue-800 disabled:opacity-50"
                onClick={handleStartImport}
                disabled={isLoading || successRecords === 0}
              >
                {isLoading ? 'Generating Videos...' : 'Generate Bulk Videos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 4 && (
        <div className="flex justify-center">
          <div className="max-w-xl w-full border border-gray-200 p-8 rounded-md shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Import Completed</h2>
            <p className="text-gray-600 mb-6">
              {successRecords} records imported successfully. {errorRecords > 0 && (
                <span className="text-red-600">{errorRecords} records had errors.</span>
              )}
            </p>
            <div className='flex gap-3 justify-center'>
              <button 
                className='border-2 border-blue-900 px-6 py-2 rounded font-bold hover:bg-blue-50'
                onClick={() => {
                  setActiveStep(1);
                  setFileName('');
                  setFile(null);
                  setImportData([]);
                  setSelectedRows([]);
                }}
              >  
                Import More
              </button>
              <button 
                className="bg-blue-900 text-white px-6 py-2 rounded font-bold hover:bg-blue-800"
                onClick={() => navigate('/gallery')}
              >
                View Generated Videos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;