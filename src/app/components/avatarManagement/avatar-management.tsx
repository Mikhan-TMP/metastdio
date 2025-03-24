import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Save,
  Download,
  X,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

// Alert component
const Alert = ({ message, type, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
        >
          <div
            className={`relative max-w-sm w-full p-5 rounded-lg shadow-lg flex items-center gap-3 border ${
              type === "success"
                ? "bg-green-100 text-green-800 border-green-300"
                : type === "generating"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {/* Icon */}
            {type === "success" ? (
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : type === "generating" ? (
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}

            {/* Message */}
            <p className="font-semibold text-sm md:text-base">{message}</p>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-2 right-2 text-black-600 hover:text-black-900 transition-all"
            >
              &times;
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const AvatarManagement = () => {
  const preExistingAvatars = []; // Initialize as empty array or with your pre-existing avatars

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
    if (!gender || !skin || !style) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    const avatarPrompt = `Create a detailed avatar with the following characteristics:
      - Gender: ${gender}
      - Skin: ${skin}
      - Style: ${style}
    `;

    const formData = new FormData();
    formData.append("prompt", avatarPrompt);
    if (referenceImage) {
      if (referenceImage instanceof File) {
        formData.append("referenceImage", referenceImage); // Append the file directly
      } else {
        showNotification("Invalid reference image format.", "error");
        return;
      }
    }

    setIsGenerating(true);
    setGeneratedAvatar(null);

    try {
      // Show blue notification for generating
      showNotification("Generating your avatar...", "generating");

      // Make API request with FormData
      const response = await axios.post(
        "http://192.168.1.71:8083/avatar_gen/generate_avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
          responseType: "blob", // Specify blob response type
        }
      );

      // Check if response is successful
      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      // Create a blob URL from the binary data
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);

      // Create a new avatar object
      const newAvatar = {
        id: Date.now(),
        imgSrc: imageUrl,
        name: avatarName || `${gender} ${style} Avatar`,
        blob: blob // Store the blob for later use
      };

      // Update state
      setGeneratedAvatar(newAvatar);

      // Show success notification
      showNotification("Avatar generated successfully!", "success");
    } catch (error) {
      // Detailed error logging and user-friendly message
      console.error("Error generating avatar:", error);

      // Extract server error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";

      // Show error notification
      showNotification(`Failed to generate avatar: ${errorMessage}`, "error");
    } finally {
      // Always set generating to false
      setIsGenerating(false);
    }
  };

  const handleDownloadAvatar = () => {
    if (generatedAvatar) {
      const fileName = downloadFileName || "generated_avatar";
      const link = document.createElement("a");
      link.href = generatedAvatar.imgSrc;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = {
          id: Date.now(),
          imgSrc: e.target.result,
          name: file.name.split(".")[0] || "Uploaded Avatar",
        };
        setMyAvatars((prev) => [...prev, newAvatar]);
        showNotification("Avatar uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReferenceImage(file); // Store the file directly
    }
  };

  const StylesOption = [
    "Realistic",
    "Cartoon",
    "Anime",
    "Fantasy",
    "Surrealism",
    "Steampunk",
  ];

  // Add fetchAvatars function
  const fetchAvatars = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "test@example.com";
      const response = await axios.get(`http://192.168.1.141:3001/avatar/getAvatars`, {
        params: { email }
      });

      console.log("API Response:", response.data); // Debug log

      // Transform the API response to match our avatar structure
      const fetchedAvatars = response.data.map((avatar, index) => {
        // Debug log for each avatar
        console.log(`Processing avatar ${index}:`, {
          style: avatar.style,
          imageDataLength: avatar.imgSrc?.length
        });

        return {
          id: index, // Use index as id since _id might not be present
          imgSrc: `data:image/png;base64,${avatar.imgSrc}`, // Use imgSrc from response
          name: `Avatar ${index + 1}`, // Generate a name if none provided
          style: avatar.style
        };
      });

      console.log("Processed avatars:", fetchedAvatars.map(a => ({
        id: a.id,
        style: a.style,
        imgSrcLength: a.imgSrc?.length
      })));

      setMyAvatars(fetchedAvatars);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      showNotification("Failed to load avatars", "error");
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch avatars on component mount
  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    // Fixed height container that takes the full viewport height
    <div className="flex h-3/5 bg-gray-50 rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 mx-4 border border-[#9B25A7] overflow-hidden">
      <div className="w-full max-w-8xl mx-auto rounded-lg h-full">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          {/* Left Panel - Settings and Avatar Selection */}
          <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-[#9B25A7] p-4 sm:p-6 flex flex-col h-full">
            {/* Settings Section - Fixed height */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar Name
                  </label>
                  <input
  type="text"
  placeholder="Enter Avatar Name"
  value={avatarName}
  onChange={(e) => setAvatarName(e.target.value)}
  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
/>

                </div>
                {/* Dropdown */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar Style
                  </label>
                  <div className="relative">
                    <button
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>{style || "Select an Option"}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {[
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
                            onClick={() => {
                              setStyle(option);
                              setDropdownOpen(false);
                            }}
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
            {/* Avatar Selection - Scrollable area */}
            <div className="flex-1 flex flex-col min-h-fit">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl">
                  My Avatars
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="w-full sm:w-auto bg-[#9B25A7] text-white text-sm py-2 px-4 rounded-md flex items-center gap-1 hover:bg-[#7A1C86] transition-colors"
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
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button className="w-full sm:w-auto bg-[#9B25A7] text-white text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#7A1C86] transition-colors">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
              {/* Scrollable grid container */}
              <div className="overflow-y-auto flex-1 pb-20 max-h-fit">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        {/* Centering and resizing the image */}
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
                                  imgSrcStart: avatar.imgSrc?.substring(0, 50) + '...' // Log start of imgSrc
                                });
                                e.target.onerror = null;
                                e.target.src = "/placeholder-avatar.png";
                              }}
                            />
                          </div>
                        </div>

                        {/* Avatar Name */}
                        <p className="text-center text-sm font-medium truncate">
                          {avatar.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right Panel - Avatar Preview */}
          <div className="md:col-span-5 p-4 sm:p-6 flex flex-col h-fit">
            <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-4 sm:mb-6">
              Avatar Preview
            </h3>
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 rounded-lg overflow-auto">
              {selectedAvatar ? (
                <div className="w-full max-w-xs">
                  <div className="aspect-[9/16] bg-white rounded-lg overflow-hidden shadow-lg mb-4 border border-[#9B25A7]">
                    <img
                      src={selectedAvatar.imgSrc}
                      alt={selectedAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-center font-medium text-gray-800 text-base sm:text-lg">
                      {selectedAvatar.name}
                    </p>
                    <button className="w-full bg-white border border-[#9B25A7] text-[#9B25A7] text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#F4E3F8] transition-colors">
                      <Download size={16} /> Download Avatar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Plus size={32} className="text-gray-300" />
                  </div>
                  <p className="text-base sm:text-lg">No avatar selected</p>
                  <p className="text-sm mt-2">
                    Choose an avatar from the list or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for New Avatar - Fixed dimensions with internal scrolling */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl flex flex-col lg:flex-row max-h-[90vh] gap-4 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
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
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{style || "Select Style"}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {dropdownOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {StylesOption.map((option) => (
              <div
                key={option}
                className="p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                onClick={() => {
                  setStyle(option);
                  setDropdownOpen(false);
                }}
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
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleReferenceImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#9B25A7] file:text-white hover:file:bg-[#7A1C86]"
                  />
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
                        placeholder="Enter file name (optional)"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#9B25A7] transition"
                        value={downloadFileName}
                        onChange={(e) => setDownloadFileName(e.target.value)}
                      />
                    </div>
                    <button
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition font-medium"
                      onClick={handleDownloadAvatar}
                    >
                      <Download size={18} className="mr-2" /> Download Avatar
                    </button>
            
                    <button
  className="w-full px-4 py-3 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] flex items-center justify-center transition font-medium"
  onClick={async () => {
    if (generatedAvatar?.blob) {
      try {
        showNotification("Processing avatar...", "generating");
        
        // Create a proper promise-based wrapper for FileReader
        const readFileAsDataURL = (blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          });
        };
        
        // Get base64 string
        const base64String = await readFileAsDataURL(generatedAvatar.blob);
        
        // Extract the base64 data part (remove the metadata prefix)
        const base64Image = base64String.split(',')[1];
        
        if (!base64Image) {
          throw new Error("Failed to process image data");
        }
        
        // Create the payload with the field name "image" as required by the API
        const payload = {
          email: localStorage.getItem("userEmail") || "test@example.com", 
          image: base64Image, // Changed from imgSrc to image to match API expectation
          style: style.toLowerCase(),
          name: avatarName || `${gender} ${style} Avatar`
        };
        
        console.log("Sending payload with image data length:", base64Image.length);
        
        // Send the payload to the API
        const response = await axios.post("http://192.168.1.141:3001/avatar/generate", payload);
        const data = response.data;
        
        console.log("Avatar saved to the database:", data);
        
        if (data) {
          // Update local state with the saved avatar
          const savedAvatar = {
            id: data._id || Date.now(),
            imgSrc: generatedAvatar.imgSrc, // Use the existing blob URL for immediate display
            name: payload.name,
            style: payload.style
          };
          
          setMyAvatars(prev => [...prev, savedAvatar]);
          setSelectedAvatar(savedAvatar);
          setIsModalOpen(false);
          showNotification("Avatar added to your collection!", "success");
        }
      } catch (error) {
        console.error("Error saving avatar:", error);
        showNotification(`Failed to save avatar: ${error.message}`, "error");
      }
    } else {
      showNotification("No avatar to save!", "error");
    }
  }}
>
  <Plus size={18} className="mr-2" /> Add to My Avatars
</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Alert
        message={notification}
        type={notificationType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default AvatarManagement;
