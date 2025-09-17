import React, { useState, useEffect } from 'react';
import { getItemInLocalStorage } from '../utils/loacalStorage';
import { getDoctorUsageHistory, getSharedDoctors } from '../api';
import toast from 'react-hot-toast';

const SharedDoctors = () => {
  const [sharedDoctors, setSharedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedDoctorHistory, setSelectedDoctorHistory] = useState([]);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  
  const employeeId = getItemInLocalStorage("UserId")?.replace(/"/g, '');

  const fetchSharedDoctors = async () => {
    try {
      setLoading(true);
      const response = await getSharedDoctors(employeeId);
      setSharedDoctors(response);
    } catch (error) {
      toast.error("Failed to load shared doctors");
      console.error("Error fetching shared doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewDoctorHistory = async (doctorId, doctorName) => {
    try {
      const history = await getDoctorUsageHistory(doctorId, employeeId);
      setSelectedDoctorHistory(history);
      setSelectedDoctorName(doctorName);
      setShowUsageModal(true);
    } catch (error) {
      toast.error("Failed to load usage history");
    }
  };

  useEffect(() => {
    fetchSharedDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctors Shared Across Employees</h1>
      
      {sharedDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No shared doctors found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sharedDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.mobile_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.original_employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {doctor.usage_count} times
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doctor.last_used).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => viewDoctorHistory(doctor.id, doctor.name)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Usage History Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Usage History for "{selectedDoctorName}"
              </h3>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {selectedDoctorHistory.map((history, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{history.employee_name}</div>
                    <div className="text-sm text-gray-500">Template: {history.template_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(history.generated_at).toLocaleString()}
                    </div>
                    {history.is_current_employee && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedDoctors;