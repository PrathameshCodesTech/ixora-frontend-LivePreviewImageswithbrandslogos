import axios from "axios";
import {
  setItemInLocalStorage,
  getItemInLocalStorage,
} from "../utils/loacalStorage";
import toast from "react-hot-toast";

// const BASE_URL = `https://api.videomaker.digielvestech.in`;
const BASE_URL = window.location.hostname === 'localhost'    
    ? 'http://localhost:8000'    
    : 'https://api2.digielvestech.in';


// Global axios error handler with token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getItemInLocalStorage("Refresh")?.replace(/"/g, '');
        
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          setItemInLocalStorage("Access_Token", newAccessToken);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        setItemInLocalStorage("Access_Token", null);
        setItemInLocalStorage("Refresh", null);
        toast.error("Session expired. Please login again.");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment and try again.");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export const employeelogin = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login/`, data);
    return response.data;
  } catch (error) {
    console.log("Error in login", error);
    throw error;
  }
};

export const doctorVideoGeneration = async (FormData) => {
  try {
    console.log("🔍 CALLING VIDEO GENERATION ENDPOINT");
    const response = await axios.post(
      `${BASE_URL}/api/generate-video/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in Adding doctorVideoGeneration details", error);
    throw error;
  }
};

export const employeeCreation = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/employees/`, data);
    return response.data;
  } catch (error) {
    console.log("Error in creation of employee", error);
    throw error;
  }
};

export const getAllDoctors = async (page = 1, search = '', specialization = '') => {
  const params = new URLSearchParams({ 
    page: page.toString(),
    user_type: 'Admin',
    employee_id: getItemInLocalStorage('UserId')?.replace(/"/g, '') || ''
  });
  if (search) params.append('search', search);
  if (specialization) params.append('specialization', specialization);
  
  const token = getAuthToken(); // Use your existing helper function
  
  const response = await axios.get(`${BASE_URL}/api/doctors/?${params}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getFilteredVideoTemplates = async (status) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/video-templates/?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.log("Error In Getting templates", error);
    throw error;
  }
};
export const getTemplateCount = async (templateType = 'video') => {
  try {
    const response = await axios.get(`${BASE_URL}/video/template-count/?template_type=${templateType}`);
    return response.data;
  } catch (error) {
    console.log("Error In Getting templates count", error);
    throw error;
  }
};
export const getVideoTemplates = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/video-templates/?status=true`
    );
    return response.data;
  } catch (error) {
    console.log("Error In Getting templates", error);
    throw error;
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/employees/`);
    return response.data;
  } catch (error) {
    console.log("Error Getting the employee details", error);
    throw error;
  }
};

export const createBulkEmployee = async (FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/bulk-upload-employees/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error uploading bulk employee", error);
    throw error;
  }
};

export const getAllDoctorsVideosByEmployee = async (empId, page = 1, search = '', specialization = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    employee_id: empId,
    user_type: getItemInLocalStorage('UserType')?.replace(/"/g, '') || 'Employee'  
  });
  if (search) params.append('search', search);
  if (specialization) params.append('specialization', specialization);
  
  const token = getAuthToken();
  
  try {
    const response = await axios.get(`${BASE_URL}/api/doctors-by-employee/?${params}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors by employee:', error.response?.data || error.message);
    throw error;
  }
};


export const CreateEmployee = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/employees/`, data);
    return response;
  } catch (error) {
    console.log("Error Creating the employee", error);
    throw error;
  }
};

export const EditEmployee = async (FormData, id) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/employees/${id}/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.log("Error Updating The Employee", error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.log("Error in deleting the video", error);
    throw error;
  }
};

export const getDoctorExcel = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/export-doctor-videos/`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.log("Error Getting doctors in excel format", error.message);
    throw error;
  }
};

export const getEmployeeExcel = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/export-employees/`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.log("Error Getting the employee in excel", error.message);
    throw error;
  }
};

export const recreateVideo = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/generate-doctor-video/`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error Recreating the video", error.message);
    throw error;
  }
};

export const BulkDoctorVideoGeneration = async (FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/bulk-upload-doctors/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating the bulk video", error.message);
    throw error;
  }
};
export const TotalEmployeeActive = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/employees/`);
    return response.data;
  } catch (error) {
    console.log("Error Getting Employee Active Details", error);
    throw error;
  }
};

// export const AddEmployeeTemplates = async (FormData) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/api/video-templates/`,
//       FormData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.log("Error creating template", error);
//     throw error;
//   }
// };


//! Working!
// export const AddEmployeeTemplates = async (FormData, templateType = 'video') => {
//   try {
//     const endpoint = templateType === 'image' ? '/api/image-templates/' : '/api/video-templates/';
//     const response = await axios.post(
//       `${BASE_URL}${endpoint}`,
//       FormData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.log("Error creating template", error);
//     throw error;
//   }
// };

export const AddEmployeeTemplates = async (FormData, templateType = 'video') => {
  try {
    // Add template_type to the FormData so backend knows what type it is
    FormData.append('template_type', templateType);
    
    const endpoint = templateType === 'image' ? '/api/image-templates/' : '/api/video-templates/';
    const response = await axios.post(
      `${BASE_URL}${endpoint}`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating template", error);
    throw error;
  }
};

export const updateEmployeeTemplatesStatus = async (id, FormData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/video-templates/${id}/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating template", error);
    throw error;
  }
};

// export const getTemplatesDetails = async (templateType = null) => {
//   try {
//     let url = `${BASE_URL}/api/video-templates/`;
//     if (templateType === 'image') {
//       url = `${BASE_URL}/api/image-templates/`;
//     }
//     const response = await axios.get(url);
//         // DEBUG: Check what backend is sending
//     console.log("API Response for templates:", response.data);
//     console.log("First template structure:", response.data[0]);

//     return response.data;
//   } catch (error) {
//     console.log("Error getting template ", error);
//     throw error;
//   }
// };

export const getTemplatesDetails = async (templateType = 'video', params = {}) => {
  try {
    // Always use video-templates endpoint but with template_type parameter
    const queryParams = new URLSearchParams({
      template_type: templateType,
      ...params
    }).toString();
    
    const url = `${BASE_URL}/api/video-templates/?${queryParams}`;
    console.log("API URL:", url); // DEBUG
    
    const response = await axios.get(url);
    console.log("API Response for templates:", response.data); // DEBUG
    
    return response.data;
  } catch (error) {
    console.log("Error getting template ", error);
    throw error;
  }
};


export const getTemplatesDetailsById = async (id) => {
  try {
    // First try to get it as an image template since that's what you're using
    const response = await axios.get(`${BASE_URL}/api/image-templates/${id}/`);
    return response.data;
  } catch (error) {
    console.log("Error getting image template ", error);
    throw error;
  }
};

export const editTemplatesDetailsById = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/video-templates/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error getting template ", error);
    throw error;
  }
};

export const createDoctorVideo = async (FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/generate-doctor-video/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error Creating Doctor Video", error);
    throw error;
  }
};

export const getGeneratedVideosOnId = async (empid) => {
  try {
    const response = axios.get(
      `${BASE_URL}/api/generate-doctor-video/?employee_id=${empid}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting the data", error);
    throw error;
  }
};

export const getGeneratedDoctorVideos = async (doctorId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/generate-doctor-video/?doctor_id=${doctorId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting the doctor data", error);
    throw error;
  }
};
export const UpdateLoginFormData = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/employees/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error updating the list", error);
    throw error;
  }
};

// Image Template APIs
export const getImageTemplates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/image-templates/`);
    return response.data;
  } catch (error) {
    console.log("Error getting image templates", error);
    throw error;
  }
};

export const addImageTemplate = async (FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/image-templates/`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating image template", error);
    throw error;
  }
};

export const generateImageContent = async (data) => {
  try {
    const token = getAuthToken(); // Add this line
    const response = await axios.post(`${BASE_URL}/api/generate-image/`, data, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined // Add this line
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error generating image content", error);
    throw error;
  }
};

export const searchDoctor = async (mobile, employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/search-doctor/?mobile=${mobile}&employee_id=${employeeId}`);
    return response.data;
  } catch (error) {
    console.log("Error searching doctor", error);
    throw error;
  }
};

// ADD TO YOUR api.js FILE:
export const getGeneratedDoctorImages = async (doctorId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/image-contents/?doctor_id=${doctorId}`);
    return response.data.results || response.data; // Handle both paginated and direct response
  } catch (error) {
    console.log("Error getting doctor images", error);
    throw error;
  }
};

const getAuthToken = () => {
  let token = localStorage.getItem('Access_Token') || 
              localStorage.getItem('access_token') || 
              localStorage.getItem('access');
  if (token) {
    token = token.replace(/"/g, ''); // Remove quotes
  }
  return token;
};

export const updateDoctor = async (doctorId, formData) => {
  const token = getAuthToken();
  
  const response = await axios.patch(`${BASE_URL}/api/doctor/${doctorId}/`, formData, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data' 
    }
  });
  return response.data;
};

export const deleteDoctor = async (doctorId, params = {}) => {
  console.log("DELETE URL:", `${BASE_URL}/api/doctors/${doctorId}/`);
  console.log("Params:", params);
  try {
    const token = getItemInLocalStorage("Access_Token")?.replace(/"/g, "");
    
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.delete(`${BASE_URL}/api/doctor/${doctorId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: params
    });

    return response.data;
  } catch (error) {
    console.error("Delete API error:", error);
    
    // Handle axios error response
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        throw new Error("You don't have permission to delete this doctor");
      } else if (status === 404) {
        throw new Error("Doctor not found");
      } else if (status === 405) {
        throw new Error("Delete method not allowed on this endpoint");
      } else {
        throw new Error(error.response.data?.error || 'Failed to delete doctor');
      }
    }
    
    throw error;
  }
};

export const deleteContent = async (contentType, contentId) => {
  let token = localStorage.getItem('Access_Token');
  if (token) {
    token = token.replace(/"/g, ''); // Remove quotes
  }
  
  const response = await axios.delete(`${BASE_URL}/api/delete-content/${contentType}/${contentId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const regenerateContent = async (data) => {
  const token = getAuthToken();
  
  console.log("🔍 Cleaned token:", token ? "EXISTS" : "NOT FOUND");
  console.log("🔍 Token preview:", token?.substring(0, 20) + "...");
  
  const response = await axios.post(`${BASE_URL}/api/regenerate-content/`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getAllBrands = async () => {
  try {
    console.log("BRANDS ENDPOINT");
    const response = await axios.get(`${BASE_URL}/api/brands/`);
    return response.data;
  } catch (error) {
    console.log("Error in fetching medicinal brands", error);
    throw error;
  }
};

export const postBrandPosition = async (templateId, brandId, position) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/brand-position/`, {
      template: templateId,
      brand: brandId,
      x: position.x,
      y: position.y,
      width: position.width || 100,
      height: position.height || 100
    });
    return response.data;
  } catch (error) {
    console.error('Brand position save error:', error);
    throw error;
  }
};

export const getImageTemplateUsage = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/image-template-usage/`);
    return response.data;
  } catch (error) {
    console.log("Error getting image template usage", error);
    throw error;
  }
};

export const getTaskStatus = async (taskId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/task-status/${taskId}/`);
    return response.data;
  } catch (error) {
    console.log("Error getting task status", error);
    throw error;
  }
};


export const getDoctorUsageHistory = async (doctorId, employeeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/doctor-usage-history/`, {
      params: { doctor_id: doctorId, employee_id: employeeId },
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error getting doctor usage history", error);
    throw error;
  }
};

export const getSharedDoctors = async (employeeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/shared-doctors/`, {
      params: { employee_id: employeeId },
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error getting shared doctors", error);
    throw error;
  }
};

export const checkDoctorSharedStatus = async (doctorId, employeeId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/doctor-usage-history/`, {
      params: { doctor_id: doctorId, employee_id: employeeId },
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      }
    });
    const otherEmployeeUsage = response.data.filter(h => !h.is_current_employee);
    return {
      isShared: otherEmployeeUsage.length > 0,
      otherEmployees: otherEmployeeUsage
    };
  } catch (error) {
    console.log("Error checking doctor shared status", error);
    return { isShared: false, otherEmployees: [] };
  }
};