import React, { useState } from "react";
import { Plus, Upload, Save, Download, X, RefreshCw } from "lucide-react";
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

const preExistingAvatars = [
  {
    id: 1,
    name: "Avatar A",
    imgSrc:
      "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/8c9d0b8e-4ed4-4fee-9f77-e54b9d9a6f66/a440c3e4-0ea3-421e-a45b-bddaa582b40d.png",
  },
  {
    id: 2,
    name: "Avatar B",
    imgSrc:
      "https://neuroflash.com/wp-content/uploads/2022/12/feature-image-ai-avatar-maker.png",
  },
  {
    id: 3,
    name: "Avatar C",
    imgSrc:
      "https://www.aidemos.info/wp-content/uploads/2023/05/avatar_for_social_app_realistic_female_98944746-c433-464d-8e6c-e44ee6b6c03e.webp",
  },
  {
    id: 4,
    name: "Avatar D",
    imgSrc:
      "https://www.d-id.com/wp-content/uploads/2023/12/D-ID-portrait_character.png",
  },
  {
    id: 5,
    name: "Avatar Di ka iiwan",
    imgSrc:
      "https://i.pinimg.com/236x/e5/b5/0a/e5b50a3abb477a225732b4d21dcc2837.jpg",
  },
  {
    id: 6,
    name: "Golden Retriever Boy",
    imgSrc:
      "https://external-preview.redd.it/golden-retriever-bot-gusto-sa-doberman-top-v0-ZHR0Y3ZtZDVnNGhlMfIuxSYZQ1j2a4JnKafgiW1z3751TX5h-wY9yu3gVJq0.png?format=pjpg&auto=webp&s=5a2ab0321a13a8d3e8c727613211dc7a537249e1",
  },
];

const AvatarManagement = () => {
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

  const addAvatarToList = (avatar) => {
    if (!myAvatars.some((a) => a.id === avatar.id)) {
      setMyAvatars([...myAvatars, avatar]);
    }
  };

  const showNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
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

    // Debugging: Log FormData content
    console.log("FormData content:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
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
        name: `${gender} ${style} Avatar`,
      };

      // Update state
      setGeneratedAvatar(newAvatar);
      setMyAvatars((prev) => [...prev, newAvatar]);

      // Show success notification
      showNotification("Avatar generated successfully!", "success");
    } catch (error) {
      // Detailed error logging and user-friendly message
      console.error("Error generating avatar:", error);

      // Extract server error message if available
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error occurred";

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

  // Function to convert blob to base64 for download (optional alternative method)
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const CustomDropdown = () => {
    const [selected, setSelected] = useState("Select an option");
    const [isOpen, setIsOpen] = useState(false);
    const options = ["Realistic", "Cartoon", "Natural", "Robotic"];

    return (
      <div className="relative w-full">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 text-black bg-white border-2 border-[#9B25A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B25A7] flex justify-between items-center"
        >
          {selected}
          <svg
            className={`w-4 h-4 text-[#9B25A7] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown List */}
        {isOpen && (
          <ul className="absolute w-full mt-1 bg-white border-2 border-[#9B25A7] rounded-lg shadow-lg z-10">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="p-3 hover:bg-[#9B25A7] hover:text-white cursor-pointer transition-all"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Top Navigation */}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="bg-white p-4 shadow-md rounded-lg border-gray-100 transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-black">Settings</h3>

          {/* Avatar Name Input */}
          <input
            placeholder="Enter avatar name"
            className="p-2 w-full mb-4 text-black bg-white border-[3px] border-transparent focus:outline-none focus:ring-0 rounded-full"
            style={{
              background:
                "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
              border: "2px solid transparent",
              borderRadius: "5px",
            }}
          />

          {/* Custom Dropdown */}
          <CustomDropdown />
        </div>

        {/* Avatar Preview */}
        <div className="bg-white p-8 shadow-md rounded-xl flex flex-col justify-center items-center border border-gray-100 transition-all hover:shadow-xl">
          {selectedAvatar ? (
            <>
              <div className="relative w-64 h-64 mb-6 rounded-xl overflow-hidden group">
                <img
                  src={selectedAvatar.imgSrc}
                  alt={selectedAvatar.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-xl">
                    {selectedAvatar.name}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-600 text-lg flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-center">
                No avatar selected. <br /> Choose one to preview.
              </p>
            </div>
          )}
        </div>

        {/* My Avatars */}
        <div className="bg-white p-4 shadow-md rounded-lg border-gray-100 transition-all hover:shadow-xl">
  <h3 className="text-lg font-semibold mb-4 text-black">My Avatars</h3>

  {/* Scrollable Container */}
  <div className="h-64 overflow-y-auto p-2 rounded-lg border border-gray-200">
    {myAvatars.map((avatar) => (
      <div
        key={avatar.id}
        className={`flex items-center p-3 mb-2 rounded-md cursor-pointer transition-all 
          ${
            selectedAvatar?.id === avatar.id
              ? "bg-[#9B25A7]/10 border-b-2" // Active state with 10% opacity of #9B25A7 and bottom border
              : "hover:bg-gray-50" // Hover state
          }`}
        style={{
          borderBottomColor: selectedAvatar?.id === avatar.id ? "#9B25A7" : "transparent", // Use #9B25A7 for active state bottom border
        }}
        onClick={() => setSelectedAvatar(avatar)}
      >
        <img
          src={avatar.imgSrc}
          alt={avatar.name}
          className="w-12 h-12 object-cover rounded-lg mr-3 border-2 border-gray-200"
        />
        <span className="text-black flex-1">{avatar.name}</span>
      </div>
    ))}
  </div>
</div>
      </div>

      {/* Pre-existing Avatars Grid */}
      <div className="bg-white p-4 shadow-md rounded mt-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-[transparent] p-4">
            {" "}
            <h3 className="text-lg font-semibold my-2 text-black">
              Select an Avatar
            </h3>
          </div>

          <div className="w-full md:w-2/3 lg:w-1/2 bg-[transparent] p-4">
            <div className="flex flex-col md:flex-row md:justify-end gap-4">
              {/* New Avatar Button */}
              {/* New Avatar Button */}
              <button
                className="relative rounded-md flex items-center justify-center gap-2 w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60 transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
                style={{
                  color: "#9B25A7", // Custom text color
                  background:
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
                  border: "2px solid transparent",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "#9B25A7"; // Revert text color
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Change text color on active
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Keep text color on hover after active
                }}
              >
                <Plus size={16} /> New Avatar
              </button>

              {/* Import Button */}
              <label
                className="relative rounded-md flex items-center justify-center gap-2 cursor-pointer w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60 transition-all duration-300"
                style={{
                  color: "#9B25A7", // Custom text color
                  background:
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
                  border: "2px solid transparent",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "#9B25A7"; // Revert text color
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Change text color on active
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "white"; // Keep text color on hover after active
                }}
              >
                <Upload size={16} /> Import
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Save Changes Button */}
              <button
                className="relative rounded-md flex items-center justify-center gap-2 w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60 transition-all duration-300"
                style={{
                  color: "white", // White text by default
                  background: "linear-gradient(to right, #9B25A7, purple)", // Gradient background by default
                  border: "2px solid transparent", // Transparent border by default
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "#9B25A7"; // Change text color to purple on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9B25A7, purple)";
                  e.currentTarget.style.color = "white"; // Revert text color to white
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "#9B25A7"; // Change text color to purple on active
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box";
                  e.currentTarget.style.color = "#9B25A7"; // Keep text color on hover after active
                }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
        <hr className="w-full border-t-1 border-gray-300/50 mb-4" />

        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {preExistingAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className="border p-2 rounded-md cursor-pointer hover:shadow-md hover:bg-gray-100 transition"
              onClick={() => addAvatarToList(avatar)}
            >
              <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
                <img
                  src={avatar.imgSrc}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-900 text-xs font-medium text-center mt-1">
                {avatar.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for New Avatar */}
  {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 overflow-y-auto">
    <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 overflow-y-auto max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>

      {/* Left Section - Avatar Generation Inputs */}
      <div className="w-full lg:w-1/2 p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Generate New Avatar</h3>

        {/* Dropdown Selection Fields */}
        {[
          { label: "Style", value: style, setValue: setStyle, options: ["Realistic", "Cartoon", "Anime", "Fantasy", "Surrealism", "Steampunk"] },
          { label: "Gender", value: gender, setValue: setGender, options: ["Male", "Female"] },
          { label: "Skin Tone", value: skin, setValue: setSkin, options: ["white", "brown", "lightbrown", "black"] }
        ].map(({ label, value, setValue, options }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#9B25A7] transition"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Select {label}</option>
              {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        ))}

        {/* Reference Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Reference Image (Optional)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleReferenceImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#9B25A7] file:text-white hover:file:bg-opacity-80"
          />
        </div>

        {/* Reference Image Preview */}
        {referenceImage && (
          <div className="w-full flex justify-center">
            <img
              src={referenceImage instanceof File ? URL.createObjectURL(referenceImage) : referenceImage}
              alt="Reference"
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>
        )}

        {/* Generate Avatar Button */}
        <button
          className="w-full px-4 py-2 bg-[#9B25A7] text-white rounded-lg hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed transition"
          onClick={handleGenerateAvatar}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Avatar"}
        </button>
      </div>

      {/* Right Section - Avatar Preview and Actions */}
      <div className="w-full lg:w-1/2 p-4 space-y-6 flex flex-col items-center">
        {/* Avatar Preview */}
        <div className="relative w-full max-w-xs bg-gray-100 rounded-lg flex items-center justify-center shadow-md aspect-auto">
          {generatedAvatar ? (
            <>
              <img
                src={generatedAvatar.imgSrc}
                alt="Generated Avatar"
                className="max-w-full max-h-full rounded-lg object-cover"
              />
              <button
                onClick={() => setGeneratedAvatar(null)}
                className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                aria-label="Remove avatar"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <p className="text-gray-400">Generated Avatar Preview</p>
          )}
        </div>

        {/* Download Avatar Section */}
        {generatedAvatar && (
          <div className="w-full flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Enter file name (optional)"
              className="w-full p-2 border rounded-lg text-center focus:ring-2 focus:ring-[#9B25A7] transition"
              value={downloadFileName}
              onChange={(e) => setDownloadFileName(e.target.value)}
            />
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center transition"
              onClick={handleDownloadAvatar}
            >
              <Download size={16} className="mr-2" /> Download Avatar
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)
}


      <Alert
        message={notification}
        type={notificationType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default AvatarManagement;
