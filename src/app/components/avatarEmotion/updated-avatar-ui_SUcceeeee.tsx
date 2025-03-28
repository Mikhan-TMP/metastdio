import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Play,
  Pause,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sliders,
  Heart,
  Search,
  Filter,
  Copy,
  Trash2,
  Music,
  Camera,
  Clipboard,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";

const fetchAvatars = async (selectedStyle = "", searchName = "") => {
  try {
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

    const fetchedAvatars = response.data.map((avatar, index) => ({
      id: avatar.id || index,
      imgSrc: `data:image/png;base64,${avatar.imgSrc}`,
      name: avatar.name || `Avatar ${index + 1}`,
      style: avatar.style,
    }));

    return fetchedAvatars;
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return [];
  }
};

const AvatarGestureEmotionUI = () => {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null); // Added state for selectedAvatar
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("gestures");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const email = localStorage.getItem("userEmail");

  // Mock data
  const gestures = [
    {
      id: 1,
      name: "Wave",
      thumbnail: "👋",
      category: "Greeting",
      duration: 2.5,
    },
    {
      id: 2,
      name: "Point",
      thumbnail: "👉",
      category: "Direction",
      duration: 1.8,
    },
    {
      id: 3,
      name: "Clap",
      thumbnail: "👏",
      category: "Reaction",
      duration: 2.0,
    },
    {
      id: 4,
      name: "Thumbs Up",
      thumbnail: "👍",
      category: "Reaction",
      duration: 1.5,
    },
    {
      id: 5,
      name: "Handshake",
      thumbnail: "🤝",
      category: "Greeting",
      duration: 3.0,
    },
    {
      id: 6,
      name: "Thinking",
      thumbnail: "🤔",
      category: "Contemplative",
      duration: 2.2,
    },
    {
      id: 7,
      name: "Explain",
      thumbnail: "🙌",
      category: "Presentation",
      duration: 2.8,
    },
    {
      id: 8,
      name: "Arms Crossed",
      thumbnail: "🧍",
      category: "Stance",
      duration: 1.5,
    },
    {
      id: 9,
      name: "Check Watch",
      thumbnail: "⌚",
      category: "Action",
      duration: 1.7,
    },
    {
      id: 10,
      name: "Nodding",
      thumbnail: "🙂",
      category: "Reaction",
      duration: 1.2,
    },
    {
      id: 11,
      name: "Shrug",
      thumbnail: "🤷",
      category: "Reaction",
      duration: 1.5,
    },
    {
      id: 12,
      name: "Head Tilt",
      thumbnail: "😌",
      category: "Contemplative",
      duration: 1.3,
    },
  ];

  const emotions = [
    {
      id: 1,
      name: "Happy",
      intensity: 80,
      icon: <Smile size={20} />,
      category: "Positive",
    },
    {
      id: 2,
      name: "Sad",
      intensity: 60,
      icon: <Frown size={20} />,
      category: "Negative",
    },
    {
      id: 3,
      name: "Surprised",
      intensity: 70,
      icon: "😮",
      category: "Reaction",
    },
    { id: 4, name: "Angry", intensity: 90, icon: "😠", category: "Negative" },
    {
      id: 5,
      name: "Neutral",
      intensity: 50,
      icon: <Meh size={20} />,
      category: "Neutral",
    },
    { id: 6, name: "Excited", intensity: 85, icon: "😃", category: "Positive" },
    {
      id: 7,
      name: "Confused",
      intensity: 65,
      icon: "😕",
      category: "Reaction",
    },
    {
      id: 8,
      name: "Concerned",
      intensity: 75,
      icon: "😟",
      category: "Negative",
    },
    {
      id: 9,
      name: "Confident",
      intensity: 90,
      icon: "😎",
      category: "Positive",
    },
    {
      id: 10,
      name: "Thoughtful",
      intensity: 60,
      icon: "🤔",
      category: "Neutral",
    },
  ];

  const emotionCategories = [
    "all",
    "Positive",
    "Negative",
    "Neutral",
    "Reaction",
  ];
  const gestureCategories = [
    "all",
    "Greeting",
    "Reaction",
    "Direction",
    "Contemplative",
    "Presentation",
    "Stance",
    "Action",
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGestureSelect = (gesture) => {
    setSelectedGesture(gesture);
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const generateEmotion = async () => {
    if (!selectedAvatar) {
      console.error("No avatar selected");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.71:8083/emotions_gen", {
        image: selectedAvatar.imgSrc, // Send the active avatar's image
        views: ["front", "side", "close-up", "full-body"], // Request all views
      });

      console.log("Emotion generation response:", response.data);
      alert("Emotion generation request sent successfully!");
    } catch (error) {
      console.error("Error generating emotion:", error);
      alert("Failed to generate emotion. Please try again.");
    }
  };

  const filteredGestures =
    currentCategory === "all"
      ? gestures
      : gestures.filter((g) => g.category === currentCategory);

  const filteredEmotions =
    currentCategory === "all"
      ? emotions
      : emotions.filter((e) => e.category === currentCategory);

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        setIsLoading(true);
        const fetchedAvatars = await fetchAvatars(selectedStyle, searchName);
        setAvatars(fetchedAvatars);
      } catch (error) {
        console.error("Error loading avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatars();
  }, [selectedStyle, searchName]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Toolbar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <button className="p-2 border rounded hover:bg-gray-50 mr-2">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold">
            Avatar Gesture & Emotion Editor
          </h1>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 border rounded hover:bg-gray-50">
            <Save size={16} />
          </button>
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Apply to Timeline
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="md:col-span-7 md:border-b-0 md:border-r border-gray-200 p-4 sm:p-6 flex flex-col h-full">
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
                      placeholder="Search Avatar Name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar Style
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="Realistic">Realistic</option>
                      <option value="Cartoon">Cartoon</option>
                      <option value="Anime">Anime</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Surrealism">Surrealism</option>
                      <option value="Steampunk">Steampunk</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col min-h-fit">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl">
                    My Avatars
                  </h3>
                  <button
                    className="w-full sm:w-auto bg-[#9B25A7] text-white text-sm py-2 px-4 rounded-md flex items-center gap-1 hover:bg-[#7A1C86] transition-colors"
                    onClick={generateEmotion}
                  >
                    <Plus size={16} /> Generate Emotion
                  </button>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                    </div>
                  ) : avatars.length > 0 ? (
                    <div className="h-[calc(100vh - 400px)] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {avatars.map((avatar) => (
                        <div
                          key={avatar.id}
                          className={`border ${
                            selectedAvatar?.id === avatar.id
                              ? "border-[#9B25A7] bg-[#F4E3F8]"
                              : "border-gray-300"
                          } rounded-lg p-3 cursor-pointer transition-all hover:shadow-md`}
                          onClick={() => setSelectedAvatar(avatar)}
                        >
                          <div className="flex justify-center items-center overflow-hidden rounded-lg mb-2">
                            <div className="w-auto max-w-[80px] md:max-w-[96px] lg:max-w-[112px] aspect-[9/16]">
                              <img
                                src={avatar.imgSrc}
                                alt={avatar.name}
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => {
                                  console.error("Image load error:", {
                                    id: avatar.id,
                                    style: avatar.style,
                                    imgSrcStart:
                                      avatar.imgSrc?.substring(0, 50) + "...",
                                  });
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-avatar.png";
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
                        {selectedStyle !== ""
                          ? `No avatars found in ${selectedStyle} style category. Try selecting a different style or create a new avatar.`
                          : "No avatars exist in your collection. Try generating one or import from your device."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-4">
        {/* Left Panel - Library */}
        <div className="w-72 bg-white shadow rounded mr-4 flex flex-col">
          {/* Library Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${
                activeTab === "gestures"
                  ? "bg-gray-100 text-blue-500 font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("gestures")}
            >
              Gestures
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "emotions"
                  ? "bg-gray-100 text-blue-500 font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("emotions")}
            >
              Emotions
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "sequences"
                  ? "bg-gray-100 text-blue-500 font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("sequences")}
            >
              Sequences
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-2 border-b">
            <div className="flex mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white p-1.5 pl-8 rounded-l border"
                />
                <Search
                  size={16}
                  className="absolute left-2.5 top-2.5 text-gray-400"
                />
              </div>
              <button className="bg-gray-200 px-2 rounded-r border">
                <Filter size={16} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {(activeTab === "gestures"
                ? gestureCategories
                : emotionCategories
              ).map((category) => (
                <button
                  key={category}
                  className={`px-2 py-0.5 text-xs rounded ${
                    currentCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentCategory(category)}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Library Content */}
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === "gestures" && (
              <div className="grid grid-cols-2 gap-2">
                {filteredGestures.map((gesture) => (
                  <div
                    key={gesture.id}
                    className={`p-2 rounded cursor-pointer transition-colors border ${
                      selectedGesture?.id === gesture.id
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => handleGestureSelect(gesture)}
                  >
                    <div className="text-2xl text-center mb-1">
                      {gesture.thumbnail}
                    </div>
                    <div className="text-xs text-center truncate">
                      {gesture.name}
                    </div>
                    <div
                      className={`text-xs text-center flex items-center justify-center ${
                        selectedGesture?.id === gesture.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      <Clock size={10} className="mr-0.5" /> {gesture.duration}s
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "emotions" && (
              <div className="grid grid-cols-2 gap-2">
                {filteredEmotions.map((emotion) => (
                  <div
                    key={emotion.id}
                    className={`p-2 rounded cursor-pointer transition-colors border ${
                      selectedEmotion?.id === emotion.id
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => handleEmotionSelect(emotion)}
                  >
                    <div className="text-2xl text-center mb-1">
                      {typeof emotion.icon === "string"
                        ? emotion.icon
                        : emotion.icon}
                    </div>
                    <div className="text-xs text-center truncate">
                      {emotion.name}
                    </div>
                    <div
                      className={`text-xs text-center ${
                        selectedEmotion?.id === emotion.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      Intensity: {emotion.intensity}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "sequences" && (
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Greeting Sequence</span>
                    <div className="text-xs text-gray-500">4.5s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>👋</span>
                      <span>→</span>
                      <span>😃</span>
                      <span>→</span>
                      <span>🤝</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Presentation Start</span>
                    <div className="text-xs text-gray-500">6.2s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>🙌</span>
                      <span>→</span>
                      <span>😎</span>
                      <span>→</span>
                      <span>👉</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Active Listening</span>
                    <div className="text-xs text-gray-500">3.8s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>🙂</span>
                      <span>→</span>
                      <span>🤔</span>
                      <span>→</span>
                      <span>😌</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create New */}
          <div className="p-2 border-t">
            <button className="w-full flex items-center justify-center p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
              <Plus size={16} className="mr-1" />
              {activeTab === "gestures"
                ? "New Gesture"
                : activeTab === "emotions"
                ? "New Emotion"
                : "New Sequence"}
            </button>
          </div>
        </div>

        {/* Center - Preview and Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Avatar Selection */}
          <div className="p-3 bg-white shadow rounded mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium mr-3">Avatar:</span>
              <select className="bg-white border rounded p-1.5">
                {avatars.map((avatar) => (
                  <option key={avatar.id} value={avatar.id}>
                    {avatar.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => setIsModalOpen(true)}
              >
                Avatar Preview
              </button>
              <button className="p-1.5 border rounded hover:bg-gray-50 flex items-center">
                <Camera size={16} className="mr-1" /> Capture
              </button>
              <button className="p-1.5 border rounded hover:bg-gray-50 flex items-center">
                <RefreshCw size={16} className="mr-1" /> Reset
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 flex">
              {/* 3D Avatar Preview */}
              <div className="w-2/3 bg-white shadow rounded-l flex items-center justify-center mr-4">
                <div className="relative">
                  {/* Avatar placeholder */}
                  <div className="w-48 h-72 bg-gray-100 rounded-lg relative flex items-center justify-center">
                    <div className="text-6xl mb-10">
                      <img
                        src="https://neuroflash.com/wp-content/uploads/2022/12/feature-image-ai-avatar-maker.png"
                        alt="Jini"
                        className="w-100 h-100 mx-auto mb-2"
                      />
                    </div>

                    {/* Gesture/Emotion indicators */}
                    {selectedGesture && (
                      <div className="absolute left-0 right-0 bottom-0 bg-blue-500 text-white text-center py-1 text-sm rounded-b-lg">
                        {selectedGesture.name}
                      </div>
                    )}

                    {selectedEmotion && (
                      <div className="absolute left-0 right-0 top-4 text-center">
                        <div className="text-3xl">
                          {typeof selectedEmotion.icon === "string"
                            ? selectedEmotion.icon
                            : selectedEmotion.icon}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Camera Views */}
              <div className="w-1/3 p-3 bg-white shadow rounded flex flex-col">
                <h3 className="font-medium mb-3">Camera Views</h3>
                <div className="grid grid-cols-2 gap-2 mb-auto">
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Front View
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Side View
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Face Close-up
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Full Body
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="mt-3 p-2 bg-gray-100 rounded">
                  <div className="flex justify-center space-x-3 mb-2">
                    <button className="p-1.5 border rounded hover:bg-gray-50">
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-1.5 border rounded hover:bg-gray-50">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="text-center text-sm">
                    00:00:02.500 / 00:00:05.000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarGestureEmotionUI;
