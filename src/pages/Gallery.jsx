import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import {
  getAllDoctors,
  getAllDoctorsVideosByEmployee,
  getDoctorExcel,
  recreateVideo,
  AddEmployeeTemplates,
  getTemplatesDetails,
  createDoctorVideo,
  getGeneratedVideosOnId,
  getGeneratedDoctorVideos,
  getFilteredVideoTemplates,
  updateEmployeeTemplatesStatus,
  getTemplatesDetailsById,
  editTemplatesDetailsById,
  getVideoTemplates,
  // ADD THESE NEW IMPORTS:
  getImageTemplates,
  generateImageContent,
  searchDoctor,
  getGeneratedDoctorImages,
  updateDoctor, // ADD
  deleteDoctor, // ADD
  regenerateContent, // ADD
  deleteContent, // ADD
  getAllBrands,
  postBrandPosition
} from "../api";
import logo from "../assets/ixoralogo.png";
import doctors from "../assets/doctors.png";
import { FaVideo, FaTable, FaDownload, FaEdit, FaImage } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShare } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaBackward } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { getItemInLocalStorage } from "../utils/loacalStorage";

// Mock data for video templates

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return BACKEND_BASE_URL + url;
}

const Gallery = () => {
  useEffect(() => {
    // DEBUG: Check all possible token locations
    console.log("🔍 =====TOKEN DEBUG=====");
    console.log("🔍 access_token:", localStorage.getItem("access_token"));
    console.log("🔍 access:", localStorage.getItem("access"));
    console.log("🔍 token:", localStorage.getItem("token"));
    console.log("🔍 authToken:", localStorage.getItem("authToken"));
    console.log("🔍 All localStorage keys:", Object.keys(localStorage));
    console.log("🔍 UserId:", getItemInLocalStorage("UserId"));
    console.log("🔍 UserType:", getItemInLocalStorage("UserType"));
    console.log("🔍 ======================");
  }, []);
  const [viewMode, setViewMode] = useState("table");
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [download, setDownload] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [doctorsData, setDoctorsData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [count, setCount] = useState("");
  const [isEditPage, setIsEditPage] = useState(false);
  const [t_id, setT_id] = useState("");
  const [formData, setFormData] = useState({
    templateName: "",
    templateVideo: "",
    baseXAxis: "",
    baseYAxis: "",
    timeDuration: "",
    lineSpacing: "",
    resolution: "",
    overlay_x: "",
    overlay_y: "",
    status: true,
  });
  const [isRecreateModalOpen, setIsRecreateModalOpen] = useState(false);
  const [isRecreateImageModalOpen, setIsRecreateImageModalOpen] =
    useState(false);

  // ADD THESE NEW STATES:
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] =
    useState(false);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);
  const [uploadedDoctorImage, setUploadedDoctorImage] = useState(null);
  const [selectedDoctorForDelete, setSelectedDoctorForDelete] = useState(null);
  const [selectedContentForDelete, setSelectedContentForDelete] =
    useState(null);
  const [regenerateContentType, setRegenerateContentType] = useState("video");

  const debugTokens = () => {
    console.log("🔍 =====FULL TOKEN DEBUG=====");
    console.log(
      "🔍 localStorage.getItem('Access_Token'):",
      localStorage.getItem("Access_Token")
    );
    console.log(
      "🔍 getItemInLocalStorage('Access_Token'):",
      getItemInLocalStorage("Access_Token")
    );
    console.log("🔍 Raw localStorage Access_Token:", localStorage.Access_Token);
    console.log("🔍 All localStorage:", JSON.stringify(localStorage));
    console.log("🔍 ============================");
  };

  const navigate = useNavigate();
  const Id = getItemInLocalStorage("Id");

  const EMPID = getItemInLocalStorage("UserId");

  const USERTYPE = getItemInLocalStorage("UserType");
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([
    "Option 1",
    "Option 2",
    "Option 3",
  ]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(count / itemsPerPage);
  const fetchDoctorsData = async () => {
    try {
      setLoading(true);
      let response;

      if (USERTYPE === "Admin") {
        response = await getAllDoctors(page);
      } else {
        response = await getAllDoctorsVideosByEmployee(EMPID, page);
      }

      // ADD THIS DEBUG FOR IMAGE REGENERATION:
      console.log("🔍 =====IMAGE REGENERATION DEBUG=====");
      response.results.forEach((doctor, index) => {
        console.log(`🔍 Doctor ${index + 1}: ${doctor.name}`);
        console.log(
          `🔍 - Total images: ${doctor.latest_output_image?.length || 0}`
        );
        if (
          doctor.latest_output_image &&
          doctor.latest_output_image.length > 0
        ) {
          doctor.latest_output_image.forEach((img, imgIndex) => {
            console.log(
              `🔍 - Image ${imgIndex + 1}: ${
                img.output_image_url || img.output_image
              }`
            );
            console.log(`🔍 - Created at: ${img.created_at}`);
          });
        }
        if (
          doctor.latest_output_video &&
          doctor.latest_output_video.length > 0
        ) {
          console.log(
            `🔍 ${doctor.name} - VIDEOS:`,
            doctor.latest_output_video.length
          );
          doctor.latest_output_video.forEach((video, index) => {
            console.log(
              `🔍 - Video ${index}: ${video.video_file} (created: ${video.created_at})`
            );
          });
        }
      });
      console.log("🔍 ===================================");
      // Debug what we're getting from API
      // Debug what we're getting from API
      console.log("🔍 API Response sample doctor:", response.results[0]);
      console.log(
        "🔍 Available doctor fields:",
        Object.keys(response.results[0] || {})
      );
      console.log(
        "🔍 Doctor specialization field:",
        response.results[0]?.specialization
      );
      console.log("🔍 Doctor clinic field:", response.results[0]?.clinic);
      console.log("🔍 Doctor state field:", response.results[0]?.state);
      console.log("🔍 Doctor city field:", response.results[0]?.city);
      // ADD IMAGE DEBUGGING
      console.log("🔍 =====GALLERY IMAGE DEBUG=====");
      console.log(
        "🔍 Doctor latest_output_image:",
        response.results[0]?.latest_output_image
      );
      console.log(
        "🔍 Doctor latest_output_video:",
        response.results[0]?.latest_output_video
      );
      console.log("🔍 Total doctors in response:", response.results.length);
      response.results.forEach((doc, index) => {
        if (doc.latest_output_image && doc.latest_output_image.length > 0) {
          console.log(
            `🔍 Doctor ${index + 1} (${doc.name}) HAS IMAGES:`,
            doc.latest_output_image.length
          );
        }
      });
      console.log("🔍 ==============================");

      setDoctorsData(response.results);
      setNextPageUrl(response.next);
      setPrevPageUrl(response.previous);
      setCount(response.count);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching doctors data:", err);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
  }, [USERTYPE, EMPID, page]);

  const handleNextPage = () => {
    if (nextPageUrl) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (prevPageUrl) setPage((prev) => Math.max(prev - 1, 1));
  };

  const getPageNumbers = () => {
    const maxButtons = 5; // show 5 page buttons max
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (!USERTYPE || !EMPID) {
      navigate("/login");
    }
  }, [USERTYPE, EMPID, navigate]);

  // ADD THIS NEW USEEFFECT:
  const location = useLocation();

  useEffect(() => {
    // Handle success messages from content creation
    const { state } = location;

    // ADD DEBUGGING
    console.log("🔍 =====GALLERY SUCCESS HANDLER=====");
    console.log("🔍 Location state:", state);
    console.log("🔍 Content type:", state?.contentType);
    console.log("🔍 Created content:", state?.createdContent);
    console.log("🔍 ===================================");

    if (state?.createdContent && state?.contentType) {
      const contentType = state.contentType;
      const content = state.createdContent;

      // Show appropriate success message
      if (contentType === "video") {
        toast.success(
          `🎬 Video created successfully for Dr. ${content.name || "Unknown"}!`
        );
      } else if (contentType === "image") {
        toast.success(
          `🖼️ Image created successfully for Dr. ${
            content.doctor_info?.name || content.doctor_name || "Unknown"
          }!`
        );
      }

      // Clear the state to prevent re-showing message on refresh
      navigate(location.pathname, { replace: true, state: {} });

      // Refresh the doctor data to show the new content
      console.log("🔍 Refreshing doctor data after content creation...");
      fetchDoctorsData();
    }
  }, [location, navigate]);
  const [showSpecializationFilter, setShowSpecializationFilter] =
    useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const getUniqueSpecializations = () => {
    const specializations = new Set();
    doctorsData.forEach((doctor) => {
      if (doctor.specialization) {
        specializations.add(doctor.specialization);
      }
    });
    return Array.from(specializations).sort();
  };
  const filteredDoctors = (doctorsData || []).filter((doctor) => {
    const nameMatch =
      doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const specializationMatch =
      selectedSpecialization === "" ||
      (doctor?.specialization &&
        doctor.specialization === selectedSpecialization);

    return nameMatch && specializationMatch;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredDoctors.slice(indexOfFirstRow, indexOfLastRow);
  // const totalPages = Math.ceil(filteredDoctors.length / rowsPerPage);
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const [doctorId, setDoctorId] = useState("");
  const handleRecreateModal = (docId) => {
    setIsRecreateModalOpen(true);
    setDoctorId(docId);
  };
  // const [isRecreateImageModalOpen, setIsRecreateImageModalOpen] = useState(false);

  const handleRecreateImageModal = (docId) => {
    setIsRecreateImageModalOpen(true);
    setDoctorId(docId);
    setTemplateType("image"); // Set to image mode
  };

  const handleRecreateImage = async () => {
    if (!selectedTemplate) {
      return toast.error("Please select image template");
    }
    try {
      toast.loading("Loading template details...", { id: "template-load" });
      const templateDetails = await getTemplatesDetailsById(selectedTemplate);
      toast.dismiss("template-load");

      const currentDoctor = doctorsData.find((doc) => doc.id === doctorId);

      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("template_id", selectedTemplate);
      formData.append("doctor_id", doctorId);

      // Add doctor image if uploaded
      if (uploadedDoctorImage) {
        formData.append("doctor_image", uploadedDoctorImage);
        console.log(
          "🔍 Adding uploaded image to recreation:",
          uploadedDoctorImage.name
        );
      }

      formData.append(
        "content_data",
        JSON.stringify({
          doctor_name: currentDoctor?.name || "",
          doctor_clinic: currentDoctor?.clinic || "",
          doctor_city: currentDoctor?.city || "",
          doctor_specialization: currentDoctor?.specialization || "",
          doctor_state: currentDoctor?.state || "",
          imageSettings: templateDetails.text_positions?.imageSettings || {
            enabled: false,
            x: 400,
            y: 50,
            width: 150,
            height: 150,
            fit: "cover",
            borderRadius: 50,
            opacity: 100,
          },
        })
      );

      console.log(
        "🔍 Gallery recreation with FormData and image:",
        !!uploadedDoctorImage
      );

      toast.loading("Creating image...", { id: "recreate-image" });
      const response = await generateImageContent(formData);
      setIsRecreateImageModalOpen(false);
      setUploadedDoctorImage(null); // Reset after use
      fetchDoctorsData();

      if (response && response.output_image_url) {
        toast.success("Image created successfully!", { id: "recreate-image" });
      } else {
        throw new Error("Failed to create image");
      }
    } catch (error) {
      console.error("Image creation error:", error);
      toast.error("Failed to create image", { id: "recreate-image" });
    }
  };

  const handleRecreateVideo = async () => {
    if (!selectedTemplate) {
      return toast.error("Please select template");
    }
    try {
      const payload = { doctor_id: doctorId, template_id: selectedTemplate };

      toast.loading("Recreating video...", { id: "recreate-video" });
      const response = await recreateVideo(payload);
      setIsRecreateModalOpen(false);
      fetchDoctorsData();
      if (response && response.video_file) {
        console.log(
          "Video recreation successful. Video URL:",
          response.video_file
        );
        toast.success("Video recreation initiated successfully!", {
          id: "recreate-video",
        });

        setDoctorsData((prevData) =>
          prevData.map((doctor) =>
            doctor.id === doctorId
              ? {
                  ...doctor,
                  output_video: response.video_file
                    ? // ? `http://api.videomaker.digielvestech.in${response.video_path}`
                      `http://127.0.0.1:8000/${response.video_path}`
                    : null,
                }
              : doctor
          )
        );
      } else {
        console.error(
          "Failed to recreate video:",
          response.detail || "No video path returned"
        );
        throw new Error("Failed to recreate video");
      }
    } catch (error) {
      console.error("Full error object:", error);
      toast.error("Failed to recreate video");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.templateName.trim()) {
        throw new Error("Template name is required");
      }
      if (!formData.templateVideo) {
        throw new Error("Template video is required");
      }
      if (!formData.baseXAxis.trim()) {
        throw new Error("Base X axis is required");
      }
      if (!formData.baseYAxis.trim()) {
        throw new Error("Base Y axis is required");
      }
      if (!formData.timeDuration.trim()) {
        throw new Error("Time duration is required");
      }

      // Validate time duration format
      const timeDurationRegex = /^(\d+-\d+)(,\d+-\d+)*$/;
      if (!timeDurationRegex.test(formData.timeDuration)) {
        throw new Error(
          "Invalid time duration format. Use format like 10-15 or 10-15,46-50"
        );
      }

      // Validate resolution format
      if (!formData.resolution.trim()) {
        throw new Error("Resolution is required");
      }
      if (!/^\d+x\d+$/.test(formData.resolution)) {
        throw new Error("Invalid resolution format. Use format like 1920x1080");
      }

      toast.loading("Saving template...", { id: "save-template" });

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.templateName);
      formDataToSend.append("base_x_axis", formData.baseXAxis);
      formDataToSend.append("base_y_axis", formData.baseYAxis);
      formDataToSend.append("time_duration", formData.timeDuration);
      formDataToSend.append("line_spacing", formData.lineSpacing);
      formDataToSend.append("resolution", formData.resolution);
      formDataToSend.append("overlay_x", formData.overlay_x);
      formDataToSend.append("overlay_y", formData.overlay_y);
      // formDataToSend.append("template_video", formData.templateVideo);
      if (
        formData.templateVideo &&
        typeof formData.templateVideo !== "string"
      ) {
        formDataToSend.append("template_video", formData.templateVideo);
      }
      // Call the API
      if (isEditPage && t_id) {
        const response = await editTemplatesDetailsById(t_id, formDataToSend);
        if (response && response.id) {
          toast.success("Template saved successfully!", {
            id: "save-template",
          });
          fetchFilteredTemplatesList(response.status);
          handleModalClose();
          return;
        }
        console.log(response);
        throw new Error(response.message || "Failed to saved template");
      } else {
        const response = await AddEmployeeTemplates(
          formDataToSend,
          selectedTemplateType
        );
        if (response && response.id) {
          toast.success("Template saved successfully!", {
            id: "save-template",
          });
          fetchFilteredTemplatesList(response.status);
          handleModalClose();
          return;
        }
        throw new Error(response.message || "Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [listTemplates, setListTemplate] = useState([]);

  const [tabs, setTabs] = useState("all");

  const [status, setStatus] = useState(false);

  const [templateType, setTemplateType] = useState("video"); // video or image
  const [imageTemplates, setImageTemplates] = useState([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState("video");
  const [imageFormData, setImageFormData] = useState({
    templateName: "",
    templateImage: null,
    textFields: [
      { name: "name", x: 100, y: 50 },
      { name: "message", x: 100, y: 150 },
    ],
  });

  // const fetchActiveTemplatesList = async (newStatus) => {
  //   try {
  //     const res = await getVideoTemplates();
  //     setListTemplate(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchActiveTemplatesList = async (newStatus) => {
    try {
      const videoRes = await getVideoTemplates();
      const imageRes = await getImageTemplates();
      setListTemplate(videoRes);
      setImageTemplates(imageRes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchActiveTemplatesList();
  }, []);
  // const fetchFilteredTemplatesList = async (newStatus) => {
  //   try {
  //     if (tabs === "all") {
  //       const res = await getTemplatesDetails();
  //       setTemplates(res);
  //     } else {
  //       const res = await getFilteredVideoTemplates(newStatus);
  //       setTemplates(res);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchFilteredTemplatesList = async (newStatus) => {
  //   try {
  //     if (tabs === "all") {
  //       if (selectedTemplateType === 'image') {
  //         const res = await getImageTemplates(); // Use image-specific API
  //         setTemplates(res);
  //       } else {
  //         const res = await getTemplatesDetails();
  //         const filteredRes = res.filter(template =>
  //           template.template_type === 'video'
  //         );
  //         setTemplates(filteredRes);
  //       }
  //     } else {
  //       const res = await getFilteredVideoTemplates(newStatus);
  //       const filteredRes = res.filter(template =>
  //         template.template_type === selectedTemplateType
  //       );
  //       setTemplates(filteredRes);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const fetchFilteredTemplatesList = async (newStatus) => {
    try {
      let apiParams = { template_type: selectedTemplateType };

      if (tabs !== "all") {
        apiParams.status = newStatus;
      }

      console.log("Fetching templates with params:", apiParams); // DEBUG

      // Use unified API with template_type parameter
      const res = await getTemplatesDetails(selectedTemplateType, apiParams);
      console.log("Templates received:", res); // DEBUG

      setTemplates(res);
    } catch (error) {
      console.log("Error fetching templates:", error);
    }
  };
  useEffect(() => {
    fetchFilteredTemplatesList(status);
  }, [tabs]);
  useEffect(() => {
    fetchFilteredTemplatesList(status);
  }, [selectedTemplateType]); // This was missing!

  useEffect(() => {
    return () => {
      if (window.livePreviewWindow && !window.livePreviewWindow.closed) {
        window.livePreviewWindow.close();
        window.livePreviewWindow = null;
      }
    };
  }, []);

  const handleTabs = (tab) => {
    setTabs(tab);
    if (tab === "Active") {
      setStatus(true);
    } else if (tab === "Inactive") {
      setStatus(false);
    }
  };

  const handleAddTemplateSubmit = async () => {
    try {
      if (!selectedTemplate) {
        throw new Error("Please select a template");
      }
      if (!selectedDoctorId) {
        throw new Error("Doctor ID is missing");
      }

      if (templateType === "video") {
        toast.loading("Creating doctor video...", { id: "create-video" });

        const formData = new FormData();
        formData.append("doctor_id", selectedDoctorId);
        formData.append("template_id", selectedTemplate);

        const response = await createDoctorVideo(formData);

        if (response && response.id && response.video_file) {
          toast.success("Video creation initiated successfully!", {
            id: "create-video",
          });
          setIsAddModalOpen(false);
          setSelectedTemplate("");
          setSelectedDoctorId(null);
          getAllDoctors();
          return;
        }
        throw new Error(response.message || "Failed to create video");
      } else {
        // IMAGE GENERATION FLOW
        toast.loading("Creating doctor image...", { id: "create-image" });

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("template_id", selectedTemplate);
        formData.append("doctor_id", selectedDoctorId);

        // Add doctor image if uploaded
        if (uploadedDoctorImage) {
          formData.append("doctor_image", uploadedDoctorImage);
          console.log(
            "🔍 Adding uploaded image to creation:",
            uploadedDoctorImage.name
          );
        }

        formData.append(
          "content_data",
          JSON.stringify({
            doctor_name: "", // Will be populated from doctor database
            doctor_clinic: "",
            doctor_city: "",
            doctor_specialization: "",
            doctor_state: "",
          })
        );

        console.log(
          "🔍 Frontend: Submitting FormData with image:",
          !!uploadedDoctorImage
        );

        const response = await generateImageContent(formData);

        if (response && response.id && response.output_image_url) {
          toast.success("Image creation successful!", { id: "create-image" });
          setIsAddModalOpen(false);
          setSelectedTemplate("");
          setSelectedDoctorId(null);
          setUploadedDoctorImage(null); // Reset after successful use
          getAllDoctors();
          return;
        }
        throw new Error(response.message || "Failed to create image");
      }
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error(error.message || `Failed to create ${templateType}`, {
        id: templateType === "video" ? "create-video" : "create-image",
      });
    }
  };
  // specialization

  const [expandedRows, setExpandedRows] = useState({});
  const [videoData, setVideoData] = useState({});
  const [imageData, setImageData] = useState({});

  const toggleVideoData = async (doctorId) => {
    const isCurrentlyExpanded = expandedRows[doctorId] || false;
    const isExpanding = !isCurrentlyExpanded;

    // Update expanded state
    setExpandedRows((prev) => ({
      ...prev,
      [doctorId]: isExpanding,
    }));

    // Fetch both video and image data when expanding
    if (isExpanding) {
      // Fetch video data if not already loaded
      if (!videoData[doctorId]) {
        try {
          const videoResponse = await getGeneratedDoctorVideos(doctorId);
          console.log("Video data for doctor", doctorId, ":", videoResponse);
          setVideoData((prev) => ({
            ...prev,
            [doctorId]: videoResponse,
          }));
        } catch (error) {
          console.error("Error fetching video data:", error);
          setVideoData((prev) => ({
            ...prev,
            [doctorId]: [], // Set empty array on error
          }));
        }
      }

      // Fetch image data if not already loaded
      if (!imageData[doctorId]) {
        try {
          const imageResponse = await getGeneratedDoctorImages(doctorId);
          console.log("Image data for doctor", doctorId, ":", imageResponse);
          setImageData((prev) => ({
            ...prev,
            [doctorId]: imageResponse,
          }));
        } catch (error) {
          console.error("Error fetching image data:", error);
          setImageData((prev) => ({
            ...prev,
            [doctorId]: [], // Set empty array on error
          }));
        }
      }
    }
  };
  const handleDisableTemplate = async (templateId, tempStatus) => {
    console.log("diss");
    console.log(tempStatus);
    // setFormData({ ...formData, status: tempStatus });
    try {
      const templateStatus = new FormData();
      templateStatus.append("status", tempStatus);
      const res = await updateEmployeeTemplatesStatus(
        templateId,
        templateStatus
      );

      setStatus(tempStatus);
      if (tempStatus === true) {
        fetchFilteredTemplatesList(true);
        setTabs("Active");
      } else {
        setTabs("Inactive");
        fetchFilteredTemplatesList(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-12 py-11 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-12 py-11 flex justify-center items-center">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error loading data</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleEditModal = async (tempId) => {
    setT_id(tempId);
    try {
      const res = await getTemplatesDetailsById(tempId);
      setIsEditPage(true);
      setIsModalOpen(true);

      // Check if it's an image template
      if (res.template_type === "image") {
        setSelectedTemplateType("image");
        // Set image template data
        setImageFormData({
          templateName: res.name,
          templateImage: res.template_image,
          customText: res.custom_text || "Good Morning",
          textPositions: res.text_positions || {},
          status: res.status,
        });
      } else {
        // Video template (existing logic)
        setSelectedTemplateType("video");
        setFormData({
          ...formData,
          templateName: res.name,
          baseXAxis: res.base_x_axis,
          baseYAxis: res.base_y_axis,
          timeDuration: res.time_duration,
          lineSpacing: res.line_spacing,
          resolution: res.resolution,
          overlay_x: res.overlay_x,
          overlay_y: res.overlay_y,
          templateVideo: res.template_video,
          status: res.status,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleModalClose = () => {
    setIsEditPage(false);
    setIsModalOpen(false);
    setT_id("");
    setFormData({
      templateName: "",
      templateVideo: "",
      baseXAxis: "",
      baseYAxis: "",
      timeDuration: "",
      lineSpacing: "",
      resolution: "",
      overlay_x: "",
      overlay_y: "",
    });
  };

  // const handleImageTemplateSubmit = async (imageData) => {
  //   try {
  //     // Convert text fields to text_positions format
  //     const textPositions = {};
  //     imageData.textFields.forEach(field => {
  //       textPositions[field.name] = { x: field.x, y: field.y };
  //     });

  //     const formDataToSend = new FormData();
  //     formDataToSend.append("name", imageData.templateName);
  //     formDataToSend.append("template_image", imageData.templateImage);
  //     formDataToSend.append("text_positions", JSON.stringify(textPositions));
  //     formDataToSend.append("status", true);

  //     toast.loading("Saving image template...", { id: "save-image-template" });

  //     const response = await AddEmployeeTemplates(formDataToSend, 'image');

  //     if (response && response.id) {
  //       toast.success("Image template saved successfully!", { id: "save-image-template" });
  //       fetchFilteredTemplatesList(status);
  //       handleModalClose();
  //     } else {
  //       throw new Error("Failed to save image template");
  //     }
  //   } catch (error) {
  //     console.error("Error saving image template:", error);
  //     toast.error("Failed to save image template", { id: "save-image-template" });
  //   }
  // };

  // const handleImageTemplateSubmit = async (imageData) => {
  //   try {
  //     console.log("🔍 SUBMITTING IMAGE TEMPLATE with imageData:", imageData); // DEBUG

  //     const textPositions = {};

  //     if (imageData.textPositions) {
  //       Object.keys(imageData.textPositions).forEach((key) => {
  //         textPositions[key] = imageData.textPositions[key];
  //       });
  //     }

  //     if (imageData.customText) {
  //       textPositions.customText = {
  //         ...textPositions.customText,
  //         text: imageData.customText,
  //         x: textPositions.customText?.x || 200,
  //         y: textPositions.customText?.y || 50,
  //       };
  //     }

  //     // CRITICAL: Add image settings to text_positions
  //     if (imageData.imageSettings) {
  //       textPositions.imageSettings = imageData.imageSettings;
  //       console.log(
  //         "🔍 INCLUDING imageSettings in text_positions:",
  //         imageData.imageSettings
  //       ); // DEBUG
  //     }

  //     console.log("🔍 Final text_positions being saved:", textPositions); // DEBUG

  //     const formDataToSend = new FormData();
  //     formDataToSend.append("name", imageData.templateName);
  //     formDataToSend.append("template_image", imageData.templateImage);
  //     formDataToSend.append("text_positions", JSON.stringify(textPositions));
  //     formDataToSend.append("custom_text", imageData.customText || "");
  //     formDataToSend.append("template_type", "image");
  //     formDataToSend.append("status", true);

  //     // DEBUG: Log all FormData entries
  //     for (let [key, value] of formDataToSend.entries()) {
  //       if (key === "text_positions") {
  //         console.log(`🔍 FormData ${key}:`, value);
  //         console.log(`🔍 Parsed ${key}:`, JSON.parse(value));
  //       } else {
  //         console.log(`🔍 FormData ${key}:`, value);
  //       }
  //     }

  //     toast.loading("Saving image template...", { id: "save-image-template" });

  //     const response = await AddEmployeeTemplates(formDataToSend, "image");
  //     console.log("🔍 Template save response:", response); // DEBUG

  //     if (response && response.id) {
  //       toast.success("Image template saved successfully!", {
  //         id: "save-image-template",
  //       });
  //       fetchFilteredTemplatesList(status);
  //       handleModalClose();
  //     } else {
  //       throw new Error("Failed to save image template - no ID returned");
  //     }
  //   } catch (error) {
  //     console.error("🔍 Error saving image template:", error);
  //     toast.error(`Failed to save: ${error.message}`, {
  //       id: "save-image-template",
  //     });
  //   }
  // };

const handleImageTemplateSubmit = async (imageData) => {
  try {
    console.log("SUBMITTING IMAGE TEMPLATE with imageData:", imageData);

    const textPositions = {};

    if (imageData.textPositions) {
      Object.keys(imageData.textPositions).forEach((key) => {
        textPositions[key] = imageData.textPositions[key];
      });
    }

    if (imageData.customText) {
      textPositions.customText = {
        ...textPositions.customText,
        text: imageData.customText,
        x: textPositions.customText?.x || 200,
        y: textPositions.customText?.y || 50,
      };
    }

    if (imageData.imageSettings) {
      textPositions.imageSettings = imageData.imageSettings;
      console.log("INCLUDING imageSettings in text_positions:", imageData.imageSettings);
    }

    console.log("Final text_positions being saved:", textPositions);

    const formDataToSend = new FormData();
    formDataToSend.append("name", imageData.templateName);
    formDataToSend.append("template_image", imageData.templateImage);
    formDataToSend.append("text_positions", JSON.stringify(textPositions));
    formDataToSend.append("custom_text", imageData.customText || "");
    formDataToSend.append("template_type", "image");
    formDataToSend.append("status", true);
    formDataToSend.append("brand_area_settings", JSON.stringify(imageData.brandAreaSettings || {}));

    toast.loading("Saving image template...", { id: "save-image-template" });

    const response = await AddEmployeeTemplates(formDataToSend, "image");

    if (response && response.id) {
      toast.success("Image template saved successfully!", { id: "save-image-template" });
      fetchFilteredTemplatesList(status);
      handleModalClose();
    } else {
      throw new Error("Failed to save image template - no ID returned");
    }
  } catch (error) {
    console.error("Error saving image template:", error);
    toast.error(`Failed to save: ${error.message}`, { id: "save-image-template" });
  }
};

  return (
    <div className="min-h-screen bg-white px-12 py-11">
      {/* Add Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditPage
                  ? "Edit Template"
                  : `Add New ${
                      selectedTemplateType === "video" ? "Video" : "Image"
                    } Template`}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold  leading-none"
              >
                &times;
              </button>
            </div>

            {/* Conditional Form Rendering */}
            {selectedTemplateType === "video" ? (
              // VIDEO TEMPLATE FORM (existing form)
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={formData.templateName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter template name"
                      required
                    />
                  </div>

                  {/* Template Video */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Video
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            templateVideo: e.target.files[0],
                          })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center">
                        <div className="px-4 bg-blue-600 text-white rounded-l-md border border-blue-600 text-sm">
                          Choose File
                        </div>
                        <div className="px-3 py-2 w-full border border-gray-300 rounded-r-md bg-gray-50">
                          {formData.templateVideo
                            ? typeof formData.templateVideo === "string"
                              ? formData.templateVideo.split("/").pop()
                              : formData.templateVideo.name
                            : "No file chosen"}
                        </div>
                      </div>
                    </div>
                    {typeof formData.templateVideo === "string" &&
                      isEditPage && (
                        <video
                          // src={`http://api.videomaker.digielvestech.in${formData.templateVideo}`}
                          src={`http://127.0.0.1:8000/${formData.templateVideo}`}
                          controls
                          className="w-full mt-3 rounded"
                        />
                      )}
                  </div>

                  {/* Base X Axis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base X Axis (e.g., (main_w/2)-150)
                    </label>
                    <input
                      type="text"
                      value={formData.baseXAxis}
                      onChange={(e) =>
                        setFormData({ ...formData, baseXAxis: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter base X axis formula"
                      required
                    />
                  </div>

                  {/* Base Y Axis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Y Axis (e.g., (main_h/2)-45)
                    </label>
                    <input
                      type="text"
                      value={formData.baseYAxis}
                      onChange={(e) =>
                        setFormData({ ...formData, baseYAxis: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter base Y axis formula"
                      required
                    />
                  </div>

                  {/* Time Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Duration (e.g., 10-15 or 10-15,46-50)
                    </label>
                    <input
                      type="text"
                      value={formData.timeDuration}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,-]/g, "");
                        setFormData({ ...formData, timeDuration: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter time ranges like 10-15 or 10-15,46-50"
                      required
                      pattern="^(\d+-\d+,)*\d+-\d+$"
                      title="Enter time ranges like 10-15 or 10-15,46-50 (digits, dashes, and commas only)"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter time ranges in seconds, separated by commas.
                      Example: 10-15 or 10-15,46-50
                    </p>
                  </div>

                  {/* Line Spacing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Spacing
                    </label>
                    <input
                      type="number"
                      value={formData.lineSpacing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lineSpacing: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter line spacing"
                      required
                    />
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution (e.g., 1920x1080)
                    </label>
                    <input
                      type="text"
                      value={formData.resolution}
                      onChange={(e) =>
                        setFormData({ ...formData, resolution: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter resolution"
                      required
                    />
                  </div>

                  {/* Overlay X */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overlay X Position
                    </label>
                    <input
                      type="text"
                      value={formData.overlay_x}
                      onChange={(e) =>
                        setFormData({ ...formData, overlay_x: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter overlay X position"
                      required
                    />
                  </div>

                  {/* Overlay Y */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overlay Y Position
                    </label>
                    <input
                      type="text"
                      value={formData.overlay_y}
                      onChange={(e) =>
                        setFormData({ ...formData, overlay_y: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter overlay Y position"
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="mr-3 px-4 py-2 font-bold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 font-bold py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                    >
                      Save Video Template
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // IMAGE TEMPLATE FORM (new form)
              <ImageTemplateForm
                onSubmit={handleImageTemplateSubmit}
                onCancel={handleModalClose}
              />
            )}
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Item</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedTemplate("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Select Video Template
                </label>
                <div className="space-y-3">
                  {/* Template Type Selection */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Template Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="templateType"
                          value="video"
                          checked={templateType === "video"}
                          onChange={(e) => setTemplateType(e.target.value)}
                          className="mr-2"
                        />
                        Video Template
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="templateType"
                          value="image"
                          checked={templateType === "image"}
                          onChange={(e) => setTemplateType(e.target.value)}
                          className="mr-2"
                        />
                        Image Template
                      </label>
                    </div>
                  </div>
                  {/* Doctor Image Upload - Only show for image templates */}
                  {templateType === "image" && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Doctor Photo (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setUploadedDoctorImage(file);
                            console.log(
                              "🔍 Frontend: Doctor image selected:",
                              file.name
                            );
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      {uploadedDoctorImage && (
                        <div className="mt-2 text-green-600 text-sm">
                          ✅ Image selected: {uploadedDoctorImage.name}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Template Selection */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select {templateType === "video" ? "Video" : "Image"}{" "}
                      Template
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="">Choose Template</option>
                      {(templateType === "video"
                        ? listTemplates
                        : imageTemplates
                      ).map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedTemplate("");
                  }}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTemplateSubmit}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                  disabled={!selectedTemplate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isRecreateModalOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recreate Video</h2>
              <button
                onClick={() => {
                  setIsRecreateModalOpen(false);
                  setSelectedTemplate("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Select Video Template
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Choose Template</option>
                  {listTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecreateModalOpen(false);
                    setSelectedTemplate("");
                  }}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRecreateVideo}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                  disabled={!selectedTemplate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADD THIS NEW IMAGE RECREATION MODAL: */}
      {isRecreateImageModalOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Image</h2>
              <button
                onClick={() => {
                  setIsRecreateImageModalOpen(false);
                  setSelectedTemplate("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Select Image Template
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Choose Template</option>
                  {imageTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecreateImageModalOpen(false);
                    setSelectedTemplate("");
                  }}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRecreateImage}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!selectedTemplate}
                >
                  Create Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {isEditDoctorModalOpen && selectedDoctorForEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Doctor Profile</h2>
              <button
                onClick={() => {
                  setIsEditDoctorModalOpen(false);
                  setSelectedDoctorForEdit(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <EditDoctorForm
              doctor={selectedDoctorForEdit}
              onSave={async (updatedData) => {
                try {
                  toast.loading("Updating doctor...", { id: "update-doctor" });

                  const formData = new FormData();
                  Object.keys(updatedData).forEach((key) => {
                    if (
                      updatedData[key] !== null &&
                      updatedData[key] !== undefined
                    ) {
                      formData.append(key, updatedData[key]);
                    }
                  });

                  await updateDoctor(selectedDoctorForEdit.id, formData);

                  toast.success("Doctor updated successfully!", {
                    id: "update-doctor",
                  });
                  setIsEditDoctorModalOpen(false);
                  setSelectedDoctorForEdit(null);
                  fetchDoctorsData(); // Refresh data
                } catch (error) {
                  toast.error("Failed to update doctor", {
                    id: "update-doctor",
                  });
                  console.error("Update error:", error);
                }
              }}
              onCancel={() => {
                setIsEditDoctorModalOpen(false);
                setSelectedDoctorForEdit(null);
              }}
            />
          </div>
        </div>
      )}

      {/* DELETE DOCTOR CONFIRMATION MODAL */}
      {isDeleteConfirmModalOpen && selectedDoctorForDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Delete Doctor</h2>
              <button
                onClick={() => {
                  setIsDeleteConfirmModalOpen(false);
                  setSelectedDoctorForDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete{" "}
                <strong>{selectedDoctorForDelete.name}</strong>?
              </p>
              <p className="text-red-600 text-sm">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-red-600 text-sm ml-4 mt-2">
                <li>• Doctor profile and information</li>
                <li>
                  • All generated videos (
                  {selectedDoctorForDelete.latest_output_video?.length || 0})
                </li>
                <li>
                  • All generated images (
                  {selectedDoctorForDelete.latest_output_image?.length || 0})
                </li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteConfirmModalOpen(false);
                  setSelectedDoctorForDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    toast.loading("Deleting doctor...", {
                      id: "delete-doctor",
                    });

                    await deleteDoctor(selectedDoctorForDelete.id);

                    toast.success(
                      `${selectedDoctorForDelete.name} deleted successfully!`,
                      { id: "delete-doctor" }
                    );
                    setIsDeleteConfirmModalOpen(false);
                    setSelectedDoctorForDelete(null);
                    fetchDoctorsData(); // Refresh data
                  } catch (error) {
                    toast.error("Failed to delete doctor", {
                      id: "delete-doctor",
                    });
                    console.error("Delete error:", error);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGENERATE CONTENT MODAL */}
      {isRegenerateModalOpen && selectedDoctorForEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Regenerate Content</h2>
              <button
                onClick={() => {
                  setIsRegenerateModalOpen(false);
                  setSelectedDoctorForEdit(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contentType"
                      value="video"
                      checked={regenerateContentType === "video"}
                      onChange={(e) => setRegenerateContentType(e.target.value)}
                      className="mr-2"
                    />
                    📹 Video
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contentType"
                      value="image"
                      checked={regenerateContentType === "image"}
                      onChange={(e) => setRegenerateContentType(e.target.value)}
                      className="mr-2"
                    />
                    🖼️ Image
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {regenerateContentType === "video" ? "Video" : "Image"}{" "}
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="">Choose Template</option>
                  {(regenerateContentType === "video"
                    ? listTemplates
                    : imageTemplates
                  ).map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsRegenerateModalOpen(false);
                    setSelectedDoctorForEdit(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    debugTokens();
                    const token =
                      localStorage.getItem("access_token") ||
                      localStorage.getItem("access");
                    console.log("🔍 Auth token exists:", !!token);
                    console.log(
                      "🔍 Token preview:",
                      token?.substring(0, 20) + "..."
                    );
                    if (!selectedTemplate) {
                      toast.error("Please select a template");
                      return;
                    }

                    try {
                      toast.loading(
                        `Regenerating ${regenerateContentType}...`,
                        { id: "regenerate-content" }
                      );

                      const payload = {
                        doctor_id: selectedDoctorForEdit.id,
                        template_id: selectedTemplate,
                        content_type: regenerateContentType,
                        employee_id: getItemInLocalStorage("UserId")?.replace(
                          /"/g,
                          ""
                        ),
                        content_data:
                          regenerateContentType === "image"
                            ? {
                                // NO custom_text - template handles this
                                doctor_name: selectedDoctorForEdit.name,
                                doctor_clinic: selectedDoctorForEdit.clinic,
                                doctor_city: selectedDoctorForEdit.city,
                                doctor_specialization:
                                  selectedDoctorForEdit.specialization,
                                doctor_state: selectedDoctorForEdit.state,
                              }
                            : {},
                      };

                      console.log("🔍 VIDEO REGENERATION PAYLOAD:", payload);
                      console.log("🔍 Content type:", payload.content_type);
                      console.log("🔍 Doctor ID:", payload.doctor_id);
                      console.log("🔍 Template ID:", payload.template_id);
                      await regenerateContent(payload);

                      toast.success(
                        `${
                          regenerateContentType.charAt(0).toUpperCase() +
                          regenerateContentType.slice(1)
                        } regenerated successfully!`,
                        { id: "regenerate-content" }
                      );
                      setIsRegenerateModalOpen(false);
                      setSelectedDoctorForEdit(null);
                      setSelectedTemplate("");
                      fetchDoctorsData(); // Refresh data
                    } catch (error) {
                      toast.error(
                        `Failed to regenerate ${regenerateContentType}`,
                        { id: "regenerate-content" }
                      );
                      console.error("Regenerate error:", error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Regenerate {regenerateContentType === "video" ? "📹" : "🖼️"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center md:justify-end mb-5 md:mb-8">
        <img src={logo} alt="Company Logo" className="w-auto h-20" />
      </div>

      <nav className="text-lg text-gray-500 mb-4 space-x-1 font-bold">
        <span>My Videos</span>
        <span>&gt;</span>
        <span>Templates</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Videos</span>
      </nav>

      <div className="mt-15 mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {viewMode === "gallery" && USERTYPE === "Admin"
            ? "Video Template Gallery"
            : "Doctor Data"}
        </h1>
        <p className="text-gray-600 font-semibold text-lg">
          {viewMode === "gallery" && USERTYPE === "Admin"
            ? "Choose a template to start your next video project."
            : "View and manage doctor information."}
        </p>
      </div>

      <div className="w-full flex justify-center gap-4 mb-6">
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 rounded-md font-bold flex items-center gap-2 ${
            viewMode === "table"
              ? "bg-blue-800 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FaTable /> Table
        </button>
        {USERTYPE === "Admin" && (
          <button
            onClick={() => setViewMode("gallery")}
            className={`px-4 py-2 rounded-md font-bold flex items-center gap-2 ${
              viewMode === "gallery"
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <FaVideo /> Gallery
          </button>
        )}
        {viewMode === "table" && (
          <>
            <button
              onClick={fetchDownloadDoctorData}
              className="flex items-center gap-3 bg-blue-800 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-900 transition"
            >
              <FaDownload /> Export
            </button>
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-3 bg-blue-800 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-900 transition"
            >
              <FaBackward /> Home Page
            </button>
          </>
        )}
      </div>

      {viewMode === "gallery" && USERTYPE === "Admin" ? (
        <>
          <div className="flex justify-between items-center mb-5">
            {/* ADD TEMPLATE TYPE TABS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedTemplateType("video");
                  fetchFilteredTemplatesList(status);
                }}
                className={`font-bold px-4 py-2 rounded transition ${
                  selectedTemplateType === "video"
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Video Templates
              </button>
              <button
                onClick={() => {
                  setSelectedTemplateType("image");
                  fetchFilteredTemplatesList(status);
                }}
                className={`font-bold px-4 py-2 rounded transition ${
                  selectedTemplateType === "image"
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Image Templates
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold bg-blue-800 text-white px-5 py-2 cursor-pointer rounded hover:bg-blue-900 transition"
            >
              Add {selectedTemplateType === "video" ? "Video" : "Image"}{" "}
              Template
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleTabs("all")}
              className={`font-bold ${
                tabs === "all"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-black"
              }   px-5 py-2 cursor-pointer rounded hover:bg-blue-900 transition`}
            >
              All
            </button>
            <button
              onClick={() => handleTabs("Active")}
              className={`font-bold ${
                tabs === "Active"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-black"
              }   px-5 py-2 cursor-pointer rounded hover:bg-blue-900 transition`}
            >
              Active
            </button>
            <button
              onClick={() => handleTabs("Inactive")}
              className={`font-bold ${
                tabs === "Inactive"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-black"
              }   px-5 py-2 cursor-pointer rounded hover:bg-blue-900 transition`}
            >
              Inactive
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => {
              // console.log("Template:", template.name, "Type:", template.template_type);
              return (
                <div
                  key={template.id}
                  className={`border rounded-xl p-6 flex flex-col justify-between transition-all ${
                    !template.status
                      ? "bg-gray-100 border-gray-300 opacity-75"
                      : "bg-blue-50 border-gray-200 hover:shadow-md"
                  }`}
                >
                  {/* <div className="text-xs text-red-500 mb-2">
                    Debug: Type = {template.template_type || 'UNDEFINED'}
                  </div> */}
                  <div
                    className={`w-full mb-4 ${
                      !template.status ? "text-gray-600" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full shadow flex items-center justify-center mb-4 ${
                        !template.status ? "bg-gray-300" : "bg-[#0A0A6433]"
                      }`}
                    >
                      {template.template_type === "image" ? (
                        <FaImage
                          className={
                            !template.status ? "text-gray-500" : "text-blue-800"
                          }
                        />
                      ) : (
                        <FaVideo
                          className={
                            !template.status ? "text-gray-500" : "text-blue-800"
                          }
                        />
                      )}
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        !template.status ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {template.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        !template.status ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      Created:{" "}
                      {new Date(template.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* <div className="h-40 overflow-hidden rounded-lg mb-4 bg-black">
              <video
                src={`http://api.videomaker.digielvestech.in${template.template_video}`}
                className="w-full h-full object-contain"
                controls
                disabled={isDisabled}
              />
            </div> */}

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => template.status && navigate("/gallery")}
                        disabled={!template.status}
                        className={`w-full py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition ${
                          !template.status
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-800 text-white hover:bg-blue-900"
                        }`}
                      >
                        {template.template_type === "image" ? (
                          <FaImage />
                        ) : (
                          <FaVideo />
                        )}{" "}
                        Use Template
                      </button>
                      <button
                        onClick={() => handleEditModal(template.id)}
                        className={`w-full py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition bg-blue-800 text-white hover:bg-blue-900 `}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className={`w-full border py-2 rounded-md font-bold transition ${
                          !template.status
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-400 bg-white text-gray-800 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (!template.status) return;
                          console.log("Template preview data:", template); // DEBUG

                          let fileUrl = null;

                          // For image templates
                          if (template.template_type === "image") {
                            fileUrl =
                              template.template_image_url ||
                              template.template_image;
                            console.log("Image template file URL:", fileUrl);
                          }
                          // For video templates
                          else if (template.template_type === "video") {
                            fileUrl =
                              template.template_video_url ||
                              template.template_video;
                            console.log("Video template file URL:", fileUrl);
                          }

                          console.log("Raw file URL:", fileUrl); // DEBUG

                          if (fileUrl) {
                            let fullUrl;

                            // Handle different URL formats
                            if (fileUrl.startsWith("http")) {
                              fullUrl = fileUrl;
                            } else if (fileUrl.startsWith("/media/")) {
                              fullUrl = `http://localhost:8000${fileUrl}`;
                            } else if (fileUrl.startsWith("media/")) {
                              fullUrl = `http://localhost:8000/${fileUrl}`;
                            } else {
                              fullUrl = `http://localhost:8000/media/${fileUrl}`;
                            }

                            console.log("Final URL to open:", fullUrl); // DEBUG

                            // Test if URL is accessible
                            fetch(fullUrl, { method: "HEAD" })
                              .then((response) => {
                                if (response.ok) {
                                  window.open(fullUrl, "_blank");
                                } else {
                                  console.error(
                                    "URL not accessible:",
                                    fullUrl,
                                    "Status:",
                                    response.status
                                  );
                                  toast.error("Preview file not accessible");
                                }
                              })
                              .catch((error) => {
                                console.error("Error checking URL:", error);
                                // Try opening anyway
                                window.open(fullUrl, "_blank");
                              });
                          } else {
                            console.error(
                              "No file URL found for template:",
                              template
                            );
                            toast.error(
                              "No template file available for preview"
                            );
                          }
                        }}
                        disabled={!template.status}
                      >
                        Preview
                      </button>

                      <button
                        className={`w-full py-2 rounded-md font-bold transition ${
                          !template.status
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "border border-red-400 bg-white text-red-600 hover:bg-red-50"
                        }`}
                        onClick={() =>
                          handleDisableTemplate(
                            template.id,
                            template.status ? false : true
                          )
                        }
                      >
                        {!template.status ? "Enable" : "Disable"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <div className="flex justify-end items-center mb-4">
            {/* <div className="flex items-center">
              <span className="mr-2">Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="ml-2">entries</span>
            </div> */}
            <div className="flex items-center">
              <div>
                <FaSearch size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by doctor name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-1 ml-4"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor Name
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSpecializationFilter(!showSpecializationFilter);
                      }}
                    >
                      <div className="flex items-center cursor-pointer">
                        Specialization
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {showSpecializationFilter && (
                        <div
                          className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1 max-h-60 overflow-auto">
                            <div
                              className={`px-4 py-2 text-sm cursor-pointer ${
                                selectedSpecialization === ""
                                  ? "bg-blue-100 text-blue-800"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                setSelectedSpecialization("");
                                setShowSpecializationFilter(false);
                              }}
                            >
                              All Specializations
                            </div>
                            {getUniqueSpecializations().map((spec) => (
                              <div
                                key={spec}
                                className={`px-4 py-2 text-sm cursor-pointer ${
                                  selectedSpecialization === spec
                                    ? "bg-blue-100 text-blue-800"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  setSelectedSpecialization(spec);
                                  setShowSpecializationFilter(false);
                                }}
                              >
                                {spec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital / Clinic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WhatsApp Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created by
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RBM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Share
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((doctor) => (
                    <React.Fragment key={doctor.id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => toggleVideoData(doctor.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye size={20} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.specialization ||
                            doctor.specialization_key ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.clinic || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.state || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.city || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.mobile_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.whatsapp_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(doctor.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {" "}
                          {doctor.employee_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {" "}
                          {doctor.rbm_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.latest_output_video &&
                          doctor.latest_output_video.length > 0 ? (
                            <button
                              onClick={() => {
                                const latestVideo =
                                  doctor.latest_output_video[0];
                                navigator.clipboard.writeText(
                                  // `http://api.videomaker.digielvestech.in${latestVideo?.video_file}`
                                  `http://127.0.0.1:8000/${latestVideo?.video_file}`
                                );
                                toast.success(
                                  "Video link copied to clipboard!"
                                );
                              }}
                              className="text-blue-600 hover:underline font-bold cursor-pointer"
                            >
                              Copy Video Link
                            </button>
                          ) : (
                            <span className="text-gray-500">No video</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.latest_output_video &&
                          doctor.latest_output_video.length > 0 ? (
                            // <a href={`http://api.videomaker.digielvestech.in${doctor.latest_output_video[
                            <a
                              href={`http://127.0.0.1:8000/${
                                doctor.latest_output_video[
                                  doctor.latest_output_video.length - 1
                                ]?.video_file
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              View Video
                            </a>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <span className="text-red-500 text-xs">
                                No videos yet
                              </span>
                              {/* Only show Create Video button if no image exists */}
                              {!doctor.latest_output_image ||
                              doctor.latest_output_image.length === 0 ? (
                                <button
                                  onClick={() => handleRecreateModal(doctor.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition flex items-center justify-center"
                                >
                                  Create Video
                                </button>
                              ) : (
                                <span className="text-gray-400 text-xs italic">
                                  Image available instead
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        {/* ADD THESE TWO NEW IMAGE COLUMNS: */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.latest_output_image &&
                          doctor.latest_output_image.length > 0 ? (
                            <button
  onClick={async () => {
    try {
      const latestImage = doctor.latest_output_image[0];
      const url = getAbsoluteImageUrl(
        latestImage.output_image_url ||
          latestImage.output_image
      );
      await navigator.clipboard.writeText(url);
      toast.success("Image link copied to clipboard!");
    } catch (error) {
      console.error('Copy failed:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Image link copied to clipboard!");
    }
  }}
  className="text-green-600 hover:underline font-bold cursor-pointer"
>
  Copy Image Link
</button>
                          ) : (
                            <span className="text-gray-500">Not available</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.latest_output_image &&
                          doctor.latest_output_image.length > 0 ? (
                            <button
  onClick={() => {
    const url = getAbsoluteImageUrl(
      doctor.latest_output_image[0]?.output_image_url ||
        doctor.latest_output_image[0]?.output_image
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }}
  className="text-green-600 hover:underline font-semibold cursor-pointer bg-transparent border-none p-0"
>
  View Image
</button>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <span className="text-red-500 text-xs">
                                No images yet
                              </span>
                              {/* Only show Create Image button if no video exists */}
                              {!doctor.latest_output_video ||
                              doctor.latest_output_video.length === 0 ? (
                                <button
                                  onClick={() =>
                                    handleRecreateImageModal(doctor.id)
                                  }
                                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition flex items-center justify-center"
                                >
                                  Create Image
                                </button>
                              ) : (
                                <span className="text-gray-400 text-xs italic">
                                  Video available instead
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          <button
                            onClick={() => {
                              setSelectedDoctorId(doctor.id);
                              setIsAddModalOpen(true);
                            }}
                            className="flex gap-2 font-medium"
                          >
                            Add{" "}
                            <IoMdAddCircle className="font-medium" size={20} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {doctor.whatsapp_number && (
                            <div className="flex items-center space-x-2">
                              {/* Video Share */}
                              {doctor.latest_output_video &&
                                doctor.latest_output_video.length > 0 && (
                                  // <a href={`https://wa.me/${doctor.whatsapp_number}?text=Check out this video: http://api.videomaker.digielvestech.in${doctor.latest_output_video[doctor.latest_output_video.length - 1]?.video_file}`}
                                  <a
                                    href={`https://wa.me/${doctor.whatsapp_number}?text=Check out this video: http://127.0.0.1:8000/${doctor.latest_output_video[0]?.video_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                    title="Share Video on WhatsApp"
                                  >
                                    <FaWhatsapp size={18} />
                                    <span className="text-xs ml-1">📹</span>
                                  </a>
                                )}

                              {/* Image Share */}
                              {doctor.latest_output_image &&
                                doctor.latest_output_image.length > 0 && (
                                  <a
                                    href={`https://wa.me/${
                                      doctor.whatsapp_number
                                    }?text=Check out this image: ${
                                      doctor.latest_output_image[
                                        doctor.latest_output_image.length - 1
                                      ]?.output_image_url ||
                                      doctor.latest_output_image[
                                        doctor.latest_output_image.length - 1
                                      ]?.output_image
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:text-green-700 flex items-center"
                                    title="Share Image on WhatsApp"
                                  >
                                    <FaWhatsapp size={18} />
                                    <span className="text-xs ml-1">🖼️</span>
                                  </a>
                                )}

                              {/* No content available */}
                              {(!doctor.latest_output_video ||
                                doctor.latest_output_video.length === 0) &&
                                (!doctor.latest_output_image ||
                                  doctor.latest_output_image.length === 0) && (
                                  <span
                                    className="text-gray-400"
                                    title="No content to share"
                                  >
                                    <FaWhatsapp size={18} />
                                  </span>
                                )}
                            </div>
                          )}

                          {/* No WhatsApp number */}
                          {!doctor.whatsapp_number && (
                            <span className="text-gray-400 text-xs">
                              No WhatsApp
                            </span>
                          )}
                        </td>
                        {/* ADD THIS NEW ACTIONS COLUMN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setSelectedDoctorForEdit(doctor);
                                setIsEditDoctorModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="Edit Doctor"
                            >
                              <FaEdit size={16} />
                            </button>

                            {/* Regenerate Button */}
                            <button
                              onClick={() => {
                                setSelectedDoctorForEdit(doctor);
                                setIsRegenerateModalOpen(true);
                              }}
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                              title="Regenerate Content"
                            >
                              🔄
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                setSelectedDoctorForDelete(doctor);
                                setIsDeleteConfirmModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Delete Doctor"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedRows[doctor.id] && (
                        <tr className="bg-gray-50">
                          <td colSpan={16} className="px-6 py-4">
                            <div className="flex flex-col space-y-4">
                              {videoData[doctor.id] ? (
                                videoData[doctor.id].length > 0 ? (
                                  [...videoData[doctor.id]]
                                    .sort(
                                      (a, b) =>
                                        new Date(b.created_at) -
                                        new Date(a.created_at)
                                    )
                                    .map((video) => (
                                      <div
                                        key={video.id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                                      >
                                        <div>
                                          <p className="font-medium">
                                            Video ID: {video.id}
                                          </p>
                                          <p className="text-sm text-gray-500 font-bold">
                                            Created:{" "}
                                            {new Date(
                                              video.created_at
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="flex space-x-3">
                                          {video.video_file ? (
                                            <>
                                              <button
                                                onClick={() => {
                                                  // const videoUrl = `http://api.videomaker.digielvestech.in${video.video_file}`;
                                                  const videoUrl = `http://127.0.0.1:8000/${video.video_file}`;
                                                  navigator.clipboard.writeText(
                                                    videoUrl
                                                  );
                                                  toast.success(
                                                    "Video link copied!"
                                                  );
                                                }}
                                                className="px-3 py-1 font-bold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
                                              >
                                                Copy Link
                                              </button>
                                              <a
                                                // href={`http://api.videomaker.digielvestech.in${video.video_file}`}
                                                href={`http://127.0.0.1:8000/${video.video_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 font-bold bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm"
                                              >
                                                View Video
                                              </a>
                                              <a
                                                href={`https://wa.me/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-500 hover:text-green-700"
                                              >
                                                <FaWhatsapp size={20} />
                                              </a>
                                            </>
                                          ) : (
                                            <span className="text-yellow-600 text-sm flex items-center">
                                              Video not available
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No videos found for this doctor
                                  </div>
                                )
                              ) : (
                                <div className="text-center py-4">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto"></div>
                                  <p className="mt-2">
                                    Loading video details...
                                  </p>
                                </div>
                              )}
                            </div>
                            {/* Image Content Section */}
                            <div>
                              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                                <FaImage className="mr-2" /> Images (
                                {imageData[doctor.id]?.length || 0})
                              </h4>
                              {imageData[doctor.id] ? (
                                imageData[doctor.id].length > 0 ? (
                                  [...imageData[doctor.id]]
                                    .sort(
                                      (a, b) =>
                                        new Date(b.created_at) -
                                        new Date(a.created_at)
                                    )
                                    .map((image) => (
                                      <div
                                        key={image.id}
                                        className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                                      >
                                        <div>
                                          <p className="font-medium">
                                            Image ID: {image.id}
                                          </p>
                                          <p className="text-sm text-gray-500 font-bold">
                                            Created:{" "}
                                            {new Date(
                                              image.created_at
                                            ).toLocaleString()}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            Template:{" "}
                                            {image.template_name || "Unknown"}
                                          </p>
                                        </div>
                                        <div className="flex space-x-3">
                                          {image.output_image_url ||
                                          image.output_image ? (
                                            <>
                                              <button
                                                onClick={() => {
                                                  const imageUrl =
                                                    image.output_image_url ||
                                                    image.output_image;
                                                  navigator.clipboard.writeText(
                                                    imageUrl
                                                  );
                                                  toast.success(
                                                    "Image link copied!"
                                                  );
                                                }}
                                                className="px-3 py-1 font-bold bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm"
                                              >
                                                Copy Link
                                              </button>

                                              <a
                                                href={
                                                  image.output_image_url ||
                                                  image.output_image
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 font-bold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
                                              >
                                                View Image
                                              </a>

                                              <a
                                                href={`https://wa.me/${
                                                  doctor.whatsapp_number
                                                }?text=Check out this image: ${
                                                  image.output_image_url ||
                                                  image.output_image
                                                }`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-500 hover:text-green-700"
                                              >
                                                <FaWhatsapp size={20} />
                                              </a>
                                            </>
                                          ) : (
                                            <span className="text-yellow-600 text-sm flex items-center">
                                              Image not available
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500 bg-gray-100 rounded-lg">
                                    No images found for this doctor
                                    <button
                                      onClick={() =>
                                        handleRecreateImageModal(doctor.id)
                                      }
                                      className="block mx-auto mt-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                                    >
                                      Create First Image
                                    </button>
                                  </div>
                                )
                              ) : (
                                <div className="text-center py-4">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                                  <p className="mt-2">
                                    Loading image details...
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4 mb-3 mx-3 items-center space-x-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
              >
                First
              </button>

              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!prevPageUrl}
                className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
              >
                Previous
              </button>

              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-1 rounded ${
                    pageNumber === page
                      ? "bg-blue-500 text-white font-semibold shadow"
                      : "bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!nextPageUrl}
                className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
              >
                Last
              </button>
            </div>

            {/* <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
              <div>
                Showing {indexOfFirstRow + 1} to{" "}
                {Math.min(indexOfLastRow, doctorsData.length)} of{" "}
                {doctorsData.length} entries
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  First
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded font-bold ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Next
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Last
                </button>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageTemplateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    templateName: "",
    templateImage: null,
    customText: "Good Morning",
    fieldOrder: ["name", "specialization", "clinic", "city", "state", "brand"],
    textPositions: {
      customText: {
        x: 200,
        y: 50,
        fontSize: 48,
        color: "#0000ff",
        fontFamily: "Arial",
        fontWeight: "bold",
      },
      name: {
        x: 100,
        y: 120,
        fontSize: 40,
        color: "#000000",
        fontFamily: "Arial",
        fontWeight: "bold",
      },
      specialization: {
        x: 100,
        y: 170,
        fontSize: 36,
        color: "#666666",
        fontFamily: "Arial",
        fontWeight: "normal",
      },
      clinic: {
        x: 100,
        y: 220,
        fontSize: 32,
        color: "#000000",
        fontFamily: "Arial",
        fontWeight: "normal",
      },
      city: {
        x: 100,
        y: 270,
        fontSize: 32,
        color: "#000000",
        fontFamily: "Arial",
        fontWeight: "normal",
      },
      state: {
        x: 100,
        y: 320,
        fontSize: 32,
        color: "#000000",
        fontFamily: "Arial",
        fontWeight: "normal",
      },
    },
    // ADD THIS NEW SECTION:
    imageSettings: {
      enabled: false, // Whether to show doctor image
      x: 400, // X position
      y: 50, // Y position
      width: 150, // Image width
      height: 150, // Image height
      fit: "cover", // 'cover', 'contain', 'stretch'
      borderRadius: 50, // Corner rounding (0-100%)
      opacity: 100, // Image transparency (10-100%)
      border: {
        enabled: false,
        width: 2,
        color: "#000000",
      },
    },
    brandAreaSettings: {
    enabled: false,
    x: 50,
    y: 400,
    width: 700,
    height: 150,
    brandWidth: 150,
    brandHeight: 90,
  },
  });

  const [previewImage, setPreviewImage] = useState(null);



  // Handle image upload and create preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, templateImage: file });

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);

        // Get actual image dimensions
        const img = new Image();
        img.onload = () => {
          console.log(`📐 Image dimensions: ${img.width}x${img.height}`);
          toast.success(`Image loaded: ${img.width}x${img.height}px`);

          // Update form state with dimension info
          setFormData((prev) => ({
            ...prev,
            imageDimensions: { width: img.width, height: img.height },
          }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const [previewMode, setPreviewMode] = useState(false);

  const updatePosition = (fieldName, axis, value) => {
    console.log(`🔧 Updating ${fieldName}.${axis} to:`, value);

    let processedValue = value;

    if (axis === "x" || axis === "y" || axis === "fontSize") {
      processedValue = parseInt(value) || 0;

      if (axis === "x" || axis === "y") {
        processedValue = Math.max(0, Math.min(2000, processedValue));
      }
      if (axis === "fontSize") {
        processedValue = Math.max(12, Math.min(120, processedValue));
      }
    }

    const newFormData = {
      ...formData,
      textPositions: {
        ...formData.textPositions,
        [fieldName]: {
          ...formData.textPositions[fieldName],
          [axis]: processedValue,
        },
      },
    };

    console.log(
      `✅ New ${fieldName} position:`,
      newFormData.textPositions[fieldName]
    );
    setFormData(newFormData);

    // ENHANCED: Update live preview immediately
    if (window.livePreviewWindow && !window.livePreviewWindow.closed) {
      try {
        window.livePreviewWindow.updatePositions(
          newFormData.textPositions,
          newFormData.customText,
          newFormData.imageSettings
        );
      } catch (error) {
        console.warn("Failed to update live preview:", error);
        // Try to recreate connection
        setTimeout(() => {
          try {
            window.livePreviewWindow.updatePositions(
              newFormData.textPositions,
              newFormData.customText,
              newFormData.imageSettings
            );
          } catch (e) {
            console.warn("Live preview connection lost");
          }
        }, 100);
      }
    }
  };

  // Add this function after updatePosition
  const updateImageSetting = (setting, value) => {
    console.log(`🔧 Updating image ${setting} to:`, value);

    let processedValue = value;

    // Handle different value types
    if (
      setting === "x" ||
      setting === "y" ||
      setting === "width" ||
      setting === "height"
    ) {
      processedValue = parseInt(value) || 0;

      // Boundary checking
      const canvasWidth = formData.imageDimensions?.width || 800;
      const canvasHeight = formData.imageDimensions?.height || 600;

      if (setting === "x") {
        processedValue = Math.max(
          0,
          Math.min(canvasWidth - formData.imageSettings.width, processedValue)
        );
      }
      if (setting === "y") {
        processedValue = Math.max(
          0,
          Math.min(canvasHeight - formData.imageSettings.height, processedValue)
        );
      }
      if (setting === "width" || setting === "height") {
        processedValue = Math.max(50, Math.min(400, processedValue));
      }
    }

    if (setting === "borderRadius" || setting === "opacity") {
      processedValue = parseInt(value) || 0;
    }

    const newFormData = {
      ...formData,
      imageSettings: {
        ...formData.imageSettings,
        [setting]: processedValue,
      },
    };

    setFormData(newFormData);

    // Update live preview immediately
    if (window.livePreviewWindow && !window.livePreviewWindow.closed) {
      try {
        window.livePreviewWindow.updatePositions(
          newFormData.textPositions,
          newFormData.customText,
          newFormData.imageSettings
        );
      } catch (error) {
        console.warn("Failed to update live preview:", error);
      }
    }
  };

  const updateBrandAreaSetting = (setting, value) => {
  console.log(`Updating brand area ${setting} to:`, value);

  let processedValue = value;
  if (setting === "x" || setting === "y" || setting === "width" || setting === "height" || setting === "brandWidth" || setting === "brandHeight") {
    processedValue = parseInt(value) || 0;
  }

  const newFormData = {
    ...formData,
    brandAreaSettings: {
      ...formData.brandAreaSettings,
      [setting]: processedValue,
    },
  };

  setFormData(newFormData);
  if (window.livePreviewWindow && !window.livePreviewWindow.closed) {
    try {
      window.livePreviewWindow.updatePositions(
        newFormData.textPositions,
        newFormData.customText,
        newFormData.imageSettings,
        newFormData.brandAreaSettings // ADD THIS PARAMETER
      );
    } catch (error) {
      console.warn("Failed to update live preview:", error);
    }
  }
};

  //Add this function to receive updates from the live preview window
  //Add this function to receive updates from the live preview window
  window.updatePositionFromPreview = (fieldName, x, y) => {
    setFormData((prev) => ({
      ...prev,
      textPositions: {
        ...prev.textPositions,
        [fieldName]: {
          ...prev.textPositions[fieldName],
          x: x,
          y: y,
        },
      },
    }));
  };

  window.updateImagePositionFromPreview = (x, y) => {
    setFormData((prev) => ({
      ...prev,
      imageSettings: {
        ...prev.imageSettings,
        x: x,
        y: y,
      },
    }));
  };

  window.updateBrandAreaPositionFromPreview = (x, y) => {
  setFormData((prev) => ({
    ...prev,
    brandAreaSettings: {
      ...prev.brandAreaSettings,
      x: x,
      y: y,
    },
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!formData.templateName.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!formData.templateImage) {
      toast.error("Template image is required");
      return;
    }
    if (!formData.customText.trim()) {
      toast.error("Custom text is required");
      return;
    }

    // Validate text positions
    const validatePosition = (field, position) => {
      if (position.x < 0 || position.y < 0) {
        toast.error(`${field} position cannot be negative`);
        return false;
      }
      if (position.x > 2000 || position.y > 2000) {
        toast.error(`${field} position is too large (max 2000px)`);
        return false;
      }
      return true;
    };

    for (const [fieldName, position] of Object.entries(
      formData.textPositions
    )) {
      if (!validatePosition(fieldName, position)) return;
    }

    // Prepare final payload
    // Prepare final payload including brand data
const finalFormData = {
  ...formData,
  textPositions: {
    ...formData.textPositions,
    customText: {
      ...formData.textPositions.customText,
      text: formData.customText,
    },
  },
  imageSettings: formData.imageSettings,
  brandAreaSettings: formData.brandAreaSettings,
};

    try {
      console.log("Submitting template with custom text:", finalFormData);

      // Step 1: Create the template
      await onSubmit(finalFormData);
      
      toast.success("Template and brand positions saved successfully");
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("Failed to save template or brand positions");
    }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Name
        </label>
        <input
          type="text"
          value={formData.templateName}
          onChange={(e) =>
            setFormData({ ...formData, templateName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter template name"
          required
        />
      </div>

      {/* Custom Text */}
      {/* Custom Text with Styling Controls */}
      <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-medium text-blue-700 mb-2">
          Custom Text & Styling
        </label>

        {/* Custom Text Input */}
        <div>
          <textarea
            value={formData.customText}
            onChange={(e) => {
              const newText = e.target.value;
              setFormData({ ...formData, customText: newText });
              // Update live preview with new text content - ENHANCED
              if (
                window.livePreviewWindow &&
                !window.livePreviewWindow.closed
              ) {
                try {
                  setTimeout(() => {
                    window.livePreviewWindow.updatePositions(
                      formData.textPositions,
                      newText
                    );
                  }, 10);
                } catch (error) {
                  console.warn("Failed to update live preview text:", error);
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter custom text like 'Good Morning&#10;New line supported'"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Press Enter for new lines
          </p>
        </div>

        {/* Font & Color Controls */}
        <div className="grid grid-cols-2 gap-3">
          {/* Font Size */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Font Size
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={formData.textPositions.customText?.fontSize || 48}
              onChange={(e) =>
                updatePosition("customText", "fontSize", e.target.value)
              }
              className="w-full"
            />
            <span className="text-xs text-gray-500">
              {formData.textPositions.customText?.fontSize || 48}px
            </span>
          </div>

          {/* Text Color */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.textPositions.customText?.color || "#0000ff"}
                onChange={(e) => {
                  console.log("🎨 Color changed to:", e.target.value); // DEBUG
                  updatePosition("customText", "color", e.target.value);
                }}
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formData.textPositions.customText?.color || "#0000ff"}
                onChange={(e) =>
                  updatePosition("customText", "color", e.target.value)
                }
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#0000ff"
              />
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Font Family
            </label>
            <select
              value={formData.textPositions.customText?.fontFamily || "Arial"}
              onChange={(e) => {
                console.log("📝 Font changed to:", e.target.value); // DEBUG
                updatePosition("customText", "fontFamily", e.target.value);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>

          {/* Font Weight */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Font Weight
            </label>
            <select
              value={formData.textPositions.customText?.fontWeight || "bold"}
              onChange={(e) =>
                updatePosition("customText", "fontWeight", e.target.value)
              }
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="600">Semi Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>

          {/* Text Shadow */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Text Shadow
            </label>
            <select
              value={formData.textPositions.customText?.textShadow || "none"}
              onChange={(e) =>
                updatePosition("customText", "textShadow", e.target.value)
              }
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="none">None</option>
              <option value="1px 1px 2px rgba(0,0,0,0.5)">Light Shadow</option>
              <option value="2px 2px 4px rgba(0,0,0,0.7)">Medium Shadow</option>
              <option value="3px 3px 6px rgba(0,0,0,0.9)">Heavy Shadow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Image Settings */}
      <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-green-700 mb-2">
            Doctor Image Settings (Optional)
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.imageSettings.enabled}
              onChange={(e) => {
                const newFormData = {
                  ...formData,
                  imageSettings: {
                    ...formData.imageSettings,
                    enabled: e.target.checked,
                  },
                };
                setFormData(newFormData);

                if (
                  window.livePreviewWindow &&
                  !window.livePreviewWindow.closed
                ) {
                  try {
                    window.livePreviewWindow.updatePositions(
                      newFormData.textPositions,
                      newFormData.customText,
                      newFormData.imageSettings
                    );
                  } catch (error) {
                    console.warn("Failed to update live preview:", error);
                  }
                }
              }}
              className="mr-2"
            />
            <span className="text-sm text-green-700 font-medium">
              Show Doctor Photo
            </span>
          </label>
        </div>

        {formData.imageSettings.enabled && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Left Position
                </label>
                <input
                  type="number"
                  min="0"
                  max="800"
                  value={formData.imageSettings.x}
                  onChange={(e) => updateImageSetting("x", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Top Position
                </label>
                <input
                  type="number"
                  min="0"
                  max="600"
                  value={formData.imageSettings.y}
                  onChange={(e) => updateImageSetting("y", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Width
                </label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={formData.imageSettings.width}
                  onChange={(e) => updateImageSetting("width", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Height
                </label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={formData.imageSettings.height}
                  onChange={(e) => updateImageSetting("height", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Image Fit
                </label>
                <select
                  value={formData.imageSettings.fit}
                  onChange={(e) => updateImageSetting("fit", e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="cover">Cover (Crop to fit)</option>
                  <option value="contain">Contain (Show full)</option>
                  <option value="stretch">Stretch (Distort)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.imageSettings.borderRadius}
                  onChange={(e) =>
                    updateImageSetting("borderRadius", e.target.value)
                  }
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {formData.imageSettings.borderRadius}%
                </span>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Opacity
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.imageSettings.opacity}
                  onChange={(e) =>
                    updateImageSetting("opacity", e.target.value)
                  }
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {formData.imageSettings.opacity}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Template Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Image
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center">
            <div className="px-4 bg-blue-600 text-white rounded-l-md border border-blue-600 text-sm">
              Choose Image
            </div>
            <div className="px-3 py-2 w-full border border-gray-300 rounded-r-md bg-gray-50">
              {formData.templateImage
                ? formData.templateImage.name
                : "No image chosen"}
            </div>
          </div>
        </div>
      </div>

      {/* Field Position & Styling Controls */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Doctor Field Positions & Styling
        </label>
        <div className="space-y-3">
          {formData.fieldOrder.map((fieldName, index) => (
            <div
              key={fieldName}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium mr-3 bg-blue-100 px-2 py-1 rounded">
                  #{index + 1}
                </span>
                <span className="capitalize font-medium">{fieldName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  (Doctor's {fieldName})
                </span>
              </div>

              {/* Position Controls */}
              {/* Position Controls */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-xs text-gray-600">Left</label>
                  <input
                    type="number"
                    value={formData.textPositions[fieldName]?.x || 0}
                    onChange={(e) =>
                      updatePosition(fieldName, "x", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Top</label>
                  <input
                    type="number"
                    value={formData.textPositions[fieldName]?.y || 0}
                    onChange={(e) =>
                      updatePosition(fieldName, "y", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Size</label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    value={formData.textPositions[fieldName]?.fontSize || 32}
                    onChange={(e) =>
                      updatePosition(fieldName, "fontSize", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={
                        formData.textPositions[fieldName]?.color || "#000000"
                      }
                      onChange={(e) => {
                        console.log(
                          `🎨 ${fieldName} color changed to:`,
                          e.target.value
                        );
                        updatePosition(fieldName, "color", e.target.value);
                      }}
                      className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.textPositions[fieldName]?.color || "#000000"
                      }
                      onChange={(e) =>
                        updatePosition(fieldName, "color", e.target.value)
                      }
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Controls */}
              {/* Advanced Controls */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Font</label>
                  <select
                    value={
                      formData.textPositions[fieldName]?.fontFamily || "Arial"
                    }
                    onChange={(e) =>
                      updatePosition(fieldName, "fontFamily", e.target.value)
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Weight</label>
                  <select
                    value={
                      formData.textPositions[fieldName]?.fontWeight || "normal"
                    }
                    onChange={(e) =>
                      updatePosition(fieldName, "fontWeight", e.target.value)
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semi Bold</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Shadow</label>
                  <select
                    value={
                      formData.textPositions[fieldName]?.textShadow || "none"
                    }
                    onChange={(e) =>
                      updatePosition(fieldName, "textShadow", e.target.value)
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="none">None</option>
                    <option value="1px 1px 2px rgba(0,0,0,0.5)">Light</option>
                    <option value="2px 2px 4px rgba(0,0,0,0.7)">Medium</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {/* Brand Area Settings */}
<div className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
  <div className="flex items-center justify-between">
    <label className="block text-sm font-medium text-purple-700 mb-2">
      Brand Area Settings
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={formData.brandAreaSettings?.enabled || false}
        onChange={(e) => {
          const newFormData = {
            ...formData,
            brandAreaSettings: {
              ...formData.brandAreaSettings,
              enabled: e.target.checked,
            },
          };
          setFormData(newFormData);
        }}
        className="mr-2"
      />
      <span className="text-sm text-purple-700 font-medium">
        Enable Brand Area
      </span>
    </label>
  </div>

  {formData.brandAreaSettings?.enabled && (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Area X Position
          </label>
          <input
            type="number"
            min="0"
            value={formData.brandAreaSettings.x || 50}
            onChange={(e) => updateBrandAreaSetting("x", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Area Y Position
          </label>
          <input
            type="number"
            min="0"
            value={formData.brandAreaSettings.y || 400}
            onChange={(e) => updateBrandAreaSetting("y", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Area Width
          </label>
          <input
            type="number"
            min="100"
            value={formData.brandAreaSettings.width || 700}
            onChange={(e) => updateBrandAreaSetting("width", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Area Height
          </label>
          <input
            type="number"
            min="50"
            value={formData.brandAreaSettings.height || 150}
            onChange={(e) => updateBrandAreaSetting("height", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-xs text-gray-600 mb-1 block">
      Brand Logo Width (px)
    </label>
    <input
      type="number"
      min="50"
      max="300"
      value={formData.brandAreaSettings.brandWidth || 100}
      onChange={(e) => updateBrandAreaSetting("brandWidth", e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
    />
    <span className="text-xs text-gray-500">Current: {formData.brandAreaSettings.brandWidth || 100}px</span>
  </div>
  <div>
    <label className="text-xs text-gray-600 mb-1 block">
      Brand Logo Height (px)
    </label>
    <input
      type="number"
      min="30"
      max="200"
      value={formData.brandAreaSettings.brandHeight || 60}
      onChange={(e) => updateBrandAreaSetting("brandHeight", e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
    />
    <span className="text-xs text-gray-500">Current: {formData.brandAreaSettings.brandHeight || 60}px</span>
  </div>
</div>

<div className="text-xs text-gray-500 p-2 bg-gray-100 rounded mt-2">
  Preview: Brands will appear as {formData.brandAreaSettings.brandWidth || 100} × {formData.brandAreaSettings.brandHeight || 60} pixels when this template is used
</div>

      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
        Brands will be automatically arranged in this area when users create content
      </div>
    </>
  )}
</div>
        </div>
      </div>
      {/* Custom Text Position */}
      {/* Custom Text Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Text Position
        </label>
        <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm font-medium text-blue-700">
            "{formData.customText}"
          </span>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-600">
              <span>Left Position: </span>
              <input
                type="number"
                placeholder="Left"
                value={formData.textPositions.customText?.x || 0}
                onChange={(e) =>
                  updatePosition("customText", "x", e.target.value)
                }
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="text-xs text-gray-600">
              <span>Top Position: </span>
              <input
                type="number"
                placeholder="Top"
                value={formData.textPositions.customText?.y || 0}
                onChange={(e) =>
                  updatePosition("customText", "y", e.target.value)
                }
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex justify-center gap-3">
        {previewImage && (
          <button
            type="button"
            onClick={() => {
              // Close existing preview window if open
              if (
                window.livePreviewWindow &&
                !window.livePreviewWindow.closed
              ) {
                window.livePreviewWindow.close();
              }

              const livePreviewWindow = window.open(
                "",
                "live-preview",
                "width=1200,height=800,scrollbars=yes,resizable=yes"
              );

              // Store the reference globally
              window.livePreviewWindow = livePreviewWindow;

              window.getBrandDataForPreview = () => {
                return selectedBrands.map((brand) => ({
                  id: brand.value,
                  imageUrl: brand.image,
                  position: brandPositions[brand.value] || {
                    x: 0,
                    y: 600,
                    width: 100,
                    height: 100,
                    fit: "contain",
                  },
                }));
              };

              window.injectDraggableLogos = injectDraggableLogos;

              const canvasWidth = formData.imageDimensions?.width || 800;
              const canvasHeight = formData.imageDimensions?.height || 600;
              livePreviewWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Live Template Preview</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f0f0f0; }
    .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .canvas { position: relative; border: 2px solid #333; margin: 20px auto; background-size: cover; background-repeat: no-repeat; background-position: center; overflow: hidden; }
    .text-element { position: absolute; border: 2px dashed #3b82f6; background: rgba(255,255,255,0.8); padding: 4px 8px; border-radius: 4px; cursor: move; user-select: none; white-space: pre-line; transition: all 0.2s ease; min-width: 20px; min-height: 20px; }
    .text-element:hover { background: rgba(59,130,246,0.1); transform: scale(1.02); }
    .doctor-image { position: absolute; border: 2px dashed #10b981; background: #e8f4f8; cursor: move; display: flex; align-items: center; justify-content: center; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"); background-size: 60%; background-repeat: no-repeat; background-position: center; }
    .coords { position: absolute; top: -25px; left: 0; background: #333; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; pointer-events: none; z-index: 1000; }
    .field-label { position: absolute; top: -50px; right: 0; background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; pointer-events: none; z-index: 1000; }
    .header { text-align: center; margin-bottom: 20px; }
    .controls { margin-bottom: 20px; text-align: center; }
    .sync-indicator { display: inline-block; padding: 4px 8px; background: #10b981; color: white; border-radius: 4px; font-size: 12px; margin-left: 10px; }
    .brand-area { 
  position: absolute; 
  border: 3px dashed #9333ea; 
  background: rgba(147, 51, 234, 0.1); 
  cursor: move; 
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.brand-area:hover { 
  background: rgba(147, 51, 234, 0.2); 
  transform: scale(1.02); 
}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎨 Live Template Preview</h2>
      <p>✨ Real-time updates: Colors, fonts, and positions sync instantly! Drag elements to reposition.</p>
      <div class="controls">
        <span>Canvas: ${canvasWidth}×${canvasHeight}px</span>
        <span class="sync-indicator" id="syncStatus">🔄 Synced</span>
      </div>
    </div>
    <div id="canvas" class="canvas" style="width: ${canvasWidth}px; height: ${canvasHeight}px; background-image: url('${previewImage}');">
    </div>
  </div>
  
  <script>
    let isDragging = false;
    let currentElement = null;
    let dragOffset = { x: 0, y: 0 };
    
    const CANVAS_WIDTH = ${canvasWidth};
    const CANVAS_HEIGHT = ${canvasHeight};
    const PADDING = 10;
    
    function setSyncStatus(status, color = '#10b981') {
      const indicator = document.getElementById('syncStatus');
      if (indicator) {
        indicator.textContent = status;
        indicator.style.background = color;
        setTimeout(() => {
          indicator.textContent = '✅ Synced';
          indicator.style.background = '#10b981';
        }, 1000);
      }
    }
    
    function updateCoords(coordsElement, x, y) {
      coordsElement.textContent = 'x:' + x + ', y:' + y;
    }
    
    function applyElementStyles(element, position) {
      element.style.left = (position.x || 0) + 'px';
      element.style.top = (position.y || 0) + 'px';
      element.style.fontSize = (position.fontSize || 32) + 'px';
      element.style.color = position.color || '#000000';
      element.style.fontFamily = position.fontFamily || 'Arial';
      element.style.fontWeight = position.fontWeight || 'normal';
      
      if (position.textShadow && position.textShadow !== 'none') {
        element.style.textShadow = position.textShadow;
      } else {
        element.style.textShadow = '';
      }
    }
    
    function updateElementStyle(fieldName, position, text) {
      const element = document.querySelector('[data-field="' + fieldName + '"]');
      if (!element) {
        console.warn('Element not found for field: ' + fieldName);
        return;
      }
      
      // Update text content for custom text
      if (fieldName === 'customText' && text !== undefined) {
        const textLines = String(text).split('\\n');
        element.innerHTML = '';
        textLines.forEach((line, index) => {
          if (index > 0) element.appendChild(document.createElement('br'));
          element.appendChild(document.createTextNode(line));
        });
        
        // Re-add coords and label
        const coords = document.createElement('div');
        coords.className = 'coords';
        updateCoords(coords, position.x, position.y);
        element.appendChild(coords);
        
        const fieldLabel = document.createElement('div');
        fieldLabel.className = 'field-label';
        fieldLabel.textContent = 'Custom Text';
        element.appendChild(fieldLabel);
      }
      
      // Apply styles
      applyElementStyles(element, position);
      
      // Update coordinates display
      const coords = element.querySelector('.coords');
      if (coords) {
        updateCoords(coords, position.x, position.y);
      }
      
      setSyncStatus('🔄 Updated', '#2563eb');
    }
    
    function createTextElement(fieldName, text, position, label) {
      const canvas = document.getElementById('canvas');
      const element = document.createElement('div');
      element.className = 'text-element';
      element.dataset.field = fieldName;
      
      // Handle multi-line text
      const textLines = String(text).split('\\n');
      element.innerHTML = '';
      textLines.forEach((line, index) => {
        if (index > 0) element.appendChild(document.createElement('br'));
        element.appendChild(document.createTextNode(line));
      });
      
      // Apply styling
      applyElementStyles(element, position);
      
      // Add coordinates display
      const coords = document.createElement('div');
      coords.className = 'coords';
      updateCoords(coords, position.x, position.y);
      element.appendChild(coords);
      
      // Add field label
      const fieldLabel = document.createElement('div');
      fieldLabel.className = 'field-label';
      fieldLabel.textContent = label;
      element.appendChild(fieldLabel);
      
      // Add drag functionality
      element.addEventListener('mousedown', (e) => startDrag(e, element));
      
      canvas.appendChild(element);
    }
    
    function createDoctorImage(imageSettings) {
      if (!imageSettings || !imageSettings.enabled) return;
      const canvas = document.getElementById('canvas');
      const imageElement = document.createElement('div');
      imageElement.className = 'doctor-image';
      imageElement.dataset.field = 'doctorImage';
      imageElement.style.left = imageSettings.x + 'px';
      imageElement.style.top = imageSettings.y + 'px';
      imageElement.style.width = imageSettings.width + 'px';
      imageElement.style.height = imageSettings.height + 'px';
      imageElement.style.borderRadius = imageSettings.borderRadius + '%';
      imageElement.style.opacity = imageSettings.opacity / 100;
      
      // Add coordinates display
      const coords = document.createElement('div');
      coords.className = 'coords';
      updateCoords(coords, imageSettings.x, imageSettings.y);
      imageElement.appendChild(coords);
      
      // Add field label
      const fieldLabel = document.createElement('div');
      fieldLabel.className = 'field-label';
      fieldLabel.textContent = 'Doctor Photo';
      fieldLabel.style.background = '#10b981';
      imageElement.appendChild(fieldLabel);
      
      // Add drag functionality
      imageElement.addEventListener('mousedown', (e) => startDrag(e, imageElement));
      
      canvas.appendChild(imageElement);
    }

    function createBrandArea(brandAreaSettings) {
  if (!brandAreaSettings || !brandAreaSettings.enabled) return;
  
  const canvas = document.getElementById('canvas');
  const areaElement = document.createElement('div');
  areaElement.className = 'brand-area';
  areaElement.dataset.field = 'brandArea';
  areaElement.style.position = 'absolute';
  areaElement.style.left = brandAreaSettings.x + 'px';
  areaElement.style.top = brandAreaSettings.y + 'px';
  areaElement.style.width = brandAreaSettings.width + 'px';
  areaElement.style.height = brandAreaSettings.height + 'px';
  areaElement.style.border = '3px dashed #9333ea';
  areaElement.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
  areaElement.style.cursor = 'move';
  areaElement.style.boxSizing = 'border-box';
  
  // Add label
  const label = document.createElement('div');
  label.style.position = 'absolute';
  label.style.top = '-30px';
  label.style.left = '0';
  label.style.background = '#9333ea';
  label.style.color = 'white';
  label.style.padding = '4px 8px';
  label.style.borderRadius = '4px';
  label.style.fontSize = '12px';
  label.style.fontWeight = 'bold';
  label.textContent = 'Brand Area (' + brandAreaSettings.brandWidth + '×' + brandAreaSettings.brandHeight + ' each)';
  areaElement.appendChild(label);
  
  // Add coordinates display
  const coords = document.createElement('div');
  coords.className = 'coords';
  coords.style.background = '#9333ea';
  updateCoords(coords, brandAreaSettings.x, brandAreaSettings.y);
  areaElement.appendChild(coords);
  
  // Add drag functionality
  areaElement.addEventListener('mousedown', (e) => startDrag(e, areaElement));
  
  canvas.appendChild(areaElement);
  console.log('Created brand area at', brandAreaSettings.x, brandAreaSettings.y);
}

function updateBrandArea(brandAreaSettings) {
  const existingArea = document.querySelector('.brand-area');
  if (existingArea) {
    existingArea.remove();
  }
  
  if (brandAreaSettings && brandAreaSettings.enabled) {
    createBrandArea(brandAreaSettings);
  }
}

    function updateDoctorImage(imageSettings) {
      const existingImage = document.querySelector('.doctor-image');
      if (existingImage) {
        existingImage.remove();
      }
      
      if (imageSettings && imageSettings.enabled) {
        createDoctorImage(imageSettings);
      }
    }
    
    function startDrag(e, element) {
      isDragging = true;
      currentElement = element;
      const rect = element.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      element.style.zIndex = '1000';
      element.style.transform = 'scale(1.05)';
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
      e.preventDefault();
      
      setSyncStatus('🤏 Dragging', '#f59e0b');
    }

    function onDrag(e) {
      if (!isDragging || !currentElement) return;
      
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      const x = Math.max(PADDING, Math.min(e.clientX - canvasRect.left - dragOffset.x, CANVAS_WIDTH - 100));
      const y = Math.max(PADDING, Math.min(e.clientY - canvasRect.top - dragOffset.y, CANVAS_HEIGHT - 50));
      
      currentElement.style.left = x + 'px';
      currentElement.style.top = y + 'px';
      
      const coords = currentElement.querySelector('.coords');
      if (coords) {
        updateCoords(coords, x, y);
      }

      // Update parent window in real-time
      if (window.opener && !window.opener.closed) {
        try {
          const fieldName = currentElement.dataset.field;
          if (fieldName === 'doctorImage') {
  window.opener.updateImagePositionFromPreview(x, y);
} else if (fieldName === 'brandArea') {
  window.opener.updateBrandAreaPositionFromPreview(x, y);
} else {
  window.opener.updatePositionFromPreview(fieldName, x, y);
}
        } catch (error) {
          console.warn('Failed to update parent:', error);
        }
      }
      setSyncStatus('🔄 Moved', '#2563eb');
    }

    function stopDrag() {
      if (currentElement) {
        currentElement.style.zIndex = '';
        currentElement.style.transform = '';
      }
      isDragging = false;
      currentElement = null;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      setSyncStatus('✅ Position Updated', '#10b981');
    }
    
    function createTextElements() {
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = '';
      
      const positions = ${JSON.stringify(formData.textPositions)};
      const customText = ${JSON.stringify(formData.customText)};
      const imageSettings = ${JSON.stringify(formData.imageSettings)};
      const brandAreaSettings = ${JSON.stringify(formData.brandAreaSettings)};
      
      
      console.log('Creating elements with:', { positions, customText, imageSettings });
      
      // Create custom text element
      if (positions.customText) {
        createTextElement('customText', customText, positions.customText, 'Custom Text');
      }
      
      // Create doctor field elements
      const sampleData = {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist', 
        clinic: 'City Hospital',
        city: 'Mumbai',
        state: 'Maharashtra'
      };
      
      const fieldLabels = {
        name: 'Doctor Name',
        specialization: 'Specialization',
        clinic: 'Clinic/Hospital',
        city: 'City',
        state: 'State'
      };
      
      ['name', 'specialization', 'clinic', 'city', 'state'].forEach(field => {
        if (positions[field]) {
          createTextElement(field, sampleData[field], positions[field], fieldLabels[field]);
        }
      });
      
      // Create doctor image if enabled
// Create doctor image if enabled
if (imageSettings && imageSettings.enabled) {
  createDoctorImage(imageSettings);
}

// Create brand area if enabled
if (brandAreaSettings && brandAreaSettings.enabled) {
  createBrandArea(brandAreaSettings);
}

setSyncStatus('Elements Created');
    }
    
    // ENHANCED: Real-time update function
    window.updatePositions = function(positions, customText, imageSettings, brandAreaSettings) {
      console.log('🚀 Real-time update:', { positions, customText, imageSettings });
      
      try {
        // Update custom text
        if (positions.customText) {
          updateElementStyle('customText', positions.customText, customText);
        }
        
        // Update doctor fields
        const sampleData = {
          name: 'Dr. John Smith',
          specialization: 'Cardiologist', 
          clinic: 'City Hospital',
          city: 'Mumbai',
          state: 'Maharashtra'
        };
        
        ['name', 'specialization', 'clinic', 'city', 'state'].forEach(field => {
          if (positions[field]) {
            updateElementStyle(field, positions[field], sampleData[field]);
          }
        });
        
        // Update doctor image
// Update doctor image
updateDoctorImage(imageSettings);

// Update brand area
updateBrandArea(brandAreaSettings);

setSyncStatus('🔄 Live Update', '#2563eb');
      } catch (error) {
        console.error('Update error:', error);
        setSyncStatus('❌ Update Failed', '#ef4444');
      }
    };
    
    // Initialize
    createTextElements();
    setSyncStatus('🚀 Ready');
    
    console.log('✅ Live preview loaded successfully!');
  </script>
</body>
</html>`);
              livePreviewWindow.document.close();

             function injectDraggableLogos(previewWindow, brandData) {
               const container =
                 previewWindow.document.getElementById("canvas");
               if (!container) {
                 console.warn("Logo container not found in preview window.");
                 return;
               }

               brandData.forEach((brand) => {
                 const existingWrapper = previewWindow.document.getElementById(
                   `brand-${brand.id}`
                 );
                 if (existingWrapper) {
                   // Update position and size if already injected
                   existingWrapper.style.left = (brand.position?.x ?? 0) + "px";
                   existingWrapper.style.top = (brand.position?.y ?? 0) + "px";
                   existingWrapper.style.width =
                     (brand.position?.width ?? 100) + "px";
                   existingWrapper.style.height =
                     (brand.position?.height ?? 100) + "px";
                   return; // Skip re-injection
                 }

                 const wrapper = previewWindow.document.createElement("div");
                 wrapper.style.position = "absolute";
                 wrapper.style.left = (brand.position?.x ?? 0) + "px";
                 wrapper.style.top = (brand.position?.y ?? 0) + "px";
                 wrapper.style.width = (brand.position?.width ?? 100) + "px";
                 wrapper.style.height = (brand.position?.height ?? 100) + "px";
                 wrapper.style.cursor = "move";
                 wrapper.style.border = "1px dashed #ccc";
                 wrapper.style.boxSizing = "border-box";
                 wrapper.id = `brand-${brand.id}`;

                 const logo = previewWindow.document.createElement("img");
                 logo.src = brand.imageUrl;
                 logo.alt = `Logo for brand ${brand.id}`;
                 logo.style.width = "100%";
                 logo.style.height = "100%";
                 logo.style.objectFit = brand.position?.fit || "contain";
                 logo.style.pointerEvents = "none";

                 const resizeHandle =
                   previewWindow.document.createElement("div");
                 resizeHandle.style.position = "absolute";
                 resizeHandle.style.width = "10px";
                 resizeHandle.style.height = "10px";
                 resizeHandle.style.right = "0";
                 resizeHandle.style.bottom = "0";
                 resizeHandle.style.cursor = "nwse-resize";
                 resizeHandle.style.background = "#000";

                 wrapper.appendChild(logo);
                 wrapper.appendChild(resizeHandle);
                 container.appendChild(wrapper);

                 // 🖱️ Drag logic
                 let isDragging = false;
                 let offsetX = 0;
                 let offsetY = 0;

                 wrapper.addEventListener("mousedown", (e) => {
                   if (e.target === resizeHandle) return;
                   isDragging = true;
                   offsetX = e.clientX - wrapper.offsetLeft;
                   offsetY = e.clientY - wrapper.offsetTop;
                   previewWindow.document.body.style.userSelect = "none";
                 });

                 previewWindow.document.addEventListener("mousemove", (e) => {
                   if (isDragging) {
                     wrapper.style.left = e.clientX - offsetX + "px";
                     wrapper.style.top = e.clientY - offsetY + "px";
                   } else if (isResizing) {
                     const newWidth = startWidth + (e.clientX - startX);
                     const newHeight = startHeight + (e.clientY - startY);
                     wrapper.style.width = newWidth + "px";
                     wrapper.style.height = newHeight + "px";
                   }
                 });

                 previewWindow.document.addEventListener("mouseup", () => {
                   if (isDragging) {
                     isDragging = false;
                     previewWindow.document.body.style.userSelect = "auto";

                     const finalX = parseInt(wrapper.style.left, 10);
                     const finalY = parseInt(wrapper.style.top, 10);

                     if (previewWindow.opener && !previewWindow.opener.closed) {
                       try {
                         previewWindow.opener.syncBrandPositionFromPreview(
                           brand.id,
                           finalX,
                           finalY
                         );
                       } catch (err) {
                         console.warn(
                           "Failed to sync position to parent:",
                           err
                         );
                       }
                     }
                   }

                   if (isResizing) {
                     isResizing = false;

                     const finalWidth = parseInt(wrapper.style.width, 10);
                     const finalHeight = parseInt(wrapper.style.height, 10);

                     if (previewWindow.opener && !previewWindow.opener.closed) {
                       try {
                         previewWindow.opener.syncBrandSizeFromPreview(
                           brand.id,
                           finalWidth,
                           finalHeight
                         );
                       } catch (err) {
                         console.warn("Failed to sync size to parent:", err);
                       }
                     }
                   }
                 });

                 // 🖱️ Resize logic
                 let isResizing = false;
                 let startWidth, startHeight, startX, startY;

                 resizeHandle.addEventListener("mousedown", (e) => {
                   e.stopPropagation();
                   isResizing = true;
                   startWidth = wrapper.offsetWidth;
                   startHeight = wrapper.offsetHeight;
                   startX = e.clientX;
                   startY = e.clientY;
                 });
               });
             }
              // // ✅ Call after preview window is ready
              // setTimeout(() => {
              //   injectDraggableLogos(livePreviewWindow, brandData);
              // }, 300);
              window.livePreviewWindow = livePreviewWindow;
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🚀 Open Live Preview
          </button>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="mr-3 px-4 py-2 font-bold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 font-bold py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
        >
          Save Image Template
        </button>
      </div>
    </form>
  );
};

// Add this function outside your component
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};
const EditDoctorForm = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: doctor.name || "",
    clinic: doctor.clinic || "",
    city: doctor.city || "",
    state: doctor.state || "",
    specialization: doctor.specialization || "",
    specialization_key: doctor.specialization_key || "",
    mobile_number: doctor.mobile_number || "",
    whatsapp_number: doctor.whatsapp_number || "",
    description: doctor.description || "",
  });

  const [newImage, setNewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = { ...formData };
    if (newImage) {
      updateData.image = newImage;
    }

    onSave(updateData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clinic/Hospital
          </label>
          <input
            type="text"
            name="clinic"
            value={formData.clinic}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Specialization
          </label>
          <input
            type="text"
            name="specialization_key"
            value={formData.specialization_key}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number
          </label>
          <input
            type="text"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Update Profile Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {doctor.image && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Current image:</p>
            <img
              src={doctor.image}
              alt="Current"
              className="w-20 h-20 object-cover rounded mt-1"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
export default Gallery;
// aaa

//! DONE-04

//! DONE this live editor-- now pn chatgpt..