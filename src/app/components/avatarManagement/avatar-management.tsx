import React, { useState, useEffect } from "react";
import { Plus, Upload, Save, Download, X, RefreshCw, ChevronDown, Pencil, Trash2, Camera} from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import CameraModal from './CameraModal';
import { ToastContainer, toast } from 'react-toastify';



const AvatarManagement = () => {
  const preExistingAvatars = [];

  const [myAvatars, setMyAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Avatar Generation States
  const [gender, setGender] = useState("");
  const [skin, setSkin] = useState("");
  const [style, setStyle] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [generationStyle, setGenerationStyle] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [generationDropdownOpen, setGenerationDropdownOpen] = useState(false);
  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    setEditedName(selectedStudio.name);
    setIsEditing(false);
  };

  const email = localStorage.getItem("userEmail");

  const addAvatarToList = (avatar) => {
    if (!myAvatars.some((a) => a.id === avatar.id)) {
      setMyAvatars([...myAvatars, avatar]);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification(message);
    setNotificationType(type);
  };

  const handleGenerateAvatar = async () => {
    // Validate required fields
    if (!gender || !skin || !generationStyle) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const avatarPrompt = `Create a detailed avatar with the following characteristics:
      - Gender: ${gender}
      - Skin: ${skin}
      - Style: ${generationStyle}
    `;
  
    const formData = new FormData();
    formData.append("prompt", avatarPrompt);
  
    if (referenceImage) {
      if (referenceImage instanceof File) {
        formData.append("referenceImage", referenceImage);
      } else {
        toast.error("Invalid Reference Image Format.");
        return;
      }
    }
  
    setIsGenerating(true);
    setGeneratedAvatar(null);
  
    try {
      const response = await toast.promise(
        axios.post(
          "http://192.168.1.71:8083/avatar_gen/generate_avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        ),
        {
          pending: "Generating your avatar...",
          success: "Avatar generated successfully!",
          error: {
            render({ data }) {
              const err = data.response?.data?.message || data.message || "Unknown error occurred";
              return `Failed to generate avatar: ${err}`;
            },
          },
        }
      );
  
      // Process blob and create object URL
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
  
      const newAvatar = {
        id: Date.now(),
        imgSrc: imageUrl,
        name: avatarName || `${gender} ${generationStyle} Avatar`,
        blob,
      };
  
      setGeneratedAvatar(newAvatar);
    } catch (error) {
      console.error("Error generating avatar:", error);
      // No need to show toast.error here since it's handled inside toast.promise
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleDownloadAvatar = () => {
     if (generatedAvatar) {
      console.log("Generated Avatar:", generatedAvatar);
      const fileName = downloadFileName || "generated_avatar";
      const link = document.createElement("a");
      link.href = generatedAvatar.imgSrc;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("No generated avatar available for download.");
    }
  };

  const handleDownloadSelectedAvatar = () => {
    if (selectedAvatar) {
      const link = document.createElement("a");
      link.href = selectedAvatar.imgSrc;
      link.download = `${selectedAvatar.name || "avatar"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showNotification("No avatar selected to download.", "error");
    }
  };

  const handleReferenceImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReferenceImage(file); // Store the file directly
    }
  };

  const handleOpenCameraModal = () => {
    setIsCameraModalOpen(true);
  };

  const handleCameraCapture = (imageBlob: Blob) => {
    setReferenceImage(new File([imageBlob], 'camera-photo.jpg', { type: 'image/jpeg' }));
  };

  const StylesOption = [
    "Realistic",
    "Cartoon",
    "Anime",
    "Fantasy",
    "Surrealism",
    "Steampunk",
  ];

  // Update fetchAvatars function
  const fetchAvatars = async (selectedStyle = "", searchName = "") => {
    try {
      setIsLoading(true);
      const email = localStorage.getItem("userEmail") || "test@example.com";

      // Build params object with all filters
      const params = {
        email,
        ...(selectedStyle && selectedStyle !== "All"
          ? { style: selectedStyle.toLowerCase() }
          : {}),
        ...(searchName ? { name: searchName } : {}),
      };

      const response = await axios.get(
        `http://192.168.1.141:3001/avatar/getAvatars`,
        { params }
      );
      console.log("API Response:", response.data);

      const fetchedAvatars = response.data.map((avatar) => ({
        id: avatar.id,
        imgSrc: `http://192.168.1.141:3001${avatar.imgSrc}`.replace(/([^:]\/)\/+/g, "$1"), // Fix double slashes
        name: avatar.name,
        style: avatar.style,
      }));

      setMyAvatars(fetchedAvatars);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      setMyAvatars([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to include avatarName in dependencies
  useEffect(() => {
    fetchAvatars(style, avatarName);
  }, [style, avatarName]);

  const handleStyleChange = (selectedStyle) => {
    setStyle(selectedStyle);
    setFilterDropdownOpen(false);
  };

  const handleGenerationStyleChange = (selectedStyle) => {
    setGenerationStyle(selectedStyle);
    setGenerationDropdownOpen(false);
  };

  // Update handleAvatarNameChange
  const handleAvatarNameChange = (e) => {
    const newName = e.target.value;
    setAvatarName(newName);
  };

  const handleNameEdit = () => {
    if (selectedAvatar) {
      setEditedName(selectedAvatar.name);
      setIsEditing(true);
    }
  };

  const handleSaveAvatar = async () => {
    if (!downloadFileName.trim()) {
      toast.info("Please provide a name for the avatar.")
      // showNotification("Please provide a file name for the avatar.", "error");
      return;
    }

    if (generatedAvatar?.blob) {
      try {

        // Create a function to read the file as Base64
        const readFileAsDataURL = (blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          });
        };

        // Get Base64 string
        const base64String = await readFileAsDataURL(generatedAvatar.blob);
        const base64Image = base64String.split(",")[1];

        if (!base64Image) {
          throw new Error("Failed to process image data");
        }

        // Create payload
        const payload = {
          email: localStorage.getItem("userEmail") || "test@example.com",
          image: base64Image,
          style: generationStyle.toLowerCase(),
          name: downloadFileName,
        };

        console.log(
          "Sending payload with image data length:",
          base64Image.length
        );

        // Show toast.promise and send data to API
        const response = await toast.promise(
          axios.post("http://192.168.1.141:3001/avatar/addAvatar", payload),
          {
            pending: "Saving avatar...",
            success: "Avatar added to your collection!",
            error: {
              render({ data }) {
                const errMsg = data?.response?.data?.message || data?.message || "Unknown error occurred";
                return `Failed to save avatar: ${errMsg}`;
              },
            },
          }
        );


        const data = response.data;
        console.log("Avatar saved to the database:", data);

        if (data) {
          const savedAvatar = {
            id: data._id || Date.now(),
            imgSrc: generatedAvatar.imgSrc,
            name: payload.name,
            style: payload.style,
          };

          setMyAvatars((prev) => [...prev, savedAvatar]);
          setSelectedAvatar(savedAvatar);
          setIsModalOpen(false);
          // showNotification("Avatar added to your collection!", "success");
          // toast.success("Avatar added to your collection!")

          //Reset all the data after they input the avatar
          setGeneratedAvatar(null);
          setDownloadFileName("");
          setGenerationStyle("");  // Changed from setStyle to setGenerationStyle
          setGender("");
          setSkin("");
          setReferenceImage(null);
        }
      } catch (error) {
        console.error("Error saving avatar:", error);
        // showNotification(`Failed to save avatar: ${error.message}`, "error");
        toast.error("Failed to save avatar: " + error.message);
      }
    } else {
      // showNotification("No avatar to save!", "error");
      toast.error("No Avatar to save. Please try again.");
    }
  };

  const handleNameSave = async () => {
    if (!selectedAvatar) {
      // showNotification("No avatar selected to update.", "error");
      toast.info("No avatar selected to update.")
      return;
    }

    const newName = editedName.trim();
    if (!newName) {
      toast.info("Please enter a valid name to save.");
      // showNotification("Please enter a valid name to save.", "error");
      return;
    }

    try {
      const avatarId = selectedAvatar.id;

      // Validate required parameters
      if (!avatarId) {
        throw new Error("Missing required parameter: avatar ID.");
      }

      // Use PATCH method for updating the avatar name
      const response = await axios.patch(
        `http://192.168.1.141:3001/avatar/updateAvatar?id=${avatarId}&email=${email}&name=${newName}`
      );

      if (response.data.status === "success") {
        const updatedAvatar = { ...selectedAvatar, name: newName };
        setSelectedAvatar(updatedAvatar);
        setMyAvatars((prev) =>
          prev.map((av) => (av.id === avatarId ? updatedAvatar : av))
        );
        setIsEditing(false);
        // showNotification("Avatar name updated successfully!", "success");
        toast.success("Avatar name updated successfully!")
      } else {
        throw new Error(
          response.data.message || "Failed to update avatar name"
        );
      }
    } catch (error) {
      console.error("Error updating avatar name:", error);

      showNotification(
        `Failed to update avatar name: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };

  const handleDeleteAvatar = async () => {
    if (!selectedAvatar) {
      toast.error("No avatar selected to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this avatar? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const avatarId = selectedAvatar.id;

      // Validate required parameter
      if (!avatarId) {
        throw new Error("Missing required parameter: avatar ID.");
      }

      // Use PATCH method for deleting the avatar
      const email = localStorage.getItem("userEmail");
      const response = await axios.delete(
        `http://192.168.1.141:3001/avatar/delete?id=${avatarId}&email=${email}`
      );

      if (response.data.status === "success") {
        setMyAvatars((prev) => prev.filter((av) => av.id !== avatarId));
        setSelectedAvatar(null);
        toast.success("Avatar Deleted Successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete avatar");
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error(`Failed to delete avatar: ${error.message}`);
      // showNotification(`Failed to delete avatar: ${error.message}`, "error");
    }
  };

  return (
    // CONTAINER
    <div className = "px-[100px] flex flex-col"> 
      {/* MAIN CONTENT */}
      <div className="grid grid-cols-6 grid-rows-6 gap-5">
          {/* UPPER LEFT - FILTER */}
          <div className="col-span-4 row-span-2 bg-white p-4 rounded-xl shadow-lg">
            {/* FILTER */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl ">
                Settings
              </h3>
              <hr className="border-t border-[#9B25A7] my-4" />
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Avatar Name"
                    value={avatarName}
                    onChange={handleAvatarNameChange}
                    className="w-full p-2 sm:p-3 border border-[#9B25A7] rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                  />
                </div>
                {/* Dropdown */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar Style
                  </label>
                  <div className="relative">
                    <button
                      className="w-full p-2 sm:p-3 border border-[#9B25A7] rounded-md text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                      onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    >
                      <span>{style || "Select an Option"}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          filterDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {filterDropdownOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {[
                          "All",
                          "Realistic",
                          "Cartoon",
                          "Anime",
                          "Fantasy",
                          "Surrealism",
                          "Steampunk",
                        ].map((option) => (
                          <div
                            key={option}
                            className="p-2 sm:p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                            onClick={() => handleStyleChange(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* WHOLE RIGHT PANEL - AVATAR PREVIEW*/}
          <div className="col-span-6 row-span-6 col-start-5 bg-white p-4 rounded-xl shadow-lg">
            <div className="md:col-span-5  flex flex-col h-fit">
              <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl">
                Avatar Preview
              </h3>
              <hr className="border-t border-[#9B25A7] my-4" />
              <div className="flex-1 flex items-center justify-center rounded-lg overflow-auto">
                {selectedAvatar ? (
                  <div className="flex flex-row gap-4 bg-white rounded-lg overflow-auto p-4 w-[550px] " >
                    <div className="relative mb-4 flex justify-center w-[500px] h-[700px]  rounded-md p-3">
                      <img
                        src={selectedAvatar.imgSrc}
                        alt={selectedAvatar.name}
                        className="rounded-lg w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between w-full h-[700px]">
                      <div className="space-y-2 mb-4 w-full shrink-0">
                        <div className="space-y-2 mb-4 w-full">
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <div className="flex items-center border rounded-lg p-2 w-full">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="flex-grow outline-none px-2"
                                autoFocus
                              />
                            ) : (
                              <span className="flex-grow">
                                {selectedAvatar.name.charAt(0).toUpperCase() +
                                  selectedAvatar.name.slice(1)}
                              </span>
                            )}
                            {!isEditing && (
                              <Pencil
                                size={20}
                                className="text-gray-500 cursor-pointer"
                                onClick={handleNameEdit}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              ID
                            </label>
                            <div className="bg-gray-100 rounded-lg p-2 w-full">
                              {selectedAvatar.id}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Style
                            </label>
                            <div className="bg-gray-100 rounded-lg p-2 w-full">
                              {(selectedAvatar.style || "N/A").replace(
                                /^\w/,
                                (c) => c.toUpperCase()
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 w-full">
                        {isEditing ? (
                          <>
                            <button
                              className="w-full bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#7A1C86] transition"
                              onClick={handleNameSave}
                            >
                              <Save size={16} /> Save Changes
                            </button>
                            <button
                              className="w-full bg-gray-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="w-full bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] py-2 rounded-lg flex items-center justify-center gap-2 transition"
                              onClick={() => setIsEditing(true)}
                            >
                              <Pencil size={16} /> Edit Avatar
                            </button>
                            <button
                              className="w-full bg-white border border-[#9B25A7] text-[#9B25A7] py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#F4E3F8] transition"
                              onClick={handleDownloadSelectedAvatar}
                            >
                              <Download size={16} /> Download Avatar
                            </button>
                            <button
                              className="w-full bg-[#D31515] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
                              onClick={handleDeleteAvatar}
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-8">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                      <Plus size={32} className="text-gray-300" />
                    </div>
                    <p className="text-base sm:text-lg">No Avatar Selected</p>
                    <p className="text-sm mt-2 max-w-md mx-auto">
                      {myAvatars.length === 0
                        ? style
                          ? `No avatars available in ${style} style. Try selecting a different style or create a new avatar.`
                          : "No avatars exist in your collection. Start by creating your first avatar!"
                        : "Choose an avatar from the list or create a new one"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* BOTTOM LEFT - AVATAR SELECTION */}
          <div className="col-span-4 row-span-4 row-start-3 bg-white p-4 rounded-xl shadow-lg">
            <div className="flex-1 flex flex-col min-h-fit">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl">
                  My Avatars
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="w-full sm:w-auto bg-[#9B25A7] text-white text-sm py-2 px-4 cursor-pointer rounded-md flex items-center gap-1 hover:bg-[#7A1C86] transition-colors"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={16} /> New Avatar
                  </button>
                  <label className="w-full sm:w-auto bg-white border border-[#9B25A7] text-[#9B25A7] text-sm py-2 px-4 rounded-md flex items-center gap-1 cursor-pointer hover:bg-[#F4E3F8] transition-colors">
                    <Upload size={16} /> Import
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      // onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
              <hr className="border-t border-[#9B25A7] my-4" />
              {/* Scrollable grid container with fixed max-height */}
              <div className="max-h-[600px] overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                  </div>
                ) : myAvatars.length > 0 ? (
                  <div className="h-[calc(100vh - 400px)] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {myAvatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`border ${
                          selectedAvatar?.id === avatar.id
                            ? "border-[#9B25A7] bg-[#F4E3F8]"
                            : "border-gray-300"
                        } rounded-lg p-3 cursor-pointer transition-all hover:shadow-md`}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        {/* Existing avatar card content remains the same */}
                        <div className="flex justify-center items-center overflow-hidden rounded-lg mb-2">
                          <div className="w-auto max-w-[80px] md:max-w-[96px] lg:max-w-[112px] aspect-[9/16]">
                            <img
                              src={avatar.imgSrc}
                              alt={avatar.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                console.error("Image load error:", {
                                  id: avatar.id,
                                  style: avatar.style,
                                  imgSrcStart:
                                    avatar.imgSrc?.substring(0, 50) + "...",
                                });
                                e.target.onerror = null;
                                e.target.src = "placeholder-avatar.png";
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm font-medium truncate">
                          {avatar.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                      <Plus size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      No Avatars Available
                    </p>
                    <p className="text-sm text-center max-w-md">
                      {style !== ""
                        ? `No avatars found in ${style} style category. Try selecting a different style or create a new avatar.`
                        : "No avatars exist in your collection. Try generating one or import from your device."}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Create New Avatar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
      {/* OTHER CONTENTS */}
       {/* Modal for New Avatar - Fixed dimensions with internal scrolling */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl flex flex-col lg:flex-row max-h-[90vh] gap-4 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setGenerationStyle("");  // Reset generation style when closing modal
                setGender("");
                setSkin("");
                setReferenceImage(null);
                setGeneratedAvatar(null);
                setDownloadFileName("");
                setGenerationDropdownOpen(false);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="w-full lg:w-1/2 p-4 h-full overflow-y-auto">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 sticky top-0 bg-white">
                Generate New Avatar
              </h3>

              <div className="space-y-6 mt-4">
                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <div className="relative">
                    <button
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                      onClick={() => setGenerationDropdownOpen(!generationDropdownOpen)}
                    >
                      <span>{generationStyle || "Select Style"}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          generationDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {generationDropdownOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {StylesOption.map((option) => (
                          <div
                            key={option}
                            className="p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                            onClick={() => handleGenerationStyleChange(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Male", "Female"].map((option) => (
                      <div
                        key={option}
                        className={`border ${
                          gender === option
                            ? "border-[#9B25A7] bg-[#F4E3F8]"
                            : "border-gray-300"
                        } 
                          rounded-lg p-3 cursor-pointer transition-all hover:border-[#9B25A7] flex items-center justify-center`}
                        onClick={() => setGender(option)}
                      >
                        <span className="font-medium">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skin Tone Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skin Tone
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["white", "brown", "lightbrown", "black"].map((option) => (
                      <div
                        key={option}
                        className={`border ${
                          skin === option
                            ? "border-[#9B25A7]"
                            : "border-gray-300"
                        } 
                          rounded-lg p-2 cursor-pointer transition-all hover:border-[#9B25A7]`}
                        onClick={() => setSkin(option)}
                      >
                        <div
                          className={`w-full h-8 rounded ${
                            option === "white"
                              ? "bg-gray-100"
                              : option === "lightbrown"
                              ? "bg-amber-200"
                              : option === "brown"
                              ? "bg-amber-700"
                              : "bg-stone-900"
                          }`}
                        ></div>
                        <p className="text-center text-xs mt-1 capitalize">
                          {option}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reference Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Reference Image (Optional)
                  </label>
                </div>

                <div className="flex gap-4 items-center justify-center">
                  {/* CHOOSE FILE */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-white bg-[#9B25A7] py-2 px-4 rounded-lg shadow hover:bg-[#7A1C86] transition-all file:bg-none">
                      <Upload className="w-4 h-4" />
                      Choose File
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleReferenceImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Take Photo */}
                  <div>
                    <button
                      onClick={handleOpenCameraModal}
                      className="flex items-center gap-2 text-sm cursor-pointer font-medium text-white bg-[#9B25A7] py-2 px-4 rounded-lg shadow hover:bg-[#7A1C86] transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </button>
                  </div>
                </div>


                {/* Reference Image Preview */}
                {referenceImage && (
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Reference Image Preview
                    </p>
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={
                          referenceImage instanceof File
                            ? URL.createObjectURL(referenceImage)
                            : referenceImage
                        }
                        alt="Reference"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setReferenceImage(null)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-md"
                        aria-label="Remove reference image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Generate Avatar Button */}
                <button
                  className="w-full px-4 py-3 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] disabled:bg-[#E3C5F0] disabled:cursor-not-allowed transition font-medium"
                  onClick={handleGenerateAvatar}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <RefreshCw size={16} className="animate-spin mr-2" />{" "}
                      Generating...
                    </span>
                  ) : (
                    "Generate Avatar"
                  )}
                </button>
              </div>
            </div>

            {/* Right Section - Avatar Preview and Actions */}
            <div className="w-full lg:w-1/2 p-4 h-full overflow-y-auto">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 sticky top-0 bg-white">
                Preview
              </h3>

              <div className="flex flex-col h-full gap-6 mt-4">
                {/* Avatar Preview */}
                <div className="flex items-center justify-center flex-1">
                  <div className="relative w-full max-w-sm bg-gray-100 rounded-lg flex items-center justify-center shadow-md aspect-square overflow-hidden">
                    {generatedAvatar ? (
                      <>
                        <img
                          src={generatedAvatar.imgSrc}
                          alt="Generated Avatar"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setGeneratedAvatar(null)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-md"
                          aria-label="Remove avatar"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 p-8">
                        <div className="w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                          <Plus size={32} className="text-gray-300" />
                        </div>
                        <p>Generated Avatar Preview</p>
                        <p className="text-sm mt-2">
                          Fill in the details and click Generate
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Avatar Section */}
                {generatedAvatar && (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Avatar Name"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#9B25A7] focus:outline-none focus:ring-0 transition"
                        value={downloadFileName}
                        onChange={(e) => setDownloadFileName(e.target.value)}
                      />
                    </div>

                    <button
                      className="w-full px-4 py-3 border-2 border-[#9B25A7] text-[#9B25A7] bg-transparent rounded-lg flex items-center justify-center transition font-medium hover:bg-[#F4E3F8] hover:text-[#9B25A7]"
                      onClick={handleSaveAvatar}
                    >
                      <Plus size={18} className="mr-2" /> Add to My Avatars
                    </button>

                    <button
                      className="w-full px-4 py-3 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] flex items-center justify-center transition font-medium"
                      onClick={handleDownloadAvatar}
                    >
                      <Download size={18} className="mr-2" /> Download Avatar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

  
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {isCameraModalOpen && (
        <CameraModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}
    </div> //END CONTAINER
  );
};

export default AvatarManagement;