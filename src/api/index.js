import axios from "axios";
import {
  setItemInLocalStorage,
  getItemInLocalStorage,
} from "../utils/loacalStorage";

// const BASE_URL = `https://api.videomaker.digielvestech.in`;
const BASE_URL = `http://localhost:8000`;

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
  const params = new URLSearchParams({ page: page.toString() });
  if (search) params.append('search', search);
  if (specialization) params.append('specialization', specialization);
  
  const response = await axios.get(`${BASE_URL}/api/doctors/?${params}`);
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
    employee_id: empId 
  });
  if (search) params.append('search', search);
  if (specialization) params.append('specialization', specialization);
  
  const response = await axios.get(`${BASE_URL}/api/doctors-by-employee/?${params}`);
  return response.data;
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
    const response = await axios.get(`${BASE_URL}/api/video-templates/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error getting template ", error);
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
    const response = await axios.post(`${BASE_URL}/api/generate-image/`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.log("Error generating image content", error);
    throw error;
  }
};

export const searchDoctor = async (mobile) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/search-doctor/?mobile=${mobile}`);
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

export const updateDoctor = async (doctorId, formData) => {
  let token = localStorage.getItem('Access_Token');
  if (token) {
    token = token.replace(/"/g, ''); // Remove quotes
  }
  
  const response = await axios.patch(`${BASE_URL}/api/doctors/${doctorId}/`, formData, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data' 
    }
  });
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  let token = localStorage.getItem('Access_Token');
  if (token) {
    token = token.replace(/"/g, ''); // Remove quotes
  }
  
  const response = await axios.delete(`${BASE_URL}/api/doctors/${doctorId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
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
  let token = localStorage.getItem('Access_Token');
  
  // CLEAN THE TOKEN - Remove quotes if they exist
  if (token) {
    token = token.replace(/"/g, ''); // Remove all quotes
  }
  
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