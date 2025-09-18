import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import FEATURE_FLAGS from "../config/features";
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
  getTaskStatus,
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
import { useCallback } from "react";




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
    // For image templates, photos are optional - no validation needed

    setErrors(newErrors);
    return valid;
  };

  // Add debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const [isAutoPopulated, setIsAutoPopulated] = useState(false);
  const [readOnlyFields, setReadOnlyFields] = useState([]);

  const handleMobileNumberChange = debounce(async (mobileNumber) => {
    // Clear previous messages
    setDoctorFoundMessage("");

    // Only search if mobile number is 10 digits
    if (mobileNumber.length === 10 && /^\d{10}$/.test(mobileNumber)) {
      setIsSearchingDoctor(true);

      try {
        // Add employee_id to search request
        const employeeId = getItemInLocalStorage("UserId")?.replace(/"/g, '');
        const response = await searchDoctor(mobileNumber, employeeId);

        if (response.found) {
          const doctor = response.doctor;
          const readonly_fields = doctor.readonly_fields || [];

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

          if (response.own_doctor) {
            toast.success(`âœ… Your doctor found: ${doctor.name}`);
            setIsAutoPopulated(false);
            setReadOnlyFields([]);
          } else {
            toast.info(`📋 Auto-filled from existing data. Only mobile number cannot be changed.`);
            setIsAutoPopulated(true);
            setReadOnlyFields(['mobileNumber']); 
          }
          setDoctorFoundMessage("");
        } else {
          toast.info("ðŸ†• New doctor - please fill details");
          setDoctorFoundMessage("");
          setIsAutoPopulated(false);
          setReadOnlyFields([]);
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
  }, 1000);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Image generation process
      toast.loading("Loading template details...", { id: "template-fetch" });

      if (!formData.template) {
        toast.error("Please select a template first");
        return;
      }

      const templateDetails = await getTemplatesDetailsById(formData.template);
      if (!templateDetails) {
        toast.error("Selected template not found. Please choose another template.");
        return;
      }

      console.log("🔍 Template Details Fetched:", templateDetails);
      console.log("🔍 Custom Text from Template:", templateDetails.custom_text);
      console.log("🔍 Text Positions:", templateDetails.text_positions);
      console.log("🔍 Template Brand Area Settings:", templateDetails.brand_area_settings);
      toast.dismiss("template-fetch");
      // Use template's custom_text and positioning
      // For image templates, use different API
      const imageData = {
        template_id: formData.template,
        mobile: formData.mobileNumber,
        name: formData.doctorName,
        selected_brands: selectedBrands,
        employee_id: getItemInLocalStorage("UserId")?.replace(/"/g, ''), // Always send employee_id
        user_type: getItemInLocalStorage("UserType")?.replace(/"/g, ''),
        content_data: {
          message: templateDetails.custom_text || "",
          custom_text: templateDetails.custom_text || "",
          doctor_name: formData.doctorName,
          doctor_specialization: formData.specialization,
          doctor_city: formData.city,
          doctor_state: formData.state,
          selected_brands: selectedBrands
        },
        doctor_data: {
          name: formData.doctorName,
          clinic: formData.hospital,
          city: formData.city,
          specialization: formData.specialization,
          mobile_number: formData.mobileNumber,
          state: formData.state
        }
      };

      console.log("🔍 Sending employee_id:", imageData.employee_id); // Debug log

      console.log("🔍 Sending image data with template details:", imageData);
      console.log("🔍 Doctor data being sent:", imageData.doctor_data);
      console.log("🔍 Clinic in doctor_data:", imageData.doctor_data.clinic);
      console.log("🔍 City in doctor_data:", imageData.doctor_data.city);

      const response = await generateImageContent(imageData);
      console.log("🔍 =====IMAGE CREATION DEBUG=====");

      console.log("🔍 IMAGE CREATION RESPONSE:", response);
      console.log("🔍 Image response keys:", Object.keys(response || {}));
      console.log("🔍 Image response doctor_info:", response.doctor_info);
      console.log("🔍 Image response output_image_url:", response.output_image_url);
      console.log("🔍 ================================");

      // Handle async image processing
      if (response.status === "processing" && response.task_id) {
        toast.loading("Processing image...", { id: "image-processing" });

        // Poll for task completion with proper cleanup
        const pollTaskStatus = async (taskId, attempt = 1) => {
          try {
            const statusData = await getTaskStatus(taskId);

            if (statusData.status === "completed") {
              toast.success("Image created successfully!", { id: "image-processing" });
              navigate("/gallery", { state: { createdContent: statusData.result, contentType: "image" } });
              return; // Stop polling
            } else if (statusData.status === "failed") {
              toast.error("Image creation failed", { id: "image-processing" });
              return; // Stop polling
            } else if (attempt < 30) { // Max 60 seconds of polling
              // Still processing, poll again after 2 seconds
              setTimeout(() => pollTaskStatus(taskId, attempt + 1), 2000);
            } else {
              toast.error("Processing timeout - please check gallery", { id: "image-processing" });
              navigate("/gallery");
            }
          } catch (error) {
            toast.error("Error checking image status", { id: "image-processing" });
          }
        };

        pollTaskStatus(response.task_id);
      } else {
        // Handle immediate response (fallback)
        navigate("/gallery", { state: { createdContent: response, contentType: "image" } });
      }

    } catch (error) {
      console.error("API Error:", error);

      let errorMessage = "Content creation failed. Please try again.";

      if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait before trying again.";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please use a smaller image.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  const [templateList, setTemplatesList] = useState([]);

const [selectedTemplateType, setSelectedTemplateType] = useState("image");
const [isSearchingDoctor, setIsSearchingDoctor] = useState(false);
const [doctorFoundMessage, setDoctorFoundMessage] = useState("");

  // ADD THESE LINES:
  const [brandCategories, setBrandCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  const fetchTemplatesList = async () => {
    try {
      // Add user context to template requests
      const userParams = {
        user_type: USERTYPE,
        employee_id: EMPLOYEE_ID?.replace(/"/g, "")
      };

      // Only fetch image templates since ENABLE_VIDEO_FEATURES is false
      const imageRes = await getImageTemplates(userParams);
      console.log("Image templates:", imageRes);

      // Filter only active templates (status: true) and set only image templates
      const activeTemplates = imageRes.filter(template => template.status === true);
      setTemplatesList(activeTemplates.map(template => ({
        ...template,
        template_type: 'image'
      })));
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
        // Only fetch what's needed, with delays between calls
        await fetchTemplatesList();
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchBrandCategories();
        // Remove checkImageTemplates() - it's redundant
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      // Clear any pending polling timeouts
      if (window.taskPollingTimeout) {
        clearTimeout(window.taskPollingTimeout);
      }
    };
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
        {/* Left - Centered Form */}
        <div className="flex-1 px-10 py-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Basic Information</h2>

            <form
              className="space-y-4 w-full"
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
                      readOnly={readOnlyFields.includes('mobileNumber')}
                      className={`w-full border ${errors.mobileNumber ? "border-red-500" : "border-gray-300"
                        } rounded-md px-4 py-2 ${isSearchingDoctor ? 'pr-10' : ''} ${
                        readOnlyFields.includes('mobileNumber') ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      value={formData.mobileNumber}
                      onChange={(e) => {
                        if (!readOnlyFields.includes('mobileNumber')) {
                          handleInputChange(e);
                          handleMobileNumberChange(e.target.value);
                          if (sameNumber) {
                            setFormData((prev) => ({
                              ...prev,
                              whatsappNumber: e.target.value,
                            }));
                          }
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
                {/* Template Type Selection */}
                {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ? (
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
                            setSelectedBrands([]);
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
                            setSelectedBrands([]);
                          }}
                          className="mr-3 h-4 w-4 text-blue-600"
                        />
                        <span className="text-lg font-medium">🖼️ Image Template</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <input type="hidden" name="templateType" value="image" />
                )}

                <div>
                  <label className="block font-bold text-xl mb-2">
                    Choose {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ?
                      (selectedTemplateType === "video" ? "Video" : "Image") :
                      ""} Template
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value) {
                        setShowTemplatePreview(true);
                        setTimeout(() => setShowTemplatePreview(false), 4000);
                      }
                    }}
                    name="template"
                    className={`w-full border ${errors.template ? "border-red-500" : "border-gray-300"
                      } rounded-md px-4 py-2 mb-1`}
                  >
                    <option value="">
                      Select {FEATURE_FLAGS.ENABLE_VIDEO_FEATURES ?
                        (selectedTemplateType === "video" ? "Video" : "Image") :
                        ""} Template
                    </option>
                    {templateList
                      .filter(template => template.template_type === 'image')
                      .map((list) => (
                        <option value={list.id} key={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </select>

                  {/* ADD TEMPLATE PREVIEW FOR IMAGE TEMPLATES */}
                  {/* ADD TEMPLATE PREVIEW FOR IMAGE TEMPLATES */}
                  {formData.template && showTemplatePreview && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md transition-all duration-500">
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
                                Brand logos will be: {brandSettings.brandWidth || 100} × {brandSettings.brandHeight || 60} pixels
                              </div>
                            )}
                            <div className="text-green-600">This template will use your Gallery positioning</div>
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
              {formData.template && (
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

              {/* Doctor Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xl mb-2">
                    Doctor Full Name
                  </label>
                  <input
        
                    type="text"
                    name="doctorName"
                    placeholder="Enter full name"
                    readOnly={readOnlyFields.includes('doctorName')}
                    className={`w-full border ${errors.specialization_key ? "border-red-500" : "border-gray-300"
                      } rounded-md px-4 py-2 mb-1 ${
                      readOnlyFields.includes('doctorName') ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={formData.doctorName}
                    onChange={handleInputChange}
                  />
                  {errors.doctorName && (
                    <p className="text-red-500 text-sm">{errors.doctorName}</p>
                  )}
                  {isAutoPopulated && (
  <p className="text-blue-600 text-sm mt-1">
    ℹ️ Data auto-filled. Only mobile number cannot be changed.
  </p>
)}
                </div>
                <div></div> {/* Empty div to take up the second column */}
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
        </div>

        {/* Right - Centered Content */}
        <div className="bg-blue-100 w-full md:w-[30%] px-6 py-10 flex flex-col items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-15 object-cover mb-8"
          />

          <div className={`px-6 py-3 rounded-lg text-lg font-bold text-white mb-6 ${selectedTemplateType === "video" ? "bg-blue-600" : "bg-green-600"
            }`}>
            {selectedTemplateType === "video" ? "Video Template" : "Image Template"}
          </div>

          <div className={`bg-white border p-4 rounded-md text-sm space-y-2 max-w-sm ${selectedTemplateType === "video"
              ? "border-red-300 text-red-600"
              : "border-green-300 text-green-600"
            }`}>
            <div className="font-bold mb-2">
              {selectedTemplateType === "video" ? "Video Template Rules:" : "Image Template Rules:"}
            </div>
            <p>1. Fill in all required information</p>
            <p>2. Select appropriate template</p>
            {selectedTemplateType === "video" ? (
              <p>3. Video processing takes up to 60 minutes*</p>
            ) : (
              <p>3. Image processing takes 1-2 minutes*</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


//! On SUNDAy