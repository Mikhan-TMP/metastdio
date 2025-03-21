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
      - skin: ${skin}
      - Style: ${style}
    `;

    setIsGenerating(true);
    setGeneratedAvatar(null);

    try {
      // Show blue notification for generating
      showNotification("Generating your avatar...", "generating");

      // Make API request with responseType blob to receive binary data
      const response = await axios.post(
        "http://192.168.1.71:8083/avatar_gen/generate_avatar",
        { prompt: avatarPrompt },
        { responseType: "blob" } // This is the key change - specify blob response type
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

      // Determine error message
      const errorMessage = error.response
        ? "Server error occurred"
        : error.message || "Unknown error occurred";

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

  // Function to convert blob to base64 for download (optional alternative method)
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Top Navigation */}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2 text-black">Settings</h3>
          <input
            placeholder="Enter avatar name"
            className="p-2 w-full mb-2 text-black bg-white border-[3px] border-transparent focus:outline-none focus:ring-0 rounded-full"
            style={{
              background:
                "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
              border: "2px solid transparent",
              borderRadius: "5px",
            }}
          />

          <select
            className="border p-2 w-full mb-2 rounded text-black"
            style={{
              background:
                "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
              border: "2px solid transparent",
              borderRadius: "5px",
            }}
          >
            <option>Realistic</option>
            <option>Cartoon</option>
            <option>Natural</option>
            <option>Robotic</option>
          </select>
        </div>

        {/* Avatar Preview */}
        <div className="bg-white p-4 shadow rounded flex flex-col justify-center items-center">
          {selectedAvatar ? (
            <>
              <img
                src={selectedAvatar.imgSrc}
                alt={selectedAvatar.name}
                className="w-40 h-40 rounded-full mb-2"
              />
              <p className="text-black font-medium">{selectedAvatar.name}</p>
            </>
          ) : (
            <div className="text-black">Select an avatar to preview</div>
          )}
        </div>

        {/* My Avatars */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2 text-black">My Avatars</h3>

          {/* Scrollable Container */}
          <div className="max-h-64 overflow-y-auto border-none rounded p-2">
            {myAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className="p-2 border-none rounded mb-2 text-black flex items-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedAvatar(avatar)}
              >
                <img
                  src={avatar.imgSrc}
                  alt={avatar.name}
                  className="w-10 h-14 object-cover rounded-lg mr-3"
                />
                {avatar.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-existing Avatars Grid */}
      <div className="bg-white p-4 shadow rounded mt-4">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-1/2 bg-[transparent] p-4">
            {" "}
            <h3 className="text-lg font-semibold my-2 text-black">
              Select an Avatar
            </h3>
          </div>

          <div className="w-full md:w-2/3 lg:w-1/2 bg-[transparent] p-4">
            <div className="flex flex-col md:flex-row md:justify-end gap-4">
              {/* New Avatar Button */}
              <button
  className="relative rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 
             w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60"
  onClick={() => setIsModalOpen(true)}
  style={{
    color: "#9B25A7", // Custom text color
    background: "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
    border: "2px solid transparent",
    borderRadius: "8px"
  }}
>
  <Plus size={16} /> New Avatar
</button>

{/* Import Button */}
<label
  className="relative rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer
             w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60"
  style={{
    color: "#9B25A7", // Custom text color
    background: "linear-gradient(white, white) padding-box, linear-gradient(to right, #9B25A7, purple) border-box",
    border: "2px solid transparent",
    borderRadius: "8px"
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
  className="text-white rounded-md flex items-center justify-center gap-2 hover:opacity-80 w-full md:w-48 h-12 px-5 py-3 md:text-sm md:w-60"
  style={{
    background: "linear-gradient(to right, #9B25A7, purple)"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl lg:max-w-4xl flex flex-col lg:flex-row">
            {/* Close Button in Top-Right */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <X size={20} />
            </button>

            {/* Left Section - Avatar Generation Inputs */}
            <div className="w-full lg:w-1/2 p-4">
              <h3 className="text-lg font-semibold mb-4 text-black-700">
                Generate New Avatar
              </h3>
              <div className="space-y-4">
                <select
                  className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 transition"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="">Select Style</option>
                  <option value="Realistic">Realistic</option>
                  <option value="Cartoon">Cartoon</option>
                  <option value="Anime">Anime</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Surrealism">Surrealism</option>
                  <option value="Steampunk">Steampunk</option>
                </select>

                <select
                  className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 transition"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <select
                  className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 transition"
                  value={skin}
                  onChange={(e) => setSkin(e.target.value)}
                >
                  <option value="">Skin</option>
                  <option value="white">White</option>
                  <option value="brown">Brown</option>
                  <option value="lightbrown">Light Brown</option>
                  <option value="black">Black</option>
                </select>

                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                  onClick={handleGenerateAvatar}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Avatar"}
                </button>
              </div>
            </div>

            {/* Right Section - Avatar Preview */}
            <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-xs lg:max-w-sm bg-gray-100 rounded-lg flex items-center justify-center shadow-md aspect-square">
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
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <p className="text-black-400">Generated Avatar Preview</p>
                )}
              </div>

              {generatedAvatar && (
                <div className="mt-4 w-full flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Enter file name (optional)"
                    className="border p-2 rounded w-full max-w-xs text-center"
                    value={downloadFileName}
                    onChange={(e) => setDownloadFileName(e.target.value)}
                  />
                  <button
                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center transition"
                    onClick={handleDownloadAvatar}
                  >
                    <Download size={16} className="mr-2" /> Download Avatar
                  </button>
                </div>
              )}
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
