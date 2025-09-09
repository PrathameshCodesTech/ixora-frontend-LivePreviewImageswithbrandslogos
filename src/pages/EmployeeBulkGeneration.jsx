import React, { useState } from 'react';
import { Plus, Download, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createBulkEmployee, CreateEmployee } from '../api';
import { FaSearch } from 'react-icons/fa';
import logo from '../assets/ixoralogo.png';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

const EmployeeBulkGeneration = () => {
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('bulk');
    const [employeeForm, setEmployeeForm] = useState({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        date_joined: new Date().toISOString().split('T')[0],
        user_type: 'Employee'
    });
    const navigate = useNavigate();

    // Handle file upload with XLS-specific handling
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        // Validate file extension
        const validExtensions = ['.xls', '.xlsx', '.csv'];
        const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(`.${fileExtension}`)) {
            toast.error('Please upload a valid Excel file (.xls, .xlsx, .csv)');
            return;
        }

        setFileName(uploadedFile.name);
        setFile(uploadedFile);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                // Add XLS-specific parsing options
                const workbook = XLSX.read(data, { 
                    type: 'array',
                    cellDates: true,  // Important for date handling in XLS
                    cellNF: true,    // Preserve number formats
                    bookVBA: true   // Support for older Excel formats
                });
                
                if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                    throw new Error('No sheets found in the Excel file');
                }
                
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                if (!worksheet) {
                    throw new Error('Could not read the first sheet');
                }
                
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (!jsonData || jsonData.length === 0) {
                    throw new Error('No data found in the sheet');
                }
                
                // Validate and map Excel data
                const formattedData = jsonData.map((row, index) => {
                    if (!row.first_name || !row.email) {
                        toast.error(`Row ${index + 2} is missing required fields (first_name or email)`);
                        return null;
                    }

                    return {
                        first_name: row.first_name?.toString() || '',
                        last_name: row.last_name?.toString() || '',
                        email: row.email?.toString() || '',
                        phone: row.phone?.toString() || '',
                        department: row.department?.toString() || '',
                        date_joined: row.date_joined ? 
                            new Date(row.date_joined).toISOString().split('T')[0] : 
                            new Date().toISOString().split('T')[0],
                        status: 'active'
                    };
                }).filter(item => item !== null);

                setExcelData(formattedData);
                toast.success(`Successfully loaded ${formattedData.length} employees`);
            } catch (error) {
                console.error('Excel parsing error:', error);
                toast.error(`Error reading Excel file: ${error.message}`);
                setExcelData([]);
                setFileName('');
                setFile(null);
            }
        };
        reader.onerror = () => {
            toast.error('Error reading file');
            setExcelData([]);
            setFileName('');
            setFile(null);
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    // Handle bulk upload
    const handleBulkUpload = async () => {
        if (!file) {
            toast.error('Please upload an Excel file first');
            return;
        }

        if (excelData.length === 0) {
            toast.error('No valid employee data found to upload');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Uploading employee data...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await createBulkEmployee(formData);
            
          
            toast.success('Bulk upload successful!', { id: toastId });
            setExcelData([]);
            setFileName('');
            setFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Error: ${error.message}`, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const employeeData = {
                employee_id: employeeForm.employee_id,
                first_name: employeeForm.first_name,
                last_name: employeeForm.last_name,
                email: employeeForm.email,
                phone: employeeForm.phone,
                department: employeeForm.department,
                date_joined: employeeForm.date_joined,
                user_type: employeeForm.user_type
            };
            
            const response = await CreateEmployee(employeeData);
            
            if (response.status === 201) {
                toast.success('Employee created successfully!');
                setEmployeeForm({
                    employee_id: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    department: '',
                    date_joined: new Date().toISOString().split('T')[0],
                    user_type: 'Employee'
                });
            } else {
                const result = await response.json();
                throw new Error(result.message || 'Failed to create employee');
            }
        } catch (error) {
            console.error('Create employee error:', error);
            toast.error(`Error creating employee: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter employees based on search term
    const filteredData = excelData.filter(employee => {
        const searchString = `${employee.first_name} ${employee.last_name} ${employee.email} ${employee.department}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    const handleDownloadSample = () => {
        try {
            const link = document.createElement("a");
            link.href = "/sample/bulk_uploademployee_docter.xls";
            link.download = "bulk_uploademployee_docter.xls";
            document.body.appendChild(link);    
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error('Error downloading sample file');
            console.error('Download error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="flex justify-between items-center mb-6 mx-5">
                <h1 className="text-xl tracking-wide font-bold"></h1>
                <img
                    src={logo}
                    alt="Company Logo"
                    className="w-auto h-20 object-cover"
                />
            </div>
            <div className="text-md text-gray-500 font-bold mb-4">
                Employee Management &gt; <span className="text-black">
                    {activeTab === 'bulk' ? 'Bulk Upload' : 'Create Employee'}
                </span>
            </div>
    
            {/* Tab buttons */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md font-medium ${activeTab === 'bulk' ? 'bg-[#000050] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('bulk')}
                >
                    Bulk Upload
                </button>
                <button
                    className={`px-4 py-2 rounded-md font-medium ${activeTab === 'create' ? 'bg-[#000050] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create Employee
                </button>
            </div>
    
            {activeTab === 'bulk' ? (
                <>
                    <div className="flex items-center space-x-3 mb-6">
                        <button 
                            onClick={handleDownloadSample}
                            className="bg-[#e0f7df] text-green-800 p-2 rounded hover:bg-[#c8f0cc] transition flex items-center space-x-1"
                        >
                            <Download size={20} />
                            <span className="text-sm">Download Sample</span>
                        </button>
                      
                        {/* File upload button */}
                        <label className="bg-[#cce0fb] text-[#000050] p-2 rounded cursor-pointer hover:bg-[#b8d4fa] transition flex items-center space-x-1">
                            <Plus size={20} />
                            <span className="text-sm">Upload File</span>
                            <input 
                                type="file" 
                                accept=".xls,.xlsx,.csv" 
                                onChange={handleFileUpload} 
                                className="hidden"
                            />
                        </label>
                        
                        <span className={`text-lg ${fileName ? 'text-gray-600' : 'text-gray-400'}`}>
                            {fileName || 'No file selected'}
                        </span>
                        
                        <div className="flex ml-auto items-center space-x-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border px-4 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">
                                    <FaSearch className="inline" />
                                </span>
                            </div>
                        </div>
                    </div>
            
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.length > 0 ? (
                                    filteredData.map((employee, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {employee.first_name || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.last_name || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.email || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.phone || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.department || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.date_joined || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        defaultChecked={employee.status === 'active'} 
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            {searchTerm && excelData.length > 0 
                                                ? 'No matching employees found' 
                                                : fileName 
                                                    ? 'No valid employee data found in the file' 
                                                    : 'Upload an Excel file to view employee data'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
            
                    <div className="flex justify-center space-x-4 mt-6">
                        <button 
                            className="border-2 border-blue-900 px-6 py-2 rounded font-bold hover:bg-gray-50 transition"
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Back
                        </button>
                        <button 
                            className="bg-[#000050] text-white px-6 py-2 rounded font-bold hover:bg-[#000070] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleBulkUpload}
                            disabled={isLoading || !file || excelData.length === 0}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Upload'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6">Create New Employee</h2>
                    <form onSubmit={handleCreateEmployee}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID*</label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={employeeForm.employee_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={employeeForm.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={employeeForm.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={employeeForm.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={employeeForm.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={employeeForm.department}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                                <input
                                    type="date"
                                    name="date_joined"
                                    value={employeeForm.date_joined}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                                <select
                                    name="user_type"
                                    value={employeeForm.user_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Employee">Employee</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                className="border-2 border-blue-900 px-6 py-2 rounded font-bold hover:bg-gray-50 transition"
                                onClick={() => navigate(-1)}
                                disabled={isLoading}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="bg-[#000050] text-white px-6 py-2 rounded font-bold hover:bg-[#000070] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};



export default EmployeeBulkGeneration;