import React, { useEffect, useState } from 'react'
import { getAllEmployees, EditEmployee , getEmployeeExcel} from '../api'
import toast from 'react-hot-toast'
import logo from '../assets/ixoralogo.png'
import { FaEdit, FaChevronLeft, FaChevronRight, FaSearch , FaDownload} from 'react-icons/fa'
import { getItemInLocalStorage } from '../utils/loacalStorage'

const UserDetails = () => {
    const [userDetails, setUserDetails] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [employeesPerPage, setEmployeesPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const ID = getItemInLocalStorage('Id');

    const getEmployeeDetails = async () => {
        try {
            const response = await getAllEmployees();
            setUserDetails(response)
            setFilteredEmployees(response)
        } catch (error) {
            console.log('Error in displaying employee details', error)
            toast.error('Unable To Display Employee Details')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusToggle = async (employee) => {
        try {
            const newStatus = employee.status === 'active' ? false : true;
            
            // Create FormData object
            const formData = new FormData();
            formData.append('status', newStatus.toString());
            
            // Preserve other fields if needed
            if (employee.first_name) formData.append('first_name', employee.first_name);
            if (employee.last_name) formData.append('last_name', employee.last_name);
            if (employee.department) formData.append('department', employee.department);
            // Add other fields as needed
            
            await EditEmployee(formData, employee.id);
            console.log(employee.id)
            const updatedStatus = newStatus ? 'active' : 'inactive';
            // Update local state
            setUserDetails(prev => prev.map(emp => 
            emp.id === employee.id ? { ...emp, status: updatedStatus } : emp
        ));
            setFilteredEmployees(prev => prev.map(emp => 
            emp.id === employee.id ? { ...emp, status: updatedStatus } : emp
        ));
            
            toast.success(`Employee status updated to ${newStatus}`);
        } catch (error) {
            console.log('Error updating employee status', error);
            toast.error('Failed to update employee status');
        }
    };

    useEffect(() => {
        getEmployeeDetails()
    }, [])

    // Filter employees based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredEmployees(userDetails)
        } else {
            const filtered = userDetails.filter(employee => {
                const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.toLowerCase()
                return fullName.includes(searchTerm.toLowerCase())
            })
            setFilteredEmployees(filtered)
        }
        setCurrentPage(1) // Reset to first page when search changes
    }, [searchTerm, userDetails])

    // Reset to first page when items per page changes
    useEffect(() => {
        setCurrentPage(1)
    }, [employeesPerPage])

    // Get current employees
    const indexOfLastEmployee = currentPage * employeesPerPage
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEmployees.length / employeesPerPage)))
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setEmployeesPerPage(Number(e.target.value))
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <h1>Displaying Employee Data...</h1>
            </div>
        )
    }

 const downloadEmployeeDetailse = async () =>{
    try {
        toast.loading("Preparing download...", { id: "excel-download" });
        const response = await getEmployeeExcel();
        if(!response){
            throw new Error("No data received ");
        }
       if(response instanceof Blob){
        const url = window.URL.createObjectURL(response)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'employee_data.xlsx'); 
        document.body.appendChild(link)
        link.click()

         window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Excel file downloaded successfully!", { id: "excel-download" });
       }
       else if (response.url) {
      window.open(response.url, '_blank');
      toast.success("Opening download...", { id: "excel-download" });
    } 
    else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Download error:", error);
    toast.error(error.message || "Failed to download Excel file", { 
      id: "excel-download" 
    });
  }
};
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 mx-5">
                <h1 className="text-xl tracking-wide font-bold"></h1>
                <img
                    src={logo}
                    alt="User"
                    className="w-auto h-20 object-cover"
                />
            </div>
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing {indexOfFirstEmployee + 1}-{Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
                            <select
                                id="itemsPerPage"
                                value={employeesPerPage}
                                onChange={handleItemsPerPageChange}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div>
                            <button
                            onClick={downloadEmployeeDetailse}
                            className='bg-blue-800 text-white px-5 py-2 font-bold rounded cursor-pointer flex gap-2.5 items-center'
                            >
                              <FaDownload/>  Export 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
           
            <div className='flex w-full gap-3'>
                <div className='border hidden md:block border-[#CCE4FF] px-10 bg-[#CCE4FF] rounded-xl shadow-xl '></div>
                <div className="bg-white w-full shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ / City</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RBM</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Option</th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentEmployees.length > 0 ? (
                                    currentEmployees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employee_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {employee.first_name || 'N/A'} {employee.last_name || ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.hq || employee.city || 'N/A'}
                                            </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.rbm_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.department || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {employee.description || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.date_joined ? new Date(employee.date_joined).toLocaleDateString() : 'N/A'}
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900"><FaEdit size={15}/></button>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={employee.status === 'active'}
                                                        onChange={() => handleStatusToggle(employee)}
                                                    />
        <div className={`relative w-11 h-6 rounded-full peer 
            ${employee.status === true ? 'bg-blue-500' : 'bg-gray-300'}
            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
            after:content-[''] after:absolute after:top-[2px] 
            after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 
            after:transition-all peer-checked:after:translate-x-full`}>
        </div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            {searchTerm ? 'No matching employees found' : 'No employee records found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredEmployees.length > employeesPerPage && (
                        <div className="px-5 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <FaChevronLeft className="h-5 w-5" />
                                </button>
                                
                                {/* Page numbers */}
                                <div className="flex mx-2">
                                    {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }).map((_, index) => {
                                        const pageNumber = index + 1
                                        // Show only a subset of page numbers if there are many
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === currentPage ||
                                            pageNumber === currentPage - 1 ||
                                            pageNumber === currentPage + 1 ||
                                            pageNumber === Math.ceil(filteredEmployees.length / employeesPerPage)
                                        ) {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`mx-1 px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                        }
                                        // Show ellipsis for skipped page numbers
                                        if (
                                            (pageNumber === currentPage - 2 && currentPage > 3) ||
                                            (pageNumber === currentPage + 2 && currentPage < Math.ceil(filteredEmployees.length / employeesPerPage) - 2)
                                        ) {
                                            return <span key={index} className="mx-1 px-1">...</span>
                                        }
                                        return null
                                    })}
                                </div>
                                
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
                                    className={`p-1 rounded-md ${currentPage === Math.ceil(filteredEmployees.length / employeesPerPage) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <FaChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDetails