import React, { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  Music,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Download,
  Folder,
  List,
  Grid,
  Copy,
  Star,
  Scissors,
  ChevronLeft,
  Volume,
  VolumeX,
  RotateCcw,
  Clock,
  Headphones,
  StopCircle,
  Layers,
  Moon,
  Check,
  X,
  Menu,
  Maximize,
  Settings,
  WifiOff,
  Repeat,
  RefreshCw,
} from "lucide-react";
import { Dialog } from "@headlessui/react"; // Example: Using Headless UI for modal
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <p className="font-semibold text-sm md:text-base">{message}</p>
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

const AudioManagerUI = () => {
  // State Variables
  const [activeTab, setActiveTab] = useState("dialogue");
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(20);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [folders, setFolders] = useState([]);
  const [audios, setAudios] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState({
    folders: false,
    audios: false,
  });
  const [error, setError] = useState({
    folders: null,
    audios: null,
  });
  const email = localStorage.getItem("userEmail");
  const audioRef = React.useRef(new Audio());
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [viewMode, setViewMode] = useState("grid"); // State for toggling view mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [audioProperties, setAudioProperties] = useState({
    name: "",
    category: "",
    speaker: "",
    type: "",
    volume: 80,
    fadeIn: 0,
    fadeOut: 0,
    voiceEnhance: false,
    noiseReduction: false,
  });

  useEffect(() => {
    if (selectedAudio) {
      setAudioProperties({
        name: selectedAudio.name,
        category: selectedAudio.category,
        speaker: selectedAudio.speaker,
        type: selectedAudio.type,
        volume: selectedAudio.volume || 80,
        fadeIn: selectedAudio.fadeIn || 0,
        fadeOut: selectedAudio.fadeOut || 0,
        voiceEnhance: selectedAudio.voiceEnhance || false,
        noiseReduction: selectedAudio.noiseReduction || false,
      });
    }
  }, [selectedAudio]);

  const handlePropertyChange = (field, value) => {
    setAudioProperties((prev) => ({ ...prev, [field]: value }));
  };

  const deleteFolder = async (folderId) => {
    if (!email || !folderId) {
      toast.error("Missing required parameters.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this folder?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://192.168.1.141:3001/audio/deleteScript`,
        {
          params: {
            email,
            titleId: folderId,
          },
        }
      );

      if (response.data.status === "success") {
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== folderId)
        );
        setSelectedFolder(null);
        setAudios([]);
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || "Failed to delete folder.");
      }
    } catch (error) {
      console.error("Delete Folder Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete folder."
      );
    }
  };

  const deleteAudio = async (audioId) => {
    if (!email || !selectedFolder?.id || !audioId) {
      toast.error("Missing required parameters.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this audio?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://192.168.1.141:3001/audio/deleteAudio`,
        {
          params: {
            email,
            titleId: selectedFolder.id,
            audioId,
          },
        }
      );

      if (response.data.status === "success") {
        setAudios((prevAudios) =>
          prevAudios.filter((audio) => audio.id !== audioId)
        );
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || "Failed to delete audio.");
      }
    } catch (error) {
      console.error("Delete Audio Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete audio."
      );
    }
  };

  const playAudio = (audio) => {
    console.log("Attempting to play audio:", {
      name: audio.name,
      path: audio.path,
      type: typeof audio.path,
    });

    if (!audio.path) {
      console.error("No valid audio path provided");
      toast.error("Unable to play audio: Invalid file path");
      return;
    }

    audioRef.current.pause();
    audioRef.current.src = "";

    try {
      audioRef.current.src = audio.path;

      audioRef.current.onerror = (e) => {
        console.error("Audio Error Event:", {
          error: e,
          src: audioRef.current.src,
          networkState: audioRef.current.networkState,
          readyState: audioRef.current.readyState,
        });
        toast.error(`Failed to load audio: ${audio.name}. Please check the file path.`);
      };

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            setIsPlaying(true);
            setSelectedAudio(audio);
          })
          .catch((error) => {
            console.error("Playback Error:", {
              name: error.name,
              message: error.message,
              code: error.code,
            });

            if (error.name === "NotSupportedError") {
              toast.error("Audio format not supported. Please check the file type.");
            } else if (error.name === "NotAllowedError") {
              toast.error("Audio playback was prevented. Check browser autoplay settings.");
            } else {
              toast.error(`Unable to play audio: ${error.message}`);
            }

            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error("Audio Playback Setup Error:", {
        name: error.name,
        message: error.message,
      });
      toast.error(`Error setting up audio playback: ${error.message}`);
    }
  };

  const toggleFavorite = (audioId) => {
    setAudios((prevAudios) =>
      prevAudios.map((audio) =>
        audio.id === audioId ? { ...audio, favorite: !audio.favorite } : audio
      )
    );
  };

  const mockFolders = [
    { id: 1, name: "Highway Subway" },
    { id: 2, name: "Title Test" },
    { id: 3, name: "Last Test" },
  ];

  const fetchFolders = async () => {
    setLoading((prev) => ({ ...prev, folders: true }));
    setError((prev) => ({ ...prev, folders: null }));

    try {
      console.log("Fetching folders with email:", email);

      const response = await axios.get(
        `http://192.168.1.141:3001/audio/getAllScript`,
        {
          params: { email },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Raw API Response:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

      if (!response.data) {
        throw new Error("No data received from server");
      }

      console.log("Response Type:", typeof response.data);
      console.log("Response Keys:", Object.keys(response.data));

      if (response.data.status !== "success") {
        throw new Error(
          `Server returned non-success status: ${response.data.status}`
        );
      }

      if (!response.data.titles) {
        throw new Error("No titles found in the response");
      }

      if (!Array.isArray(response.data.titles)) {
        throw new Error(
          `Unexpected titles format: ${typeof response.data.titles}`
        );
      }

      const formattedFolders = response.data.titles.map((titleObj, index) => ({
        id: titleObj.id || `folder-${index}`,
        name: titleObj.title || `Unnamed Folder ${index}`,
      }));

      console.log("Formatted Folders:", formattedFolders);

      setFolders(formattedFolders);
    } catch (error) {
      console.error("COMPREHENSIVE FETCH ERROR:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        requestConfig: error.config,
      });

      let errorMessage = "Failed to load folders";

      if (error.response) {
        errorMessage = `Server Error (${error.response.status}): ${
          error.response.data?.message || "Unexpected server response"
        }`;
      } else if (error.request) {
        errorMessage = "No response from server. Check network connection.";
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }

      setError((prev) => ({
        ...prev,
        folders: errorMessage,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, folders: false }));
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    if (!email) {
      toast.error("User email not found.");
      return;
    }

    try {
      toast.info("Creating folder...");
      const response = await axios.post(
        "http://192.168.1.141:3001/audio/addAudio",
        {
          email,
          title: newFolderName.trim(),
          audio: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const folderId = response.data.id || response.data._id || response.data.titleId;

      if (response.data.status === "success" || folderId) {
        const newFolder = {
          id: folderId || `temp-${Date.now()}`,
          name: newFolderName.trim(),
        };

        setFolders((prevFolders) => [...prevFolders, newFolder]);
        setIsModalOpen(false);
        setNewFolderName("");
        toast.success("Folder created successfully.");
        setTimeout(() => fetchFolders(), 500);
      } else {
        throw new Error(response.data.message || "Failed to create folder.");
      }
    } catch (error) {
      console.error("Create Folder Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create folder. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [email]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    fetchAudios(folder.id);
  };

  const fetchAudios = async (folderId) => {
    setLoading((prev) => ({ ...prev, audios: true }));
    setError((prev) => ({ ...prev, audios: null }));

    try {
      const response = await axios.get(
        `http://192.168.1.141:3001/audio/getScript`,
        {
          params: {
            email,
            titleId: folderId,
          },
        }
      );

      console.log("Full Audios API Response:", response.data);

      if (
        response.data &&
        response.data.status === "success" &&
        Array.isArray(response.data.audios)
      ) {
        const formattedAudios = response.data.audios.map((audio) => {
          return {
            id: audio._id,
            name: audio.name || "Unnamed Audio",
            category: audio.category || "Uncategorized",
            speaker: audio.speaker || "Unknown Speaker",
            type: audio.type ? audio.type.toLowerCase() : "dialogue",
            duration: "0:30",
            path: `http://192.168.1.141:3001${audio.audioSrc}`.replace(
              /([^:]\/)\/+/g,
              "$1"
            ),
            volume: audio.volume,
            fadeIn: audio.fadeIn,
            fadeOut: audio.fadeOut,
            voiceEnhance: audio.voiceEnhance,
            noiseReduction: audio.noiseReduction,
          };
        });

        setAudios(formattedAudios);
      } else {
        throw new Error("Invalid audios response format");
      }
    } catch (error) {
      console.error("Audios Fetch Error:", error);

      let errorMessage = "Failed to load audios";
      if (error.response) {
        errorMessage = `Server Error (${error.response.status}): ${
          error.response.data?.message || "Unknown error"
        }`;
      } else if (error.request) {
        errorMessage = "No response from server. Check network connection.";
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }

      setError((prev) => ({
        ...prev,
        audios: errorMessage,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, audios: false }));
    }
  };

  const getAudioData = () => {
    return audios;
  };

  const saveAudioProperties = async () => {
    try {
      if (!selectedAudio || !selectedAudio.id) {
        toast.error("Invalid audio selected. Please try again.");
        return;
      }
      if (!selectedFolder || !selectedFolder.id) {
        toast.error("No folder selected.");
        return;
      }
      if (!email) {
        toast.error("User email not found.");
        return;
      }

      const payload = {
        name: audioProperties.name.trim(),
        category: audioProperties.category,
        speaker: audioProperties.speaker,
        type: audioProperties.type,
        volume: audioProperties.volume,
        fadeIn: audioProperties.fadeIn,
        fadeOut: audioProperties.fadeOut,
        voiceEnhance: audioProperties.voiceEnhance,
        noiseReduction: audioProperties.noiseReduction,
      };

      const response = await axios.patch(
        `http://192.168.1.141:3001/audio/updateAudio`,
        payload,
        {
          params: {
            email,
            titleId: selectedFolder.id,
            audioId: String(selectedAudio.id),
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setSelectedAudio({ ...selectedAudio, ...payload });
        setAudios((prevAudios) =>
          prevAudios.map((audio) =>
            audio.id === selectedAudio.id ? { ...audio, ...payload } : audio
          )
        );
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || "Unexpected server response.");
      }
    } catch (error) {
      console.error("Audio Update Error:", error);
      toast.error(
        error.response?.data?.message || "Update failed. Please try again."
      );
    }
  };

  const getCategories = () => {
    const audioData = getAudioData();
    let categories = ["all"];

    audioData.forEach((audio) => {
      if (audio.category && !categories.includes(audio.category)) {
        categories.push(audio.category);
      }
    });

    return categories;
  };

  const filteredAudio =
    currentCategory === "all"
      ? getAudioData()
      : getAudioData().filter((audio) => audio.category === currentCategory);

  const handleSelectAudio = (audio) => {
    if (!audio || !audio.id) {
      console.error("Invalid audio selected:", audio);
      toast.error("Invalid audio selected. Please try again.");
      return;
    }
    setSelectedAudio(audio);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (direction) => {
    const currentIndex = audios.findIndex(
      (audio) => audio.id === selectedAudio?.id
    );
    if (currentIndex !== -1) {
      const newIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < audios.length) {
        playAudio(audios[newIndex]);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 100;
    audioRef.current.volume = volume;
  };

  const handleProgressChange = (e) => {
    const progress = e.target.value;
    audioRef.current.currentTime = (progress / 100) * audioRef.current.duration;
    setCurrentProgress(progress);
  };

  useEffect(() => {
    const updateProgress = () => {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setCurrentProgress(progress || 0);
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audioRef.current.removeEventListener("timeupdate", updateProgress);
      audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ToastContainer />
      {/* Alert Component */}
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />

      {/* Error Display */}
      {(error.folders || error.audios) && (
        <div className="bg-amber-50 p-3 text-amber-800 border-l-4 border-amber-500 mb-2 mx-2 rounded-md shadow-sm">
          {error.folders && <p>Folders Error: {error.folders}</p>}
          {error.audios && <p>Audios Error: {error.audios}</p>}
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex space-x-3">
          <button className="p-2 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] disabled:bg-[#E3C5F0] flex items-center">
            <Save size={16} className="mr-2" />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button className="p-2 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] disabled:bg-[#E3C5F0] flex items-center">
            <span className="text-sm font-medium">Apply to Timeline</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="w-3/4 bg-white flex flex-col border-r border-gray-200 shadow-sm relative overflow-hidden">
          {/* Folder/Audio Header */}
          <div className="bg-white p-3 ">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedFolder ? (
                  <button
                    className="text-[#9B25A7] hover:text-[#7A1C86] transition-colors flex items-center"
                    onClick={() => {
                      setSelectedFolder(null);
                      setAudios([]);
                    }}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Back to Folders
                  </button>
                ) : (
                  "Audio Library"
                )}
              </h2>
              {!selectedFolder && (
                <button
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List size={16} />
                  ) : (
                    <Grid size={16} />
                  )}
                </button>
              )}
            </div>

            {/* Content Display */}
            {loading.folders ? (
              <div className="flex items-center justify-center p-6">
                <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                <span className="ml-2 text-gray-600">Loading folders...</span>
              </div>
            ) : error.folders ? (
              <p className="text-red-500 p-4">{error.folders}</p>
            ) : selectedFolder ? (
              <div className="flex items-center mb-4">
                <Folder size={18} className="text-[#9B25A7] mr-2" />
                <p className="text-gray-600">
                  Viewing audios in:{" "}
                  <span className="font-medium">{selectedFolder.name}</span>
                </p>
              </div>
            ) : (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-3 gap-4"
                    : "grid-cols-1 gap-2"
                }`}
              >
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`flex items-center p-4 rounded-lg border border-gray-200 ${
                      viewMode === "grid" ? "flex-col text-center" : "flex-row"
                    } hover:bg-gray-50 hover:border-[#9B25A7] transition-all duration-200`}
                  >
                    <button
                      className={`flex items-center ${
                        viewMode === "grid" ? "flex-col" : "flex-row"
                      } flex-1`}
                      onClick={() => handleFolderClick(folder)}
                    >
                      <Folder
                        size={viewMode === "grid" ? 48 : 24}
                        className={`${
                          viewMode === "grid"
                            ? "mb-3 text-[#9B25A7]"
                            : "mr-3 text-[#9B25A7]"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {folder.name}
                      </span>
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      onClick={() => deleteFolder(folder.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  className="flex items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-[#9B25A7] hover:bg-[#E3C5F0] transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={18} className="mr-2 text-[#9B25A7]" />
                  <span className="text-sm font-medium text-gray-800">
                    New Folder
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Audio Files Section */}
          <div className="flex-1 overflow-auto relative">
            {loading.audios ? (
              <div className="flex items-center justify-center p-6">
                <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                <span className="ml-2 text-gray-600">
                  Loading audio files...
                </span>
              </div>
            ) : error.audios ? (
              <p className="text-red-500 p-4">{error.audios}</p>
            ) : audios.length > 0 ? (
              <div className="p-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 px-3 font-medium">Name</th>
                      <th className="py-3 px-3 font-medium">Category</th>
                      <th className="py-3 px-3 font-medium">Speaker</th>
                      <th className="py-3 px-3 font-medium">Type</th>
                      <th className="py-3 px-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audios.map((audio, index) => (
                      <tr
                        key={index}
                        className={`border-b text-sm hover:bg-gray-50 transition-colors ${
                          selectedAudio?.id === audio.id ? "bg-[#E3C5F0]" : ""
                        }`}
                      >
                        <td
                          className="py-3 px-3 font-medium text-gray-800 cursor-pointer"
                          onClick={() => playAudio(audio)}
                        >
                          {audio.name}
                        </td>
                        <td
                          className="py-3 px-3 text-gray-600 cursor-pointer"
                          onClick={() => playAudio(audio)}
                        >
                          {audio.category}
                        </td>
                        <td
                          className="py-3 px-3 text-gray-600 cursor-pointer"
                          onClick={() => playAudio(audio)}
                        >
                          {audio.speaker}
                        </td>
                        <td
                          className="py-3 px-3 cursor-pointer"
                          onClick={() => playAudio(audio)}
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              audio.type === "dialogue"
                                ? "bg-green-100 text-green-800"
                                : audio.type === "music"
                                ? "bg-[#E3C5F0] text-[#9B25A7]"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {audio.type === "dialogue"
                              ? "Dialogue"
                              : audio.type === "music"
                              ? "Music"
                              : "SFX"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            onClick={() => deleteAudio(audio.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="p-6 bg-gray-100 rounded-full mb-4">
                  <Folder size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">No audio files to display</p>
                <p className="text-sm text-gray-500">
                  Select a folder to view its audio files
                </p>
              </div>
            )}
          </div>

          {/* Modal for creating a new folder - Rendered inside the parent container */}
          {isModalOpen && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
                <input
                  type="text"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createFolder}
                    className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview & Properties Panel */}
        <div className="w-1/4 bg-white flex flex-col">
          <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold flex-1 ml-2 text-gray-800">
              Audio Manager
            </h2>
            <button
              className="flex items-center p-2 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] transition-colors disabled:bg-[#E3C5F0] disabled:cursor-not-allowed"
              onClick={saveAudioProperties}
              disabled={!selectedAudio}
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
          </div>
          <div className="p-3 border-b border-gray-200 flex items-center">
            <h3 className="text-md font-semibold text-gray-800">
              Preview & Properties
            </h3>
          </div>

          <div className="flex-1 flex flex-col overflow-auto">
            {selectedAudio ? (
              <>
                {/* Audio Preview Section */}
                <div className="p-4 border-b">
                  <h3 className="font-medium text-lg mb-3 text-gray-800">
                    {selectedAudio.name}
                  </h3>
                  <div className="mb-4 flex items-center text-sm text-gray-600">
                    <div className="mr-4 flex items-center">
                      {selectedAudio.type === "dialogue" ? (
                        <Mic size={14} className="mr-1 text-green-500" />
                      ) : selectedAudio.type === "music" ? (
                        <Music size={14} className="mr-1 text-[#9B25A7]" />
                      ) : (
                        <Volume2 size={14} className="mr-1 text-blue-500" />
                      )}
                      <span className="capitalize">
                        {selectedAudio.type === "dialogue"
                          ? "Dialogue"
                          : selectedAudio.type === "music"
                          ? "Music"
                          : "Sound Effect"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-500" />
                      {selectedAudio.duration}
                    </div>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="mb-4 h-20 bg-gray-100 rounded-lg relative flex items-center overflow-hidden shadow-inner">
                    <div className="absolute inset-0 flex items-center">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full w-1 mx-px ${
                            i < (currentProgress / 100) * 60
                              ? selectedAudio.type === "dialogue"
                                ? "bg-green-500"
                                : selectedAudio.type === "music"
                                ? "bg-[#9B25A7]"
                                : "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                          style={{
                            height: `${
                              40 + Math.sin(i / 3) * 30 + Math.random() * 20
                            }%`,
                            opacity: i > 40 ? 0.7 : 1,
                          }}
                        ></div>
                      ))}
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-px bg-gray-800 z-10"
                      style={{ left: `${currentProgress}%` }}
                    ></div>
                  </div>

                  {/* Playback Controls */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {audioRef.current.currentTime
                          ? new Date(audioRef.current.currentTime * 1000)
                              .toISOString()
                              .substr(14, 5)
                          : "00:00"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {audioRef.current.duration
                          ? new Date(audioRef.current.duration * 1000)
                              .toISOString()
                              .substr(14, 5)
                          : "00:00"}
                      </span>
                    </div>
                    <input
                      type="range"
                      className="w-full accent-[#9B25A7]"
                      min="0"
                      max="100"
                      value={currentProgress}
                      onChange={handleProgressChange}
                    />
                    <div className="flex justify-center space-x-4">
                      <button
                        className="p-2 border rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => handleSkip("prev")}
                      >
                        <SkipBack size={16} />
                      </button>
                      <button
                        className="p-3 bg-[#9B25A7] text-white rounded-full hover:bg-[#7A1C86] transition-colors shadow-sm"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button
                        className="p-2 border rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => handleSkip("next")}
                      >
                        <SkipForward size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2 px-2">
                    <button className="p-1.5 text-gray-500">
                      <Volume2 size={14} />
                    </button>
                    <input
                      type="range"
                      className="flex-1 accent-[#9B25A7]"
                      min="0"
                      max="100"
                      defaultValue="80"
                      onChange={handleVolumeChange}
                    />
                    <button className="p-1.5 text-gray-500">
                      <Headphones size={14} />
                    </button>
                  </div>
                </div>

                {/* Audio Properties Section */}
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium mb-4 text-gray-800">
                    Audio Properties
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                        value={audioProperties.name}
                        onChange={(e) =>
                          handlePropertyChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Category
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                        value={audioProperties.category}
                        onChange={(e) =>
                          handlePropertyChange("category", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Speaker
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                        value={audioProperties.speaker}
                        onChange={(e) =>
                          handlePropertyChange("speaker", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Type
                      </label>
                      <select
                        className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                        value={audioProperties.type}
                        onChange={(e) =>
                          handlePropertyChange("type", e.target.value)
                        }
                      >
                        <option value="dialogue">Dialogue</option>
                        <option value="music">Music</option>
                        <option value="sound">Sound Effect</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                          Volume
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            className="w-full accent-[#9B25A7]"
                            min="0"
                            max="100"
                            value={audioProperties.volume}
                            onChange={(e) =>
                              handlePropertyChange(
                                "volume",
                                Number(e.target.value)
                              )
                            }
                          />
                          <span className="ml-2 text-xs font-medium w-8 text-right">
                            {audioProperties.volume}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                          Fade In (s)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                          value={audioProperties.fadeIn}
                          onChange={(e) =>
                            handlePropertyChange(
                              "fadeIn",
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          max="10"
                          step="0.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                          Fade Out (s)
                        </label>
                        <input
                          type="number"
                          className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                          value={audioProperties.fadeOut}
                          onChange={(e) =>
                            handlePropertyChange(
                              "fadeOut",
                              Number(e.target.value)
                            )
                          }
                          min="0"
                          max="10"
                          step="0.5"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mt-6">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              id="voiceEnhance"
                              className="h-4 w-4 text-[#9B25A7] rounded border-gray-300 focus:ring-[#9B25A7]"
                              checked={audioProperties.voiceEnhance}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "voiceEnhance",
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                          <label
                            htmlFor="voiceEnhance"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Voice Enhance
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="noiseReduction"
                        className="h-4 w-4 text-[#9B25A7] rounded border-gray-300 focus:ring-[#9B25A7]"
                        checked={audioProperties.noiseReduction}
                        onChange={(e) =>
                          handlePropertyChange(
                            "noiseReduction",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor="noiseReduction"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Noise Reduction
                      </label>
                    </div>
                  </div>
                </div>

                {/* Audio Adjustments Section */}
                <div className="p-4 border-b">
                  <h3 className="font-medium mb-4 text-gray-800">
                    Audio Adjustments
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Volume
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          className="w-full accent-[#9B25A7]"
                          min="0"
                          max="100"
                          defaultValue="80"
                        />
                        <span className="ml-2 text-xs font-medium w-8 text-right">
                          80%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                          Fade In
                        </label>
                        <select className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all">
                          <option>None</option>
                          <option>0.5s</option>
                          <option>1s</option>
                          <option>2s</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">
                          Fade Out
                        </label>
                        <select className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all">
                          <option>None</option>
                          <option>0.5s</option>
                          <option>1s</option>
                          <option>2s</option>
                        </select>
                      </div>
                    </div>

                    {selectedAudio.type === "music" && (
                      <>
                        <div className="flex items-center h-5 mt-2">
                          <input
                            type="checkbox"
                            id="loopAudio"
                            className="h-4 w-4 text-[#9B25A7] rounded border-gray-300 focus:ring-[#9B25A7]"
                          />
                          <label
                            htmlFor="loopAudio"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Loop Audio
                          </label>
                        </div>

                        <div className="mt-3">
                          <label className="block text-xs text-gray-500 mb-1 font-medium">
                            EQ Preset
                          </label>
                          <select className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all">
                            <option>Default</option>
                            <option>Background Music</option>
                            <option>Voice Boost</option>
                            <option>Bass Boost</option>
                            <option>Treble Boost</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedAudio.type === "dialogue" && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1 font-medium">
                            Noise Reduction
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              className="w-full accent-[#9B25A7]"
                              min="0"
                              max="100"
                              defaultValue="30"
                            />
                            <span className="ml-2 text-xs font-medium w-8 text-right">
                              30%
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1 font-medium">
                            Voice Enhancement
                          </label>
                          <select className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all">
                            <option>None</option>
                            <option>Clarity</option>
                            <option>Warmth</option>
                            <option>Brightness</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Timing
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white p-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-[#9B25A7] outline-none transition-all"
                        placeholder="Start: 00:00:00.000"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
                <div className="mb-4 p-5 rounded-full bg-gray-100">
                  <Volume2 size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2 font-medium">
                  No audio selected
                </p>
                <p className="text-sm text-gray-500 max-w-xs">
                  Select an audio file from the library to view and edit its
                  properties
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="p-4 border-t bg-gray-50">
            <button
              className="w-full bg-[#9B25A7] text-white p-3 rounded-md font-medium hover:bg-[#7A1C86] transition-colors mb-3 disabled:bg-[#E3C5F0] flex items-center justify-center"
              disabled={!selectedAudio}
            >
              <span>Apply to Timeline</span>
            </button>
            <button
              className="w-full bg-gray-200 text-gray-800 p-3 rounded-md font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!selectedAudio}
            >
              <Play size={16} className="mr-2" />
              <span>Preview in Scene</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AudioManagerUI;
