import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  doctorVideoGeneration,
  getAllEmployees,
  getTemplatesDetails,
  getVideoTemplates,
  searchDoctor,
  generateImageContent,
  getImageTemplates,
  getTemplatesDetailsById,
  getAllBrands, // ADD THIS
} from "../api";
import logo from "../assets/ixoralogo.png";
import profile from "../assets/blank.jpg";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import {
  setItemInLocalStorage,
  getItemInLocalStorage,
} from "../utils/loacalStorage";
import toast from "react-hot-toast";


//! DONE - auto-populated

const Profile = () => {
  const navigate = useNavigate();
  const [sameNumber, setSameNumber] = useState(true);
  const [profileImage, setProfileImage] = useState(profile);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const fileInputRef = useRef(null);
  const ID = getItemInLocalStorage("Id");
  console.log(ID);
  const USERTYPE = getItemInLocalStorage("UserType");
  const EMPLOYEE_ID = getItemInLocalStorage("UserId");
  console.log(EMPLOYEE_ID)


  //   const fetchEmployeeAndStoreId = async () =>{
  //     try {
  //         const response = await getAllEmployees();
  //         console.log("getting all datas ",response)
  //     } catch (error) {
  //         console.log("error fetching employees", error)

  //     }

  //   }
  //   useEffect(()=>{
  //         fetchEmployeeAndStoreId()
  //   },[])

  const [errors, setErrors] = useState({
    doctorName: "",
    specialization_key: "",
    specialization: "",
    hospital: "",
    state: "",
    city: "",
    mobileNumber: "",
    whatsappNumber: "",
    description: "Doctor",
    profileImage: "",
    template: "",
  });

  const [formData, setFormData] = useState({
    doctorName: "",
    specialization_key: "",
    specialization: "",
    hospital: "",
    state: "",
    city: "",
    mobileNumber: "",
    whatsappNumber: "",
    description: "Doctor",
    template: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const getCroppedImg = async () => {
    try {
      const croppedImage = await getCroppedImage(originalImage, croppedArea);
      setProfileImage(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error("Error cropping image", e);
    }
  };

  const getCroppedImage = (imageSrc, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredValue = value;

    if (name === "hospital") {
      filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, ""); // Remove symbols
    }

    setFormData({
      ...formData,
      [name]: name === "hospital" ? filteredValue : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      doctorName: "",
      specialization_key: "",
      specialization: "",
      hospital: "",
      state: "",
      city: "",
      mobileNumber: "",
      whatsappNumber: "",
      description: "",
      profileImage: "",
      template: "",
    };

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = "Doctor Name is required";
      valid = false;
    }
    if (!formData.specialization_key.trim()) {
      newErrors.specialization_key = "Specialization key is required";
      valid = false;
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
      valid = false;
    }
    if (!formData.hospital.trim()) {
      newErrors.hospital = "Hospital name is required";
      valid = false;
    }
    if (!formData.template.trim()) {
      newErrors.template = "Select Template";
      valid = false;
    }
    if (!formData.state.trim()) {
      newErrors.state = "State name is required";
      valid = false;
    }
    if (!formData.city.trim()) {
      newErrors.city = "City name is required";
      valid = false;
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Invalid mobile number";
      valid = false;
    }
    if (!formData.whatsappNumber.trim()) {
      // newErrors.whatsappNumber = "WhatsApp number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Invalid WhatsApp number";
      valid = false;
    }
    // Only require photo for video templates
// Only require photo for video templates (images are optional)
if (selectedTemplateType === "video" && profileImage === profile) {
  toast.error("Profile image is required for video templates");
  newErrors.profileImage = "Profile image is required for video templates";
  valid = false;
}
// For image templates, photos are optional - no validation needed

    setErrors(newErrors);
    return valid;
  };

  const handleMobileNumberChange = async (mobileNumber) => {
    // Clear previous messages
    setDoctorFoundMessage("");

    // Only search if mobile number is 10 digits
    if (mobileNumber.length === 10 && /^\d{10}$/.test(mobileNumber)) {
      setIsSearchingDoctor(true);

      try {
        const response = await searchDoctor(mobileNumber);

        if (response.found) {
          const doctor = response.doctor;

          // Auto-populate form with existing doctor data
          setFormData(prev => ({
            ...prev,
            doctorName: doctor.name || "",
            hospital: doctor.clinic || "",
            city: doctor.city || "",
            specialization: doctor.specialization || "",
            specialization_key: doctor.specialization || "",
            state: doctor.state || "",
            // Don't override mobile number as user is typing
          }));

          toast.success(`✅ Doctor found: ${doctor.name} from ${doctor.clinic}`);
          setDoctorFoundMessage("");
        } else {
          toast.info("🆕 New doctor - please fill details");
          setDoctorFoundMessage("");
        }
      } catch (error) {
        console.error("Doctor search error:", error);
        setDoctorFoundMessage("⚠️ Could not search doctor");
      } finally {
        setIsSearchingDoctor(false);
      }
    } else if (mobileNumber.length < 10) {
      setIsSearchingDoctor(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const formDataToSend = new FormData();

      // DEBUG: Check what's in formData before sending
console.log("🔍 FormData before sending:", formData);
console.log("🔍 Doctor name:", formData.doctorName);
console.log("🔍 Hospital/clinic:", formData.hospital);
console.log("🔍 City:", formData.city);
console.log("🔍 State:", formData.state);
console.log("🔍 Specialization:", formData.specialization);
console.log("🔍 Specialization key:", formData.specialization_key);

      // Add all required fields
      formDataToSend.append("employee", ID);
      formDataToSend.append("name", formData.doctorName);
      formDataToSend.append("designation", "Doctor");
      formDataToSend.append("clinic", formData.hospital);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("specialization_key", formData.specialization_key);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("mobile_number", formData.mobileNumber);
      formDataToSend.append("whatsapp_number", formData.whatsappNumber);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("template_id", formData.template);

      // Add employee ID if user is an employee
// Always add employee - both Admin and Employee can create doctors
if (ID) {
  formDataToSend.append("employee", ID); // Keep using database ID for video since it works
}
// Add image for video templates (required) and image templates (optional)
if (profileImage !== profile) {
  const blob = await fetch(profileImage).then((r) => r.blob());
  formDataToSend.append("image", blob, "profile.jpg");
} else if (selectedTemplateType === "image") {
  // For image templates without uploaded photo, you might want to send a flag
  console.log("🔍 Image template without custom photo - using template default");
}
      let response;
      if (selectedTemplateType === "video") {
  console.log("🔍 Submitting VIDEO template with FormData:");
  
  // Debug FormData contents
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`🔍 FormData ${key}:`, value);
  }
  
  toast.loading("Creating doctor video...", { id: "create-video" });
  console.log("🔍 SENDING FormData to API:");
for (let [key, value] of formDataToSend.entries()) {
  console.log(`🔍 ${key}:`, value);
}

try {
  response = await doctorVideoGeneration(formDataToSend);
  console.log("🔍 API Response:", response);
} catch (error) {
  console.error("🔍 API Error:", error);
  console.error("🔍 Error Response:", error.response?.data);
  console.error("🔍 Error Status:", error.response?.status);
  throw error;
}
  
  console.log("🔍 Video generation response:", response);
console.log("🔍 Response has ID?", response?.id);
console.log("🔍 Response has output_video?", response?.output_video);
console.log("🔍 Response keys:", Object.keys(response || {}));

if (response && response.id) {
  toast.success("Video created successfully!", { id: "create-video" });
  navigate("/gallery", { state: { createdContent: response, contentType: "video" } });
} else {
  toast.error("Video creation failed - no ID returned", { id: "create-video" });
  console.error("Video response missing ID:", response);
  console.error("Full response details:", JSON.stringify(response, null, 2));
}
} else {
        // For image templates, first get template details
        toast.loading("Loading template details...", { id: "template-fetch" });

        try {
          const templateDetails = await getTemplatesDetailsById(formData.template);
          console.log("🔍 Template Details Fetched:", templateDetails);
          console.log("🔍 Custom Text from Template:", templateDetails.custom_text);
          console.log("🔍 Text Positions:", templateDetails.text_positions);
          console.log("🔍 Template Brand Area Settings:", templateDetails.brand_area_settings); // ADD 
          toast.dismiss("template-fetch");

          // Use template's custom_text and positioning
          // For image templates, use different API
const imageData = {
  template_id: formData.template,
  mobile: formData.mobileNumber,
  name: formData.doctorName,
  selected_brands: selectedBrands, // ADD THIS
  content_data: {
    message: templateDetails.custom_text || "",
    custom_text: templateDetails.custom_text || "",
    doctor_name: formData.doctorName,
    doctor_specialization: formData.specialization,
    doctor_clinic: formData.hospital,
    doctor_city: formData.city,
    doctor_state: formData.state,
    selected_brands: selectedBrands // ADD THIS TOO
  },
  doctor_data: {
    name: formData.doctorName,
    clinic: formData.hospital,
    city: formData.city,
    specialization: formData.specialization,
    mobile: formData.mobileNumber,
    state: formData.state
  }
};

if (USERTYPE === "Employee" && EMPLOYEE_ID) {
  imageData.employee_id = EMPLOYEE_ID; // Use string ID instead of database ID
}

console.log("🔍 Sending image data with template details:", imageData);
console.log("🔍 Doctor data being sent:", imageData.doctor_data);
console.log("🔍 Clinic in doctor_data:", imageData.doctor_data.clinic);
console.log("🔍 City in doctor_data:", imageData.doctor_data.city);

response = await generateImageContent(imageData);
console.log("🔍 =====IMAGE CREATION DEBUG=====");

console.log("🔍 IMAGE CREATION RESPONSE:", response);
console.log("🔍 Image response keys:", Object.keys(response || {}));
console.log("🔍 Image response doctor_info:", response.doctor_info);
console.log("🔍 Image response output_image_url:", response.output_image_url);
console.log("🔍 ================================");
          navigate("/gallery", { state: { createdContent: response, contentType: "image" } });

        } catch (templateError) {
          toast.error("Failed to load templateee details", { id: "template-fetch" });
          console.error("Template fetch error:", templateError);
          return;
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setApiError(
        error.response?.data?.message ||
        "Failed to generate video. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const fetchTemplates = async () => {
    try {
      const response = await getTemplatesDetails();
      setTemplates(response);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    }
  };
  const [templateList, setTemplatesList] = useState([]);

  const [selectedTemplateType, setSelectedTemplateType] = useState("video");
  const [isSearchingDoctor, setIsSearchingDoctor] = useState(false);
  const [doctorFoundMessage, setDoctorFoundMessage] = useState("");

  // ADD THESE LINES:
const [brandCategories, setBrandCategories] = useState([]);
const [selectedBrands, setSelectedBrands] = useState([]);

  const fetchTemplatesList = async () => {
    try {
      // Fetch both video and image templates
      const videoRes = await getVideoTemplates();
      console.log("Video templates:", videoRes);

      const imageRes = await getImageTemplates();
      console.log("Image templates:", imageRes);

      // Combine both arrays and ensure template_type is set
      const allTemplates = [
        ...videoRes.map(template => ({ ...template, template_type: template.template_type || 'video' })),
        ...imageRes.map(template => ({ ...template, template_type: template.template_type || 'image' }))
      ];

      console.log("Combined templates:", allTemplates);
      setTemplatesList(allTemplates);
    } catch (error) {
      console.log("Error fetching templates:", error);
      toast.error("Failed to load templates");
    }
  };
  const getTemplatePositionsPreview = (templateId) => {
    const selectedTemplate = templateList.find(t => t.id === parseInt(templateId));
    if (!selectedTemplate || !selectedTemplate.text_positions) {
      return null;
    }

    return selectedTemplate.text_positions;
  };
  const checkImageTemplates = async () => {
    try {
      console.log("Checking image templates...");
      const imageTemplates = await getImageTemplates();
      console.log("Direct image templates fetch:", imageTemplates);

      const imageTemplatesViaUnified = await getTemplatesDetails('image');
      console.log("Image templates via unified endpoint:", imageTemplatesViaUnified);
    } catch (error) {
      console.error("Error checking image templates:", error);
    }
  };

  const fetchBrandCategories = async () => {
  try {
    const response = await getAllBrands();
    setBrandCategories(response.categories || []);
  } catch (error) {
    console.error("Error fetching brands:", error);
    toast.error("Failed to load brands");
  }
};

const handleBrandSelection = (brandId, isSelected) => {
  if (isSelected) {
    if (selectedBrands.length < 10) {
      setSelectedBrands(prev => [...prev, brandId]);
    } else {
      toast.error("You can select maximum 10 brands");
    }
  } else {
    setSelectedBrands(prev => prev.filter(id => id !== brandId));
  }
};

useEffect(() => {
  const initializeData = async () => {
    try {
      setIsLoading(true);
      await Promise.allSettled([
        fetchTemplates(),
        fetchTemplatesList(),
        checkImageTemplates(),
        fetchBrandCategories() // ADD THIS LINE
      ]);
    } catch (error) {
      console.error("Error initializing data:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  initializeData();
}, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Left - Form */}
        <div className="flex-1 px-10 py-10">
          <h2 className="text-2xl font-bold mb-6 mt-10">Basic Information</h2>

          <form
            className="space-y-4 max-w-2xl mt-15 md:ml-10"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-5 mb-8">
              <div>
                <label className="block mb-1 font-bold text-xl">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter mobile number"
                    className={`w-full border ${errors.mobileNumber ? "border-red-500" : "border-gray-300"
                      } rounded-md px-4 py-2 ${isSearchingDoctor ? 'pr-10' : ''}`}
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      handleInputChange(e);
                      handleMobileNumberChange(e.target.value);
                      if (sameNumber) {
                        setFormData((prev) => ({
                          ...prev,
                          whatsappNumber: e.target.value,
                        }));
                      }
                    }}
                  />
                  {isSearchingDoctor && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-bold text-xl">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  placeholder="Enter WhatsApp number"
                  className={`w-full border ${errors.whatsappNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2`}
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                />
                {errors.whatsappNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sameNumber}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSameNumber(checked);
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        whatsappNumber: prev.mobileNumber,
                      }));
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label className="font-medium text-md">
                  WhatsApp Number Same
                  <br />
                  <span className="text-gray-500 text-xs">
                    Check if both numbers are same
                  </span>
                </label>
              </div>
            </div>
            {/* Doctor Full Name */}
            

            {/* Specialization & Hospital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="" className="block font-bold text-xl mb-2">
                  Key Specialization
                </label>
                <input
                  type="text"
                  name="specialization_key"
                  placeholder="Enter key specialization"
                  value={formData.specialization_key}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.doctorName ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                />
                {errors.doctorName && (
                  <p className="text-red-500 text-sm">{errors.specialization_key}</p>
                )}
              </div>
              <div>
                <label className="block mb-2 font-bold text-xl">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Enter specialization"
                  className={`w-full border ${errors.specialization ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
                {errors.specialization && (
                  <p className="text-red-500 text-sm">
                    {errors.specialization}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  name="hospital"
                  placeholder="Enter hospital or clinic"
                  className={`w-full border ${errors.hospital ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                  value={formData.hospital}
                  onChange={handleInputChange}
                />
                {errors.hospital && (
                  <p className="text-red-500 text-sm">{errors.hospital}</p>
                )}
              </div>
              {/* Template Type Selection */}
              <div className="col-span-2 mb-4">
                <label className="block font-bold text-xl mb-3">
                  Content Type
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="video"
                      checked={selectedTemplateType === "video"}
                      onChange={(e) => {
                        setSelectedTemplateType(e.target.value);
                        setFormData(prev => ({ ...prev, template: "" }));
                        setSelectedBrands([]); // ADD THIS LINE
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-lg font-medium">📹 Video Template</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="image"
                      checked={selectedTemplateType === "image"}
                      onChange={(e) => {
                        setSelectedTemplateType(e.target.value);
                        setFormData(prev => ({ ...prev, template: "" }));
                        setSelectedBrands([]); // ADD THIS LINE
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-lg font-medium">🖼️ Image Template</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-xl mb-2">
                  Choose {selectedTemplateType === "video" ? "Video" : "Image"} Template
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => {
                    handleInputChange(e);
                    // When template changes, show preview for image templates
                    if (selectedTemplateType === "image" && e.target.value) {
                      const templatePositions = getTemplatePositionsPreview(e.target.value);
                      console.log("Selected template positions:", templatePositions);
                    }
                  }}
                  name="template"
                  className={`w-full border ${errors.template ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                >
                  <option value="">Select {selectedTemplateType === "video" ? "Video" : "Image"} Template</option>
                  {templateList
                    .filter(template => template.template_type === selectedTemplateType)
                    .map((list) => (
                      <option value={list.id} key={list.id}>
                        {list.name} {selectedTemplateType === "image" && list.text_positions ? "✨" : ""}
                      </option>
                    ))}
                </select>

                {/* ADD TEMPLATE PREVIEW FOR IMAGE TEMPLATES */}
                {/* ADD TEMPLATE PREVIEW FOR IMAGE TEMPLATES */}
{selectedTemplateType === "image" && formData.template && (
  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
    <div className="text-sm font-medium text-blue-700 mb-2">Template Preview:</div>
    {(() => {
      const templatePositions = getTemplatePositionsPreview(formData.template);
      const selectedTemplate = templateList.find(t => t.id === parseInt(formData.template));

      if (!templatePositions) {
        return <div className="text-red-500 text-xs">No positioning data available</div>;
      }

      const brandSettings = selectedTemplate?.brand_area_settings;

      return (
        <div className="space-y-1 text-xs">
          <div>Custom Text: "{selectedTemplate?.custom_text || 'Not set'}"</div>
          <div>Positions configured for: {Object.keys(templatePositions).join(", ")}</div>
          {brandSettings && brandSettings.enabled && (
            <div className="text-purple-600">
              🎨 Brand logos will be: {brandSettings.brandWidth || 100} × {brandSettings.brandHeight || 60} pixels
            </div>
          )}
          <div className="text-green-600">✅ This template will use your Gallery positioning</div>
        </div>
      );
    })()}
  </div>
)}
                {errors.template && (
                  <p className="text-red-500 text-sm">{errors.template}</p>
                )}
              </div>
            </div>

              {/* Brand Selection by Category - Only for Image Templates */}
            {selectedTemplateType === "image" && formData.template && (
              <div className="col-span-2 mb-4">
                <label className="block font-bold text-xl mb-3">
                  Select Brands (Optional)
                </label>
                <div className="space-y-4">
                  {brandCategories.map((category) => (
                    <div key={category.category_key} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 text-green-700">
                        {category.category_name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {category.brands.map((brand) => (
                          <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.id)}
                              onChange={(e) => handleBrandSelection(brand.id, e.target.checked)}
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <img
                              src={brand.brand_image}
                              alt={brand.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-sm">{brand.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <span className="text-green-700 font-medium">
                      Selected: {selectedBrands.length} brand(s)
                    </span>
                  </div>
                )}
              </div>
            )}


            {/* State */}
            <div className="flex gap-3">
              <div>
                <label className="block mb-2 font-bold text-xl">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  className={`w-full border ${errors.state ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
              {/* City */}
              <div>
                <label className="block mb-2 font-bold text-xl">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className={`w-full border ${errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 mb-1`}
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Mobile & WhatsApp */}
            <div>
              <label className="block font-bold text-xl mb-2">
                Doctor Full Name
              </label>
              <input
                type="text"
                name="doctorName"
                placeholder="Enter full name"
                className={`w-full border ${errors.specialization_key ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-2 mb-1`}
                value={formData.doctorName}
                onChange={handleInputChange}
              />
              {errors.doctorName && (
                <p className="text-red-500 text-sm">{errors.doctorName}</p>
              )}
            </div>

            {/* Description */}
            {/* <div>
                            <label className="block font-bold text-xl mb-2">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Describe the doctor (optional)"
                                className="w-full border border-gray-300 rounded-md px-4 py-2"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div> */}

            <button
              type="submit"
              className="border-2 px-5 bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating {selectedTemplateType}...
                </>
              ) : (
                <>
                  {selectedTemplateType === "video" ? "🎬" : "🖼️"}
                  Create {selectedTemplateType === "video" ? "Video" : "Image"} Content
                </>
              )}
            </button>

            {apiError && <div className="text-red-500 mt-2">{apiError}</div>}
          </form>
        </div>

        {/* Right - Profile and Template */}
        <div className="bg-blue-100 w-full md:w-[30%] px-6 py-10 flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-15 object-cover mb-8 hidden sm:block"
          />

          <div className="relative mb-6 w-70 h-70">
           {showCropper ? (
  <div className="relative w-full h-full">
    <Cropper
      image={originalImage}
      crop={crop}
      zoom={zoom}
      aspect={1}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    />
    <div className="absolute bottom-4 right-4 flex gap-2">
      <button
        onClick={() => setShowCropper(false)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button
        onClick={getCroppedImg}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  </div>
) : (
  <>
    <img
      src={profileImage}
      alt="Doctor"
      className={`w-full h-full object-cover border-8 ${
        selectedTemplateType === "video" 
          ? "border-blue-900" 
          : "border-green-600"
      }`}
    />
    <div
      className={`absolute -bottom-2 -right-4 rounded-full p-5 cursor-pointer ${
        selectedTemplateType === "video"
          ? "bg-blue-200 hover:bg-blue-300"
          : "bg-green-200 hover:bg-green-300"
      }`}
      onClick={triggerFileInput}
    >
      <FaUpload className="w-11 h-11" />
    </div>
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />
    {/* Template Type Indicator */}
    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white ${
      selectedTemplateType === "video" ? "bg-blue-600" : "bg-green-600"
    }`}>
      {selectedTemplateType === "video" ? "📹 Video" : "🖼️ Image"}
      {selectedTemplateType === "image" && <span className="text-xs block">Photo Optional</span>}
    </div>
  </>
)}
{errors.profileImage && (
  <p className="text-red-500 text-sm text-center font-bold mb-4">
    {errors.profileImage}
  </p>
)}
          </div>

          {/* <div className="w-full mb-4">
            <label className="text-sm  mb-1 block text-center font-bold">
              Select Video Template
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Choose Template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className={`bg-white border p-3 rounded-md text-xs space-y-1 ${
  selectedTemplateType === "video" 
    ? "border-red-300 text-red-600" 
    : "border-green-300 text-green-600"
}`}>
  <div className="font-bold mb-1">
    {selectedTemplateType === "video" ? "📹 Video Template Rules:" : "🖼️ Image Template Rules:"}
  </div>
  <p>1. For better quality size should be width=515px, height=515px*</p>
  <p>2. Max File Size should be 500KB for greeting and JPG*</p>
  {selectedTemplateType === "video" ? (
    <p>3. Video processing will take up to 60 minutes or more depending on video rendering.*</p>
  ) : (
    <>
      <p>3. Photo upload is optional for image templates*</p>
      <p>4. Image processing typically takes 1-2 minutes*</p>
    </>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


//! On SUNDAy