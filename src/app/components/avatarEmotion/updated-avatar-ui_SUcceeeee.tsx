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
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

const AvatarGestureEmotionUI = () => {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [recentEmotion, setRecentEmotion] = useState(null); // Track the most recent emotion
  const [recentGesture, setRecentGesture] = useState(null); // Track the most recent gesture
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("gestures");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState({
    front: null,
    back: null,
    side: null,
    close: null,
  });
  const [isGestureProcessing, setIsGestureProcessing] = useState(false);
  const [isEmotionProcessing, setIsEmotionProcessing] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [regenerateViewType, setRegenerateViewType] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [gestures, setGestures] = useState([]);
  const [emotions, setEmotions] = useState([]);

  const getUserEmail = () => {
    if (typeof window !== "undefined" && localStorage.getItem("userEmail")) {
      return localStorage.getItem("userEmail");
    }
    return "default@example.com";
  };

  const emotionCategories = [
    "All",
    "Positive",
    "Negative",
    "Neutral",
    "Reaction",
  ];
  const gestureCategories = [
    "All",
    "Greeting",
    "Reaction",
    "Direction",
    "Contemplative",
    "Presentation",
    "Stance",
    "Action",
  ];

  useEffect(() => {
    const fetchGesturesAndEmotions = async () => {
      try {
        const gesturesData = [
          {
            _id: "67ecb062a3754ed719f5ceb7",
            name: "wave",
            description: "A greeting or goodbye hand wave",
            emoji: "👋",
          },
          {
            _id: "67ecb062a3754ed719f5ceb8",
            name: "point",
            description: "Pointing with the index finger",
            emoji: "☝️",
          },
          {
            _id: "67ecb062a3754ed719f5ceb9",
            name: "clap",
            description: "Applauding by clapping hands",
            emoji: "👏",
          },
          {
            _id: "67ecb063a3754ed719f5ceba",
            name: "thumbs up",
            description: "Approval or agreement",
            emoji: "👍",
          },
          {
            _id: "67ecb063a3754ed719f5cebb",
            name: "handshake",
            description: "Shaking hands as a greeting",
            emoji: "🤝",
          },
          {
            _id: "67ecb063a3754ed719f5cebc",
            name: "thinking",
            description: "A thoughtful gesture",
            emoji: "🤔",
          },
          {
            _id: "67ecb063a3754ed719f5cebd",
            name: "explain",
            description: "Hand movements to explain something",
            emoji: "🗣️",
          },
          {
            _id: "67ecb063a3754ed719f5cebe",
            name: "arms crossed",
            description: "Crossing arms in confidence or defiance",
            emoji: "🙅",
          },
          {
            _id: "67ecb063a3754ed719f5cebf",
            name: "check watch",
            description: "Looking at the wristwatch",
            emoji: "⌚",
          },
          {
            _id: "67ecb064a3754ed719f5cec0",
            name: "nodding",
            description: "Nodding in agreement",
            emoji: "🙆",
          },
          {
            _id: "67ecb064a3754ed719f5cec1",
            name: "shrug",
            description: "Indicating uncertainty or indifference",
            emoji: "🤷",
          },
          {
            _id: "67ecb064a3754ed719f5cec2",
            name: "head tilt",
            description: "Tilting head in curiosity or confusion",
            emoji: "🤨",
          },
        ];

        const emotionsData = [
          {
            _id: "67ecb0e7a3754ed719f5cec3",
            name: "Happy",
            description: "A feeling of joy and positivity",
            emoji: "😊",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec4",
            name: "Sad",
            description: "A feeling of sorrow or unhappiness",
            emoji: "😢",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec5",
            name: "Surprised",
            description: "A sudden reaction of amazement or shock",
            emoji: "😲",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec6",
            name: "Angry",
            description: "A strong feeling of displeasure or rage",
            emoji: "😠",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec7",
            name: "Neutral",
            description: "A calm and indifferent expression",
            emoji: "😐",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec8",
            name: "Excited",
            description: "A high-energy feeling of enthusiasm",
            emoji: "😃",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec9",
            name: "Confused",
            description: "Uncertainty or lack of understanding",
            emoji: "😕",
          },
          {
            _id: "67ecb0e8a3754ed719f5ceca",
            name: "Concerned",
            description: "A feeling of worry or care",
            emoji: "😟",
          },
          {
            _id: "67ecb0e8a3754ed719f5cecb",
            name: "Confident",
            description: "A strong belief in oneself",
            emoji: "😎",
          },
          {
            _id: "67ecb0e8a3754ed719f5cecc",
            name: "Thoughtful",
            description: "A pensive or reflective mood",
            emoji: "🤔",
          },
        ];

        setGestures(
          gesturesData.map((gesture, index) => ({
            id: index + 1,
            name: gesture.name,
            thumbnail: gesture.emoji,
            category: "General",
            duration: 2.0,
          }))
        );

        setEmotions(
          emotionsData.map((emotion, index) => ({
            id: index + 1,
            name: emotion.name,
            intensity: 50,
            icon: emotion.emoji,
            category: "General",
          }))
        );
      } catch (error) {
        console.error("Error fetching gestures or emotions:", error);
      }
    };

    fetchGesturesAndEmotions();
  }, []);

  useEffect(() => {
    const fetchCameraViews = async () => {
      if (!selectedAvatar) return;

      try {
        const email = getUserEmail();
        const response = await axios.get(
          `http://192.168.1.141:3001/avatarfx/getAvatarBaseCameraViews`,
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        const { cameraViews } = response.data || {};
        setGeneratedImages({
          front: cameraViews?.front?.src
            ? `http://192.168.1.141:3001${cameraViews.front.src}`
            : null,
          side: cameraViews?.side?.src
            ? `http://192.168.1.141:3001${cameraViews.side.src}`
            : null,
          back: cameraViews?.back?.src
            ? `http://192.168.1.141:3001${cameraViews.back.src}`
            : null,
          close: cameraViews?.close_up?.src
            ? `http://192.168.1.141:3001${cameraViews.close_up.src}`
            : null,
        });
      } catch (error) {
        console.error("Error fetching camera views:", error);
      }
    };

    fetchCameraViews();
  }, [selectedAvatar]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGestureSelect = (gesture) => {
    setSelectedGesture(gesture);
    setRecentGesture(gesture); // Update the most recent gesture
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setRecentEmotion(emotion); // Update the most recent emotion
  };



  const fetchAvatars = async (selectedStyle = "", searchName = "") => {
    try {
      const email = getUserEmail();

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
        // Option 1: Store image URL directly if available
        imgSrc: `http://192.168.1.141:3001${avatar.imgSrc}`.replace(
          /([^:]\/)\/+/g,
          "$1"
        ),
        name: avatar.name || `Avatar ${index + 1}`,
        style: avatar.style,
      }));

      return fetchedAvatars;
    } catch (error) {
      console.error("Error fetching avatars:", error);
      return [];
    }
  };

  const generateAvatarView = async () => {
    if (!selectedAvatar) {
      toast.error(`Please select an avatar before proceeding.`);
      return;
    }

    // Close the modal
    setIsModalOpen(false);

    // Set generating state to true to disable the button
    setIsGenerating(true);

    // Show loading alert
    toast.info("Generating your avatar. This may take a few seconds...");

    try {
      const email = getUserEmail();

      // Fetch current views from the API to ensure all views are included
      let currentViews = { front: null, side: null, back: null, close: null };
      try {
        const response = await axios.get(
          "http://192.168.1.141:3001/avatarfx/getAvatarViews",
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        const views = response.data?.cameraViews || {};
        currentViews = {
          front: views.front?.base64 || null,
          side: views.side?.base64 || null,
          back: views.back?.base64 || null,
          close: views.close_up?.base64 || null,
        };
      } catch (err) {
        console.warn("No existing views found or error fetching them:", err);
      }

      // Regenerate all views to ensure consistency
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data;
      const updatedViews = {
        front: views.front || currentViews.front,
        back: views.back || currentViews.back,
        side: views.side || currentViews.side,
        close: views.close || currentViews.close,
      };

      // Prepare payload for API
      const payload = {
        email,
        avatarID: selectedAvatar.id,
        cameraViews: {
          front: { base64: updatedViews.front },
          side: { base64: updatedViews.side },
          back: { base64: updatedViews.back },
          close_up: { base64: updatedViews.close },
        },
      };

      // Log payload for debugging
      console.log(
        "Payload being sent to API:",
        JSON.stringify(payload, null, 2)
      );

      // Send payload to API
      await axios.post(
        "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update state with the generated images
      setGeneratedImages(updatedViews);

      toast.success(`Emotion generation completed successfully!`);
    } catch (error) {
      console.error("Error generating emotion:", error);
      toast.error(`Failed to generate avatar view. Please try again.`);
    } finally {
      // Re-enable the button regardless of success or failure
      setIsGenerating(false);
    }
  };

  const convertToBase64 = async (imageUrl) => {
    if (!imageUrl) return null;
    
    // If already base64, return as is
    if (imageUrl.startsWith('data:image')) {
      return imageUrl;
    }
  
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  };
  
  const regenerateCameraView = async (view) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }
  
    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }
  
    setIsRegenerating(true);
    setGeneratedImages((prev) => ({ ...prev, [view]: "loading" }));
  
    const email = getUserEmail();
    const avatarID = selectedAvatar.id;
  
    try {
      // Step 1: First fetch the current views from the API
      let currentViews;
      try {
        const response = await axios.get(
          "http://192.168.1.141:3001/avatarfx/getAvatarViews",
          {
            params: { email, avatarID },
          }
        );
  
        // Extract existing views, ensuring we preserve the base64 data
        currentViews = {
          front: response.data?.cameraViews?.front?.base64 || null,
          side: response.data?.cameraViews?.side?.base64 || null,
          back: response.data?.cameraViews?.back?.base64 || null,
          close_up: response.data?.cameraViews?.close_up?.base64 || null,
        };
  
        // Convert any non-base64 images to base64
        currentViews = {
          front: await convertToBase64(currentViews.front),
          side: await convertToBase64(currentViews.side),
          back: await convertToBase64(currentViews.back),
          close_up: await convertToBase64(currentViews.close_up)
        };
  
      } catch (err) {
        console.warn("Error fetching current views:", err);
        // If we can't fetch current views, use what's in the state and convert to base64
        currentViews = {
          front: await convertToBase64(generatedImages.front),
          side: await convertToBase64(generatedImages.side),
          back: await convertToBase64(generatedImages.back),
          close_up: await convertToBase64(generatedImages.close)
        };
      }
  
      // Step 2: Generate new image for the selected view
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));
  
      const regenerateResponse = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      const newGeneratedImage = regenerateResponse.data?.views?.[view];
      if (!newGeneratedImage) {
        throw new Error(`Failed to generate new image for ${view} view`);
      }
  
      // Convert new generated image to base64 if needed
      const newGeneratedBase64 = await convertToBase64(newGeneratedImage);
  
      // Step 3: Create updated views object with the new image
      const updatedViews = {
        ...currentViews,
        [view === "close" ? "close_up" : view]: newGeneratedBase64,
      };
  
      // Step 4: Send all views back to the API
      const payload = {
        email,
        avatarID,
        cameraViews: {
          front: { base64: updatedViews.front },
          side: { base64: updatedViews.side },
          back: { base64: updatedViews.back },
          close_up: { base64: updatedViews.close_up },
        },
      };
  
      // Send the complete payload to the API
      await axios.post(
        "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Step 5: Update local state with new images
      setGeneratedImages({
        front: updatedViews.front,
        side: updatedViews.side,
        back: updatedViews.back,
        close: updatedViews.close_up, // Note: we map close_up to close in the state
      });
  
      toast.success(`${view} view regenerated and saved successfully!`);
    } catch (err) {
      console.error("Regeneration failed:", err);
      toast.error(`Error regenerating ${view}: ${err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const regenerateEmotion = async (view, emotionName) => {
    if (!selectedAvatar) {
      toast.error(`Please select an avatar before proceeding.`);
      console.error("No avatar selected");
      return;
    }

    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }

    setIsRegenerating(true); // Disable other regenerate buttons
    setGeneratedImages((prev) => ({
      ...prev,
      [view]: "loading",
    }));

    toast.info(`Regenerating ${view} view with emotion ${emotionName}...`);

    try {
      const email = getUserEmail();

      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));
      formData.append("emotion", emotionName);

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/emotions",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data || {};
      const updatedImage = views?.[view] || null;

      if (updatedImage) {
        // Update only the regenerated view while keeping other views
        const newGeneratedImages = {
          ...generatedImages,
          [view]: updatedImage,
        };

        setGeneratedImages(newGeneratedImages);

        // Create payload with ALL camera views, not just the regenerated one
        const payload = {
          email,
          avatarID: selectedAvatar.id,
          cameraViews: {
            front: { base64: newGeneratedImages.front },
            side: { base64: newGeneratedImages.side },
            back: { base64: newGeneratedImages.back },
            close_up: { base64: newGeneratedImages.close },
          },
        };

        // Send ALL views to API
        await axios.post(
          "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        toast.success(
          `${view} view regenerated with emotion ${emotionName} and all views saved successfully!`
        );
      } else {
        toast.info(
          `${view} view regenerated with emotion ${emotionName}, but no new image returned.`
        );
      }
    } catch (error) {
      console.error(`Error regenerating ${view} view with emotion:`, error);
      toast.error(
        `Failed to regenerate ${view} view with emotion ${emotionName}. Please try again.`
      );
    } finally {
      setIsRegenerating(false); // Re-enable other regenerate buttons
      setGeneratedImages((prev) => ({
        ...prev,
        [view]: prev[view] !== "loading" ? prev[view] : null,
      }));
    }
  };

  const regenerateGesture = async (view, gestureName) => {
    if (!selectedAvatar) {
      toast.error(`Please select an avatar before proceeding.`);
      console.error("No avatar selected");
      return;
    }

    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }

    setIsRegenerating(true); // Disable other regenerate buttons
    setGeneratedImages((prev) => ({
      ...prev,
      [view]: "loading",
    }));

    toast.info(`Regenerating ${view} view with gesture ${gestureName}...`);

    try {
      const email = getUserEmail();

      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));
      formData.append("gesture", gestureName);

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/gesture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data || {};
      const updatedImage = views?.[view] || null;

      if (updatedImage) {
        // Update only the regenerated view while keeping other views
        const newGeneratedImages = {
          ...generatedImages,
          [view]: updatedImage,
        };

        setGeneratedImages(newGeneratedImages);

        // Create payload with ALL camera views, not just the regenerated one
        const payload = {
          email,
          avatarID: selectedAvatar.id,
          cameraViews: {
            front: { base64: newGeneratedImages.front },
            side: { base64: newGeneratedImages.side },
            back: { base64: newGeneratedImages.back },
            close_up: { base64: newGeneratedImages.close },
          },
        };

        // Send ALL views to API
        await axios.post(
          "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        toast.success(
          `${view} view regenerated with gesture ${gestureName} and all views saved successfully!`
        );
      } else {
        toast.info(
          `${view} view regenerated with gesture ${gestureName}, but no new image returned.`
        );
      }
    } catch (error) {
      console.error(`Error regenerating ${view} view with gesture:`, error);
      toast.error(
        `Failed to regenerate ${view} view with gesture ${gestureName}. Please try again.`
      );
    } finally {
      setIsRegenerating(false); // Re-enable other regenerate buttons
      setGeneratedImages((prev) => ({
        ...prev,
        [view]: prev[view] !== "loading" ? prev[view] : null,
      }));
    }
  };

  const generateEmotionView = async (emotion) => {
    if (!selectedAvatar || isEmotionProcessing) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    setIsEmotionProcessing(true); // Disable button

    // Show loading alert
    toast.info(
      <div className="flex items-center">
        <RefreshCw className="animate-spin mr-2" />
        Applying {emotion.name} emotion to the avatar...
      </div>
    );

    try {
      // Send the file path, emotion, and views to the API
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc); // Use file path instead of base64
      formData.append("emotion", emotion.name);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/emotions",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Emotion application response:", response.data);

      // Update state with the generated images
      const { views } = response.data;
      setGeneratedImages({
        front: views.front || null,
        back: views.back || null,
        side: views.side || null,
        close: views.close || null,
      });

      toast.success(`${emotion.name} emotion applied successfully!`);
    } catch (error) {
      console.error("Error applying emotion:", error);
      toast.error(`Failed to apply ${emotion.name} emotion. Please try again`);
    } finally {
      setIsEmotionProcessing(false); // Re-enable button
    }
  };

  const generateGestureView = async (gesture) => {
    if (!selectedAvatar || isGestureProcessing) {
      toast.error(`Please select an avatar before proceeding`);
      return;
    }

    setIsGestureProcessing(true); // Disable button

    // Show loading alert
    toast.info(
      <div className="flex items-center">
        <RefreshCw className="animate-spin mr-2" />
        Applying {gesture.name} gesture to the avatar...
      </div>
    );

    try {
      // Send the file path, gesture, and views to the API
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc); // Use file path instead of base64
      formData.append("gesture", gesture.name);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/gesture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Gesture application response:", response.data);

      // Update state with the generated images
      const { views } = response.data;
      setGeneratedImages({
        front: views.front || null,
        back: views.back || null,
        side: views.side || null,
        close: views.close || null,
      });

      toast.success(`${gesture.name} gesture applied successfully!`);
    } catch (error) {
      console.error("Error applying gesture:", error);
      toast.error(`Failed to apply ${gesture.name} gesture. Please try again.`);
    } finally {
      setIsGestureProcessing(false); // Re-enable button
    }
  };

  const debugAvatarStorage = async () => {
    if (!selectedAvatar?.id) return;

    try {
      const email = getUserEmail();

      // Check what's currently stored in the API
      const response = await axios.get(
        `http://192.168.1.141:3001/avatarfx/getAvatarViews`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      console.log("Currently stored avatar views:", response.data);

      // Check what's in your current state
      console.log("Current state images:", generatedImages);
    } catch (error) {
      console.error("Debug error:", error);
    }
  };

  useEffect(() => {
    const loadInitialViews = async () => {
      if (!selectedAvatar?.id) return;

      try {
        const email = getUserEmail();

        const response = await axios.get(
          `http://192.168.1.141:3001/avatarfx/getAvatarViews`,
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        if (response.data?.cameraViews) {
          const views = {
            front: response.data.cameraViews.front?.base64 || null,
            side: response.data.cameraViews.side?.base64 || null,
            back: response.data.cameraViews.back?.base64 || null,
            close: response.data.cameraViews.close_up?.base64 || null,
          };

          setGeneratedImages(views);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.warn("No initial views found for this avatar.");
        } else {
          console.error("Error loading initial views:", error);
        }
      }
    };

    loadInitialViews();
  }, [selectedAvatar?.id]);

  const handleRegenerateClick = (view) => {
    setRegenerateViewType(view);
    setIsRegenerateModalOpen(true);
  };

  const handleRegenerateOption = async (type) => {
    setIsRegenerateModalOpen(false);

    if (!regenerateViewType) {
      toast.error("Please select a camera view to regenerate.");
      return;
    }

    if (type === "camera") {
      await regenerateCameraView(regenerateViewType); // Regenerate the selected camera view
    } else if (type === "gesture") {
      // Use the currently selected gesture for regeneration
      if (selectedGesture) {
        await regenerateGesture(regenerateViewType, selectedGesture.name);
      } else {
        toast.error("Please select a gesture to regenerate.");
      }
    } else if (type === "emotion") {
      // Use the currently selected emotion for regeneration
      if (selectedEmotion) {
        await regenerateEmotion(regenerateViewType, selectedEmotion.name);
      } else {
        toast.error("Please select an emotion to regenerate.");
      }
    }
  };

  const fetchGeneratedImages = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      console.error("No avatar selected");
      return;
    }

    try {
      // Convert base64 image to a Blob
      const base64Image = selectedAvatar.imgSrc.split("base64,")[1];
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Create FormData and append the file and views
      const formData = new FormData();
      formData.append("file", blob, `${selectedAvatar.name || "avatar"}.png`);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      // Send the file and views to the API
      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Emotion generation response:", response.data);

      // Update state with the generated images
      const { generated_image: base64Img } = response.data;
      if (base64Img) {
        setGeneratedImages({
          front: `${base64Img}`, // Assuming the API returns one image for simplicity
          back: `${base64Img}`,
          side: `${base64Img}`,
          close: `${base64Img}`,
        });
      } else {
        toast.error("No image generated. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching generated images:", error);
      toast.error("Failed to fetch generated images. Please try again.");
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
      {/* Alert */}
      <ToastContainer
        postion="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Top Toolbar - Updated to match modal style */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <button className="p-2 border rounded-md hover:bg-gray-50 mr-2">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold text-[#9B25A7]">
            Avatar Gesture & Emotion Editor
          </h1>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Save size={16} />
          </button>
          <button className="p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors">
            Apply to Timeline
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-4">
        {/* Left Panel - Library - Updated to match modal style */}
        <div className="w-72 bg-white shadow rounded-lg mr-4 flex flex-col">
          {/* Library Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${
                activeTab === "gestures"
                  ? "bg-[#F4E3F8] text-[#9B25A7] font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("gestures")}
            >
              Gestures
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "emotions"
                  ? "bg-[#F4E3F8] text-[#9B25A7] font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("emotions")}
            >
              Emotions
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "sequences"
                  ? "bg-[#F4E3F8] text-[#9B25A7] font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("sequences")}
            >
              Sequences
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-3 border-b">
            <div className="flex mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white p-2 pl-8 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                />
                <Search
                  size={16}
                  className="absolute left-2.5 top-2.5 text-gray-400"
                />
              </div>
              <button className="bg-gray-200 px-3 rounded-r-md border border-gray-300 border-l-0">
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
                  className={`px-2 py-0.5 text-xs rounded-md ${
                    currentCategory === category
                      ? "bg-[#9B25A7] text-white"
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
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "gestures" && (
              <div className="grid grid-cols-2 gap-3">
                {filteredGestures.map((gesture) => (
                  <div
                    key={gesture.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedGesture?.id === gesture.id
                        ? "border-[#9B25A7] bg-[#F4E3F8]"
                        : "border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (selectedAvatar && !isGestureProcessing) {
                        handleGestureSelect(gesture);
                        generateGestureView(gesture);
                      }
                    }}
                  >
                    <div className="text-2xl text-center mb-2">
                      {gesture.thumbnail}
                    </div>
                    <div className="text-xs font-medium text-center truncate">
                      {gesture.name}
                    </div>
                    <div
                      className={`text-xs text-center flex items-center justify-center mt-1 ${
                        selectedGesture?.id === gesture.id
                          ? "text-[#9B25A7]"
                          : "text-gray-500"
                      }`}
                    >
                      <Clock size={10} className="mr-0.5" /> {gesture.duration}s
                    </div>
                    {isGestureProcessing &&
                      selectedGesture?.id === gesture.id && (
                        <div className="flex justify-center mt-2">
                          <RefreshCw
                            className="animate-spin text-[#9B25A7]"
                            size={16}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "emotions" && (
              <div className="grid grid-cols-2 gap-3">
                {filteredEmotions.map((emotion) => (
                  <div
                    key={emotion.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedEmotion?.id === emotion.id
                        ? "border-[#9B25A7] bg-[#F4E3F8]"
                        : "border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (selectedAvatar && !isEmotionProcessing) {
                        handleEmotionSelect(emotion);
                        generateEmotionView(emotion);
                      }
                    }}
                  >
                    <div className="text-2xl text-center mb-2">
                      {typeof emotion.icon === "string"
                        ? emotion.icon
                        : emotion.icon}
                    </div>
                    <div className="text-xs font-medium text-center truncate">
                      {emotion.name}
                    </div>
                    <div
                      className={`text-xs text-center mt-1 ${
                        selectedEmotion?.id === emotion.id
                          ? "text-[#9B25A7]"
                          : "text-gray-500"
                      }`}
                    >
                      Intensity: {emotion.intensity}%
                    </div>
                    {isEmotionProcessing &&
                      selectedEmotion?.id === emotion.id && (
                        <div className="flex justify-center mt-2">
                          <RefreshCw
                            className="animate-spin text-[#9B25A7]"
                            size={16}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "sequences" && (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50 transition-colors">
                  <div className="font-medium mb-2 flex items-center justify-between">
                    <span>Greeting Sequence</span>
                    <div className="text-xs text-gray-500">4.5s</div>
                  </div>
                  <div className="flex mb-2">
                    <div className="flex space-x-2 text-sm">
                      <span>👋</span>
                      <span>→</span>
                      <span>😃</span>
                      <span>→</span>
                      <span>🤝</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="p-1.5 bg-gray-200 rounded-md hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1.5 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50 transition-colors">
                  <div className="font-medium mb-2 flex items-center justify-between">
                    <span>Presentation Start</span>
                    <div className="text-xs text-gray-500">6.2s</div>
                  </div>
                  <div className="flex mb-2">
                    <div className="flex space-x-2 text-sm">
                      <span>🙌</span>
                      <span>→</span>
                      <span>😎</span>
                      <span>→</span>
                      <span>👉</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="p-1.5 bg-gray-200 rounded-md hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1.5 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50 transition-colors">
                  <div className="font-medium mb-2 flex items-center justify-between">
                    <span>Active Listening</span>
                    <div className="text-xs text-gray-500">3.8s</div>
                  </div>
                  <div className="flex mb-2">
                    <div className="flex space-x-2 text-sm">
                      <span>🙂</span>
                      <span>→</span>
                      <span>🤔</span>
                      <span>→</span>
                      <span>😌</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="p-1.5 bg-gray-200 rounded-md hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1.5 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create New - Updated to match modal style */}
          <div className="p-3 border-t">
            <button className="w-full flex items-center justify-center p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors">
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
          {/* Avatar Selection - Updated to match modal style */}
          <div className="p-4 bg-white shadow rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors disabled:bg-[#E3C5F0]"
                onClick={() => setIsModalOpen(true)}
              >
                Avatar Preview
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="w-full sm:w-auto bg-[#9B25A7] text-white text-sm py-2 px-4 rounded-md flex items-center gap-1 hover:bg-[#7A1C86] transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                onClick={generateAvatarView}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-1" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Generate Avatar View
                  </>
                )}
              </button>
              {/* <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Camera size={16} className="mr-1" /> Capture
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <RefreshCw size={16} className="mr-1" /> Reset
              </button> */}
            </div>
          </div>

          {/* Preview Area - Updated to match modal style */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 flex">
              {/* 3D Avatar Preview */}
              <div className="w-2/3 bg-white shadow rounded-lg flex items-center justify-center mr-4">
                <div className="relative p-4">
                  {/* Avatar placeholder */}
                  <div className="w-48 aspect-[9/16] rounded-lg relative flex items-center justify-center">
                    {selectedAvatar ? (
                      <img
                        src={selectedAvatar.imgSrc}
                        alt="Selected Avatar"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full min-w-[600px] max-w-4xl text-center text-gray-500 p-16 mx-auto">
                        <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-8">
                          <Plus size={48} className="text-gray-300" />
                        </div>
                        <p className="text-xl sm:text-2xl">
                          No Avatar Selected
                        </p>
                        <p className="text-lg mt-4 max-w-2xl mx-auto">
                          {avatars.length === 0
                            ? selectedStyle
                              ? `No avatars available in ${selectedStyle} style. Try selecting a different style or create a new avatar.`
                              : "No avatars exist in your collection. Start by creating your first avatar!"
                            : "Choose an avatar from the list or create a new one"}
                        </p>
                      </div>
                    )}

                    {/* Gesture/Emotion indicators */}
                    {selectedGesture && (
                      <div className="absolute left-0 right-0 bottom-0 bg-[#9B25A7] text-white text-center py-1 text-sm rounded-b-lg">
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
              <div className="w-1/3 p-4 bg-white shadow rounded-lg flex flex-col">
                <h3 className="font-medium mb-4 text-[#9B25A7]">
                  Camera Views
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-auto">
                  {["front", "side", "close", "back"].map((view) => (
                    <div
                      key={view}
                      className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-xs"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        {generatedImages[view] === "loading" ? (
                          <div className="flex items-center justify-center w-full h-full">
                            <div className="loader border-t-2 border-[#9B25A7] rounded-full w-6 h-6 animate-spin"></div>
                          </div>
                        ) : generatedImages[view] ? (
                          <>
                            <img
                              src={generatedImages[view]}
                              alt={`${view} View`}
                              className="w-5/6 h-5/6 object-contain rounded-lg mb-2"
                            />
                            <button
                              className="mt-2 px-2 py-1 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] text-xs"
                              onClick={() => handleRegenerateClick(view)}
                              disabled={isRegenerating} // Disable button if regeneration is in progress
                            >
                              Regenerate
                            </button>
                          </>
                        ) : (
                          `${view.charAt(0).toUpperCase() + view.slice(1)} View`
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Playback Controls */}
                <div className="mt-4 p-3 bg-[#F4E3F8] rounded-lg">
                  <div className="flex justify-center space-x-4 mb-2">
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      className="p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="text-center text-sm font-medium text-[#9B25A7]">
                    00:00:02.500 / 00:00:05.000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Original style kept for reference */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="md:col-span-7 md:border-b-0 p-4 sm:p-6 flex flex-col h-full">
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

      {isRegenerateModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg shadow-lg p-4 w-64">
            <h3 className="text-lg font-medium text-center mb-4">
              Choose Regenerate Option
            </h3>
            <div className="flex flex-col space-y-3">
              <button
                className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                onClick={() => handleRegenerateOption("camera")}
              >
                Camera View
              </button>
              <button
                className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                onClick={() => handleRegenerateOption("gesture")}
              >
                Gestures
              </button>
              <button
                className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                onClick={() => handleRegenerateOption("emotion")}
              >
                Emotions
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setIsRegenerateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGestureEmotionUI;
